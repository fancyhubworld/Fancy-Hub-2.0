export type RiskAction = "ALLOW" | "REVIEW" | "CHALLENGE" | "HOLD";

export type AbuseCategory =
  | "PAYMENT_ABUSE"
  | "COUPON_ABUSE"
  | "REFERRAL_ABUSE"
  | "COD_ABUSE"
  | "RETURN_ABUSE"
  | "REFUND_ABUSE"
  | "ACCOUNT_ABUSE"
  | "VENDOR_ABUSE";

export interface RiskSignalResult {
  code: string;
  category: AbuseCategory;
  scoreContribution: number;
  explanation: string;
}

export interface RiskEvaluationResult {
  evaluationId: string;
  entityType: "ORDER" | "CUSTOMER" | "COUPON" | "REFERRAL" | "VENDOR";
  entityId: string;
  customerId: string;
  riskScore: number; // 0 to 100
  action: RiskAction;
  signals: RiskSignalResult[];
  challengeType?: "OTP_VERIFY" | "PREPAID_ONLY" | "CAPTCHA";
  isExplainable: boolean;
  evaluatedAt: string;
}

export interface FraudReviewItem {
  id: string;
  evaluation: RiskEvaluationResult;
  status: "PENDING_REVIEW" | "APPROVED" | "CHALLENGED" | "REJECTED_HOLD";
  reviewedBy?: string;
  reviewNotes?: string;
  reviewedAt?: string;
  createdAt: string;
}

// In-Memory Fraud Queue & Audit Store
const fraudReviewQueue: FraudReviewItem[] = [];
const riskDecisionAuditTrail: Array<Record<string, any>> = [];

// -------------------------------------------------------------------------
// 1. RISK SCORING & ABUSE EVALUATION ENGINE
// -------------------------------------------------------------------------

export class FraudRiskScoringEngine {
  /**
   * Evaluates transactional context and returns explainable risk score & action
   */
  static evaluateOrderRisk(context: {
    customerId: string;
    orderTotalINR: number;
    paymentMethod: "COD" | "RAZORPAY" | "PHONEPE" | "WALLET";
    recentFailedPaymentsCount?: number;
    recentReturnRatePercent?: number;
    unacceptedCodShipmentsCount?: number;
    ordersInLast10Minutes?: number;
    invalidCouponAttemptsCount?: number;
    isSelfReferralDetected?: boolean;
  }): RiskEvaluationResult {
    const signals: RiskSignalResult[] = [];
    let riskScore = 0;

    // 1. Payment Abuse Signal: Velocity of failures
    if ((context.recentFailedPaymentsCount || 0) >= 3) {
      const pts = 30;
      riskScore += pts;
      signals.push({
        code: "PAYMENT_FAILURE_VELOCITY",
        category: "PAYMENT_ABUSE",
        scoreContribution: pts,
        explanation: `${context.recentFailedPaymentsCount} payment failures detected in past 15 minutes.`,
      });
    }

    // 2. COD Abuse Signal: Unaccepted previous cash orders
    if (context.paymentMethod === "COD" && (context.unacceptedCodShipmentsCount || 0) >= 2) {
      const pts = 35;
      riskScore += pts;
      signals.push({
        code: "HIGH_COD_RTO_HISTORY",
        category: "COD_ABUSE",
        scoreContribution: pts,
        explanation: "Customer has 2 or more unaccepted/rejected COD shipments on record.",
      });
    }

    // 3. Return Abuse Signal: Excessive return rate (> 40%)
    if ((context.recentReturnRatePercent || 0) > 40) {
      const pts = 25;
      riskScore += pts;
      signals.push({
        code: "EXCESSIVE_RETURN_RATE",
        category: "RETURN_ABUSE",
        scoreContribution: pts,
        explanation: `Customer return rate is ${context.recentReturnRatePercent}%, exceeding safe threshold.`,
      });
    }

    // 4. Order Velocity Spike: Bot-like rapid ordering
    if ((context.ordersInLast10Minutes || 0) >= 4) {
      const pts = 20;
      riskScore += pts;
      signals.push({
        code: "ORDER_VELOCITY_SPIKE",
        category: "ACCOUNT_ABUSE",
        scoreContribution: pts,
        explanation: "High-frequency order placement (> 4 orders within 10 minutes).",
      });
    }

    // 5. Coupon Abuse Signal: Brute-force guessing
    if ((context.invalidCouponAttemptsCount || 0) >= 5) {
      const pts = 25;
      riskScore += pts;
      signals.push({
        code: "COUPON_BRUTE_FORCE",
        category: "COUPON_ABUSE",
        scoreContribution: pts,
        explanation: "Multiple rapid failed promo code attempts detected.",
      });
    }

    // 6. Referral Fraud: Self-referral ring
    if (context.isSelfReferralDetected) {
      const pts = 40;
      riskScore += pts;
      signals.push({
        code: "SELF_REFERRAL_EXPLOIT",
        category: "REFERRAL_ABUSE",
        scoreContribution: pts,
        explanation: "Self-referral attempted using matching IP / device signature.",
      });
    }

    // Cap score at 100
    riskScore = Math.min(100, riskScore);

    // Determine Action
    let action: RiskAction = "ALLOW";
    let challengeType: RiskEvaluationResult["challengeType"] = undefined;

    if (riskScore >= 81) {
      action = "HOLD"; // Temporary administrative hold pending human review
    } else if (riskScore >= 61) {
      action = "CHALLENGE";
      challengeType = context.paymentMethod === "COD" ? "PREPAID_ONLY" : "OTP_VERIFY";
    } else if (riskScore >= 30) {
      action = "REVIEW"; // Async review queue
    } else {
      action = "ALLOW";
    }

    const evaluation: RiskEvaluationResult = {
      evaluationId: `RSK-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      entityType: "ORDER",
      entityId: `ORD-${Date.now()}`,
      customerId: context.customerId,
      riskScore,
      action,
      signals,
      challengeType,
      isExplainable: true,
      evaluatedAt: new Date().toISOString(),
    };

    // Auto-enqueue for review if action is REVIEW or HOLD
    if (action === "REVIEW" || action === "HOLD") {
      FraudReviewQueueService.enqueueForReview(evaluation);
    }

    // Log to audit trail
    riskDecisionAuditTrail.unshift(evaluation);

    return evaluation;
  }
}

// -------------------------------------------------------------------------
// 2. MANUAL FRAUD REVIEW QUEUE SERVICE
// -------------------------------------------------------------------------

export class FraudReviewQueueService {
  /**
   * Enqueues risk evaluation into manual admin review queue
   */
  static enqueueForReview(evaluation: RiskEvaluationResult): FraudReviewItem {
    const item: FraudReviewItem = {
      id: `REV-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      evaluation,
      status: "PENDING_REVIEW",
      createdAt: new Date().toISOString(),
    };

    fraudReviewQueue.unshift(item);
    return item;
  }

  /**
   * Retrieves pending review queue items
   */
  static getPendingReviews(): FraudReviewItem[] {
    return fraudReviewQueue.filter((r) => r.status === "PENDING_REVIEW");
  }

  /**
   * Resolves manual review item
   */
  static resolveReview(params: {
    reviewId: string;
    adminId: string;
    decision: "APPROVED" | "CHALLENGED" | "REJECTED_HOLD";
    notes: string;
  }): boolean {
    const item = fraudReviewQueue.find((r) => r.id === params.reviewId);
    if (!item) return false;

    item.status = params.decision;
    item.reviewedBy = params.adminId;
    item.reviewNotes = params.notes;
    item.reviewedAt = new Date().toISOString();
    return true;
  }
}
