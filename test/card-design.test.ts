import { PrismaClient } from "@prisma/client";
import {
  CardPresetType,
  CardShadowType,
  CardHoverAnimationType,
  CardConfig,
  CARD_PRESETS,
  DEFAULT_CARD_CONFIG,
  getCardCssVariables,
} from "../src/lib/card-builder-types";
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

async function runCardDesignTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — SECTION 21: CARD DESIGN SYSTEM TEST SUITE");
  console.log("=======================================================================\n");

  try {
    console.log("--- PHASE 1: VERIFYING ALL 5 CARD PRESETS ---");
    const requiredPresets: CardPresetType[] = ["classic", "minimal", "soft", "glass", "premium"];
    assert(requiredPresets.length === 5, "5 card presets registered");

    requiredPresets.forEach((pKey) => {
      const p = CARD_PRESETS[pKey];
      assert(p !== undefined, `Card Preset [${pKey}] is defined`);
      assert(p.borderRadius.length > 0, `  - ${pKey} borderRadius: ${p.borderRadius}`);
      assert(p.shadow.length > 0, `  - ${pKey} shadow: ${p.shadow}`);
      assert(p.imageRadius.length > 0, `  - ${pKey} imageRadius: ${p.imageRadius}`);
      assert(p.padding.length > 0, `  - ${pKey} padding: ${p.padding}`);
    });

    console.log("\n--- PHASE 2: BORDER & GEOMETRY CONFIGURATION ---");
    assert(DEFAULT_CARD_CONFIG.borderRadius.length > 0, `Default card border-radius: "${DEFAULT_CARD_CONFIG.borderRadius}"`);
    assert(DEFAULT_CARD_CONFIG.borderWidth.length > 0, `Default border-width: "${DEFAULT_CARD_CONFIG.borderWidth}"`);
    assert(DEFAULT_CARD_CONFIG.borderStyle.length > 0, `Default border-style: "${DEFAULT_CARD_CONFIG.borderStyle}"`);
    assert(DEFAULT_CARD_CONFIG.imageRadius.length > 0, `Default image-radius: "${DEFAULT_CARD_CONFIG.imageRadius}"`);
    assert(DEFAULT_CARD_CONFIG.padding.length > 0, `Default padding: "${DEFAULT_CARD_CONFIG.padding}"`);

    console.log("\n--- PHASE 3: SHADOW & HOVER ANIMATION INTEGRITY ---");
    assert(DEFAULT_CARD_CONFIG.shadow.length > 0, `Default card shadow: "${DEFAULT_CARD_CONFIG.shadow}"`);
    assert(DEFAULT_CARD_CONFIG.hoverAnimation.length > 0, `Hover animation type: "${DEFAULT_CARD_CONFIG.hoverAnimation}"`);
    assert(typeof DEFAULT_CARD_CONFIG.hoverScale === "number", `Hover scale: ${DEFAULT_CARD_CONFIG.hoverScale}x`);
    assert(typeof DEFAULT_CARD_CONFIG.hoverLiftY === "string", `Hover lift translateY: "${DEFAULT_CARD_CONFIG.hoverLiftY}"`);

    console.log("\n--- PHASE 4: CSS VARIABLE GENERATION ---");
    const cardCss = getCardCssVariables(DEFAULT_CARD_CONFIG);
    assert(cardCss["--card-radius"] !== undefined, "CSS variable [--card-radius] generated");
    assert(cardCss["--card-border-width"] !== undefined, "CSS variable [--card-border-width] generated");
    assert(cardCss["--card-border-color"] !== undefined, "CSS variable [--card-border-color] generated");
    assert(cardCss["--card-border-style"] !== undefined, "CSS variable [--card-border-style] generated");
    assert(cardCss["--card-shadow"] !== undefined, "CSS variable [--card-shadow] generated");
    assert(cardCss["--card-hover-transform"] !== undefined, "CSS variable [--card-hover-transform] generated");
    assert(cardCss["--card-img-radius"] !== undefined, "CSS variable [--card-img-radius] generated");
    assert(cardCss["--card-padding"] !== undefined, "CSS variable [--card-padding] generated");

    console.log("\n--- PHASE 5: DATABASE PERSISTENCE & THEME INTEGRATION ---");
    const customCardTheme: ThemeTokens = {
      ...THEME_PRESETS["royal-blue"],
      name: "Luxury Gold Card Theme",
      cards: {
        ...CARD_PRESETS.premium,
        borderRadius: "1.75rem",
        imageRadius: "1.25rem",
        shadow: "floating",
        hoverLiftY: "-10px",
      },
    };

    const combinedCss = getThemeCssVariables(customCardTheme);
    assert(combinedCss["--card-radius"] === "1.75rem", "Custom card radius 1.75rem output in CSS vars");
    assert(combinedCss["--card-img-radius"] === "1.25rem", "Custom image radius 1.25rem output in CSS vars");
    assert(combinedCss["--card-hover-transform"] === "translateY(-10px)", "Custom hover translateY(-10px) output in CSS vars");

    await prisma.systemPageConfig.upsert({
      where: { id: "theme-builder-config" },
      update: {
        name: "Global Theme & Design System",
        configJson: JSON.stringify(customCardTheme),
      },
      create: {
        id: "theme-builder-config",
        name: "Global Theme & Design System",
        configJson: JSON.stringify(customCardTheme),
      },
    });

    const stored = await prisma.systemPageConfig.findUnique({
      where: { id: "theme-builder-config" },
    });
    const parsed: ThemeTokens = JSON.parse(stored!.configJson);

    assert(parsed.cards?.activePreset === "premium", "Persisted card preset 'premium' in database");
    assert(parsed.cards?.borderRadius === "1.75rem", "Persisted custom card border-radius in database");
    assert(parsed.cards?.imageRadius === "1.25rem", "Persisted custom image radius in database");

    console.log("\n=======================================================================");
    console.log(`Card Design Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test execution failed:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runCardDesignTests();
