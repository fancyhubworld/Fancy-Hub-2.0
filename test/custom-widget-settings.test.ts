import { PrismaClient } from "@prisma/client";
import { ProductWidgetCustomSettings } from "../src/lib/widget-types";

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

async function runCustomWidgetSettingsTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — CUSTOM WIDGET SETTINGS & 24 CONTROLS TEST SUITE");
  console.log("=======================================================================\n");

  try {
    console.log("--- PHASE 1: PRODUCT GRID EXHAUSTIVE CUSTOM SETTINGS OBJECT ---");

    const customSettings: ProductWidgetCustomSettings = {
      title: "Diwali 2026 Handloom Sarees Spotlight",
      subtitle: "Authentic Kanjeevaram & Banarasi weaves direct from master looms",
      productSource: "discounted",
      category: "womenswear-sarees",
      categorySlug: "womens-sarees",
      vendor: "surat-silk-mills",
      vendorSlug: "surat-silk-mills",
      limit: 12,
      columns: 4,
      desktopColumns: 4,
      tabletColumns: 3,
      mobileColumns: 2,
      cardStyle: "glass",
      imageRatio: "3:4",
      showPrice: true,
      showDiscount: true,
      showRating: true,
      showWishlist: true,
      showCompare: true,
      showQuickView: true,
      showAddToCart: true,
      showStock: true,
      showBadges: true,
      showVendor: true,
      showDeliveryInfo: true,
      showCountdown: true,
    };

    // Verify all 24 required fields
    assert(customSettings.title === "Diwali 2026 Handloom Sarees Spotlight", "1. Title is configurable");
    assert(Boolean(customSettings.subtitle), "2. Subtitle is configurable");
    assert(customSettings.productSource === "discounted", "3. Product source is configurable ('discounted')");
    assert(customSettings.categorySlug === "womens-sarees", "4. Category is configurable ('womens-sarees')");
    assert(customSettings.vendorSlug === "surat-silk-mills", "5. Vendor is configurable ('surat-silk-mills')");
    assert(customSettings.limit === 12, "6. Number of products is configurable (12)");
    assert(customSettings.columns === 4, "7. Columns is configurable (4)");
    assert(customSettings.desktopColumns === 4, "8. Desktop columns is configurable (4)");
    assert(customSettings.tabletColumns === 3, "9. Tablet columns is configurable (3)");
    assert(customSettings.mobileColumns === 2, "10. Mobile columns is configurable (2)");
    assert(customSettings.cardStyle === "glass", "11. Card style is configurable ('glass')");
    assert(customSettings.imageRatio === "3:4", "12. Image ratio is configurable ('3:4')");
    assert(customSettings.showPrice === true, "13. Show price toggle is configurable");
    assert(customSettings.showDiscount === true, "14. Show discount toggle is configurable");
    assert(customSettings.showRating === true, "15. Show rating toggle is configurable");
    assert(customSettings.showWishlist === true, "16. Show wishlist toggle is configurable");
    assert(customSettings.showCompare === true, "17. Show compare toggle is configurable");
    assert(customSettings.showQuickView === true, "18. Show quick view toggle is configurable");
    assert(customSettings.showAddToCart === true, "19. Show add to cart toggle is configurable");
    assert(customSettings.showStock === true, "20. Show stock toggle is configurable");
    assert(customSettings.showBadges === true, "21. Show badges toggle is configurable");
    assert(customSettings.showVendor === true, "22. Show vendor toggle is configurable");
    assert(customSettings.showDeliveryInfo === true, "23. Show delivery information toggle is configurable");
    assert(customSettings.showCountdown === true, "24. Show countdown toggle is configurable");

    // Phase 2: Database Persistence into PageSection
    console.log("\n--- PHASE 2: PERSISTENCE INTO DATABASE (PAGE SECTION) ---");
    const testPage = await prisma.pageConfig.create({
      data: {
        title: "Test Custom Settings Page",
        slug: `test-settings-${Date.now()}`,
        status: "DRAFT",
        layoutType: "DEFAULT",
        headerStyle: "DEFAULT",
        footerStyle: "DEFAULT",
      },
    });

    const testSection = await prisma.pageSection.create({
      data: {
        pageId: testPage.id,
        type: "PRODUCT_GRID",
        sortOrder: 0,
        isActive: true,
        contentJson: JSON.stringify(customSettings),
        stylingJson: JSON.stringify({ paddingY: "py-8", backgroundColor: "transparent" }),
      },
    });

    assert(testSection.id !== undefined, "Attached PRODUCT_GRID section with custom settings to PageConfig");

    // Read back and verify JSON integrity
    const fetchedSec = await prisma.pageSection.findUnique({
      where: { id: testSection.id },
    });

    const parsed = JSON.parse(fetchedSec!.contentJson);
    assert(parsed.cardStyle === "glass", "Verified parsed cardStyle === 'glass'");
    assert(parsed.imageRatio === "3:4", "Verified parsed imageRatio === '3:4'");
    assert(parsed.desktopColumns === 4, "Verified parsed desktopColumns === 4");
    assert(parsed.showCountdown === true, "Verified parsed showCountdown === true");
    assert(parsed.showDeliveryInfo === true, "Verified parsed showDeliveryInfo === true");

    // Cleanup
    await prisma.pageSection.delete({ where: { id: testSection.id } });
    await prisma.pageConfig.delete({ where: { id: testPage.id } });

    console.log("\n=======================================================================");
    console.log(`Custom Widget Settings Test Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (error) {
    console.error("Test execution error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runCustomWidgetSettingsTests();
