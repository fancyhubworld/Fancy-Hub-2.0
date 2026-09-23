"use client";

import React from "react";
import Link from "next/link";
import { PRODUCTS_DATA } from "@/data/mock-catalog";
import { Breadcrumbs } from "@/components/ui/StateFeedback";
import { formatINR } from "@/lib/design-tokens";
import { ROUTES } from "@/lib/routes";
import { Star, Check, ShoppingCart } from "lucide-react";

export default function ComparePage() {
  const compareProducts = PRODUCTS_DATA.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <Breadcrumbs items={[{ label: "Compare Products" }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">Side-by-Side Product Comparison</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Evaluate specifications, prices, and weaver warranties</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-card overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="py-4 px-4 text-slate-400 font-bold uppercase w-1/4">Feature</th>
              {compareProducts.map((p) => (
                <th key={p.id} className="py-4 px-4 text-slate-900 dark:text-white font-bold w-1/4">
                  <img src={p.images[0]?.url} alt={p.title} className="w-20 h-20 rounded-xl object-cover mb-2 border border-slate-200 dark:border-slate-700" />
                  <Link href={ROUTES.product(p.slug)} className="hover:text-fancy-blue line-clamp-2">
                    {p.title}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
            <tr>
              <td className="py-3 px-4 font-bold text-slate-500">Price (INR)</td>
              {compareProducts.map((p) => (
                <td key={p.id} className="py-3 px-4 font-black text-fancy-blue text-sm">
                  {formatINR(p.price)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-bold text-slate-500">Customer Rating</td>
              {compareProducts.map((p) => (
                <td key={p.id} className="py-3 px-4 font-bold text-green-700 flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{p.ratings} / 5.0 ({p.reviewCount})</span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-bold text-slate-500">Seller / Origin</td>
              {compareProducts.map((p) => (
                <td key={p.id} className="py-3 px-4 font-medium">
                  {p.vendorName}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-bold text-slate-500">Express Delivery</td>
              {compareProducts.map((p) => (
                <td key={p.id} className="py-3 px-4 text-green-700 font-bold">
                  {p.deliveryDays} Days Pan-India
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-bold text-slate-500">COD Available</td>
              {compareProducts.map((p) => (
                <td key={p.id} className="py-3 px-4">
                  <span className="bg-green-100 text-green-800 text-[10px] font-black px-2 py-0.5 rounded">
                    Yes, 0 Advance
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
