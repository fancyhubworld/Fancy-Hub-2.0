import prisma from "@/lib/prisma";
import { PageSeoConfig, DEFAULT_STORE_SEO } from "@/lib/seo-engine";

export type BlogStatus = "DRAFT" | "REVIEW" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED";

export interface BlogPostRecord {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: { name: string; avatarUrl?: string };
  category: string;
  tags: string[];
  featuredImage: string;
  readTimeMinutes: number;
  status: BlogStatus;
  publishedAt?: string;
  revisions: { version: number; content: string; editedAt: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface CmsCustomPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  seo: PageSeoConfig;
  revisions: { version: number; content: string; editedAt: string }[];
  updatedAt: string;
}

export interface RedirectRule {
  id: string;
  fromPath: string;
  toPath: string;
  statusCode: 301 | 302;
  createdAt: string;
}

// In-Memory CMS Stores
const blogPostsStore: BlogPostRecord[] = [];
const cmsPagesStore: CmsCustomPage[] = [];
const redirectRulesStore: RedirectRule[] = [
  { id: "red-1", fromPath: "/old-sarees", toPath: "/category/sarees", statusCode: 301, createdAt: new Date().toISOString() },
  { id: "red-2", fromPath: "/help-center", toPath: "/help", statusCode: 301, createdAt: new Date().toISOString() },
];

// -------------------------------------------------------------------------
// 1. BLOG & EDITORIAL SERVICE
// -------------------------------------------------------------------------

export class BlogEditorialService {
  /**
   * Creates a blog post
   */
  static createPost(params: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    authorName: string;
    category: string;
    tags: string[];
    featuredImage?: string;
    status?: BlogStatus;
  }): BlogPostRecord {
    const post: BlogPostRecord = {
      id: `BLG-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: params.title,
      slug: params.slug,
      excerpt: params.excerpt,
      content: params.content,
      author: { name: params.authorName },
      category: params.category,
      tags: params.tags,
      featuredImage: params.featuredImage || DEFAULT_STORE_SEO.ogImage || "",
      readTimeMinutes: Math.max(1, Math.ceil(params.content.split(" ").length / 200)),
      status: params.status || "DRAFT",
      revisions: [{ version: 1, content: params.content, editedAt: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    blogPostsStore.push(post);
    return post;
  }

  /**
   * Updates blog content and appends to revision history
   */
  static updateContent(postId: string, newContent: string): boolean {
    const post = blogPostsStore.find((p) => p.id === postId);
    if (!post) return false;

    post.content = newContent;
    post.revisions.push({
      version: post.revisions.length + 1,
      content: newContent,
      editedAt: new Date().toISOString(),
    });
    post.updatedAt = new Date().toISOString();
    return true;
  }

  /**
   * Restores previous revision
   */
  static restoreRevision(postId: string, version: number): boolean {
    const post = blogPostsStore.find((p) => p.id === postId);
    if (!post) return false;

    const targetRev = post.revisions.find((r) => r.version === version);
    if (!targetRev) return false;

    post.content = targetRev.content;
    post.updatedAt = new Date().toISOString();
    return true;
  }

  /**
   * Publishes a post
   */
  static publishPost(postId: string): boolean {
    const post = blogPostsStore.find((p) => p.id === postId);
    if (!post) return false;

    post.status = "PUBLISHED";
    post.publishedAt = new Date().toISOString();
    post.updatedAt = new Date().toISOString();
    return true;
  }

  /**
   * Retrieves published blog posts
   */
  static getPublishedPosts(): BlogPostRecord[] {
    return blogPostsStore.filter((p) => p.status === "PUBLISHED");
  }
}

// -------------------------------------------------------------------------
// 2. DYNAMIC SEO & JSON-LD GENERATOR
// -------------------------------------------------------------------------

export class DynamicSeoGenerator {
  /**
   * Generates dynamic SEO metadata for product page
   */
  static generateProductSeo(product: any): PageSeoConfig {
    const title = `${product.title} | Buy Authentic Handloom on FancyHub.in`;
    const desc = `${product.shortDescription || product.title}. 100% pure artisan craft, verified Silk Mark, ₹${product.price}. Free express delivery across India.`;
    const canonical = `https://fancyhub.in/product/${product.slug}`;

    return {
      seoTitle: title,
      metaDescription: desc,
      canonicalUrl: canonical,
      ogTitle: title,
      ogDescription: desc,
      ogImage: product.images?.[0]?.url || DEFAULT_STORE_SEO.ogImage,
      robots: "index,follow",
      jsonLdSchema: {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description: product.description,
        sku: product.sku || product.id,
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "INR",
          availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.ratings || 4.8,
          reviewCount: product.reviewCount || 1,
        },
      },
    };
  }

  /**
   * Generates FAQ JSON-LD schema
   */
  static generateFaqSchema(faqs: { question: string; answer: string }[]): Record<string, any> {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
    };
  }
}

// -------------------------------------------------------------------------
// 3. DYNAMIC XML SITEMAP GENERATOR
// -------------------------------------------------------------------------

export class SitemapGenerator {
  /**
   * Generates standard XML sitemap from database entities
   */
  static async generateXmlSitemap(): Promise<string> {
    const products = await prisma.product.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    });

    const categories = await prisma.category.findMany({
      select: { slug: true, updatedAt: true },
    });

    const brands = await prisma.brand.findMany({
      select: { slug: true },
    });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static Base URLs
    const baseUrls = ["", "/search", "/deals", "/offers", "/coupons", "/help"];
    for (const path of baseUrls) {
      xml += `  <url>\n    <loc>https://fancyhub.in${path}</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
    }

    // Dynamic Product URLs
    for (const p of products) {
      xml += `  <url>\n    <loc>https://fancyhub.in/product/${p.slug}</loc>\n    <lastmod>${new Date(p.updatedAt).toISOString().split("T")[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    }

    // Dynamic Category URLs
    for (const c of categories) {
      xml += `  <url>\n    <loc>https://fancyhub.in/category/${c.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }

    // Dynamic Brand URLs
    for (const b of brands) {
      xml += `  <url>\n    <loc>https://fancyhub.in/brand/${b.slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    }

    xml += `</urlset>`;
    return xml;
  }
}

// -------------------------------------------------------------------------
// 4. 301 REDIRECT MANAGER & DEAD LINK AUDITOR
// -------------------------------------------------------------------------

export class RedirectManager {
  /**
   * Resolves a URL path against 301 rules
   */
  static resolveRedirect(path: string): { redirectUrl?: string; statusCode?: number } {
    const match = redirectRulesStore.find((r) => r.fromPath === path);
    if (match) {
      return { redirectUrl: match.toPath, statusCode: match.statusCode };
    }
    return {};
  }

  /**
   * Adds a new 301 redirect rule with circular loop protection
   */
  static addRedirectRule(fromPath: string, toPath: string): { success: boolean; error?: string } {
    if (fromPath === toPath) {
      return { success: false, error: "Circular redirect loop: fromPath cannot match toPath" };
    }

    redirectRulesStore.push({
      id: `RED-${Date.now()}`,
      fromPath,
      toPath,
      statusCode: 301,
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  }
}
