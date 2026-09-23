export interface FancyDesignTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    card: string;
    text: string;
    mutedText: string;
    border: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
  };
  typography: {
    fontHeading: string;
    fontBody: string;
    sizes: Record<string, string>;
    weights: Record<string, string>;
    lineHeights: Record<string, string>;
  };
  spacing: Record<string, string>;
  radius: Record<string, string>;
  shadows: Record<string, string>;
  borders: Record<string, string>;
  motion: {
    durations: Record<string, string>;
    easings: Record<string, string>;
  };
  breakpoints: Record<string, string>;
}

export const DEFAULT_DESIGN_TOKENS: FancyDesignTokens = {
  colors: {
    primary: "#1455D9",
    secondary: "#F7941D",
    accent: "#6366F1",
    background: "#F8FAFC",
    surface: "#F1F5F9",
    card: "#FFFFFF",
    text: "#0F172A",
    mutedText: "#64748B",
    border: "#E2E8F0",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#0EA5E9",
  },
  typography: {
    fontHeading: "Plus Jakarta Sans, sans-serif",
    fontBody: "Inter, sans-serif",
    sizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
    },
    weights: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
    },
    lineHeights: {
      tight: "1.15",
      snug: "1.25",
      normal: "1.5",
      relaxed: "1.625",
      loose: "2",
    },
  },
  spacing: {
    "0": "0px",
    "1": "0.25rem",
    "2": "0.5rem",
    "3": "0.75rem",
    "4": "1rem",
    "6": "1.5rem",
    "8": "2rem",
    "12": "3rem",
    "16": "4rem",
    "20": "5rem",
    "24": "6rem",
  },
  radius: {
    none: "0px",
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.5rem",
    "3xl": "2rem",
    full: "9999px",
  },
  shadows: {
    none: "none",
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    glow: "0 0 25px rgba(20, 85, 217, 0.35)",
    glass: "0 8px 32px 0 rgba(0, 0, 0, 0.08)",
  },
  borders: {
    none: "0px solid transparent",
    thin: "1px solid",
    medium: "2px solid",
    thick: "4px solid",
  },
  motion: {
    durations: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
      slower: "700ms",
    },
    easings: {
      default: "cubic-bezier(0.4, 0, 0.2, 1)",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    },
  },
  breakpoints: {
    mobile: "390px",
    tablet: "768px",
    desktop: "1440px",
    wide: "1920px",
  },
};

/**
 * Converts design tokens into CSS Custom Properties dictionary
 */
export function exportTokensToCssVariables(tokens: FancyDesignTokens = DEFAULT_DESIGN_TOKENS): Record<string, string> {
  return {
    "--color-primary": tokens.colors.primary,
    "--color-secondary": tokens.colors.secondary,
    "--color-accent": tokens.colors.accent,
    "--color-bg": tokens.colors.background,
    "--color-surface": tokens.colors.surface,
    "--color-card": tokens.colors.card,
    "--color-text": tokens.colors.text,
    "--color-border": tokens.colors.border,
    "--font-heading": tokens.typography.fontHeading,
    "--font-body": tokens.typography.fontBody,
    "--radius-md": tokens.radius.md,
    "--radius-lg": tokens.radius.lg,
    "--radius-xl": tokens.radius.xl,
    "--shadow-md": tokens.shadows.md,
    "--shadow-lg": tokens.shadows.lg,
    "--shadow-glow": tokens.shadows.glow,
    "--motion-duration-normal": tokens.motion.durations.normal,
    "--motion-ease-spring": tokens.motion.easings.spring,
    "--bp-mobile": tokens.breakpoints.mobile,
    "--bp-tablet": tokens.breakpoints.tablet,
    "--bp-desktop": tokens.breakpoints.desktop,
  };
}
