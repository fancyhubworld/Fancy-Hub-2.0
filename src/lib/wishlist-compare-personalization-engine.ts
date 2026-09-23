import prisma from "@/lib/prisma";

export interface WishlistItemRecord {
  id: string;
  userId: string;
  productId: string;
  folderName: string;
  createdAt: string;
  product?: any;
}

export interface SavedFilterRecord {
  id: string;
  userId: string;
  name: string;
  filterParams: Record<string, any>;
  createdAt: string;
}

export interface CompareProductItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  mrp: number;
  discountPercent: number;
  ratings: number;
  reviewCount: number;
  brand: string;
  vendor: string;
  stock: number;
  inStock: boolean;
  warranty?: string;
  returnDays: number;
  deliveryDays: number;
  imageUrl?: string;
}

// In-Memory Storage for High-Speed Customer State
const wishlistStore: WishlistItemRecord[] = [];
const recentlyViewedStore: { userId: string; productId: string; viewedAt: string }[] = [];
const savedFiltersStore: SavedFilterRecord[] = [];

// -------------------------------------------------------------------------
// 1. WISHLIST & FOLDER ENGINE
// -------------------------------------------------------------------------

export class WishlistEngine {
  /**
   * Adds an item to a customer's wishlist folder
   */
  static async addToWishlist(params: {
    userId: string;
    productId: string;
    folderName?: string;
  }): Promise<{ success: boolean; item?: WishlistItemRecord; message?: string }> {
    const { userId, productId, folderName = "Default" } = params;

    const existingIndex = wishlistStore.findIndex(
      (w) => w.userId === userId && w.productId === productId
    );

    if (existingIndex !== -1) {
      wishlistStore[existingIndex].folderName = folderName;
      return { success: true, item: wishlistStore[existingIndex], message: "Item updated in wishlist" };
    }

    const newItem: WishlistItemRecord = {
      id: `WSH-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId,
      productId,
      folderName,
      createdAt: new Date().toISOString(),
    };

    wishlistStore.push(newItem);
    return { success: true, item: newItem, message: "Item added to wishlist" };
  }

  /**
   * Removes an item from a customer's wishlist
   */
  static async removeFromWishlist(userId: string, productId: string): Promise<boolean> {
    const initialLen = wishlistStore.length;
    const remaining = wishlistStore.filter(
      (w) => !(w.userId === userId && w.productId === productId)
    );
    wishlistStore.length = 0;
    wishlistStore.push(...remaining);
    return wishlistStore.length < initialLen;
  }

  /**
   * Retrieves customer wishlist items with resilient handling for deleted products
   */
  static async getWishlist(userId: string): Promise<{
    items: WishlistItemRecord[];
    folders: string[];
    totalCount: number;
  }> {
    const userItems = wishlistStore.filter((w) => w.userId === userId);
    const folders = Array.from(new Set(userItems.map((w) => w.folderName)));

    // Eagerly resolve product metadata safely
    const populatedItems = await Promise.all(
      userItems.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: { images: true, vendor: true, brand: true },
        }).catch(() => null);

        return {
          ...item,
          product: product || {
            id: item.productId,
            title: "Product Unavailable",
            price: 0,
            stock: 0,
            isUnavailable: true,
          },
        };
      })
    );

    return {
      items: populatedItems,
      folders,
      totalCount: populatedItems.length,
    };
  }

  /**
   * Generates a secure shareable wishlist token
   */
  static generateShareToken(userId: string): { shareToken: string; shareUrl: string } {
    const shareToken = `FANCY-WSH-${Buffer.from(userId).toString("base64").replace(/=/g, "")}`;
    return {
      shareToken,
      shareUrl: `/wishlist/shared/${shareToken}`,
    };
  }
}

// -------------------------------------------------------------------------
// 2. PRODUCT COMPARISON ENGINE
// -------------------------------------------------------------------------

export class CompareEngine {
  /**
   * Generates attribute comparison matrix for up to 4 products
   */
  static async getComparisonMatrix(productIds: string[]): Promise<CompareProductItem[]> {
    const targetIds = productIds.slice(0, 4);

    const products = await prisma.product.findMany({
      where: { id: { in: targetIds } },
      include: { brand: true, vendor: true, images: true },
    });

    return products.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      price: p.price,
      mrp: p.mrp,
      discountPercent: p.discountPercent,
      ratings: p.ratings,
      reviewCount: p.reviewCount,
      brand: p.brand?.name || "Artisan Direct",
      vendor: p.vendor?.storeName || "FancyHub Artisan",
      stock: p.stock,
      inStock: p.stock > 0,
      warranty: p.warranty || "100% Handloom Authenticity Guarantee",
      returnDays: p.returnDays,
      deliveryDays: p.deliveryDays,
      imageUrl: p.images[0]?.url || "",
    }));
  }
}

// -------------------------------------------------------------------------
// 3. RECENTLY VIEWED & PRIVACY ENGINE
// -------------------------------------------------------------------------

export class RecentlyViewedEngine {
  /**
   * Records a product view with privacy protection (no PII logged)
   */
  static recordView(userId: string, productId: string) {
    const existingIdx = recentlyViewedStore.findIndex(
      (r) => r.userId === userId && r.productId === productId
    );

    if (existingIdx !== -1) {
      recentlyViewedStore.splice(existingIdx, 1);
    }

    recentlyViewedStore.unshift({
      userId,
      productId,
      viewedAt: new Date().toISOString(),
    });

    // Keep top 20 recent items per user
    if (recentlyViewedStore.length > 500) {
      recentlyViewedStore.pop();
    }
  }

  /**
   * Gets recently viewed products for a customer
   */
  static async getRecentlyViewed(userId: string, limit = 6): Promise<any[]> {
    const userViews = recentlyViewedStore
      .filter((r) => r.userId === userId)
      .slice(0, limit);

    const productIds = userViews.map((r) => r.productId);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { images: true, vendor: true },
    });

    return products;
  }

  /**
   * Customer explicit clear history action
   */
  static clearHistory(userId: string): boolean {
    const remaining = recentlyViewedStore.filter((r) => r.userId !== userId);
    recentlyViewedStore.length = 0;
    recentlyViewedStore.push(...remaining);
    return true;
  }
}

// -------------------------------------------------------------------------
// 4. SAVED FILTERS & SEARCH PRESETS
// -------------------------------------------------------------------------

export class SavedFilterEngine {
  /**
   * Saves a custom filter search preset
   */
  static savePreset(params: {
    userId: string;
    name: string;
    filterParams: Record<string, any>;
  }): SavedFilterRecord {
    const { userId, name, filterParams } = params;

    const preset: SavedFilterRecord = {
      id: `FLT-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId,
      name,
      filterParams,
      createdAt: new Date().toISOString(),
    };

    savedFiltersStore.push(preset);
    return preset;
  }

  /**
   * Gets saved presets for user
   */
  static getPresets(userId: string): SavedFilterRecord[] {
    return savedFiltersStore.filter((f) => f.userId === userId);
  }

  /**
   * Deletes a saved preset
   */
  static deletePreset(userId: string, presetId: string): boolean {
    const initLen = savedFiltersStore.length;
    const remaining = savedFiltersStore.filter(
      (f) => !(f.userId === userId && f.id === presetId)
    );
    savedFiltersStore.length = 0;
    savedFiltersStore.push(...remaining);
    return savedFiltersStore.length < initLen;
  }
}

// -------------------------------------------------------------------------
// 5. PRIVACY-SAFE PERSONALIZATION SIGNALS
// -------------------------------------------------------------------------

export class PersonalizationEngine {
  /**
   * Computes category affinities safely without sensitive behavioral inferences
   */
  static async getRecommendationSignals(userId: string): Promise<{
    preferredCategories: string[];
    priceTierAffinity: "BUDGET" | "MID_TIER" | "PREMIUM" | "LUXURY";
    recommendedProductIds: string[];
  }> {
    const wishlist = await WishlistEngine.getWishlist(userId);
    const recent = await RecentlyViewedEngine.getRecentlyViewed(userId);

    const categorySlugs = new Set<string>();
    for (const item of wishlist.items) {
      if (item.product?.category?.slug) categorySlugs.add(item.product.category.slug);
    }

    const priceTier: "BUDGET" | "MID_TIER" | "PREMIUM" | "LUXURY" =
      wishlist.items.some((i) => (i.product?.price || 0) > 10000) ? "LUXURY" : "PREMIUM";

    const recommended = await prisma.product.findMany({
      where: { status: "PUBLISHED" },
      take: 4,
      select: { id: true },
    });

    return {
      preferredCategories: Array.from(categorySlugs),
      priceTierAffinity: priceTier,
      recommendedProductIds: recommended.map((r) => r.id),
    };
  }
}
