import { PrismaClient } from "@prisma/client";
import {
  GlassyPresetType,
  GlassyShadowStrength,
  GlassyBackgroundGradient,
  GlassySettingsConfig,
  GLASSY_PRESETS,
  DEFAULT_GLASSY_SETTINGS,
  getGlassySettingsCssVariables,
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

async function runGlassySettingsTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — SECTION 23: GLASSY MODE SETTINGS TEST SUITE");
  console.log("=======================================================================\n");

  try {
    console.log("--- PHASE 1: 4 CURATED GLASSY PRESETS ---");
    const requiredPresets: GlassyPresetType[] = [
      "light-glass",
      "premium-glass",
      "deep-glass",
      "color-glass",
    ];

    for (const p of requiredPresets) {
      const preset = GLASSY_PRESETS[p];
      assert(preset !== undefined, `Glassy preset '${p}' is defined`);
      assert(preset.blurIntensity >= 8 && preset.blurIntensity <= 40, `Preset '${p}' has valid blur: ${preset.blurIntensity}px`);
      assert(preset.glassOpacity >= 0.5 && preset.glassOpacity <= 1.0, `Preset '${p}' has valid glass opacity: ${preset.glassOpacity}`);
      assert(preset.borderOpacity >= 0.1 && preset.borderOpacity <= 1.0, `Preset '${p}' has valid border opacity: ${preset.borderOpacity}`);
      assert(preset.cornerRadius.length > 0, `Preset '${p}' has corner radius: ${preset.cornerRadius}`);
      assert(preset.cardTransparency >= 0.65, `Preset '${p}' has accessible card transparency: ${preset.cardTransparency}`);
      assert(preset.navbarTransparency >= 0.55, `Preset '${p}' has navbar transparency: ${preset.navbarTransparency}`);
      assert(preset.modalTransparency >= 0.75, `Preset '${p}' has modal transparency: ${preset.modalTransparency}`);
    }

    console.log("\n--- PHASE 2: 9 CONFIGURABLE ADMIN PROPERTIES & CSS VARIABLES ---");
    const customConfig: GlassySettingsConfig = {
      activePreset: "premium-glass",
      blurIntensity: 28,
      glassOpacity: 0.82,
      borderOpacity: 0.65,
      shadowStrength: "glow",
      cornerRadius: "1.5rem",
      backgroundGradient: "aurora-blue",
      cardTransparency: 0.84,
      navbarTransparency: 0.75,
      modalTransparency: 0.94,
    };

    const cssVars = getGlassySettingsCssVariables(customConfig);

    assert(cssVars["--glass-blur-intensity"] === "28px", "CSS variable [--glass-blur-intensity] is 28px");
    assert(cssVars["--glass-overall-opacity"] === "0.82", "CSS variable [--glass-overall-opacity] is 0.82");
    assert(cssVars["--glass-border-opacity"] === "0.65", "CSS variable [--glass-border-opacity] is 0.65");
    assert(typeof cssVars["--glass-shadow"] === "string" && cssVars["--glass-shadow"].includes("rgba"), "CSS variable [--glass-shadow] computed");
    assert(cssVars["--glass-corner-radius"] === "1.5rem", "CSS variable [--glass-corner-radius] is 1.5rem");
    assert(cssVars["--glass-card-opacity"] === "0.84", "CSS variable [--glass-card-opacity] is 0.84");
    assert(cssVars["--glass-nav-opacity"] === "0.75", "CSS variable [--glass-nav-opacity] is 0.75");
    assert(cssVars["--glass-modal-opacity"] === "0.94", "CSS variable [--glass-modal-opacity] is 0.94");
    assert(typeof cssVars["--glass-bg-gradient"] === "string", "CSS variable [--glass-bg-gradient] computed");

    console.log("\n--- PHASE 3: THEME TOKEN INTEGRATION & MASTER GENERATION ---");
    const testTheme: ThemeTokens = {
      ...THEME_PRESETS["glassy-neo"],
      glassySettings: customConfig,
    };

    const masterVars = getThemeCssVariables(testTheme);
    assert(masterVars["--glass-blur-intensity"] === "28px", "Master theme CSS variables contain --glass-blur-intensity");
    assert(masterVars["--glass-card-opacity"] === "0.84", "Master theme CSS variables contain --glass-card-opacity");
    assert(masterVars["--glass-modal-opacity"] === "0.94", "Master theme CSS variables contain --glass-modal-opacity");

    console.log("\n--- PHASE 4: DATABASE PERSISTENCE ---");
    await prisma.systemPageConfig.upsert({
      where: { id: "theme-builder-config" },
      update: {
        name: "Global Theme & Design System",
        configJson: JSON.stringify(testTheme),
      },
      create: {
        id: "theme-builder-config",
        name: "Global Theme & Design System",
        configJson: JSON.stringify(testTheme),
      },
    });

    const record = await prisma.systemPageConfig.findUnique({
      where: { id: "theme-builder-config" },
    });
    const parsed: ThemeTokens = JSON.parse(record!.configJson);

    assert(parsed.glassySettings !== undefined, "glassySettings persisted in database");
    assert(parsed.glassySettings?.blurIntensity === 28, "Persisted blurIntensity = 28");
    assert(parsed.glassySettings?.shadowStrength === "glow", "Persisted shadowStrength = 'glow'");
    assert(parsed.glassySettings?.modalTransparency === 0.94, "Persisted modalTransparency = 0.94");

    console.log("\n=======================================================================");
    console.log(`Glassy Mode Settings Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test execution failed:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runGlassySettingsTests();
