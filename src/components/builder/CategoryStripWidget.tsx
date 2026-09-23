"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useCategories } from "@/lib/use-categories";
import { ROUTES } from "@/lib/routes";

interface CategoryStripProps {
  content?: {
    style?: "circular" | "cards" | "grid";
    title?: string;
    showAllLink?: boolean;
    maxItems?: number;
  };
}

export function CategoryStripWidget({ content }: CategoryStripProps) {
  const { homepageCategories, categoryTree, isLoading } = useCategories();
  const rootList = homepageCategories.length > 0 ? homepageCategories : categoryTree;
  const maxItems = content?.maxItems || 8;
  const items = rootList.slice(0, maxItems);

  if (isLoading && !rootList.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex space-x-4 overflow-x-auto no-scrollbar py-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-20 flex flex-col items-center space-y-2 animate-pulse">
              <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="w-12 h-3 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      {content?.title && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base md:text-lg font-black text-slate-900 dark:text-white">
            {content.title}
          </h2>
          {content.showAllLink && (
            <Link
              href={ROUTES.categories}
              className="text-xs font-bold text-fancy-blue hover:underline flex items-center space-x-1"
            >
              <span>All Categories</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      )}

      <div className="flex space-x-4 md:space-x-6 overflow-x-auto no-scrollbar py-1">
        {items.map((cat) => {
          const href = ROUTES.category(cat.fullPath || cat.slug);
          return (
            <Link
              key={cat.id}
              href={href}
              className="group flex-shrink-0 flex flex-col items-center space-y-2 text-center"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full p-0.5 bg-gradient-to-tr from-fancy-blue via-indigo-500 to-fancy-orange shadow-sm group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-slate-900 border-2 border-white dark:border-slate-800 flex items-center justify-center">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-xs font-black text-fancy-blue">
                      {cat.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-fancy-blue transition-colors max-w-[80px] truncate">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
