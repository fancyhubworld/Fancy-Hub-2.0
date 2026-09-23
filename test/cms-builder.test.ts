import { PrismaClient } from "@prisma/client";
import { THEME_PRESETS, getThemeCssVariables } from "../src/lib/theme-engine";
import { SECTION_REGISTRY, SectionType, getDefaultHomepageSections } from "../src/lib/page-builder";

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

async function runCmsBuilderTests() {
  console.log("===============================================================");
  console.log("   FANCYHUB.IN — CMS BUILDER & THEME ENGINE AUTOMATED TESTS");
  console.log("===============================================================\n");

  try {
    // 1. Theme Engine & CSS Variables Test
    console.log("--- PHASE 1: THEME ENGINE & CSS VARIABLES ---");
    const royal = THEME_PRESETS["royal-blue"];
    assert(royal !== undefined, "Royal Blue theme preset exists");
    const royalVars = getThemeCssVariables(royal);
    assert(typeof royalVars["--primary"] === "string", "CSS variable --primary computed properly");
    assert(royalVars["--radius"] === "1rem", "CSS variable --radius is 1rem");

    const glassy = THEME_PRESETS["glassy-neo"];
    assert(glassy !== undefined, "Apple iOS Glassy Neo preset exists");
    const glassyVars = getThemeCssVariables(glassy);
    assert(glassyVars["--glass-blur"] === "24px", "Glassy blur set to 24px");
    assert(glassy.activeMode === "glassy", "Glassy active mode is glassy");

    // 2. Section Registry Coverage Test
    console.log("\n--- PHASE 2: SECTION REGISTRY & WIDGET CONFIGS ---");
    const expectedWidgets: SectionType[] = [
      "HERO_SLIDER",
      "CATEGORY_STRIP",
      "FLASH_DEALS",
      "PRODUCT_GRID",
      "PROMO_BANNERS",
      "VENDOR_SPOTLIGHT",
      "CUSTOM_PRINT",
      "TESTIMONIALS",
      "TRUST_ASSURANCE",
      "NEWSLETTER",
      "FAQ_ACCORDION",
      "RICH_CONTENT",
      "ANNOUNCEMENT_TICKER",
    ];

    for (const widgetType of expectedWidgets) {
      const desc = SECTION_REGISTRY[widgetType];
      assert(desc !== undefined, `Widget descriptor for ${widgetType} is registered`);
      assert(typeof desc.name === "string", `${widgetType} has display name: ${desc?.name}`);
      assert(desc.defaultContent !== undefined, `${widgetType} has default content`);
    }

    const defaultHomepage = getDefaultHomepageSections();
    assert(defaultHomepage.length >= 10, `Default homepage contains ${defaultHomepage.length} configured sections`);

    // 3. Database Persistence & Dynamic Page Creation Test
    console.log("\n--- PHASE 3: DATABASE PERSISTENCE & PAGE CREATION ---");
    const testPage = await prisma.pageConfig.upsert({
      where: { slug: "test-festive-campaign" },
      update: { title: "Diwali Festive Mega Sale", isHomepage: false, status: "PUBLISHED" },
      create: {
        slug: "test-festive-campaign",
        title: "Diwali Festive Mega Sale",
        description: "Official Diwali festive discounts on handloom silk & mobile gadgets",
        seoTitle: "Diwali Mega Sale 2026 | FancyHub.in",
        seoDescription: "Shop Diwali festive sarees & electronics with 50% discount",
        isHomepage: false,
        status: "PUBLISHED",
      },
    });
    assert(testPage.id !== undefined, "Created dynamic test page (test-festive-campaign)");

    // Add 2 sections to test page
    const sec1 = await prisma.pageSection.create({
      data: {
        pageId: testPage.id,
        type: "HERO_SLIDER",
        title: "Festive Mega Hero",
        sortOrder: 1,
        isActive: true,
        contentJson: JSON.stringify({ slides: [{ title: "Special Festive Drop", imageUrl: "https://example.com/test.jpg" }] }),
      },
    });
    assert(sec1.id !== undefined, "Attached HERO_SLIDER section to test page");

    const sec2 = await prisma.pageSection.create({
      data: {
        pageId: testPage.id,
        type: "FLASH_DEALS",
        title: "Festive Flash Deals",
        sortOrder: 2,
        isActive: true,
        contentJson: JSON.stringify({ title: "Flash Sale", hoursRemaining: 12 }),
      },
    });
    assert(sec2.id !== undefined, "Attached FLASH_DEALS section to test page");

    // Test Section Reordering
    await prisma.$transaction([
      prisma.pageSection.update({ where: { id: sec1.id }, data: { sortOrder: 2 } }),
      prisma.pageSection.update({ where: { id: sec2.id }, data: { sortOrder: 1 } }),
    ]);

    const reorderedSections = await prisma.pageSection.findMany({
      where: { pageId: testPage.id },
      orderBy: { sortOrder: "asc" },
    });
    assert(reorderedSections[0].id === sec2.id, "Section reorder transaction executed successfully (FLASH_DEALS is now #1)");

    // 4. Marketing Popups & Announcement Bars Test
    console.log("\n--- PHASE 4: MARKETING POPUPS & ANNOUNCEMENTS ---");
    const activePopup = await prisma.marketingPopup.findFirst({ where: { isActive: true } });
    assert(activePopup !== null, `Active marketing popup found: ${activePopup?.title}`);

    const activeBar = await prisma.announcementBar.findFirst({ where: { isActive: true } });
    assert(activeBar !== null, `Active top announcement found: ${activeBar?.text}`);

    // Cleanup test page
    await prisma.pageConfig.delete({ where: { id: testPage.id } });
    console.log("\n🧹 Test cleanup complete.");

    console.log("===============================================================");
    console.log(`Automated CMS Builder Results: ${passed} Passed, ${failed} Failed`);
    console.log("===============================================================\n");

    if (failed > 0) process.exit(1);
  } catch (error) {
    console.error("Test execution error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runCmsBuilderTests();
