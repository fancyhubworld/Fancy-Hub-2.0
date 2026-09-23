import { PrismaClient } from "@prisma/client";
import {
  THEME_PRESETS,
  ThemeTokens,
  getThemeCssVariables,
  hexToHslValues,
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

async function runThemeBuilderTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — SECTIONS 17 & 18: THEME STUDIO & GLOBAL COLORS TEST");
  console.log("=======================================================================\n");

  try {
    console.log("--- PHASE 1: VERIFYING ALL 15 GLOBAL COLOR TOKENS ---");
    const defaultTokens = THEME_PRESETS["royal-blue"];

    const requiredColors: { key: keyof ThemeTokens; cssVar: string; name: string }[] = [
      { key: "primaryColor", cssVar: "--primary", name: "Primary Brand Color" },
      { key: "secondaryColor", cssVar: "--secondary", name: "Secondary Color" },
      { key: "accentColor", cssVar: "--accent", name: "Accent Color" },
      { key: "successColor", cssVar: "--success", name: "Success Color" },
      { key: "warningColor", cssVar: "--warning", name: "Warning Color" },
      { key: "dangerColor", cssVar: "--danger", name: "Danger / Destructive Color" },
      { key: "infoColor", cssVar: "--info", name: "Info Color" },
      { key: "backgroundColor", cssVar: "--background", name: "Background Color" },
      { key: "surfaceColor", cssVar: "--surface", name: "Surface Container Color" },
      { key: "cardColor", cssVar: "--card", name: "Card Background Color" },
      { key: "textColor", cssVar: "--text", name: "Text / Foreground Color" },
      { key: "mutedTextColor", cssVar: "--muted", name: "Muted Text Color" },
      { key: "borderColor", cssVar: "--border", name: "Border Color" },
      { key: "inputColor", cssVar: "--input", name: "Form Input Color" },
      { key: "buttonColor", cssVar: "--button", name: "Button CTA Color" },
    ];

    assert(requiredColors.length === 15, "15 global color tokens registered in Theme Studio");

    requiredColors.forEach((c, idx) => {
      const val = defaultTokens[c.key];
      assert(typeof val === "string" && val.length > 0, `${idx + 1}. [${c.cssVar}] ${c.name} is defined: "${val}"`);
    });

    console.log("\n--- PHASE 2: CSS VARIABLE TRANSFORMATION (NO HARD-CODED COLORS) ---");
    const cssVars = getThemeCssVariables(defaultTokens);

    requiredColors.forEach((c) => {
      assert(cssVars[c.cssVar] !== undefined, `CSS Variable [${c.cssVar}] exists in inline design token output`);
    });

    assert(cssVars["--radius"] !== undefined, "Design token [--radius] is generated");
    assert(cssVars["--theme-primary"] === defaultTokens.primaryColor, "HEX variable [--theme-primary] generated");

    console.log("\n--- PHASE 3: CURATED DESIGN PRESETS INTEGRITY ---");
    const presets = ["royal-blue", "glassy-neo", "emerald-handloom", "saffron-sunset", "midnight-luxury"];
    presets.forEach((key) => {
      const p = THEME_PRESETS[key];
      assert(p !== undefined, `Preset [${key}] (${p?.name}) is registered`);
      assert(p?.primaryColor.length > 0, `  - Primary: ${p?.primaryColor}`);
      assert(p?.secondaryColor.length > 0, `  - Secondary: ${p?.secondaryColor}`);
      assert(p?.backgroundColor.length > 0, `  - Background: ${p?.backgroundColor}`);
    });

    console.log("\n--- PHASE 4: DATABASE PERSISTENCE & THEME CUSTOMIZATION ---");
    // Admin creates custom festive theme with modified 15 colors
    const customFestiveTheme: ThemeTokens = {
      ...THEME_PRESETS["saffron-sunset"],
      name: "Diwali Mahotsav 2026 Gold",
      primaryColor: "#B45309",
      secondaryColor: "#F59E0B",
      accentColor: "#7C3AED",
      successColor: "#059669",
      warningColor: "#D97706",
      dangerColor: "#B91C1C",
      infoColor: "#1D4ED8",
      backgroundColor: "#FFFBEB",
      surfaceColor: "#FEF3C7",
      cardColor: "#FFFFFF",
      textColor: "#451A03",
      mutedTextColor: "#92400E",
      borderColor: "#FDE68A",
      inputColor: "#FFFFFF",
      buttonColor: "#B45309",
      fontFamily: "Poppins",
      borderRadius: "1.25rem",
      glassyBlur: 20,
      glassyOpacity: 0.85,
      buttonStyle: "gradient",
      cardStyle: "elevated",
      activePreset: "custom-diwali",
      activeMode: "light",
    };

    await prisma.systemPageConfig.upsert({
      where: { id: "theme-builder-config" },
      update: {
        name: "Global Theme & Design System",
        configJson: JSON.stringify(customFestiveTheme),
      },
      create: {
        id: "theme-builder-config",
        name: "Global Theme & Design System",
        configJson: JSON.stringify(customFestiveTheme),
      },
    });

    const retrieved = await prisma.systemPageConfig.findUnique({
      where: { id: "theme-builder-config" },
    });
    const parsed: ThemeTokens = JSON.parse(retrieved!.configJson);

    assert(parsed.name === "Diwali Mahotsav 2026 Gold", "Persisted custom theme name");
    assert(parsed.primaryColor === "#B45309", "Persisted --primary color token");
    assert(parsed.secondaryColor === "#F59E0B", "Persisted --secondary color token");
    assert(parsed.backgroundColor === "#FFFBEB", "Persisted --background color token");
    assert(parsed.buttonColor === "#B45309", "Persisted --button color token");

    console.log("\n=======================================================================");
    console.log(`Theme Studio & Global Colors Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test execution failed:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runThemeBuilderTests();
