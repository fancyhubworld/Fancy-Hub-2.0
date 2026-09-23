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

async function runMobileHeaderTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — SECTION 15: MOBILE HEADER BUILDER TEST SUITE");
  console.log("=======================================================================\n");

  try {
    console.log("--- PHASE 1: INDEPENDENT MOBILE CONFIGURATION CONTRACT ---");
    const mobileElements = DEFAULT_HEADER_ELEMENTS.filter((el) => el.mobileVisible).sort(
      (a, b) => a.mobileSortOrder - b.mobileSortOrder
    );

    console.log(
      "Default Mobile Sequence:",
      mobileElements.map((el) => el.name).join(" → ")
    );

    const hamburger = DEFAULT_HEADER_ELEMENTS.find((el) => el.key === "HAMBURGER_MENU");
    assert(hamburger !== undefined, "Hamburger Menu (☰) is registered");
    assert(hamburger?.mobileVisible === true, "Hamburger Menu is visible on Mobile");
    assert(hamburger?.desktopVisible === false, "Hamburger Menu is hidden on Desktop (Desktop uses navbar ribbon)");

    const vendorPortal = DEFAULT_HEADER_ELEMENTS.find((el) => el.key === "VENDOR_PORTAL");
    assert(vendorPortal?.desktopVisible === true, "Vendor Portal is visible on Desktop");
    assert(vendorPortal?.mobileVisible === false, "Vendor Portal is hidden on Mobile by default to save screen space");

    console.log("\n--- PHASE 2: MOBILE INDEPENDENT REORDERING & VISIBILITY TOGGLING ---");
    // Example: Admin selects exactly 5 elements for mobile header: ☰ → Logo → Search → Wishlist → Cart
    const targetMobileKeys: HeaderElementKey[] = [
      "HAMBURGER_MENU",
      "LOGO",
      "SEARCH",
      "WISHLIST",
      "CART",
    ];

    const customMobileConfig: HeaderBuilderConfig = {
      id: "header-builder-config",
      isSticky: true,
      desktopLayoutType: "standard",
      mobileLayoutType: "standard",
      elements: DEFAULT_HEADER_ELEMENTS.map((el) => {
        const isSelected = targetMobileKeys.includes(el.key);
        const mobileIdx = targetMobileKeys.indexOf(el.key);
        return {
          ...el,
          mobileVisible: isSelected,
          mobileSortOrder: isSelected ? mobileIdx : 99,
        };
      }),
    };

    const activeMobile = customMobileConfig.elements
      .filter((el) => el.mobileVisible)
      .sort((a, b) => a.mobileSortOrder - b.mobileSortOrder);

    assert(activeMobile.length === 5, "5 elements specifically selected for Mobile header");
    assert(activeMobile[0].key === "HAMBURGER_MENU", "1. Mobile item #1: ☰ (Hamburger Menu)");
    assert(activeMobile[1].key === "LOGO", "2. Mobile item #2: Logo");
    assert(activeMobile[2].key === "SEARCH", "3. Mobile item #3: Search");
    assert(activeMobile[3].key === "WISHLIST", "4. Mobile item #4: Wishlist");
    assert(activeMobile[4].key === "CART", "5. Mobile item #5: Cart");

    // Verify desktop is not mutated
    const activeDesktop = customMobileConfig.elements.filter((el) => el.desktopVisible);
    assert(activeDesktop.length >= 10, "Desktop retains all its 10+ standard elements intact");

    console.log("\n--- PHASE 3: DATABASE PERSISTENCE & API SYNCHRONIZATION ---");
    await prisma.systemPageConfig.upsert({
      where: { id: "header-builder-config" },
      update: {
        name: "Global Header Configuration",
        configJson: JSON.stringify(customMobileConfig),
      },
      create: {
        id: "header-builder-config",
        name: "Global Header Configuration",
        configJson: JSON.stringify(customMobileConfig),
      },
    });

    const fetched = await prisma.systemPageConfig.findUnique({
      where: { id: "header-builder-config" },
    });
    const parsed: HeaderBuilderConfig = JSON.parse(fetched!.configJson);

    const savedMobile = parsed.elements
      .filter((el) => el.mobileVisible)
      .sort((a, b) => a.mobileSortOrder - b.mobileSortOrder);

    assert(savedMobile.length === 5, "Retrieved 5 active mobile elements from database");
    assert(savedMobile[0].key === "HAMBURGER_MENU", "Persistent ☰ Hamburger Menu trigger");
    assert(savedMobile[1].key === "LOGO", "Persistent Logo on Mobile");
    assert(savedMobile[2].key === "SEARCH", "Persistent Search on Mobile");
    assert(savedMobile[3].key === "WISHLIST", "Persistent Wishlist on Mobile");
    assert(savedMobile[4].key === "CART", "Persistent Cart on Mobile");

    console.log("\n=======================================================================");
    console.log(`Mobile Header Builder Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test execution failed:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runMobileHeaderTests();
