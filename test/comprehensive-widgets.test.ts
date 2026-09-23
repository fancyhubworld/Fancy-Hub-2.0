import { PrismaClient } from "@prisma/client";
import { WIDGET_REGISTRY, WIDGET_CATEGORIES } from "../src/lib/widget-registry";
import { WidgetType } from "../src/lib/widget-types";

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

async function runComprehensiveWidgetTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — COMPREHENSIVE 40+ WIDGET ARCHITECTURE TEST SUITE");
  console.log("=======================================================================\n");

  try {
    // 1. Verify 8 Categories
    console.log("--- PHASE 1: WIDGET CATEGORIES INTEGRITY ---");
    assert(WIDGET_CATEGORIES.length === 8, `Registered 8 distinct widget categories (found ${WIDGET_CATEGORIES.length})`);
    const categoryIds = WIDGET_CATEGORIES.map((c) => c.id);
    assert(categoryIds.includes("content"), "Category 'content' is registered");
    assert(categoryIds.includes("ecommerce"), "Category 'ecommerce' is registered");
    assert(categoryIds.includes("category"), "Category 'category' is registered");
    assert(categoryIds.includes("vendor"), "Category 'vendor' is registered");
    assert(categoryIds.includes("marketing"), "Category 'marketing' is registered");
    assert(categoryIds.includes("trust"), "Category 'trust' is registered");
    assert(categoryIds.includes("social"), "Category 'social' is registered");
    assert(categoryIds.includes("utility"), "Category 'utility' is registered");

    // 2. Verify Required Widgets in Registry
    console.log("\n--- PHASE 2: WIDGET REGISTRY DEFINITION AUDIT ---");
    const requiredWidgets: WidgetType[] = [
      // Content (8)
      "TEXT", "HEADING", "RICH_TEXT", "IMAGE", "VIDEO", "ICON", "BUTTON", "HTML_BLOCK",
      // E-commerce (13)
      "PRODUCT_GRID", "PRODUCT_CAROUSEL", "PRODUCT_SLIDER", "PRODUCT_CARD", "FLASH_DEALS",
      "BEST_SELLERS", "NEW_ARRIVALS", "FEATURED_PRODUCTS", "TRENDING_PRODUCTS", "RECENTLY_VIEWED",
      "RECOMMENDED_PRODUCTS", "DEALS", "WISHLIST_PRODUCTS",
      // Category (5)
      "CATEGORY_GRID", "CATEGORY_CAROUSEL", "CATEGORY_CARDS", "FEATURED_CATEGORIES", "MEGA_CATEGORY_MENU",
      // Vendor (5)
      "VENDOR_GRID", "TOP_VENDORS", "FEATURED_VENDORS", "VENDOR_STORE_CARD", "VENDOR_PRODUCTS",
      // Marketing (9)
      "HERO_BANNER", "PROMO_BANNER", "COUPON_BANNER", "COUNTDOWN_TIMER", "ANNOUNCEMENT_BAR",
      "OFFER_STRIP", "FESTIVAL_BANNER", "NEWSLETTER", "CTA_BANNER",
      // Trust (5)
      "FAST_DELIVERY", "SECURE_PAYMENTS", "TRUSTED_VENDORS", "EASY_RETURNS", "TRUST_BADGES",
      // Social & Content (6)
      "BLOG_POSTS", "TESTIMONIALS", "FAQ", "REVIEWS", "INSTAGRAM_GALLERY", "BRAND_LOGOS",
      // Utility (10)
      "SEARCH", "BREADCRUMBS", "PAGINATION", "FILTERS", "SORT",
      "RECENTLY_VIEWED_UTILITY", "COMPARE_TRAY", "WISHLIST_BUTTON", "CART_SUMMARY", "ACCOUNT_SUMMARY"
    ];

    console.log(`Auditing ${requiredWidgets.length} required widgets...`);
    for (const wType of requiredWidgets) {
      const def = WIDGET_REGISTRY[wType];
      assert(def !== undefined, `Widget '${wType}' is registered in WIDGET_REGISTRY`);
      assert(def.name.length > 0, `  └─ Name: ${def.name}`);
      assert(def.defaultSettings !== undefined, `  └─ Has defaultSettings`);
      assert(def.defaultStyle !== undefined, `  └─ Has defaultStyle`);
      assert(def.defaultResponsive !== undefined, `  └─ Has defaultResponsive`);
      assert(def.defaultDataSource !== undefined, `  └─ Has defaultDataSource`);
    }

    // 3. Database Persistence with Universal Schema
    console.log("\n--- PHASE 3: UNIVERSAL DATABASE WIDGET PERSISTENCE ---");
    const testPage = await prisma.pageConfig.upsert({
      where: { slug: "test-widget-architecture-page" },
      update: { title: "Universal Widget Test Page" },
      create: {
        slug: "test-widget-architecture-page",
        title: "Universal Widget Test Page",
        description: "Validating universal widget schema in SQLite",
        isHomepage: false,
        status: "DRAFT",
      },
    });
    assert(testPage.id !== undefined, "Test page created for widget persistence");

    // Insert widget with all universal fields:
    // id, type, name, status, settings, style, responsiveSettings, dataSource, visibilityRules, sortOrder, createdAt, updatedAt
    const widgetInstance = await prisma.pageSection.create({
      data: {
        pageId: testPage.id,
        type: "PRODUCT_GRID",
        name: "Diwali Trending Sarees Grid",
        status: "ACTIVE",
        sortOrder: 0,
        isActive: true,
        desktopVisible: true,
        mobileVisible: true,
        title: "Trending Banarasi Sarees",
        subtitle: "Handcrafted Zari Silk from Varanasi",
        badgeText: "HOT DEAL",
        settings: JSON.stringify({ columns: 4, limit: 8, showViewAll: true }),
        style: JSON.stringify({ backgroundColor: "#0A1128", paddingY: "py-8", borderRadius: "rounded-3xl" }),
        responsiveSettings: JSON.stringify({
          desktop: { columns: 4, paddingY: "py-8" },
          tablet: { columns: 3 },
          mobile: { columns: 2, paddingY: "py-4" },
        }),
        dataSource: JSON.stringify({ type: "PRODUCTS", filter: "trending", limit: 8 }),
        visibilityRules: JSON.stringify({ desktop: true, tablet: true, mobile: true, userRole: "ALL" }),
        contentJson: JSON.stringify({ columns: 4, limit: 8 }),
        stylingJson: JSON.stringify({ paddingY: "py-8" }),
      },
    });

    assert(widgetInstance.id !== undefined, "Widget persisted with universal schema");
    assert(widgetInstance.name === "Diwali Trending Sarees Grid", "Widget name matches");
    assert(widgetInstance.status === "ACTIVE", "Widget status matches ACTIVE");
    assert(JSON.parse(widgetInstance.settings!).columns === 4, "Widget settings parsed correctly");
    assert(JSON.parse(widgetInstance.style!).backgroundColor === "#0A1128", "Widget style parsed correctly");
    assert(JSON.parse(widgetInstance.responsiveSettings!).mobile.columns === 2, "Widget responsiveSettings parsed correctly");
    assert(JSON.parse(widgetInstance.dataSource!).filter === "trending", "Widget dataSource filter parsed correctly");
    assert(JSON.parse(widgetInstance.visibilityRules!).userRole === "ALL", "Widget visibilityRules parsed correctly");

    // 4. Update widget fields independently
    const updatedWidget = await prisma.pageSection.update({
      where: { id: widgetInstance.id },
      data: {
        name: "Updated Flash Sale Grid",
        status: "SCHEDULED",
        sortOrder: 3,
        isActive: false,
        settings: JSON.stringify({ columns: 5, limit: 10 }),
      },
    });
    assert(updatedWidget.name === "Updated Flash Sale Grid", "Widget name updated");
    assert(updatedWidget.status === "SCHEDULED", "Widget status updated to SCHEDULED");
    assert(updatedWidget.sortOrder === 3, "Widget sortOrder updated to 3");
    assert(updatedWidget.isActive === false, "Widget isActive updated to false");

    // 5. Cleanup
    await prisma.pageConfig.delete({ where: { id: testPage.id } });
    console.log("\n🧹 Test cleanup complete.");

    console.log("=======================================================================");
    console.log(`Widget System Test Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (error) {
    console.error("Test execution error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runComprehensiveWidgetTests();
