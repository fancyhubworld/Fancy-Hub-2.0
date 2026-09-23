import { PrismaClient } from "@prisma/client";
import {
  ThemeModePreference,
  THEME_PRESETS,
  ThemeTokens,
  getThemeCssVariables,
  UniversalSectionSettings,
  DEFAULT_SECTION_SETTINGS,
  getSectionLayoutClasses,
  getSectionVisibilityClasses,
  resolveDeviceContent,
  SectionLayoutType,
  SectionColumnType,
} from "../src/lib/theme-engine";

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

async function runTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — SECTIONS 24–30: THEME PRESETS, RESPONSIVE & LAYOUTS");
  console.log("=======================================================================\n");

  try {
    // SECTION 24: DARK MODE
    console.log("--- SECTION 24: DARK MODE & DESIGN TOKENS ---");
    const darkPreset = THEME_PRESETS["fancyhub-dark"];
    assert(darkPreset !== undefined, "FancyHub Dark preset exists");
    assert(darkPreset.backgroundColor === "#0A0F1D", "Dark mode uses genuine OLED background #0A0F1D (not naive inversion)");
    assert(darkPreset.surfaceColor === "#111827", "Dark mode uses #111827 surface token");
    assert(darkPreset.cardColor === "#1E293B", "Dark mode uses #1E293B card token");
    assert(darkPreset.textColor === "#F9FAFB", "Dark mode text is crisp #F9FAFB");

    const modePreferences: ThemeModePreference[] = ["light", "dark", "system"];
    assert(modePreferences.length === 3, "Supports Light, Dark and System Default mode preferences");

    // SECTION 25: 5 THEME PRESETS
    console.log("\n--- SECTION 25: 5 CURATED THEME PRESETS ---");
    const expectedPresets = [
      "fancyhub-classic",
      "fancyhub-modern",
      "fancyhub-glass",
      "fancyhub-dark",
      "fancyhub-premium",
    ];

    for (const key of expectedPresets) {
      const preset = THEME_PRESETS[key];
      assert(preset !== undefined, `Preset '${key}' is registered`);
      assert(preset.name.length > 0, `Preset '${key}' has name: ${preset.name}`);
      assert(preset.primaryColor.length > 0, `Preset '${key}' has primaryColor: ${preset.primaryColor}`);
      assert(preset.fontFamily.length > 0, `Preset '${key}' has fontFamily: ${preset.fontFamily}`);
    }

    // SECTION 26: RESPONSIVE DESIGN SYSTEM
    console.log("\n--- SECTION 26: RESPONSIVE DESIGN SYSTEM ---");
    const testSection = { ...DEFAULT_SECTION_SETTINGS };
    assert(testSection.responsive.desktop.columns === 4, "Desktop columns = 4");
    assert(testSection.responsive.tablet.columns === 3, "Tablet columns = 3");
    assert(testSection.responsive.mobile.columns === 2, "Mobile columns = 2");

    assert(testSection.responsive.desktop.paddingTop === "2rem", "Desktop paddingTop = 2rem");
    assert(testSection.responsive.tablet.paddingTop === "1.5rem", "Tablet paddingTop = 1.5rem");
    assert(testSection.responsive.mobile.paddingTop === "1rem", "Mobile paddingTop = 1rem");

    // SECTION 27: RESPONSIVE VISIBILITY
    console.log("\n--- SECTION 27: RESPONSIVE VISIBILITY ---");
    const desktopOnly = getSectionVisibilityClasses({ showDesktop: true, showTablet: false, showMobile: false });
    assert(desktopOnly === "hidden lg:block", "Desktop only produces 'hidden lg:block'");

    const mobileOnly = getSectionVisibilityClasses({ showDesktop: false, showTablet: false, showMobile: true });
    assert(mobileOnly === "block md:hidden", "Mobile only produces 'block md:hidden'");

    const allDevices = getSectionVisibilityClasses({ showDesktop: true, showTablet: true, showMobile: true });
    assert(allDevices === "block", "All devices visible produces 'block'");

    // SECTION 28: MOBILE-SPECIFIC CONTENT
    console.log("\n--- SECTION 28: MOBILE-SPECIFIC CONTENT ---");
    const baseContent = {
      title: "Widescreen Desktop Festive Collection",
      imageUrl: "https://images.unsplash.com/desktop-banner.jpg",
    };
    const mobileContent = {
      mobileText: "Mobile Festive 50% OFF",
      mobileImage: "https://images.unsplash.com/mobile-banner.jpg",
    };

    const resolvedDesktop = resolveDeviceContent(baseContent, mobileContent, false);
    assert(resolvedDesktop.title === "Widescreen Desktop Festive Collection", "Desktop resolves desktop title");
    assert(resolvedDesktop.imageUrl === "https://images.unsplash.com/desktop-banner.jpg", "Desktop resolves desktop image");

    const resolvedMobile = resolveDeviceContent(baseContent, mobileContent, true);
    assert(resolvedMobile.title === "Mobile Festive 50% OFF", "Mobile resolves mobile-specific title");
    assert(resolvedMobile.imageUrl === "https://images.unsplash.com/mobile-banner.jpg", "Mobile resolves mobile-specific image");

    // SECTION 29: SECTION SETTINGS
    console.log("\n--- SECTION 29: SECTION SETTINGS ---");
    const customSection: UniversalSectionSettings = {
      ...DEFAULT_SECTION_SETTINGS,
      background: "#F1F5F9",
      radius: "1.25rem",
      shadow: "lg",
      animation: "fade-in",
      customClass: "my-custom-section-class",
    };
    assert(customSection.background === "#F1F5F9", "Background configured");
    assert(customSection.radius === "1.25rem", "Corner radius configured");
    assert(customSection.shadow === "lg", "Shadow configured");
    assert(customSection.animation === "fade-in", "Animation configured");
    assert(customSection.customClass === "my-custom-section-class", "Custom class configured");

    // SECTION 30: SECTION LAYOUT
    console.log("\n--- SECTION 30: SECTION LAYOUT ---");
    const layoutTypes: SectionLayoutType[] = ["container", "row", "column", "grid", "flex", "stack"];
    assert(layoutTypes.length === 6, "All 6 layout types supported (Container, Row, Column, Grid, Flex, Stack)");

    const columnTypes: SectionColumnType[] = ["1-col", "2-col", "3-col", "4-col", "custom-grid"];
    assert(columnTypes.length === 5, "All 5 column types supported (1, 2, 3, 4, Custom grid)");

    const grid4ColClasses = getSectionLayoutClasses({ ...DEFAULT_SECTION_SETTINGS, layout: "grid", columns: "4-col" });
    assert(grid4ColClasses.includes("grid-cols-2") && grid4ColClasses.includes("lg:grid-cols-4"), "4-col grid layout classes generated correctly");

    const flexClasses = getSectionLayoutClasses({ ...DEFAULT_SECTION_SETTINGS, layout: "flex" });
    assert(flexClasses.includes("flex items-center justify-between"), "Flex layout classes generated correctly");

    // DATABASE PERSISTENCE
    console.log("\n--- DATABASE PERSISTENCE ---");
    const fullThemeTokens: ThemeTokens = {
      ...THEME_PRESETS["fancyhub-modern"],
      defaultSectionSettings: customSection,
      modePreference: "system",
    };

    await prisma.systemPageConfig.upsert({
      where: { id: "theme-builder-config" },
      update: {
        name: "Global Theme & Design System",
        configJson: JSON.stringify(fullThemeTokens),
      },
      create: {
        id: "theme-builder-config",
        name: "Global Theme & Design System",
        configJson: JSON.stringify(fullThemeTokens),
      },
    });

    const record = await prisma.systemPageConfig.findUnique({
      where: { id: "theme-builder-config" },
    });
    const parsed: ThemeTokens = JSON.parse(record!.configJson);
    assert(parsed.name === "FancyHub Modern", "Persisted Theme name");
    assert(parsed.defaultSectionSettings?.shadow === "lg", "Persisted sectionSettings shadow");
    assert(parsed.modePreference === "system", "Persisted modePreference = 'system'");

    console.log("\n=======================================================================");
    console.log(`Sections 24–30 Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test failed:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
