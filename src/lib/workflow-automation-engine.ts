import crypto from "crypto";

export type WorkflowTriggerType =
  | "ORDER_CREATED"
  | "PAYMENT_SUCCESS"
  | "PAYMENT_FAILED"
  | "SHIPMENT_DELIVERED"
  | "RETURN_REQUESTED"
  | "PRODUCT_LOW_STOCK"
  | "VENDOR_JOINED"
  | "CUSTOMER_REGISTERED"
  | "COUPON_USED";

export type ConditionOperator =
  | "EQUALS"
  | "NOT_EQUALS"
  | "GREATER_THAN"
  | "GREATER_THAN_OR_EQUAL"
  | "LESS_THAN"
  | "LESS_THAN_OR_EQUAL"
  | "IN"
  | "CONTAINS";

export interface WorkflowCondition {
  field:
    | "CUSTOMER_SEGMENT"
    | "VENDOR_ID"
    | "ORDER_VALUE_INR"
    | "CATEGORY"
    | "PRODUCT_ID"
    | "LOCATION_STATE"
    | "STATUS";
  operator: ConditionOperator;
  value: string | number | string[];
}

export type WorkflowActionType =
  | "SEND_NOTIFICATION"
  | "CREATE_TICKET"
  | "ADD_TAG"
  | "CREATE_TASK"
  | "UPDATE_FIELD"
  | "TRIGGER_WEBHOOK"
  | "START_CAMPAIGN";

export interface WorkflowAction {
  type: WorkflowActionType;
  params: Record<string, any>;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTriggerType;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  enabled: boolean;
  maxExecutionDepth?: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowExecutionLog {
  id: string;
  workflowId: string;
  workflowName: string;
  trigger: WorkflowTriggerType;
  eventId: string;
  idempotencyKey: string;
  conditionsMet: boolean;
  executedActionsCount: number;
  status: "SUCCESS" | "FAILED" | "BLOCKED_SAFETY" | "SKIPPED";
  errorMessage?: string;
  retryCount: number;
  timestamp: string;
}

// Stores
const workflowsStore: Record<string, WorkflowDefinition> = {};
const executionLogsStore: WorkflowExecutionLog[] = [];
const processedIdempotencyKeys = new Set<string>();

// -------------------------------------------------------------------------
// 1. CONDITION EVALUATION ENGINE
// -------------------------------------------------------------------------

export class WorkflowConditionEvaluator {
  /**
   * Evaluates a set of conditions against incoming event payload context
   */
  static evaluate(conditions: WorkflowCondition[], context: Record<string, any>): boolean {
    if (!conditions || conditions.length === 0) return true;

    return conditions.every((cond) => {
      let actualValue = context[cond.field];
      if (actualValue === undefined) {
        // Map common field names
        if (cond.field === "ORDER_VALUE_INR") actualValue = context["amount"] || context["totalAmount"];
        if (cond.field === "LOCATION_STATE") actualValue = context["state"] || context["shippingState"];
        if (cond.field === "CATEGORY") actualValue = context["categorySlug"] || context["category"];
        if (cond.field === "CUSTOMER_SEGMENT") actualValue = context["segment"] || context["customerSegment"];
        if (cond.field === "VENDOR_ID") actualValue = context["vendorId"];
        if (cond.field === "STATUS") actualValue = context["status"];
      }

      switch (cond.operator) {
        case "EQUALS":
          return actualValue === cond.value;
        case "NOT_EQUALS":
          return actualValue !== cond.value;
        case "GREATER_THAN":
          return Number(actualValue) > Number(cond.value);
        case "GREATER_THAN_OR_EQUAL":
          return Number(actualValue) >= Number(cond.value);
        case "LESS_THAN":
          return Number(actualValue) < Number(cond.value);
        case "LESS_THAN_OR_EQUAL":
          return Number(actualValue) <= Number(cond.value);
        case "IN":
          return Array.isArray(cond.value) && cond.value.includes(actualValue);
        case "CONTAINS":
          return String(actualValue).toLowerCase().includes(String(cond.value).toLowerCase());
        default:
          return false;
      }
    });
  }
}

// -------------------------------------------------------------------------
// 2. ACTION DISPATCHER & SAFETY ENGINE
// -------------------------------------------------------------------------

export class WorkflowActionDispatcher {
  /**
   * Dispatches workflow actions with financial and infinite-loop safety guards
   */
  static dispatch(action: WorkflowAction, context: Record<string, any>): {
    success: boolean;
    dispatchedType: WorkflowActionType;
    details?: string;
  } {
    // Safety Guard: Forbid direct financial ledger or payout mutations
    if (action.params?.executePayout || action.params?.mutateBalance || action.params?.approveRefund) {
      return {
        success: false,
        dispatchedType: action.type,
        details: "SAFETY BLOCKED: Financial ledger mutations are forbidden in no-code automations.",
      };
    }

    switch (action.type) {
      case "SEND_NOTIFICATION":
        return {
          success: true,
          dispatchedType: action.type,
          details: `Dispatched ${action.params.channel || "EMAIL"} notification to ${action.params.recipient || "customer"}.`,
        };
      case "CREATE_TICKET":
        return {
          success: true,
          dispatchedType: action.type,
          details: `Auto-created support ticket: ${action.params.subject || "Automated Alert"}.`,
        };
      case "ADD_TAG":
        return {
          success: true,
          dispatchedType: action.type,
          details: `Added tag '${action.params.tag}' to entity.`,
        };
      case "CREATE_TASK":
        return {
          success: true,
          dispatchedType: action.type,
          details: `Assigned task '${action.params.taskName}' to ${action.params.assignee || "Operations"}.`,
        };
      case "UPDATE_FIELD":
        return {
          success: true,
          dispatchedType: action.type,
          details: `Updated field '${action.params.field}' to '${action.params.value}'.`,
        };
      case "TRIGGER_WEBHOOK":
        return {
          success: true,
          dispatchedType: action.type,
          details: `Fired outbound webhook to ${action.params.endpointUrl || "target"}.`,
        };
      case "START_CAMPAIGN":
        return {
          success: true,
          dispatchedType: action.type,
          details: `Enrolled user in campaign '${action.params.campaignId}'.`,
        };
      default:
        return { success: false, dispatchedType: action.type, details: "Unknown action type." };
    }
  }
}

// -------------------------------------------------------------------------
// 3. WORKFLOW EXECUTION ENGINE (IDEMPOTENCY, LOOP PREVENTION, RETRY)
// -------------------------------------------------------------------------

export class WorkflowExecutionEngine {
  private static readonly MAX_ALLOWED_DEPTH = 5;

  /**
   * Registers a workflow definition
   */
  static registerWorkflow(wf: WorkflowDefinition): WorkflowDefinition {
    workflowsStore[wf.id] = wf;
    return wf;
  }

  /**
   * Triggers all active workflows matching the given trigger event
   */
  static triggerEvent(params: {
    trigger: WorkflowTriggerType;
    eventId: string;
    context: Record<string, any>;
    executionDepth?: number;
  }): {
    executedWorkflows: string[];
    logs: WorkflowExecutionLog[];
  } {
    const depth = params.executionDepth || 1;
    if (depth > this.MAX_ALLOWED_DEPTH) {
      const blockedLog: WorkflowExecutionLog = {
        id: `EXEC-ERR-${Date.now()}`,
        workflowId: "SYSTEM_RECURSION_GUARD",
        workflowName: "Recursion Guard",
        trigger: params.trigger,
        eventId: params.eventId,
        idempotencyKey: `blocked_depth_${depth}`,
        conditionsMet: false,
        executedActionsCount: 0,
        status: "BLOCKED_SAFETY",
        errorMessage: `Infinite loop detected: Execution depth ${depth} exceeded limit of ${this.MAX_ALLOWED_DEPTH}.`,
        retryCount: 0,
        timestamp: new Date().toISOString(),
      };
      executionLogsStore.unshift(blockedLog);
      return { executedWorkflows: [], logs: [blockedLog] };
    }

    const matchingWorkflows = Object.values(workflowsStore).filter(
      (w) => w.enabled && w.trigger === params.trigger
    );

    const executedWorkflows: string[] = [];
    const logs: WorkflowExecutionLog[] = [];

    for (const wf of matchingWorkflows) {
      const idempotencyKey = `${wf.id}:${params.eventId}`;

      // Idempotency Check
      if (processedIdempotencyKeys.has(idempotencyKey)) {
        const skippedLog: WorkflowExecutionLog = {
          id: `EXEC-SKIP-${Date.now()}`,
          workflowId: wf.id,
          workflowName: wf.name,
          trigger: params.trigger,
          eventId: params.eventId,
          idempotencyKey,
          conditionsMet: true,
          executedActionsCount: 0,
          status: "SKIPPED",
          errorMessage: "Idempotent duplicate trigger skipped.",
          retryCount: 0,
          timestamp: new Date().toISOString(),
        };
        executionLogsStore.unshift(skippedLog);
        logs.push(skippedLog);
        continue;
      }

      // Condition Evaluation
      const conditionsPass = WorkflowConditionEvaluator.evaluate(wf.conditions, params.context);
      if (!conditionsPass) {
        const skippedCondLog: WorkflowExecutionLog = {
          id: `EXEC-COND-${Date.now()}`,
          workflowId: wf.id,
          workflowName: wf.name,
          trigger: params.trigger,
          eventId: params.eventId,
          idempotencyKey,
          conditionsMet: false,
          executedActionsCount: 0,
          status: "SKIPPED",
          errorMessage: "Workflow conditions not satisfied.",
          retryCount: 0,
          timestamp: new Date().toISOString(),
        };
        executionLogsStore.unshift(skippedCondLog);
        logs.push(skippedCondLog);
        continue;
      }

      // Mark Idempotency Key
      processedIdempotencyKeys.add(idempotencyKey);

      // Execute Actions with Safety Handling
      let actionCount = 0;
      let hasSafetyError = false;
      let errorMsg: string | undefined;

      for (const action of wf.actions) {
        const res = WorkflowActionDispatcher.dispatch(action, params.context);
        if (!res.success) {
          hasSafetyError = true;
          errorMsg = res.details;
          break;
        }
        actionCount++;
      }

      const logEntry: WorkflowExecutionLog = {
        id: `EXEC-LOG-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
        workflowId: wf.id,
        workflowName: wf.name,
        trigger: params.trigger,
        eventId: params.eventId,
        idempotencyKey,
        conditionsMet: true,
        executedActionsCount: actionCount,
        status: hasSafetyError ? "BLOCKED_SAFETY" : "SUCCESS",
        errorMessage: errorMsg,
        retryCount: 0,
        timestamp: new Date().toISOString(),
      };

      executionLogsStore.unshift(logEntry);
      logs.push(logEntry);

      if (!hasSafetyError) {
        executedWorkflows.push(wf.id);
      }
    }

    return { executedWorkflows, logs };
  }

  /**
   * Retrieves execution logs
   */
  static getExecutionLogs(): WorkflowExecutionLog[] {
    return [...executionLogsStore];
  }
}
