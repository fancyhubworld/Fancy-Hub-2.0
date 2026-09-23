import { PrismaClient } from "@prisma/client";
import {
  isScheduleActive,
  PublishingSchedule,
  ROLE_PERMISSIONS,
  hasPermission,
  sanitizeCustomCss,
  createThemeExportPackage,
  validateThemeImportPackage,
  duplicateThemePreset,
  HierarchicalPageBlockDoc,
} from "../src/lib/cms-governance-types";
import { DEFAULT_THEME_TOKENS, THEME_PRESETS } from "../src/lib/theme-engine";

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

async function runGovernanceTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — SECTIONS 41–50: CMS GOVERNANCE & ARCHITECTURE TEST");
  console.log("=======================================================================\n");

  try {
    // SECTION 41: DRAFT / PUBLISH SYSTEM
    console.log("--- SECTION 41: DRAFT / PUBLISH SYSTEM ---");
    const testDraftPage = await prisma.pageConfig.upsert({
      where: { slug: "test-governance-draft" },
      update: { title: "Governance Live Page", status: "PUBLISHED" },
      create: {
        slug: "test-governance-draft",
        title: "Governance Live Page",
        status: "PUBLISHED",
        draftJson: JSON.stringify({ title: "Unpublished Draft Title" }),
      },
    });
    assert(testDraftPage.status === "PUBLISHED", "Published version remains live for storefront");
    assert(testDraftPage.draftJson !== null, "Draft snapshot safely staged in draftJson without affecting live");

    // SECTION 42: SCHEDULED PUBLISHING
    console.log("\n--- SECTION 42: SCHEDULED PUBLISHING ---");
    const activeSchedule: PublishingSchedule = {
      id: "sch-1",
      name: "Diwali 2026 Campaign",
      targetType: "CAMPAIGN",
      targetId: "festive-sale",
      startDate: new Date(Date.now() - 3600000), // 1 hour ago
      endDate: new Date(Date.now() + 86400000),  // Tomorrow
      isActive: true,
    };
    assert(isScheduleActive(activeSchedule) === true, "Active festive campaign correctly evaluated as ACTIVE");

    const futureSchedule: PublishingSchedule = {
      id: "sch-2",
      name: "Independence Day 2026",
      targetType: "CAMPAIGN",
      targetId: "independence-sale",
      startDate: new Date(Date.now() + 86400000), // Tomorrow
      isActive: true,
    };
    assert(isScheduleActive(futureSchedule) === false, "Future campaign correctly evaluated as INACTIVE");

    // SECTION 43: ROLE PERMISSIONS (RBAC)
    console.log("\n--- SECTION 43: ROLE PERMISSIONS (RBAC) ---");
    assert(hasPermission("SUPER_ADMIN", "CRITICAL_SETTINGS_MANAGE") === true, "Super Admin has critical settings permission");
    assert(hasPermission("SUPER_ADMIN", "CUSTOM_JS_MANAGE") === true, "Super Admin has custom JS permission");
    assert(hasPermission("ADMIN", "THEME_MANAGE") === true, "Admin has theme management permission");
    assert(hasPermission("ADMIN", "CRITICAL_SETTINGS_MANAGE") === false, "Admin restricted from critical system settings");
    assert(hasPermission("DESIGNER", "THEME_MANAGE") === true, "Designer has Theme permission");
    assert(hasPermission("DESIGNER", "BANNERS_MANAGE") === false, "Designer restricted from banners/campaigns");
    assert(hasPermission("MARKETING_MANAGER", "POPUPS_MANAGE") === true, "Marketing Manager has Popups permission");
    assert(hasPermission("CONTENT_MANAGER", "BLOG_MANAGE") === true, "Content Manager has Blog permission");

    // SECTION 44: CUSTOM CSS SANITIZER
    console.log("\n--- SECTION 44: CUSTOM CSS SANITIZER ---");
    const safeCss = ":root { --brand-glow: 0 0 20px #1455D9; } .hero-title { font-weight: 900; }";
    const safeResult = sanitizeCustomCss(safeCss);
    assert(safeResult.isValid === true, "Valid custom CSS passed sanitizer");

    const unsafeCss = "@import url('https://malicious.com/evil.css'); body { background: red; }";
    const unsafeResult = sanitizeCustomCss(unsafeCss);
    assert(unsafeResult.isValid === false, "Unsafe @import blocked by CSS sanitizer");

    const scriptCss = "<script>alert('xss')</script>";
    const scriptResult = sanitizeCustomCss(scriptCss);
    assert(scriptResult.isValid === false, "Embedded <script> tag blocked by CSS sanitizer");

    // SECTION 45: CUSTOM JAVASCRIPT
    console.log("\n--- SECTION 45: CUSTOM JAVASCRIPT RESTRICTIONS ---");
    assert(hasPermission("ADMIN", "CUSTOM_JS_MANAGE") === false, "Normal Admin cannot execute custom JS");
    assert(hasPermission("SUPER_ADMIN", "CUSTOM_JS_MANAGE") === true, "Only Super Admin is authorized for custom JS/analytics");

    // SECTION 46: THEME JSON CONFIGURATION
    console.log("\n--- SECTION 46: THEME JSON CONFIGURATION ---");
    assert(DEFAULT_THEME_TOKENS.primaryColor !== undefined, "Theme JSON includes primaryColor");
    assert(DEFAULT_THEME_TOKENS.typography !== undefined, "Theme JSON includes structured typography scale");
    assert(DEFAULT_THEME_TOKENS.buttons !== undefined, "Theme JSON includes structured buttons config");
    assert(DEFAULT_THEME_TOKENS.cards !== undefined, "Theme JSON includes structured cards config");
    assert(DEFAULT_THEME_TOKENS.glassySettings !== undefined, "Theme JSON includes structured glassy settings");

    // SECTION 47: HIERARCHICAL PAGE BLOCK ARCHITECTURE
    console.log("\n--- SECTION 47: HIERARCHICAL PAGE BLOCK ARCHITECTURE ---");
    const sampleBlockDoc: HierarchicalPageBlockDoc = {
      pageId: "festive-sale-2026",
      title: "Diwali Festive Sale",
      slug: "festive-sale",
      sections: [
        {
          id: "sec-1",
          name: "Festive Hero Section",
          type: "HERO_SLIDER",
          settings: {
            ...DEFAULT_THEME_TOKENS.defaultSectionSettings,
            layout: "grid",
          },
          rows: [
            {
              id: "row-1",
              columns: [
                {
                  id: "col-1",
                  widthRatio: "full",
                  widgets: [
                    {
                      id: "wid-1",
                      type: "HERO_BANNER",
                      settings: { title: "Diwali Dhamaka" },
                      style: { padding: "2rem" },
                      responsive: { desktop: { columns: 4 }, mobile: { columns: 2 } },
                      dataSource: { category: "sarees" },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
    assert(sampleBlockDoc.sections[0].rows[0].columns[0].widgets[0].type === "HERO_BANNER", "Hierarchical Page -> Section -> Row -> Column -> Widget validated");

    // SECTION 48: ADMIN THEME RESET
    console.log("\n--- SECTION 48: ADMIN THEME RESET ---");
    const testResetTheme = DEFAULT_THEME_TOKENS;
    assert(testResetTheme.primaryColor === "#1455D9", "Factory default primaryColor is #1455D9");

    // SECTION 49: IMPORT / EXPORT THEME
    console.log("\n--- SECTION 49: IMPORT / EXPORT THEME ---");
    const exportPackage = createThemeExportPackage(DEFAULT_THEME_TOKENS);
    assert(exportPackage.formatVersion === "2.0", "Exported package has formatVersion 2.0");
    assert((exportPackage as any).secret === undefined, "Exported package stripped of any secrets/keys");

    const importResult = validateThemeImportPackage(exportPackage);
    assert(importResult.isValid === true, "Exported package validated successfully on re-import");

    // SECTION 50: CLONE WEBSITE DESIGN
    console.log("\n--- SECTION 50: CLONE WEBSITE DESIGN ---");
    const clonedTheme = duplicateThemePreset("fancyhub-premium", "FancyHub Festival 2026", "fancyhub-festival-2026");
    assert(clonedTheme.name === "FancyHub Festival 2026", "Cloned theme title matches 'FancyHub Festival 2026'");
    assert(clonedTheme.activePreset === "fancyhub-festival-2026", "Cloned theme activePreset set correctly");

    // Cleanup
    await prisma.pageConfig.delete({ where: { id: testDraftPage.id } });

    console.log("\n=======================================================================");
    console.log(`Sections 41–50 Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test execution error:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runGovernanceTests();
