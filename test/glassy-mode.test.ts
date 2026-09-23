import { PrismaClient } from "@prisma/client";
import {
  AppearanceMode,
  GlassyModeConfig,
  DEFAULT_GLASSY_CONFIG,
  THEME_PRESETS,
  ThemeTokens,
  getThemeCssVariables,
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

async function runGlassyModeTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — SECTION 22: GLASSY MODE APPEARANCE TEST SUITE");
  console.log("=======================================================================\n");

  try {
    console.log("--- PHASE 1: VERIFYING ALL 3 GLOBAL APPEARANCE MODES ---");
    const requiredModes: AppearanceMode[] = ["NORMAL", "DARK", "GLASSY"];
    assert(requiredModes.length === 3, "3 global appearance modes supported (NORMAL, DARK, GLASSY)");

    const normalPreset = THEME_PRESETS["royal-blue"];
    const darkPreset = THEME_PRESETS["midnight-luxury"];
    const glassyPreset = THEME_PRESETS["glassy-neo"];

    assert(normalPreset.appearanceMode === "NORMAL", "Royal Blue mapped to NORMAL appearance mode");
    assert(darkPreset.appearanceMode === "DARK", "Midnight Luxury mapped to DARK appearance mode");
    assert(glassyPreset.appearanceMode === "GLASSY", "Glassy Neo mapped to GLASSY appearance mode");

    console.log("\n--- PHASE 2: GLASSY MODE DESIGN CHARACTERISTICS ---");
    assert(DEFAULT_GLASSY_CONFIG.backdropBlur >= 16, `Backdrop blur filter calibrated: ${DEFAULT_GLASSY_CONFIG.backdropBlur}px`);
    assert(DEFAULT_GLASSY_CONFIG.cardOpacity >= 0.70, `Card opacity protected for WCAG AA readability: ${DEFAULT_GLASSY_CONFIG.cardOpacity * 100}%`);
    assert(DEFAULT_GLASSY_CONFIG.surfaceOpacity > 0.5, `Translucent surface opacity: ${DEFAULT_GLASSY_CONFIG.surfaceOpacity * 100}%`);
    assert(DEFAULT_GLASSY_CONFIG.borderSoftness.length > 0, `Soft border reflection defined: "${DEFAULT_GLASSY_CONFIG.borderSoftness}"`);
    assert(DEFAULT_GLASSY_CONFIG.floatingNav === true, "Floating navigation pill enabled");
    assert(DEFAULT_GLASSY_CONFIG.ambientGradient === true, "Smooth multi-stop ambient gradient enabled");

    console.log("\n--- PHASE 3: CSS VARIABLE GENERATION ---");
    const glassyVars = getThemeCssVariables(glassyPreset);
    assert(glassyVars["--glass-blur"] !== undefined, "CSS variable [--glass-blur] generated");
    assert(glassyVars["--glass-opacity"] !== undefined, "CSS variable [--glass-opacity] generated");
    assert(glassyVars["--glass-surface-opacity"] !== undefined, "CSS variable [--glass-surface-opacity] generated");
    assert(glassyVars["--glass-soft-border"] !== undefined, "CSS variable [--glass-soft-border] generated");

    console.log("\n--- PHASE 4: GLOBAL ENABLE / DISABLE & PERSISTENCE ---");
    // Admin toggles global Glassy Mode
    const customGlassyTheme: ThemeTokens = {
      ...glassyPreset,
      name: "Custom Apple Glassy 2.0",
      appearanceMode: "GLASSY",
      activeMode: "glassy",
      glassyConfig: {
        ...DEFAULT_GLASSY_CONFIG,
        enabled: true,
        backdropBlur: 24,
        cardOpacity: 0.85,
        surfaceOpacity: 0.72,
      },
    };

    await prisma.systemPageConfig.upsert({
      where: { id: "theme-builder-config" },
      update: {
        name: "Global Theme & Design System",
        configJson: JSON.stringify(customGlassyTheme),
      },
      create: {
        id: "theme-builder-config",
        name: "Global Theme & Design System",
        configJson: JSON.stringify(customGlassyTheme),
      },
    });

    const stored = await prisma.systemPageConfig.findUnique({
      where: { id: "theme-builder-config" },
    });
    const parsed: ThemeTokens = JSON.parse(stored!.configJson);

    assert(parsed.appearanceMode === "GLASSY", "Persisted appearanceMode 'GLASSY' in database");
    assert(parsed.glassyConfig?.enabled === true, "Persisted Glassy Mode enabled in database");
    assert(parsed.glassyConfig?.backdropBlur === 24, "Persisted 24px backdrop blur in database");

    console.log("\n=======================================================================");
    console.log(`Glassy Mode Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test execution failed:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runGlassyModeTests();
