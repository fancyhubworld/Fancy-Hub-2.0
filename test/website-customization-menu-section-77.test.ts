import fs from "fs";
import path from "path";
import { ROUTES } from "../src/lib/routes";

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

async function runSection77Tests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — SECTION 77: WEBSITE CUSTOMIZATION MENU TEST SUITE");
  console.log("=======================================================================\n");

  try {
    // 1. VERIFY ALL 18 REQUIRED WEBSITE MENU ITEMS IN ROUTES
    console.log("--- 1. VERIFY 18 REQUIRED WEBSITE MENU ROUTES ---");
    const requiredWebsiteRoutes = [
      { name: "Overview", route: ROUTES.admin.websiteControl, expected: "/admin/website-control" },
      { name: "Visual Builder", route: ROUTES.admin.visualBuilder, expected: "/admin/visual-builder" },
      { name: "Pages", route: ROUTES.admin.pages, expected: "/admin/pages" },
      { name: "Theme Studio", route: ROUTES.admin.themeStudio, expected: "/admin/theme-studio" },
      { name: "Header", route: ROUTES.admin.headerBuilder, expected: "/admin/header-builder" },
      { name: "Footer", route: ROUTES.admin.footerBuilder, expected: "/admin/footer-builder" },
      { name: "Navigation", route: ROUTES.admin.navigation, expected: "/admin/navigation" },
      { name: "Widgets", route: ROUTES.admin.widgetMarketplace, expected: "/admin/widget-marketplace" },
      { name: "Sections", route: ROUTES.admin.sections, expected: "/admin/reusable-blocks" },
      { name: "Popups", route: ROUTES.admin.popups, expected: "/admin/popups" },
      { name: "Banners", route: ROUTES.admin.banners, expected: "/admin/banners" },
      { name: "Media Library", route: ROUTES.admin.media, expected: "/admin/media" },
      { name: "Menus", route: ROUTES.admin.menus, expected: "/admin/menus" },
      { name: "SEO", route: ROUTES.admin.seo, expected: "/admin/seo" },
      { name: "Redirects", route: ROUTES.admin.redirects, expected: "/admin/redirects" },
      { name: "Theme Versions", route: ROUTES.admin.themeVersions, expected: "/admin/theme-versions" },
      { name: "Scheduled Changes", route: ROUTES.admin.scheduledChanges, expected: "/admin/scheduled-changes" },
      { name: "Settings", route: ROUTES.admin.brandControl, expected: "/admin/brand-control" },
    ];

    for (const item of requiredWebsiteRoutes) {
      assert(item.route === item.expected, `Menu Item [${item.name}]: Route matches ${item.expected}`);
    }

    // 2. VERIFY BONUS ADVANCED WEBSITE TOOLS
    console.log("\n--- 2. VERIFY BONUS ADVANCED WEBSITE DESIGNERS ---");
    const bonusRoutes = [
      { name: "Floating Widgets", route: ROUTES.admin.floatingWidgets, expected: "/admin/floating-widgets" },
      { name: "Category Layouts", route: ROUTES.admin.categoryBuilder, expected: "/admin/category-builder" },
      { name: "Product Layouts", route: ROUTES.admin.productBuilder, expected: "/admin/product-builder" },
      { name: "Checkout Designer", route: ROUTES.admin.checkoutDesigner, expected: "/admin/checkout-designer" },
      { name: "Account Designer", route: ROUTES.admin.accountDesigner, expected: "/admin/account-designer" },
      { name: "Empty States", route: ROUTES.admin.emptyStates, expected: "/admin/empty-states" },
      { name: "Maintenance Mode", route: ROUTES.admin.maintenance, expected: "/admin/maintenance" },
    ];

    for (const item of bonusRoutes) {
      assert(item.route === item.expected, `Advanced Item [${item.name}]: Route matches ${item.expected}`);
    }

    // 3. VERIFY ALL 25 TARGET PAGE FILES EXIST IN APP ROUTER
    console.log("\n--- 3. VERIFY TARGET PAGE FILES ON DISK ---");
    const allCustomizerPages = [
      "src/app/admin/website-control/page.tsx",
      "src/app/admin/visual-builder/page.tsx",
      "src/app/admin/pages/page.tsx",
      "src/app/admin/theme-studio/page.tsx",
      "src/app/admin/header-builder/page.tsx",
      "src/app/admin/footer-builder/page.tsx",
      "src/app/admin/navigation/page.tsx",
      "src/app/admin/widget-marketplace/page.tsx",
      "src/app/admin/reusable-blocks/page.tsx",
      "src/app/admin/popups/page.tsx",
      "src/app/admin/banners/page.tsx",
      "src/app/admin/media/page.tsx",
      "src/app/admin/menus/page.tsx",
      "src/app/admin/seo/page.tsx",
      "src/app/admin/redirects/page.tsx",
      "src/app/admin/theme-versions/page.tsx",
      "src/app/admin/scheduled-changes/page.tsx",
      "src/app/admin/brand-control/page.tsx",
      "src/app/admin/floating-widgets/page.tsx",
      "src/app/admin/category-builder/page.tsx",
      "src/app/admin/product-builder/page.tsx",
      "src/app/admin/checkout-designer/page.tsx",
      "src/app/admin/account-designer/page.tsx",
      "src/app/admin/empty-states/page.tsx",
      "src/app/admin/maintenance/page.tsx",
    ];

    for (const file of allCustomizerPages) {
      const fullPath = path.resolve(__dirname, "..", file);
      assert(fs.existsSync(fullPath), `Target Page File Exists: ${file}`);
    }

    // 4. VERIFY REUSABLE ADMIN SIDEBAR COMPONENT
    console.log("\n--- 4. VERIFY ADMIN SIDEBAR COMPONENT ---");
    const sidebarPath = path.resolve(__dirname, "..", "src/components/admin/AdminSidebar.tsx");
    assert(fs.existsSync(sidebarPath), "Reusable <AdminSidebar /> component created");
    const sidebarContent = fs.readFileSync(sidebarPath, "utf-8");
    assert(sidebarContent.includes("WEBSITE"), "<AdminSidebar /> contains WEBSITE root menu group");
    assert(sidebarContent.includes("Visual Builder"), "<AdminSidebar /> contains Visual Builder link");
    assert(sidebarContent.includes("Redirects"), "<AdminSidebar /> contains Redirects link");
    assert(sidebarContent.includes("Theme Versions"), "<AdminSidebar /> contains Theme Versions link");
    assert(sidebarContent.includes("Scheduled Changes"), "<AdminSidebar /> contains Scheduled Changes link");

    console.log("\n=======================================================================");
    console.log(`Section 77 Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test execution error:", e);
    process.exit(1);
  }
}

runSection77Tests();
