"use client";

import React from "react";
import Link from "next/link";
import { Flame } from "lucide-react";
import { PRODUCTS_DATA } from "@/data/mock-catalog";
import { ProductCard } from "@/components/products/ProductCard";
import { Breadcrumbs } from "@/components/ui/StateFeedback";
import { ROUTES } from "@/lib/routes";

export default function DealsPage() {
  const dealProducts = PRODUCTS_DATA.filter((p) => p.discountPercent >= 60);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <Breadcrumbs items={[{ label: "Festive Deals & Offers" }]} />

      <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-6 md:p-10 text-white shadow-card space-y-2">
        <div className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black">
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>UP TO 70% OFF</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black">Daily Super Deals & Discounts</h1>
        <p className="text-xs md:text-sm text-amber-100">
          Handpicked high-discount products across handloom sarees, audio, wood decor and apparel.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {dealProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
