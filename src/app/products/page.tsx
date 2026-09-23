"use client";

import React from "react";
import Link from "next/link";
import { PRODUCTS_DATA } from "@/data/mock-catalog";
import { ProductCard } from "@/components/products/ProductCard";
import { Breadcrumbs } from "@/components/ui/StateFeedback";
import { ROUTES } from "@/lib/routes";

export default function ProductsCatalogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <Breadcrumbs items={[{ label: "All Products" }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">Complete Product Catalog</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Direct from 5,000+ verified Indian weavers and makers</p>
        </div>
        <Link href={ROUTES.shop} className="text-xs font-bold text-fancy-blue hover:underline">
          Open Faceted Filter Sidebar →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {PRODUCTS_DATA.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
