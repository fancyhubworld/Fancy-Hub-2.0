"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface BannerItem {
  badge?: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  bgGradient?: string;
  imageUrl?: string;
}

interface PromoBannersProps {
  content?: {
    layout?: "2-col" | "3-col" | "banner-split";
    banners?: BannerItem[];
  };
}

export function PromoBannersWidget({ content }: PromoBannersProps) {
  const banners = content?.banners || [];
  if (!banners.length) return null;

  const layout = content?.layout || "banner-split";
  const gridClass =
    layout === "3-col"
      ? "grid-cols-1 md:grid-cols-3"
      : layout === "2-col"
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1";

  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className={`grid ${gridClass} gap-4`}>
        {banners.map((b, idx) => (
          <div
            key={idx}
            className={`relative rounded-3xl overflow-hidden p-6 md:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-card bg-gradient-to-r ${
              b.bgGradient || "from-amber-500 via-orange-500 to-red-600"
            }`}
          >
            <div className="space-y-2 max-w-xl z-10">
              {b.badge && (
                <span className="inline-flex items-center space-x-1 bg-white/20 text-white font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                  <Sparkles className="w-3 h-3" />
                  <span>{b.badge}</span>
                </span>
              )}
              <h3 className="text-xl md:text-2xl lg:text-3xl font-black leading-tight">
                {b.title}
              </h3>
              {b.subtitle && <p className="text-xs md:text-sm text-white/90">{b.subtitle}</p>}
            </div>

            <div className="z-10 self-start md:self-auto">
              <Link
                href={b.ctaLink || "/shop"}
                className="inline-flex items-center space-x-1.5 bg-white hover:bg-slate-100 text-slate-900 px-5 py-3 rounded-2xl font-black text-xs md:text-sm shadow-md transition whitespace-nowrap active:scale-95"
              >
                <span>{b.ctaText || "Explore Collection →"}</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
