"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Truck } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export default function VendorShippingPage() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-4 md:p-8 space-y-6">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle flex items-center space-x-3">
        <Link href={ROUTES.vendorPortal.dashboard} className="text-slate-400 hover:text-slate-800 dark:hover:text-white">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-black text-slate-900 dark:text-white">Shipping Partners & Zones</h1>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-card space-y-4 text-xs">
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Truck className="w-6 h-6 text-fancy-blue" />
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">Delhivery Express Surface & Air</span>
              <span className="text-slate-500 text-[11px]">Primary partner for 28,000+ PIN codes</span>
            </div>
          </div>
          <span className="bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded text-[10px]">Connected</span>
        </div>
      </div>
    </div>
  );
}
