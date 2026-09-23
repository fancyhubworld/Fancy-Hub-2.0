import { PrismaClient } from "@prisma/client";
import {
  DEFAULT_TYPOGRAPHY_CONFIG,
  TypographyConfig,
  TypographyRoleKey,
  getTypographyCssVariables,
} from "../src/lib/typography-builder-types";
import { THEME_PRESETS, ThemeTokens, getThemeCssVariables } from "../src/lib/theme-engine";

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

async function runTypographySystemTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — SECTION 19: TYPOGRAPHY SYSTEM TEST SUITE");
  console.log("=======================================================================\n");

  try {
    console.log("--- PHASE 1: VERIFYING ALL 9 SEPARATE TYPOGRAPHY ROLES ---");
    const requiredRoles: TypographyRoleKey[] = [
      "H1",
      "H2",
      "H3",
      "H4",
      "Body",
      "Small",
      "Caption",
      "Button",
      "Navigation",
    ];

    assert(requiredRoles.length === 9, "9 separate typography roles registered");

    requiredRoles.forEach((roleKey, idx) => {
      const role = DEFAULT_TYPOGRAPHY_CONFIG.roles[roleKey];
      assert(role !== undefined, `${idx + 1}. Role [${roleKey}] (${role?.label}) is defined`);
      assert(typeof role.fontSize === "string" && role.fontSize.length > 0, `  - ${roleKey} fontSize: ${role.fontSize}`);
      assert(typeof role.fontWeight === "string" && role.fontWeight.length > 0, `  - ${roleKey} fontWeight: ${role.fontWeight}`);
      assert(typeof role.lineHeight === "string" && role.lineHeight.length > 0, `  - ${roleKey} lineHeight: ${role.lineHeight}`);
      assert(typeof role.letterSpacing === "string" && role.letterSpacing.length > 0, `  - ${roleKey} letterSpacing: ${role.letterSpacing}`);
    });

    console.log("\n--- PHASE 2: GLOBAL FONT FAMILY CONFIGURATION ---");
    assert(DEFAULT_TYPOGRAPHY_CONFIG.headingFontFamily.length > 0, `Heading Font Family configured: "${DEFAULT_TYPOGRAPHY_CONFIG.headingFontFamily}"`);
    assert(DEFAULT_TYPOGRAPHY_CONFIG.bodyFontFamily.length > 0, `Body Font Family configured: "${DEFAULT_TYPOGRAPHY_CONFIG.bodyFontFamily}"`);

    console.log("\n--- PHASE 3: CSS VARIABLE GENERATION FOR ALL 9 ROLES ---");
    const cssVars = getTypographyCssVariables(DEFAULT_TYPOGRAPHY_CONFIG);

    requiredRoles.forEach((roleKey) => {
      const prefix = roleKey.toLowerCase();
      assert(cssVars[`--${prefix === "navigation" ? "nav" : prefix}-font-size`] !== undefined, `[${roleKey}] font-size CSS variable exists`);
      assert(cssVars[`--${prefix === "navigation" ? "nav" : prefix}-font-weight`] !== undefined, `[${roleKey}] font-weight CSS variable exists`);
      assert(cssVars[`--${prefix === "navigation" ? "nav" : prefix}-line-height`] !== undefined, `[${roleKey}] line-height CSS variable exists`);
      assert(cssVars[`--${prefix === "navigation" ? "nav" : prefix}-letter-spacing`] !== undefined, `[${roleKey}] letter-spacing CSS variable exists`);
    });

    console.log("\n--- PHASE 4: THEME STUDIO INTEGRATION & CUSTOMIZATION ---");
    const customTypographyTheme: ThemeTokens = {
      ...THEME_PRESETS["royal-blue"],
      name: "Luxury Editorial Serif Theme",
      typography: {
        headingFontFamily: "Playfair Display",
        bodyFontFamily: "Plus Jakarta Sans",
        baseFontSize: 16,
        roles: {
          ...DEFAULT_TYPOGRAPHY_CONFIG.roles,
          H1: {
            ...DEFAULT_TYPOGRAPHY_CONFIG.roles.H1,
            fontSize: "3rem",
            fontWeight: "900",
            lineHeight: "1.15",
            letterSpacing: "-0.03em",
          },
          Button: {
            ...DEFAULT_TYPOGRAPHY_CONFIG.roles.Button,
            fontSize: "0.875rem",
            fontWeight: "800",
            letterSpacing: "0.05em",
          },
        },
      },
    };

    const combinedVars = getThemeCssVariables(customTypographyTheme);
    assert(combinedVars["--font-heading"] === "Playfair Display", "Custom heading font 'Playfair Display' rendered in CSS vars");
    assert(combinedVars["--h1-font-size"] === "3rem", "H1 font size updated to 3rem in CSS vars");
    assert(combinedVars["--h1-font-weight"] === "900", "H1 font weight updated to 900 in CSS vars");
    assert(combinedVars["--button-letter-spacing"] === "0.05em", "Button letter spacing updated to 0.05em in CSS vars");

    console.log("\n--- PHASE 5: DATABASE PERSISTENCE & STOREFRONT SYNC ---");
    await prisma.systemPageConfig.upsert({
      where: { id: "theme-builder-config" },
      update: {
        name: "Global Theme & Design System",
        configJson: JSON.stringify(customTypographyTheme),
      },
      create: {
        id: "theme-builder-config",
        name: "Global Theme & Design System",
        configJson: JSON.stringify(customTypographyTheme),
      },
    });

    const stored = await prisma.systemPageConfig.findUnique({
      where: { id: "theme-builder-config" },
    });
    const parsed: ThemeTokens = JSON.parse(stored!.configJson);

    assert(parsed.typography?.headingFontFamily === "Playfair Display", "Persisted Playfair Display in database");
    assert(parsed.typography?.roles.H1.fontSize === "3rem", "Persisted H1 custom size in database");
    assert(parsed.typography?.roles.Button.letterSpacing === "0.05em", "Persisted Button letter spacing in database");

    console.log("\n=======================================================================");
    console.log(`Typography System Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test execution failed:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTypographySystemTests();
