"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { PRODUCTS_DATA } from "@/data/mock-catalog";
import { ROUTES } from "@/lib/routes";

interface ProductGridProps {
  content?: {
    title?: string;
    subtitle?: string;
    filterType?: "trending" | "best_sellers" | "new_arrivals" | "category" | "custom";
    categorySlug?: string;
    layout?: "grid" | "carousel";
    columns?: number;
    limit?: number;
    showViewAll?: boolean;
    viewAllLink?: string;
  };
}

export function ProductGridWidget({ content }: ProductGridProps) {
  const filterType = content?.filterType || "trending";
  const limit = content?.limit || 4;
  const columns = content?.columns || 4;

  let products = PRODUCTS_DATA;
  if (filterType === "trending") {
    products = PRODUCTS_DATA.filter((p) => p.isFeatured || p.ratings >= 4.5);
  } else if (filterType === "best_sellers") {
    products = PRODUCTS_DATA.filter((p) => p.soldCount > 50 || p.reviewCount > 20);
  } else if (filterType === "new_arrivals") {
    products = PRODUCTS_DATA.filter((p) => p.isFeatured || p.discountPercent > 10);
  } else if (filterType === "category" && content?.categorySlug) {
    products = PRODUCTS_DATA.filter((p) => p.categorySlug === content.categorySlug);
  }

  const displayList = products.slice(0, limit);
  const colClass =
    columns === 2
      ? "grid-cols-2"
      : columns === 3
      ? "grid-cols-2 md:grid-cols-3"
      : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-fancy-blue" />
            <h2 className="text-base md:text-xl font-black text-slate-900 dark:text-white">
              {content?.title || "Product Showcase"}
            </h2>
          </div>
          {content?.subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{content.subtitle}</p>
          )}
        </div>

        {content?.showViewAll !== false && (
          <Link
            href={content?.viewAllLink || ROUTES.shop}
            className="text-xs font-bold text-fancy-blue hover:underline flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <div className={`grid ${colClass} gap-3 md:gap-4`}>
        {displayList.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
