import { PrismaClient } from "@prisma/client";
import { HOMEPAGE_EXEMPLAR_PIPELINE, syncHomepagePipeline } from "../src/lib/seed-homepage";
import { getDefaultHomepageSections } from "../src/lib/page-builder";

const prisma = new PrismaClient();

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

async function runHomepageLayoutFlowTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — HOMEPAGE 10-STEP LAYOUT PIPELINE TEST SUITE");
  console.log("=======================================================================\n");

  try {
    const expectedPipeline = [
      { step: 1, name: "Hero Banner", type: "HERO_BANNER" },
      { step: 2, name: "USP Section", type: "TRUST_BADGES" },
      { step: 3, name: "Flash Deals", type: "FLASH_DEALS" },
      { step: 4, name: "Categories", type: "CATEGORY_CAROUSEL" },
      { step: 5, name: "Featured Products", type: "FEATURED_PRODUCTS" },
      { step: 6, name: "Top Vendors", type: "TOP_VENDORS" },
      { step: 7, name: "Deals", type: "DEALS" },
      { step: 8, name: "Recently Viewed", type: "RECENTLY_VIEWED" },
      { step: 9, name: "Blog", type: "BLOG_POSTS" },
      { step: 10, name: "Newsletter", type: "NEWSLETTER" },
    ];

    console.log("--- PHASE 1: VERIFYING IN-MEMORY PIPELINE SEQUENCE ---");
    assert(HOMEPAGE_EXEMPLAR_PIPELINE.length === 10, "Exemplar pipeline contains exactly 10 sections");

    expectedPipeline.forEach((exp, idx) => {
      const actual = HOMEPAGE_EXEMPLAR_PIPELINE[idx];
      assert(actual.type === exp.type, `Step ${exp.step}: ${exp.name} matches widget type ${exp.type}`);
      assert(actual.sortOrder === idx, `  - Correct sortOrder index: ${idx}`);
    });

    console.log("\n--- PHASE 2: VERIFYING DEFAULT FALLBACK SECTIONS ---");
    const defaultSections = getDefaultHomepageSections();
    assert(defaultSections.length === 10, "Default sections fallback contains 10 sections");
    defaultSections.forEach((sec, idx) => {
      const exp = expectedPipeline[idx];
      assert(sec.type === exp.type, `Default Step ${exp.step}: ${exp.name} matches (${sec.type})`);
    });

    console.log("\n--- PHASE 3: DATABASE SEED & PERSISTENCE ---");
    await syncHomepagePipeline(prisma);

    const homePage = await prisma.pageConfig.findFirst({
      where: { OR: [{ slug: "home" }, { isHomepage: true }] },
      include: {
        sections: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    assert(homePage !== null, "Homepage PageConfig exists in database");
    assert(homePage!.sections.length >= 10, `Database contains ${homePage!.sections.length} homepage sections`);

    console.log("\n=======================================================================");
    console.log(`Homepage Layout Flow Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (error) {
    console.error("Test execution error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runHomepageLayoutFlowTests();
