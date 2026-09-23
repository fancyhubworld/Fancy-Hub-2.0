// ====================================================
// SECTION 64: ADMIN GLOBAL BRAND CONTROL (BRAND LOCK)
// ====================================================
export interface BrandLockSettings {
  lockLogo: boolean;
  lockPrimaryColor: boolean;
  lockFont: boolean;
  lockFooter: boolean;
  lockLegalLinks: boolean;
  lockPaymentBranding: boolean;
  lockedPrimaryColor: string;
  lockedFontFamily: string;
  lockedLogoUrl: string;
  allowedVendorAccentColors: string[];
  allowedVendorWidgets: string[];
}

export const DEFAULT_BRAND_LOCK_SETTINGS: BrandLockSettings = {
  lockLogo: true,
  lockPrimaryColor: true,
  lockFont: true,
  lockFooter: true,
  lockLegalLinks: true,
  lockPaymentBranding: true,
  lockedPrimaryColor: "#1455D9",
  lockedFontFamily: "Inter",
  lockedLogoUrl: "/images/logo.png",
  allowedVendorAccentColors: [
    "#F7941D", // Festive Orange
    "#059669", // Handloom Emerald
    "#8B5CF6", // Royal Violet
    "#EA580C", // Saffron
    "#0284C7", // Cyan Ocean
    "#DC2626", // Ruby Red
  ],
  allowedVendorWidgets: [
    "VENDOR_HERO_BANNER",
    "VENDOR_FEATURED_PRODUCTS",
    "VENDOR_STORY_BIO",
    "VENDOR_CATEGORIES_GRID",
    "VENDOR_TRUST_BADGES",
    "VENDOR_REVIEWS_STRIP",
  ],
};

// ====================================================
// SECTION 63: VENDOR STOREFRONT DESIGN
// ====================================================
export type VendorStoreLayoutStyle = "GRID" | "BANNER_FOCUS" | "ARTISAN_SHOWCASE" | "MINIMAL";

export interface VendorStorefrontDesign {
  vendorId: string;
  storeName: string;
  tagline?: string;
  logoUrl?: string;
  bannerUrl?: string;
  storyBio?: string;
  accentColor: string;
  layoutStyle: VendorStoreLayoutStyle;
  featuredCategoryIds?: string[];
  showArtisanStory: boolean;
  showReviews: boolean;
  customLinks?: Array<{ label: string; url: string }>;
}

export const DEFAULT_VENDOR_DESIGN: VendorStorefrontDesign = {
  vendorId: "vendor-surat-silk",
  storeName: "Surat Silk Mills",
  tagline: "Authentic Handcrafted Sarees & Zari Weaves Since 1988",
  logoUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&q=80",
  bannerUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=80",
  storyBio: "We are third-generation master weavers from Surat, preserving traditional pit-loom Jacquard techniques.",
  accentColor: "#F7941D",
  layoutStyle: "ARTISAN_SHOWCASE",
  showArtisanStory: true,
  showReviews: true,
};

/**
 * Enforce brand lockdown rules preventing vendors from overriding critical global brand tokens
 */
export function enforceBrandRules(
  requestedDesign: Partial<VendorStorefrontDesign>,
  brandLock: BrandLockSettings = DEFAULT_BRAND_LOCK_SETTINGS
): { sanitized: VendorStorefrontDesign; violatedRules: string[] } {
  const violatedRules: string[] = [];
  const sanitized: VendorStorefrontDesign = {
    ...DEFAULT_VENDOR_DESIGN,
    ...requestedDesign,
  };

  // 1. Accent color check against allowed palette
  if (requestedDesign.accentColor) {
    const isAllowed = brandLock.allowedVendorAccentColors.includes(requestedDesign.accentColor);
    if (!isAllowed) {
      violatedRules.push(`Accent color '${requestedDesign.accentColor}' is outside the admin approved palette.`);
      sanitized.accentColor = brandLock.allowedVendorAccentColors[0];
    }
  }

  // 2. If Primary color is locked globally, vendor cannot alter global root tokens
  if (brandLock.lockPrimaryColor && (requestedDesign as any).primaryColor) {
    violatedRules.push("Primary brand color is locked globally by Super Admin.");
    delete (sanitized as any).primaryColor;
  }

  // 3. If Font is locked globally
  if (brandLock.lockFont && (requestedDesign as any).fontFamily) {
    violatedRules.push("Font family is locked globally by Super Admin.");
    delete (sanitized as any).fontFamily;
  }

  return { sanitized, violatedRules };
}

// ====================================================
// SECTION 61: CUSTOMER ACCOUNT UI CONFIG
// ====================================================
export interface CustomerAccountUiConfig {
  dashboardStyle: "card_grid" | "sidebar_list" | "minimal_compact";
  cardRadius: string;
  accentBadgeColor: string;
  showWalletCard: boolean;
  showRewardsProgress: boolean;
  showRecentOrdersHero: boolean;
  showDirectSupportButton: boolean;
  headerBackground: string;
}

export const DEFAULT_ACCOUNT_UI_CONFIG: CustomerAccountUiConfig = {
  dashboardStyle: "card_grid",
  cardRadius: "1rem",
  accentBadgeColor: "#1455D9",
  showWalletCard: true,
  showRewardsProgress: true,
  showRecentOrdersHero: true,
  showDirectSupportButton: true,
  headerBackground: "#0B1120",
};

// ====================================================
// SECTION 62: CART / CHECKOUT DESIGNER CONFIG
// ====================================================
export interface CheckoutDesignerConfig {
  cartLayout: "two_column" | "compact" | "full_width";
  couponBoxStyle: "dashed_pill" | "solid_card" | "minimal_inline";
  showFreeShippingProgressBar: boolean;
  freeShippingThresholdINR: number;
  checkoutStepStyle: "single_page" | "multi_step" | "accordion";
  trustBadgesStrip: boolean;
  paymentSummaryElevation: "flat" | "elevated" | "glass";
}

export const DEFAULT_CHECKOUT_DESIGN_CONFIG: CheckoutDesignerConfig = {
  cartLayout: "two_column",
  couponBoxStyle: "dashed_pill",
  showFreeShippingProgressBar: true,
  freeShippingThresholdINR: 999,
  checkoutStepStyle: "accordion",
  trustBadgesStrip: true,
  paymentSummaryElevation: "elevated",
};
