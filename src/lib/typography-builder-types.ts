export type TypographyRoleKey =
  | "H1"
  | "H2"
  | "H3"
  | "H4"
  | "Body"
  | "Small"
  | "Caption"
  | "Button"
  | "Navigation";

export interface TypographyRoleConfig {
  key: TypographyRoleKey;
  label: string;
  description: string;
  fontSize: string;       // e.g. "2.25rem" or "36px"
  fontWeight: string;     // e.g. "800", "700", "600", "500", "400"
  lineHeight: string;     // e.g. "1.2", "1.3", "1.5"
  letterSpacing: string;  // e.g. "-0.02em", "0em", "0.05em"
  fontType: "heading" | "body";
}

export interface TypographyConfig {
  headingFontFamily: string;
  bodyFontFamily: string;
  baseFontSize: number;
  roles: Record<TypographyRoleKey, TypographyRoleConfig>;
}

export const DEFAULT_TYPOGRAPHY_CONFIG: TypographyConfig = {
  headingFontFamily: "Plus Jakarta Sans",
  bodyFontFamily: "Inter",
  baseFontSize: 16,
  roles: {
    H1: {
      key: "H1",
      label: "Heading 1 (H1)",
      description: "Hero titles, page main banners & primary department headers",
      fontSize: "2.25rem",
      fontWeight: "800",
      lineHeight: "1.2",
      letterSpacing: "-0.025em",
      fontType: "heading",
    },
    H2: {
      key: "H2",
      label: "Heading 2 (H2)",
      description: "Section headings, campaign titles & category headers",
      fontSize: "1.75rem",
      fontWeight: "700",
      lineHeight: "1.25",
      letterSpacing: "-0.02em",
      fontType: "heading",
    },
    H3: {
      key: "H3",
      label: "Heading 3 (H3)",
      description: "Card headings, modal headers & product detail titles",
      fontSize: "1.25rem",
      fontWeight: "700",
      lineHeight: "1.3",
      letterSpacing: "-0.015em",
      fontType: "heading",
    },
    H4: {
      key: "H4",
      label: "Heading 4 (H4)",
      description: "Widget titles, filter group labels & footer column titles",
      fontSize: "1rem",
      fontWeight: "600",
      lineHeight: "1.4",
      letterSpacing: "-0.01em",
      fontType: "heading",
    },
    Body: {
      key: "Body",
      label: "Body Text",
      description: "Standard descriptive copy, reviews & long-form editorial content",
      fontSize: "0.875rem",
      fontWeight: "400",
      lineHeight: "1.5",
      letterSpacing: "0em",
      fontType: "body",
    },
    Small: {
      key: "Small",
      label: "Small Text",
      description: "Delivery estimates, vendor names, tag labels & product metadata",
      fontSize: "0.75rem",
      fontWeight: "500",
      lineHeight: "1.4",
      letterSpacing: "0.01em",
      fontType: "body",
    },
    Caption: {
      key: "Caption",
      label: "Caption & Legal",
      description: "Timestamps, GSTIN / CIN legal notices & copyright microcopy",
      fontSize: "0.6875rem",
      fontWeight: "500",
      lineHeight: "1.3",
      letterSpacing: "0.02em",
      fontType: "body",
    },
    Button: {
      key: "Button",
      label: "Button CTA",
      description: "Primary action buttons (Add to Cart, Buy Now, Subscribe, Filter)",
      fontSize: "0.8125rem",
      fontWeight: "700",
      lineHeight: "1.1",
      letterSpacing: "0.025em",
      fontType: "body",
    },
    Navigation: {
      key: "Navigation",
      label: "Navigation Links",
      description: "Header navigation bar, category strip & mobile drawer items",
      fontSize: "0.75rem",
      fontWeight: "600",
      lineHeight: "1.2",
      letterSpacing: "0.01em",
      fontType: "body",
    },
  },
};

/**
 * Generate CSS variables for all 9 typography roles
 */
export function getTypographyCssVariables(config: TypographyConfig): Record<string, string> {
  return {
    "--font-heading": config.headingFontFamily || "Plus Jakarta Sans",
    "--font-body": config.bodyFontFamily || "Inter",

    // H1
    "--h1-font-size": config.roles.H1.fontSize,
    "--h1-font-weight": config.roles.H1.fontWeight,
    "--h1-line-height": config.roles.H1.lineHeight,
    "--h1-letter-spacing": config.roles.H1.letterSpacing,

    // H2
    "--h2-font-size": config.roles.H2.fontSize,
    "--h2-font-weight": config.roles.H2.fontWeight,
    "--h2-line-height": config.roles.H2.lineHeight,
    "--h2-letter-spacing": config.roles.H2.letterSpacing,

    // H3
    "--h3-font-size": config.roles.H3.fontSize,
    "--h3-font-weight": config.roles.H3.fontWeight,
    "--h3-line-height": config.roles.H3.lineHeight,
    "--h3-letter-spacing": config.roles.H3.letterSpacing,

    // H4
    "--h4-font-size": config.roles.H4.fontSize,
    "--h4-font-weight": config.roles.H4.fontWeight,
    "--h4-line-height": config.roles.H4.lineHeight,
    "--h4-letter-spacing": config.roles.H4.letterSpacing,

    // Body
    "--body-font-size": config.roles.Body.fontSize,
    "--body-font-weight": config.roles.Body.fontWeight,
    "--body-line-height": config.roles.Body.lineHeight,
    "--body-letter-spacing": config.roles.Body.letterSpacing,

    // Small
    "--small-font-size": config.roles.Small.fontSize,
    "--small-font-weight": config.roles.Small.fontWeight,
    "--small-line-height": config.roles.Small.lineHeight,
    "--small-letter-spacing": config.roles.Small.letterSpacing,

    // Caption
    "--caption-font-size": config.roles.Caption.fontSize,
    "--caption-font-weight": config.roles.Caption.fontWeight,
    "--caption-line-height": config.roles.Caption.lineHeight,
    "--caption-letter-spacing": config.roles.Caption.letterSpacing,

    // Button
    "--button-font-size": config.roles.Button.fontSize,
    "--button-font-weight": config.roles.Button.fontWeight,
    "--button-line-height": config.roles.Button.lineHeight,
    "--button-letter-spacing": config.roles.Button.letterSpacing,

    // Navigation
    "--nav-font-size": config.roles.Navigation.fontSize,
    "--nav-font-weight": config.roles.Navigation.fontWeight,
    "--nav-line-height": config.roles.Navigation.lineHeight,
    "--nav-letter-spacing": config.roles.Navigation.letterSpacing,
  };
}
