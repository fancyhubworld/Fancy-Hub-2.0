export type CardPresetType = "classic" | "minimal" | "soft" | "glass" | "premium";
export type CardShadowType = "none" | "sm" | "md" | "lg" | "xl" | "floating" | "glow" | "premium";
export type CardHoverAnimationType = "none" | "lift" | "scale" | "glow" | "border-glow";

export interface CardConfig {
  activePreset: CardPresetType;
  borderRadius: string;       // e.g. "1rem" (16px)
  borderWidth: string;        // e.g. "1px", "2px", "0px"
  borderColor: string;        // e.g. "#E2E8F0" or "rgba(255, 255, 255, 0.3)"
  borderStyle: "solid" | "dashed" | "none";
  shadow: CardShadowType;
  backgroundColor: string;    // e.g. "#FFFFFF" or "rgba(255, 255, 255, 0.7)"
  backdropBlur: number;       // e.g. 16 (in px)
  hoverAnimation: CardHoverAnimationType;
  hoverLiftY: string;         // e.g. "-4px", "-8px"
  hoverScale: number;         // e.g. 1.02
  hoverShadow: CardShadowType;
  imageRadius: string;        // e.g. "0.75rem" (12px)
  padding: string;            // e.g. "1rem" (16px)
}

export const CARD_PRESETS: Record<CardPresetType, CardConfig> = {
  classic: {
    activePreset: "classic",
    borderRadius: "1rem",
    borderWidth: "1px",
    borderColor: "#E2E8F0",
    borderStyle: "solid",
    shadow: "md",
    backgroundColor: "#FFFFFF",
    backdropBlur: 0,
    hoverAnimation: "lift",
    hoverLiftY: "-4px",
    hoverScale: 1.01,
    hoverShadow: "lg",
    imageRadius: "0.75rem",
    padding: "1rem",
  },
  minimal: {
    activePreset: "minimal",
    borderRadius: "0.5rem",
    borderWidth: "1px",
    borderColor: "#E2E8F0",
    borderStyle: "solid",
    shadow: "none",
    backgroundColor: "#FFFFFF",
    backdropBlur: 0,
    hoverAnimation: "border-glow",
    hoverLiftY: "0px",
    hoverScale: 1.0,
    hoverShadow: "sm",
    imageRadius: "0.375rem",
    padding: "0.875rem",
  },
  soft: {
    activePreset: "soft",
    borderRadius: "1.5rem",
    borderWidth: "0px",
    borderColor: "transparent",
    borderStyle: "none",
    shadow: "floating",
    backgroundColor: "#FFFFFF",
    backdropBlur: 0,
    hoverAnimation: "scale",
    hoverLiftY: "-2px",
    hoverScale: 1.02,
    hoverShadow: "xl",
    imageRadius: "1.25rem",
    padding: "1.25rem",
  },
  glass: {
    activePreset: "glass",
    borderRadius: "1.25rem",
    borderWidth: "1px",
    borderColor: "rgba(255, 255, 255, 0.4)",
    borderStyle: "solid",
    shadow: "glow",
    backgroundColor: "rgba(255, 255, 255, 0.55)",
    backdropBlur: 20,
    hoverAnimation: "lift",
    hoverLiftY: "-6px",
    hoverScale: 1.02,
    hoverShadow: "glow",
    imageRadius: "1rem",
    padding: "1.125rem",
  },
  premium: {
    activePreset: "premium",
    borderRadius: "1.25rem",
    borderWidth: "1px",
    borderColor: "rgba(247, 148, 29, 0.3)", // Festive Saffron Gold outline
    borderStyle: "solid",
    shadow: "premium",
    backgroundColor: "#FFFFFF",
    backdropBlur: 12,
    hoverAnimation: "lift",
    hoverLiftY: "-8px",
    hoverScale: 1.02,
    hoverShadow: "premium",
    imageRadius: "0.875rem",
    padding: "1.25rem",
  },
};

export const DEFAULT_CARD_CONFIG: CardConfig = CARD_PRESETS.classic;

/**
 * Generate CSS custom properties for the Card Design System
 */
export function getCardCssVariables(config: CardConfig): Record<string, string> {
  const shadowMap: Record<CardShadowType, string> = {
    none: "none",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    floating: "0 14px 28px rgba(0,0,0,0.08), 0 10px 10px rgba(0,0,0,0.04)",
    glow: "0 0 20px rgba(20, 85, 217, 0.15), 0 8px 16px rgba(0, 0, 0, 0.06)",
    premium: "0 20px 30px -10px rgba(247, 148, 29, 0.2), 0 10px 20px -5px rgba(0,0,0,0.08)",
  };

  let hoverTransform = "none";
  if (config.hoverAnimation === "lift") {
    hoverTransform = `translateY(${config.hoverLiftY || "-4px"})`;
  } else if (config.hoverAnimation === "scale") {
    hoverTransform = `scale(${config.hoverScale || 1.02})`;
  }

  return {
    "--card-radius": config.borderRadius,
    "--card-border-width": config.borderWidth,
    "--card-border-color": config.borderColor,
    "--card-border-style": config.borderStyle,
    "--card-shadow": shadowMap[config.shadow] || shadowMap.md,
    "--card-bg-custom": config.backgroundColor,
    "--card-backdrop-blur": `${config.backdropBlur}px`,
    "--card-hover-transform": hoverTransform,
    "--card-hover-shadow": shadowMap[config.hoverShadow] || shadowMap.lg,
    "--card-img-radius": config.imageRadius,
    "--card-padding": config.padding,
  };
}
