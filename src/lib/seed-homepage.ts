import { PrismaClient } from "@prisma/client";

export const HOMEPAGE_EXEMPLAR_PIPELINE = [
  {
    type: "HERO_BANNER",
    name: "Hero Banner",
    title: "Diwali Handloom & Festive Tech Festival",
    subtitle: "Direct from master weavers in Surat, Varanasi & verified electronic brands",
    sortOrder: 0,
    settings: {
      title: "Diwali Handloom & Festive Tech Festival",
      subtitle: "Direct from master weavers in Surat, Varanasi & verified electronic brands",
      ctaText: "Shop Festive Weaves",
      ctaLink: "/deals",
      badge: "FESTIVE MEGA SALE",
    },
    style: { paddingY: "py-4", backgroundColor: "#0F172A" },
    dataSource: { type: "STATIC" },
  },
  {
    type: "TRUST_BADGES",
    name: "USP Section",
    title: "Why Choose FancyHub?",
    subtitle: "India's Most Trusted Artisan Handloom & Direct-to-Consumer Platform",
    sortOrder: 1,
    settings: {
      title: "Why Choose FancyHub?",
      subtitle: "India's Most Trusted Artisan Handloom & Direct-to-Consumer Platform",
    },
    style: { paddingY: "py-4", backgroundColor: "transparent" },
    dataSource: { type: "STATIC" },
  },
  {
    type: "FLASH_DEALS",
    name: "Flash Deals",
    title: "Ticking Flash Deals — Flat 50% OFF",
    subtitle: "Limited time lightning deals expiring soon",
    sortOrder: 2,
    settings: {
      title: "Ticking Flash Deals — Flat 50% OFF",
      subtitle: "Limited time lightning deals expiring soon",
      badge: "⚡ FLAT 50% OFF",
      hoursRemaining: 14,
      showCountdown: true,
      cardStyle: "modern",
      desktopColumns: 4,
      mobileColumns: 2,
    },
    style: { paddingY: "py-6", backgroundColor: "transparent" },
    dataSource: { type: "PRODUCTS", sourceType: "discounted", limit: 4 },
  },
  {
    type: "CATEGORY_CAROUSEL",
    name: "Categories",
    title: "Browse by Category",
    subtitle: "Explore 75+ authentic Indian departments and weaves",
    sortOrder: 3,
    settings: {
      title: "Browse by Category",
      subtitle: "Explore 75+ authentic Indian departments and weaves",
      limit: 8,
    },
    style: { paddingY: "py-4", backgroundColor: "transparent" },
    dataSource: { type: "CATEGORIES", limit: 8, parentId: "root" },
  },
  {
    type: "FEATURED_PRODUCTS",
    name: "Featured Products",
    title: "Featured Collections",
    subtitle: "Curated handcrafted pieces recommended by FancyHub stylists",
    sortOrder: 4,
    settings: {
      title: "Featured Collections",
      subtitle: "Curated handcrafted pieces recommended by FancyHub stylists",
      cardStyle: "elevated",
      imageRatio: "3:4",
      desktopColumns: 4,
      tabletColumns: 3,
      mobileColumns: 2,
      showPrice: true,
      showDiscount: true,
      showRating: true,
      showAddToCart: true,
      showWishlist: true,
    },
    style: { paddingY: "py-6", backgroundColor: "transparent" },
    dataSource: { type: "PRODUCTS", sourceType: "featured", limit: 8 },
  },
  {
    type: "TOP_VENDORS",
    name: "Top Vendors",
    title: "Top Verified Artisans & Guilds",
    subtitle: "Meet India's master craftspeople shipping directly from looms",
    sortOrder: 5,
    settings: {
      title: "Top Verified Artisans & Guilds",
      subtitle: "Meet India's master craftspeople shipping directly from looms",
      limit: 3,
    },
    style: { paddingY: "py-6", backgroundColor: "transparent" },
    dataSource: { type: "VENDORS", limit: 3 },
  },
  {
    type: "DEALS",
    name: "Deals",
    title: "Exclusive Value Deals",
    subtitle: "Special limited-stock bundles & bulk discounts",
    sortOrder: 6,
    settings: {
      title: "Exclusive Value Deals",
      subtitle: "Special limited-stock bundles & bulk discounts",
      badge: "LIMITED DEALS",
      hoursRemaining: 8,
    },
    style: { paddingY: "py-6", backgroundColor: "transparent" },
    dataSource: { type: "PRODUCTS", sourceType: "discounted", limit: 4 },
  },
  {
    type: "RECENTLY_VIEWED",
    name: "Recently Viewed",
    title: "Recently Viewed by You",
    subtitle: "Pick up right where you left off",
    sortOrder: 7,
    settings: {
      title: "Recently Viewed by You",
      subtitle: "Pick up right where you left off",
      cardStyle: "modern",
      desktopColumns: 4,
      mobileColumns: 2,
    },
    style: { paddingY: "py-6", backgroundColor: "transparent" },
    dataSource: { type: "PRODUCTS", sourceType: "trending", limit: 4 },
  },
  {
    type: "BLOG_POSTS",
    name: "Blog",
    title: "Stories from the Indian Loom",
    subtitle: "Read our latest editorial dispatches on weaving heritage and crafts",
    sortOrder: 8,
    settings: {
      title: "Stories from the Indian Loom",
      subtitle: "Read our latest editorial dispatches on weaving heritage and crafts",
      limit: 3,
    },
    style: { paddingY: "py-6", backgroundColor: "transparent" },
    dataSource: { type: "STATIC" },
  },
  {
    type: "NEWSLETTER",
    name: "Newsletter",
    title: "Join FancyHub & Get ₹500 OFF",
    subtitle: "Subscribe to receive private weaver vault drops, festive vouchers and loom stories.",
    sortOrder: 9,
    settings: {
      title: "Join FancyHub & Get ₹500 OFF",
      subtitle: "Subscribe to receive private weaver vault drops, festive vouchers and loom stories.",
      couponCode: "FANCYFIRST",
    },
    style: { paddingY: "py-8", backgroundColor: "#0F172A" },
    dataSource: { type: "STATIC" },
  },
];

export async function syncHomepagePipeline(prisma: PrismaClient) {
  let homePage = await prisma.pageConfig.findFirst({
    where: { OR: [{ slug: "home" }, { isHomepage: true }] },
  });

  if (!homePage) {
    homePage = await prisma.pageConfig.create({
      data: {
        title: "Home",
        slug: "home",
        isHomepage: true,
        description: "Official FancyHub.in 2.0 Marketplace Storefront Homepage",
        seoTitle: "FancyHub.in — India's Premier Artisan Marketplace",
        seoDescription: "Shop authentic handloom sarees, kurtas & modern gadgets direct from makers.",
        status: "PUBLISHED",
        layoutType: "DEFAULT",
        headerStyle: "DEFAULT",
        footerStyle: "DEFAULT",
      },
    });
  }

  // Check if sections already exist
  const existingCount = await prisma.pageSection.count({
    where: { pageId: homePage.id },
  });

  if (existingCount === 0) {
    // Populate with the exemplar pipeline
    for (const sec of HOMEPAGE_EXEMPLAR_PIPELINE) {
      await prisma.pageSection.create({
        data: {
          pageId: homePage.id,
          type: sec.type,
          sortOrder: sec.sortOrder,
          isActive: true,
          desktopVisible: true,
          mobileVisible: true,
          contentJson: JSON.stringify(sec.settings),
          stylingJson: JSON.stringify(sec.style),
        },
      });
    }
  }
}
