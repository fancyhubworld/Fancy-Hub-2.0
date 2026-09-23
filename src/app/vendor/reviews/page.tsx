"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Star } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export default function VendorReviewsPage() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-4 md:p-8 space-y-6">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle flex items-center space-x-3">
        <Link href={ROUTES.vendorPortal.dashboard} className="text-slate-400 hover:text-slate-800 dark:hover:text-white">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-black text-slate-900 dark:text-white">Store Ratings & Buyer Reviews</h1>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-card space-y-4 text-xs">
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-900 dark:text-white">Pure Banarasi Silk Saree</span>
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            Beautiful zari finish and soft silk fabric! Arrived in 2 days at Surat.
          </p>
          <span className="text-[10px] text-slate-400">By Priya Patel • 22 Aug 2026</span>
        </div>
      </div>
    </div>
  );
}
