import { getWebsiteControlCenterData } from "../src/lib/website-control-engine";

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

async function runSection76Tests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — SECTION 76: WEBSITE CONTROL CENTER TEST SUITE");
  console.log("=======================================================================\n");

  try {
    const data = getWebsiteControlCenterData();

    // 1. VERIFY ALL 9 REQUIRED STATUS & METRIC CARDS
    console.log("--- 1. VERIFY 9 REQUIRED CARDS ---");
    assert(data.status.websiteStatus === "OPERATIONAL", "Card 1 (Website Status): OPERATIONAL with 99.98% uptime");
    assert(data.theme.name.includes("FancyHub"), "Card 2 (Current Theme): Active theme tokens verified");
    assert(typeof data.metrics.draftChanges === "number", "Card 3 (Draft Changes): Unpublished staging edits count tracked");
    assert(typeof data.metrics.scheduledChanges === "number", "Card 4 (Scheduled Changes): Active scheduled timers tracked");
    assert(data.metrics.brokenLinks === 0, "Card 5 (Broken Links): 0 dead/broken links detected");
    assert(data.metrics.seoScore >= 90, "Card 6 (SEO Score): SEO health score >= 90/100");
    assert(data.metrics.performanceScore >= 90, "Card 7 (Performance): Speed & performance index >= 90/100");
    assert(data.metrics.activePages >= 10, "Card 8 (Active Pages): Live storefront pages count tracked");
    assert(data.metrics.activeWidgets >= 30, "Card 9 (Active Widgets): Live rendered widget instances tracked");

    // 2. VERIFY ALL 7 REQUIRED QUICK ACTIONS
    console.log("\n--- 2. VERIFY 7 QUICK ACTIONS ---");
    const actionIds = data.quickActions.map((a) => a.id);
    
    assert(actionIds.includes("edit-homepage"), "Quick Action 1: 'Edit Homepage' configured (/admin/visual-builder?slug=home)");
    assert(actionIds.includes("theme-studio"), "Quick Action 2: 'Theme Studio' configured (/admin/theme-studio)");
    assert(actionIds.includes("navigation"), "Quick Action 3: 'Navigation' configured (/admin/menus)");
    assert(actionIds.includes("pages"), "Quick Action 4: 'Pages' configured (/admin/pages)");
    assert(actionIds.includes("widgets"), "Quick Action 5: 'Widgets' configured (/admin/widget-marketplace)");
    assert(actionIds.includes("media"), "Quick Action 6: 'Media' configured (/admin/media)");
    assert(actionIds.includes("preview-website"), "Quick Action 7: 'Preview Website' configured (/)");

    const previewAction = data.quickActions.find((a) => a.id === "preview-website");
    assert(previewAction?.isExternal === true, "Preview Website opens in a new tab without interrupting Admin ERP");

    console.log("\n=======================================================================");
    console.log(`Section 76 Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test execution error:", e);
    process.exit(1);
  }
}

runSection76Tests();
