import { WidgetType } from "./widget-types";

export interface SeoCopyRequest {
  entityType: "PAGE" | "PRODUCT" | "CATEGORY" | "VENDOR";
  title: string;
  category?: string;
  targetKeywords?: string[];
  tone?: "PROFESSIONAL" | "FESTIVE" | "LUXURY" | "URGENT";
}

export interface SeoCopyResult {
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  openGraphTitle: string;
  openGraphDescription: string;
  jsonLdSnippet: Record<string, any>;
}

export interface ProductCopyRequest {
  productTitle: string;
  category: string;
  price: number;
  artisanOrBrand?: string;
  fabricOrMaterial?: string;
  keyFeatures?: string[];
  tone?: "LUXURY_HERITAGE" | "MODERN_TRENDY" | "FESTIVE";
}

export interface ProductCopyResult {
  shortDescription: string;
  detailedDescription: string;
  bulletHighlights: string[];
  artisanStory: string;
  careInstructions: string[];
  suggestedTags: string[];
}

export interface LayoutRecommendationRequest {
  pageGoal: "FESTIVAL_SALE" | "LUXURY_ETHNIC" | "GADGETS_ELECTRONICS" | "VENDOR_MARKETPLACE" | "CUSTOM_PRINT";
  targetAudience?: string;
  primaryCategory?: string;
}

export interface LayoutRecommendationResult {
  title: string;
  description: string;
  recommendedTheme: {
    primaryColor: string;
    secondaryColor: string;
    fontHeading: string;
    fontBody: string;
    glassyBlur: number;
    borderRadius: string;
  };
  recommendedSections: Array<{
    widgetType: WidgetType;
    sectionName: string;
    desktopColumns: number;
    mobileColumns: number;
    settings: Record<string, any>;
  }>;
}

export interface AssistantChatRequest {
  userMessage: string;
  conversationHistory?: Array<{ role: "user" | "assistant"; text: string }>;
  activePincode?: string;
  cartCount?: number;
}

export interface AssistantChatResult {
  reply: string;
  suggestedAction?: "VIEW_DEALS" | "CHECKOUT" | "TRACK_ORDER" | "BROWSE_CATEGORY";
  suggestedCategory?: string;
  suggestedCoupon?: string;
  productRecommendations?: Array<{
    title: string;
    price: number;
    slug: string;
    badge?: string;
  }>;
}

// -------------------------------------------------------------------------
// 1. AUTOMATED SEO COPY GENERATOR
// -------------------------------------------------------------------------

export function generateSeoCopy(req: SeoCopyRequest): SeoCopyResult {
  const { title, category = "Ethnic Wear", targetKeywords = [], tone = "LUXURY" } = req;
  const brandSuffix = "FancyHub.in";

  let seoTitle = `${title} | Buy Authentic ${category} Online | ${brandSuffix}`;
  if (seoTitle.length > 60) {
    seoTitle = `${title} | ${category} | ${brandSuffix}`;
  }

  const toneAdjective =
    tone === "FESTIVE"
      ? "celebrate with exclusive festive offers"
      : tone === "LUXURY"
      ? "handcrafted by certified master artisans with pure Silk Mark authenticity"
      : tone === "URGENT"
      ? "limited stock available with instant doorstep delivery"
      : "best prices guaranteed";

  const metaDescription = `Explore authentic ${title} on FancyHub.in. ${toneAdjective}. Enjoy verified seller guarantee, fast pan-India shipping & easy returns.`.substring(
    0,
    155
  );

  const keywords = Array.from(
    new Set([
      title.toLowerCase(),
      category.toLowerCase(),
      "fancyhub",
      "buy online india",
      "handloom",
      ...targetKeywords.map((k) => k.toLowerCase()),
    ])
  );

  return {
    seoTitle,
    metaDescription,
    keywords,
    openGraphTitle: `${title} — Handcrafted Perfection | FancyHub.in`,
    openGraphDescription: metaDescription,
    jsonLdSnippet: {
      "@context": "https://schema.org",
      "@type": "Product",
      name: title,
      description: metaDescription,
      brand: { "@type": "Brand", name: "FancyHub Verified" },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
      },
    },
  };
}

// -------------------------------------------------------------------------
// 2. PRODUCT COPY & ARTISAN STORY GENERATOR
// -------------------------------------------------------------------------

export function generateProductDescription(req: ProductCopyRequest): ProductCopyResult {
  const {
    productTitle,
    category,
    price,
    artisanOrBrand = "Master Weavers Guild",
    fabricOrMaterial = "Pure Mulberry Silk",
    keyFeatures = [],
  } = req;

  const shortDescription = `Elevate your wardrobe with the exquisite ${productTitle}, meticulously handcrafted from premium ${fabricOrMaterial} by ${artisanOrBrand}.`;

  const detailedDescription = `Experience timeless elegance with the ${productTitle}. Crafted with obsessive attention to detail, this authentic ${category} piece combines heritage weaving techniques with contemporary luxury. Featuring certified ${fabricOrMaterial} and lustrous zari detailing, it represents the pinnacle of Indian artisan craftsmanship.`;

  const bulletHighlights = [
    `100% Certified ${fabricOrMaterial} with authentic Silk Mark guarantee`,
    `Handwoven by ${artisanOrBrand} using heritage pit-loom techniques`,
    `Includes matching unstitched blouse piece (0.8m)`,
    `Rich contrast pallu with intricate antique gold zari borders`,
    `Comfortable all-day drape suited for weddings & festive occasions`,
    ...keyFeatures,
  ];

  const artisanStory = `This exquisite creation was hand-crafted by ${artisanOrBrand}, carrying forward over three generations of specialized weaving knowledge. Each piece requires over 45 hours of meticulous artisan labor on traditional handlooms.`;

  const careInstructions = [
    "Dry clean only recommended to preserve zari luster and silk fibers",
    "Store in breathable pure cotton saree bags; avoid direct plastic contact",
    "Iron on lowest silk setting with a protective cloth layer",
  ];

  return {
    shortDescription,
    detailedDescription,
    bulletHighlights,
    artisanStory,
    careInstructions,
    suggestedTags: [
      category.toLowerCase(),
      fabricOrMaterial.toLowerCase().replace(" ", "-"),
      "wedding-collection",
      "artisan-handloom",
      "festive-wear",
    ],
  };
}

// -------------------------------------------------------------------------
// 3. VISUAL LAYOUT AI RECOMMENDER
// -------------------------------------------------------------------------

export function recommendVisualLayout(req: LayoutRecommendationRequest): LayoutRecommendationResult {
  const { pageGoal, primaryCategory = "Sarees" } = req;

  switch (pageGoal) {
    case "FESTIVAL_SALE":
      return {
        title: "Diwali & Festive Mega Sale Layout",
        description: "High-urgency, countdown-driven layout optimized for maximum festive conversion.",
        recommendedTheme: {
          primaryColor: "#D97706", // Festive Gold / Amber
          secondaryColor: "#991B1B", // Royal Crimson
          fontHeading: "Playfair Display, serif",
          fontBody: "Plus Jakarta Sans, sans-serif",
          glassyBlur: 16,
          borderRadius: "16px",
        },
        recommendedSections: [
          {
            widgetType: "ANNOUNCEMENT_BAR",
            sectionName: "Festive Urgency Ticker",
            desktopColumns: 1,
            mobileColumns: 1,
            settings: { text: "⚡ DIWALI DHAMAKA: Flat 40% OFF + Extra ₹300 with code FANCYFEST" },
          },
          {
            widgetType: "HERO_BANNER",
            sectionName: "Grand Festive Hero Banner",
            desktopColumns: 1,
            mobileColumns: 1,
            settings: { title: "Diwali Grand Festive Collection", autoplay: true, interval: 4000 },
          },
          {
            widgetType: "FLASH_DEALS",
            sectionName: "Lightning Deals Countdown",
            desktopColumns: 4,
            mobileColumns: 2,
            settings: { discountText: "FLAT 50% OFF", durationHours: 12 },
          },
          {
            widgetType: "CATEGORY_GRID",
            sectionName: "Festive Categories Showcase",
            desktopColumns: 6,
            mobileColumns: 3,
            settings: { style: "ROUNDED_CIRCLE" },
          },
          {
            widgetType: "PRODUCT_GRID",
            sectionName: "Trending Sarees & Kurtas",
            desktopColumns: 4,
            mobileColumns: 2,
            settings: { category: primaryCategory, limit: 8 },
          },
          {
            widgetType: "TRUST_BADGES",
            sectionName: "Authenticity & Fast Delivery Badges",
            desktopColumns: 4,
            mobileColumns: 2,
            settings: { showPincodeDelivery: true, silkMarkCertified: true },
          },
        ],
      };

    case "LUXURY_ETHNIC":
    default:
      return {
        title: "Royal Heritage & Luxury Handloom Studio",
        description: "Editorial-style luxury layout showcasing master weavers and high-ticket authentic silks.",
        recommendedTheme: {
          primaryColor: "#8B5CF6", // Royal Purple
          secondaryColor: "#D97706", // Heritage Zari Gold
          fontHeading: "Playfair Display, serif",
          fontBody: "Plus Jakarta Sans, sans-serif",
          glassyBlur: 20,
          borderRadius: "24px",
        },
        recommendedSections: [
          {
            widgetType: "HERO_BANNER",
            sectionName: "Heritage Silk Showcase Hero",
            desktopColumns: 1,
            mobileColumns: 1,
            settings: { title: "Pure Handloom Silks From Varanasi & Kanchipuram" },
          },
          {
            widgetType: "VENDOR_GRID",
            sectionName: "Featured Master Artisan Guilds",
            desktopColumns: 3,
            mobileColumns: 1,
            settings: { filter: "CERTIFIED_ARTISANS", limit: 3 },
          },
          {
            widgetType: "PRODUCT_GRID",
            sectionName: "Silk Mark Certified Collection",
            desktopColumns: 4,
            mobileColumns: 2,
            settings: { category: "Banarasi & Kanchipuram", limit: 8 },
          },
          {
            widgetType: "TESTIMONIALS",
            sectionName: "Verified Buyer Luxury Reviews",
            desktopColumns: 3,
            mobileColumns: 1,
            settings: { autoScroll: true },
          },
          {
            widgetType: "TRUST_BADGES",
            sectionName: "FancyHub Artisan Guarantee",
            desktopColumns: 4,
            mobileColumns: 2,
            settings: { directArtisanSourced: true },
          },
        ],
      };
  }
}

// -------------------------------------------------------------------------
// 4. CONVERSATIONAL STOREFRONT AI ASSISTANT
// -------------------------------------------------------------------------

export function chatWithShoppingAssistant(req: AssistantChatRequest): AssistantChatResult {
  const query = req.userMessage.toLowerCase();

  // 1. Saree & Ethnic recommendations
  if (query.includes("saree") || query.includes("silk") || query.includes("banarasi") || query.includes("kanchipuram")) {
    return {
      reply:
        "Looking for authentic sarees? Our top picks are the **Crimson Banarasi Pure Silk Saree (₹4,999)** and the **Royal Gold Zari Kanchipuram Silk (₹8,499)**. Both are 100% Silk Mark certified and sourced directly from certified weaver clusters in Varanasi and Surat.",
      suggestedAction: "BROWSE_CATEGORY",
      suggestedCategory: "sarees",
      suggestedCoupon: "FANCYFIRST",
      productRecommendations: [
        {
          title: "Crimson Banarasi Pure Silk Saree",
          price: 4999,
          slug: "crimson-banarasi-pure-silk-saree",
          badge: "Best Seller",
        },
        {
          title: "Royal Gold Zari Kanchipuram Saree",
          price: 8499,
          slug: "royal-gold-zari-kanchipuram-saree",
          badge: "Silk Mark Certified",
        },
      ],
    };
  }

  // 2. Audio & Electronics
  if (query.includes("earbuds") || query.includes("headphones") || query.includes("electronics") || query.includes("gadget")) {
    return {
      reply:
        "Check out our bestselling **FancyHub ANC Studio Pro Wireless Earbuds (₹2,499)** featuring 48-hour playtime, Active Noise Cancellation, and ultra-fast 10-minute Type-C warp charge.",
      suggestedAction: "VIEW_DEALS",
      suggestedCategory: "electronics",
      productRecommendations: [
        {
          title: "FancyHub ANC Studio Pro Wireless Earbuds",
          price: 2499,
          slug: "fancyhub-anc-pro-earbuds",
          badge: "Trending",
        },
      ],
    };
  }

  // 3. Pincode & Delivery Inquiry
  if (query.includes("delivery") || query.includes("shipping") || query.includes("pincode") || /\b\d{6}\b/.test(query)) {
    const pinMatch = query.match(/\b\d{6}\b/);
    const pin = pinMatch ? pinMatch[0] : req.activePincode || "700023";
    return {
      reply: `Great news! Pincode **${pin}** is fully serviceable via Delhivery Express & Bluedart with **Fast 24–48 Hour Doorstep Delivery** and Cash on Delivery (COD) availability.`,
      suggestedAction: "CHECKOUT",
    };
  }

  // 4. Coupons & Discounts
  if (query.includes("coupon") || query.includes("discount") || query.includes("offer") || query.includes("promo")) {
    return {
      reply:
        "You can apply code **`FANCYFIRST`** at checkout to receive **Flat ₹300 OFF** on your first order above ₹1,499! Plus, all prepaid UPI orders get an extra 5% instant cashback.",
      suggestedAction: "CHECKOUT",
      suggestedCoupon: "FANCYFIRST",
    };
  }

  // 5. Default Friendly Fallback
  return {
    reply:
      "Namaste! I'm your FancyHub AI Shopping Assistant. How can I help you today? I can recommend authentic sarees, verify pincode delivery times, compare gadgets, or find the best coupon code for your cart!",
    suggestedAction: "VIEW_DEALS",
  };
}
