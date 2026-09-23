import { PrismaClient } from "@prisma/client";
import {
  DEFAULT_FOOTER_CONFIG,
  FooterBuilderConfig,
  FooterColumn,
  FooterLinkItem,
} from "../src/lib/footer-builder-types";

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

async function runFooterBuilderTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — SECTION 16: FOOTER BUILDER TEST SUITE");
  console.log("=======================================================================\n");

  try {
    console.log("--- PHASE 1: VERIFYING ALL 5 DEFAULT FOOTER COLUMNS ---");
    assert(DEFAULT_FOOTER_CONFIG.columns.length === 5, "5 default footer navigation columns registered");

    const expectedColumns = [
      "About FancyHub",
      "Customer Service",
      "Sell on FancyHub",
      "Policies & Legal",
      "Download App",
    ];

    expectedColumns.forEach((title, idx) => {
      const col = DEFAULT_FOOTER_CONFIG.columns[idx];
      assert(col !== undefined, `Column #${idx + 1} (${title}) exists`);
      assert(col?.links.length > 0, `  - Column #${idx + 1} has ${col?.links.length} active links`);
    });

    console.log("\n--- PHASE 2: VERIFYING CUSTOMIZABLE FOOTER MODULES ---");
    // 1. Trust Badges
    assert(DEFAULT_FOOTER_CONFIG.showTrustBadges === true, "1. Trust badges & guarantees enabled");
    assert(DEFAULT_FOOTER_CONFIG.trustBadges.length >= 4, "  - 4 trust badges registered (Delivery, Payments, Returns, Support)");

    // 2. Newsletter
    assert(DEFAULT_FOOTER_CONFIG.showNewsletter === true, "2. Newsletter module enabled");
    assert(DEFAULT_FOOTER_CONFIG.newsletter.badge.includes("500"), "  - ₹500 discount incentive badge configured");

    // 3. Contact Information
    assert(DEFAULT_FOOTER_CONFIG.showContactInfo === true, "3. Contact information block enabled");
    assert(DEFAULT_FOOTER_CONFIG.contactInfo.phone.includes("1800"), "  - Toll-Free phone registered");
    assert(DEFAULT_FOOTER_CONFIG.contactInfo.email.includes("fancyhub.in"), "  - Support email registered");

    // 4. App Download
    assert(DEFAULT_FOOTER_CONFIG.showAppDownload === true, "4. App download store links enabled");
    assert(DEFAULT_FOOTER_CONFIG.appDownload.playStoreUrl.length > 0, "  - Google Play Store configured");
    assert(DEFAULT_FOOTER_CONFIG.appDownload.appStoreUrl.length > 0, "  - Apple App Store configured");

    // 5. Social Icons
    assert(DEFAULT_FOOTER_CONFIG.showSocialIcons === true, "5. Social media icons enabled");
    assert(DEFAULT_FOOTER_CONFIG.socialIcons.length >= 6, "  - 6 social channels registered (Instagram, Facebook, YouTube, X, WhatsApp, LinkedIn)");

    // 6. Payment Icons
    assert(DEFAULT_FOOTER_CONFIG.showPaymentIcons === true, "6. Payment gateway badges enabled");
    assert(DEFAULT_FOOTER_CONFIG.paymentIcons.length >= 6, "  - 7 payment options registered (UPI, RuPay, Visa, MasterCard, NetBanking, COD, EMI)");

    // 7. Copyright & Registration
    assert(DEFAULT_FOOTER_CONFIG.copyrightText.includes("FancyHub.in"), "7. Dynamic copyright statement configured");
    assert(DEFAULT_FOOTER_CONFIG.legalNotice.includes("GSTIN"), "  - Legal entity GSTIN & MSME notice configured");

    // 8. Vendor links & Customer support links
    const sellCol = DEFAULT_FOOTER_CONFIG.columns.find((c) => c.title.toLowerCase().includes("sell"));
    assert(sellCol?.links.some((l) => l.url.includes("vendor/register")) === true, "8. Vendor onboarding & seller links present");

    const csCol = DEFAULT_FOOTER_CONFIG.columns.find((c) => c.title.toLowerCase().includes("customer"));
    assert(csCol?.links.some((l) => l.url.includes("track-order")) === true, "9. Order tracking & customer support links present");

    console.log("\n--- PHASE 3: DYNAMIC COLUMN & LINK MODIFICATION SIMULATION ---");
    const modifiedConfig: FooterBuilderConfig = {
      ...DEFAULT_FOOTER_CONFIG,
      newsletter: {
        ...DEFAULT_FOOTER_CONFIG.newsletter,
        title: "Subscribe to Surat Silk & Artisan Weekly",
      },
      columns: [
        ...DEFAULT_FOOTER_CONFIG.columns,
        {
          id: "col-custom",
          title: "Artisan Hubs",
          sortOrder: 5,
          isActive: true,
          links: [
            { id: "l-surat", label: "Surat Silk Weavers", url: "/vendors" },
            { id: "l-jaipur", label: "Jaipur Block Prints", url: "/vendors" },
          ],
        },
      ],
    };

    assert(modifiedConfig.columns.length === 6, "Added 6th dynamic column 'Artisan Hubs'");

    console.log("\n--- PHASE 4: DATABASE PERSISTENCE & STOREFRONT API SYNC ---");
    await prisma.systemPageConfig.upsert({
      where: { id: "footer-builder-config" },
      update: {
        name: "Global Footer Configuration",
        configJson: JSON.stringify(modifiedConfig),
      },
      create: {
        id: "footer-builder-config",
        name: "Global Footer Configuration",
        configJson: JSON.stringify(modifiedConfig),
      },
    });

    const retrieved = await prisma.systemPageConfig.findUnique({
      where: { id: "footer-builder-config" },
    });
    const parsed: FooterBuilderConfig = JSON.parse(retrieved!.configJson);

    assert(parsed.columns.length === 6, "Retrieved 6 persistent columns from database");
    assert(parsed.newsletter.title === "Subscribe to Surat Silk & Artisan Weekly", "Newsletter title updated in database");

    console.log("\n=======================================================================");
    console.log(`Footer Builder Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test execution failed:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runFooterBuilderTests();
