export interface PageSeoConfig {
  seoTitle?: string;
  metaDescription?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image";
  robots?: "index,follow" | "noindex,nofollow" | "noindex,follow";
  jsonLdSchema?: Record<string, any>;
}

export const DEFAULT_STORE_SEO: PageSeoConfig = {
  seoTitle: "FancyHub.in — India's Premier Multi-Vendor Marketplace & Artisan Hub",
  metaDescription: "Buy authentic Banarasi sarees, Kanjivaram silk, ethnic kurtas, 5G gadgets, and artisan crafts directly from verified Indian weavers. Free express delivery & COD.",
  keywords: "silk sarees, banarasi saree, kanjivaram bridal, ethnic kurtas, indian artisans, fancyhub",
  canonicalUrl: "https://fancyhub.in",
  ogTitle: "FancyHub.in — Authentic Indian Handlooms & Multi-Vendor Marketplace",
  ogDescription: "Direct weaver pricing, verified Silk Mark assurance, 7-day doorstep returns, and festive flash discounts.",
  ogImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=80",
  twitterCard: "summary_large_image",
  robots: "index,follow",
};

/**
 * Automate Category SEO based on hierarchy: e.g. ["Fashion", "Men", "Shirts"]
 */
export function generateAutomatedCategorySeo(
  hierarchyPath: string[],
  customOverride?: Partial<PageSeoConfig>
): PageSeoConfig {
  const leafCategory = hierarchyPath[hierarchyPath.length - 1] || "Ethnic Collections";
  const parentContext = hierarchyPath.length > 1 ? ` ${hierarchyPath.slice(0, -1).join(" ")}` : "";
  const fullBreadcrumb = hierarchyPath.join(" > ");

  const autoTitle = `${leafCategory}${parentContext} Online | FancyHub.in`;
  const autoDesc = `Shop authentic ${leafCategory.toLowerCase()} online on FancyHub.in. Direct weaver pricing, 100% verified Silk Mark quality, free delivery & COD available across India.`;
  const autoKeywords = `${leafCategory.toLowerCase()}, buy ${leafCategory.toLowerCase()} online, authentic ${leafCategory.toLowerCase()}, fancyhub`;

  return {
    seoTitle: customOverride?.seoTitle || autoTitle,
    metaDescription: customOverride?.metaDescription || autoDesc,
    keywords: customOverride?.keywords || autoKeywords,
    canonicalUrl: customOverride?.canonicalUrl || `https://fancyhub.in/category/${leafCategory.toLowerCase().replace(/\s+/g, "-")}`,
    ogTitle: customOverride?.ogTitle || autoTitle,
    ogDescription: customOverride?.ogDescription || autoDesc,
    ogImage: customOverride?.ogImage || DEFAULT_STORE_SEO.ogImage,
    twitterCard: "summary_large_image",
    robots: customOverride?.robots || "index,follow",
    jsonLdSchema: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": hierarchyPath.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item,
      })),
    },
  };
}

/**
 * Generate Product JSON-LD Schema
 */
export function generateProductJsonLd(product: {
  title: string;
  description: string;
  price: number;
  sku: string;
  imageUrl?: string;
  vendorName?: string;
  ratings?: number;
  reviewCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": product.imageUrl || DEFAULT_STORE_SEO.ogImage,
    "description": product.description,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": product.vendorName || "FancyHub Artisan",
    },
    "offers": {
      "@type": "Offer",
      "url": `https://fancyhub.in/product/${product.sku}`,
      "priceCurrency": "INR",
      "price": product.price,
      "availability": "https://schema.org/InStock",
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.ratings || 4.8,
      "reviewCount": product.reviewCount || 120,
    },
  };
}
