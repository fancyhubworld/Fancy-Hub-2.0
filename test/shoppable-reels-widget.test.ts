import { WIDGET_REGISTRY } from "../src/lib/widget-registry";
import { getShoppableReels, SHOPPABLE_REELS_CATALOG } from "../src/lib/shoppable-reels-engine";

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

async function runShoppableReelsTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN 2.0 — LIVE VIDEO COMMERCE & SHOPPABLE REELS SUITE");
  console.log("=======================================================================\n");

  try {
    // -----------------------------------------------------------------------
    // 1. WIDGET REGISTRY INTEGRATION
    // -----------------------------------------------------------------------
    console.log("--- 1. WIDGET REGISTRY INTEGRATION ---");
    const reelsDef = WIDGET_REGISTRY["SHOPPABLE_REELS"];
    assert(reelsDef !== undefined, "SHOPPABLE_REELS widget is registered in WIDGET_REGISTRY");
    assert(reelsDef.category === "social", "Widget categorized under 'social' category");
    assert(reelsDef.defaultResponsive.desktop?.columns === 4, "Configured 4 columns for desktop viewports");
    assert(reelsDef.defaultResponsive.mobile?.columns === 2, "Configured 2 columns for mobile viewports");

    const liveVideoDef = WIDGET_REGISTRY["LIVE_VIDEO_COMMERCE"];
    assert(liveVideoDef !== undefined, "LIVE_VIDEO_COMMERCE widget is registered in WIDGET_REGISTRY");

    // -----------------------------------------------------------------------
    // 2. REELS CATALOG & MODEL INTEGRITY
    // -----------------------------------------------------------------------
    console.log("\n--- 2. REELS CATALOG & MODEL INTEGRITY ---");
    assert(SHOPPABLE_REELS_CATALOG.length >= 4, `Catalog contains ${SHOPPABLE_REELS_CATALOG.length} shoppable video reels`);

    const firstReel = SHOPPABLE_REELS_CATALOG[0];
    assert(firstReel.videoUrl.startsWith("http"), "Reel contains valid streamable video URL");
    assert(firstReel.thumbnailUrl.startsWith("http"), "Reel contains 9:16 high-res thumbnail preview");
    assert(firstReel.isVerifiedWeaver === true, "Master weaver verification badge flag present");
    assert(firstReel.viewCount > 10000, `Reel view count verified: ${firstReel.viewCount}`);

    // -----------------------------------------------------------------------
    // 3. TAGGED PRODUCT INTERACTIVE OVERLAYS
    // -----------------------------------------------------------------------
    console.log("\n--- 3. TAGGED PRODUCT INTERACTIVE OVERLAYS ---");
    const taggedProduct = firstReel.taggedProduct;
    assert(taggedProduct.title.includes("Banarasi"), "Tagged product title matches Banarasi Silk Saree");
    assert(taggedProduct.price === 4999, `Tagged product price matches ₹${taggedProduct.price}`);
    assert(taggedProduct.discountPercentage > 30, `Calculated discount badge (${taggedProduct.discountPercentage}% OFF)`);
    assert(taggedProduct.inStock === true, "Product stock availability verified");

    // -----------------------------------------------------------------------
    // 4. CATEGORY FILTERING & PAGINATION
    // -----------------------------------------------------------------------
    console.log("\n--- 4. CATEGORY FILTERING & PAGINATION ---");
    const sareeReels = getShoppableReels({ category: "sarees" });
    assert(sareeReels.length >= 2, `Retrieved ${sareeReels.length} saree weaving video reels`);
    assert(sareeReels.every((r) => r.category === "sarees"), "All filtered reels strictly match 'sarees' category");

    const limitedReels = getShoppableReels({ limit: 2 });
    assert(limitedReels.length === 2, "Pagination limit applied correctly (2 reels returned)");

    console.log("\n=======================================================================");
    console.log(`Shoppable Reels Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test execution error:", e);
    process.exit(1);
  }
}

runShoppableReelsTests();
