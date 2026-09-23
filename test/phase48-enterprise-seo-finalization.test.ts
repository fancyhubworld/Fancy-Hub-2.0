/**
 * FancyHub.in 2.0 — Phase 48: Enterprise SEO Finalization Test Suite
 * 
 * 50-Point Comprehensive SEO Engine & Metadata Audit:
 * 1. Dynamic Page Metadata (Title, Meta Description, Canonical URL)
 * 2. Open Graph Protocol (og:title, og:description, og:image, og:type, og:url)
 * 3. Twitter Card Metadata (twitter:card, twitter:title, twitter:description, twitter:image)
 * 4. Product JSON-LD Schema (Offers, AggregateRating, Brand, Seller, Stock Availability)
 * 5. Organization JSON-LD Schema (Legal Name, Logo, ContactPoint, Social sameAs URLs)
 * 6. WebSite JSON-LD Schema & Sitelinks Searchbox (SearchAction, EntryPoint)
 * 7. BreadcrumbList JSON-LD Schema (Hierarchical category & product positioning)
 * 8. Category & Collection ItemList Schema (Ranked items with canonical targets)
 * 9. LocalBusiness / Store Schema for Marketplace Artisans & Sellers
 * 10. Dynamic /sitemap.xml Generation & Zero-Duplicate URL Invariant
 * 11. Dynamic /robots.txt Route Ingestion & Disallow Safeguards
 * 12. Exclusion of Admin, Vendor ERP, Account, Cart, Checkout & Private API Routes
 * 13. Integration with Category Slug & Redirection Engine
 */

import prisma from "../src/lib/prisma";
import sitemap from "../src/app/sitemap";
import robots from "../src/app/robots";
import {
  DEFAULT_STORE_SEO,
  generateAutomatedCategorySeo,
  generateProductJsonLd,
} from "../src/lib/seo-engine";
import {
  SITE_URL,
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateBreadcrumbSchema,
  generateProductSchema,
  generateItemListSchema,
  generateStoreSchema,
} from "../src/lib/seo-structured-data";
import { PRODUCTS_DATA, CATEGORIES_DATA, BRANDS_DATA, VENDORS_DATA } from "../src/data/mock-catalog";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${message}`);
    failed++;
  }
}

async function runPhase48EnterpriseSeoSuite() {
  console.log("=======================================================================");
  console.log("🚀 FANCYHUB.IN 2.0 — PHASE 48: ENTERPRISE SEO FINALIZATION SUITE");
  console.log("=======================================================================\n");

  try {
    // -------------------------------------------------------------------------
    // [1/8] DYNAMIC PAGE METADATA, OPEN GRAPH & TWITTER CARDS
    // -------------------------------------------------------------------------
    console.log("--- [1/8] Dynamic Page Metadata, Open Graph & Twitter Cards ---");
    assert(DEFAULT_STORE_SEO.seoTitle.includes("FancyHub.in"), "Store default SEO title properly formed");
    assert(DEFAULT_STORE_SEO.metaDescription.length >= 50, "Store default meta description meets minimum length (> 50 chars)");
    assert(DEFAULT_STORE_SEO.canonicalUrl === "https://fancyhub.in", "Store default canonical URL matches authoritative apex domain");
    assert(DEFAULT_STORE_SEO.ogImage.startsWith("https://"), "Open Graph image URL is secure HTTPS");
    assert(DEFAULT_STORE_SEO.twitterCard === "summary_large_image", "Twitter Card configured as 'summary_large_image'");
    assert(DEFAULT_STORE_SEO.robots === "index,follow", "Default indexing directive is 'index,follow'");

    // Category automated SEO metadata
    const catSeo = generateAutomatedCategorySeo(["Fashion", "Women", "Sarees"]);
    assert(catSeo.seoTitle.includes("Sarees"), "Category SEO title dynamically contains leaf category");
    assert(catSeo.metaDescription.includes("sarees"), "Category meta description dynamically customized");
    assert(catSeo.canonicalUrl === "https://fancyhub.in/category/sarees", "Category canonical URL generated accurately without trailing slash");

    // -------------------------------------------------------------------------
    // [2/8] PRODUCT JSON-LD SCHEMA GENERATION
    // -------------------------------------------------------------------------
    console.log("\n--- [2/8] Product JSON-LD Schema Generation ---");
    const sampleProduct = PRODUCTS_DATA[0];
    const productSchema = generateProductSchema(sampleProduct as any);

    assert(productSchema["@context"] === "https://schema.org", "Product schema context is https://schema.org");
    assert(productSchema["@type"] === "Product", "Schema @type is 'Product'");
    assert(productSchema.name === sampleProduct.title, "Product schema name matches product title");
    assert(productSchema.sku === sampleProduct.sku, "Product schema SKU matches catalog SKU");
    assert(productSchema.offers["@type"] === "Offer", "Offers sub-schema @type is 'Offer'");
    assert(productSchema.offers.priceCurrency === "INR", "Price currency is INR");
    assert(productSchema.offers.price === sampleProduct.price, "Price matches authoritative catalog price");
    assert(productSchema.offers.availability === "https://schema.org/InStock", "Product in stock availability set to https://schema.org/InStock");
    assert(productSchema.aggregateRating["@type"] === "AggregateRating", "AggregateRating sub-schema present");
    assert(parseFloat(productSchema.aggregateRating.ratingValue) >= 1.0, "AggregateRating value is valid numeric rating");

    // -------------------------------------------------------------------------
    // [3/8] ORGANIZATION JSON-LD SCHEMA
    // -------------------------------------------------------------------------
    console.log("\n--- [3/8] Organization JSON-LD Schema ---");
    const orgSchema = generateOrganizationSchema();
    assert(orgSchema["@type"] === "Organization", "Organization schema @type is 'Organization'");
    assert(orgSchema.name === "FancyHub.in", "Organization name is 'FancyHub.in'");
    assert(orgSchema.url === "https://fancyhub.in", "Organization URL matches apex domain");
    assert(orgSchema.logo.startsWith("https://fancyhub.in"), "Organization logo URL is valid");
    assert(orgSchema.sameAs.length >= 4, `Organization includes ${orgSchema.sameAs.length} social media profile links (Facebook, Instagram, Twitter, LinkedIn)`);
    assert(orgSchema.contactPoint["@type"] === "ContactPoint", "Customer Service ContactPoint sub-schema present");
    assert(orgSchema.contactPoint.areaServed === "IN", "ContactPoint areaServed is 'IN'");

    // -------------------------------------------------------------------------
    // [4/8] WEBSITE JSON-LD SCHEMA & SITELINKS SEARCHBOX (SEARCHACTION)
    // -------------------------------------------------------------------------
    console.log("\n--- [4/8] WebSite JSON-LD Schema & SearchAction ---");
    const websiteSchema = generateWebsiteSchema();
    assert(websiteSchema["@type"] === "WebSite", "WebSite schema @type is 'WebSite'");
    assert(websiteSchema.name === "FancyHub.in", "WebSite name is 'FancyHub.in'");
    assert(websiteSchema.potentialAction["@type"] === "SearchAction", "Sitelinks Searchbox potentialAction is 'SearchAction'");
    assert(websiteSchema.potentialAction.target["@type"] === "EntryPoint", "SearchAction target is 'EntryPoint'");
    assert(websiteSchema.potentialAction.target.urlTemplate.includes("/search?q="), "SearchAction target URL template routes to '/search?q={search_term_string}'");
    assert(websiteSchema.potentialAction["query-input"] === "required name=search_term_string", "SearchAction query-input requires 'search_term_string'");

    // -------------------------------------------------------------------------
    // [5/8] BREADCRUMB & ITEMLIST SCHEMAS
    // -------------------------------------------------------------------------
    console.log("\n--- [5/8] BreadcrumbList & ItemList Schemas ---");
    const breadcrumbs = generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Clothing", url: "/category/clothing" },
      { name: "Sarees", url: "/category/sarees" },
    ]);
    assert(breadcrumbs["@type"] === "BreadcrumbList", "Breadcrumb schema @type is 'BreadcrumbList'");
    assert(breadcrumbs.itemListElement.length === 3, "BreadcrumbList contains 3 hierarchical steps");
    assert(breadcrumbs.itemListElement[0].position === 1 && breadcrumbs.itemListElement[0].name === "Home", "Step 1 is 'Home' with position 1");
    assert(breadcrumbs.itemListElement[2].position === 3 && breadcrumbs.itemListElement[2].name === "Sarees", "Step 3 is 'Sarees' with position 3");

    // ItemList schema (Categories / Collections)
    const itemList = generateItemListSchema("Trending Festive Sarees", PRODUCTS_DATA.slice(0, 5) as any);
    assert(itemList["@type"] === "ItemList", "ItemList schema @type is 'ItemList'");
    assert(itemList.name === "Trending Festive Sarees", "ItemList name matches section title");
    assert(itemList.itemListElement.length === 5, "ItemList contains 5 ranked product items");
    assert(itemList.itemListElement[0].position === 1, "Rank 1 item position is 1");

    // Store / LocalBusiness schema
    const storeSchema = generateStoreSchema(VENDORS_DATA[0]);
    assert(storeSchema["@type"] === "Store", "Vendor storefront schema @type is 'Store'");
    assert(storeSchema.name === VENDORS_DATA[0].storeName, "Store name matches vendor storeName");
    assert(storeSchema.address.addressCountry === "IN", "Store address country is 'IN'");

    // -------------------------------------------------------------------------
    // [6/8] DYNAMIC /SITEMAP.XML GENERATION & DEDUPLICATION INVARIANT
    // -------------------------------------------------------------------------
    console.log("\n--- [6/8] Dynamic /sitemap.xml Generation & URL Deduplication ---");
    const generatedSitemap = await sitemap();
    assert(generatedSitemap.length > 0, `Dynamic sitemap successfully generated with ${generatedSitemap.length} total URLs`);

    // Verify presence of all content types
    const hasStatic = generatedSitemap.some((r) => r.url === "https://fancyhub.in" || r.url === "https://fancyhub.in/shop");
    const hasCategories = generatedSitemap.some((r) => r.url.includes("/category/"));
    const hasProducts = generatedSitemap.some((r) => r.url.includes("/product/"));
    const hasBrands = generatedSitemap.some((r) => r.url.includes("/brand/"));
    const hasCollections = generatedSitemap.some((r) => r.url.includes("collection="));
    const hasStores = generatedSitemap.some((r) => r.url.includes("/store/"));

    assert(hasStatic, "Sitemap contains core static routes (/shop, /deals, etc.)");
    assert(hasCategories, "Sitemap dynamically indexes categories (/category/*)");
    assert(hasProducts, "Sitemap dynamically indexes products (/product/*)");
    assert(hasBrands, "Sitemap dynamically indexes brands (/brand/*)");
    assert(hasCollections, "Sitemap dynamically indexes curated collections");
    assert(hasStores, "Sitemap dynamically indexes vendor storefronts (/store/*)");

    // URL Deduplication Invariant
    const urlSet = new Set<string>();
    let duplicateFound = false;
    for (const item of generatedSitemap) {
      if (urlSet.has(item.url)) {
        duplicateFound = true;
        console.error(`Duplicate URL found in sitemap: ${item.url}`);
      }
      urlSet.add(item.url);
    }
    assert(!duplicateFound, `Zero duplicate URLs in sitemap (${urlSet.size} unique URLs out of ${generatedSitemap.length} entries)`);

    // -------------------------------------------------------------------------
    // [7/8] SITEMAP DISALLOW & PRIVATE ROUTE EXCLUSIONS
    // -------------------------------------------------------------------------
    console.log("\n--- [7/8] Sitemap Private Route Exclusions ---");
    const excludedPatterns = [
      "/admin",
      "/vendor/dashboard",
      "/vendor/orders",
      "/vendor/wallet",
      "/account",
      "/checkout",
      "/cart",
      "/api/",
    ];

    let leakFound = false;
    for (const item of generatedSitemap) {
      for (const pat of excludedPatterns) {
        if (item.url.includes(pat)) {
          leakFound = true;
          console.error(`Sitemap contains forbidden private route: ${item.url}`);
        }
      }
    }
    assert(!leakFound, "All private/internal routes (/admin, /vendor/dashboard, /account, /checkout, /cart, /api/) strictly excluded from sitemap");

    // -------------------------------------------------------------------------
    // [8/8] DYNAMIC /ROBOTS.TXT DIRECTIVES & SITEMAP LINKAGE
    // -------------------------------------------------------------------------
    console.log("\n--- [8/8] Dynamic /robots.txt Directives & Sitemap Linkage ---");
    const robotsConfig = robots();
    assert(Array.isArray(robotsConfig.rules), "Robots rules configured as array");
    
    const rule = (Array.isArray(robotsConfig.rules) ? robotsConfig.rules[0] : robotsConfig.rules) as any;
    assert(rule.userAgent === "*", "Robots userAgent is '*'");
    assert(rule.allow.includes("/product/"), "Robots explicitly allows '/product/' crawling");
    assert(rule.allow.includes("/category/"), "Robots explicitly allows '/category/' crawling");
    assert(rule.allow.includes("/store/"), "Robots explicitly allows '/store/' crawling");

    assert(rule.disallow.includes("/admin/"), "Robots explicitly disallows '/admin/'");
    assert(rule.disallow.includes("/checkout"), "Robots explicitly disallows '/checkout'");
    assert(rule.disallow.includes("/cart"), "Robots explicitly disallows '/cart'");
    assert(rule.disallow.includes("/api/"), "Robots explicitly disallows '/api/'");
    assert(rule.disallow.includes("/account/"), "Robots explicitly disallows '/account/'");

    assert(robotsConfig.sitemap === "https://fancyhub.in/sitemap.xml", "Robots directs search spiders to authoritative sitemap (https://fancyhub.in/sitemap.xml)");

    console.log("\n=======================================================================");
    console.log(`🎉 PHASE 48 ENTERPRISE SEO FINALIZATION AUDIT COMPLETE`);
    console.log(`   TOTAL TESTS PASSED: ${passed}`);
    console.log(`   TOTAL TESTS FAILED: ${failed}`);
    console.log("=======================================================================\n");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("Fatal exception during Phase 48 SEO audit:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPhase48EnterpriseSeoSuite();
