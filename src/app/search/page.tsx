"use client";

import React, { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Star,
  X,
  ChevronRight,
  Sparkles,
  ArrowUpDown,
  RotateCcw,
  Check,
  Tag,
  TrendingUp,
  Clock,
  Flame,
  Layers,
} from "lucide-react";
import { PRODUCTS_DATA, CATEGORIES_DATA, BRANDS_DATA } from "@/data/mock-catalog";
import { ProductCard } from "@/components/products/ProductCard";
import { Breadcrumbs, EmptyState } from "@/components/ui/StateFeedback";
import { formatINR } from "@/lib/design-tokens";
import { ROUTES } from "@/lib/routes";
import { SearchQueryProcessor } from "@/lib/search-discovery-engine";
import { RecommendationIntelligenceEngine } from "@/lib/search-recommendation-intelligence-engine";

type SortOption =
  | "RELEVANCE"
  | "POPULARITY"
  | "NEWEST"
  | "PRICE_ASC"
  | "PRICE_DESC"
  | "RATING"
  | "DISCOUNT";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Query Parameters
  const queryParam = searchParams?.get("q") || "";
  const categoryParam = searchParams?.get("category") || "all";
  const brandParam = searchParams?.get("brand") || "all";
  const vendorParam = searchParams?.get("vendor") || "all";
  const minPriceParam = searchParams?.get("min") ? Number(searchParams.get("min")) : 0;
  const maxPriceParam = searchParams?.get("max") ? Number(searchParams.get("max")) : 25000;
  const minRatingParam = searchParams?.get("rating") ? Number(searchParams.get("rating")) : 0;
  const minDiscountParam = searchParams?.get("discount") ? Number(searchParams.get("discount")) : 0;
  const inStockParam = searchParams?.get("inStock") === "true";
  const sortParam = (searchParams?.get("sort") as SortOption) || "RELEVANCE";
  const pageParam = searchParams?.get("page") ? Number(searchParams.get("page")) : 1;

  // Local filter states
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedBrand, setSelectedBrand] = useState(brandParam);
  const [selectedVendor, setSelectedVendor] = useState(vendorParam);
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);
  const [minRating, setMinRating] = useState(minRatingParam);
  const [minDiscount, setMinDiscount] = useState(minDiscountParam);
  const [inStockOnly, setInStockOnly] = useState(inStockParam);
  const [sortBy, setSortBy] = useState<SortOption>(sortParam);
  const [currentPage, setCurrentPage] = useState(pageParam);

  // Mobile Filter Drawer
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Typeahead / Autocomplete & Recent Searches
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Banarasi Saree",
    "ANC Earbuds",
    "Gold Jhumkas",
    "Cotton Kurti",
  ]);

  const popularSearches = [
    "Silk Sarees",
    "Wireless Headphones",
    "Temple Jewelry",
    "Festive Kurtas",
    "Handloom Dupattas",
  ];

  // Sync state when URL searchParams change
  useEffect(() => {
    setSearchQuery(queryParam);
    setSelectedCategory(categoryParam);
    setSelectedBrand(brandParam);
    setSelectedVendor(vendorParam);
    setMinPrice(minPriceParam);
    setMaxPrice(maxPriceParam);
    setMinRating(minRatingParam);
    setMinDiscount(minDiscountParam);
    setInStockOnly(inStockParam);
    setSortBy(sortParam);
    setCurrentPage(pageParam);
  }, [
    queryParam,
    categoryParam,
    brandParam,
    vendorParam,
    minPriceParam,
    maxPriceParam,
    minRatingParam,
    minDiscountParam,
    inStockParam,
    sortParam,
    pageParam,
  ]);

  // Update URL Query Parameters
  const applyFiltersToUrl = (updates: Partial<{
    q: string;
    category: string;
    brand: string;
    vendor: string;
    min: number;
    max: number;
    rating: number;
    discount: number;
    inStock: boolean;
    sort: SortOption;
    page: number;
  }>) => {
    const params = new URLSearchParams();

    const q = updates.q !== undefined ? updates.q : searchQuery;
    const cat = updates.category !== undefined ? updates.category : selectedCategory;
    const br = updates.brand !== undefined ? updates.brand : selectedBrand;
    const ven = updates.vendor !== undefined ? updates.vendor : selectedVendor;
    const minP = updates.min !== undefined ? updates.min : minPrice;
    const maxP = updates.max !== undefined ? updates.max : maxPrice;
    const rat = updates.rating !== undefined ? updates.rating : minRating;
    const disc = updates.discount !== undefined ? updates.discount : minDiscount;
    const stock = updates.inStock !== undefined ? updates.inStock : inStockOnly;
    const srt = updates.sort !== undefined ? updates.sort : sortBy;
    const pg = updates.page !== undefined ? updates.page : 1;

    if (q) params.set("q", q);
    if (cat && cat !== "all") params.set("category", cat);
    if (br && br !== "all") params.set("brand", br);
    if (ven && ven !== "all") params.set("vendor", ven);
    if (minP > 0) params.set("min", String(minP));
    if (maxP < 25000) params.set("max", String(maxP));
    if (rat > 0) params.set("rating", String(rat));
    if (disc > 0) params.set("discount", String(disc));
    if (stock) params.set("inStock", "true");
    if (srt && srt !== "RELEVANCE") params.set("sort", srt);
    if (pg > 1) params.set("page", String(pg));

    router.push(`/search?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery && !recentSearches.includes(searchQuery)) {
      setRecentSearches([searchQuery, ...recentSearches.slice(0, 4)]);
    }
    setIsInputFocused(false);
    applyFiltersToUrl({ q: searchQuery, page: 1 });
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedBrand("all");
    setSelectedVendor("all");
    setMinPrice(0);
    setMaxPrice(25000);
    setMinRating(0);
    setMinDiscount(0);
    setInStockOnly(false);
    setSortBy("RELEVANCE");
    setCurrentPage(1);
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  // Typo tolerance helper
  const correctedQuery = useMemo(() => {
    if (!searchQuery) return null;
    const clean = searchQuery.toLowerCase().trim();
    const corrected = SearchQueryProcessor.correctTypo(clean);
    return corrected !== clean ? corrected : null;
  }, [searchQuery]);

  // Comprehensive Product Filtering & Multi-Signal Scoring
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS_DATA];
    const q = (searchQuery || "").toLowerCase().trim();

    // 1. Search Query with Typo tolerance & Synonym expansion
    if (q) {
      const synonyms = SearchQueryProcessor.expandSynonyms(q);
      result = result.filter((p) => {
        const title = p.title.toLowerCase();
        const desc = (p.description || "").toLowerCase();
        const cat = (p.categoryName || "").toLowerCase();
        const brandName = (p.brandName || (p as any).brand || "").toLowerCase();
        const vendorName = (p.vendorName || "").toLowerCase();
        const sku = (p.sku || "").toLowerCase();
        const tags = (p.tags || []).map((t) => t.toLowerCase());

        return (
          synonyms.some(
            (term) =>
              title.includes(term) ||
              desc.includes(term) ||
              cat.includes(term) ||
              brandName.includes(term) ||
              vendorName.includes(term) ||
              sku.includes(term) ||
              tags.some((t) => t.includes(term))
          ) ||
          (correctedQuery && (title.includes(correctedQuery) || cat.includes(correctedQuery)))
        );
      });
    }

    // 2. Category Filter
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(
        (p) =>
          p.categorySlug === selectedCategory ||
          p.categoryId === selectedCategory ||
          p.categoryName.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // 3. Brand Filter
    if (selectedBrand && selectedBrand !== "all") {
      result = result.filter(
        (p) =>
          p.brandSlug === selectedBrand ||
          (p.brandName || (p as any).brand || "").toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    // 4. Price Filter
    result = result.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    // 5. Rating Filter
    if (minRating > 0) {
      result = result.filter((p) => (p.ratings || 4.5) >= minRating);
    }

    // 6. Discount Filter
    if (minDiscount > 0) {
      result = result.filter((p) => (p.discountPercent || 0) >= minDiscount);
    }

    // 7. In Stock Only Filter
    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // 8. Sorting
    result.sort((a, b) => {
      if (sortBy === "PRICE_ASC") return a.price - b.price;
      if (sortBy === "PRICE_DESC") return b.price - a.price;
      if (sortBy === "NEWEST") return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      if (sortBy === "POPULARITY") return (b.soldCount || 0) - (a.soldCount || 0);
      if (sortBy === "RATING") return (b.ratings || 0) - (a.ratings || 0);
      if (sortBy === "DISCOUNT") return (b.discountPercent || 0) - (a.discountPercent || 0);
      // Default: RELEVANCE
      return 0;
    });

    return result;
  }, [
    searchQuery,
    correctedQuery,
    selectedCategory,
    selectedBrand,
    minPrice,
    maxPrice,
    minRating,
    minDiscount,
    inStockOnly,
    sortBy,
  ]);

  // Pagination (12 items per page)
  const pageSize = 12;
  const totalCount = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Recommendations for cold-start / related
  const trendingProducts = useMemo(() => RecommendationIntelligenceEngine.getTrendingNow(), []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 font-sans">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Search & Catalog", href: ROUTES.shop },
          { label: searchQuery ? `"${searchQuery}"` : "All Products" },
        ]}
      />

      {/* Dynamic Search Bar & Typeahead Box */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-4 sm:p-6 shadow-card relative">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="flex items-center rounded-2xl border border-slate-300 dark:border-slate-600 px-4 py-3 bg-slate-50 dark:bg-slate-900/60">
            <Search className="w-5 h-5 text-slate-400 mr-3" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsInputFocused(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, SKU, brand, fabric, tags, or artisan..."
              className="w-full bg-transparent outline-none text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  applyFiltersToUrl({ q: "", page: 1 });
                }}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white mr-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-2 bg-fancy-blue hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </form>

        {/* Autocomplete Dropdown */}
        {isInputFocused && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-2xl z-40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Search Discovery Suggestions</span>
              <button
                type="button"
                onClick={() => setIsInputFocused(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Recent Searches */}
              <div className="space-y-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Recent Searches</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {recentSearches.map((rec) => (
                    <button
                      key={rec}
                      type="button"
                      onClick={() => {
                        setSearchQuery(rec);
                        setIsInputFocused(false);
                        applyFiltersToUrl({ q: rec, page: 1 });
                      }}
                      className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200"
                    >
                      {rec}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Trending Searches */}
              <div className="space-y-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Popular Trending</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {popularSearches.map((pop) => (
                    <button
                      key={pop}
                      type="button"
                      onClick={() => {
                        setSearchQuery(pop);
                        setIsInputFocused(false);
                        applyFiltersToUrl({ q: pop, page: 1 });
                      }}
                      className="px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold hover:bg-amber-100"
                    >
                      {pop}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Typo Tolerance Suggestion Banner */}
        {correctedQuery && (
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl flex items-center space-x-2 text-xs">
            <Sparkles className="w-4 h-4 text-fancy-blue" />
            <span className="text-slate-700 dark:text-slate-300">
              Showing results for: <strong>&ldquo;{searchQuery}&rdquo;</strong>. Did you mean{" "}
              <button
                onClick={() => {
                  setSearchQuery(correctedQuery);
                  applyFiltersToUrl({ q: correctedQuery, page: 1 });
                }}
                className="text-fancy-blue underline font-black"
              >
                {correctedQuery}
              </button>
              ?
            </span>
          </div>
        )}
      </div>

      {/* Horizontal Active Filter Chips Strip */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setIsFilterDrawerOpen(true)}
          className="md:hidden px-3.5 py-1.5 rounded-xl bg-fancy-blue text-white font-bold flex items-center space-x-1.5 flex-shrink-0"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters ({[selectedCategory !== "all", selectedBrand !== "all", minPrice > 0, inStockOnly].filter(Boolean).length})</span>
        </button>

        {selectedCategory !== "all" && (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold flex-shrink-0">
            <span>Category: {selectedCategory}</span>
            <X
              className="w-3 h-3 cursor-pointer text-slate-400 hover:text-slate-700"
              onClick={() => {
                setSelectedCategory("all");
                applyFiltersToUrl({ category: "all", page: 1 });
              }}
            />
          </span>
        )}

        {selectedBrand !== "all" && (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold flex-shrink-0">
            <span>Brand: {selectedBrand}</span>
            <X
              className="w-3 h-3 cursor-pointer text-slate-400 hover:text-slate-700"
              onClick={() => {
                setSelectedBrand("all");
                applyFiltersToUrl({ brand: "all", page: 1 });
              }}
            />
          </span>
        )}

        {(minPrice > 0 || maxPrice < 25000) && (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold flex-shrink-0">
            <span>Price: {formatINR(minPrice)} - {formatINR(maxPrice)}</span>
            <X
              className="w-3 h-3 cursor-pointer text-slate-400 hover:text-slate-700"
              onClick={() => {
                setMinPrice(0);
                setMaxPrice(25000);
                applyFiltersToUrl({ min: 0, max: 25000, page: 1 });
              }}
            />
          </span>
        )}

        {inStockOnly && (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold flex-shrink-0">
            <span>In Stock Only</span>
            <X
              className="w-3 h-3 cursor-pointer text-emerald-600"
              onClick={() => {
                setInStockOnly(false);
                applyFiltersToUrl({ inStock: false, page: 1 });
              }}
            />
          </span>
        )}

        {([selectedCategory !== "all", selectedBrand !== "all", minPrice > 0, inStockOnly].some(Boolean)) && (
          <button
            onClick={handleResetFilters}
            className="text-fancy-blue hover:underline font-bold text-xs flex-shrink-0 ml-2"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Main Catalog View: Sidebar (Desktop) + Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Desktop Facet Filters Sidebar (3 cols) */}
        <aside className="hidden md:block md:col-span-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle space-y-6 sticky top-24">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="font-black text-slate-900 dark:text-white text-sm flex items-center space-x-2">
              <Filter className="w-4 h-4 text-fancy-blue" />
              <span>Filters</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-slate-400 hover:text-fancy-blue font-bold"
            >
              Reset
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block">
              Categories
            </span>
            <div className="space-y-1 max-h-48 overflow-y-auto text-xs font-semibold text-slate-600 dark:text-slate-300">
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  applyFiltersToUrl({ category: "all", page: 1 });
                }}
                className={`w-full text-left py-1 px-2 rounded-lg transition ${
                  selectedCategory === "all" ? "bg-fancy-blue text-white font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                All Departments
              </button>
              {CATEGORIES_DATA.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    applyFiltersToUrl({ category: cat.slug, page: 1 });
                  }}
                  className={`w-full text-left py-1 px-2 rounded-lg transition ${
                    selectedCategory === cat.slug ? "bg-fancy-blue text-white font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 border-t border-slate-100 dark:border-slate-700 pt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider">Price Range</span>
              <span className="font-bold text-fancy-blue">{formatINR(minPrice)} - {formatINR(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={25000}
              step={500}
              value={maxPrice}
              onChange={(e) => {
                const val = Number(e.target.value);
                setMaxPrice(val);
                applyFiltersToUrl({ max: val, page: 1 });
              }}
              className="w-full accent-fancy-blue"
            />
          </div>

          {/* Brands */}
          <div className="space-y-2 border-t border-slate-100 dark:border-slate-700 pt-4">
            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block">
              Brands
            </span>
            <div className="space-y-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <button
                onClick={() => {
                  setSelectedBrand("all");
                  applyFiltersToUrl({ brand: "all", page: 1 });
                }}
                className={`w-full text-left py-1 px-2 rounded-lg transition ${
                  selectedBrand === "all" ? "bg-fancy-blue text-white font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                All Brands
              </button>
              {BRANDS_DATA.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setSelectedBrand(b.slug);
                    applyFiltersToUrl({ brand: b.slug, page: 1 });
                  }}
                  className={`w-full text-left py-1 px-2 rounded-lg transition ${
                    selectedBrand === b.slug ? "bg-fancy-blue text-white font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          {/* In-Stock Only Toggle */}
          <div className="border-t border-slate-100 dark:border-slate-700 pt-4 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">In-Stock Only</span>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => {
                setInStockOnly(e.target.checked);
                applyFiltersToUrl({ inStock: e.target.checked, page: 1 });
              }}
              className="rounded text-fancy-blue w-4 h-4"
            />
          </div>
        </aside>

        {/* Product Results Column (9 cols) */}
        <div className="md:col-span-9 space-y-4">
          {/* Controls Bar: Results Count & Sort Dropdown */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-subtle flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Showing <strong>{paginatedProducts.length}</strong> of <strong>{totalCount}</strong> Products
            </span>

            <div className="flex items-center space-x-2">
              <span className="text-slate-400 font-semibold hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  const s = e.target.value as SortOption;
                  setSortBy(s);
                  applyFiltersToUrl({ sort: s, page: 1 });
                }}
                className="border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-1.5 font-bold text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
              >
                <option value="RELEVANCE" className="dark:bg-slate-800">Relevance</option>
                <option value="POPULARITY" className="dark:bg-slate-800">Popularity (Best Selling)</option>
                <option value="NEWEST" className="dark:bg-slate-800">Newest Arrivals</option>
                <option value="PRICE_ASC" className="dark:bg-slate-800">Price: Low to High</option>
                <option value="PRICE_DESC" className="dark:bg-slate-800">Price: High to Low</option>
                <option value="RATING" className="dark:bg-slate-800">Highest Customer Rating</option>
                <option value="DISCOUNT" className="dark:bg-slate-800">Biggest Discount %</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-12 text-center space-y-4">
              <EmptyState
                title="No products found"
                description="Try loosening your filters, expanding your price range, or searching for broader terms."
                actionText="Reset All Filters"
                actionHref="/search"
              />
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-subtle flex items-center justify-between text-xs font-bold">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  const next = Math.max(1, currentPage - 1);
                  setCurrentPage(next);
                  applyFiltersToUrl({ page: next });
                }}
                className={`px-4 py-2 rounded-xl transition ${
                  currentPage === 1 ? "text-slate-300 cursor-not-allowed" : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-200"
                }`}
              >
                ← Previous
              </button>

              <span className="text-slate-500">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  const next = Math.min(totalPages, currentPage + 1);
                  setCurrentPage(next);
                  applyFiltersToUrl({ page: next });
                }}
                className={`px-4 py-2 rounded-xl transition ${
                  currentPage === totalPages ? "text-slate-300 cursor-not-allowed" : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-200"
                }`}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Multi-Tiered Recommendations Carousel (Trending & Popular Fallback) */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h3 className="font-black text-slate-900 dark:text-white text-base">Trending & Popular Marketplace Picks</h3>
          </div>
          <Link href={ROUTES.shop} className="text-xs font-bold text-fancy-blue hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {trendingProducts.slice(0, 6).map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>

      {/* Mobile Filter Drawer Modal */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xs bg-white dark:bg-slate-800 h-full p-6 overflow-y-auto space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <span className="font-black text-slate-900 dark:text-white text-base">Filter Products</span>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase">Category</span>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left py-1.5 px-3 rounded-xl font-bold ${
                      selectedCategory === "all" ? "bg-fancy-blue text-white" : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES_DATA.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left py-1.5 px-3 rounded-xl font-bold ${
                        selectedCategory === cat.slug ? "bg-fancy-blue text-white" : "text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Max Price:</span>
                  <span className="text-fancy-blue">{formatINR(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={25000}
                  step={500}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-fancy-blue"
                />
              </div>

              {/* In-Stock */}
              <div className="flex items-center justify-between text-xs font-bold">
                <span>In-Stock Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-fancy-blue w-4 h-4"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
              <button
                onClick={() => {
                  applyFiltersToUrl({
                    category: selectedCategory,
                    max: maxPrice,
                    inStock: inStockOnly,
                    page: 1,
                  });
                  setIsFilterDrawerOpen(false);
                }}
                className="w-full py-3 bg-fancy-blue text-white font-black text-xs rounded-xl shadow-elevated"
              >
                Apply Filters
              </button>
              <button
                onClick={() => {
                  handleResetFilters();
                  setIsFilterDrawerOpen(false);
                }}
                className="w-full py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-xs text-slate-500 font-bold">
          Loading Search & Discovery Catalog...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
