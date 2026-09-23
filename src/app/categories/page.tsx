"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { useCategories } from "@/lib/use-categories";
import { ROUTES } from "@/lib/routes";
import { Breadcrumbs, EmptyState, LoadingSpinner } from "@/components/ui/StateFeedback";

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const { categoryTree, isLoading } = useCategories();

  const filteredCategories = categoryTree.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.children?.some((s) => s.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <Breadcrumbs items={[{ label: "All Categories" }]} />

      <div className="bg-gradient-to-r from-blue-900 to-[#0B2A63] rounded-3xl p-6 md:p-10 text-white shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="bg-fancy-orange text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Marketplace Hierarchy
          </span>
          <h1 className="text-2xl md:text-4xl font-black">Browse All Categories</h1>
          <p className="text-xs md:text-sm text-slate-200">
            Explore authentic Indian goods across handlooms, audio tech, solid wood home decor & custom print studios.
          </p>
        </div>

        <div className="w-full md:w-80">
          <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-3 py-2.5 text-white">
            <Search className="w-4 h-4 text-slate-300 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search category or craft..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-300 outline-none"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle hover:shadow-card transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-blue-50 dark:bg-slate-700 flex-shrink-0 border border-slate-200 dark:border-slate-600">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-fancy-blue/10 text-fancy-blue font-bold">
                        {cat.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <Link
                      href={`/category/${cat.fullPath}`}
                      className="font-black text-slate-900 dark:text-white text-base hover:text-fancy-blue transition line-clamp-1"
                    >
                      {cat.name}
                    </Link>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                      {cat.description || "Discover verified vendor collections on FancyHub."}
                    </p>
                  </div>
                </div>

                {cat.children && cat.children.length > 0 && (
                  <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Sub-departments
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {cat.children.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/category/${sub.fullPath}`}
                          className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-fancy-blue hover:bg-blue-50 dark:hover:bg-slate-700/60 p-2 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-between transition"
                        >
                          <span className="truncate">{sub.name}</span>
                          <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href={`/category/${cat.fullPath}`}
                className="w-full py-2.5 bg-blue-50 dark:bg-slate-700 hover:bg-fancy-blue text-fancy-blue hover:text-white dark:text-blue-300 text-xs font-bold rounded-xl transition text-center"
              >
                View Full {cat.name} Catalog →
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Categories Matching Your Search"
          description="Try searching for another term like Fashion, Audio, Kitchen or Handlooms."
          actionText="Clear Search"
          actionHref={ROUTES.categories}
        />
      )}
    </div>
  );
}
