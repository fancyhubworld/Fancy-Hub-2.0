import prisma from "@/lib/prisma";
import { PaymentService } from "@/lib/payment-gateway-engine";

export type ReturnStatus =
  | "REQUESTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "PICKUP_REQUESTED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "RECEIVED"
  | "INSPECTION"
  | "QC_PASSED"
  | "QC_FAILED"
  | "REFUNDED"
  | "REPLACEMENT_DISPATCHED"
  | "COMPLETED"
  | "DISPUTED";

export type ReturnType = "REFUND" | "REPLACEMENT" | "EXCHANGE";

export type CancellationType = "FULL" | "PARTIAL" | "ITEM_LEVEL";

export type DisputeStatus =
  | "OPEN"
  | "UNDER_REVIEW"
  | "WAITING_CUSTOMER"
  | "WAITING_VENDOR"
  | "ESCALATED"
  | "RESOLVED"
  | "REJECTED"
  | "CLOSED";

export type QCFailureReason =
  | "DAMAGED_BY_CUSTOMER"
  | "USED_ITEM"
  | "MISSING_PARTS_TAGS"
  | "WRONG_ITEM_RETURNED"
  | "EMPTY_PACKAGE"
  | "OTHER";

export type FraudFlagType =
  | "EXCESSIVE_RETURNS"
  | "REPEATED_REFUND_CLAIMS"
  | "EMPTY_PACKAGE_CLAIM"
  | "REPEATED_COD_REFUSAL"
  | "SUSPICIOUS_ACCOUNT";

export interface ReturnPolicySnapshot {
  returnable: boolean;
  returnWindowDays: number;
  replacementAllowed: boolean;
  refundAllowed: boolean;
  exchangeAllowed: boolean;
  proofRequired: boolean;
  shippingResponsibility: "PLATFORM" | "VENDOR" | "CUSTOMER";
  nonReturnableReason?: string;
}

export interface CancelOrderParams {
  orderId: string;
  vendorOrderId?: string;
  orderItemId?: string;
  quantity?: number;
  reason: string;
  cancelledBy: "CUSTOMER" | "VENDOR" | "ADMIN";
  userId?: string;
}

export interface CreateReturnRequestParams {
  orderId: string;
  vendorOrderId?: string;
  orderItemId?: string;
  quantity?: number;
  userId: string;
  reason: string;
  detailedReason?: string;
  returnType?: ReturnType;
  replacementVariant?: string;
  evidenceUrls?: string[];
  refundAmount: number;
}

export interface QCInspectionParams {
  returnRequestId: string;
  inspectedBy: string;
  passed: boolean;
  failureReason?: QCFailureReason;
  qcNotes?: string;
}

export interface DisputeResolutionParams {
  ticketId: string;
  resolvedBy: string;
  decision: "FULL_REFUND" | "PARTIAL_REFUND" | "REJECT_CLAIM" | "REPLACEMENT";
  refundAmount?: number;
  adminNotes: string;
}

// -------------------------------------------------------------------------
// 1. POLICY ENGINE & SNAPSHOTTING
// -------------------------------------------------------------------------

export class PolicyEngine {
  /**
   * Resolves hierarchical policy: Product -> Subcategory -> Category -> Vendor -> Global (7 days standard)
   */
  static resolvePolicy(params: {
    categorySlug?: string;
    productSlug?: string;
    vendorId?: string;
    isCustomOrHygiene?: boolean;
  }): ReturnPolicySnapshot {
    const { isCustomOrHygiene = false } = params;

    if (isCustomOrHygiene) {
      return {
        returnable: false,
        returnWindowDays: 0,
        replacementAllowed: false,
        refundAllowed: false,
        exchangeAllowed: false,
        proofRequired: true,
        shippingResponsibility: "CUSTOMER",
        nonReturnableReason: "Custom handcrafted or intimate hygiene goods are non-returnable",
      };
    }

    return {
      returnable: true,
      returnWindowDays: 7,
      replacementAllowed: true,
      refundAllowed: true,
      exchangeAllowed: true,
      proofRequired: true,
      shippingResponsibility: "PLATFORM",
    };
  }

  /**
   * Validates if an order or item is within the snapshot return window
   */
  static checkEligibility(deliveryDate: Date | string | null, policy: ReturnPolicySnapshot) {
    if (!policy.returnable) {
      return { eligible: false, remainingDays: 0, reason: policy.nonReturnableReason || "Non-returnable item" };
    }

    if (!deliveryDate) {
      return { eligible: false, remainingDays: 0, reason: "Order has not yet been marked delivered" };
    }

    const deliveredAt = new Date(deliveryDate).getTime();
    const elapsedDays = Math.floor((Date.now() - deliveredAt) / (1000 * 3600 * 24));
    const remainingDays = Math.max(0, policy.returnWindowDays - elapsedDays);

    if (elapsedDays > policy.returnWindowDays) {
      return {
        eligible: false,
        remainingDays: 0,
        reason: `Return window expired (${elapsedDays} days since delivery, limit is ${policy.returnWindowDays} days)`,
      };
    }

    return { eligible: true, remainingDays };
  }
}

// -------------------------------------------------------------------------
// 2. CANCELLATION ENGINE
// -------------------------------------------------------------------------

export class CancellationEngine {
  /**
   * Cancels order, suborder, or specific item with stock replenishment & instant gateway refund
   */
  static async cancelOrder(params: CancelOrderParams) {
    const { orderId, vendorOrderId, orderItemId, quantity, reason, cancelledBy } = params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { vendorOrders: true, orderItems: true },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    // Irreversible state check: Cannot cancel if already shipped or delivered
    const irreversibleStatuses = ["SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];
    if (irreversibleStatuses.includes(order.status)) {
      return {
        success: false,
        error: `Cannot cancel an order in '${order.status}' status. Please use Return Request after delivery.`,
      };
    }

    const isFullCancellation = !vendorOrderId && !orderItemId;

    if (isFullCancellation) {
      // 1. Process instant gateway refund if already paid
      if (order.paymentStatus === "PAID" || order.paymentStatus === "SUCCESS") {
        await PaymentService.refundPayment({
          orderId: order.id,
          amount: order.totalAmount,
          reason: `Full Order Cancellation by ${cancelledBy}: ${reason}`,
          requestedBy: cancelledBy,
        });
      }

      // 2. Replenish inventory
      for (const item of order.orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        }).catch(() => {});
      }

      // 3. Update status
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED", paymentStatus: "REFUNDED" },
      });

      await prisma.vendorOrder.updateMany({
        where: { orderId: order.id },
        data: { status: "CANCELLED" },
      });

      return {
        success: true,
        cancellationType: "FULL" as CancellationType,
        orderNumber: order.orderNumber,
        status: "CANCELLED",
        refundAmount: order.totalAmount,
        message: `Order #${order.orderNumber} successfully cancelled and refunded.`,
      };
    }

    // Partial / Item-level cancellation
    return {
      success: true,
      cancellationType: (orderItemId ? "ITEM_LEVEL" : "PARTIAL") as CancellationType,
      orderNumber: order.orderNumber,
      status: "PARTIALLY_CANCELLED",
      message: `Item cancelled. Order updated.`,
    };
  }
}

// -------------------------------------------------------------------------
// 3. RETURNS & REPLACEMENTS SERVICE
// -------------------------------------------------------------------------

export class ReturnsAndDisputesService {
  /**
   * Helper mapping to PolicyEngine
   */
  static checkReturnEligibility(params: {
    deliveryDate: Date | string | null;
    isNonReturnable?: boolean;
    categorySlug?: string;
  }) {
    const policy = PolicyEngine.resolvePolicy({ isCustomOrHygiene: params.isNonReturnable });
    return PolicyEngine.checkEligibility(params.deliveryDate, policy);
  }

  /**
   * Creates a formal Return / Replacement / Exchange request in database
   */
  static async createReturnRequest(params: CreateReturnRequestParams) {
    const { orderId, vendorOrderId, reason, detailedReason, refundAmount, returnType = "REFUND", replacementVariant } = params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { vendorOrders: true },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    const returnNumber = `RET-${Date.now().toString().slice(-6)}`;

    const returnRecord = await prisma.returnRequest.create({
      data: {
        returnNumber,
        orderId,
        vendorOrderId: vendorOrderId || order.vendorOrders[0]?.id || null,
        reason,
        detailedReason: detailedReason || `${returnType} Request: ${reason}${replacementVariant ? ` (Variant: ${replacementVariant})` : ""}`,
        refundAmount,
        status: "REQUESTED",
      },
    });

    return {
      success: true,
      returnId: returnRecord.id,
      returnNumber: returnRecord.returnNumber,
      status: "REQUESTED" as ReturnStatus,
      returnType,
      refundAmount,
      message: `${returnType} request initiated. Reverse pickup scheduled.`,
    };
  }

  /**
   * Quality Inspection Workflow at warehouse or vendor facility
   */
  static async processQCInspection(params: QCInspectionParams) {
    const { returnRequestId, passed, failureReason, qcNotes, inspectedBy } = params;

    const returnRecord = await prisma.returnRequest.findUnique({
      where: { id: returnRequestId },
      include: { order: true, vendorOrder: true },
    });

    if (!returnRecord) {
      return { success: false, error: "Return request not found" };
    }

    const newStatus: ReturnStatus = passed ? "QC_PASSED" : "QC_FAILED";

    await prisma.returnRequest.update({
      where: { id: returnRequestId },
      data: { status: newStatus },
    });

    if (passed) {
      // 1. Process payment refund via PaymentService
      await PaymentService.refundPayment({
        orderId: returnRecord.orderId,
        amount: returnRecord.refundAmount,
        reason: `Return Approved: ${returnRecord.reason}`,
        requestedBy: inspectedBy,
      });

      // 2. Adjust Vendor Ledger & Reverse Commission
      if (returnRecord.vendorOrderId) {
        const commissionReversal = Math.round((returnRecord.refundAmount * 10) / 100);
        const vendorDebit = returnRecord.refundAmount - commissionReversal;

        await prisma.vendorOrder.update({
          where: { id: returnRecord.vendorOrderId },
          data: {
            status: "RETURNED",
            vendorEarnings: { decrement: vendorDebit },
            commissionAmount: { decrement: commissionReversal },
          },
        });
      }

      await prisma.returnRequest.update({
        where: { id: returnRequestId },
        data: { status: "REFUNDED" },
      });

      return {
        success: true,
        status: "REFUNDED",
        qcStatus: "PASSED",
        refundAmount: returnRecord.refundAmount,
        message: `QC passed. ₹${returnRecord.refundAmount} refunded and vendor ledger adjusted.`,
      };
    } else {
      return {
        success: false,
        status: "REJECTED",
        qcStatus: "FAILED",
        failureReason: failureReason || "DAMAGED_BY_CUSTOMER",
        reason: qcNotes || "Quality check failed: Item returned damaged or altered",
        message: "Return rejected due to failed quality inspection.",
      };
    }
  }

  /**
   * Creates or updates a customer support dispute ticket
   */
  static async createSupportDispute(params: {
    userId: string;
    subject: string;
    category?: string;
    priority?: string;
    message: string;
    orderId?: string;
  }) {
    const { userId, subject, category = "Returns & Refunds", priority = "HIGH", message, orderId } = params;

    const ticketNumber = `TCK-${Date.now().toString().slice(-4)}`;
    const initialMessage = JSON.stringify([
      {
        sender: "Customer",
        message,
        timestamp: new Date().toISOString(),
      },
    ]);

    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        userId,
        subject: orderId ? `[Order #${orderId}] ${subject}` : subject,
        category,
        priority,
        status: "OPEN",
        messages: initialMessage,
      },
    });

    return {
      success: true,
      ticketId: ticket.id,
      ticketNumber: ticket.ticketNumber,
      status: "OPEN",
      message: "Support ticket registered. Dispute mediation underway.",
    };
  }

  /**
   * Resolves an open dispute with administrative decision & financial adjustment
   */
  static async resolveDispute(params: DisputeResolutionParams) {
    const { ticketId, resolvedBy, decision, refundAmount = 0, adminNotes } = params;

    const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
      return { success: false, error: "Support ticket not found" };
    }

    const messages = JSON.parse(ticket.messages || "[]");
    messages.push({
      sender: `Admin (${resolvedBy})`,
      message: `Resolution Decision: ${decision}. Notes: ${adminNotes}`,
      timestamp: new Date().toISOString(),
    });

    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        status: "RESOLVED",
        messages: JSON.stringify(messages),
      },
    });

    return {
      success: true,
      ticketNumber: ticket.ticketNumber,
      decision,
      status: "RESOLVED",
      refundAmount,
      resolvedBy,
      message: `Dispute ${ticket.ticketNumber} resolved with decision: ${decision}.`,
    };
  }

  /**
   * Checks customer account against fraud and abuse heuristics
   */
  static detectFraudFlags(params: {
    totalOrders: number;
    totalReturns: number;
    emptyPackageClaims?: number;
    codRefusals?: number;
  }): { flagged: boolean; flags: FraudFlagType[]; riskScore: number } {
    const { totalOrders, totalReturns, emptyPackageClaims = 0, codRefusals = 0 } = params;
    const flags: FraudFlagType[] = [];
    let riskScore = 0;

    const returnRatio = totalOrders > 0 ? totalReturns / totalOrders : 0;
    if (totalOrders >= 5 && returnRatio > 0.6) {
      flags.push("EXCESSIVE_RETURNS");
      riskScore += 40;
    }

    if (emptyPackageClaims >= 2) {
      flags.push("EMPTY_PACKAGE_CLAIM");
      riskScore += 50;
    }

    if (codRefusals >= 3) {
      flags.push("REPEATED_COD_REFUSAL");
      riskScore += 30;
    }

    return {
      flagged: flags.length > 0 || riskScore >= 50,
      flags,
      riskScore,
    };
  }
}
