"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Store,
  Grid,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Star,
  MapPin,
  Package,
  Loader2,
} from "lucide-react";
import { WidgetInstance } from "@/lib/widget-types";
import { ROUTES } from "@/lib/routes";

interface WidgetProps {
  widget: WidgetInstance;
  isEditing?: boolean;
}

// Hook to fetch live database-driven categories
export function useDynamicCategories(widget: WidgetInstance) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const ds = widget.dataSource || {};
  const limit = ds.limit || widget.settings?.limit || 8;
  const parentId = ds.parentId || widget.settings?.parentId;
  const sortBy = ds.sortBy || widget.settings?.sortBy || "sort_order";

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const params = new URLSearchParams();
    params.set("type", "categories");
    params.set("limit", String(limit));
    if (parentId) params.set("parentId", parentId);
    if (sortBy) params.set("sortBy", sortBy);

    fetch(`/api/public/dynamic-data?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && data.data) {
          setCategories(data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching dynamic categories:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [limit, parentId, sortBy]);

  return { categories, loading };
}

// Hook to fetch live database-driven vendors
export function useDynamicVendors(widget: WidgetInstance) {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const limit = widget.dataSource?.limit || widget.settings?.limit || 4;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`/api/public/dynamic-data?type=vendors&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && data.data) {
          setVendors(data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching dynamic vendors:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [limit]);

  return { vendors, loading };
}

// --- 1. CATEGORY WIDGETS (DATABASE DRIVEN) ---

export function CategoryGridWidget({ widget }: WidgetProps) {
  const { title = "Explore Departments" } = widget.settings || {};
  const { categories, loading } = useDynamicCategories(widget);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-900 dark:text-white">
          {widget.title || title}
        </h3>
        <Link href="/categories" className="text-xs text-fancy-blue font-bold hover:underline">
          All Categories
        </Link>
      </div>

      {loading && categories.length === 0 ? (
        <div className="p-8 text-center text-slate-400 flex items-center justify-center space-x-2">
          <Loader2 className="w-5 h-5 animate-spin text-fancy-blue" />
          <span className="text-xs font-bold">Loading categories from database...</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group relative aspect-square rounded-3xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] text-amber-300 font-bold uppercase">{cat.count}</span>
                <h4 className="font-bold text-sm md:text-base group-hover:text-amber-300 transition">
                  {cat.name}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function CategoryCarouselWidget({ widget }: WidgetProps) {
  const { categories } = useDynamicCategories(widget);

  return (
    <div className="flex items-center space-x-4 overflow-x-auto py-2 scrollbar-none">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/category/${cat.slug}`}
          className="flex flex-col items-center space-y-1.5 flex-shrink-0 group"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full p-1 border-2 border-fancy-blue/30 group-hover:border-fancy-blue transition shadow-sm overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover rounded-full group-hover:scale-110 transition duration-300"
            />
          </div>
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-fancy-blue transition truncate max-w-[80px]">
            {cat.name}
          </span>
        </Link>
      ))}
    </div>
  );
}

export function CategoryCardsWidget(props: WidgetProps) {
  return <CategoryGridWidget {...props} />;
}

export function FeaturedCategoriesWidget(props: WidgetProps) {
  return <CategoryGridWidget {...props} />;
}

export function MegaCategoryMenuWidget({ widget }: WidgetProps) {
  const { categories } = useDynamicCategories(widget);

  return (
    <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 text-white space-y-4">
      <h4 className="font-black text-sm text-fancy-blue">Live Database Category Directory</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        {categories.map((c) => (
          <div key={c.slug} className="space-y-1.5">
            <Link
              href={`/category/${c.slug}`}
              className="font-bold text-white block border-b border-slate-700 pb-1 hover:text-fancy-blue"
            >
              {c.name}
            </Link>
            <span className="text-slate-400 block text-[11px]">{c.count} in store</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 2. VENDOR WIDGETS (DATABASE DRIVEN) ---

export function VendorGridWidget({ widget }: WidgetProps) {
  const { title = "Verified Indian Weavers & Artisans", subtitle = "Shop direct from certified textile hubs" } = widget.settings || {};
  const { vendors, loading } = useDynamicVendors(widget);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            {widget.title || title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
        </div>
        <Link href="/vendors" className="text-xs text-fancy-blue font-bold hover:underline">
          View All Vendors
        </Link>
      </div>

      {loading && vendors.length === 0 ? (
        <div className="p-8 text-center text-slate-400 flex items-center justify-center space-x-2">
          <Loader2 className="w-5 h-5 animate-spin text-fancy-blue" />
          <span className="text-xs font-bold">Loading verified sellers...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vendors.map((v) => (
            <div
              key={v.id}
              className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden shadow-md group hover:border-fancy-blue transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-24 bg-slate-900 overflow-hidden">
                  <img src={v.banner} alt={v.name} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition duration-500" />
                  <span className="absolute top-2 right-2 text-[9px] font-black uppercase px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                    {v.badge}
                  </span>
                </div>
                <div className="p-4 relative pt-0">
                  <div className="w-12 h-12 rounded-2xl border-2 border-white dark:border-slate-800 shadow -mt-6 overflow-hidden bg-slate-900">
                    <img src={v.avatar} alt={v.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="mt-2 space-y-1">
                    <h4 className="font-black text-sm text-slate-900 dark:text-white group-hover:text-fancy-blue transition">
                      {v.name}
                    </h4>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3 h-3 text-red-400" />
                      <span>{v.city}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/60 mt-2 text-xs">
                <div className="flex items-center space-x-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{v.rating}</span>
                  <span className="text-slate-400 font-normal">({v.productsCount} items)</span>
                </div>
                <Link
                  href={`/vendor/${v.slug}`}
                  className="px-3 py-1 bg-fancy-blue/10 hover:bg-fancy-blue hover:text-white text-fancy-blue rounded-xl font-bold transition"
                >
                  Visit Store →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TopVendorsWidget(props: WidgetProps) {
  return <VendorGridWidget {...props} />;
}

export function FeaturedVendorsWidget(props: WidgetProps) {
  return <VendorGridWidget {...props} />;
}

export function VendorStoreCardWidget(props: WidgetProps) {
  return <VendorGridWidget {...props} />;
}

export function VendorProductsWidget(props: WidgetProps) {
  return <VendorGridWidget {...props} />;
}
