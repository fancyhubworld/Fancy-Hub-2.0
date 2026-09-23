"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";

interface SlideItem {
  id?: string;
  badge?: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl: string;
  gradient?: string;
}

interface HeroSliderProps {
  content: {
    autoplay?: boolean;
    intervalSeconds?: number;
    slides: SlideItem[];
  };
}

export function HeroSliderWidget({ content }: HeroSliderProps) {
  const slides = content?.slides || [];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!content.autoplay || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, (content.intervalSeconds || 5) * 1000);
    return () => clearInterval(interval);
  }, [content.autoplay, content.intervalSeconds, slides.length]);

  if (!slides.length) return null;
  const slide = slides[current];

  return (
    <div className="max-w-7xl mx-auto px-4 pt-3 pb-2">
      <div className="relative rounded-3xl overflow-hidden min-h-[360px] md:min-h-[440px] flex items-center shadow-card bg-slate-900 border border-slate-200/50 dark:border-slate-800">
        {/* Background Image with Fallback */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-105"
          style={{ backgroundImage: `url(${slide.imageUrl})` }}
        />

        {/* Dynamic Gradient Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${
            slide.gradient || "from-slate-950/90 via-slate-900/75 to-transparent"
          }`}
        />

        {/* Content Box */}
        <div className="relative z-10 max-w-xl p-6 md:p-12 text-white space-y-4">
          {slide.badge && (
            <span className="inline-flex items-center space-x-1.5 bg-fancy-orange/90 text-slate-950 px-3 py-1 rounded-full font-black text-xs uppercase tracking-wider shadow-sm animate-badge-glow">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{slide.badge}</span>
            </span>
          )}

          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight drop-shadow-md">
            {slide.title}
          </h1>

          {slide.subtitle && (
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed max-w-md drop-shadow">
              {slide.subtitle}
            </p>
          )}

          {slide.ctaText && (
            <div className="pt-2">
              <Link
                href={slide.ctaLink || "/shop"}
                className="inline-flex items-center space-x-2 bg-fancy-blue hover:bg-blue-700 text-white font-black text-xs md:text-sm px-6 py-3.5 rounded-2xl shadow-lg transition-transform active:scale-95"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={() => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Pagination Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-10">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? "w-7 bg-fancy-orange" : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
