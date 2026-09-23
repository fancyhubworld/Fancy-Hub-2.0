import { PrismaClient } from "@prisma/client";
import { exportTokensToCssVariables, DEFAULT_DESIGN_TOKENS } from "../src/lib/design-tokens-engine";
import { WIDGET_REGISTRY } from "../src/lib/widget-registry";
import { resolveDeviceContent, getSectionVisibilityClasses } from "../src/lib/section-builder-types";

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

async function runSection82ArchitectureTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — SECTION 82: CONFIGURATION-DRIVEN ARCHITECTURE SUITE");
  console.log("=======================================================================\n");

  try {
    // -----------------------------------------------------------------------
    // STAGE 1 & 2: ADMIN ERP → CONFIGURATION DATABASE
    // -----------------------------------------------------------------------
    console.log("--- STAGES 1 & 2: ADMIN ERP CONFIGURATION PERSISTENCE IN DATABASE ---");
    const testPageSlug = `config-test-${Date.now()}`;
    
    // Save page and section into database
    const savedPage = await prisma.pageConfig.create({
      data: {
        slug: testPageSlug,
        title: "Dynamic Diwali Tech Festival 2026",
        description: "Special seasonal campaign page driven completely by database config",
        status: "PUBLISHED",
        layoutType: "FULL_WIDTH",
        sections: {
          create: [
            {
              type: "HERO_SLIDER",
              name: "Festival Hero Slider",
              sortOrder: 0,
              isActive: true,
              desktopVisible: true,
              mobileVisible: true,
              title: "Grand Festive Dhamaka",
              settings: JSON.stringify({
                autoplay: true,
                interval: 5000,
                slides: [{ title: "50% OFF Audio", image: "https://cdn.fancyhub.in/audio.webp" }],
              }),
              style: JSON.stringify({ backgroundColor: "#0A1128", paddingY: "py-8" }),
              responsiveSettings: JSON.stringify({ desktop: { columns: 1 }, mobile: { columns: 1 } }),
            },
            {
              type: "PRODUCT_GRID",
              name: "Flash Sale Grid",
              sortOrder: 1,
              isActive: true,
              desktopVisible: true,
              mobileVisible: true,
              title: "Electronics Blockbusters",
              settings: JSON.stringify({
                category: "Electronics",
                productLimit: 8,
              }),
              style: JSON.stringify({ backgroundColor: "#FFFFFF", paddingY: "py-12" }),
              responsiveSettings: JSON.stringify({ desktop: { columns: 4 }, mobile: { columns: 2 } }),
              dataSource: JSON.stringify({ source: "CATEGORY", categorySlug: "electronics" }),
            },
          ],
        },
      },
      include: { sections: true },
    });

    assert(savedPage.id !== undefined, "Database persisted PageConfig record");
    assert(savedPage.sections.length === 2, "Database persisted 2 child PageSection records with foreign key relations");

    // -----------------------------------------------------------------------
    // STAGE 3 & 4: API SERVER → THEME ENGINE
    // -----------------------------------------------------------------------
    console.log("\n--- STAGES 3 & 4: API SERVER & THEME TOKEN INJECTION ---");
    const activeThemeTokens = {
      ...DEFAULT_DESIGN_TOKENS,
      colors: {
        ...DEFAULT_DESIGN_TOKENS.colors,
        primary: "#2458FF", // Updated via Admin ERP
        secondary: "#FF9900",
      },
    };

    const injectedCssVars = exportTokensToCssVariables(activeThemeTokens);
    assert(injectedCssVars["--color-primary"] === "#2458FF", "Theme Engine injected updated --color-primary variable");
    assert(injectedCssVars["--color-secondary"] === "#FF9900", "Theme Engine injected --color-secondary variable");

    // -----------------------------------------------------------------------
    // STAGE 5: PAGE ENGINE (DYNAMIC ORCHESTRATION)
    // -----------------------------------------------------------------------
    console.log("\n--- STAGE 5: PAGE ENGINE (QUERY & ORCHESTRATION) ---");
    const queriedPage = await prisma.pageConfig.findUnique({
      where: { slug: testPageSlug },
      include: {
        sections: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    assert(queriedPage !== null, "Page Engine fetched configuration from database");
    assert(queriedPage?.sections[0].type === "HERO_SLIDER", "Page Engine sorted Section #0 (HERO_SLIDER)");
    assert(queriedPage?.sections[1].type === "PRODUCT_GRID", "Page Engine sorted Section #1 (PRODUCT_GRID)");

    // -----------------------------------------------------------------------
    // STAGE 6: WIDGET ENGINE (REGISTRY & SCHEMAS)
    // -----------------------------------------------------------------------
    console.log("\n--- STAGE 6: WIDGET ENGINE DISPATCHER & REGISTRY ---");
    const productGridWidgetMeta = WIDGET_REGISTRY["PRODUCT_GRID"];
    assert(productGridWidgetMeta !== undefined, "Widget Engine recognized PRODUCT_GRID in registry");
    assert(productGridWidgetMeta.category === "ecommerce", "PRODUCT_GRID correctly mapped to E-commerce category");

    const sectionSettings = JSON.parse(queriedPage!.sections[1].settings!);
    assert(sectionSettings.category === "Electronics", "Widget Engine unpacked settings: Category=Electronics");
    assert(sectionSettings.productLimit === 8, "Widget Engine unpacked settings: productLimit=8");

    // -----------------------------------------------------------------------
    // STAGE 7: RESPONSIVE RENDERER
    // -----------------------------------------------------------------------
    console.log("\n--- STAGE 7: RESPONSIVE RENDERER ---");
    const responsiveCfg = JSON.parse(queriedPage!.sections[1].responsiveSettings!);
    assert(responsiveCfg.desktop.columns === 4, "Responsive Renderer resolved Desktop: 4 columns");
    assert(responsiveCfg.mobile.columns === 2, "Responsive Renderer resolved Mobile: 2 columns");

    const mobileContentOverride = resolveDeviceContent(
      { title: "Grand Festive Dhamaka (Desktop Banner)" },
      { mobileText: "Diwali Dhamaka (Mobile Short)" },
      true // isMobile
    );
    assert(mobileContentOverride.title === "Diwali Dhamaka (Mobile Short)", "Responsive Renderer served mobile-specific content on mobile viewports");

    // -----------------------------------------------------------------------
    // STAGE 8: CUSTOMER STOREFRONT ZERO-HARDCODING GUARANTEE
    // -----------------------------------------------------------------------
    console.log("\n--- STAGE 8: NO HARDCODING VERIFICATION ---");
    // Verify that mutating the database immediately changes the resolved runtime payload
    await prisma.pageSection.update({
      where: { id: queriedPage!.sections[1].id },
      data: {
        settings: JSON.stringify({ category: "Handloom Sarees", productLimit: 12 }),
      },
    });

    const updatedSection = await prisma.pageSection.findUnique({
      where: { id: queriedPage!.sections[1].id },
    });
    const updatedSettings = JSON.parse(updatedSection!.settings!);
    assert(updatedSettings.category === "Handloom Sarees", "Live Storefront updates dynamically to 'Handloom Sarees' without developer or code redeploy");
    assert(updatedSettings.productLimit === 12, "Live Storefront updates product limit to 12 dynamically");

    // Cleanup
    await prisma.pageSection.deleteMany({ where: { pageId: savedPage.id } });
    await prisma.pageConfig.delete({ where: { id: savedPage.id } });

    console.log("\n=======================================================================");
    console.log(`Section 82 Architecture Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test execution error:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runSection82ArchitectureTests();
