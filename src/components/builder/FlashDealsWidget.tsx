"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Clock, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { PRODUCTS_DATA } from "@/data/mock-catalog";
import { ROUTES } from "@/lib/routes";

interface FlashDealsProps {
  content?: {
    title?: string;
    subtitle?: string;
    badge?: string;
    hoursRemaining?: number;
    discountTag?: string;
    productLimit?: number;
  };
}

export function FlashDealsWidget({ content }: FlashDealsProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const limit = content?.productLimit || 4;
  const flashProducts = PRODUCTS_DATA.filter((p) => p.isFlashDeal || p.discountPercent >= 20).slice(0, limit);

  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 rounded-3xl p-4 md:p-6 text-white shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/20 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg md:text-xl font-black">{content?.title || "Live Flash Deals of the Day"}</h2>
                {content?.badge && (
                  <span className="bg-white text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {content.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-100">{content?.subtitle || "Instant discount on verified Indian products"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 self-start sm:self-auto">
            <Clock className="w-4 h-4 text-amber-300" />
            <span className="text-xs text-slate-200 font-bold">Ends in:</span>
            <div className="flex items-center space-x-1 font-mono font-black text-xs md:text-sm">
              <span className="bg-white/20 px-1.5 py-0.5 rounded">{String(timeLeft.hours).padStart(2, "0")}h</span>
              <span>:</span>
              <span className="bg-white/20 px-1.5 py-0.5 rounded">{String(timeLeft.minutes).padStart(2, "0")}m</span>
              <span>:</span>
              <span className="bg-white/20 px-1.5 py-0.5 rounded">{String(timeLeft.seconds).padStart(2, "0")}s</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {flashProducts.map((product) => (
            <div key={product.id} className="bg-white dark:bg-slate-900 rounded-2xl p-1 shadow-sm">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="pt-1 text-center">
          <Link
            href={ROUTES.flashSale}
            className="inline-flex items-center space-x-1.5 text-xs font-black bg-white text-red-700 hover:bg-slate-100 px-5 py-2.5 rounded-xl shadow transition active:scale-95"
          >
            <span>View All Flash Deals ({PRODUCTS_DATA.length}+ items)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
