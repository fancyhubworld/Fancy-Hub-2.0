"use client";

import React from "react";
import Link from "next/link";
import { Heart, ChevronRight, ShoppingCart } from "lucide-react";
import { useMarketplace } from "@/lib/context";
import { PRODUCTS_DATA } from "@/data/mock-catalog";
import { ProductCard } from "@/components/products/ProductCard";

export default function AccountWishlistPage() {
  const { wishlist } = useMarketplace();
  const wishlistProducts = PRODUCTS_DATA.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href="/account" className="hover:text-fancy-blue">My Account</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold">Saved Wishlist</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900">
            My Wishlist ({wishlistProducts.length} Saved Items)
          </h1>
          <p className="text-xs text-slate-500">Save items you love and get instant alerts on price drops and stock</p>
        </div>
      </div>

      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlistProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-subtle space-y-3">
          <Heart className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Your Wishlist is Empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">Explore top Indian fashion, ANC tech, and custom print items to save for later.</p>
          <Link href="/shop" className="inline-block bg-fancy-blue text-white text-xs font-bold px-6 py-2.5 rounded-xl">
            Explore Products
          </Link>
        </div>
      )}
    </div>
  );
}
