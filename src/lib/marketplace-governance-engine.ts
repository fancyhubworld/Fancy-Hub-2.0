/**
 * FancyHub.in — Phase 51: Marketplace Governance & Policy Engine
 * 
 * Centralized marketplace policy framework covering 9 domains:
 * Vendor Onboarding, Commission, Returns, Refunds, Shipping, Product Restrictions,
 * Reviews, Coupons, and Payouts.
 * 
 * Features:
 * - Semver policy versioning (v1.0.0, v1.1.0, etc.)
 * - Effective date temporal resolution for historical transaction snapshots
 * - Two-person rule / Super Admin approval workflows for sensitive policy mutations
 * - Immutable governance audit trail
 */

import { hasPermission } from "./auth-engine";

// =========================================================================
// 1. TYPES & DATA STRUCTURES
// =========================================================================

export type PolicyDomain =
  | "VENDOR_ONBOARDING"
  | "COMMISSION"
  | "RETURNS"
  | "REFUNDS"
  | "SHIPPING"
  | "PRODUCT_RESTRICTIONS"
  | "REVIEWS"
  | "COUPONS"
  | "PAYOUTS";

export type PolicyStatus = "DRAFT" | "ACTIVE" | "SUPERSEDED" | "ARCHIVED";

export interface MarketplacePolicy {
  id: string; // e.g. "POL-COMMISSION-v1.0.0"
  domain: PolicyDomain;
  version: string; // e.g. "1.0.0"
  title: string;
  effectiveDate: string; // ISO 8601 timestamp
  status: PolicyStatus;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  rules: Record<string, any>;
  changeSummary: string;
  createdAt: string;
}

export interface GovernanceAuditLogEntry {
  id: string;
  timestamp: string;
  domain: PolicyDomain;
  policyId: string;
  version: string;
  action: "POLICY_CREATED" | "POLICY_APPROVED" | "POLICY_ACTIVATED" | "POLICY_SUPERSEDED";
  actor: string;
  details: string;
}

// In-Memory Policy Store and Governance Audit Trail
const policiesStore: Map<string, MarketplacePolicy> = new Map();
const governanceAuditLogs: GovernanceAuditLogEntry[] = [];

// Initialize Baseline Active Policies for all 9 Domains
function initDefaultMarketplacePolicies() {
  if (policiesStore.size > 0) return;

  const baselinePolicies: MarketplacePolicy[] = [
    {
      id: "POL-VENDOR-ONBOARDING-v1.0.0",
      domain: "VENDOR_ONBOARDING",
      version: "1.0.0",
      title: "Standard Vendor Verification & KYC Policy",
      effectiveDate: "2026-01-01T00:00:00.000Z",
      status: "ACTIVE",
      createdBy: "System Bootstrap",
      approvedBy: "Chief Governance Officer (SUPER_ADMIN)",
      approvedAt: "2026-01-01T00:00:00.000Z",
      rules: {
        requireGstin: true,
        requirePan: true,
        requireBankVerification: true,
        mandatoryAgreementSign: true,
      },
      changeSummary: "Initial platform baseline policy",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "POL-COMMISSION-v1.0.0",
      domain: "COMMISSION",
      version: "1.0.0",
      title: "Marketplace Category Take-Rate Policy v1",
      effectiveDate: "2026-01-01T00:00:00.000Z",
      status: "ACTIVE",
      createdBy: "System Bootstrap",
      approvedBy: "Chief Governance Officer (SUPER_ADMIN)",
      approvedAt: "2026-01-01T00:00:00.000Z",
      rules: {
        defaultTakeRatePercent: 10.0,
        fashionPercent: 10.0,
        homeDecorPercent: 10.0,
        jewelryPercent: 12.0,
        craftsPercent: 8.0,
      },
      changeSummary: "Standard 10% average commission structure",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "POL-RETURNS-v1.0.0",
      domain: "RETURNS",
      version: "1.0.0",
      title: "Customer Return & Replacement Window Policy",
      effectiveDate: "2026-01-01T00:00:00.000Z",
      status: "ACTIVE",
      createdBy: "System Bootstrap",
      approvedBy: "Chief Governance Officer (SUPER_ADMIN)",
      approvedAt: "2026-01-01T00:00:00.000Z",
      rules: {
        returnWindowDays: 7,
        requiresOriginalTags: true,
        doorstepInspectionRequired: true,
        freeReturnForDefective: true,
      },
      changeSummary: "7-Day Authenticity Guarantee baseline",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "POL-REFUNDS-v1.0.0",
      domain: "REFUNDS",
      version: "1.0.0",
      title: "Customer Refund Disbursal Policy",
      effectiveDate: "2026-01-01T00:00:00.000Z",
      status: "ACTIVE",
      createdBy: "System Bootstrap",
      approvedBy: "Chief Governance Officer (SUPER_ADMIN)",
      approvedAt: "2026-01-01T00:00:00.000Z",
      rules: {
        instantUpiRefund: true,
        cardRefundDays: 3,
        autoRefundOnCourierPickup: true,
      },
      changeSummary: "Instant UPI & 3-day card refund policy",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "POL-SHIPPING-v1.0.0",
      domain: "SHIPPING",
      version: "1.0.0",
      title: "Merchant Dispatch SLA & Shipping Policy",
      effectiveDate: "2026-01-01T00:00:00.000Z",
      status: "ACTIVE",
      createdBy: "System Bootstrap",
      approvedBy: "Chief Governance Officer (SUPER_ADMIN)",
      approvedAt: "2026-01-01T00:00:00.000Z",
      rules: {
        dispatchMaxHours: 48,
        penaltyForDelayedDispatchINR: 50,
        mandatoryAwbGeneration: true,
      },
      changeSummary: "48-Hour merchant dispatch SLA",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "POL-RESTRICTIONS-v1.0.0",
      domain: "PRODUCT_RESTRICTIONS",
      version: "1.0.0",
      title: "Marketplace Prohibited & Restricted Catalog Items",
      effectiveDate: "2026-01-01T00:00:00.000Z",
      status: "ACTIVE",
      createdBy: "System Bootstrap",
      approvedBy: "Chief Governance Officer (SUPER_ADMIN)",
      approvedAt: "2026-01-01T00:00:00.000Z",
      rules: {
        prohibitCounterfeit: true,
        prohibitHazardousMaterials: true,
        requireHallmarkForGold: true,
        requireSilkMarkForPureSilk: true,
      },
      changeSummary: "Silk Mark & Hallmark authenticity mandates",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "POL-REVIEWS-v1.0.0",
      domain: "REVIEWS",
      version: "1.0.0",
      title: "Verified Customer Review & Rating Integrity Policy",
      effectiveDate: "2026-01-01T00:00:00.000Z",
      status: "ACTIVE",
      createdBy: "System Bootstrap",
      approvedBy: "Chief Governance Officer (SUPER_ADMIN)",
      approvedAt: "2026-01-01T00:00:00.000Z",
      rules: {
        verifiedPurchaseBadgeRequired: true,
        allowVendorPublicReply: true,
        prohibitPaidIncentivizedReviews: true,
      },
      changeSummary: "Zero incentivized fake review policy",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "POL-COUPONS-v1.0.0",
      domain: "COUPONS",
      version: "1.0.0",
      title: "Promotional Discount & Coupon Stacking Governance",
      effectiveDate: "2026-01-01T00:00:00.000Z",
      status: "ACTIVE",
      createdBy: "System Bootstrap",
      approvedBy: "Chief Governance Officer (SUPER_ADMIN)",
      approvedAt: "2026-01-01T00:00:00.000Z",
      rules: {
        maxDiscountPercent: 50,
        maxDiscountINR: 2000,
        prohibitCouponStacking: true,
        merchantFundedCouponAllowed: true,
      },
      changeSummary: "Anti-abuse coupon limits and stack prohibition",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "POL-PAYOUTS-v1.0.0",
      domain: "PAYOUTS",
      version: "1.0.0",
      title: "Merchant Escrow Settlement & Payout Policy",
      effectiveDate: "2026-01-01T00:00:00.000Z",
      status: "ACTIVE",
      createdBy: "System Bootstrap",
      approvedBy: "Chief Governance Officer (SUPER_ADMIN)",
      approvedAt: "2026-01-01T00:00:00.000Z",
      rules: {
        settlementCycle: "T+3_AFTER_DELIVERY",
        section194OTdsPercent: 1.0,
        escrowHoldUntilReturnWindowCloses: false, // Releases on delivery confirmation + 3 days
        weeklyPayoutDay: "WEDNESDAY",
      },
      changeSummary: "T+3 settlement cadence with 1% statutory TDS",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
  ];

  for (const pol of baselinePolicies) {
    policiesStore.set(pol.id, pol);
  }
}

initDefaultMarketplacePolicies();

// =========================================================================
// 2. GOVERNANCE & POLICY ENGINE
// =========================================================================

export class MarketplaceGovernanceEngine {
  /**
   * Proposes a new policy version (Created in DRAFT state)
   */
  static proposePolicyVersion(params: {
    domain: PolicyDomain;
    newVersion: string;
    title: string;
    effectiveDate: string;
    rules: Record<string, any>;
    changeSummary: string;
    creatorRole: string;
    creatorName: string;
  }): { success: boolean; policy?: MarketplacePolicy; error?: string } {
    const { domain, newVersion, title, effectiveDate, rules, changeSummary, creatorRole, creatorName } = params;

    // RBAC: Requires ADMIN or SUPER_ADMIN role to propose
    if (!hasPermission(creatorRole as any, "ADMIN") && !hasPermission(creatorRole as any, "SUPER_ADMIN")) {
      return { success: false, error: "Unauthorized: Proposing marketplace policy changes requires ADMIN role" };
    }

    const policyId = `POL-${domain}-v${newVersion}`;
    if (policiesStore.has(policyId)) {
      return { success: false, error: `Policy version ${policyId} already exists` };
    }

    const now = new Date().toISOString();
    const policy: MarketplacePolicy = {
      id: policyId,
      domain,
      version: newVersion,
      title,
      effectiveDate,
      status: "DRAFT",
      createdBy: `${creatorName} (${creatorRole})`,
      rules,
      changeSummary,
      createdAt: now,
    };

    policiesStore.set(policyId, policy);

    this.logGovernanceAudit({
      domain,
      policyId,
      version: newVersion,
      action: "POLICY_CREATED",
      actor: `${creatorName} (${creatorRole})`,
      details: `Drafted policy version ${newVersion}: ${changeSummary}`,
    });

    return { success: true, policy };
  }

  /**
   * Approves and Activates a Draft Policy Version (Requires SUPER_ADMIN)
   */
  static approveAndActivatePolicy(params: {
    policyId: string;
    approverRole: string;
    approverName: string;
  }): { success: boolean; policy?: MarketplacePolicy; error?: string } {
    const { policyId, approverRole, approverName } = params;

    // Strict Governance Guard: Only SUPER_ADMIN can approve and enact marketplace policies
    if (!hasPermission(approverRole as any, "SUPER_ADMIN")) {
      return {
        success: false,
        error: "Unauthorized: Enacting marketplace governance policies strictly requires SUPER_ADMIN approval",
      };
    }

    const targetPolicy = policiesStore.get(policyId);
    if (!targetPolicy) {
      return { success: false, error: "Policy not found" };
    }

    if (targetPolicy.status !== "DRAFT") {
      return { success: false, error: `Cannot approve policy in ${targetPolicy.status} status` };
    }

    const now = new Date().toISOString();
    targetPolicy.status = "ACTIVE";
    targetPolicy.approvedBy = `${approverName} (${approverRole})`;
    targetPolicy.approvedAt = now;

    // Supersede previously active policy in the same domain
    for (const p of policiesStore.values()) {
      if (p.domain === targetPolicy.domain && p.id !== targetPolicy.id && p.status === "ACTIVE") {
        p.status = "SUPERSEDED";
        this.logGovernanceAudit({
          domain: p.domain,
          policyId: p.id,
          version: p.version,
          action: "POLICY_SUPERSEDED",
          actor: `${approverName} (${approverRole})`,
          details: `Superseded by newly enacted policy ${targetPolicy.id}`,
        });
      }
    }

    this.logGovernanceAudit({
      domain: targetPolicy.domain,
      policyId: targetPolicy.id,
      version: targetPolicy.version,
      action: "POLICY_APPROVED",
      actor: `${approverName} (${approverRole})`,
      details: `Approved and published policy ${targetPolicy.id}`,
    });

    return { success: true, policy: targetPolicy };
  }

  /**
   * Resolves the authoritative policy in effect for a given date/timestamp
   * CRITICAL FOR HISTORICAL ORDERS: Ensures historical transactions use the exact policy version active at that time
   */
  static getEffectivePolicyForDate(domain: PolicyDomain, targetDateIso: string): MarketplacePolicy | undefined {
    const targetTimestamp = new Date(targetDateIso).getTime();

    // Find all policies in this domain that were effective on or before the target date
    const applicablePolicies = Array.from(policiesStore.values())
      .filter((p) => p.domain === domain && p.status !== "DRAFT")
      .filter((p) => new Date(p.effectiveDate).getTime() <= targetTimestamp)
      .sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime());

    // Returns the latest policy enacted on or before that historical transaction date
    return applicablePolicies[0];
  }

  /**
   * Retrieves the currently active policy for a domain
   */
  static getActivePolicy(domain: PolicyDomain): MarketplacePolicy | undefined {
    return Array.from(policiesStore.values()).find((p) => p.domain === domain && p.status === "ACTIVE");
  }

  /**
   * Retrieves all policy versions across all domains
   */
  static getAllPolicies(): MarketplacePolicy[] {
    return Array.from(policiesStore.values());
  }

  /**
   * Logs governance operations to immutable audit trail
   */
  static logGovernanceAudit(entry: Omit<GovernanceAuditLogEntry, "id" | "timestamp">): GovernanceAuditLogEntry {
    const fullEntry: GovernanceAuditLogEntry = {
      id: `GOVAUDIT-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    governanceAuditLogs.unshift(fullEntry);
    return fullEntry;
  }

  /**
   * Retrieves full immutable governance audit trail
   */
  static getGovernanceAuditLogs(): GovernanceAuditLogEntry[] {
    return [...governanceAuditLogs];
  }
}
