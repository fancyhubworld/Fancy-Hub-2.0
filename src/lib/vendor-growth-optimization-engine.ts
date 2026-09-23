/**
 * FancyHub.in — Phase 43: Vendor Growth & Marketplace Optimization Engine
 * 
 * Centralized vendor scorecards, multi-tenant performance analytics,
 * health status classification (HEALTHY, WATCH, AT_RISK), weak/top product intelligence,
 * catalog completeness scoring, and personalized growth recommendations.
 */

// =========================================================================
// 1. TYPES & DATA STRUCTURES
// =========================================================================

export type VendorHealthStatus = "HEALTHY" | "WATCH" | "AT_RISK";

export interface VendorPerformanceMetrics {
  vendorId: string;
  vendorName: string;
  monthlyGmvINR: number;
  conversionRatePercent: number;
  averageRating: number; // 1.0 - 5.0
  returnRatePercent: number;
  cancellationRatePercent: number;
  onTimeDispatchPercent: number;
  inStockRatePercent: number;
  compositeScore: number; // 0 - 100
  healthStatus: VendorHealthStatus;
}

export interface VendorProductPerformance {
  productId: string;
  title: string;
  salesCount: number;
  revenueINR: number;
  returnCount: number;
  returnRatePercent: number;
  stockCount: number;
  rating: number;
  classification: "TOP_PERFORMER" | "AVERAGE" | "UNDERPERFORMING";
  actionAdvice: string;
}

export interface VendorGrowthRecommendation {
  id: string;
  category: "PRICING" | "INVENTORY" | "CATALOG_QUALITY" | "PROMOTION";
  title: string;
  description: string;
  potentialGmvImpactPercent: number;
  actionUrl: string;
}

export interface VendorMarketplaceReport {
  metrics: VendorPerformanceMetrics;
  topProducts: VendorProductPerformance[];
  weakProducts: VendorProductPerformance[];
  lowStockProducts: VendorProductPerformance[];
  returnReasonsBreakdown: Array<{ reason: string; percentage: number }>;
  growthRecommendations: VendorGrowthRecommendation[];
  catalogCompletenessScorePercent: number;
}

// In-Memory Vendor Performance Store
const vendorMetricsStore: Map<string, VendorPerformanceMetrics> = new Map();

// Initialize Mock Vendor Data
function initVendorMetrics() {
  if (vendorMetricsStore.size > 0) return;

  const defaultVendors: VendorPerformanceMetrics[] = [
    {
      vendorId: "vendor-surat-silk",
      vendorName: "Surat Silk Mills",
      monthlyGmvINR: 1450000,
      conversionRatePercent: 4.8,
      averageRating: 4.7,
      returnRatePercent: 3.2,
      cancellationRatePercent: 0.8,
      onTimeDispatchPercent: 98.5,
      inStockRatePercent: 96.0,
      compositeScore: 92,
      healthStatus: "HEALTHY",
    },
    {
      vendorId: "vendor-mumbai-craft",
      vendorName: "Mumbai Handcrafts Co.",
      monthlyGmvINR: 620000,
      conversionRatePercent: 2.9,
      averageRating: 4.1,
      returnRatePercent: 8.5,
      cancellationRatePercent: 3.2,
      onTimeDispatchPercent: 89.0,
      inStockRatePercent: 82.0,
      compositeScore: 71,
      healthStatus: "WATCH",
    },
    {
      vendorId: "vendor-delhi-fashions",
      vendorName: "Delhi Trends & Apparel",
      monthlyGmvINR: 280000,
      conversionRatePercent: 1.6,
      averageRating: 3.4,
      returnRatePercent: 18.5, // High returns!
      cancellationRatePercent: 8.4,
      onTimeDispatchPercent: 74.0,
      inStockRatePercent: 68.0,
      compositeScore: 48,
      healthStatus: "AT_RISK",
    },
  ];

  for (const v of defaultVendors) {
    vendorMetricsStore.set(v.vendorId, v);
  }
}

initVendorMetrics();

// =========================================================================
// 2. VENDOR SCORECARD & HEALTH CLASSIFICATION ENGINE
// =========================================================================

export class VendorPerformanceEngine {
  /**
   * Computes composite vendor score (0-100) and health classification
   */
  static calculateScorecard(params: {
    monthlyGmvINR: number;
    conversionRatePercent: number;
    averageRating: number;
    returnRatePercent: number;
    cancellationRatePercent: number;
    onTimeDispatchPercent: number;
    inStockRatePercent: number;
  }): { compositeScore: number; healthStatus: VendorHealthStatus } {
    const {
      conversionRatePercent,
      averageRating,
      returnRatePercent,
      cancellationRatePercent,
      onTimeDispatchPercent,
      inStockRatePercent,
    } = params;

    // Weights:
    // Rating (25%), On-time dispatch (25%), In-Stock (20%), Low Returns (15%), Low Cancellation (15%)
    const ratingScore = (averageRating / 5.0) * 25;
    const dispatchScore = (onTimeDispatchPercent / 100) * 25;
    const stockScore = (inStockRatePercent / 100) * 20;
    const returnPenaltyScore = Math.max(0, 15 - (returnRatePercent / 20) * 15);
    const cancelPenaltyScore = Math.max(0, 15 - (cancellationRatePercent / 10) * 15);

    const total = Math.round(ratingScore + dispatchScore + stockScore + returnPenaltyScore + cancelPenaltyScore);
    const compositeScore = Math.min(100, Math.max(0, total));

    let healthStatus: VendorHealthStatus = "HEALTHY";
    if (compositeScore < 60 || returnRatePercent > 15.0) {
      healthStatus = "AT_RISK";
    } else if (compositeScore < 80) {
      healthStatus = "WATCH";
    }

    return { compositeScore, healthStatus };
  }

  /**
   * Compiles comprehensive marketplace report for a specific vendor (Tenant-isolated)
   */
  static getVendorMarketplaceReport(vendorId: string, requestingVendorId: string): VendorMarketplaceReport {
    // Multi-tenant isolation guard
    if (vendorId !== requestingVendorId && requestingVendorId !== "ADMIN_GLOBAL") {
      throw new Error("Unauthorized: Access to another vendor's performance metrics is strictly forbidden");
    }

    let metrics = vendorMetricsStore.get(vendorId);
    if (!metrics) {
      metrics = {
        vendorId,
        vendorName: "New Marketplace Partner",
        monthlyGmvINR: 0,
        conversionRatePercent: 0,
        averageRating: 5.0,
        returnRatePercent: 0,
        cancellationRatePercent: 0,
        onTimeDispatchPercent: 100,
        inStockRatePercent: 100,
        compositeScore: 85,
        healthStatus: "HEALTHY",
      };
    }

    const topProducts: VendorProductPerformance[] = [
      {
        productId: "p-royal-saree",
        title: "Royal Gold Zari Kanchipuram Silk Saree",
        salesCount: 142,
        revenueINR: 212858,
        returnCount: 3,
        returnRatePercent: 2.1,
        stockCount: 45,
        rating: 4.9,
        classification: "TOP_PERFORMER",
        actionAdvice: "High demand product. Ensure inventory replenishment to prevent stockouts.",
      },
    ];

    const weakProducts: VendorProductPerformance[] = [
      {
        productId: "p-chiffon-dupatta",
        title: "Embroidered Chiffon Dupatta",
        salesCount: 18,
        revenueINR: 14400,
        returnCount: 5,
        returnRatePercent: 27.7,
        stockCount: 3,
        rating: 3.1,
        classification: "UNDERPERFORMING",
        actionAdvice: "High return rate due to color variance. Update high-resolution studio photos.",
      },
    ];

    const lowStockProducts: VendorProductPerformance[] = [
      {
        productId: "p-chiffon-dupatta",
        title: "Embroidered Chiffon Dupatta",
        salesCount: 18,
        revenueINR: 14400,
        returnCount: 5,
        returnRatePercent: 27.7,
        stockCount: 3, // < 5 units
        rating: 3.1,
        classification: "UNDERPERFORMING",
        actionAdvice: "Critical stock level (< 5 units).",
      },
    ];

    const returnReasonsBreakdown = [
      { reason: "Size / Fit Mismatch", percentage: 48.0 },
      { reason: "Color / Pattern Variance from Photo", percentage: 28.0 },
      { reason: "Fabric Quality / Texture Expectation", percentage: 14.0 },
      { reason: "Changed Mind / Delayed Delivery", percentage: 10.0 },
    ];

    const growthRecommendations: VendorGrowthRecommendation[] = [
      {
        id: "REC-CATALOG-01",
        category: "CATALOG_QUALITY",
        title: "Add Size Charts & Fabric GSM to Saree Listings",
        description: "Products with dimensional size guides experience 45% fewer returns.",
        potentialGmvImpactPercent: 18.5,
        actionUrl: "/vendor/products",
      },
      {
        id: "REC-PROMO-02",
        category: "PROMOTION",
        title: "Join Upcoming Festive Diwali Mega Sale",
        description: "Nominate eligible festive sarees to receive 3x marketplace banner visibility.",
        potentialGmvImpactPercent: 35.0,
        actionUrl: "/vendor/promotions",
      },
      {
        id: "REC-STOCK-03",
        category: "INVENTORY",
        title: "Restock Top Sellers Before Weekend Rush",
        description: "Replenish Kanchipuram Silk inventory to maintain 98%+ in-stock SLA.",
        potentialGmvImpactPercent: 12.0,
        actionUrl: "/vendor/inventory",
      },
    ];

    return {
      metrics,
      topProducts,
      weakProducts,
      lowStockProducts,
      returnReasonsBreakdown,
      growthRecommendations,
      catalogCompletenessScorePercent: 88.0,
    };
  }
}
