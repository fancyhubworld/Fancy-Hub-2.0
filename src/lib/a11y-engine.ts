export interface ContrastResult {
  ratio: number;
  ratioFormatted: string;
  isNormalTextAA: boolean; // >= 4.5:1
  isLargeTextAA: boolean;  // >= 3.0:1
  isNormalTextAAA: boolean;// >= 7.0:1
  isLargeTextAAA: boolean; // >= 4.5:1
  warning?: string;
}

/**
 * Converts HEX color to linear RGB channels for relative luminance calculation
 */
function hexToLinearRgb(hex: string): [number, number, number] {
  let cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (cleanHex.length !== 6) return [0, 0, 0];

  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

  return [toLinear(r), toLinear(g), toLinear(b)];
}

/**
 * Calculates WCAG 2.1 relative luminance
 */
export function getRelativeLuminance(hex: string): number {
  const [r, g, b] = hexToLinearRgb(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculates WCAG 2.1 contrast ratio between two hex colors
 */
export function calculateContrastRatio(fgHex: string, bgHex: string): ContrastResult {
  const lum1 = getRelativeLuminance(fgHex);
  const lum2 = getRelativeLuminance(bgHex);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  const roundedRatio = Math.round(ratio * 100) / 100;

  const isNormalTextAA = ratio >= 4.5;
  const isLargeTextAA = ratio >= 3.0;
  const isNormalTextAAA = ratio >= 7.0;
  const isLargeTextAAA = ratio >= 4.5;

  let warning: string | undefined;
  if (!isLargeTextAA) {
    warning = `Critical Contrast Alert: Ratio ${roundedRatio}:1 fails WCAG AA standards. Text may be unreadable for customers with visual impairments.`;
  } else if (!isNormalTextAA) {
    warning = `Moderate Contrast Alert: Ratio ${roundedRatio}:1 is acceptable for large headings (>=18pt) but fails for standard body text.`;
  }

  return {
    ratio: roundedRatio,
    ratioFormatted: `${roundedRatio}:1`,
    isNormalTextAA,
    isLargeTextAA,
    isNormalTextAAA,
    isLargeTextAAA,
    warning,
  };
}

/**
 * Validates whole theme color palette for accessibility issues
 */
export function auditThemeAccessibility(theme: {
  textColor?: string;
  backgroundColor?: string;
  primaryColor?: string;
  cardColor?: string;
}): { score: number; issues: string[]; contrastChecks: Record<string, ContrastResult> } {
  const text = theme.textColor || "#0F172A";
  const bg = theme.backgroundColor || "#FFFFFF";
  const primary = theme.primaryColor || "#1455D9";
  const card = theme.cardColor || "#FFFFFF";

  const issues: string[] = [];
  const textOnBg = calculateContrastRatio(text, bg);
  const textOnCard = calculateContrastRatio(text, card);
  const whiteOnPrimary = calculateContrastRatio("#FFFFFF", primary);

  if (!textOnBg.isNormalTextAA) {
    issues.push(`Text on Background contrast (${textOnBg.ratioFormatted}) is below WCAG AA (4.5:1).`);
  }
  if (!textOnCard.isNormalTextAA) {
    issues.push(`Text on Card background contrast (${textOnCard.ratioFormatted}) is below WCAG AA (4.5:1).`);
  }
  if (!whiteOnPrimary.isLargeTextAA) {
    issues.push(`White button text on Primary Color (${whiteOnPrimary.ratioFormatted}) is hard to read.`);
  }

  const score = Math.max(0, 100 - issues.length * 25);

  return {
    score,
    issues,
    contrastChecks: {
      "Text on Background": textOnBg,
      "Text on Card": textOnCard,
      "White on Primary Button": whiteOnPrimary,
    },
  };
}
