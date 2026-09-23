"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export default function VendorStoreSeoPage() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-4 md:p-8 space-y-6">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle flex items-center space-x-3">
        <Link href={ROUTES.vendorPortal.dashboard} className="text-slate-400 hover:text-slate-800 dark:hover:text-white">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-black text-slate-900 dark:text-white">Store Search Engine Optimization (SEO)</h1>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-card max-w-2xl space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Meta SEO Title</label>
          <input
            type="text"
            defaultValue="Surat Silk Mills — Authentic Banarasi & Kanjivaram Sarees on FancyHub"
            className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white outline-none"
          />
        </div>
        <button className="py-2.5 px-6 bg-fancy-blue text-white font-bold rounded-xl shadow">
          Save SEO Meta
        </button>
      </div>
    </div>
  );
}
