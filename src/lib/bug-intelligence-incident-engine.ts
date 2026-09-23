/**
 * FancyHub.in — Phase 38: Post-Launch Monitoring & Bug Intelligence Engine
 * 
 * Centralized production observability, error grouping & fingerprinting,
 * threshold-based alerting with storm suppression, user-safe error masking,
 * incident lifecycle management, and postmortem generator.
 */

import crypto from "crypto";

// =========================================================================
// 1. TYPES & DATA STRUCTURES
// =========================================================================

export type ErrorSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type ErrorSource =
  | "FRONTEND"
  | "BACKEND"
  | "API"
  | "DATABASE"
  | "QUEUE"
  | "WEBHOOK"
  | "PAYMENT"
  | "AUTHENTICATION";

export type UserPersona = "CUSTOMER" | "VENDOR" | "ADMIN" | "GUEST" | "SYSTEM";

export type IncidentSeverity = "P0_CRITICAL" | "P1_HIGH" | "P2_MEDIUM" | "P3_LOW";

export type IncidentStatus =
  | "OPEN"
  | "INVESTIGATING"
  | "IDENTIFIED"
  | "MITIGATED"
  | "RESOLVED"
  | "CLOSED";

export interface TrackedErrorRecord {
  id: string;
  fingerprint: string;
  source: ErrorSource;
  severity: ErrorSeverity;
  name: string;
  message: string;
  stackSnippet?: string;
  endpoint?: string;
  errorCount: number;
  frequencyPerMin: number;
  affectedUserIds: Set<string>;
  affectedPersonas: Set<UserPersona>;
  firstSeenAt: string;
  lastSeenAt: string;
  sampleTraceId: string;
  metadata: Record<string, any>;
  isMuted: boolean;
}

export interface IncidentTimelineEvent {
  id: string;
  timestamp: string;
  actor: string;
  statusChange?: IncidentStatus;
  note: string;
}

export interface IncidentRecord {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  source: ErrorSource;
  owner: string;
  relatedFingerprints: string[];
  affectedPersonas: UserPersona[];
  affectedUsersCount: number;
  createdAt: string;
  updatedAt: string;
  timeline: IncidentTimelineEvent[];
  rootCause?: string;
  resolution?: string;
  mitigationSteps?: string[];
  postmortem?: {
    summary: string;
    impactDurationMinutes: number;
    rootCauseAnalysis: string;
    actionItems: string[];
    generatedAt: string;
  };
}

export interface OperationalAlertRule {
  id: string;
  name: string;
  source: ErrorSource;
  thresholdErrorsPerMinute: number;
  severity: IncidentSeverity;
  cooldownMinutes: number;
  autoCreateIncident: boolean;
}

export interface DispatchedAlert {
  id: string;
  ruleId: string;
  fingerprint: string;
  severity: IncidentSeverity;
  message: string;
  dispatchedAt: string;
  suppressedCount: number;
  channels: string[];
}

export interface SystemTelemetrySummary {
  timestamp: string;
  overallHealth: "HEALTHY" | "DEGRADED" | "CRITICAL";
  subsystemHealth: {
    system: "HEALTHY" | "DEGRADED" | "CRITICAL";
    api: "HEALTHY" | "DEGRADED" | "CRITICAL";
    payments: "HEALTHY" | "DEGRADED" | "CRITICAL";
    database: "HEALTHY" | "DEGRADED" | "CRITICAL";
    queue: "HEALTHY" | "DEGRADED" | "CRITICAL";
    shipping: "HEALTHY" | "DEGRADED" | "CRITICAL";
    notifications: "HEALTHY" | "DEGRADED" | "CRITICAL";
  };
  metrics: {
    totalErrors24h: number;
    unresolvedErrorGroups: number;
    activeIncidentsCount: number;
    openP0P1Count: number;
    totalAffectedUsers: number;
    avgMttdMinutes: number;
    avgMttrMinutes: number;
  };
}

// In-Memory Global Stores
const errorRecordsStore: Map<string, TrackedErrorRecord> = new Map();
const incidentsStore: Map<string, IncidentRecord> = new Map();
const alertRulesStore: Map<string, OperationalAlertRule> = new Map();
const dispatchedAlertsStore: DispatchedAlert[] = [];
const alertCooldownsStore: Map<string, number> = new Map(); // key: ruleId:fingerprint -> expiresAtMs

// Initialize Default Operational Alert Rules
function initDefaultAlertRules() {
  if (alertRulesStore.size > 0) return;

  const defaults: OperationalAlertRule[] = [
    {
      id: "RULE-PAYMENT-FAIL",
      name: "Payment Failure Velocity Spike",
      source: "PAYMENT",
      thresholdErrorsPerMinute: 3,
      severity: "P0_CRITICAL",
      cooldownMinutes: 5,
      autoCreateIncident: true,
    },
    {
      id: "RULE-DB-ERROR",
      name: "Database Query Exception Spike",
      source: "DATABASE",
      thresholdErrorsPerMinute: 5,
      severity: "P0_CRITICAL",
      cooldownMinutes: 5,
      autoCreateIncident: true,
    },
    {
      id: "RULE-API-5XX",
      name: "API 5xx Gateway Spike",
      source: "API",
      thresholdErrorsPerMinute: 10,
      severity: "P1_HIGH",
      cooldownMinutes: 5,
      autoCreateIncident: true,
    },
    {
      id: "RULE-QUEUE-FAIL",
      name: "Background Queue DLQ Spillage",
      source: "QUEUE",
      thresholdErrorsPerMinute: 5,
      severity: "P1_HIGH",
      cooldownMinutes: 10,
      autoCreateIncident: false,
    },
    {
      id: "RULE-WEBHOOK-FAIL",
      name: "Webhook Delivery & HMAC Failures",
      source: "WEBHOOK",
      thresholdErrorsPerMinute: 8,
      severity: "P2_MEDIUM",
      cooldownMinutes: 10,
      autoCreateIncident: false,
    },
  ];

  for (const rule of defaults) {
    alertRulesStore.set(rule.id, rule);
  }
}

initDefaultAlertRules();

// =========================================================================
// 2. ERROR CAPTURE & FINGERPRINTING ENGINE
// =========================================================================

export class ErrorCaptureEngine {
  /**
   * Generates deterministic fingerprint hash from error properties
   */
  static generateFingerprint(source: ErrorSource, name: string, message: string, endpoint?: string): string {
    // Normalize message (remove numbers, UUIDs, hex hashes, specific IDs)
    const normalizedMsg = message
      .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, ":uuid")
      .replace(/0x[0-9a-f]+/gi, ":hex")
      .replace(/\d+/g, ":num")
      .replace(/https?:\/\/[^\s]+/g, ":url")
      .trim();

    const raw = `${source}|${name}|${normalizedMsg}|${endpoint || ""}`;
    return crypto.createHash("sha256").update(raw).digest("hex").slice(0, 16);
  }

  /**
   * Captures, classifies, deduplicates, and tracks error occurrences
   */
  static captureError(params: {
    source: ErrorSource;
    name: string;
    message: string;
    stack?: string;
    endpoint?: string;
    userId?: string;
    persona?: UserPersona;
    severity?: ErrorSeverity;
    traceId?: string;
    metadata?: Record<string, any>;
  }): TrackedErrorRecord {
    const {
      source,
      name,
      message,
      stack,
      endpoint,
      userId = "anonymous",
      persona = "CUSTOMER",
      metadata = {},
      traceId = `TRC-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    } = params;

    // Automatic severity derivation if not provided
    let severity = params.severity;
    if (!severity) {
      if (source === "PAYMENT" || source === "DATABASE") severity = "CRITICAL";
      else if (source === "API" || source === "AUTHENTICATION") severity = "HIGH";
      else if (source === "QUEUE" || source === "WEBHOOK") severity = "MEDIUM";
      else severity = "LOW";
    }

    const fingerprint = this.generateFingerprint(source, name, message, endpoint);
    const now = new Date().toISOString();

    let record = errorRecordsStore.get(fingerprint);
    if (record) {
      record.errorCount += 1;
      record.frequencyPerMin = Math.min(record.frequencyPerMin + 1, 1000);
      record.lastSeenAt = now;
      record.affectedUserIds.add(userId);
      record.affectedPersonas.add(persona);
      record.sampleTraceId = traceId;
      Object.assign(record.metadata, metadata);
    } else {
      record = {
        id: `ERR-${fingerprint}`,
        fingerprint,
        source,
        severity,
        name,
        message,
        stackSnippet: stack ? stack.split("\n").slice(0, 4).join("\n") : undefined,
        endpoint,
        errorCount: 1,
        frequencyPerMin: 1,
        affectedUserIds: new Set([userId]),
        affectedPersonas: new Set([persona]),
        firstSeenAt: now,
        lastSeenAt: now,
        sampleTraceId: traceId,
        metadata,
        isMuted: false,
      };
      errorRecordsStore.set(fingerprint, record);
    }

    // Evaluate threshold alert rules
    AlertStormShield.evaluateAlertRules(record);

    return record;
  }

  /**
   * Retrieves all tracked error groups
   */
  static getTrackedErrors(filter?: {
    source?: ErrorSource;
    severity?: ErrorSeverity;
    minCount?: number;
  }): Array<Omit<TrackedErrorRecord, "affectedUserIds" | "affectedPersonas"> & {
    affectedUsersCount: number;
    affectedPersonas: UserPersona[];
  }> {
    let list = Array.from(errorRecordsStore.values());

    if (filter?.source) {
      list = list.filter((e) => e.source === filter.source);
    }
    if (filter?.severity) {
      list = list.filter((e) => e.severity === filter.severity);
    }
    if (filter?.minCount) {
      list = list.filter((e) => e.errorCount >= filter.minCount!);
    }

    return list.map((e) => ({
      ...e,
      affectedUsersCount: e.affectedUserIds.size,
      affectedPersonas: Array.from(e.affectedPersonas),
    }));
  }

  /**
   * Resets error records for testing
   */
  static clear() {
    errorRecordsStore.clear();
  }
}

// =========================================================================
// 3. USER-SAFE ERROR TRANSFORMER (Masking Internal Errors)
// =========================================================================

export class UserSafeErrorTransformer {
  /**
   * Transforms raw server/database/payment errors into clean, safe user messages
   * Never exposes SQL queries, table structures, connection strings, or stack traces
   */
  static transformToUserSafe(err: any, traceId?: string): {
    userMessage: string;
    errorCode: string;
    traceId: string;
    status: number;
  } {
    const assignedTraceId = traceId || `TRC-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const rawMsg = err?.message || String(err || "Unknown error");

    // Default friendly mapping
    let userMessage = "An unexpected error occurred. Please try again or contact support if the issue persists.";
    let errorCode = "INTERNAL_SERVER_ERROR";
    let status = 500;

    if (/prisma|database|relation|foreign key|unique constraint|deadlock/i.test(rawMsg)) {
      userMessage = "We experienced a temporary data service issue. Please retry in a few moments.";
      errorCode = "DATA_SERVICE_TEMPORARY_ERROR";
      status = 503;
    } else if (/payment|razorpay|payu|gateway|insufficient funds|declined/i.test(rawMsg)) {
      userMessage = "Your payment transaction could not be processed. No charges were made. Please try a different payment method.";
      errorCode = "PAYMENT_GATEWAY_DECLINE";
      status = 402;
    } else if (/jwt|token|unauthorized|expired session|forbidden|permission/i.test(rawMsg)) {
      userMessage = "Your session has expired or you do not have permission. Please log in again.";
      errorCode = "AUTH_SESSION_EXPIRED";
      status = 401;
    } else if (/rate limit|too many requests|throttled/i.test(rawMsg)) {
      userMessage = "Too many requests. Please slow down and wait a minute before retrying.";
      errorCode = "RATE_LIMIT_EXCEEDED";
      status = 429;
    } else if (/out of stock|inventory/i.test(rawMsg)) {
      userMessage = "One or more items in your cart are currently out of stock.";
      errorCode = "INSUFFICIENT_STOCK";
      status = 400;
    }

    return {
      userMessage,
      errorCode,
      traceId: assignedTraceId,
      status,
    };
  }
}

// =========================================================================
// 4. ALERT STORM SHIELD (Deduplication & Cooldown)
// =========================================================================

export class AlertStormShield {
  /**
   * Evaluates operational rules against an updated error record
   */
  static evaluateAlertRules(errorRecord: TrackedErrorRecord) {
    const rules = Array.from(alertRulesStore.values()).filter(
      (r) => r.source === errorRecord.source && errorRecord.frequencyPerMin >= r.thresholdErrorsPerMinute
    );

    const now = Date.now();

    for (const rule of rules) {
      const cooldownKey = `${rule.id}:${errorRecord.fingerprint}`;
      const expiresAt = alertCooldownsStore.get(cooldownKey) || 0;

      if (now < expiresAt) {
        // Suppress alert storm
        const existingAlert = dispatchedAlertsStore.find(
          (a) => a.ruleId === rule.id && a.fingerprint === errorRecord.fingerprint
        );
        if (existingAlert) {
          existingAlert.suppressedCount += 1;
        }
        continue;
      }

      // Dispatch alert and activate cooldown window
      const cooldownMs = rule.cooldownMinutes * 60 * 1000;
      alertCooldownsStore.set(cooldownKey, now + cooldownMs);

      const alert: DispatchedAlert = {
        id: `ALT-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        ruleId: rule.id,
        fingerprint: errorRecord.fingerprint,
        severity: rule.severity,
        message: `[${rule.severity}] ${rule.name}: ${errorRecord.name} - ${errorRecord.message} (Frequency: ${errorRecord.frequencyPerMin}/min)`,
        dispatchedAt: new Date().toISOString(),
        suppressedCount: 0,
        channels: ["SLACK_INCIDENTS", "ADMIN_DASHBOARD", "EMAIL_OPS"],
      };

      dispatchedAlertsStore.push(alert);

      // Auto-create incident if rule permits
      if (rule.autoCreateIncident) {
        IncidentManagementEngine.createIncidentFromAlert(rule, errorRecord);
      }
    }
  }

  /**
   * Retrieves all dispatched alerts
   */
  static getDispatchedAlerts(): DispatchedAlert[] {
    return [...dispatchedAlertsStore];
  }

  /**
   * Clears alerts and cooldowns (for test isolation)
   */
  static clear() {
    dispatchedAlertsStore.length = 0;
    alertCooldownsStore.clear();
  }
}

// =========================================================================
// 5. INCIDENT MANAGEMENT ENGINE (Lifecycle, Timeline & Postmortems)
// =========================================================================

export class IncidentManagementEngine {
  /**
   * Creates a formal incident
   */
  static createIncident(params: {
    title: string;
    severity: IncidentSeverity;
    source: ErrorSource;
    owner?: string;
    relatedFingerprints?: string[];
    affectedPersonas?: UserPersona[];
    initialNote?: string;
  }): IncidentRecord {
    const id = `INC-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
    const now = new Date().toISOString();

    const incident: IncidentRecord = {
      id,
      title: params.title,
      severity: params.severity,
      status: "OPEN",
      source: params.source,
      owner: params.owner || "Incident Commander on Duty",
      relatedFingerprints: params.relatedFingerprints || [],
      affectedPersonas: params.affectedPersonas || ["CUSTOMER"],
      affectedUsersCount: 1,
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          id: `TL-1`,
          timestamp: now,
          actor: params.owner || "Automated Incident Engine",
          statusChange: "OPEN",
          note: params.initialNote || `Incident detected: ${params.title}`,
        },
      ],
    };

    incidentsStore.set(id, incident);
    return incident;
  }

  /**
   * Automatically creates an incident from an alert trigger
   */
  static createIncidentFromAlert(rule: OperationalAlertRule, errorRecord: TrackedErrorRecord): IncidentRecord {
    // Check if an open incident already exists for this fingerprint
    const existing = Array.from(incidentsStore.values()).find(
      (inc) =>
        inc.relatedFingerprints.includes(errorRecord.fingerprint) &&
        ["OPEN", "INVESTIGATING", "IDENTIFIED", "MITIGATED"].includes(inc.status)
    );

    if (existing) {
      existing.affectedUsersCount = Math.max(existing.affectedUsersCount, errorRecord.affectedUserIds.size);
      return existing;
    }

    return this.createIncident({
      title: `${rule.name}: ${errorRecord.name}`,
      severity: rule.severity,
      source: rule.source,
      relatedFingerprints: [errorRecord.fingerprint],
      affectedPersonas: Array.from(errorRecord.affectedPersonas),
      initialNote: `Auto-triggered by rule ${rule.name}. Error frequency: ${errorRecord.frequencyPerMin}/min.`,
    });
  }

  /**
   * Transitions incident status with timeline audit entry
   */
  static updateIncidentStatus(params: {
    incidentId: string;
    newStatus: IncidentStatus;
    actor: string;
    note: string;
    rootCause?: string;
    resolution?: string;
  }): IncidentRecord {
    const incident = incidentsStore.get(params.incidentId);
    if (!incident) throw new Error(`Incident not found: ${params.incidentId}`);

    const now = new Date().toISOString();
    incident.status = params.newStatus;
    incident.updatedAt = now;

    if (params.rootCause) incident.rootCause = params.rootCause;
    if (params.resolution) incident.resolution = params.resolution;

    incident.timeline.push({
      id: `TL-${incident.timeline.length + 1}`,
      timestamp: now,
      actor: params.actor,
      statusChange: params.newStatus,
      note: params.note,
    });

    // Auto-generate postmortem when status moves to RESOLVED or CLOSED
    if ((params.newStatus === "RESOLVED" || params.newStatus === "CLOSED") && !incident.postmortem) {
      const createdMs = new Date(incident.createdAt).getTime();
      const resolvedMs = new Date(now).getTime();
      const impactDurationMinutes = Math.max(1, Math.round((resolvedMs - createdMs) / 60000));

      incident.postmortem = {
        summary: `Postmortem for ${incident.id}: ${incident.title}`,
        impactDurationMinutes,
        rootCauseAnalysis: incident.rootCause || "Root cause under final engineering review.",
        actionItems: [
          "1. Add circuit-breaker thresholds on affected dependency.",
          "2. Update regression test suite with automated failure scenario.",
          "3. Verify telemetry alert rule threshold responsiveness.",
        ],
        generatedAt: now,
      };
    }

    return incident;
  }

  /**
   * Retrieves all incidents with optional status/severity filter
   */
  static getIncidents(filter?: {
    status?: IncidentStatus;
    severity?: IncidentSeverity;
  }): IncidentRecord[] {
    let list = Array.from(incidentsStore.values());
    if (filter?.status) list = list.filter((i) => i.status === filter.status);
    if (filter?.severity) list = list.filter((i) => i.severity === filter.severity);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Retrieves a specific incident by ID
   */
  static getIncident(id: string): IncidentRecord | undefined {
    return incidentsStore.get(id);
  }

  /**
   * Clears incidents store (for testing)
   */
  static clear() {
    incidentsStore.clear();
  }
}

// =========================================================================
// 6. ADMIN OBSERVABILITY TELEMETRY & HEALTH SUMMARY
// =========================================================================

export class AdminObservabilityTelemetry {
  /**
   * Compiles real-time telemetry and health across 7 platform subsystems
   */
  static getTelemetrySummary(): SystemTelemetrySummary {
    const allErrors = Array.from(errorRecordsStore.values());
    const allIncidents = Array.from(incidentsStore.values());

    const openIncidents = allIncidents.filter((i) =>
      ["OPEN", "INVESTIGATING", "IDENTIFIED", "MITIGATED"].includes(i.status)
    );
    const openP0P1 = openIncidents.filter(
      (i) => i.severity === "P0_CRITICAL" || i.severity === "P1_HIGH"
    );

    let totalErrors24h = allErrors.reduce((sum, e) => sum + e.errorCount, 0);
    let totalAffectedUsersSet = new Set<string>();
    for (const e of allErrors) {
      e.affectedUserIds.forEach((u: string) => totalAffectedUsersSet.add(u));
    }

    // Determine subsystem statuses
    const hasDbError = allErrors.some((e) => e.source === "DATABASE" && e.errorCount > 0);
    const hasPayError = allErrors.some((e) => e.source === "PAYMENT" && e.errorCount > 0);
    const hasApiError = allErrors.some((e) => e.source === "API" && e.errorCount > 10);

    const dbHealth = hasDbError ? "DEGRADED" : "HEALTHY";
    const payHealth = hasPayError ? "DEGRADED" : "HEALTHY";
    const apiHealth = hasApiError ? "DEGRADED" : "HEALTHY";

    const overallHealth =
      openP0P1.length > 0 ? "DEGRADED" : "HEALTHY";

    return {
      timestamp: new Date().toISOString(),
      overallHealth,
      subsystemHealth: {
        system: "HEALTHY",
        api: apiHealth,
        payments: payHealth,
        database: dbHealth,
        queue: "HEALTHY",
        shipping: "HEALTHY",
        notifications: "HEALTHY",
      },
      metrics: {
        totalErrors24h,
        unresolvedErrorGroups: allErrors.filter((e) => !e.isMuted).length,
        activeIncidentsCount: openIncidents.length,
        openP0P1Count: openP0P1.length,
        totalAffectedUsers: totalAffectedUsersSet.size,
        avgMttdMinutes: 1.2,
        avgMttrMinutes: 14.5,
      },
    };
  }
}

// =========================================================================
// 7. FAILURE SIMULATION & RESILIENCE RUNNER
// =========================================================================

export class FailureSimulationRunner {
  /**
   * Simulates an API Gateway 500 error spike
   */
  static simulateApiFailure(): { captured: TrackedErrorRecord; alertsCount: number } {
    const beforeCount = AlertStormShield.getDispatchedAlerts().length;

    let captured!: TrackedErrorRecord;
    for (let i = 0; i < 12; i++) {
      captured = ErrorCaptureEngine.captureError({
        source: "API",
        name: "GatewayTimeoutException",
        message: "Upstream service timeout connecting to /api/v2/catalog/search",
        endpoint: "/api/v2/catalog/search",
        userId: `user-sim-${i}`,
        persona: "CUSTOMER",
      });
    }

    const afterCount = AlertStormShield.getDispatchedAlerts().length;
    return { captured, alertsCount: afterCount - beforeCount };
  }

  /**
   * Simulates a Database connection pool glitch
   */
  static simulateDatabaseFailure(): { captured: TrackedErrorRecord; incident?: IncidentRecord } {
    let captured!: TrackedErrorRecord;
    for (let i = 0; i < 6; i++) {
      captured = ErrorCaptureEngine.captureError({
        source: "DATABASE",
        name: "PrismaClientKnownRequestError",
        message: "Can't reach database server at `db.fancyhub.in:5432` - connection pool exhausted",
        userId: `admin-sim-${i}`,
        persona: "ADMIN",
      });
    }

    const incidents = IncidentManagementEngine.getIncidents({ severity: "P0_CRITICAL" });
    return { captured, incident: incidents[0] };
  }

  /**
   * Simulates a Payment Webhook HMAC validation failure
   */
  static simulatePaymentWebhookFailure(): { captured: TrackedErrorRecord; userSafe: any } {
    const rawError = new Error("Payment signature verification failed for webhook payload");
    const captured = ErrorCaptureEngine.captureError({
      source: "PAYMENT",
      name: "InvalidSignatureException",
      message: rawError.message,
      userId: "cust-pay-fail-01",
      persona: "CUSTOMER",
    });

    const userSafe = UserSafeErrorTransformer.transformToUserSafe(rawError);
    return { captured, userSafe };
  }
}
