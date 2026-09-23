import { PrismaClient } from "@prisma/client";

export const REQUIRED_SYSTEM_PAGES = [
  { title: "Home", slug: "home", isHomepage: true, description: "Main storefront homepage with hero slider, flash deals, and bestsellers" },
  { title: "Shop", slug: "shop", isHomepage: false, description: "Full catalog directory and department browse page" },
  { title: "Fashion", slug: "fashion", isHomepage: false, description: "Curated handloom sarees, kurtas, menswear & womenswear" },
  { title: "Electronics", slug: "electronics", isHomepage: false, description: "ANC earbuds, mobile accessories, audio gear & gadgets" },
  { title: "About", slug: "about", isHomepage: false, description: "About FancyHub, artisan heritage story & mission" },
  { title: "Contact", slug: "contact", isHomepage: false, description: "Contact information, customer care & vendor partnership inquiries" },
  { title: "Offers", slug: "offers", isHomepage: false, description: "Seasonal deals, clearance markdowns & festive discount coupons" },
  { title: "Flash Sale", slug: "flash-sale", isHomepage: false, description: "Ticking countdown deals with steep discounts" },
  { title: "Custom Print", slug: "custom-print", isHomepage: false, description: "Custom textile printing, wedding saree monograms & corporate gifts" },
  { title: "Vendor", slug: "vendor", isHomepage: false, description: "Master weavers guild, verified Indian artisans & seller hub" },
  { title: "Blog", slug: "blog", isHomepage: false, description: "Artisan journal, loom dispatches & Indian heritage textile stories" },
  { title: "FAQ", slug: "faq", isHomepage: false, description: "Frequently asked questions regarding orders, payments & sizing" },
  { title: "Privacy Policy", slug: "privacy-policy", isHomepage: false, description: "User data privacy, cookie consent & GDPR compliance policy" },
  { title: "Terms", slug: "terms", isHomepage: false, description: "Terms of service, marketplace agreement & user obligations" },
  { title: "Refund", slug: "refund", isHomepage: false, description: "7-day doorstep return, replacement & refund policy" },
  { title: "Shipping", slug: "shipping", isHomepage: false, description: "Pan-India express delivery timelines & shipping charges" },
  { title: "Help Center", slug: "help-center", isHomepage: false, description: "Customer support ticket portal, live chat & order tracking help" },
];

export async function ensureRequiredPages(prisma: PrismaClient) {
  for (const p of REQUIRED_SYSTEM_PAGES) {
    const existing = await prisma.pageConfig.findUnique({
      where: { slug: p.slug },
    });

    if (!existing) {
      await prisma.pageConfig.create({
        data: {
          title: p.title,
          slug: p.slug,
          description: p.description,
          seoTitle: `${p.title} | FancyHub.in — Authentic Indian Marketplace`,
          seoDescription: p.description,
          isHomepage: p.isHomepage,
          status: "PUBLISHED",
          layoutType: "DEFAULT",
          headerStyle: "DEFAULT",
          footerStyle: "DEFAULT",
        },
      });
    }
  }
}
