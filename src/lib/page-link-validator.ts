import { PrismaClient } from "@prisma/client";
import { NavigationMenuItem } from "./navigation-builder-types";

export interface LinkValidationIssue {
  itemId?: string;
  itemLabel?: string;
  target: string;
  type: "MISSING_PAGE" | "INACTIVE_CATEGORY" | "DELETED_PRODUCT" | "INVALID_URL" | "HTTP_404";
  message: string;
  severity: "ERROR" | "WARNING";
}

export interface LinkValidationReport {
  isValid: boolean;
  totalLinksChecked: number;
  brokenCount: number;
  warningCount: number;
  issues: LinkValidationIssue[];
}

/**
 * Validates a list of navigation menu items or section URLs against live database records
 */
export async function validateNavigationLinks(
  prisma: PrismaClient,
  items: NavigationMenuItem[]
): Promise<LinkValidationReport> {
  const issues: LinkValidationIssue[] = [];
  let checked = 0;

  // Flatten nested items
  const allItems: NavigationMenuItem[] = [];
  function collect(list: NavigationMenuItem[]) {
    for (const item of list) {
      allItems.push(item);
      if (item.children && item.children.length > 0) {
        collect(item.children);
      }
    }
  }
  collect(items);

  // Pre-fetch active DB references for fast validation
  const categories = await prisma.category.findMany({ select: { slug: true, isActive: true } });
  const categoryMap = new Map(categories.map((c) => [c.slug, c.isActive]));

  const products = await prisma.product.findMany({ select: { slug: true, status: true } });
  const productMap = new Map(products.map((p) => [p.slug, p.status]));

  const pages = await prisma.pageConfig.findMany({ select: { slug: true, status: true } });
  const pageMap = new Map(pages.map((p) => [p.slug, p.status]));

  for (const item of allItems) {
    checked++;
    const target = item.target?.trim() || "";

    // 1. Blank link check
    if (!target || target === "#" || target === "") {
      issues.push({
        itemId: item.id,
        itemLabel: item.label,
        target,
        type: "INVALID_URL",
        message: `Navigation item '${item.label}' has a blank or empty target URL.`,
        severity: "ERROR",
      });
      continue;
    }

    // 2. External URL check
    if (target.startsWith("http://") || target.startsWith("https://")) {
      try {
        new URL(target);
      } catch {
        issues.push({
          itemId: item.id,
          itemLabel: item.label,
          target,
          type: "INVALID_URL",
          message: `External URL '${target}' is not a valid URL format.`,
          severity: "ERROR",
        });
      }
      continue;
    }

    // 3. Category path validation
    if (target.startsWith("/category/")) {
      const slug = target.replace("/category/", "").split("/")[0];
      if (!categoryMap.has(slug)) {
        issues.push({
          itemId: item.id,
          itemLabel: item.label,
          target,
          type: "HTTP_404",
          message: `Category slug '/category/${slug}' does not exist in catalog database.`,
          severity: "ERROR",
        });
      } else if (categoryMap.get(slug) === false) {
        issues.push({
          itemId: item.id,
          itemLabel: item.label,
          target,
          type: "INACTIVE_CATEGORY",
          message: `Category '/category/${slug}' is currently disabled/inactive.`,
          severity: "WARNING",
        });
      }
    }

    // 4. Product path validation
    if (target.startsWith("/product/")) {
      const slug = target.replace("/product/", "").split("/")[0];
      if (!productMap.has(slug)) {
        issues.push({
          itemId: item.id,
          itemLabel: item.label,
          target,
          type: "DELETED_PRODUCT",
          message: `Product slug '/product/${slug}' was deleted or does not exist.`,
          severity: "ERROR",
        });
      } else if (productMap.get(slug) !== "PUBLISHED") {
        issues.push({
          itemId: item.id,
          itemLabel: item.label,
          target,
          type: "DELETED_PRODUCT",
          message: `Product '/product/${slug}' status is '${productMap.get(slug)}' (not published).`,
          severity: "WARNING",
        });
      }
    }

    // 5. Custom CMS page path validation
    if (target.startsWith("/p/")) {
      const slug = target.replace("/p/", "").split("/")[0];
      if (!pageMap.has(slug)) {
        issues.push({
          itemId: item.id,
          itemLabel: item.label,
          target,
          type: "MISSING_PAGE",
          message: `CMS Page '/p/${slug}' is missing or not yet created in Page Builder.`,
          severity: "ERROR",
        });
      }
    }
  }

  const brokenCount = issues.filter((i) => i.severity === "ERROR").length;
  const warningCount = issues.filter((i) => i.severity === "WARNING").length;

  return {
    isValid: brokenCount === 0,
    totalLinksChecked: checked,
    brokenCount,
    warningCount,
    issues,
  };
}
