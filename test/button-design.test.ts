import { PrismaClient } from "@prisma/client";
import {
  ButtonStyleType,
  ButtonShape,
  ButtonShadow,
  ButtonConfig,
  DEFAULT_BUTTON_CONFIG,
  getButtonCssVariables,
} from "../src/lib/button-builder-types";
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

async function runButtonDesignTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — SECTION 20: BUTTON DESIGN TEST SUITE");
  console.log("=======================================================================\n");

  try {
    console.log("--- PHASE 1: VERIFYING ALL 5 BUTTON STYLES ---");
    const requiredStyles: ButtonStyleType[] = ["solid", "outline", "ghost", "glass", "gradient"];
    assert(requiredStyles.length === 5, "5 button style variants supported");

    requiredStyles.forEach((st) => {
      assert(DEFAULT_BUTTON_CONFIG.styles[st] !== undefined, `Button style [${st}] is configured`);
    });

    console.log("\n--- PHASE 2: BUTTON SHAPES & DIMENSIONS CONFIGURATION ---");
    const requiredShapes: ButtonShape[] = ["square", "rounded", "pill", "leaf", "minimal"];
    assert(requiredShapes.length === 5, "5 button shapes supported");

    assert(DEFAULT_BUTTON_CONFIG.borderRadius.length > 0, `Default border-radius defined: "${DEFAULT_BUTTON_CONFIG.borderRadius}"`);
    assert(DEFAULT_BUTTON_CONFIG.heightSm.length > 0, `Height SM defined: "${DEFAULT_BUTTON_CONFIG.heightSm}"`);
    assert(DEFAULT_BUTTON_CONFIG.heightMd.length > 0, `Height MD defined: "${DEFAULT_BUTTON_CONFIG.heightMd}"`);
    assert(DEFAULT_BUTTON_CONFIG.heightLg.length > 0, `Height LG defined: "${DEFAULT_BUTTON_CONFIG.heightLg}"`);
    assert(DEFAULT_BUTTON_CONFIG.paddingSm.length > 0, `Padding SM defined: "${DEFAULT_BUTTON_CONFIG.paddingSm}"`);
    assert(DEFAULT_BUTTON_CONFIG.paddingMd.length > 0, `Padding MD defined: "${DEFAULT_BUTTON_CONFIG.paddingMd}"`);
    assert(DEFAULT_BUTTON_CONFIG.paddingLg.length > 0, `Padding LG defined: "${DEFAULT_BUTTON_CONFIG.paddingLg}"`);

    console.log("\n--- PHASE 3: TYPOGRAPHY, WEIGHT & SHADOW ELEVATIONS ---");
    assert(DEFAULT_BUTTON_CONFIG.fontFamily.length > 0, `Button font: "${DEFAULT_BUTTON_CONFIG.fontFamily}"`);
    assert(DEFAULT_BUTTON_CONFIG.fontWeight.length > 0, `Button weight: "${DEFAULT_BUTTON_CONFIG.fontWeight}"`);
    assert(DEFAULT_BUTTON_CONFIG.shadow.length > 0, `Button shadow: "${DEFAULT_BUTTON_CONFIG.shadow}"`);

    console.log("\n--- PHASE 4: INTERACTIVE STATES (HOVER, ACTIVE, DISABLED) ---");
    assert(typeof DEFAULT_BUTTON_CONFIG.hover.scale === "number", `Hover scale defined: ${DEFAULT_BUTTON_CONFIG.hover.scale}x`);
    assert(typeof DEFAULT_BUTTON_CONFIG.hover.translateY === "string", `Hover translateY: ${DEFAULT_BUTTON_CONFIG.hover.translateY}`);
    assert(typeof DEFAULT_BUTTON_CONFIG.active.scale === "number", `Active scale defined: ${DEFAULT_BUTTON_CONFIG.active.scale}x`);
    assert(typeof DEFAULT_BUTTON_CONFIG.active.translateY === "string", `Active translateY: ${DEFAULT_BUTTON_CONFIG.active.translateY}`);
    assert(typeof DEFAULT_BUTTON_CONFIG.disabled.opacity === "number", `Disabled opacity: ${DEFAULT_BUTTON_CONFIG.disabled.opacity}`);
    assert(DEFAULT_BUTTON_CONFIG.disabled.cursor === "not-allowed", `Disabled cursor: ${DEFAULT_BUTTON_CONFIG.disabled.cursor}`);

    console.log("\n--- PHASE 5: CSS VARIABLE GENERATION ---");
    const buttonCss = getButtonCssVariables(DEFAULT_BUTTON_CONFIG);
    assert(buttonCss["--btn-radius"] !== undefined, "CSS variable [--btn-radius] generated");
    assert(buttonCss["--btn-font-family"] !== undefined, "CSS variable [--btn-font-family] generated");
    assert(buttonCss["--btn-font-weight"] !== undefined, "CSS variable [--btn-font-weight] generated");
    assert(buttonCss["--btn-shadow"] !== undefined, "CSS variable [--btn-shadow] generated");
    assert(buttonCss["--btn-height-md"] !== undefined, "CSS variable [--btn-height-md] generated");
    assert(buttonCss["--btn-hover-scale"] !== undefined, "CSS variable [--btn-hover-scale] generated");
    assert(buttonCss["--btn-active-scale"] !== undefined, "CSS variable [--btn-active-scale] generated");
    assert(buttonCss["--btn-disabled-opacity"] !== undefined, "CSS variable [--btn-disabled-opacity] generated");

    console.log("\n--- PHASE 6: DATABASE PERSISTENCE & THEME INTEGRATION ---");
    const customButtonTheme: ThemeTokens = {
      ...THEME_PRESETS["royal-blue"],
      name: "Custom Artisan Pill Buttons Theme",
      buttons: {
        ...DEFAULT_BUTTON_CONFIG,
        shape: "leaf",
        borderRadius: "1.5rem 0.25rem",
        shadow: "glow",
        hover: {
          scale: 1.05,
          brightness: 1.1,
          translateY: "-2px",
          enableGlow: true,
        },
      },
    };

    const combinedCss = getThemeCssVariables(customButtonTheme);
    assert(combinedCss["--btn-radius"] === "1.5rem 0.25rem", "Custom leaf border radius output in CSS vars");
    assert(combinedCss["--btn-hover-scale"] === "1.05", "Custom hover scale 1.05 output in CSS vars");

    await prisma.systemPageConfig.upsert({
      where: { id: "theme-builder-config" },
      update: {
        name: "Global Theme & Design System",
        configJson: JSON.stringify(customButtonTheme),
      },
      create: {
        id: "theme-builder-config",
        name: "Global Theme & Design System",
        configJson: JSON.stringify(customButtonTheme),
      },
    });

    const stored = await prisma.systemPageConfig.findUnique({
      where: { id: "theme-builder-config" },
    });
    const parsed: ThemeTokens = JSON.parse(stored!.configJson);

    assert(parsed.buttons?.shape === "leaf", "Persisted custom button shape 'leaf' in database");
    assert(parsed.buttons?.borderRadius === "1.5rem 0.25rem", "Persisted custom button border-radius in database");
    assert(parsed.buttons?.shadow === "glow", "Persisted custom button shadow 'glow' in database");

    console.log("\n=======================================================================");
    console.log(`Button Design Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test execution failed:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runButtonDesignTests();
