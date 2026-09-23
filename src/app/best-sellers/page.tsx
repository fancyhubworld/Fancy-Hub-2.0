"use client";

import React from "react";
import { Trophy } from "lucide-react";
import { PRODUCTS_DATA } from "@/data/mock-catalog";
import { ProductCard } from "@/components/products/ProductCard";
import { Breadcrumbs } from "@/components/ui/StateFeedback";

export default function BestSellersPage() {
  const bestProducts = PRODUCTS_DATA.filter((p) => p.tags?.includes("Best Seller") || p.ratings >= 4.8);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <Breadcrumbs items={[{ label: "Best Sellers" }]} />

      <div className="bg-gradient-to-r from-amber-600 to-orange-700 rounded-3xl p-6 md:p-10 text-white shadow-card space-y-2">
        <div className="inline-flex items-center space-x-1 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black">
          <Trophy className="w-3.5 h-3.5 text-amber-300" />
          <span>CUSTOMER FAVORITES</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black">Top Best Sellers</h1>
        <p className="text-xs md:text-sm text-amber-100">Over 10,000+ verified 5-star customer ratings across India.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {bestProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
