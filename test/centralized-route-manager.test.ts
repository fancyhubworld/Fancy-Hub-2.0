import { performSystemRouteAudit, testRouteTarget } from "../src/lib/route-manager-engine";

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

async function runRouteManagerTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN 2.0 — CENTRALIZED DYNAMIC ROUTE MANAGER SUITE");
  console.log("=======================================================================\n");

  try {
    // -----------------------------------------------------------------------
    // 1. SYSTEM-WIDE ROUTE HEALTH AUDIT
    // -----------------------------------------------------------------------
    console.log("--- 1. SYSTEM-WIDE ROUTE HEALTH AUDIT ---");
    const audit = await performSystemRouteAudit();
    assert(audit.totalRoutesScanned > 0, `Scanned ${audit.totalRoutesScanned} dynamic database routes across platform`);
    assert(audit.criticalErrors === 0, `Zero critical slug conflicts or circular loops detected (Found: ${audit.criticalErrors})`);
    assert(audit.isValid === true, "Pre-publish route validation passed (isValid: true)");

    // -----------------------------------------------------------------------
    // 2. STATIC & DYNAMIC URL RESOLUTION SIMULATOR
    // -----------------------------------------------------------------------
    console.log("\n--- 2. STATIC & DYNAMIC URL RESOLUTION SIMULATOR ---");
    
    // Static Routes
    const shopTest = await testRouteTarget("/shop");
    assert(shopTest.statusCode === 200 && shopTest.isAvailable === true, "Verified static /shop route (200 OK)");

    const offersTest = await testRouteTarget("/offers");
    assert(offersTest.statusCode === 200 && offersTest.isAvailable === true, "Verified static /offers route (200 OK)");

    const flashTest = await testRouteTarget("/flash-sale");
    assert(flashTest.statusCode === 200 && flashTest.isAvailable === true, "Verified static /flash-sale route (200 OK)");

    // Category Routes
    const catTest = await testRouteTarget("/category/fashion");
    assert(catTest.statusCode === 200 || catTest.statusCode === 301, `Resolved category route /category/fashion (${catTest.statusCode})`);

    // 404 Dead Link Detection
    const deadLinkTest = await testRouteTarget("/category/non-existent-broken-slug-9999");
    assert(deadLinkTest.statusCode === 404 && deadLinkTest.isAvailable === false, "Identified non-existent category as 404");

    const blankLinkTest = await testRouteTarget("#");
    assert(blankLinkTest.statusCode === 404, "Caught blank hash (#) link target");

    console.log("\n=======================================================================");
    console.log(`Route Manager Test Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test execution error:", e);
    process.exit(1);
  }
}

runRouteManagerTests();
