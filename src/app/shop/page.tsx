"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Filter, SlidersHorizontal, ChevronRight, X, Star } from "lucide-react";
import { useCategories } from "@/lib/use-categories";
import { PRODUCTS_DATA, VENDORS_DATA } from "@/data/mock-catalog";
import { ProductCard } from "@/components/products/ProductCard";
import { formatINR } from "@/lib/design-tokens";
import { ROUTES } from "@/lib/routes";
import { Breadcrumbs, EmptyState } from "@/components/ui/StateFeedback";

export default function ShopPage() {
  const { flatCategories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedVendor, setSelectedVendor] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [minRating, setMinRating] = useState<number>(0);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [codOnly, setCodOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter((product) => {
      if (selectedCategory !== "all" && product.categorySlug !== selectedCategory) return false;
      if (selectedVendor !== "all" && product.vendorSlug !== selectedVendor) return false;
      if (product.price > maxPrice) return false;
      if (product.ratings < minRating) return false;
      if (product.discountPercent < minDiscount) return false;
      if (codOnly && !product.codAvailable) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "rating") return b.ratings - a.ratings;
      if (sortBy === "discount") return b.discountPercent - a.discountPercent;
      return b.soldCount - a.soldCount; // popular
    });
  }, [selectedCategory, selectedVendor, maxPrice, minRating, minDiscount, codOnly, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedVendor("all");
    setMaxPrice(10000);
    setMinRating(0);
    setMinDiscount(0);
    setCodOnly(false);
    setSortBy("popular");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <Breadcrumbs items={[{ label: "Marketplace Catalog" }]} />

      {/* Top Header & Sort Bar */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-4 md:p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
            Marketplace Catalog ({filteredProducts.length} Products)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Showing all verified products from direct Indian weavers and tech sellers</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-white text-xs font-bold px-3 py-2 rounded-xl"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none cursor-pointer"
            >
              <option value="popular">Popularity / Best Selling</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="discount">Biggest Discount %</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Desktop Sidebar Filters (3 cols) */}
        <aside className="hidden md:block md:col-span-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-subtle space-y-6 sticky top-24">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-fancy-blue" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Filters</h3>
            </div>
            <button
              onClick={clearFilters}
              className="text-xs text-fancy-blue hover:underline font-semibold"
            >
              Reset All
            </button>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">Category</h4>
            <div className="space-y-1 text-xs max-h-48 overflow-y-auto no-scrollbar">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg transition ${
                  selectedCategory === "all" ? "bg-blue-50 dark:bg-slate-700 text-fancy-blue font-bold" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                All Categories
              </button>
              {flatCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition ${
                    selectedCategory === cat.slug ? "bg-blue-50 dark:bg-slate-700 text-fancy-blue font-bold" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat.level > 0 ? "— ".repeat(cat.level) : ""}{cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Verified Sellers */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">Seller Store</h4>
            <div className="space-y-1 text-xs max-h-36 overflow-y-auto no-scrollbar">
              <button
                onClick={() => setSelectedVendor("all")}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg transition ${
                  selectedVendor === "all" ? "bg-blue-50 dark:bg-slate-700 text-fancy-blue font-bold" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                All Verified Sellers
              </button>
              {VENDORS_DATA.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVendor(v.slug)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition ${
                    selectedVendor === v.slug ? "bg-blue-50 dark:bg-slate-700 text-fancy-blue font-bold" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {v.storeName}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              <span className="uppercase tracking-wider">Max Price</span>
              <span className="text-fancy-blue">{formatINR(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={299}
              max={10000}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-fancy-blue cursor-pointer"
            />
          </div>

          {/* Minimum Rating */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">Customer Rating</h4>
            <div className="space-y-1 text-xs">
              {[4, 3, 2].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setMinRating(stars === minRating ? 0 : stars)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition ${
                    minRating === stars ? "bg-blue-50 dark:bg-slate-700 text-fancy-blue font-bold" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  <span className="flex items-center space-x-1">
                    <span>{stars} Stars & above</span>
                  </span>
                  <div className="flex text-amber-400">
                    {[...Array(stars)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* COD toggle */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
            <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={codOnly}
                onChange={(e) => setCodOnly(e.target.checked)}
                className="w-4 h-4 rounded text-fancy-blue focus:ring-fancy-blue"
              />
              <span>Cash on Delivery Available</span>
            </label>
          </div>
        </aside>

        {/* Product Cards Grid (9 cols) */}
        <main className="col-span-1 md:col-span-9">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Products Match Your Filters"
              description="Try adjusting your price range, category or rating filter."
              actionText="Reset All Filters"
              actionHref={ROUTES.shop}
            />
          )}
        </main>
      </div>
    </div>
  );
}
