"use client";

import React from "react";
import { useParams } from "next/navigation";
import { TAGS_DATA, PRODUCTS_DATA } from "@/data/mock-catalog";
import { ProductCard } from "@/components/products/ProductCard";
import { Breadcrumbs, EmptyState } from "@/components/ui/StateFeedback";
import { ROUTES } from "@/lib/routes";
import { Tag } from "lucide-react";

export default function TagProductsPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const tag = TAGS_DATA.find((t) => t.slug === slug) || {
    id: `tag-${slug}`,
    name: slug.replace(/-/g, " ").toUpperCase(),
    slug,
    description: `Browse all products tagged with ${slug}.`,
    color: "bg-fancy-blue text-white",
  };

  const products = PRODUCTS_DATA.filter(
    (p) => p.tagSlugs?.includes(slug) || p.tags?.some((t) => t.toLowerCase() === tag.name.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <Breadcrumbs items={[{ label: "Tags" }, { label: tag.name }]} />

      <div className="bg-gradient-to-r from-blue-900 to-[#0B2A63] text-white rounded-3xl p-6 md:p-10 shadow-card space-y-2">
        <div className="inline-flex items-center space-x-1.5 bg-fancy-orange px-3 py-1 rounded-full text-xs font-black">
          <Tag className="w-3.5 h-3.5" />
          <span>TAGGED COLLECTION</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black">{tag.name}</h1>
        <p className="text-xs md:text-sm text-slate-200">{tag.description}</p>
      </div>

      <div>
        <h2 className="text-base font-black text-slate-900 dark:text-white mb-4">
          Showing {products.length > 0 ? products.length : PRODUCTS_DATA.length} Products
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
