import prisma from "./prisma";

export interface CategoryTreeNode {
  id: string;
  name: string;
  slug: string;
  fullPath: string;
  description?: string | null;
  icon?: string | null;
  image?: string | null;
  bannerImage?: string | null;
  mobileBanner?: string | null;
  parentId?: string | null;
  level: number;
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  isActive: boolean;
  isFeatured: boolean;
  showInHeader: boolean;
  showOnHomepage: boolean;
  showInMobile: boolean;
  showInFooter: boolean;
  showInSearch: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  canonicalUrl?: string | null;
  commissionRate?: number | null;
  displayMode: string;
  productCount: number;
  children: CategoryTreeNode[];
}

export interface BreadcrumbStep {
  label: string;
  href: string;
}

// In-Memory Fast Cache with Atomic Invalidation
let _categoryTreeCache: CategoryTreeNode[] | null = null;
let _categoryCacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute background revalidation

export function invalidateCategoryCache() {
  _categoryTreeCache = null;
  _categoryCacheTimestamp = 0;
}

/**
 * Standard SEO slug generation
 */
export function slugifyCategory(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/'/g, "")
    .replace(/&/g, "-and-")
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Computes full path dynamically given category slug and parent
 */
export function computeFullPath(
  slug: string,
  parentId: string | null | undefined,
  categoryMap: Map<string, { id: string; slug: string; parentId?: string | null }>
): string {
  const parts: string[] = [slug];
  let currParentId = parentId;
  const visited = new Set<string>();

  while (currParentId && categoryMap.has(currParentId)) {
    if (visited.has(currParentId)) break; // Cycle safeguard
    visited.add(currParentId);
    const parent = categoryMap.get(currParentId)!;
    parts.unshift(parent.slug);
    currParentId = parent.parentId;
  }

  return parts.join("/");
}

/**
 * Computes depth level (0 = root, 1 = sub, 2 = grandchild, etc.)
 */
export function computeLevel(
  parentId: string | null | undefined,
  categoryMap: Map<string, { id: string; parentId?: string | null }>
): number {
  let level = 0;
  let currParentId = parentId;
  const visited = new Set<string>();

  while (currParentId && categoryMap.has(currParentId)) {
    if (visited.has(currParentId)) break;
    visited.add(currParentId);
    level++;
    const parent = categoryMap.get(currParentId)!;
    currParentId = parent.parentId;
  }

  return level;
}

/**
 * Detects if assigning `newParentId` to `categoryId` would create a circular dependency
 */
export function detectCircularDependency(
  categoryId: string,
  newParentId: string | null | undefined,
  allCategories: Array<{ id: string; parentId?: string | null }> | Map<string, { id?: string; parentId?: string | null }>
): boolean {
  if (!newParentId) return false;
  if (categoryId === newParentId) return true;

  const categoryMap: Map<string, { id?: string; parentId?: string | null }> = Array.isArray(allCategories)
    ? new Map(allCategories.map((c) => [c.id, c]))
    : allCategories;

  let curr: string | null | undefined = newParentId;
  const visited = new Set<string>();

  while (curr && categoryMap.has(curr)) {
    if (curr === categoryId) return true; // Reached the target category in parent chain!
    if (visited.has(curr)) return true; // Already a cycle elsewhere
    visited.add(curr);
    const parentNode = categoryMap.get(curr);
    curr = parentNode?.parentId || "";
  }

  return false;
}

/**
 * Collects all descendant IDs (children, grandchildren, etc.) of a category
 */
export function getDescendantCategoryIds(
  categoryId: string,
  allCategories: Array<{ id: string; parentId?: string | null }>
): string[] {
  const descendantIds: string[] = [categoryId];
  const childrenMap = new Map<string, string[]>();

  for (const cat of allCategories) {
    if (cat.parentId) {
      if (!childrenMap.has(cat.parentId)) {
        childrenMap.set(cat.parentId, []);
      }
      childrenMap.get(cat.parentId)!.push(cat.id);
    }
  }

  const queue = [categoryId];
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const directChildren = childrenMap.get(currentId) || [];
    for (const childId of directChildren) {
      descendantIds.push(childId);
      queue.push(childId);
    }
  }

  return descendantIds;
}

/**
 * Converts a flat array of categories into a deeply nested tree
 */
export function buildCategoryTree(
  flatCategories: any[],
  productCountMap: Map<string, number> = new Map()
): CategoryTreeNode[] {
  const nodeMap = new Map<string, CategoryTreeNode>();
  const rootNodes: CategoryTreeNode[] = [];

  // 1. Initialize all nodes
  for (const cat of flatCategories) {
    const count = productCountMap.get(cat.id) || cat._count?.products || 0;
    nodeMap.set(cat.id, {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      fullPath: cat.fullPath || cat.slug,
      description: cat.description,
      icon: cat.icon,
      image: cat.image,
      bannerImage: cat.bannerImage,
      mobileBanner: cat.mobileBanner,
      parentId: cat.parentId,
      level: cat.level ?? 0,
      sortOrder: cat.sortOrder ?? 0,
      status: (cat.status as any) || (cat.isActive ? "ACTIVE" : "INACTIVE"),
      isActive: cat.isActive ?? (cat.status === "ACTIVE"),
      isFeatured: cat.isFeatured ?? false,
      showInHeader: cat.showInHeader ?? true,
      showOnHomepage: cat.showOnHomepage ?? true,
      showInMobile: cat.showInMobile ?? true,
      showInFooter: cat.showInFooter ?? true,
      showInSearch: cat.showInSearch ?? true,
      seoTitle: cat.seoTitle,
      seoDescription: cat.seoDescription,
      seoKeywords: cat.seoKeywords,
      canonicalUrl: cat.canonicalUrl,
      commissionRate: cat.commissionRate,
      displayMode: cat.displayMode || "DEFAULT",
      productCount: count,
      children: [],
    });
  }

  // 2. Attach children to parents
  for (const cat of flatCategories) {
    const node = nodeMap.get(cat.id)!;
    if (cat.parentId && nodeMap.has(cat.parentId)) {
      const parent = nodeMap.get(cat.parentId)!;
      parent.children.push(node);
    } else {
      rootNodes.push(node);
    }
  }

  // 3. Recursive sort function by sortOrder ASC, then name ASC
  function sortNodes(nodes: CategoryTreeNode[]) {
    nodes.sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }
      return a.name.localeCompare(b.name);
    });
    for (const n of nodes) {
      if (n.children.length > 0) {
        sortNodes(n.children);
      }
    }
  }

  sortNodes(rootNodes);
  return rootNodes;
}

export interface BreadcrumbCategoryInfo {
  id: string;
  name: string;
  fullPath: string;
  parentId?: string | null;
}

/**
 * Builds breadcrumbs chain from root to current category
 */
export function buildCategoryBreadcrumbs(
  categoryId: string,
  categoryMap: Map<string, BreadcrumbCategoryInfo>
): BreadcrumbStep[] {
  const steps: BreadcrumbStep[] = [{ label: "Home", href: "/" }, { label: "Categories", href: "/categories" }];
  const chain: Array<{ label: string; href: string }> = [];

  let currId: string | null | undefined = categoryId;
  const visited = new Set<string>();

  while (currId && categoryMap.has(currId)) {
    if (visited.has(currId)) break;
    visited.add(currId);
    const catItem: BreadcrumbCategoryInfo | undefined = categoryMap.get(currId);
    if (catItem) {
      chain.unshift({
        label: catItem.name,
        href: `/category/${catItem.fullPath}`,
      });
      currId = catItem.parentId;
    } else {
      break;
    }
  }

  return [...steps, ...chain];
}

/**
 * Fetches full category tree from database (with in-memory cache)
 */
export async function getDatabaseCategoryTree(forceRefresh = false): Promise<CategoryTreeNode[]> {
  const now = Date.now();
  if (!forceRefresh && _categoryTreeCache && now - _categoryCacheTimestamp < CACHE_TTL_MS) {
    return _categoryTreeCache;
  }

  try {
    const categories = await prisma.category.findMany({
      where: {
        status: "ACTIVE",
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    const tree = buildCategoryTree(categories);
    _categoryTreeCache = tree;
    _categoryCacheTimestamp = now;
    return tree;
  } catch (error) {
    console.error("Error fetching category tree from database:", error);
    return [];
  }
}

export interface CategorySafetyCheckResult {
  canDeleteSafely: boolean;
  productsCount: number;
  subcategoriesCount: number;
  navigationCount: number;
  message: string;
}

/**
 * Checks if a category is being used by products, subcategories, or menus before deletion
 */
export async function checkCategoryDeletionSafety(categoryId: string): Promise<CategorySafetyCheckResult> {
  const [productsCount, subcategoriesCount, navCount] = await Promise.all([
    prisma.product.count({ where: { categoryId } }),
    prisma.category.count({ where: { parentId: categoryId } }),
    prisma.navigationItem.count({ where: { url: { contains: categoryId } } }).catch(() => 0),
  ]);

  const hasDependencies = productsCount > 0 || subcategoriesCount > 0 || navCount > 0;

  return {
    canDeleteSafely: !hasDependencies,
    productsCount,
    subcategoriesCount,
    navigationCount: navCount,
    message: hasDependencies
      ? `This category is currently being used by ${productsCount} product(s), ${subcategoriesCount} subcategory(s), and ${navCount} menu link(s). Please reassign them before deletion.`
      : "Category has no active dependencies and can be safely deleted.",
  };
}

/**
 * Safely moves all products from a source category to a target category
 */
export async function reassignCategoryProducts(sourceCategoryId: string, targetCategoryId: string): Promise<number> {
  const result = await prisma.product.updateMany({
    where: { categoryId: sourceCategoryId },
    data: { categoryId: targetCategoryId },
  });
  invalidateCategoryCache();
  return result.count;
}
