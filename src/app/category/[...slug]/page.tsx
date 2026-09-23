"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { Breadcrumbs, EmptyState, LoadingSpinner } from "@/components/ui/StateFeedback";
import { ROUTES } from "@/lib/routes";
import { PRODUCTS_DATA } from "@/data/mock-catalog";
import { ChevronRight, Sparkles, Filter, SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import { DEFAULT_CATEGORY_PAGE_BLOCKS, CategoryPageBlock } from "@/lib/category-page-layout";

export default function CategoryDynamicPage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = params?.slug;
  const slugArray: string[] = Array.isArray(rawSlug) ? rawSlug : [rawSlug as string];
  const fullPath = slugArray.filter(Boolean).join("/");

  const [categoryData, setCategoryData] = useState<any | null>(null);
  const [blocks, setBlocks] = useState<CategoryPageBlock[]>(DEFAULT_CATEGORY_PAGE_BLOCKS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("popular");
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setIsLoading(true);
        const [catRes, layoutRes] = await Promise.all([
          fetch(`/api/categories/slug/${fullPath}`, { cache: "no-store" }),
          fetch("/api/public/category-layout"),
        ]);

        const catData = await catRes.json();
        const layoutData = await layoutRes.json();

        if (!mounted) return;

        if (catData.redirected && catData.destinationUrl) {
          router.replace(catData.destinationUrl);
          return;
        }

        if (catData.success && catData.data) {
          setCategoryData(catData.data);
          setError(null);
        } else {
          setError(catData.error || "Category not found");
        }

        if (layoutData.success && layoutData.blocks) {
          setBlocks(layoutData.blocks);
        }
      } catch (err: any) {
        if (mounted) setError(err.message || "Failed to load category");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    if (fullPath) {
      loadData();
    }

    return () => {
      mounted = false;
    };
  }, [fullPath, router]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-4">
        <LoadingSpinner />
        <p className="text-xs text-slate-500 font-semibold animate-pulse">
          Loading {fullPath.split("/").pop()} collection...
        </p>
      </div>
    );
  }

  if (error || !categoryData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-6">
        <Breadcrumbs items={[{ label: "Categories", href: ROUTES.categories }, { label: "Not Found" }]} />
        <EmptyState
          title="Category Not Found"
          description={`We couldn't find a category matching '/${fullPath}'. It may have been moved or archived.`}
          actionText="Explore All Categories"
          actionHref={ROUTES.categories}
        />
      </div>
    );
  }

  const breadcrumbsItems =
    categoryData.breadcrumbs && categoryData.breadcrumbs.length > 0
      ? categoryData.breadcrumbs
      : [{ label: "Categories", href: ROUTES.categories }, { label: categoryData.name }];

  const displayedProducts =
    categoryData.products && categoryData.products.length > 0
      ? categoryData.products
      : PRODUCTS_DATA.filter(
          (p) =>
            p.categorySlug === categoryData.slug ||
            p.parentCategorySlug === categoryData.slug ||
            p.categoryId === categoryData.id
        );

  // Modular Category Block Renderer
  const renderCategoryBlock = (block: CategoryPageBlock) => {
    if (!block.isActive) return null;

    switch (block.type) {
      case "CATEGORY_BREADCRUMB":
        return <Breadcrumbs key={block.id} items={breadcrumbsItems} />;

      case "CATEGORY_BANNER":
        return (
          <div
            key={block.id}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-[#0B2A63] to-slate-900 text-white p-6 md:p-10 shadow-card min-h-[160px] flex items-center"
          >
            {(categoryData.bannerImage || categoryData.image) && (
              <img
                src={categoryData.bannerImage || categoryData.image}
                alt={categoryData.name}
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
              />
            )}
            <div className="relative z-10 max-w-2xl space-y-2">
              <div className="flex items-center space-x-2">
                <span className="bg-fancy-orange text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {categoryData.level === 0 ? "Department" : `Level ${categoryData.level} Category`}
                </span>
                {categoryData.isFeatured && (
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Featured Collection</span>
                  </span>
                )}
              </div>
              <h2 className="text-2xl md:text-4xl font-black">{categoryData.name}</h2>
              <p className="text-xs md:text-sm text-slate-200">
                {categoryData.description || `Discover handpicked authentic ${categoryData.name} verified by FancyHub.`}
              </p>
            </div>
          </div>
        );

      case "CATEGORY_TITLE":
        return (
          <div key={block.id} className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                {categoryData.name}
              </h1>
              <p className="text-xs text-slate-500">
                Direct from verified Indian artisans & loom cooperatives
              </p>
            </div>
            <span className="px-3 py-1 bg-fancy-blue/10 text-fancy-blue border border-fancy-blue/20 text-xs font-black rounded-xl">
              {displayedProducts.length} Products
            </span>
          </div>
        );

      case "CATEGORY_DESCRIPTION":
        return (
          <div
            key={block.id}
            className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
          >
            {categoryData.description || `Discover handcrafted ${categoryData.name} on FancyHub. Verified quality and authentic weaves direct from artisan clusters.`}
          </div>
        );

      case "SUBCATEGORIES_LIST":
        return categoryData.children && categoryData.children.length > 0 ? (
          <div
            key={block.id}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 flex items-center space-x-2 overflow-x-auto no-scrollbar shadow-subtle"
          >
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 flex-shrink-0">
              Subcategories ({categoryData.children.length}):
            </span>
            {categoryData.children.map((sub: any) => (
              <Link
                key={sub.id}
                href={`/category/${sub.fullPath}`}
                className="bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 hover:border-fancy-blue text-slate-700 dark:text-slate-200 hover:text-fancy-blue text-xs font-semibold px-3 py-1.5 rounded-xl shadow-subtle flex-shrink-0 transition flex items-center space-x-1"
              >
                <span>{sub.name}</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </Link>
            ))}
          </div>
        ) : null;

      case "FILTERS_SIDEBAR":
        return (
          <div
            key={block.id}
            className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-4 text-xs shadow-subtle"
          >
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-black text-slate-900 dark:text-white flex items-center space-x-1.5">
                <Filter className="w-4 h-4 text-fancy-blue" />
                <span>Filters</span>
              </span>
              <button className="text-[11px] text-fancy-blue font-bold hover:underline">Reset</button>
            </div>

            {/* Price Filter */}
            <div className="space-y-1.5">
              <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">Price Range</span>
              <input type="range" min="499" max="25000" className="w-full accent-fancy-blue" />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>₹499</span>
                <span>₹25,000</span>
              </div>
            </div>

            {/* In-Stock Only */}
            <label className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded accent-fancy-blue" />
              <span>In Stock Only</span>
            </label>
          </div>
        );

      case "SORTING_BAR":
        return (
          <div
            key={block.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-subtle text-xs"
          >
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Showing {displayedProducts.length} Items
            </span>

            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 font-bold text-fancy-blue outline-none cursor-pointer"
              >
                <option value="popular">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        );

      case "MOBILE_FILTER_DRAWER":
        return (
          <div key={block.id} className="md:hidden">
            <button
              onClick={() => setShowMobileFilter(true)}
              className="w-full py-3 bg-fancy-blue text-white rounded-2xl font-bold text-xs shadow-lg flex items-center justify-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Open Filters & Refine</span>
            </button>
          </div>
        );

      case "PRODUCT_GRID":
        return (
          <div key={block.id} className="space-y-4">
            {displayedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {displayedProducts.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <EmptyState
                title={`No Products in ${categoryData.name} Yet`}
                description="We are currently onboarding master weavers for this craft collection."
                actionText="Browse All Products"
                actionHref={ROUTES.shop}
              />
            )}
          </div>
        );

      case "PAGINATION_CONTROLS":
        return displayedProducts.length > 0 ? (
          <div key={block.id} className="flex items-center justify-center space-x-2 py-4">
            <button className="px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-500">
              Previous
            </button>
            <button className="px-3.5 py-2 bg-fancy-blue text-white rounded-xl text-xs font-bold shadow">
              1
            </button>
            <button className="px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-500">
              Next
            </button>
          </div>
        ) : null;

      case "RECOMMENDED_PRODUCTS":
        return (
          <div key={block.id} className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Recommended for You</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PRODUCTS_DATA.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        );

      case "SEO_CONTENT":
        return (
          <div
            key={block.id}
            className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl space-y-3 shadow-subtle"
          >
            <h3 className="font-black text-base text-slate-900 dark:text-white">
              {categoryData.name} — Online Handloom Shopping at FancyHub
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Buy 100% authentic {categoryData.name} with verified Silk Mark certification directly from master craftspeople. Enjoy doorstep delivery across 19,000+ Indian pincodes, secure UPI checkout, and 7-day hassle-free returns.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const topBlocks = blocks.filter((b) => b.zone === "TOP_HEADER" && b.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const sidebarBlocks = blocks.filter((b) => b.zone === "SIDEBAR" && b.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const mainBlocks = blocks.filter((b) => b.zone === "MAIN_CONTENT" && b.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const bottomBlocks = blocks.filter((b) => b.zone === "BOTTOM_FOOTER" && b.isActive).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header Region */}
      <div className="space-y-4">
        {topBlocks.map((blk) => renderCategoryBlock(blk))}
      </div>

      {/* Main 2-Column Split: Sidebar & Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {sidebarBlocks.length > 0 && (
          <div className="hidden md:block md:col-span-1 space-y-4">
            {sidebarBlocks.map((blk) => renderCategoryBlock(blk))}
          </div>
        )}

        <div className={`space-y-4 ${sidebarBlocks.length > 0 ? "md:col-span-3" : "md:col-span-4"}`}>
          {mainBlocks.map((blk) => renderCategoryBlock(blk))}
        </div>
      </div>

      {/* Bottom Footer Region */}
      <div className="space-y-6">
        {bottomBlocks.map((blk) => renderCategoryBlock(blk))}
      </div>
    </div>
  );
}
