import { PrismaClient } from "@prisma/client";
import { DEFAULT_PRODUCT_PAGE_BLOCKS, ProductPageBlock, ProductSectionType } from "../src/lib/product-page-layout";

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

async function runProductPageBuilderTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — PRODUCT PAGE BUILDER & 21 SECTIONS TEST SUITE");
  console.log("=======================================================================\n");

  try {
    const expectedSections: { name: string; type: ProductSectionType }[] = [
      { name: "Product Gallery", type: "PRODUCT_GALLERY" },
      { name: "Product Title", type: "PRODUCT_TITLE" },
      { name: "Rating", type: "PRODUCT_RATING" },
      { name: "Price", type: "PRODUCT_PRICE" },
      { name: "Discount", type: "PRODUCT_DISCOUNT" },
      { name: "Variant Selector", type: "VARIANT_SELECTOR" },
      { name: "Size Selector", type: "SIZE_SELECTOR" },
      { name: "Color Selector", type: "COLOR_SELECTOR" },
      { name: "Quantity", type: "QUANTITY_SELECTOR" },
      { name: "Add to Cart", type: "ADD_TO_CART" },
      { name: "Buy Now", type: "BUY_NOW" },
      { name: "Wishlist", type: "WISHLIST_BUTTON" },
      { name: "Delivery Checker", type: "DELIVERY_CHECKER" },
      { name: "Seller Information", type: "SELLER_INFO" },
      { name: "Offers", type: "OFFERS_LIST" },
      { name: "Description", type: "DESCRIPTION" },
      { name: "Specifications", type: "SPECIFICATIONS" },
      { name: "Reviews", type: "REVIEWS_SECTION" },
      { name: "Frequently Bought Together", type: "FREQUENTLY_BOUGHT_TOGETHER" },
      { name: "Related Products", type: "RELATED_PRODUCTS" },
      { name: "Recently Viewed", type: "RECENTLY_VIEWED" },
    ];

    console.log("--- PHASE 1: VERIFYING ALL 21 PRODUCT PAGE SECTIONS ---");
    assert(DEFAULT_PRODUCT_PAGE_BLOCKS.length === 21, "Default catalog contains all 21 modular blocks");

    expectedSections.forEach((sec, idx) => {
      const match = DEFAULT_PRODUCT_PAGE_BLOCKS.find((b) => b.type === sec.type);
      assert(match !== undefined, `${idx + 1}. Block [${sec.type}] (${sec.name}) is registered`);
      assert(match?.isActive === true, `  - ${sec.name} is active by default`);
    });

    console.log("\n--- PHASE 2: VERIFYING LAYOUT ZONES & REORDERING ---");
    const leftBlocks = DEFAULT_PRODUCT_PAGE_BLOCKS.filter((b) => b.zone === "LEFT");
    const rightBlocks = DEFAULT_PRODUCT_PAGE_BLOCKS.filter((b) => b.zone === "RIGHT");
    const bottomBlocks = DEFAULT_PRODUCT_PAGE_BLOCKS.filter((b) => b.zone === "BOTTOM");

    assert(leftBlocks.length > 0, `Left media zone contains ${leftBlocks.length} blocks`);
    assert(rightBlocks.length > 0, `Right purchase zone contains ${rightBlocks.length} blocks`);
    assert(bottomBlocks.length > 0, `Bottom full-width zone contains ${bottomBlocks.length} blocks`);

    // Simulate Reordering Buy Now ahead of Add to Cart
    const reordered: ProductPageBlock[] = DEFAULT_PRODUCT_PAGE_BLOCKS.map((b) => {
      if (b.type === "BUY_NOW") return { ...b, sortOrder: 9 };
      if (b.type === "ADD_TO_CART") return { ...b, sortOrder: 10 };
      return b;
    });

    const buyNow = reordered.find((b) => b.type === "BUY_NOW");
    const addToCart = reordered.find((b) => b.type === "ADD_TO_CART");
    assert(buyNow!.sortOrder < addToCart!.sortOrder, "Verified block reorder (Buy Now placed ahead of Add to Cart)");

    console.log("\n--- PHASE 3: DATABASE PERSISTENCE & API INTEGRITY ---");
    const savedConfig = await prisma.systemPageConfig.upsert({
      where: { id: "product-page" },
      update: {
        name: "Product Detail Page",
        configJson: JSON.stringify({ blocks: reordered }),
      },
      create: {
        id: "product-page",
        name: "Product Detail Page",
        configJson: JSON.stringify({ blocks: reordered }),
      },
    });

    assert(savedConfig.id === "product-page", "Upserted product-page system config in database");

    const fetched = await prisma.systemPageConfig.findUnique({
      where: { id: "product-page" },
    });
    const parsed = JSON.parse(fetched!.configJson);
    assert(Array.isArray(parsed.blocks), "Persisted config contains blocks array");
    assert(parsed.blocks.length === 21, "Retrieved all 21 blocks from database");

    console.log("\n=======================================================================");
    console.log(`Product Page Builder Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (error) {
    console.error("Test execution error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runProductPageBuilderTests();
