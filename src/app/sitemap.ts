import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { CATEGORIES_DATA, PRODUCTS_DATA, BRANDS_DATA, VENDORS_DATA } from "@/data/mock-catalog";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fancyhub.in";
  const sitemapMap = new Map<string, MetadataRoute.Sitemap[number]>();

  const addRoute = (route: MetadataRoute.Sitemap[number]) => {
    if (!sitemapMap.has(route.url)) {
      sitemapMap.set(route.url, route);
    }
  };

  // 1. Core Public Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/deals`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/flash-sale`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/new-arrivals`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/best-sellers`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/brands`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/vendors`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/custom-print`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/help`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];
  staticRoutes.forEach(addRoute);

  try {
    // 2. Dynamic Categories (DB + Fallback)
    const dbCategories = await prisma.category.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
    }).catch(() => []);

    const categories = dbCategories.length > 0
      ? dbCategories
      : CATEGORIES_DATA.map((c) => ({ slug: c.slug, updatedAt: new Date() }));

    categories.forEach((cat) => {
      addRoute({
        url: `${baseUrl}/category/${cat.slug}`,
        lastModified: cat.updatedAt || new Date(),
        changeFrequency: "daily",
        priority: 0.85,
      });
    });

    // 3. Dynamic Products (DB + Fallback)
    const dbProducts = await prisma.product.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }).catch(() => []);

    const products = dbProducts.length > 0
      ? dbProducts
      : PRODUCTS_DATA.filter((p) => p.status === "PUBLISHED").map((p) => ({ slug: p.slug, updatedAt: new Date() }));

    products.forEach((prod) => {
      addRoute({
        url: `${baseUrl}/product/${prod.slug}`,
        lastModified: prod.updatedAt || new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      });
    });

    // 4. Dynamic Brands (DB + Fallback)
    const dbBrands = await prisma.brand.findMany({
      select: { slug: true, updatedAt: true },
    }).catch(() => []);

    const brands = dbBrands.length > 0
      ? dbBrands
      : BRANDS_DATA.map((b) => ({ slug: b.slug, updatedAt: new Date() }));

    brands.forEach((b) => {
      addRoute({
        url: `${baseUrl}/brand/${b.slug}`,
        lastModified: b.updatedAt || new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    });

    // 5. Dynamic Collections (DB + Curated Fallback)
    const dbCollections = await prisma.collection.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
    }).catch(() => []);

    const defaultCollections = [
      { slug: "festive-banarasi-collection", updatedAt: new Date() },
      { slug: "bridal-kanjivaram-silk", updatedAt: new Date() },
      { slug: "contemporary-cotton-prints", updatedAt: new Date() },
      { slug: "handcrafted-artisan-specials", updatedAt: new Date() },
    ];

    const collections = dbCollections.length > 0 ? dbCollections : defaultCollections;
    collections.forEach((col) => {
      addRoute({
        url: `${baseUrl}/shop?collection=${col.slug}`,
        lastModified: col.updatedAt || new Date(),
        changeFrequency: "weekly",
        priority: 0.75,
      });
    });

    // 6. Dynamic Vendor Storefronts (DB + Fallback)
    const dbVendors = await prisma.vendor.findMany({
      where: { status: "APPROVED" },
      select: { slug: true, updatedAt: true },
    }).catch(() => []);

    const vendors = dbVendors.length > 0
      ? dbVendors
      : VENDORS_DATA.map((v) => ({ slug: v.slug, updatedAt: new Date() }));

    vendors.forEach((v) => {
      addRoute({
        url: `${baseUrl}/store/${v.slug}`,
        lastModified: v.updatedAt || new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      });
    });

    return Array.from(sitemapMap.values());
  } catch (error) {
    console.error("Error generating dynamic enterprise sitemap:", error);
    return Array.from(sitemapMap.values());
  }
}
