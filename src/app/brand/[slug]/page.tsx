"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { BRANDS_DATA, PRODUCTS_DATA } from "@/data/mock-catalog";
import { ProductCard } from "@/components/products/ProductCard";
import { Breadcrumbs, EmptyState } from "@/components/ui/StateFeedback";
import { ROUTES } from "@/lib/routes";
import { ShieldCheck } from "lucide-react";

export default function BrandDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const brand = BRANDS_DATA.find((b) => b.slug === slug) || {
    id: `b-${slug}`,
    name: "Certified Brand",
    slug,
    description: "Quality assured Indian brand on FancyHub.in.",
    logo: "https://placehold.co/200x200?text=Brand",
  };

  const products = PRODUCTS_DATA.filter((p) => p.brandSlug === slug || p.brandId === brand.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <Breadcrumbs items={[{ label: "Brands", href: ROUTES.brands }, { label: brand.name }]} />

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-card flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
        <img src={brand.logo} alt={brand.name} className="w-20 h-20 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm" />
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">{brand.name}</h1>
            <ShieldCheck className="w-5 h-5 text-fancy-blue" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">{brand.description}</p>
        </div>
      </div>

      <div>
        <h2 className="text-base font-black text-slate-900 dark:text-white mb-4">
          Brand Products ({products.length > 0 ? products.length : PRODUCTS_DATA.length})
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(products.length > 0 ? products : PRODUCTS_DATA).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
