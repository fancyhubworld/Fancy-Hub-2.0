/**
 * FancyHub.in — Phase 42: Advanced Customer Experience (CX) Engine
 * 
 * Centralized personalization, smart recommendations, recently viewed tracking,
 * size & fit assistant, verified Q&A/reviews, mobile-first checkout accelerators,
 * and user-controlled privacy settings.
 */

import { PRODUCTS_DATA, CATEGORIES_DATA } from "../data/mock-catalog";

// =========================================================================
// 1. TYPES & DATA STRUCTURES
// =========================================================================

export interface CustomerPreferences {
  userId: string;
  preferredSizes: string[];
  favoriteCategorySlugs: string[];
  defaultAddressId?: string;
  enablePersonalization: boolean;
  recentlyViewedProductIds: string[];
  lastActiveCategorySlug?: string;
}

export interface SmartRecommendationResult {
  category: "FREQUENTLY_BOUGHT_TOGETHER" | "SIMILAR_STYLES" | "TRENDING_IN_FAVORITES" | "RECENTLY_VIEWED";
  title: string;
  products: any[];
}

export interface ProductQnARecord {
  id: string;
  productId: string;
  question: string;
  askedBy: string;
  askedAt: string;
  answer?: string;
  answeredBy?: string;
  isVerifiedSellerAnswer: boolean;
  upvotesCount: number;
}

export interface SizeFitGuide {
  category: string;
  sizeChart: Array<{ size: string; chestInches: string; waistInches: string; lengthInches: string }>;
  fitAdvice: string;
  modelDetails: string;
}

// In-Memory Preferences Store
const customerPrefsStore: Map<string, CustomerPreferences> = new Map();
const qnaStore: ProductQnARecord[] = [];

// Initialize Sample Q&A Records
function initSampleQnA() {
  if (qnaStore.length > 0) return;

  qnaStore.push(
    {
      id: "QNA-01",
      productId: "p-1",
      question: "Is the zari on this saree pure metallic gold or blended?",
      askedBy: "Ananya S.",
      askedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      answer: "This saree features authentic woven metallic gold zari with traditional pure silk warp and weft.",
      answeredBy: "Surat Silk Mills (Verified Seller)",
      isVerifiedSellerAnswer: true,
      upvotesCount: 14,
    },
    {
      id: "QNA-02",
      productId: "p-1",
      question: "Does it come with an unstitched blouse piece?",
      askedBy: "Pooja R.",
      askedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      answer: "Yes, an 80cm matching unstitched pure silk blouse fabric is included with the saree.",
      answeredBy: "Surat Silk Mills (Verified Seller)",
      isVerifiedSellerAnswer: true,
      upvotesCount: 22,
    }
  );
}

initSampleQnA();

// =========================================================================
// 2. PERSONALIZATION & SMART RECOMMENDATIONS
// =========================================================================

export class PersonalizationEngine {
  /**
   * Retrieves or initializes customer preferences
   */
  static getCustomerPreferences(userId: string): CustomerPreferences {
    let prefs = customerPrefsStore.get(userId);
    if (!prefs) {
      prefs = {
        userId,
        preferredSizes: ["M", "L"],
        favoriteCategorySlugs: ["fashion", "sarees"],
        enablePersonalization: true,
        recentlyViewedProductIds: ["p-1", "p-2"],
        lastActiveCategorySlug: "fashion",
      };
      customerPrefsStore.set(userId, prefs);
    }
    return prefs;
  }

  /**
   * Records a product view in customer's recently viewed list
   */
  static recordProductView(userId: string, productId: string, categorySlug?: string): void {
    const prefs = this.getCustomerPreferences(userId);
    if (!prefs.enablePersonalization) return; // Privacy respect

    // Keep unique top 10 items
    prefs.recentlyViewedProductIds = [
      productId,
      ...prefs.recentlyViewedProductIds.filter((id) => id !== productId),
    ].slice(0, 10);

    if (categorySlug) {
      prefs.lastActiveCategorySlug = categorySlug;
      if (!prefs.favoriteCategorySlugs.includes(categorySlug)) {
        prefs.favoriteCategorySlugs.push(categorySlug);
      }
    }
  }

  /**
   * Generates dynamic, personalized homepage modules
   */
  static getPersonalizedHomepage(userId?: string): {
    heroBannerPersonalized: { headline: string; ctaUrl: string; bannerImage: string };
    recommendationCarousels: SmartRecommendationResult[];
    activeOrderShortcut?: { orderId: string; status: string; estimatedDelivery: string; trackingUrl: string };
  } {
    const prefs = userId ? this.getCustomerPreferences(userId) : null;
    const isPersonalized = prefs && prefs.enablePersonalization;

    const favoriteCategory = isPersonalized && prefs.favoriteCategorySlugs.length > 0
      ? prefs.favoriteCategorySlugs[0]
      : "trending";

    const heroBannerPersonalized = {
      headline: isPersonalized
        ? `Handpicked Ethnic Collections For You in ${favoriteCategory.toUpperCase()}`
        : "Discover India's Finest Artisan Marketplace",
      ctaUrl: isPersonalized ? `/category/${favoriteCategory}` : "/products",
      bannerImage: "/images/banners/festive-hero.webp",
    };

    // Build recommendation carousels
    const recommendationCarousels: SmartRecommendationResult[] = [
      {
        category: "TRENDING_IN_FAVORITES",
        title: isPersonalized ? `Trending in ${favoriteCategory}` : "Top Trending Collections",
        products: PRODUCTS_DATA.slice(0, 4),
      },
      {
        category: "FREQUENTLY_BOUGHT_TOGETHER",
        title: "Frequently Bought Together",
        products: PRODUCTS_DATA.slice(1, 4),
      },
    ];

    if (isPersonalized && prefs.recentlyViewedProductIds.length > 0) {
      recommendationCarousels.unshift({
        category: "RECENTLY_VIEWED",
        title: "Pick Up Where You Left Off",
        products: PRODUCTS_DATA.filter((p) => prefs.recentlyViewedProductIds.includes(p.id)),
      });
    }

    // Active order shortcut simulation
    const activeOrderShortcut = {
      orderId: "FH-2026-88912",
      status: "OUT_FOR_DELIVERY",
      estimatedDelivery: "Today by 6:00 PM",
      trackingUrl: "/orders/FH-2026-88912",
    };

    return {
      heroBannerPersonalized,
      recommendationCarousels,
      activeOrderShortcut,
    };
  }

  /**
   * Allows customer to update privacy and personalization settings
   */
  static updatePrivacySettings(userId: string, enablePersonalization: boolean, clearHistory = false): CustomerPreferences {
    const prefs = this.getCustomerPreferences(userId);
    prefs.enablePersonalization = enablePersonalization;

    if (clearHistory || !enablePersonalization) {
      prefs.recentlyViewedProductIds = [];
      prefs.favoriteCategorySlugs = [];
      prefs.lastActiveCategorySlug = undefined;
    }

    return prefs;
  }
}

// =========================================================================
// 3. PRODUCT EXPERIENCE & FIT ASSISTANT
// =========================================================================

export class ProductExperienceEngine {
  /**
   * Retrieves structured Size Guide & Fit Advice for category
   */
  static getSizeFitGuide(category: string): SizeFitGuide {
    return {
      category,
      sizeChart: [
        { size: "S", chestInches: "36-38", waistInches: "30-32", lengthInches: "28" },
        { size: "M", chestInches: "39-41", waistInches: "33-35", lengthInches: "29" },
        { size: "L", chestInches: "42-44", waistInches: "36-38", lengthInches: "30" },
        { size: "XL", chestInches: "45-47", waistInches: "39-41", lengthInches: "31" },
        { size: "XXL", chestInches: "48-50", waistInches: "42-44", lengthInches: "32" },
      ],
      fitAdvice: "True to standard Indian sizing. For a relaxed traditional drape, consider sizing up.",
      modelDetails: "Model is 5'11\" (180 cm) with 39\" chest wearing Size M.",
    };
  }

  /**
   * Returns verified Community Q&A for product
   */
  static getProductQnA(productId: string): ProductQnARecord[] {
    return qnaStore.filter((q) => q.productId === productId || productId === "all");
  }

  /**
   * Submits a customer product question
   */
  static askQuestion(productId: string, question: string, customerName: string): ProductQnARecord {
    const newQnA: ProductQnARecord = {
      id: `QNA-${Date.now().toString().slice(-5)}`,
      productId,
      question,
      askedBy: customerName,
      askedAt: new Date().toISOString(),
      isVerifiedSellerAnswer: false,
      upvotesCount: 0,
    };
    qnaStore.push(newQnA);
    return newQnA;
  }
}

// =========================================================================
// 4. MOBILE-FIRST CHECKOUT ACCELERATOR
// =========================================================================

export class MobileCheckoutAccelerator {
  /**
   * Organizes available payment methods with mobile UPI prioritized at top
   */
  static getOptimizedPaymentMethods(): Array<{ id: string; name: string; icon: string; isPopularMobile: boolean; feeINR: number }> {
    return [
      { id: "UPI_GPAY", name: "Google Pay UPI", icon: "upi", isPopularMobile: true, feeINR: 0 },
      { id: "UPI_PHONEPE", name: "PhonePe UPI", icon: "upi", isPopularMobile: true, feeINR: 0 },
      { id: "UPI_PAYTM", name: "Paytm UPI", icon: "upi", isPopularMobile: true, feeINR: 0 },
      { id: "CARDS", name: "Credit / Debit Card", icon: "card", isPopularMobile: false, feeINR: 0 },
      { id: "NET_BANKING", name: "Net Banking (50+ Banks)", icon: "bank", isPopularMobile: false, feeINR: 0 },
      { id: "COD", name: "Cash on Delivery", icon: "cash", isPopularMobile: false, feeINR: 0 },
    ];
  }
}
