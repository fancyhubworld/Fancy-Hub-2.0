"use client";

import React from "react";
import Link from "next/link";
import { useMarketplace } from "@/lib/context";
import { PRODUCTS_DATA } from "@/data/mock-catalog";
import { ProductCard } from "@/components/products/ProductCard";
import { Breadcrumbs, EmptyState } from "@/components/ui/StateFeedback";
import { ROUTES } from "@/lib/routes";

export default function WishlistPage() {
  const { wishlist } = useMarketplace();
  const wishProducts = PRODUCTS_DATA.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <Breadcrumbs items={[{ label: "My Wishlist" }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">Saved Wishlist</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">{wishProducts.length} items saved for later</p>
        </div>
      </div>

      {wishProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Your Wishlist is Empty"
          description="Explore our marketplace and click the heart icon on any saree, gadget or woodcraft to save it."
          actionText="Discover Products"
          actionHref={ROUTES.shop}
        />
      )}
    </div>
  );
}
