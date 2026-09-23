import prisma from "@/lib/prisma";

export type WalletEntryType = "CREDIT" | "DEBIT" | "EXPIRY" | "REVERSAL" | "REFUND";

export type PointSourceType = "PURCHASE" | "REVIEW" | "REFERRAL" | "CAMPAIGN" | "ADMIN_BONUS";

export type MembershipTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";

export interface WalletLedgerEntry {
  id: string;
  userId: string;
  type: WalletEntryType;
  amount: number; // in INR
  referenceId?: string; // Order ID, Return ID, or Admin Action ID
  description: string;
  idempotencyKey: string;
  expiresAt?: string;
  createdAt: string;
}

export interface LoyaltyPointEntry {
  id: string;
  userId: string;
  source: PointSourceType;
  points: number;
  referenceId?: string;
  description: string;
  createdAt: string;
}

export interface ReferralRecord {
  id: string;
  referrerId: string;
  referredUserId: string;
  referralCode: string;
  status: "PENDING" | "QUALIFIED" | "REWARDED";
  rewardAmount: number;
  createdAt: string;
}

// In-Memory Immutable Ledger Stores
const walletLedger: WalletLedgerEntry[] = [];
const loyaltyPointsStore: LoyaltyPointEntry[] = [];
const referralsStore: ReferralRecord[] = [];
const processedIdempotencyKeys = new Set<string>();

// -------------------------------------------------------------------------
// 1. IMMUTABLE WALLET LEDGER ENGINE
// -------------------------------------------------------------------------

export class WalletLedgerService {
  /**
   * Computes authoritative wallet balance from immutable ledger history
   */
  static getBalance(userId: string): {
    balance: number;
    totalCredited: number;
    totalDebited: number;
    totalRefunded: number;
    transactions: WalletLedgerEntry[];
  } {
    const userEntries = walletLedger.filter((e) => e.userId === userId);

    let totalCredited = 0;
    let totalDebited = 0;
    let totalRefunded = 0;
    let totalExpired = 0;
    let totalReversed = 0;

    for (const entry of userEntries) {
      if (entry.type === "CREDIT") totalCredited += entry.amount;
      if (entry.type === "REFUND") totalRefunded += entry.amount;
      if (entry.type === "DEBIT") totalDebited += entry.amount;
      if (entry.type === "EXPIRY") totalExpired += entry.amount;
      if (entry.type === "REVERSAL") totalReversed += entry.amount;
    }

    const rawBalance = totalCredited + totalRefunded - totalDebited - totalExpired - totalReversed;
    const balance = Math.max(0, Math.round(rawBalance * 100) / 100);

    return {
      balance,
      totalCredited,
      totalDebited,
      totalRefunded,
      transactions: [...userEntries].reverse(),
    };
  }

  /**
   * Records an immutable credit entry into the wallet ledger
   */
  static creditWallet(params: {
    userId: string;
    amount: number;
    type?: "CREDIT" | "REFUND";
    referenceId?: string;
    description: string;
    idempotencyKey: string;
    expiresAt?: string;
  }): { success: boolean; entry?: WalletLedgerEntry; error?: string } {
    const { userId, amount, type = "CREDIT", referenceId, description, idempotencyKey, expiresAt } = params;

    if (amount <= 0) {
      return { success: false, error: "Credit amount must be greater than zero" };
    }

    if (processedIdempotencyKeys.has(idempotencyKey)) {
      const existing = walletLedger.find((e) => e.idempotencyKey === idempotencyKey);
      return { success: true, entry: existing };
    }

    const entry: WalletLedgerEntry = {
      id: `WLT-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId,
      type,
      amount,
      referenceId,
      description,
      idempotencyKey,
      expiresAt,
      createdAt: new Date().toISOString(),
    };

    walletLedger.push(entry);
    processedIdempotencyKeys.add(idempotencyKey);

    return { success: true, entry };
  }

  /**
   * Records an immutable debit entry if balance is sufficient
   */
  static debitWallet(params: {
    userId: string;
    amount: number;
    referenceId?: string;
    description: string;
    idempotencyKey: string;
  }): { success: boolean; entry?: WalletLedgerEntry; error?: string; remainingBalance?: number } {
    const { userId, amount, referenceId, description, idempotencyKey } = params;

    if (amount <= 0) {
      return { success: false, error: "Debit amount must be greater than zero" };
    }

    if (processedIdempotencyKeys.has(idempotencyKey)) {
      const existing = walletLedger.find((e) => e.idempotencyKey === idempotencyKey);
      return { success: true, entry: existing };
    }

    const current = this.getBalance(userId);
    if (current.balance < amount) {
      return {
        success: false,
        error: `Insufficient wallet balance. Available: ₹${current.balance}, Required: ₹${amount}`,
      };
    }

    const entry: WalletLedgerEntry = {
      id: `WLT-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId,
      type: "DEBIT",
      amount,
      referenceId,
      description,
      idempotencyKey,
      createdAt: new Date().toISOString(),
    };

    walletLedger.push(entry);
    processedIdempotencyKeys.add(idempotencyKey);

    const updated = this.getBalance(userId);
    return {
      success: true,
      entry,
      remainingBalance: updated.balance,
    };
  }

  /**
   * Scans and expires promotional credits past validity
   */
  static expireCredits(userId: string): number {
    const now = new Date().toISOString();
    const userCredits = walletLedger.filter(
      (e) => e.userId === userId && e.type === "CREDIT" && e.expiresAt && e.expiresAt < now
    );

    let expiredAmount = 0;
    for (const credit of userCredits) {
      const expiryKey = `EXPIRY-${credit.id}`;
      if (!processedIdempotencyKeys.has(expiryKey)) {
        const expiryEntry: WalletLedgerEntry = {
          id: `WLT-EXP-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          userId,
          type: "EXPIRY",
          amount: credit.amount,
          referenceId: credit.id,
          description: `Promotional credit expired: ${credit.description}`,
          idempotencyKey: expiryKey,
          createdAt: now,
        };
        walletLedger.push(expiryEntry);
        processedIdempotencyKeys.add(expiryKey);
        expiredAmount += credit.amount;
      }
    }
    return expiredAmount;
  }
}

// -------------------------------------------------------------------------
// 2. LOYALTY POINTS & REWARDS ENGINE
// -------------------------------------------------------------------------

export class LoyaltyPointsEngine {
  /**
   * Computes active loyalty points balance for user
   */
  static getPointsBalance(userId: string): {
    points: number;
    redeemableValueINR: number;
    history: LoyaltyPointEntry[];
  } {
    const history = loyaltyPointsStore.filter((p) => p.userId === userId);
    let totalPoints = 0;
    for (const entry of history) {
      totalPoints += entry.points;
    }

    // 100 points = ₹10 INR conversion rate
    const redeemableValueINR = Math.floor(totalPoints / 10);

    return {
      points: Math.max(0, totalPoints),
      redeemableValueINR,
      history: [...history].reverse(),
    };
  }

  /**
   * Awards loyalty points from actions
   */
  static awardPoints(params: {
    userId: string;
    source: PointSourceType;
    points: number;
    referenceId?: string;
    description: string;
  }): LoyaltyPointEntry {
    const { userId, source, points, referenceId, description } = params;

    const entry: LoyaltyPointEntry = {
      id: `PTS-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId,
      source,
      points,
      referenceId,
      description,
      createdAt: new Date().toISOString(),
    };

    loyaltyPointsStore.push(entry);
    return entry;
  }

  /**
   * Redeems points and converts to wallet credit
   */
  static redeemPointsToWallet(params: {
    userId: string;
    pointsToRedeem: number;
  }): { success: boolean; inrCredited?: number; remainingPoints?: number; error?: string } {
    const { userId, pointsToRedeem } = params;

    if (pointsToRedeem < 100) {
      return { success: false, error: "Minimum 100 points required for wallet redemption" };
    }

    const current = this.getPointsBalance(userId);
    if (current.points < pointsToRedeem) {
      return { success: false, error: "Insufficient loyalty points" };
    }

    const inrValue = Math.floor(pointsToRedeem / 10);

    // Deduct points
    this.awardPoints({
      userId,
      source: "CAMPAIGN",
      points: -pointsToRedeem,
      description: `Redeemed ${pointsToRedeem} points for ₹${inrValue} wallet cashback`,
    });

    // Credit wallet ledger
    WalletLedgerService.creditWallet({
      userId,
      amount: inrValue,
      description: `Loyalty points conversion (${pointsToRedeem} pts)`,
      idempotencyKey: `PTS-REDEEM-${Date.now()}-${userId}`,
    });

    const updated = this.getPointsBalance(userId);
    return {
      success: true,
      inrCredited: inrValue,
      remainingPoints: updated.points,
    };
  }
}

// -------------------------------------------------------------------------
// 3. REFERRAL & ANTI-ABUSE ENGINE
// -------------------------------------------------------------------------

export class ReferralEngine {
  /**
   * Generates unique referral code for customer
   */
  static getReferralCode(userId: string): string {
    const hash = Buffer.from(userId).toString("hex").slice(0, 6).toUpperCase();
    return `FHREF-${hash}`;
  }

  /**
   * Records customer referral with anti-fraud rules
   */
  static registerReferral(params: {
    referrerId: string;
    referredUserId: string;
    referralCode: string;
  }): { success: boolean; referral?: ReferralRecord; error?: string } {
    const { referrerId, referredUserId, referralCode } = params;

    // 1. Anti-Self Referral Check
    if (referrerId === referredUserId) {
      return { success: false, error: "Self-referrals are strictly prohibited" };
    }

    // 2. Prevent Duplicate Referral Claims
    const existing = referralsStore.find((r) => r.referredUserId === referredUserId);
    if (existing) {
      return { success: false, error: "Customer has already claimed a referral" };
    }

    const record: ReferralRecord = {
      id: `REF-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      referrerId,
      referredUserId,
      referralCode,
      status: "PENDING",
      rewardAmount: 200, // ₹200 bonus upon first qualifying order
      createdAt: new Date().toISOString(),
    };

    referralsStore.push(record);
    return { success: true, referral: record };
  }

  /**
   * Qualifies referral upon first successful delivered order
   */
  static qualifyReferral(referredUserId: string): { success: boolean; rewardAwarded?: number } {
    const ref = referralsStore.find((r) => r.referredUserId === referredUserId && r.status === "PENDING");
    if (!ref) return { success: false };

    ref.status = "QUALIFIED";

    // Award loyalty points to referrer
    LoyaltyPointsEngine.awardPoints({
      userId: ref.referrerId,
      source: "REFERRAL",
      points: 500, // 500 points (₹50 value)
      description: `Referral reward for inviting friend (${referredUserId})`,
    });

    ref.status = "REWARDED";
    return { success: true, rewardAwarded: ref.rewardAmount };
  }
}

// -------------------------------------------------------------------------
// 4. MEMBERSHIP TIERS ENGINE
// -------------------------------------------------------------------------

export class MembershipTierEngine {
  /**
   * Calculates membership tier and benefits based on annual spending & points
   */
  static getTier(annualSpendINR: number, lifetimePoints: number): {
    tier: MembershipTier;
    pointMultiplier: number;
    freeExpressShipping: boolean;
    prioritySupport: boolean;
    exclusiveSales: boolean;
  } {
    if (annualSpendINR >= 150000 || lifetimePoints >= 15000) {
      return {
        tier: "PLATINUM",
        pointMultiplier: 2.0,
        freeExpressShipping: true,
        prioritySupport: true,
        exclusiveSales: true,
      };
    }

    if (annualSpendINR >= 50000 || lifetimePoints >= 5000) {
      return {
        tier: "GOLD",
        pointMultiplier: 1.5,
        freeExpressShipping: true,
        prioritySupport: true,
        exclusiveSales: true,
      };
    }

    if (annualSpendINR >= 10000 || lifetimePoints >= 1000) {
      return {
        tier: "SILVER",
        pointMultiplier: 1.25,
        freeExpressShipping: false,
        prioritySupport: false,
        exclusiveSales: true,
      };
    }

    return {
      tier: "BRONZE",
      pointMultiplier: 1.0,
      freeExpressShipping: false,
      prioritySupport: false,
      exclusiveSales: false,
    };
  }
}
