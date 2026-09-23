import { PrismaClient } from "@prisma/client";
import {
  DEFAULT_BRAND_LOCK_SETTINGS,
  DEFAULT_VENDOR_DESIGN,
  DEFAULT_ACCOUNT_UI_CONFIG,
  DEFAULT_CHECKOUT_DESIGN_CONFIG,
  enforceBrandRules,
  BrandLockSettings,
} from "../src/lib/brand-lock-engine";

const prisma = new PrismaClient();

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

async function runSections61To64Tests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — SECTIONS 61–64: BRAND LOCK & STORE DESIGN TEST SUITE");
  console.log("=======================================================================\n");

  try {
    // SECTION 61: CUSTOMER ACCOUNT UI
    console.log("--- SECTION 61: CUSTOMER ACCOUNT UI ---");
    assert(DEFAULT_ACCOUNT_UI_CONFIG.dashboardStyle === "card_grid", "Account dashboard style: card_grid");
    assert(DEFAULT_ACCOUNT_UI_CONFIG.showWalletCard === true, "Wallet & cashback card enabled");
    assert(DEFAULT_ACCOUNT_UI_CONFIG.showRecentOrdersHero === true, "Recent orders tracking hero enabled");
    assert(DEFAULT_ACCOUNT_UI_CONFIG.showDirectSupportButton === true, "Direct support button enabled");

    // SECTION 62: CART / CHECKOUT DESIGNER
    console.log("\n--- SECTION 62: CART / CHECKOUT DESIGNER ---");
    assert(DEFAULT_CHECKOUT_DESIGN_CONFIG.cartLayout === "two_column", "Cart layout: two_column");
    assert(DEFAULT_CHECKOUT_DESIGN_CONFIG.couponBoxStyle === "dashed_pill", "Coupon box style: dashed_pill");
    assert(DEFAULT_CHECKOUT_DESIGN_CONFIG.showFreeShippingProgressBar === true, "Free shipping threshold progress bar enabled");
    assert(DEFAULT_CHECKOUT_DESIGN_CONFIG.freeShippingThresholdINR === 999, "Free shipping threshold: ₹999");
    assert(DEFAULT_CHECKOUT_DESIGN_CONFIG.checkoutStepStyle === "accordion", "Checkout flow: accordion");

    // SECTION 63: VENDOR STORE DESIGNER
    console.log("\n--- SECTION 63: VENDOR STORE DESIGNER ---");
    assert(DEFAULT_VENDOR_DESIGN.storeName.length > 0, "Vendor store name configured");
    assert(DEFAULT_VENDOR_DESIGN.layoutStyle === "ARTISAN_SHOWCASE", "Vendor layout style: ARTISAN_SHOWCASE");
    assert(DEFAULT_VENDOR_DESIGN.showArtisanStory === true, "Vendor story bio enabled");
    assert(DEFAULT_VENDOR_DESIGN.accentColor === "#F7941D", "Vendor accent color selected from approved palette");

    // SECTION 64: ADMIN GLOBAL BRAND CONTROL
    console.log("\n--- SECTION 64: ADMIN GLOBAL BRAND CONTROL ---");
    assert(DEFAULT_BRAND_LOCK_SETTINGS.lockLogo === true, "Global Logo is LOCKED");
    assert(DEFAULT_BRAND_LOCK_SETTINGS.lockPrimaryColor === true, "Global Primary Color is LOCKED");
    assert(DEFAULT_BRAND_LOCK_SETTINGS.lockFont === true, "Global Font is LOCKED");
    assert(DEFAULT_BRAND_LOCK_SETTINGS.lockFooter === true, "Global Footer is LOCKED");
    assert(DEFAULT_BRAND_LOCK_SETTINGS.lockLegalLinks === true, "Global Legal Links are LOCKED");
    assert(DEFAULT_BRAND_LOCK_SETTINGS.lockPaymentBranding === true, "Global Payment Trust Badges are LOCKED");
    assert(DEFAULT_BRAND_LOCK_SETTINGS.allowedVendorAccentColors.length >= 6, "6 Approved vendor accent colors provided");

    // TEST: Enforce brand rules against illegal vendor overrides
    const illegalVendorAttempt = {
      storeName: "Surat Silk Mills",
      primaryColor: "#FF0000",          // Illegal: Trying to override locked primary color
      fontFamily: "Comic Sans",         // Illegal: Trying to override locked font
      accentColor: "#990099",           // Illegal: Outside allowed palette
    };

    const enforcement = enforceBrandRules(illegalVendorAttempt, DEFAULT_BRAND_LOCK_SETTINGS);
    assert(enforcement.violatedRules.length >= 3, "Brand rule enforcement caught all 3 illegal overrides!");
    assert((enforcement.sanitized as any).primaryColor === undefined, "Locked primaryColor stripped from vendor payload");
    assert((enforcement.sanitized as any).fontFamily === undefined, "Locked fontFamily stripped from vendor payload");
    assert(
      DEFAULT_BRAND_LOCK_SETTINGS.allowedVendorAccentColors.includes(enforcement.sanitized.accentColor),
      "Illegal accent color normalized to default approved palette color"
    );

    console.log("\n=======================================================================");
    console.log(`Sections 61–64 Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test execution error:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runSections61To64Tests();
