"use client";

import React from "react";
import Link from "next/link";
import { VENDORS_DATA } from "@/data/mock-catalog";
import { Breadcrumbs } from "@/components/ui/StateFeedback";
import { ROUTES } from "@/lib/routes";
import { Store, CheckCircle2, Star, MapPin, ArrowRight } from "lucide-react";

export default function VendorsDirectoryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <Breadcrumbs items={[{ label: "Verified Indian Sellers" }]} />

      <div className="bg-gradient-to-r from-[#0B2A63] to-blue-900 rounded-3xl p-6 md:p-10 text-white shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Verified Indian Weavers & Makers
          </span>
          <h1 className="text-2xl md:text-4xl font-black">Marketplace Seller Directory</h1>
          <p className="text-xs md:text-sm text-slate-200">
            Direct commerce connecting buyers to master craftsmen from Surat, Mumbai, Jaipur, Bengaluru & Delhi.
          </p>
        </div>

        <Link
          href={ROUTES.vendorPortal.register}
          className="bg-fancy-orange hover:bg-orange-600 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-elevated whitespace-nowrap self-start sm:self-auto transition"
        >
          Become a Seller →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {VENDORS_DATA.map((vendor) => (
          <div
            key={vendor.id}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle hover:shadow-card transition flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <img src={vendor.storeLogo} alt={vendor.storeName} className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm" />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="font-black text-slate-900 dark:text-white text-base">{vendor.storeName}</h3>
                    {vendor.isVerified && <CheckCircle2 className="w-4 h-4 text-fancy-blue" />}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <div className="flex items-center space-x-1 text-green-700 font-bold">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{vendor.rating}</span>
                    </div>
                    <span>•</span>
                    <span className="flex items-center space-x-0.5">
                      <MapPin className="w-3 h-3" />
                      <span>{vendor.city}, {vendor.state}</span>
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{vendor.storeDescription}</p>
            </div>

            <Link
              href={ROUTES.vendor(vendor.slug)}
              className="w-full py-2.5 bg-blue-50 dark:bg-slate-700 hover:bg-fancy-blue text-fancy-blue hover:text-white dark:text-blue-300 text-xs font-bold rounded-xl transition text-center flex items-center justify-center space-x-1"
            >
              <span>Visit Storefront</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
