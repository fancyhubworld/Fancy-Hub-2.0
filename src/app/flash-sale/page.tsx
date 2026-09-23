"use client";

import React, { useState, useEffect } from "react";
import { Zap, Clock } from "lucide-react";
import { PRODUCTS_DATA } from "@/data/mock-catalog";
import { ProductCard } from "@/components/products/ProductCard";
import { Breadcrumbs } from "@/components/ui/StateFeedback";

export default function FlashSalePage() {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashProducts = PRODUCTS_DATA.filter((p) => p.isFlashDeal);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <Breadcrumbs items={[{ label: "Live Flash Sale" }]} />

      <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-3xl p-6 md:p-10 text-white shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>LIMITED QUANTITY LIGHTNING DEALS</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black">Diwali Live Flash Sale</h1>
          <p className="text-xs md:text-sm text-red-100">Massive price drops refreshed every 3 hours. Claim before stock ends!</p>
        </div>

        <div className="bg-black/30 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center space-x-3">
          <Clock className="w-5 h-5 text-amber-300 animate-pulse" />
          <div>
            <span className="text-[10px] uppercase font-bold text-red-200 block">Offer Ends In:</span>
            <div className="text-xl md:text-2xl font-mono font-black text-white">
              {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {flashProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
