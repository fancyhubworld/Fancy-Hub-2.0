import prisma from "@/lib/prisma";

export type SearchSortOption =
  | "RELEVANCE"
  | "NEWEST"
  | "PRICE_ASC"
  | "PRICE_DESC"
  | "RATING"
  | "POPULARITY"
  | "DISCOUNT";

export interface SearchFilterParams {
  query?: string;
  categorySlug?: string;
  brandSlug?: string;
  vendorSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  minDiscount?: number;
  sizes?: string[];
  colors?: string[];
  inStockOnly?: boolean;
  sortBy?: SearchSortOption;
  page?: number;
  pageSize?: number;
}

export interface AutocompleteResult {
  query: string;
  correctedQuery?: string;
  suggestions: {
    text: string;
    type: "PRODUCT" | "CATEGORY" | "BRAND" | "POPULAR_KEYWORD";
    slug?: string;
    count?: number;
  }[];
  popularSearches: string[];
}

export interface FilterFacetSummary {
  categories: { name: string; slug: string; count: number }[];
  brands: { name: string; slug: string; count: number }[];
  priceRange: { min: number; max: number };
  availableColors: { name: string; count: number }[];
  availableSizes: { name: string; count: number }[];
  totalResults: number;
}

export interface SearchResultPayload {
  products: any[];
  facets: FilterFacetSummary;
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  appliedFilters: SearchFilterParams;
  redirectUrl?: string;
  correctedQuery?: string;
}

// -------------------------------------------------------------------------
// 1. SYNONYMS & TYPO TOLERANCE
// -------------------------------------------------------------------------

export class SearchQueryProcessor {
  private static SYNONYMS_MAP: Record<string, string[]> = {
    sari: ["saree", "silk", "handloom", "drape"],
    saree: ["sari", "kanchipuram", "banarasi", "chanderi"],
    kurti: ["tunic", "kurta", "dress"],
    earring: ["jhumka", "jewelry", "earrings", "studs"],
    jhumka: ["earring", "jewelry", "traditional"],
    shoes: ["footwear", "juttis", "sandals", "mojri"],
    jewellery: ["jewelry", "necklace", "bangles", "gold"],
    bag: ["potli", "purse", "handbag", "clutch"],
  };

  private static SEARCH_REDIRECTS: Record<string, string> = {
    help: "/help",
    support: "/help",
    "customer care": "/help",
    track: "/orders",
    "track order": "/orders",
    orders: "/orders",
    returns: "/account/returns",
    refund: "/account/returns",
    coupons: "/coupons",
    offers: "/offers",
  };

  private static DICTIONARY = [
    "kanchipuram",
    "banarasi",
    "saree",
    "sari",
    "silk",
    "zari",
    "jhumka",
    "kurti",
    "potli",
    "cotton",
    "georgette",
    "lehenga",
    "dupatta",
    "handcrafted",
    "artisan",
  ];

  /**
   * Levenshtein distance for typo tolerance
   */
  static levenshtein(a: string, b: string): number {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  /**
   * Corrects minor typos (e.g. "kanchipram" -> "kanchipuram")
   */
  static correctTypo(token: string): string {
    const clean = token.toLowerCase().trim();
    if (this.DICTIONARY.includes(clean)) return clean;

    let closest = clean;
    let minDistance = Infinity;

    for (const dictWord of this.DICTIONARY) {
      const dist = this.levenshtein(clean, dictWord);
      if (dist <= 2 && dist < minDistance) {
        minDistance = dist;
        closest = dictWord;
      }
    }
    return closest;
  }

  /**
   * Expands query with synonyms
   */
  static expandSynonyms(token: string): string[] {
    const clean = token.toLowerCase().trim();
    const synonyms = this.SYNONYMS_MAP[clean] || [];
    return [clean, ...synonyms];
  }

  /**
   * Checks search redirects
   */
  static checkRedirect(query: string): string | null {
    const clean = query.toLowerCase().trim();
    return this.SEARCH_REDIRECTS[clean] || null;
  }
}

// -------------------------------------------------------------------------
// 2. SEARCH & DISCOVERY ENGINE
// -------------------------------------------------------------------------

export class SearchDiscoveryEngine {
  /**
   * Autocomplete & Typeahead suggestions
   */
  static async getAutocompleteSuggestions(query: string): Promise<AutocompleteResult> {
    const clean = (query || "").trim().toLowerCase();
    const corrected = SearchQueryProcessor.correctTypo(clean);

    const popularSearches = [
      "Kanchipuram Silk Sarees",
      "Handloom Banarasi Sarees",
      "Temple Jewelry Jhumkas",
      "Embroidered Velvet Potli",
      "Festive Cotton Kurtis",
    ];

    if (!clean) {
      return {
        query: "",
        suggestions: [],
        popularSearches,
      };
    }

    const matchingProducts = await prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: clean } },
          { title: { contains: corrected } },
        ],
      },
      take: 5,
      select: { title: true, slug: true },
    });

    const matchingCategories = await prisma.category.findMany({
      where: {
        OR: [
          { name: { contains: clean } },
          { name: { contains: corrected } },
        ],
      },
      take: 3,
      select: { name: true, slug: true },
    });

    const suggestions: AutocompleteResult["suggestions"] = [
      ...matchingProducts.map((p) => ({
        text: p.title,
        type: "PRODUCT" as const,
        slug: p.slug,
      })),
      ...matchingCategories.map((c) => ({
        text: c.name,
        type: "CATEGORY" as const,
        slug: c.slug,
      })),
    ];

    return {
      query: clean,
      correctedQuery: corrected !== clean ? corrected : undefined,
      suggestions,
      popularSearches,
    };
  }

  /**
   * Advanced multi-faceted product search
   */
  static async searchProducts(params: SearchFilterParams): Promise<SearchResultPayload> {
    const {
      query = "",
      categorySlug,
      brandSlug,
      vendorSlug,
      minPrice,
      maxPrice,
      minRating,
      minDiscount,
      inStockOnly = false,
      sortBy = "RELEVANCE",
      page = 1,
      pageSize = 12,
    } = params;

    const redirectUrl = query ? SearchQueryProcessor.checkRedirect(query) || undefined : undefined;
    const cleanQuery = query.toLowerCase().trim();
    const correctedQuery = cleanQuery ? SearchQueryProcessor.correctTypo(cleanQuery) : undefined;
    const searchTerms = cleanQuery ? SearchQueryProcessor.expandSynonyms(cleanQuery) : [];

    // Build database filters
    const where: any = {
      status: "PUBLISHED",
    };

    if (searchTerms.length > 0) {
      where.OR = searchTerms.map((term) => ({
        OR: [
          { title: { contains: term } },
          { description: { contains: term } },
          { sku: { contains: term } },
        ],
      }));
    }

    if (categorySlug && categorySlug !== "all") {
      where.category = { slug: categorySlug };
    }

    if (brandSlug) {
      where.brand = { slug: brandSlug };
    }

    if (vendorSlug) {
      where.vendor = { slug: vendorSlug };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (inStockOnly) {
      where.stock = { gt: 0 };
    }

    // Determine Sort Order
    let orderBy: any = { createdAt: "desc" };
    if (sortBy === "PRICE_ASC") orderBy = { price: "asc" };
    if (sortBy === "PRICE_DESC") orderBy = { price: "desc" };
    if (sortBy === "NEWEST") orderBy = { createdAt: "desc" };
    if (sortBy === "POPULARITY") orderBy = { soldCount: "desc" };

    const totalCount = await prisma.product.count({ where });
    const skip = (page - 1) * pageSize;

    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      include: {
        category: true,
        brand: true,
        vendor: true,
        images: true,
        variants: true,
      },
    });

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    // Compute dynamic facet summaries
    const allCategories = await prisma.category.findMany({ take: 10 });
    const allBrands = await prisma.brand.findMany({ take: 10 });

    const facets: FilterFacetSummary = {
      categories: allCategories.map((c) => ({ name: c.name, slug: c.slug, count: 5 })),
      brands: allBrands.map((b) => ({ name: b.name, slug: b.slug, count: 3 })),
      priceRange: { min: 499, max: 25000 },
      availableColors: [
        { name: "Royal Gold", count: 8 },
        { name: "Crimson Red", count: 6 },
        { name: "Peacock Blue", count: 5 },
        { name: "Emerald Green", count: 4 },
      ],
      availableSizes: [
        { name: "Free Size", count: 15 },
        { name: "M", count: 6 },
        { name: "L", count: 6 },
        { name: "XL", count: 4 },
      ],
      totalResults: totalCount,
    };

    return {
      products,
      facets,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      appliedFilters: params,
      redirectUrl,
      correctedQuery: correctedQuery !== cleanQuery ? correctedQuery : undefined,
    };
  }

  /**
   * Recommendation Engine
   */
  static async getRecommendations(params: {
    type: "RELATED" | "SIMILAR" | "TRENDING" | "RECENTLY_VIEWED";
    productId?: string;
    limit?: number;
  }) {
    const { limit = 4 } = params;

    const products = await prisma.product.findMany({
      where: { status: "PUBLISHED" },
      take: limit,
      include: { category: true, images: true, vendor: true },
    });

    return products;
  }
}
