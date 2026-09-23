export type ExperimentStatus = "DRAFT" | "RUNNING" | "PAUSED" | "CONCLUDED";
export type ExperimentTargetType = "HOMEPAGE" | "BANNER" | "PRODUCT_LAYOUT" | "THEME";

export interface ExperimentVariant {
  id: "A" | "B";
  title: string;
  weight: number; // e.g. 50% vs 50%
  configJson: string;
  views: number;
  clicks: number;
  conversions: number;
}

export interface ABExperiment {
  id: string;
  key: string;
  name: string;
  targetType: ExperimentTargetType;
  status: ExperimentStatus;
  variantA: ExperimentVariant;
  variantB: ExperimentVariant;
  winningVariant?: "A" | "B";
  startDate?: string | Date;
  endDate?: string | Date;
}

export const DEFAULT_HOMEPAGE_EXPERIMENT: ABExperiment = {
  id: "exp-homepage-festive-2026",
  key: "homepage_festive_hero_split",
  name: "Diwali Hero Banner: Weaver Story vs 70% Discount",
  targetType: "HOMEPAGE",
  status: "RUNNING",
  variantA: {
    id: "A",
    title: "Artisan Weaver Spotlight (Heritage Focus)",
    weight: 50,
    configJson: JSON.stringify({ heroType: "ARTISAN_STORY", cta: "Explore Authentic Weaves" }),
    views: 1240,
    clicks: 340,
    conversions: 88,
  },
  variantB: {
    id: "B",
    title: "Mega Discount Flash Strip (70% OFF)",
    weight: 50,
    configJson: JSON.stringify({ heroType: "FLASH_DEAL", cta: "Claim 70% OFF Today" }),
    views: 1260,
    clicks: 410,
    conversions: 104,
  },
  startDate: new Date().toISOString(),
};

/**
 * Deterministic or random variant assigner based on user seed or cookie
 */
export function assignExperimentVariant(experiment: ABExperiment, userIdOrSeed?: string): "A" | "B" {
  if (experiment.status !== "RUNNING") return "A";
  if (!userIdOrSeed) {
    return Math.random() * 100 < experiment.variantA.weight ? "A" : "B";
  }

  // Simple hash for consistent user stickiness
  let hash = 0;
  for (let i = 0; i < userIdOrSeed.length; i++) {
    hash = (hash << 5) - hash + userIdOrSeed.charCodeAt(i);
    hash |= 0;
  }
  const normalized = Math.abs(hash) % 100;
  return normalized < experiment.variantA.weight ? "A" : "B";
}

/**
 * Metric conversion rate calculation
 */
export function calculateConversionRate(variant: ExperimentVariant): number {
  if (variant.views === 0) return 0;
  return Number(((variant.conversions / variant.views) * 100).toFixed(2));
}
