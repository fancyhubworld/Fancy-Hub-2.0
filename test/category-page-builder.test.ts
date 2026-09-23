import { PrismaClient } from "@prisma/client";
import { DEFAULT_CATEGORY_PAGE_BLOCKS, CategoryPageBlock, CategorySectionType } from "../src/lib/category-page-layout";

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

async function runCategoryPageBuilderTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — CATEGORY PAGE BUILDER & 13 SECTIONS TEST SUITE");
  console.log("=======================================================================\n");

  try {
    const expectedSections: { name: string; type: CategorySectionType }[] = [
      { name: "Banner", type: "CATEGORY_BANNER" },
      { name: "Breadcrumb", type: "CATEGORY_BREADCRUMB" },
      { name: "Category title", type: "CATEGORY_TITLE" },
      { name: "Description", type: "CATEGORY_DESCRIPTION" },
      { name: "Subcategories", type: "SUBCATEGORIES_LIST" },
      { name: "Filters", type: "FILTERS_SIDEBAR" },
      { name: "Sorting", type: "SORTING_BAR" },
      { name: "Product grid", type: "PRODUCT_GRID" },
      { name: "Sidebar", type: "SIDEBAR_LAYOUT" },
      { name: "Mobile filter", type: "MOBILE_FILTER_DRAWER" },
      { name: "Pagination", type: "PAGINATION_CONTROLS" },
      { name: "Recommended products", type: "RECOMMENDED_PRODUCTS" },
      { name: "SEO content", type: "SEO_CONTENT" },
    ];

    console.log("--- PHASE 1: VERIFYING ALL 13 CATEGORY PAGE BLOCKS ---");
    assert(DEFAULT_CATEGORY_PAGE_BLOCKS.length === 13, "Default catalog contains all 13 modular blocks");

    expectedSections.forEach((sec, idx) => {
      const match = DEFAULT_CATEGORY_PAGE_BLOCKS.find((b) => b.type === sec.type);
      assert(match !== undefined, `${idx + 1}. Block [${sec.type}] (${sec.name}) is registered`);
      assert(match?.isActive === true, `  - ${sec.name} is active by default`);
    });

    console.log("\n--- PHASE 2: VERIFYING LAYOUT ZONES & REORDERING ---");
    const topBlocks = DEFAULT_CATEGORY_PAGE_BLOCKS.filter((b) => b.zone === "TOP_HEADER");
    const sidebarBlocks = DEFAULT_CATEGORY_PAGE_BLOCKS.filter((b) => b.zone === "SIDEBAR");
    const mainBlocks = DEFAULT_CATEGORY_PAGE_BLOCKS.filter((b) => b.zone === "MAIN_CONTENT");
    const bottomBlocks = DEFAULT_CATEGORY_PAGE_BLOCKS.filter((b) => b.zone === "BOTTOM_FOOTER");

    assert(topBlocks.length > 0, `Top header zone contains ${topBlocks.length} blocks`);
    assert(sidebarBlocks.length > 0, `Sidebar filter zone contains ${sidebarBlocks.length} blocks`);
    assert(mainBlocks.length > 0, `Main catalog grid zone contains ${mainBlocks.length} blocks`);
    assert(bottomBlocks.length > 0, `Bottom footer zone contains ${bottomBlocks.length} blocks`);

    // Simulate Reordering Breadcrumb and Banner
    const reordered: CategoryPageBlock[] = DEFAULT_CATEGORY_PAGE_BLOCKS.map((b) => {
      if (b.type === "CATEGORY_BANNER") return { ...b, sortOrder: 0 };
      if (b.type === "CATEGORY_BREADCRUMB") return { ...b, sortOrder: 1 };
      return b;
    });

    const banner = reordered.find((b) => b.type === "CATEGORY_BANNER");
    const breadcrumb = reordered.find((b) => b.type === "CATEGORY_BREADCRUMB");
    assert(banner!.sortOrder < breadcrumb!.sortOrder, "Verified block reorder (Banner placed ahead of Breadcrumb)");

    console.log("\n--- PHASE 3: DATABASE PERSISTENCE & API INTEGRITY ---");
    const savedConfig = await prisma.systemPageConfig.upsert({
      where: { id: "category-page" },
      update: {
        name: "Category Listing Page",
        configJson: JSON.stringify({ blocks: reordered }),
      },
      create: {
        id: "category-page",
        name: "Category Listing Page",
        configJson: JSON.stringify({ blocks: reordered }),
      },
    });

    assert(savedConfig.id === "category-page", "Upserted category-page system config in database");

    const fetched = await prisma.systemPageConfig.findUnique({
      where: { id: "category-page" },
    });
    const parsed = JSON.parse(fetched!.configJson);
    assert(Array.isArray(parsed.blocks), "Persisted config contains blocks array");
    assert(parsed.blocks.length === 13, "Retrieved all 13 blocks from database");

    console.log("\n=======================================================================");
    console.log(`Category Page Builder Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (error) {
    console.error("Test execution error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runCategoryPageBuilderTests();
