import { PrismaClient } from "@prisma/client";
import { THEME_PRESETS } from "../src/lib/theme-engine";
import { getDefaultHomepageSections } from "../src/lib/page-builder";

const prisma = new PrismaClient();

async function main() {
  console.log("🎨 Seeding Theme Config, CMS Page Builder, Sections & Marketing in Database...");

  // 1. Seed Global Theme Config
  const defaultTheme = THEME_PRESETS["royal-blue"];
  await prisma.themeConfig.upsert({
    where: { id: "global-theme" },
    update: {
      ...defaultTheme,
      customCss: "",
    },
    create: {
      id: "global-theme",
      ...defaultTheme,
      customCss: "",
    },
  });
  console.log("✅ Seeded Global Theme Config (Royal Blue Default)");

  // 2. Seed Global Header Config
  await prisma.headerConfig.upsert({
    where: { id: "global-header" },
    update: {
      showTopBar: true,
      topBarText: "⚡ Festive Dhamaka: FLAT ₹200 OFF on First Order | Use Code: FANCYFIRST",
      topBarBadge: "FESTIVE 2026",
      topBarLink: "/deals",
      topBarBgColor: "#0A1128",
      topBarTextColor: "#FFFFFF",
      logoAlignment: "LEFT",
      searchPlaceholder: "Search for Sarees, Kurtas, Mobiles, ANC Earbuds, Brands...",
      isSticky: true,
      isTransparentOnHero: false,
    },
    create: {
      id: "global-header",
      showTopBar: true,
      topBarText: "⚡ Festive Dhamaka: FLAT ₹200 OFF on First Order | Use Code: FANCYFIRST",
      topBarBadge: "FESTIVE 2026",
      topBarLink: "/deals",
      topBarBgColor: "#0A1128",
      topBarTextColor: "#FFFFFF",
      logoAlignment: "LEFT",
      searchPlaceholder: "Search for Sarees, Kurtas, Mobiles, ANC Earbuds, Brands...",
      isSticky: true,
      isTransparentOnHero: false,
    },
  });
  console.log("✅ Seeded Global Header Config");

  // 3. Seed Global Footer Config
  await prisma.footerConfig.upsert({
    where: { id: "global-footer" },
    update: {
      showNewsletter: true,
      newsletterTitle: "Join India's Fastest Growing Marketplace Club",
      newsletterSubtitle: "Get ₹500 instant wallet credits on sign-up, exclusive handloom drops & weekend flash coupons.",
      copyrightText: "© 2026 FancyHub.in — India's Premier Multi-Vendor Marketplace. Built for direct Indian weavers, artisans & innovators.",
    },
    create: {
      id: "global-footer",
      showNewsletter: true,
      newsletterTitle: "Join India's Fastest Growing Marketplace Club",
      newsletterSubtitle: "Get ₹500 instant wallet credits on sign-up, exclusive handloom drops & weekend flash coupons.",
      copyrightText: "© 2026 FancyHub.in — India's Premier Multi-Vendor Marketplace. Built for direct Indian weavers, artisans & innovators.",
    },
  });
  console.log("✅ Seeded Global Footer Config");

  // 4. Seed Homepage & Sections
  const homePage = await prisma.pageConfig.upsert({
    where: { slug: "home" },
    update: {
      title: "Homepage",
      isHomepage: true,
      status: "PUBLISHED",
      layoutType: "DEFAULT",
      seoTitle: "FancyHub.in — India's Multi-Vendor Marketplace | Shop More, Pay Less",
      seoDescription: "Shop authentic Indian sarees, kurtas, 5G smartphones, and custom prints from 5,000+ verified Indian weavers & brands.",
    },
    create: {
      slug: "home",
      title: "Homepage",
      isHomepage: true,
      status: "PUBLISHED",
      layoutType: "DEFAULT",
      seoTitle: "FancyHub.in — India's Multi-Vendor Marketplace | Shop More, Pay Less",
      seoDescription: "Shop authentic Indian sarees, kurtas, 5G smartphones, and custom prints from 5,000+ verified Indian weavers & brands.",
    },
  });

  // Remove existing sections to ensure clean order
  await prisma.pageSection.deleteMany({
    where: { pageId: homePage.id },
  });

  const defaultSections = getDefaultHomepageSections();
  for (const s of defaultSections) {
    await prisma.pageSection.create({
      data: {
        pageId: homePage.id,
        type: s.type,
        title: s.title,
        subtitle: s.subtitle,
        sortOrder: s.sortOrder,
        isActive: s.isActive,
        desktopVisible: s.desktopVisible,
        mobileVisible: s.mobileVisible,
        contentJson: s.contentJson,
        stylingJson: s.stylingJson,
      },
    });
    console.log(`  └─ Created Section: [${s.sortOrder}] ${s.type} - ${s.title}`);
  }

  // 5. Seed Announcement Bars
  await prisma.announcementBar.upsert({
    where: { id: "bar-1" },
    update: {
      text: "⚡ EXTRA 10% CASHBACK on all UPI Orders above ₹1,499 | Use Code: UPIFANCY",
      badge: "LIMITED TIME",
      link: "/deals",
      bgColor: "#1455D9",
      textColor: "#FFFFFF",
      isActive: true,
      isDismissible: true,
      sortOrder: 1,
    },
    create: {
      id: "bar-1",
      text: "⚡ EXTRA 10% CASHBACK on all UPI Orders above ₹1,499 | Use Code: UPIFANCY",
      badge: "LIMITED TIME",
      link: "/deals",
      bgColor: "#1455D9",
      textColor: "#FFFFFF",
      isActive: true,
      isDismissible: true,
      sortOrder: 1,
    },
  });

  // 6. Seed Marketing Popups
  await prisma.marketingPopup.upsert({
    where: { id: "popup-welcome" },
    update: {
      title: "Welcome to FancyHub! Get ₹500 OFF",
      description: "Sign up today and unlock instant ₹500 discount coupon + Free Express Delivery on your first order.",
      badgeText: "FIRST ORDER REWARD",
      imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80",
      buttonText: "CLAIM ₹500 VOUCHER",
      buttonLink: "/register",
      couponCode: "FANCYFIRST",
      triggerType: "DELAY",
      delaySeconds: 5,
      scrollPercent: 30,
      isActive: true,
      maxDisplaysPerUser: 2,
    },
    create: {
      id: "popup-welcome",
      title: "Welcome to FancyHub! Get ₹500 OFF",
      description: "Sign up today and unlock instant ₹500 discount coupon + Free Express Delivery on your first order.",
      badgeText: "FIRST ORDER REWARD",
      imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80",
      buttonText: "CLAIM ₹500 VOUCHER",
      buttonLink: "/register",
      couponCode: "FANCYFIRST",
      triggerType: "DELAY",
      delaySeconds: 5,
      scrollPercent: 30,
      isActive: true,
      maxDisplaysPerUser: 2,
    },
  });

  console.log("\n🎉 CMS Builder, Theme Engine & Marketing Data Seeded Successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding CMS Builder data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
