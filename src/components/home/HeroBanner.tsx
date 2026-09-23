"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, Clock, ArrowRight } from "lucide-react";
import { BANNERS_DATA } from "@/data/mock-catalog";

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroBanners = BANNERS_DATA.filter((b) => b.position === "HERO" && b.isActive);
  const sideBanner = BANNERS_DATA.find((b) => b.position === "SIDE" && b.isActive);

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroBanners.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);

  return (
    <section className="max-w-7xl mx-auto px-4 pt-4 pb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Main Hero Slider (8 cols on desktop) */}
        <div className="lg:col-span-8 relative rounded-2xl md:rounded-3xl overflow-hidden shadow-card min-h-[300px] md:min-h-[380px] bg-slate-900 flex items-center">
          {heroBanners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Background Image with Dark Gradient Overlay */}
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover object-center transform scale-105 transition duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B2A63]/90 via-[#0B2A63]/70 to-transparent flex items-center p-6 md:p-12">
                <div className="max-w-md text-white space-y-3">
                  {banner.badgeText && (
                    <div className="inline-flex items-center space-x-1.5 bg-fancy-orange text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{banner.badgeText}</span>
                    </div>
                  )}

                  <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm">
                    {banner.title}
                  </h1>

                  <p className="text-xs md:text-sm text-slate-200 font-medium leading-relaxed">
                    {banner.subtitle}
                  </p>

                  <div className="pt-2 flex items-center space-x-3">
                    <Link
                      href={banner.ctaLink}
                      className="inline-flex items-center space-x-2 bg-fancy-orange hover:bg-orange-600 text-white font-extrabold text-xs md:text-sm px-6 py-3 rounded-xl shadow-elevated transition transform active:scale-95"
                    >
                      <span>{banner.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    {banner.discountTag && (
                      <span className="text-xs md:text-sm font-bold bg-white/20 backdrop-blur-md px-3 py-2.5 rounded-xl border border-white/20 text-amber-300">
                        {banner.discountTag}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Slider Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
            {heroBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentSlide ? "w-6 bg-fancy-orange" : "w-2 bg-white/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Side Spotlight Banner (4 cols on desktop, hidden on very small screens) */}
        {sideBanner && (
          <div className="lg:col-span-4 relative rounded-2xl md:rounded-3xl overflow-hidden shadow-card bg-gradient-to-br from-amber-600 to-orange-700 text-white p-6 flex flex-col justify-between min-h-[220px] lg:min-h-[380px]">
            <img
              src={sideBanner.imageUrl}
              alt={sideBanner.title}
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
            />
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center space-x-1 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase text-amber-200">
                <Clock className="w-3 h-3 mr-1" />
                <span>Weaver Spotlight</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black leading-snug">
                {sideBanner.title}
              </h2>
              <p className="text-xs text-amber-100">
                {sideBanner.subtitle}
              </p>
            </div>

            <div className="relative z-10 pt-4">
              <div className="bg-black/30 backdrop-blur-md p-3 rounded-2xl border border-white/10 mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase text-amber-300 font-bold">Deal of the Day</p>
                  <p className="text-sm font-extrabold text-white">Flat 65% OFF</p>
                </div>
                <span className="text-xs bg-fancy-orange text-white font-black px-2.5 py-1 rounded-lg">
                  FAST SHIP
                </span>
              </div>
              <Link
                href={sideBanner.ctaLink}
                className="w-full text-center block bg-white hover:bg-slate-100 text-orange-950 font-extrabold text-xs py-3 rounded-xl shadow transition"
              >
                {sideBanner.ctaText}
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
