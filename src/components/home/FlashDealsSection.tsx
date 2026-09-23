"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Clock, ArrowRight } from "lucide-react";
import { PRODUCTS_DATA } from "@/data/mock-catalog";
import { ProductCard } from "@/components/products/ProductCard";

export function FlashDealsSection() {
  // Countdown timer initialized to 2h 45m 18s
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashProducts = PRODUCTS_DATA.filter((p) => p.isFlashDeal || p.discountPercent >= 60);

  const formatDigit = (num: number) => num.toString().padStart(2, "0");

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 rounded-3xl p-4 md:p-6 shadow-elevated text-white mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300">
              <Zap className="w-6 h-6 fill-current animate-bounce" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black bg-white text-red-600 uppercase px-2 py-0.5 rounded-full tracking-wider">
                  Live Now
                </span>
                <h2 className="text-xl md:text-2xl font-black tracking-tight">
                  Flash Deals of the Day
                </h2>
              </div>
              <p className="text-xs text-amber-100 mt-0.5">
                Up to 70% discount on top tech, sarees & custom merchandise • Limited stock
              </p>
            </div>
          </div>

          {/* Countdown Clock Display */}
          <div className="flex items-center space-x-3 bg-black/30 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 self-start md:self-auto">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-300">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Ends In:</span>
            </div>
            <div className="flex items-center space-x-1.5 font-mono text-sm md:text-base font-black">
              <span className="bg-white text-slate-900 px-2 py-1 rounded-lg">
                {formatDigit(timeLeft.hours)}
              </span>
              <span>:</span>
              <span className="bg-white text-slate-900 px-2 py-1 rounded-lg">
                {formatDigit(timeLeft.minutes)}
              </span>
              <span>:</span>
              <span className="bg-white text-slate-900 px-2 py-1 rounded-lg text-red-600">
                {formatDigit(timeLeft.seconds)}
              </span>
            </div>
            <Link
              href="/flash-sale"
              className="ml-2 text-xs font-bold text-white hover:text-amber-200 underline hidden lg:inline"
            >
              View All
            </Link>
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {flashProducts.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
