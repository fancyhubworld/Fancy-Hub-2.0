"use client";

import React from "react";
import Link from "next/link";
import { Store, CheckCircle, ArrowRight, Star } from "lucide-react";
import { VENDORS_DATA } from "@/data/mock-catalog";
import { ROUTES } from "@/lib/routes";

interface VendorSpotlightProps {
  content?: {
    title?: string;
    subtitle?: string;
    limit?: number;
  };
}

export function VendorSpotlightWidget({ content }: VendorSpotlightProps) {
  const limit = content?.limit || 4;
  const vendors = VENDORS_DATA.slice(0, limit);

  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Store className="w-4 h-4 text-fancy-blue" />
            <h2 className="text-base md:text-xl font-black text-slate-900 dark:text-white">
              {content?.title || "Featured Indian Artisans & Sellers"}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {content?.subtitle || "Shop directly from certified textile hubs and innovators across India"}
          </p>
        </div>

        <Link
          href={ROUTES.vendors}
          className="text-xs font-bold text-fancy-blue hover:underline flex items-center space-x-1"
        >
          <span>All Sellers</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {vendors.map((vendor) => (
          <Link
            key={vendor.id}
            href={ROUTES.vendor(vendor.slug)}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-card hover:shadow-card-hover transition duration-300 flex flex-col justify-between"
          >
            <div className="flex items-start space-x-3.5">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0">
                <img
                  src={vendor.storeLogo || "https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&auto=format&fit=crop&q=80"}
                  alt={vendor.storeName}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-fancy-blue transition-colors">
                    {vendor.storeName}
                  </h3>
                  {vendor.isVerified && (
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20 flex-shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {vendor.city}, {vendor.state}
                </p>
                <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold mt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{vendor.rating}</span>
                  <span className="text-slate-400 font-normal">({vendor.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-fancy-blue font-bold group-hover:underline">Visit Storefront</span>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-medium">
                {vendor.planName || "Verified Partner"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
