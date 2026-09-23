"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Store } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export default function VendorStorePage() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-4 md:p-8 space-y-6">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href={ROUTES.vendorPortal.dashboard} className="text-slate-400 hover:text-slate-800 dark:hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Storefront Customization</h1>
        </div>
        <Link
          href={ROUTES.vendor("surat-silk-mills")}
          target="_blank"
          className="py-2 px-4 bg-fancy-blue text-white text-xs font-bold rounded-xl shadow"
        >
          View Public Store →
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-card space-y-4 text-xs">
        <p className="text-slate-500">Configure your store logo, banner, return policies and story.</p>
        <div className="flex space-x-3">
          <Link href={ROUTES.vendorPortal.storeSettings} className="font-bold text-fancy-blue underline">Store Settings</Link>
          <Link href={ROUTES.vendorPortal.storeSeo} className="font-bold text-fancy-blue underline">Store SEO</Link>
        </div>
      </div>
    </div>
  );
}
