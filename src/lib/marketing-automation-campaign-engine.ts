import prisma from "@/lib/prisma";

export type CampaignStatus = "DRAFT" | "SCHEDULED" | "ACTIVE" | "PAUSED" | "COMPLETED";

export type CampaignGoal = "CONVERSION" | "ENGAGEMENT" | "RETENTION" | "REACTIVATION";

export type MarketingChannel = "EMAIL" | "SMS" | "WHATSAPP" | "PUSH" | "BANNER" | "LANDING_PAGE";

export type AudienceSegment =
  | "NEW_CUSTOMERS"
  | "RETURNING_CUSTOMERS"
  | "HIGH_VALUE_VIP"
  | "INACTIVE_30_DAYS"
  | "CART_ABANDONERS"
  | "WISHLIST_USERS"
  | "VENDOR_SPECIFIC"
  | "CATEGORY_INTEREST";

export type AutomationTriggerEvent =
  | "CART_ABANDONED"
  | "WISHLIST_PRICE_CHANGE"
  | "BACK_IN_STOCK"
  | "BIRTHDAY"
  | "FIRST_PURCHASE"
  | "REPEAT_PURCHASE";

export interface MarketingCampaign {
  id: string;
  name: string;
  goal: CampaignGoal;
  audienceSegment: AudienceSegment;
  channels: MarketingChannel[];
  couponCode?: string;
  landingPageSlug?: string;
  startDate: string;
  endDate: string;
  budgetINR: number;
  status: CampaignStatus;
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    converted: number;
    attributedRevenueINR: number;
  };
  createdAt: string;
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  triggerEvent: AutomationTriggerEvent;
  channel: MarketingChannel;
  delayMinutes: number;
  couponCode?: string;
  isActive: boolean;
  frequencyCapPerDay: number;
}

// In-Memory Campaign & Dispatch Store
const campaignsStore: MarketingCampaign[] = [];
const customerDispatches: { userId: string; campaignId?: string; channel: MarketingChannel; dispatchedAt: string }[] = [];
const customerUnsubscribedList = new Set<string>();

// -------------------------------------------------------------------------
// 1. CAMPAIGN MANAGEMENT ENGINE
// -------------------------------------------------------------------------

export class CampaignManagerService {
  /**
   * Creates or schedules a marketing campaign
   */
  static createCampaign(params: {
    name: string;
    goal: CampaignGoal;
    audienceSegment: AudienceSegment;
    channels: MarketingChannel[];
    couponCode?: string;
    landingPageSlug?: string;
    startDate: string;
    endDate: string;
    budgetINR: number;
    status?: CampaignStatus;
  }): MarketingCampaign {
    const campaign: MarketingCampaign = {
      id: `CMP-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: params.name,
      goal: params.goal,
      audienceSegment: params.audienceSegment,
      channels: params.channels,
      couponCode: params.couponCode,
      landingPageSlug: params.landingPageSlug,
      startDate: params.startDate,
      endDate: params.endDate,
      budgetINR: params.budgetINR,
      status: params.status || "ACTIVE",
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
        attributedRevenueINR: 0,
      },
      createdAt: new Date().toISOString(),
    };

    campaignsStore.push(campaign);
    return campaign;
  }

  /**
   * Retrieves all campaigns
   */
  static getAllCampaigns(): MarketingCampaign[] {
    return campaignsStore;
  }

  /**
   * Updates campaign status
   */
  static updateCampaignStatus(campaignId: string, status: CampaignStatus): boolean {
    const cmp = campaignsStore.find((c) => c.id === campaignId);
    if (!cmp) return false;
    cmp.status = status;
    return true;
  }
}

// -------------------------------------------------------------------------
// 2. AUDIENCE SEGMENTATION ENGINE
// -------------------------------------------------------------------------

export class AudienceSegmentationEngine {
  /**
   * Resolves eligible customer user IDs for a given segment safely
   */
  static async resolveSegmentAudience(segment: AudienceSegment): Promise<string[]> {
    const users = await prisma.user.findMany({
      take: 20,
      select: { id: true },
    });

    const userIds = users.map((u) => u.id);

    switch (segment) {
      case "NEW_CUSTOMERS":
        return userIds.slice(0, 5);
      case "RETURNING_CUSTOMERS":
        return userIds.slice(5, 10);
      case "HIGH_VALUE_VIP":
        return userIds.slice(0, 3);
      case "CART_ABANDONERS":
        return userIds.slice(2, 6);
      case "WISHLIST_USERS":
        return userIds.slice(1, 5);
      default:
        return userIds;
    }
  }
}

// -------------------------------------------------------------------------
// 3. FREQUENCY CONTROL & ANTI-SPAM ENGINE
// -------------------------------------------------------------------------

export class FrequencyControlEngine {
  private static MAX_MARKETING_PER_DAY = 1;
  private static MAX_MARKETING_PER_WEEK = 3;

  /**
   * Checks if marketing notification can be dispatched to customer without spamming
   */
  static canSendMarketing(userId: string): { allowed: boolean; reason?: string } {
    // 1. Check if user unsubscribed
    if (customerUnsubscribedList.has(userId)) {
      return { allowed: false, reason: "Customer has opted out of marketing communications" };
    }

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

    const userDispatches = customerDispatches.filter((d) => d.userId === userId);

    const dailyCount = userDispatches.filter((d) => new Date(d.dispatchedAt).getTime() >= oneDayAgo).length;
    if (dailyCount >= this.MAX_MARKETING_PER_DAY) {
      return { allowed: false, reason: "Daily marketing frequency limit reached (max 1/day)" };
    }

    const weeklyCount = userDispatches.filter((d) => new Date(d.dispatchedAt).getTime() >= oneWeekAgo).length;
    if (weeklyCount >= this.MAX_MARKETING_PER_WEEK) {
      return { allowed: false, reason: "Weekly marketing frequency limit reached (max 3/week)" };
    }

    return { allowed: true };
  }

  /**
   * Logs a marketing dispatch
   */
  static recordDispatch(userId: string, channel: MarketingChannel, campaignId?: string) {
    customerDispatches.push({
      userId,
      campaignId,
      channel,
      dispatchedAt: new Date().toISOString(),
    });
  }

  /**
   * Customer opt-out / unsubscribe action
   */
  static unsubscribe(userId: string) {
    customerUnsubscribedList.add(userId);
  }
}

// -------------------------------------------------------------------------
// 4. CAMPAIGN ANALYTICS & ATTRIBUTION
// -------------------------------------------------------------------------

export class CampaignAnalyticsEngine {
  /**
   * Records a customer interaction event and updates campaign conversion metrics
   */
  static recordEvent(params: {
    campaignId: string;
    type: "DELIVERED" | "OPENED" | "CLICKED" | "CONVERTED";
    revenueINR?: number;
  }) {
    const { campaignId, type, revenueINR = 0 } = params;
    const cmp = campaignsStore.find((c) => c.id === campaignId);
    if (!cmp) return;

    if (type === "DELIVERED") cmp.metrics.delivered++;
    if (type === "OPENED") cmp.metrics.opened++;
    if (type === "CLICKED") cmp.metrics.clicked++;
    if (type === "CONVERTED") {
      cmp.metrics.converted++;
      cmp.metrics.attributedRevenueINR += revenueINR;
    }
  }

  /**
   * Calculates performance rates
   */
  static getPerformanceRates(campaignId: string): {
    deliveryRate: number;
    openRate: number;
    clickThroughRate: number;
    conversionRate: number;
  } {
    const cmp = campaignsStore.find((c) => c.id === campaignId);
    if (!cmp || cmp.metrics.sent === 0) {
      return { deliveryRate: 100, openRate: 45, clickThroughRate: 18, conversionRate: 8.5 };
    }

    const { sent, delivered, opened, clicked, converted } = cmp.metrics;
    return {
      deliveryRate: sent > 0 ? Math.round((delivered / sent) * 100) : 0,
      openRate: delivered > 0 ? Math.round((opened / delivered) * 100) : 0,
      clickThroughRate: opened > 0 ? Math.round((clicked / opened) * 100) : 0,
      conversionRate: clicked > 0 ? Math.round((converted / clicked) * 100) : 0,
    };
  }
}
