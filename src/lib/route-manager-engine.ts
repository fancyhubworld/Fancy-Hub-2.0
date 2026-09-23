import prisma from "./prisma";

export interface ManagedRoute {
  id: string;
  url: string;
  entityType: "PAGE" | "CATEGORY" | "PRODUCT" | "VENDOR" | "BRAND" | "SYSTEM";
  entityName: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED" | "DRAFT";
  seoTitle?: string | null;
  seoDescription?: string | null;
  hasRedirect: boolean;
  targetRedirectUrl?: string | null;
  lastUpdated: string;
}

export interface RouteValidationIssue {
  url: string;
  entityType: string;
  entityName: string;
  issueType: "HTTP_404" | "DUPLICATE_SLUG" | "MISSING_PAGE" | "INACTIVE_CATEGORY" | "DELETED_PRODUCT" | "INVALID_TARGET" | "CIRCULAR_REDIRECT";
  message: string;
  severity: "CRITICAL" | "WARNING";
}

export interface RouteAuditReport {
  isValid: boolean;
  totalRoutesScanned: number;
  activeRoutesCount: number;
  issuesCount: number;
  criticalErrors: number;
  warnings: number;
  issues: RouteValidationIssue[];
}

/**
 * Scans the entire system database (Pages, Categories, Products, Vendors, Brands, Redirects)
 * and generates a comprehensive route health audit report.
 */
export async function performSystemRouteAudit(): Promise<RouteAuditReport> {
  const issues: RouteValidationIssue[] = [];
  let totalRoutes = 0;

  // 1. Fetch all database entities
  const [categories, products, pages, vendors, redirects] = await Promise.all([
    prisma.category.findMany({ select: { id: true, name: true, slug: true, fullPath: true, status: true, isActive: true } }),
    prisma.product.findMany({ select: { id: true, title: true, slug: true, status: true } }),
    prisma.pageConfig.findMany({ select: { id: true, title: true, slug: true, status: true } }),
    prisma.vendor.findMany({ select: { id: true, storeName: true, slug: true, status: true } }),
    prisma.categoryRedirect.findMany({ select: { sourcePath: true, destinationPath: true } }),
  ]);

  const canonicalUrlOccurrences = new Map<string, string[]>();

  // 2. Index Categories
  for (const cat of categories) {
    totalRoutes++;
    const canonicalUrl = `/category/${cat.fullPath}`;
    
    // Duplicate URL check
    const existing = canonicalUrlOccurrences.get(canonicalUrl) || [];
    existing.push(`Category: ${cat.name}`);
    canonicalUrlOccurrences.set(canonicalUrl, existing);

    // Inactive category check
    if (cat.status === "INACTIVE" || !cat.isActive) {
      issues.push({
        url: canonicalUrl,
        entityType: "CATEGORY",
        entityName: cat.name,
        issueType: "INACTIVE_CATEGORY",
        message: `Category '${cat.name}' (${canonicalUrl}) is currently marked INACTIVE.`,
        severity: "WARNING",
      });
    }
  }

  // 3. Index Products
  for (const prod of products) {
    totalRoutes++;
    const canonicalUrl = `/product/${prod.slug}`;

    const existing = canonicalUrlOccurrences.get(canonicalUrl) || [];
    existing.push(`Product: ${prod.title}`);
    canonicalUrlOccurrences.set(canonicalUrl, existing);

    if (prod.status === "INACTIVE" || prod.status === "ARCHIVED") {
      issues.push({
        url: canonicalUrl,
        entityType: "PRODUCT",
        entityName: prod.title,
        issueType: "DELETED_PRODUCT",
        message: `Product '${prod.title}' (${canonicalUrl}) is not ACTIVE (${prod.status}).`,
        severity: "WARNING",
      });
    }
  }

  // 4. Index Pages
  for (const page of pages) {
    totalRoutes++;
    const canonicalUrl = `/p/${page.slug}`;

    const existing = canonicalUrlOccurrences.get(canonicalUrl) || [];
    existing.push(`Page: ${page.title}`);
    canonicalUrlOccurrences.set(canonicalUrl, existing);

    if (page.status === "DRAFT") {
      issues.push({
        url: canonicalUrl,
        entityType: "PAGE",
        entityName: page.title,
        issueType: "MISSING_PAGE",
        message: `Dynamic CMS Page '${page.title}' (${canonicalUrl}) is unpublished DRAFT.`,
        severity: "WARNING",
      });
    }
  }

  // 5. Index Vendors
  for (const v of vendors) {
    totalRoutes++;
    const canonicalUrl = `/vendor/${v.slug}`;

    const existing = canonicalUrlOccurrences.get(canonicalUrl) || [];
    existing.push(`Vendor: ${v.storeName}`);
    canonicalUrlOccurrences.set(canonicalUrl, existing);
  }

  // 6. Check for Duplicate Canonical URLs
  for (const [url, entities] of Array.from(canonicalUrlOccurrences.entries())) {
    if (entities.length > 1) {
      issues.push({
        url,
        entityType: "SYSTEM",
        entityName: url,
        issueType: "DUPLICATE_SLUG",
        message: `Exact route collision detected: '${url}' is claimed by ${entities.join(", ")}.`,
        severity: "CRITICAL",
      });
    }
  }

  // 7. Check for Circular Redirects
  const redirectMap = new Map(redirects.map((r) => [r.sourcePath, r.destinationPath]));
  for (const [source, dest] of Array.from(redirectMap.entries())) {
    if (source === dest) {
      issues.push({
        url: `/category/${source}`,
        entityType: "SYSTEM",
        entityName: source,
        issueType: "CIRCULAR_REDIRECT",
        message: `Direct self-referencing circular redirect loop: ${source} -> ${dest}.`,
        severity: "CRITICAL",
      });
    } else if (redirectMap.get(dest) === source) {
      issues.push({
        url: `/category/${source}`,
        entityType: "SYSTEM",
        entityName: source,
        issueType: "CIRCULAR_REDIRECT",
        message: `Circular redirect loop detected: ${source} <-> ${dest}.`,
        severity: "CRITICAL",
      });
    }
  }

  const criticalErrors = issues.filter((i) => i.severity === "CRITICAL").length;
  const warnings = issues.filter((i) => i.severity === "WARNING").length;

  return {
    isValid: criticalErrors === 0,
    totalRoutesScanned: totalRoutes,
    activeRoutesCount: totalRoutes - warnings,
    issuesCount: issues.length,
    criticalErrors,
    warnings,
    issues,
  };
}

/**
 * Tests an individual route target and simulates edge HTTP resolution
 */
export async function testRouteTarget(targetUrl: string): Promise<{
  statusCode: 200 | 301 | 302 | 404;
  resolvedUrl: string;
  isAvailable: boolean;
  message: string;
}> {
  const cleanUrl = targetUrl.trim();

  // 1. Check if blank
  if (!cleanUrl || cleanUrl === "#") {
    return {
      statusCode: 404,
      resolvedUrl: cleanUrl,
      isAvailable: false,
      message: "Target URL is blank or empty hash.",
    };
  }

  // 2. Check Static known paths
  const staticPaths = [
    "/", "/shop", "/categories", "/deals", "/offers", "/flash-sale",
    "/new-arrivals", "/best-sellers", "/brands", "/vendors", "/cart",
    "/checkout", "/wishlist", "/wallet", "/coupons", "/help"
  ];
  if (staticPaths.includes(cleanUrl)) {
    return {
      statusCode: 200,
      resolvedUrl: cleanUrl,
      isAvailable: true,
      message: "Static platform route is live and verified.",
    };
  }

  // 3. Check Category dynamic routes
  if (cleanUrl.startsWith("/category/")) {
    const fullPath = cleanUrl.replace("/category/", "");
    const cat = await prisma.category.findUnique({ where: { fullPath } });
    if (cat) {
      return {
        statusCode: 200,
        resolvedUrl: cleanUrl,
        isAvailable: cat.status === "ACTIVE",
        message: cat.status === "ACTIVE" ? "Active category listing verified." : "Category exists but is INACTIVE.",
      };
    }

    // Check Redirects
    const redirect = await prisma.categoryRedirect.findUnique({ where: { sourcePath: fullPath } });
    if (redirect) {
      return {
        statusCode: 301,
        resolvedUrl: `/category/${redirect.destinationPath}`,
        isAvailable: true,
        message: `Permanent 301 redirect to /category/${redirect.destinationPath}.`,
      };
    }
  }

  // 4. Check Product dynamic routes
  if (cleanUrl.startsWith("/product/")) {
    const slug = cleanUrl.replace("/product/", "");
    const prod = await prisma.product.findUnique({ where: { slug } });
    if (prod) {
      return {
        statusCode: 200,
        resolvedUrl: cleanUrl,
        isAvailable: prod.status === "ACTIVE",
        message: prod.status === "ACTIVE" ? "Active product details verified." : "Product exists but is INACTIVE.",
      };
    }
  }

  // 5. Check Custom Page dynamic routes
  if (cleanUrl.startsWith("/p/")) {
    const slug = cleanUrl.replace("/p/", "");
    const page = await prisma.pageConfig.findUnique({ where: { slug } });
    if (page) {
      return {
        statusCode: 200,
        resolvedUrl: cleanUrl,
        isAvailable: page.status === "PUBLISHED",
        message: page.status === "PUBLISHED" ? "Active published CMS page verified." : "Page exists in DRAFT state.",
      };
    }
  }

  return {
    statusCode: 404,
    resolvedUrl: cleanUrl,
    isAvailable: false,
    message: `Route '${cleanUrl}' does not match any registered entity or redirect.`,
  };
}
