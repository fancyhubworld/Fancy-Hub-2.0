"use client";

import React from "react";
import Link from "next/link";
import { Tag, Sparkles, Flame, Percent, Gift, ArrowRight } from "lucide-react";
import { PRODUCTS_DATA, COUPONS_DATA } from "@/data/mock-catalog";
import { ProductCard } from "@/components/products/ProductCard";
import { Breadcrumbs } from "@/components/ui/StateFeedback";
import { ROUTES } from "@/lib/routes";

export default function OffersPage() {
  const offerProducts = PRODUCTS_DATA.filter((p) => p.discountPercent >= 50);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      <Breadcrumbs items={[{ label: "Special Offers & Coupons" }]} />

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-10 shadow-2xl border border-purple-500/20">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-black tracking-wider uppercase">
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>FESTIVE EXCLUSIVE OFFERS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Exclusive Deals & Instant Coupon Discounts
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Stack platform coupon codes with up to 70% manufacturer discounts on pure handlooms, gadgets, and apparel.
          </p>
        </div>
      </div>

      {/* Active Coupon Codes Strip */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <Percent className="w-4 h-4 text-purple-600" />
            <span>Active Discount Vouchers</span>
          </h2>
          <Link href={ROUTES.coupons} className="text-xs font-bold text-purple-600 hover:underline flex items-center space-x-1">
            <span>View all vouchers</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {COUPONS_DATA.slice(0, 3).map((coupon) => (
            <div
              key={coupon.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-slate-800 shadow-sm flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                  COUPON CODE
                </span>
                <span className="text-base font-black text-slate-900 dark:text-white">
                  {coupon.code}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {coupon.description}
                </p>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-black text-xs border border-purple-200 dark:border-purple-800">
                {coupon.type === "PERCENTAGE" ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* High-Discount Products Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
          <Flame className="w-4 h-4 text-amber-500 fill-current" />
          <span>Mega Discount Picks (50%+ OFF)</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {offerProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
