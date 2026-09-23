"use client";

import React from "react";
import Link from "next/link";
import { useCategories } from "@/lib/use-categories";
import { ROUTES } from "@/lib/routes";
import {
  Shirt,
  Smartphone,
  Laptop,
  Home,
  Sparkles,
  Printer,
  Footprints,
  Watch,
  Dumbbell,
  Baby,
  Car,
  BookOpen,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Shirt,
  Smartphone,
  Laptop,
  Home,
  Sparkles,
  Printer,
  Footprints,
  Watch,
  Dumbbell,
  Baby,
  Car,
  BookOpen,
};

export function CategoryIconsStrip() {
  const { homepageCategories, isLoading } = useCategories();

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white">Explore Top Categories</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Curated Indian collections at honest factory prices</p>
        </div>
        <Link href={ROUTES.categories} className="text-xs font-bold text-fancy-blue hover:underline">
          View All Categories →
        </Link>
      </div>

      {/* Dynamic Horizontal Scrollable Category Cards */}
      <div className="flex items-center space-x-4 md:space-x-6 overflow-x-auto no-scrollbar pb-2 pt-1">
        {homepageCategories.map((cat) => {
          const IconComponent = (cat.icon && ICON_MAP[cat.icon]) || Sparkles;
          return (
            <Link
              key={cat.id}
              href={`/category/${cat.fullPath}`}
              className="flex flex-col items-center flex-shrink-0 group w-[76px] md:w-[92px]"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-b from-slate-50 to-blue-50/50 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200 dark:border-slate-700 group-hover:border-fancy-blue group-hover:shadow-card p-1 transition duration-300 flex items-center justify-center relative overflow-hidden">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full rounded-full object-cover group-hover:scale-110 transition duration-300"
                  />
                ) : (
                  <IconComponent className="w-7 h-7 text-fancy-blue group-hover:scale-110 transition duration-300" />
                )}
              </div>
              <span className="text-[11px] md:text-xs font-bold text-slate-800 dark:text-slate-200 text-center mt-2 group-hover:text-fancy-blue transition line-clamp-1">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
