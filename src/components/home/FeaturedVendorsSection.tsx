import React from "react";
import Link from "next/link";
import { CheckCircle2, Star, Users, ArrowRight, Store } from "lucide-react";
import { VENDORS_DATA } from "@/data/mock-catalog";

export function FeaturedVendorsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Store className="w-5 h-5 text-fancy-blue" />
            <h2 className="text-lg md:text-xl font-extrabold text-slate-900">Featured Indian Sellers</h2>
          </div>
          <p className="text-xs text-slate-500">Shop direct from verified weavers, manufacturers & tech distributors</p>
        </div>
        <Link href="/shop" className="text-xs font-bold text-fancy-blue hover:underline flex items-center space-x-1">
          <span>Explore All Sellers</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {VENDORS_DATA.slice(0, 4).map((vendor) => (
          <div
            key={vendor.id}
            className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl overflow-hidden shadow-subtle hover:shadow-card transition duration-300 flex flex-col justify-between"
          >
            {/* Banner Thumbnail */}
            <div className="h-24 w-full bg-slate-100 relative">
              <img
                src={vendor.storeBanner || "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80"}
                alt={vendor.storeName}
                className="w-full h-full object-cover"
              />
              <div className="absolute -bottom-5 left-4 w-12 h-12 rounded-xl border-2 border-white bg-white shadow-sm overflow-hidden">
                <img
                  src={vendor.storeLogo || "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=200&auto=format&fit=crop&q=80"}
                  alt={vendor.storeName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Vendor Content */}
            <div className="p-4 pt-7 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-1">
                  <h3 className="font-bold text-slate-900 text-sm">{vendor.storeName}</h3>
                  {vendor.isVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-fancy-blue flex-shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                  {vendor.storeDescription}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3">
                  <span className="flex items-center space-x-1 font-bold text-slate-700">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{vendor.rating.toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">({vendor.reviewCount})</span>
                  </span>
                  <span className="text-slate-500 font-medium">
                    {vendor.city}, {vendor.state}
                  </span>
                </div>

                <Link
                  href={`/vendor/${vendor.slug}`}
                  className="block text-center py-2 bg-slate-50 hover:bg-fancy-blue hover:text-white text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  Visit Storefront
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
