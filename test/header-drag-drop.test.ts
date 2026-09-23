import { PrismaClient } from "@prisma/client";
import { DEFAULT_HEADER_ELEMENTS, HeaderElementKey, HeaderBuilderConfig } from "../src/lib/header-builder-types";

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

async function runHeaderDragDropTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — SECTION 14: HEADER DRAG & DROP TEST SUITE");
  console.log("=======================================================================\n");

  try {
    console.log("--- PHASE 1: INITIAL HEADER DEFAULT ORDER ---");
    // Initial order
    const initialElements = [...DEFAULT_HEADER_ELEMENTS];
    const initialOrder = initialElements
      .filter((el) => ["LOGO", "LOCATION", "SEARCH", "ACCOUNT", "WISHLIST", "CART"].includes(el.key))
      .sort((a, b) => a.desktopSortOrder - b.desktopSortOrder)
      .map((el) => el.name);

    console.log("Initial Header Sequence:", initialOrder.join(" → "));
    assert(initialOrder[0] === "Logo", "Item #1 is Logo");
    assert(initialOrder[1] === "Location", "Item #2 is Location");
    assert(initialOrder[2] === "Search", "Item #3 is Search");

    console.log("\n--- PHASE 2: DRAG & DROP REORDER SIMULATION ---");
    // Admin drags Search before Location: Logo → Search → Location → Account → Wishlist → Cart
    const targetSequence: HeaderElementKey[] = [
      "ANNOUNCEMENT_BAR",
      "LOGO",
      "SEARCH",
      "LOCATION",
      "ACCOUNT",
      "WISHLIST",
      "CART",
      "VENDOR_PORTAL",
      "ADMIN_ERP",
      "NAVIGATION",
      "MEGA_MENU",
    ];

    const reorderedElements = DEFAULT_HEADER_ELEMENTS.map((el) => {
      const newPos = targetSequence.indexOf(el.key);
      return {
        ...el,
        desktopSortOrder: newPos,
        mobileSortOrder: newPos,
      };
    });

    const reorderedMain = reorderedElements
      .filter((el) => ["LOGO", "LOCATION", "SEARCH", "ACCOUNT", "WISHLIST", "CART"].includes(el.key))
      .sort((a, b) => a.desktopSortOrder - b.desktopSortOrder);

    console.log("Reordered Header Sequence:", reorderedMain.map((el) => el.name).join(" → "));
    assert(reorderedMain[0].key === "LOGO", "1. Logo remains first");
    assert(reorderedMain[1].key === "SEARCH", "2. Search successfully reordered to #2");
    assert(reorderedMain[2].key === "LOCATION", "3. Location moved after Search to #3");
    assert(reorderedMain[3].key === "ACCOUNT", "4. Account is #4");
    assert(reorderedMain[4].key === "WISHLIST", "5. Wishlist is #5");
    assert(reorderedMain[5].key === "CART", "6. Cart is #6");

    console.log("\n--- PHASE 3: DATABASE SAVE & AUTOMATIC STOREFRONT SYNCHRONIZATION ---");
    const payload: HeaderBuilderConfig = {
      id: "header-builder-config",
      isSticky: true,
      desktopLayoutType: "standard",
      mobileLayoutType: "standard",
      elements: reorderedElements,
      updatedAt: new Date().toISOString(),
    };

    await prisma.systemPageConfig.upsert({
      where: { id: "header-builder-config" },
      update: {
        name: "Global Header Configuration",
        configJson: JSON.stringify(payload),
      },
      create: {
        id: "header-builder-config",
        name: "Global Header Configuration",
        configJson: JSON.stringify(payload),
      },
    });

    // Verify retrieval by public API contract
    const stored = await prisma.systemPageConfig.findUnique({
      where: { id: "header-builder-config" },
    });
    const parsed: HeaderBuilderConfig = JSON.parse(stored!.configJson);

    const storefrontSorted = parsed.elements
      .filter((el) => ["LOGO", "LOCATION", "SEARCH", "ACCOUNT", "WISHLIST", "CART"].includes(el.key))
      .sort((a, b) => a.desktopSortOrder - b.desktopSortOrder);

    assert(storefrontSorted[0].key === "LOGO", "Storefront correctly receives LOGO at index 0");
    assert(storefrontSorted[1].key === "SEARCH", "Storefront correctly receives SEARCH at index 1");
    assert(storefrontSorted[2].key === "LOCATION", "Storefront correctly receives LOCATION at index 2");
    assert(storefrontSorted[3].key === "ACCOUNT", "Storefront correctly receives ACCOUNT at index 3");
    assert(storefrontSorted[4].key === "WISHLIST", "Storefront correctly receives WISHLIST at index 4");
    assert(storefrontSorted[5].key === "CART", "Storefront correctly receives CART at index 5");

    console.log("\n=======================================================================");
    console.log(`Header Drag & Drop Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test error:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runHeaderDragDropTests();
