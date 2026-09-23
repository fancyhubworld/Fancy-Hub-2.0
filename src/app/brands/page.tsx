"use client";

import React from "react";
import Link from "next/link";
import { BRANDS_DATA } from "@/data/mock-catalog";
import { Breadcrumbs } from "@/components/ui/StateFeedback";
import { ROUTES } from "@/lib/routes";
import { ShieldCheck, ChevronRight } from "lucide-react";

export default function BrandsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <Breadcrumbs items={[{ label: "Official Brands" }]} />

      <div className="bg-gradient-to-r from-slate-900 to-[#0B2A63] rounded-3xl p-6 md:p-10 text-white shadow-card space-y-2">
        <span className="bg-fancy-orange text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          Official Partner Stores
        </span>
        <h1 className="text-2xl md:text-4xl font-black">Featured Indian Brands & Makers</h1>
        <p className="text-xs md:text-sm text-slate-300">
          Shop directly from authentic certified brands with 100% brand warranty and assured quality.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BRANDS_DATA.map((brand) => (
          <div
            key={brand.id}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle hover:shadow-card transition flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start space-x-4">
              <img src={brand.logo} alt={brand.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm" />
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-black text-slate-900 dark:text-white text-base">{brand.name}</h3>
                  <ShieldCheck className="w-4 h-4 text-fancy-blue flex-shrink-0" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{brand.description}</p>
                <span className="inline-block text-[11px] font-bold text-fancy-blue mt-2">{brand.productCount} Products</span>
              </div>
            </div>

            <Link
              href={ROUTES.brand(brand.slug)}
              className="w-full py-2.5 bg-blue-50 dark:bg-slate-700 hover:bg-fancy-blue text-fancy-blue hover:text-white dark:text-blue-300 text-xs font-bold rounded-xl transition text-center flex items-center justify-center space-x-1"
            >
              <span>Explore Brand Store</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
