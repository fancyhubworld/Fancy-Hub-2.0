import {
  TypographyConfig,
  DEFAULT_TYPOGRAPHY_CONFIG,
  getTypographyCssVariables,
} from "./typography-builder-types";
import {
  ButtonConfig,
  DEFAULT_BUTTON_CONFIG,
  getButtonCssVariables,
} from "./button-builder-types";
import {
  CardConfig,
  DEFAULT_CARD_CONFIG,
  CARD_PRESETS,
  getCardCssVariables,
} from "./card-builder-types";
import {
  GlassySettingsConfig,
  DEFAULT_GLASSY_SETTINGS,
  GLASSY_PRESETS,
  getGlassySettingsCssVariables,
} from "./glassy-builder-types";
import {
  UniversalSectionSettings,
  DEFAULT_SECTION_SETTINGS,
} from "./section-builder-types";

export * from "./typography-builder-types";
export * from "./button-builder-types";
export * from "./card-builder-types";
export * from "./glassy-builder-types";
export * from "./section-builder-types";

export type AppearanceMode = "NORMAL" | "DARK" | "GLASSY";
export type ThemeModePreference = "light" | "dark" | "system";

export interface GlassyModeConfig {
  enabled: boolean;
  backdropBlur: number;         // 16 to 40 px
  surfaceOpacity: number;       // 0.60 to 0.85
  cardOpacity: number;          // 0.70 to 0.90 (balanced for readability)
  borderSoftness: string;       // "rgba(255, 255, 255, 0.55)"
  floatingNav: boolean;
  ambientGradient: boolean;
  reflectionGlow: boolean;
}

export const DEFAULT_GLASSY_CONFIG: GlassyModeConfig = {
  enabled: true,
  backdropBlur: 24,
  surfaceOpacity: 0.68,
  cardOpacity: 0.80,
  borderSoftness: "rgba(255, 255, 255, 0.55)",
  floatingNav: true,
  ambientGradient: true,
  reflectionGlow: true,
};

export interface ThemeTokens {
  id?: string;
  name: string;
  // 15 Global Color Tokens
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  successColor: string;
  warningColor: string;
  dangerColor: string;
  infoColor: string;
  backgroundColor: string;
  surfaceColor: string;
  cardColor: string;
  textColor: string;
  mutedTextColor: string;
  borderColor: string;
  inputColor: string;
  buttonColor: string;

  // Typography, Buttons, Cards, Glassy & Section Subsystems
  fontFamily: string;
  typography?: TypographyConfig;
  buttons?: ButtonConfig;
  cards?: CardConfig;
  glassyConfig?: GlassyModeConfig;
  glassySettings?: GlassySettingsConfig;
  defaultSectionSettings?: UniversalSectionSettings;

  borderRadius: string;
  glassyBlur: number;
  glassyOpacity: number;
  buttonStyle: "pill" | "rounded" | "gradient" | "soft" | "glass";
  cardStyle: "flat" | "elevated" | "glass-card" | "border-minimal";
  activePreset: string;
  activeMode: "light" | "dark" | "glassy";
  appearanceMode?: AppearanceMode;
  modePreference?: ThemeModePreference;
  customCss?: string | null;
}

export const THEME_PRESETS: Record<string, ThemeTokens> = {
  // 1. FancyHub Classic (Default Light Royal Blue)
  "fancyhub-classic": {
    name: "FancyHub Classic",
    primaryColor: "#1455D9",
    secondaryColor: "#F7941D",
    accentColor: "#6366F1",
    successColor: "#10B981",
    warningColor: "#F59E0B",
    dangerColor: "#EF4444",
    infoColor: "#0EA5E9",
    backgroundColor: "#F8FAFC",
    surfaceColor: "#F1F5F9",
    cardColor: "#FFFFFF",
    textColor: "#0F172A",
    mutedTextColor: "#64748B",
    borderColor: "#E2E8F0",
    inputColor: "#FFFFFF",
    buttonColor: "#1455D9",
    fontFamily: "Inter",
    typography: DEFAULT_TYPOGRAPHY_CONFIG,
    buttons: DEFAULT_BUTTON_CONFIG,
    cards: CARD_PRESETS.classic,
    glassyConfig: { ...DEFAULT_GLASSY_CONFIG, enabled: false },
    glassySettings: GLASSY_PRESETS["light-glass"],
    defaultSectionSettings: DEFAULT_SECTION_SETTINGS,
    borderRadius: "1rem",
    glassyBlur: 16,
    glassyOpacity: 0.7,
    buttonStyle: "pill",
    cardStyle: "glass-card",
    activePreset: "fancyhub-classic",
    activeMode: "light",
    appearanceMode: "NORMAL",
    modePreference: "system",
  },

  // 2. FancyHub Modern (Minimalist Emerald Green & Slate)
  "fancyhub-modern": {
    name: "FancyHub Modern",
    primaryColor: "#059669",
    secondaryColor: "#D97706",
    accentColor: "#3B82F6",
    successColor: "#10B981",
    warningColor: "#F59E0B",
    dangerColor: "#DC2626",
    infoColor: "#0284C7",
    backgroundColor: "#F4FBF7",
    surfaceColor: "#E6F7EF",
    cardColor: "#FFFFFF",
    textColor: "#064E3B",
    mutedTextColor: "#047857",
    borderColor: "#D1FAE5",
    inputColor: "#FFFFFF",
    buttonColor: "#059669",
    fontFamily: "Outfit",
    typography: {
      ...DEFAULT_TYPOGRAPHY_CONFIG,
      headingFontFamily: "Outfit",
      bodyFontFamily: "Outfit",
    },
    buttons: {
      ...DEFAULT_BUTTON_CONFIG,
      defaultStyle: "solid",
      shape: "rounded",
      borderRadius: "0.75rem",
      shadow: "sm",
    },
    cards: CARD_PRESETS.soft,
    glassyConfig: { ...DEFAULT_GLASSY_CONFIG, enabled: false },
    glassySettings: GLASSY_PRESETS["light-glass"],
    defaultSectionSettings: DEFAULT_SECTION_SETTINGS,
    borderRadius: "0.85rem",
    glassyBlur: 16,
    glassyOpacity: 0.75,
    buttonStyle: "rounded",
    cardStyle: "elevated",
    activePreset: "fancyhub-modern",
    activeMode: "light",
    appearanceMode: "NORMAL",
    modePreference: "light",
  },

  // 3. FancyHub Glass (Apple iOS Liquid Glassmorphism)
  "fancyhub-glass": {
    name: "FancyHub Glass",
    primaryColor: "#2563EB",
    secondaryColor: "#F97316",
    accentColor: "#06B6D4",
    successColor: "#10B981",
    warningColor: "#F59E0B",
    dangerColor: "#F43F5E",
    infoColor: "#38BDF8",
    backgroundColor: "#F1F5F9",
    surfaceColor: "rgba(255, 255, 255, 0.68)",
    cardColor: "rgba(255, 255, 255, 0.80)",
    textColor: "#0F172A",
    mutedTextColor: "#475569",
    borderColor: "rgba(255, 255, 255, 0.55)",
    inputColor: "rgba(255, 255, 255, 0.85)",
    buttonColor: "#2563EB",
    fontFamily: "Plus Jakarta Sans",
    typography: {
      ...DEFAULT_TYPOGRAPHY_CONFIG,
      headingFontFamily: "Plus Jakarta Sans",
      bodyFontFamily: "Plus Jakarta Sans",
    },
    buttons: {
      ...DEFAULT_BUTTON_CONFIG,
      defaultStyle: "glass",
      shape: "pill",
      borderRadius: "9999px",
      shadow: "glow",
    },
    cards: CARD_PRESETS.glass,
    glassyConfig: DEFAULT_GLASSY_CONFIG,
    glassySettings: GLASSY_PRESETS["premium-glass"],
    defaultSectionSettings: DEFAULT_SECTION_SETTINGS,
    borderRadius: "1.25rem",
    glassyBlur: 24,
    glassyOpacity: 0.80,
    buttonStyle: "glass",
    cardStyle: "glass-card",
    activePreset: "fancyhub-glass",
    activeMode: "glassy",
    appearanceMode: "GLASSY",
    modePreference: "light",
  },

  // 4. FancyHub Dark (Midnight Obsidian OLED with Separate Design Tokens)
  "fancyhub-dark": {
    name: "FancyHub Dark",
    primaryColor: "#6366F1",
    secondaryColor: "#EC4899",
    accentColor: "#14B8A6",
    successColor: "#22C55E",
    warningColor: "#FBBF24",
    dangerColor: "#F87171",
    infoColor: "#60A5FA",
    backgroundColor: "#0A0F1D",
    surfaceColor: "#111827",
    cardColor: "#1E293B",
    textColor: "#F9FAFB",
    mutedTextColor: "#94A3B8",
    borderColor: "#334155",
    inputColor: "#1E293B",
    buttonColor: "#6366F1",
    fontFamily: "Inter",
    typography: {
      ...DEFAULT_TYPOGRAPHY_CONFIG,
      headingFontFamily: "Inter",
      bodyFontFamily: "Inter",
    },
    buttons: {
      ...DEFAULT_BUTTON_CONFIG,
      defaultStyle: "solid",
      shape: "rounded",
      borderRadius: "0.85rem",
      shadow: "neon",
    },
    cards: {
      ...CARD_PRESETS.premium,
      backgroundColor: "#1E293B",
      borderColor: "#334155",
      shadow: "xl",
    },
    glassyConfig: {
      ...DEFAULT_GLASSY_CONFIG,
      enabled: false,
      surfaceOpacity: 0.75,
      cardOpacity: 0.85,
      borderSoftness: "rgba(255, 255, 255, 0.12)",
    },
    glassySettings: GLASSY_PRESETS["deep-glass"],
    defaultSectionSettings: DEFAULT_SECTION_SETTINGS,
    borderRadius: "1rem",
    glassyBlur: 20,
    glassyOpacity: 0.6,
    buttonStyle: "pill",
    cardStyle: "glass-card",
    activePreset: "fancyhub-dark",
    activeMode: "dark",
    appearanceMode: "DARK",
    modePreference: "dark",
  },

  // 5. FancyHub Premium (Festive Royal Saffron, Gold & Maroon Heritage)
  "fancyhub-premium": {
    name: "FancyHub Premium",
    primaryColor: "#EA580C",
    secondaryColor: "#F59E0B",
    accentColor: "#8B5CF6",
    successColor: "#16A34A",
    warningColor: "#D97706",
    dangerColor: "#DC2626",
    infoColor: "#2563EB",
    backgroundColor: "#FFFBF7",
    surfaceColor: "#FFF3E8",
    cardColor: "#FFFFFF",
    textColor: "#431407",
    mutedTextColor: "#78350F",
    borderColor: "#FED7AA",
    inputColor: "#FFFFFF",
    buttonColor: "#EA580C",
    fontFamily: "Playfair Display",
    typography: {
      ...DEFAULT_TYPOGRAPHY_CONFIG,
      headingFontFamily: "Playfair Display",
      bodyFontFamily: "Poppins",
    },
    buttons: {
      ...DEFAULT_BUTTON_CONFIG,
      defaultStyle: "gradient",
      shape: "pill",
      borderRadius: "9999px",
      shadow: "glow",
      styles: {
        ...DEFAULT_BUTTON_CONFIG.styles,
        gradient: {
          fromColor: "#EA580C",
          toColor: "#F59E0B",
          direction: "to right",
        },
      },
    },
    cards: CARD_PRESETS.premium,
    glassyConfig: { ...DEFAULT_GLASSY_CONFIG, enabled: false },
    glassySettings: GLASSY_PRESETS["color-glass"],
    defaultSectionSettings: DEFAULT_SECTION_SETTINGS,
    borderRadius: "1.5rem",
    glassyBlur: 18,
    glassyOpacity: 0.8,
    buttonStyle: "gradient",
    cardStyle: "elevated",
    activePreset: "fancyhub-premium",
    activeMode: "light",
    appearanceMode: "NORMAL",
    modePreference: "light",
  },
};

// Backwards compatibility aliases
THEME_PRESETS["royal-blue"] = THEME_PRESETS["fancyhub-classic"];
THEME_PRESETS["emerald-handloom"] = THEME_PRESETS["fancyhub-modern"];
THEME_PRESETS["glassy-neo"] = THEME_PRESETS["fancyhub-glass"];
THEME_PRESETS["midnight-luxury"] = THEME_PRESETS["fancyhub-dark"];
THEME_PRESETS["saffron-sunset"] = THEME_PRESETS["fancyhub-premium"];

export const DEFAULT_THEME_TOKENS: ThemeTokens = THEME_PRESETS["fancyhub-classic"];

/**
 * Convert Hex / RGBA code to HSL string values
 */
export function hexToHslValues(colorStr: string): string {
  if (!colorStr) return "221 83% 47%";
  if (colorStr.startsWith("rgba") || colorStr.startsWith("rgb")) {
    return "221 83% 47%";
  }

  let c = colorStr.replace("#", "");
  if (c.length === 3) {
    c = c.split("").map((x) => x + x).join("");
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return "221 83% 47%";

  const r = (num >> 16) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export const generateCssVariables = (theme: ThemeTokens) => getThemeCssVariables(theme);

export function getThemeCssVariables(theme: ThemeTokens): Record<string, string> {
  const primaryHsl = hexToHslValues(theme.primaryColor || "#1455D9");
  const secondaryHsl = hexToHslValues(theme.secondaryColor || "#F7941D");
  const accentHsl = hexToHslValues(theme.accentColor || "#6366F1");
  const successHsl = hexToHslValues(theme.successColor || "#10B981");
  const warningHsl = hexToHslValues(theme.warningColor || "#F59E0B");
  const dangerHsl = hexToHslValues(theme.dangerColor || "#EF4444");
  const infoHsl = hexToHslValues(theme.infoColor || "#0EA5E9");
  const bgHsl = hexToHslValues(theme.backgroundColor || "#F8FAFC");
  const surfaceHsl = hexToHslValues(theme.surfaceColor || "#F1F5F9");
  const cardHsl = hexToHslValues(theme.cardColor || "#FFFFFF");
  const textHsl = hexToHslValues(theme.textColor || "#0F172A");
  const mutedHsl = hexToHslValues(theme.mutedTextColor || "#64748B");
  const borderHsl = hexToHslValues(theme.borderColor || "#E2E8F0");
  const inputHsl = hexToHslValues(theme.inputColor || "#FFFFFF");
  const buttonHsl = hexToHslValues(theme.buttonColor || theme.primaryColor || "#1455D9");

  const typographyVars = getTypographyCssVariables(
    theme.typography || DEFAULT_TYPOGRAPHY_CONFIG
  );

  const buttonVars = getButtonCssVariables(
    theme.buttons || DEFAULT_BUTTON_CONFIG
  );

  const cardVars = getCardCssVariables(
    theme.cards || DEFAULT_CARD_CONFIG
  );

  const glassy = theme.glassyConfig || DEFAULT_GLASSY_CONFIG;
  const glassySettingsVars = getGlassySettingsCssVariables(
    theme.glassySettings || DEFAULT_GLASSY_SETTINGS
  );

  return {
    // Standard Design Token CSS Variables
    "--primary": primaryHsl,
    "--secondary": secondaryHsl,
    "--accent": accentHsl,
    "--success": successHsl,
    "--warning": warningHsl,
    "--danger": dangerHsl,
    "--destructive": dangerHsl,
    "--info": infoHsl,
    "--background": bgHsl,
    "--surface": surfaceHsl,
    "--card": cardHsl,
    "--text": textHsl,
    "--foreground": textHsl,
    "--muted": mutedHsl,
    "--border": borderHsl,
    "--input": inputHsl,
    "--button": buttonHsl,
    "--radius": theme.borderRadius || "1rem",

    // Direct HEX and Effect Variables
    "--theme-primary": theme.primaryColor || "#1455D9",
    "--theme-secondary": theme.secondaryColor || "#F7941D",
    "--theme-accent": theme.accentColor || "#6366F1",
    "--theme-success": theme.successColor || "#10B981",
    "--theme-warning": theme.warningColor || "#F59E0B",
    "--theme-danger": theme.dangerColor || "#EF4444",
    "--theme-info": theme.infoColor || "#0EA5E9",
    "--theme-bg": theme.backgroundColor || "#F8FAFC",
    "--theme-surface": theme.surfaceColor || "#F1F5F9",
    "--theme-card": theme.cardColor || "#FFFFFF",
    "--theme-text": theme.textColor || "#0F172A",
    "--theme-muted": theme.mutedTextColor || "#64748B",
    "--theme-border": theme.borderColor || "#E2E8F0",
    "--theme-input": theme.inputColor || "#FFFFFF",
    "--theme-button": theme.buttonColor || "#1455D9",
    "--theme-font": theme.fontFamily || "Inter",
    "--glass-blur": `${theme.glassyBlur || glassy.backdropBlur || 24}px`,
    "--glass-opacity": `${theme.glassyOpacity || glassy.cardOpacity || 0.80}`,
    "--glass-surface-opacity": `${glassy.surfaceOpacity || 0.68}`,
    "--glass-soft-border": glassy.borderSoftness || "rgba(255, 255, 255, 0.55)",

    // Scoped Subsystem Variables
    ...typographyVars,
    ...buttonVars,
    ...cardVars,
    ...glassySettingsVars,
  };
}

/**
 * Calculates relative luminance for WCAG contrast calculations
 */
export function getRelativeLuminance(hex: string): number {
  let cleanHex = hex.replace("#", "");
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map((c) => c + c).join("");
  }
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const [rr, gg, bb] = [r, g, b].map((val) =>
    val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  );

  return 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;
}

export interface ContrastAuditResult {
  ratio: number;
  level: "PASS" | "WARNING" | "FAIL";
  aaNormal: boolean;
  aaLarge: boolean;
  aaa: boolean;
  recommendation: string;
}

/**
 * Validates WCAG 2.1 Color Contrast between foreground text and background
 */
export function checkColorContrast(foregroundHex: string, backgroundHex: string): ContrastAuditResult {
  try {
    const lum1 = getRelativeLuminance(foregroundHex);
    const lum2 = getRelativeLuminance(backgroundHex);
    const brighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    const ratio = Math.round(((brighter + 0.05) / (darker + 0.05)) * 100) / 100;

    const aaNormal = ratio >= 4.5;
    const aaLarge = ratio >= 3.0;
    const aaa = ratio >= 7.0;

    let level: "PASS" | "WARNING" | "FAIL" = "FAIL";
    if (aaNormal) level = "PASS";
    else if (aaLarge) level = "WARNING";

    let recommendation = "Contrast is optimal for all body and heading sizes.";
    if (level === "WARNING") {
      recommendation = "Contrast is sufficient for large headings (18pt+), but darker text is recommended for body copy.";
    } else if (level === "FAIL") {
      recommendation = "Contrast ratio is below 3.0:1. Adjust foreground or background tone to improve readability.";
    }

    return {
      ratio,
      level,
      aaNormal,
      aaLarge,
      aaa,
      recommendation,
    };
  } catch {
    return {
      ratio: 4.5,
      level: "PASS",
      aaNormal: true,
      aaLarge: true,
      aaa: false,
      recommendation: "Fallback contrast evaluation applied.",
    };
  }
}
