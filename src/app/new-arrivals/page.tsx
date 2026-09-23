"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { PRODUCTS_DATA } from "@/data/mock-catalog";
import { ProductCard } from "@/components/products/ProductCard";
import { Breadcrumbs } from "@/components/ui/StateFeedback";

export default function NewArrivalsPage() {
  const newProducts = PRODUCTS_DATA.filter((p) => p.tags?.includes("New Arrival"));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <Breadcrumbs items={[{ label: "New Arrivals" }]} />

      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-6 md:p-10 text-white shadow-card space-y-2">
        <div className="inline-flex items-center space-x-1 bg-fancy-orange px-3 py-1 rounded-full text-xs font-black">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FRESH LAUNCHES</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black">New Season Arrivals</h1>
        <p className="text-xs md:text-sm text-blue-200">The latest handcrafted sarees, wireless earbuds, wood decor and custom prints.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {newProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
