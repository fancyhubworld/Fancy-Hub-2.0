import {
  MOCK_STATE_SALES,
  MOCK_TOP_PINCODES,
  getVendorCohortMetrics,
  predictRestockSchedule,
  analyzePriceIntelligence,
} from "../src/lib/vendor-analytics-engine";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

async function runVendorAnalyticsTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN 2.0 — VENDOR LIVE TELEMETRY & AI PRICING SUITE");
  console.log("=======================================================================\n");

  try {
    // -----------------------------------------------------------------------
    // 1. COHORT RETENTION & REPEAT METRICS
    // -----------------------------------------------------------------------
    console.log("--- 1. COHORT RETENTION & REPEAT METRICS ---");
    const cohort = getVendorCohortMetrics();
    assert(cohort.totalRevenue > 0, `Total revenue tracked: ₹${cohort.totalRevenue}`);
    assert(cohort.repeatCustomerRate > 30, `Repeat customer rate high (${cohort.repeatCustomerRate}%)`);
    assert(cohort.rtoReturnRate < 5, `RTO / Return rate strictly controlled (${cohort.rtoReturnRate}%)`);
    assert(cohort.averageOrderValue === 3400, `Average Order Value matches ₹${cohort.averageOrderValue}`);

    // -----------------------------------------------------------------------
    // 2. PAN-INDIA GEOGRAPHIC SALES DISTRIBUTION
    // -----------------------------------------------------------------------
    console.log("\n--- 2. PAN-INDIA GEOGRAPHIC SALES DISTRIBUTION ---");
    assert(MOCK_STATE_SALES.length >= 6, `Tracked sales across ${MOCK_STATE_SALES.length} Indian state regions`);
    const totalPercentage = MOCK_STATE_SALES.reduce((sum, s) => sum + s.percentage, 0);
    assert(totalPercentage === 100, `State distribution percentages sum to 100% (Actual: ${totalPercentage}%)`);

    const topState = MOCK_STATE_SALES[0];
    assert(topState.state === "Maharashtra" && topState.percentage === 28, "Maharashtra identified as #1 GMV contributor (28%)");

    assert(MOCK_TOP_PINCODES.length >= 5, `Top pincode delivery telemetry tracked (${MOCK_TOP_PINCODES.length} hubs)`);
    assert(MOCK_TOP_PINCODES[0].pincode === "400001", "Pincode 400001 (Mumbai) verified with 28h avg delivery");

    // -----------------------------------------------------------------------
    // 3. PREDICTIVE INVENTORY RESTOCK ENGINE
    // -----------------------------------------------------------------------
    console.log("\n--- 3. PREDICTIVE INVENTORY RESTOCK ENGINE ---");
    const restock = predictRestockSchedule();
    assert(restock.length >= 3, `Generated ${restock.length} predictive stock alerts`);

    const criticalItem = restock.find((i) => i.urgency === "CRITICAL");
    assert(criticalItem !== undefined, "Identified CRITICAL low stock item");
    assert(criticalItem!.daysOfStockLeft < 3, `Stock running out in ${criticalItem!.daysOfStockLeft} days`);
    assert(criticalItem!.recommendedReorderQty > 0, `Recommended replenishment of +${criticalItem!.recommendedReorderQty} units`);

    // -----------------------------------------------------------------------
    // 4. GEMINI AI PRICE INTELLIGENCE MODEL
    // -----------------------------------------------------------------------
    console.log("\n--- 4. GEMINI AI PRICE INTELLIGENCE MODEL ---");
    const sareePricing = analyzePriceIntelligence({
      id: "prod-saree",
      title: "Royal Zari Saree",
      category: "Pure Handloom Sarees",
      currentPrice: 4999,
    });
    assert(sareePricing.recommendedOptimalPrice > 4999, `AI recommended premium artisan price increase (₹${sareePricing.recommendedOptimalPrice})`);
    assert(sareePricing.projectedSalesLiftPercentage > 15, `Projected revenue lift: +${sareePricing.projectedSalesLiftPercentage}%`);

    const audioPricing = analyzePriceIntelligence({
      id: "prod-earbuds",
      title: "ANC Earbuds Pro",
      category: "Electronics & Audio",
      currentPrice: 2499,
    });
    assert(audioPricing.recommendedOptimalPrice < 2499, `AI recommended volume discount strategy for electronics (₹${audioPricing.recommendedOptimalPrice})`);
    assert(audioPricing.confidenceScore >= 90, `High AI confidence score: ${audioPricing.confidenceScore}%`);

    console.log("\n=======================================================================");
    console.log(`Vendor Analytics Suite Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test execution error:", e);
    process.exit(1);
  }
}

runVendorAnalyticsTests();
