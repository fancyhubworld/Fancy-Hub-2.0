"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Box, Check, XCircle } from "lucide-react";
import { PRODUCTS_DATA } from "@/data/mock-catalog";
import { ROUTES } from "@/lib/routes";
import { formatINR } from "@/lib/design-tokens";

export default function AdminProductsPage() {
  const [products, setProducts] = useState(PRODUCTS_DATA);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href={ROUTES.admin.dashboard} className="text-slate-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-black text-white">Platform Product Catalog Moderation</h1>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 space-y-4 text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-slate-300">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 uppercase font-bold">
                <th className="py-3 px-3">Product</th>
                <th className="py-3 px-3">Seller</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3">Stock</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-750">
                  <td className="py-3 px-3 font-bold text-white line-clamp-1 max-w-[220px]">{p.title}</td>
                  <td className="py-3 px-3 text-fancy-blue">{p.vendorName}</td>
                  <td className="py-3 px-3 font-black text-white">{formatINR(p.price)}</td>
                  <td className="py-3 px-3">{p.stock} units</td>
                  <td className="py-3 px-3">
                    <span className="bg-green-900/60 text-green-300 px-2 py-0.5 rounded font-black text-[10px]">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
