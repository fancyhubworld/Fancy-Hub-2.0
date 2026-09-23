/**
 * FancyHub.in — Phase 52: Multi-Region & International Readiness Engine
 * 
 * Centralized multi-region architecture:
 * 1. Jurisdiction configuration (Country, States, Currency, Timezone, Languages, Tax, Shipping)
 * 2. Precise atomic monetary representation (Integer subunits / Zero floating-point rounding)
 * 3. Jurisdiction-aware tax calculations (GST, VAT, Sales Tax)
 * 4. Extensible i18n Localization Engine (English, Hindi, Arabic RTL readiness)
 * 5. Strict 4-Pillar Country Activation Gatekeeper (Legal, Tax, Payment, Logistics)
 */

// =========================================================================
// 1. TYPES & DATA STRUCTURES
// =========================================================================

export type SupportedCountryCode = "IN" | "AE" | "US" | "GB" | "SG";
export type SupportedCurrencyCode = "INR" | "AED" | "USD" | "GBP" | "SGD";
export type SupportedLanguageCode = "en-IN" | "hi-IN" | "ar-AE" | "en-US" | "en-GB";

export type CountryMarketStatus = "ACTIVE" | "READINESS_CONFIGURING" | "INACTIVE";

export interface JurisdictionTaxRule {
  countryCode: SupportedCountryCode;
  taxName: string; // "GST", "VAT", "Sales Tax"
  rateBasisPoints: number; // 500 = 5.00%, 1800 = 18.00%
  isSplitSupported: boolean; // e.g. CGST + SGST split in India
  intraStateSplit?: { cgstBasisPoints: number; sgstBasisPoints: number };
  interStateBasisPoints?: number;
}

export interface RegionMarketConfig {
  countryCode: SupportedCountryCode;
  countryName: string;
  defaultCurrency: SupportedCurrencyCode;
  subunitMultiplier: number; // 100 for Paise/Cents/Fils
  timezone: string;
  defaultLanguage: SupportedLanguageCode;
  supportedLanguages: SupportedLanguageCode[];
  textDirection: "ltr" | "rtl";
  status: CountryMarketStatus;
  // 4-Pillar Activation Checklist
  readinessChecklist: {
    isLegalEntityConfigured: boolean;
    isTaxFrameworkConfigured: boolean;
    isPaymentGatewayConfigured: boolean;
    isLogisticsCarrierConfigured: boolean;
  };
  taxRule: JurisdictionTaxRule;
}

export interface PreciseMoney {
  amountSubunits: number; // Atomic integer (e.g. 249900 paise = ₹2499.00)
  currency: SupportedCurrencyCode;
  formattedString: string; // e.g. "₹2,499.00" or "$29.99"
}

// In-Memory Region & Localization Stores
const regionConfigsStore: Map<SupportedCountryCode, RegionMarketConfig> = new Map();

// Initialize Baseline Regional Markets
function initDefaultRegionConfigs() {
  if (regionConfigsStore.size > 0) return;

  const configs: RegionMarketConfig[] = [
    {
      countryCode: "IN",
      countryName: "India (Domestic Hub)",
      defaultCurrency: "INR",
      subunitMultiplier: 100, // 100 Paise = ₹1
      timezone: "Asia/Kolkata",
      defaultLanguage: "en-IN",
      supportedLanguages: ["en-IN", "hi-IN"],
      textDirection: "ltr",
      status: "ACTIVE", // LIVE PRODUCTION
      readinessChecklist: {
        isLegalEntityConfigured: true,
        isTaxFrameworkConfigured: true,
        isPaymentGatewayConfigured: true,
        isLogisticsCarrierConfigured: true,
      },
      taxRule: {
        countryCode: "IN",
        taxName: "GST",
        rateBasisPoints: 500, // 5% standard on handloom/apparel
        isSplitSupported: true,
        intraStateSplit: { cgstBasisPoints: 250, sgstBasisPoints: 250 },
        interStateBasisPoints: 500,
      },
    },
    {
      countryCode: "AE",
      countryName: "United Arab Emirates",
      defaultCurrency: "AED",
      subunitMultiplier: 100, // 100 Fils = 1 AED
      timezone: "Asia/Dubai",
      defaultLanguage: "en-IN",
      supportedLanguages: ["en-IN", "ar-AE"],
      textDirection: "ltr", // Switches to RTL when Arabic active
      status: "READINESS_CONFIGURING", // Staged / Not active
      readinessChecklist: {
        isLegalEntityConfigured: true,
        isTaxFrameworkConfigured: true,
        isPaymentGatewayConfigured: false, // Pending UAE gateway compliance
        isLogisticsCarrierConfigured: true, // Aramex integrated
      },
      taxRule: {
        countryCode: "AE",
        taxName: "VAT",
        rateBasisPoints: 500, // 5% UAE VAT
        isSplitSupported: false,
      },
    },
    {
      countryCode: "US",
      countryName: "United States",
      defaultCurrency: "USD",
      subunitMultiplier: 100, // 100 Cents = $1
      timezone: "America/New_York",
      defaultLanguage: "en-US",
      supportedLanguages: ["en-US"],
      textDirection: "ltr",
      status: "READINESS_CONFIGURING",
      readinessChecklist: {
        isLegalEntityConfigured: true,
        isTaxFrameworkConfigured: true,
        isPaymentGatewayConfigured: false, // Stripe US in staging
        isLogisticsCarrierConfigured: true, // DHL Express
      },
      taxRule: {
        countryCode: "US",
        taxName: "Sales Tax",
        rateBasisPoints: 650, // 6.5% average
        isSplitSupported: false,
      },
    },
    {
      countryCode: "GB",
      countryName: "United Kingdom",
      defaultCurrency: "GBP",
      subunitMultiplier: 100, // 100 Pence = £1
      timezone: "Europe/London",
      defaultLanguage: "en-GB",
      supportedLanguages: ["en-GB"],
      textDirection: "ltr",
      status: "INACTIVE",
      readinessChecklist: {
        isLegalEntityConfigured: false,
        isTaxFrameworkConfigured: false,
        isPaymentGatewayConfigured: false,
        isLogisticsCarrierConfigured: false,
      },
      taxRule: {
        countryCode: "GB",
        taxName: "VAT",
        rateBasisPoints: 2000, // 20% UK VAT
        isSplitSupported: false,
      },
    },
  ];

  for (const c of configs) {
    regionConfigsStore.set(c.countryCode, c);
  }
}

initDefaultRegionConfigs();

// =========================================================================
// 2. PRECISE MONETARY & TAX ENGINE (Zero Floating-Point)
// =========================================================================

export class PreciseMonetaryEngine {
  /**
   * Creates a precise integer subunit monetary object
   */
  static createMoney(majorUnits: number, currency: SupportedCurrencyCode = "INR"): PreciseMoney {
    const amountSubunits = Math.round(majorUnits * 100);
    return {
      amountSubunits,
      currency,
      formattedString: this.formatCurrency(amountSubunits, currency),
    };
  }

  /**
   * Formats precise integer subunits into localized currency string
   */
  static formatCurrency(subunits: number, currency: SupportedCurrencyCode = "INR"): string {
    const major = (subunits / 100).toFixed(2);
    switch (currency) {
      case "INR":
        return `₹${Number(major).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
      case "USD":
        return `$${Number(major).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
      case "AED":
        return `AED ${Number(major).toLocaleString("en-AE", { minimumFractionDigits: 2 })}`;
      case "GBP":
        return `£${Number(major).toLocaleString("en-GB", { minimumFractionDigits: 2 })}`;
      default:
        return `${currency} ${major}`;
    }
  }

  /**
   * Adds two precise monetary values of the same currency
   */
  static add(a: PreciseMoney, b: PreciseMoney): PreciseMoney {
    if (a.currency !== b.currency) throw new Error("Currency mismatch in monetary addition");
    const amountSubunits = a.amountSubunits + b.amountSubunits;
    return {
      amountSubunits,
      currency: a.currency,
      formattedString: this.formatCurrency(amountSubunits, a.currency),
    };
  }

  /**
   * Calculates precise jurisdiction-aware tax without floating point inaccuracies
   */
  static calculateTax(params: {
    itemSubunits: number;
    countryCode: SupportedCountryCode;
    isInterState?: boolean;
  }): { taxSubunits: number; totalWithTaxSubunits: number; breakdown: Record<string, number> } {
    const region = regionConfigsStore.get(params.countryCode) || regionConfigsStore.get("IN")!;
    const rule = region.taxRule;

    let taxSubunits = 0;
    const breakdown: Record<string, number> = {};

    if (rule.isSplitSupported && rule.intraStateSplit) {
      if (params.isInterState) {
        // IGST
        const igstBasis = rule.interStateBasisPoints || rule.rateBasisPoints;
        taxSubunits = Math.round((params.itemSubunits * igstBasis) / 10000);
        breakdown.IGST_Subunits = taxSubunits;
      } else {
        // CGST + SGST
        const cgstSubunits = Math.round((params.itemSubunits * rule.intraStateSplit.cgstBasisPoints) / 10000);
        const sgstSubunits = Math.round((params.itemSubunits * rule.intraStateSplit.sgstBasisPoints) / 10000);
        taxSubunits = cgstSubunits + sgstSubunits;
        breakdown.CGST_Subunits = cgstSubunits;
        breakdown.SGST_Subunits = sgstSubunits;
      }
    } else {
      // Standard country VAT or Sales Tax
      taxSubunits = Math.round((params.itemSubunits * rule.rateBasisPoints) / 10000);
      breakdown[`${rule.taxName}_Subunits`] = taxSubunits;
    }

    return {
      taxSubunits,
      totalWithTaxSubunits: params.itemSubunits + taxSubunits,
      breakdown,
    };
  }
}

// =========================================================================
// 3. LOCALIZATION (i18n) ENGINE
// =========================================================================

export const I18N_DICTIONARY: Record<SupportedLanguageCode, Record<string, string>> = {
  "en-IN": {
    "nav.home": "Home",
    "nav.catalog": "Catalog",
    "nav.cart": "Cart",
    "nav.orders": "My Orders",
    "btn.buyNow": "Buy Now",
    "btn.addToCart": "Add to Cart",
    "policy.returns": "7-Day Authenticity Guarantee & Easy Returns",
  },
  "hi-IN": {
    "nav.home": "होम",
    "nav.catalog": "कैटलॉग",
    "nav.cart": "कार्ट",
    "nav.orders": "मेरे ऑर्डर",
    "btn.buyNow": "अभी खरीदें",
    "btn.addToCart": "कार्ट में जोड़ें",
    "policy.returns": "7 दिन की प्रामाणिकता गारंटी और आसान वापसी",
  },
  "ar-AE": {
    "nav.home": "الرئيسية",
    "nav.catalog": "الكتالوج",
    "nav.cart": "عربة التسوق",
    "nav.orders": "طلباتي",
    "btn.buyNow": "اشتري الآن",
    "btn.addToCart": "أضف إلى السلة",
    "policy.returns": "ضمان الأصالة لمدة 7 أيام مع إرجاع سهل",
  },
  "en-US": {
    "nav.home": "Home",
    "nav.catalog": "Catalog",
    "nav.cart": "Cart",
    "nav.orders": "Orders",
    "btn.buyNow": "Buy Now",
    "btn.addToCart": "Add to Cart",
    "policy.returns": "7-Day Authenticity Guarantee & Easy Returns",
  },
  "en-GB": {
    "nav.home": "Home",
    "nav.catalog": "Catalogue",
    "nav.cart": "Basket",
    "nav.orders": "My Orders",
    "btn.buyNow": "Buy Now",
    "btn.addToCart": "Add to Basket",
    "policy.returns": "7-Day Authenticity Guarantee & Easy Returns",
  },
};

export class LocalizationEngine {
  /**
   * Translates UI string tokens into target language
   */
  static translate(token: string, lang: SupportedLanguageCode = "en-IN"): string {
    const dict = I18N_DICTIONARY[lang] || I18N_DICTIONARY["en-IN"];
    return dict[token] || I18N_DICTIONARY["en-IN"][token] || token;
  }
}

// =========================================================================
// 4. COUNTRY ACTIVATION GATEKEEPER
// =========================================================================

export class CountryActivationGatekeeper {
  /**
   * Attempts to activate a country for live customer checkout
   * Strictly enforces 4-pillar readiness verification (Legal, Tax, Payment, Logistics)
   */
  static activateCountryMarket(countryCode: SupportedCountryCode): {
    success: boolean;
    countryConfig?: RegionMarketConfig;
    missingPillars?: string[];
    error?: string;
  } {
    const config = regionConfigsStore.get(countryCode);
    if (!config) {
      return { success: false, error: `Country ${countryCode} is not recognized` };
    }

    const missingPillars: string[] = [];
    if (!config.readinessChecklist.isLegalEntityConfigured) missingPillars.push("Legal Entity & Local ToS");
    if (!config.readinessChecklist.isTaxFrameworkConfigured) missingPillars.push("Jurisdiction Tax Framework");
    if (!config.readinessChecklist.isPaymentGatewayConfigured) missingPillars.push("Local Regulated Payment Gateway");
    if (!config.readinessChecklist.isLogisticsCarrierConfigured) missingPillars.push("Cross-Border Logistics Carrier");

    if (missingPillars.length > 0) {
      return {
        success: false,
        countryConfig: config,
        missingPillars,
        error: `Cannot activate ${config.countryName}: Missing required readiness pillars: ${missingPillars.join(", ")}`,
      };
    }

    config.status = "ACTIVE";
    return { success: true, countryConfig: config };
  }

  /**
   * Retrieves all regional market configurations
   */
  static getAllRegions(): RegionMarketConfig[] {
    return Array.from(regionConfigsStore.values());
  }
}
