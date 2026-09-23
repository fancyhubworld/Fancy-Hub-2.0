export type ButtonStyleType = "solid" | "outline" | "ghost" | "glass" | "gradient";
export type ButtonShape = "pill" | "rounded" | "square" | "leaf" | "minimal";
export type ButtonShadow = "none" | "sm" | "md" | "lg" | "glow" | "neon";

export interface ButtonConfig {
  defaultStyle: ButtonStyleType;
  shape: ButtonShape;
  borderRadius: string; // e.g. "9999px", "0.75rem", "0.25rem", "0px"
  heightSm: string;     // e.g. "34px"
  heightMd: string;     // e.g. "42px"
  heightLg: string;     // e.g. "50px"
  paddingSm: string;    // e.g. "6px 14px"
  paddingMd: string;    // e.g. "10px 20px"
  paddingLg: string;    // e.g. "14px 28px"
  fontFamily: string;   // e.g. "Inter", "Plus Jakarta Sans"
  fontWeight: string;   // e.g. "700", "600", "500"
  letterSpacing: string;// e.g. "0.025em"
  textTransform: "uppercase" | "none" | "capitalize";
  shadow: ButtonShadow;

  // Interactive States
  hover: {
    scale: number;        // e.g. 1.02
    brightness: number;   // e.g. 1.08
    translateY: string;   // e.g. "-1px"
    enableGlow: boolean;
  };
  active: {
    scale: number;        // e.g. 0.97
    translateY: string;   // e.g. "1px"
  };
  disabled: {
    opacity: number;      // e.g. 0.5
    cursor: string;       // e.g. "not-allowed"
    grayscale: boolean;
  };

  // Specific Style Overrides
  styles: {
    solid: {
      bg: string;
      text: string;
      border: string;
    };
    outline: {
      borderWidth: string; // "2px"
      bgHover: string;
    };
    ghost: {
      bgHover: string;
    };
    glass: {
      blur: string;        // "16px"
      opacity: number;     // 0.6
      border: string;
    };
    gradient: {
      fromColor: string;
      toColor: string;
      direction: string;   // "to right", "135deg"
    };
  };
}

export const DEFAULT_BUTTON_CONFIG: ButtonConfig = {
  defaultStyle: "solid",
  shape: "pill",
  borderRadius: "9999px",
  heightSm: "34px",
  heightMd: "42px",
  heightLg: "50px",
  paddingSm: "6px 14px",
  paddingMd: "10px 22px",
  paddingLg: "14px 28px",
  fontFamily: "Plus Jakarta Sans",
  fontWeight: "700",
  letterSpacing: "0.025em",
  textTransform: "none",
  shadow: "md",
  hover: {
    scale: 1.02,
    brightness: 1.06,
    translateY: "-1px",
    enableGlow: true,
  },
  active: {
    scale: 0.97,
    translateY: "1px",
  },
  disabled: {
    opacity: 0.5,
    cursor: "not-allowed",
    grayscale: true,
  },
  styles: {
    solid: {
      bg: "var(--theme-button, #1455D9)",
      text: "#FFFFFF",
      border: "transparent",
    },
    outline: {
      borderWidth: "2px",
      bgHover: "rgba(20, 85, 217, 0.1)",
    },
    ghost: {
      bgHover: "rgba(20, 85, 217, 0.08)",
    },
    glass: {
      blur: "16px",
      opacity: 0.65,
      border: "rgba(255, 255, 255, 0.25)",
    },
    gradient: {
      fromColor: "#1455D9",
      toColor: "#6366F1",
      direction: "to right",
    },
  },
};

/**
 * Generate CSS variables for Button Design System
 */
export function getButtonCssVariables(config: ButtonConfig): Record<string, string> {
  const shadowMap: Record<ButtonShadow, string> = {
    none: "none",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    glow: "0 0 15px rgba(20, 85, 217, 0.4)",
    neon: "0 0 20px rgba(20, 85, 217, 0.6), 0 0 40px rgba(99, 102, 241, 0.3)",
  };

  return {
    "--btn-radius": config.borderRadius,
    "--btn-font-family": config.fontFamily,
    "--btn-font-weight": config.fontWeight,
    "--btn-letter-spacing": config.letterSpacing,
    "--btn-text-transform": config.textTransform,
    "--btn-shadow": shadowMap[config.shadow] || shadowMap.md,
    "--btn-height-sm": config.heightSm,
    "--btn-height-md": config.heightMd,
    "--btn-height-lg": config.heightLg,
    "--btn-padding-sm": config.paddingSm,
    "--btn-padding-md": config.paddingMd,
    "--btn-padding-lg": config.paddingLg,
    "--btn-hover-scale": `${config.hover.scale}`,
    "--btn-hover-translate": config.hover.translateY,
    "--btn-active-scale": `${config.active.scale}`,
    "--btn-active-translate": config.active.translateY,
    "--btn-disabled-opacity": `${config.disabled.opacity}`,
    "--btn-disabled-cursor": config.disabled.cursor,
  };
}
