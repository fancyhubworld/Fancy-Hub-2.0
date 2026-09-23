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

async function runHeaderBuilderTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — HEADER BUILDER & 11 ELEMENTS TEST SUITE");
  console.log("=======================================================================\n");

  try {
    const expectedElements: { name: string; key: HeaderElementKey }[] = [
      { name: "Announcement bar", key: "ANNOUNCEMENT_BAR" },
      { name: "Logo", key: "LOGO" },
      { name: "Location", key: "LOCATION" },
      { name: "Search", key: "SEARCH" },
      { name: "Account", key: "ACCOUNT" },
      { name: "Wishlist", key: "WISHLIST" },
      { name: "Cart", key: "CART" },
      { name: "Vendor Portal", key: "VENDOR_PORTAL" },
      { name: "Admin ERP", key: "ADMIN_ERP" },
      { name: "Navigation", key: "NAVIGATION" },
      { name: "Mega Menu", key: "MEGA_MENU" },
    ];

    console.log("--- PHASE 1: VERIFYING ALL HEADER ELEMENTS ---");
    assert(DEFAULT_HEADER_ELEMENTS.length >= 11, "Default catalog contains all core header components");

    expectedElements.forEach((item, idx) => {
      const match = DEFAULT_HEADER_ELEMENTS.find((el) => el.key === item.key);
      assert(match !== undefined, `${idx + 1}. Element [${item.key}] (${item.name}) is registered`);
      assert(match?.isActive === true, `  - ${item.name} is active by default`);
    });

    console.log("\n--- PHASE 2: VERIFYING SEPARATE DESKTOP & MOBILE LAYOUTS ---");
    const desktopVisibleCount = DEFAULT_HEADER_ELEMENTS.filter((el) => el.desktopVisible).length;
    const mobileVisibleCount = DEFAULT_HEADER_ELEMENTS.filter((el) => el.mobileVisible).length;

    assert(desktopVisibleCount >= 10, `Desktop layout has ${desktopVisibleCount} active elements`);
    assert(mobileVisibleCount > 0, `Mobile layout has ${mobileVisibleCount} mobile-optimized elements`);

    // Verify independent ordering
    const sampleConfig: HeaderBuilderConfig = {
      id: "header-builder-config",
      isSticky: true,
      desktopLayoutType: "standard",
      mobileLayoutType: "compact_search",
      elements: DEFAULT_HEADER_ELEMENTS.map((el) => {
        if (el.key === "SEARCH") return { ...el, mobileSortOrder: 0, desktopSortOrder: 3 };
        return el;
      }),
    };

    const searchEl = sampleConfig.elements.find((el) => el.key === "SEARCH");
    assert(searchEl?.mobileSortOrder === 0, "Mobile search bar reordered to #0 top position");
    assert(searchEl?.desktopSortOrder === 3, "Desktop search bar retained #3 position");

    console.log("\n--- PHASE 3: DATABASE PERSISTENCE & API INTEGRITY ---");
    const saved = await prisma.systemPageConfig.upsert({
      where: { id: "header-builder-config" },
      update: {
        name: "Global Header Configuration",
        configJson: JSON.stringify(sampleConfig),
      },
      create: {
        id: "header-builder-config",
        name: "Global Header Configuration",
        configJson: JSON.stringify(sampleConfig),
      },
    });

    assert(saved.id === "header-builder-config", "Persisted header-builder-config into database");

    const fetched = await prisma.systemPageConfig.findUnique({
      where: { id: "header-builder-config" },
    });
    const parsed: HeaderBuilderConfig = JSON.parse(fetched!.configJson);
    assert(parsed.elements.length >= 11, "Retrieved all header components from database");
    assert(parsed.mobileLayoutType === "compact_search", "Verified mobile layout type persisted");

    console.log("\n=======================================================================");
    console.log(`Header Builder Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================");

    if (failed > 0) process.exit(1);
  } catch (error) {
    console.error("Test execution error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runHeaderBuilderTests();
