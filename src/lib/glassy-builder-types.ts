export type GlassyPresetType = "light-glass" | "premium-glass" | "deep-glass" | "color-glass";
export type GlassyShadowStrength = "subtle" | "medium" | "deep" | "glow" | "neon";
export type GlassyBackgroundGradient = "mesh-light" | "mesh-dark" | "aurora-blue" | "festive-saffron" | "none";

export interface GlassySettingsConfig {
  activePreset: GlassyPresetType;
  blurIntensity: number;         // in px, e.g. 16 to 40
  glassOpacity: number;          // e.g. 0.70 (70%)
  borderOpacity: number;         // e.g. 0.50 (50%)
  shadowStrength: GlassyShadowStrength;
  cornerRadius: string;          // e.g. "1.25rem"
  backgroundGradient: GlassyBackgroundGradient;
  cardTransparency: number;      // e.g. 0.80 (80% opacity)
  navbarTransparency: number;    // e.g. 0.70 (70% opacity)
  modalTransparency: number;     // e.g. 0.90 (90% opacity)
}

export const GLASSY_PRESETS: Record<GlassyPresetType, GlassySettingsConfig> = {
  "light-glass": {
    activePreset: "light-glass",
    blurIntensity: 16,
    glassOpacity: 0.75,
    borderOpacity: 0.45,
    shadowStrength: "subtle",
    cornerRadius: "1rem",
    backgroundGradient: "mesh-light",
    cardTransparency: 0.78,
    navbarTransparency: 0.72,
    modalTransparency: 0.88,
  },
  "premium-glass": {
    activePreset: "premium-glass",
    blurIntensity: 24,
    glassOpacity: 0.80,
    borderOpacity: 0.60,
    shadowStrength: "glow",
    cornerRadius: "1.25rem",
    backgroundGradient: "aurora-blue",
    cardTransparency: 0.80,
    navbarTransparency: 0.70,
    modalTransparency: 0.90,
  },
  "deep-glass": {
    activePreset: "deep-glass",
    blurIntensity: 32,
    glassOpacity: 0.85,
    borderOpacity: 0.25,
    shadowStrength: "deep",
    cornerRadius: "1.5rem",
    backgroundGradient: "mesh-dark",
    cardTransparency: 0.85,
    navbarTransparency: 0.78,
    modalTransparency: 0.92,
  },
  "color-glass": {
    activePreset: "color-glass",
    blurIntensity: 20,
    glassOpacity: 0.78,
    borderOpacity: 0.55,
    shadowStrength: "neon",
    cornerRadius: "1.25rem",
    backgroundGradient: "festive-saffron",
    cardTransparency: 0.76,
    navbarTransparency: 0.68,
    modalTransparency: 0.86,
  },
};

export const DEFAULT_GLASSY_SETTINGS: GlassySettingsConfig = GLASSY_PRESETS["premium-glass"];

/**
 * Generate CSS variables from Glassy Settings
 */
export function getGlassySettingsCssVariables(config: GlassySettingsConfig): Record<string, string> {
  const shadowMap: Record<GlassyShadowStrength, string> = {
    subtle: "0 4px 16px 0 rgba(31, 38, 135, 0.07)",
    medium: "0 8px 32px 0 rgba(31, 38, 135, 0.12)",
    deep: "0 16px 48px 0 rgba(0, 0, 0, 0.35)",
    glow: "0 0 24px rgba(37, 99, 235, 0.25), 0 8px 32px rgba(31, 38, 135, 0.10)",
    neon: "0 0 30px rgba(247, 148, 29, 0.3), 0 0 60px rgba(99, 102, 241, 0.2)",
  };

  const gradientMap: Record<GlassyBackgroundGradient, string> = {
    "mesh-light": "radial-gradient(at 10% 20%, rgba(37, 99, 235, 0.08) 0px, transparent 50%), radial-gradient(at 90% 80%, rgba(247, 148, 29, 0.08) 0px, transparent 50%), #F8FAFC",
    "mesh-dark": "radial-gradient(at 10% 20%, rgba(37, 99, 235, 0.18) 0px, transparent 50%), radial-gradient(at 90% 80%, rgba(249, 115, 22, 0.18) 0px, transparent 50%), #0B1120",
    "aurora-blue": "linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(6, 182, 212, 0.12) 50%, rgba(99, 102, 241, 0.12) 100%)",
    "festive-saffron": "linear-gradient(135deg, rgba(234, 88, 12, 0.15) 0%, rgba(245, 158, 11, 0.12) 50%, rgba(217, 119, 6, 0.15) 100%)",
    none: "transparent",
  };

  return {
    "--glass-blur-intensity": `${config.blurIntensity}px`,
    "--glass-overall-opacity": `${config.glassOpacity}`,
    "--glass-border-opacity": `${config.borderOpacity}`,
    "--glass-shadow": shadowMap[config.shadowStrength] || shadowMap.glow,
    "--glass-corner-radius": config.cornerRadius,
    "--glass-card-opacity": `${config.cardTransparency}`,
    "--glass-nav-opacity": `${config.navbarTransparency}`,
    "--glass-modal-opacity": `${config.modalTransparency}`,
    "--glass-bg-gradient": gradientMap[config.backgroundGradient] || gradientMap["mesh-light"],
  };
}
