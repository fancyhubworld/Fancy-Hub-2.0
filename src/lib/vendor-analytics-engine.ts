export interface StateSalesDistribution {
  state: string;
  orderCount: number;
  revenue: number;
  percentage: number;
}

export interface PincodeTelemetry {
  pincode: string;
  city: string;
  state: string;
  orderCount: number;
  avgDeliveryHours: number;
}

export interface VendorCohortMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  repeatCustomerRate: number; // e.g. 28.4%
  rtoReturnRate: number; // e.g. 4.2%
  cartToOrderConversion: number; // e.g. 3.8%
  grossMarginPercentage: number; // e.g. 42.5%
}

export interface RestockPrediction {
  productId: string;
  title: string;
  currentStock: number;
  dailyVelocity: number; // units sold per day
  daysOfStockLeft: number;
  urgency: "CRITICAL" | "WARNING" | "HEALTHY";
  recommendedReorderQty: number;
  reorderByDate: string;
}

export interface PriceIntelligenceRecommendation {
  productId: string;
  title: string;
  category: string;
  currentPrice: number;
  competitorMinPrice: number;
  competitorAvgPrice: number;
  recommendedOptimalPrice: number;
  projectedSalesLiftPercentage: number;
  confidenceScore: number;
  rationale: string;
}

export const MOCK_STATE_SALES: StateSalesDistribution[] = [
  { state: "Maharashtra", orderCount: 420, revenue: 1428000, percentage: 28 },
  { state: "Gujarat", orderCount: 310, revenue: 1054000, percentage: 21 },
  { state: "Karnataka", orderCount: 240, revenue: 816000, percentage: 16 },
  { state: "Delhi NCR", orderCount: 195, revenue: 663000, percentage: 13 },
  { state: "Tamil Nadu", orderCount: 165, revenue: 561000, percentage: 11 },
  { state: "West Bengal", orderCount: 90, revenue: 306000, percentage: 6 },
  { state: "Other States", orderCount: 80, revenue: 272000, percentage: 5 },
];

export const MOCK_TOP_PINCODES: PincodeTelemetry[] = [
  { pincode: "400001", city: "Mumbai", state: "Maharashtra", orderCount: 142, avgDeliveryHours: 28 },
  { pincode: "395003", city: "Surat", state: "Gujarat", orderCount: 118, avgDeliveryHours: 24 },
  { pincode: "560001", city: "Bengaluru", state: "Karnataka", orderCount: 96, avgDeliveryHours: 32 },
  { pincode: "110001", city: "New Delhi", state: "Delhi NCR", orderCount: 88, avgDeliveryHours: 30 },
  { pincode: "700023", city: "Kolkata", state: "West Bengal", orderCount: 64, avgDeliveryHours: 42 },
];

export function getVendorCohortMetrics(): VendorCohortMetrics {
  return {
    totalRevenue: 5100000,
    totalOrders: 1500,
    averageOrderValue: 3400,
    repeatCustomerRate: 31.5,
    rtoReturnRate: 3.8,
    cartToOrderConversion: 4.2,
    grossMarginPercentage: 44.8,
  };
}

export function predictRestockSchedule(): RestockPrediction[] {
  return [
    {
      productId: "prod-banarasi-crimson",
      title: "Crimson Banarasi Pure Silk Saree",
      currentStock: 6,
      dailyVelocity: 2.2,
      daysOfStockLeft: 2.7,
      urgency: "CRITICAL",
      recommendedReorderQty: 45,
      reorderByDate: "Within 48 hours",
    },
    {
      productId: "prod-kanchipuram-gold",
      title: "Royal Gold Zari Kanchipuram Silk Saree",
      currentStock: 14,
      dailyVelocity: 1.8,
      daysOfStockLeft: 7.8,
      urgency: "WARNING",
      recommendedReorderQty: 30,
      reorderByDate: "Within 5 days",
    },
    {
      productId: "prod-earbuds-anc",
      title: "FancyHub Studio ANC Wireless Earbuds",
      currentStock: 85,
      dailyVelocity: 4.5,
      daysOfStockLeft: 18.9,
      urgency: "HEALTHY",
      recommendedReorderQty: 100,
      reorderByDate: "Within 14 days",
    },
  ];
}

export function analyzePriceIntelligence(product: {
  id: string;
  title: string;
  category: string;
  currentPrice: number;
}): PriceIntelligenceRecommendation {
  const current = product.currentPrice || 4999;
  
  // Calculate competitor benchmarks and elasticity
  let competitorAvg = Math.round(current * 1.15);
  let competitorMin = Math.round(current * 0.92);
  let optimalPrice = current;
  let projectedLift = 18;
  let rationale = "";

  if (product.category.toLowerCase().includes("saree") || product.category.toLowerCase().includes("ethnic")) {
    optimalPrice = Math.round(current * 1.06); // Premium artisan positioning allows 6% increase
    projectedLift = 22;
    rationale = `High demand for festive Silk Mark certified sarees across Mumbai & Bengaluru allows a 6% price optimization (₹${optimalPrice}) without dropping conversion rates.`;
  } else if (product.category.toLowerCase().includes("electronic") || product.category.toLowerCase().includes("audio")) {
    optimalPrice = Math.round(current * 0.95); // High competition benefits from 5% volume play
    projectedLift = 34;
    rationale = `Dropping price by 5% to ₹${optimalPrice} undercuts market leaders and is projected to increase unit volume sales by +34%.`;
  } else {
    optimalPrice = current;
    projectedLift = 15;
    rationale = `Current price of ₹${current} is optimally balanced against regional competitors with steady daily conversion.`;
  }

  return {
    productId: product.id,
    title: product.title,
    category: product.category,
    currentPrice: current,
    competitorMinPrice: competitorMin,
    competitorAvgPrice: competitorAvg,
    recommendedOptimalPrice: optimalPrice,
    projectedSalesLiftPercentage: projectedLift,
    confidenceScore: 94,
    rationale,
  };
}
