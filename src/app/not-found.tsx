"use client";

import React from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { Search, ShoppingBag, ArrowLeft, Store, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 md:p-12 text-center shadow-card space-y-6">
        {/* Brand Header */}
        <div className="space-y-1">
          <span className="text-5xl md:text-7xl font-black text-fancy-blue drop-shadow-sm">404</span>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
            Oops! Page Couldn&apos;t Be Found
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            The page you are looking for might have been moved, renamed, or is temporarily unavailable.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Link
            href={ROUTES.home}
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-fancy-blue hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>

          <Link
            href={ROUTES.shop}
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold text-xs rounded-xl transition active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-fancy-orange" />
            <span>Explore Catalog</span>
          </Link>
        </div>

        {/* Popular Links */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500">
          <p className="font-semibold text-slate-600 dark:text-slate-300 mb-2">Or browse popular sections:</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link href={ROUTES.categories} className="text-fancy-blue hover:underline">Categories</Link>
            <span>•</span>
            <Link href={ROUTES.flashSale} className="text-fancy-blue hover:underline">Flash Deals</Link>
            <span>•</span>
            <Link href={ROUTES.customPrint} className="text-fancy-orange font-bold hover:underline">Custom Print</Link>
            <span>•</span>
            <Link href={ROUTES.trackOrder} className="text-fancy-blue hover:underline">Track Order</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
