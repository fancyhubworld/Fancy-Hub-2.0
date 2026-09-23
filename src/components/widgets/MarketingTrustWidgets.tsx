"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  Ticket,
  Timer,
  Megaphone,
  Mail,
  Truck,
  CreditCard,
  ShieldCheck,
  RotateCcw,
  Check,
  Copy,
  ArrowRight,
  Shield,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { WidgetInstance } from "@/lib/widget-types";

interface WidgetProps {
  widget: WidgetInstance;
  isEditing?: boolean;
}

// --- 1. MARKETING WIDGETS ---

export function HeroBannerWidget({ widget }: WidgetProps) {
  const { slides, sideBanners, autoplay = true, intervalSeconds = 5 } = widget.settings || {};

  const defaultSlides = [
    {
      id: "slide-1",
      badge: "FESTIVE SALE 2026",
      title: "Pure Banarasi & Kanchipuram Silk Sarees",
      subtitle: "Direct from master weavers across Surat & Varanasi. Up to 60% OFF with verified Silk Mark.",
      ctaText: "Shop Handloom Drop",
      ctaLink: "/category/womenswear",
      imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&auto=format&fit=crop&q=80",
    },
    {
      id: "slide-2",
      badge: "NEW LAUNCH",
      title: "5G Flagship Smartphones & ANC Audio",
      subtitle: "Official 1-year brand warranty with express 2-day doorstep dispatch to 19,000+ Indian pincodes.",
      ctaText: "Explore Tech Deals",
      ctaLink: "/category/mobile-phones",
      imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1600&auto=format&fit=crop&q=80",
    },
    {
      id: "slide-3",
      badge: "CUSTOM PRINT STUDIO",
      title: "Personalized Apparel & Custom Merch",
      subtitle: "Design premium cotton t-shirts, oversized hoodies & tote bags with live 3D mockup generator.",
      ctaText: "Start Designing",
      ctaLink: "/custom-print",
      imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1600&auto=format&fit=crop&q=80",
    },
  ];

  const defaultSideBanners = [
    {
      id: "side-1",
      badge: "TOP TRENDING",
      title: "ANC Wireless Earbuds",
      subtitle: "Starting ₹1,499 • Flat 50% Off",
      ctaText: "Shop Audio",
      ctaLink: "/deals",
      imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "side-2",
      badge: "ARTISAN GUILD",
      title: "Handmade Home Decor",
      subtitle: "Solid Sheesham & Brass Artefacts",
      ctaText: "Discover Crafts",
      ctaLink: "/category/home-decor",
      imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80",
    },
  ];

  const activeSlides = (slides && slides.length > 0) ? slides : defaultSlides;
  const activeSideBanners = (sideBanners && sideBanners.length > 0) ? sideBanners : defaultSideBanners;

  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  // Autoplay with tab visibility pause
  React.useEffect(() => {
    if (!autoplay || isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
    }, (intervalSeconds || 5) * 1000);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [autoplay, isPaused, activeSlides.length, intervalSeconds]);

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
  };

  const currentSlide = activeSlides[currentSlideIndex] || activeSlides[0];

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 items-stretch">
      {/* 1. Main Hero Carousel (2/3 width on Desktop, full width on Mobile) */}
      <div
        className="relative lg:col-span-2 rounded-3xl overflow-hidden shadow-2xl min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] flex items-center bg-slate-900 border border-slate-800 group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        role="region"
        aria-label="Hero Carousel"
      >
        {/* Background Image with Smooth Crossfade */}
        <img
          src={currentSlide.imageUrl}
          alt={currentSlide.title}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-45 transition-all duration-700 ease-out group-hover:scale-105"
        />
        {/* Gradient Overlay for Readable Typography */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent lg:hidden" />

        {/* Content Box */}
        <div className="relative z-10 max-w-xl p-6 sm:p-8 md:p-12 space-y-4">
          {currentSlide.badge && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentSlide.badge}</span>
            </span>
          )}

          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white leading-[1.15] tracking-tight line-clamp-2">
            {currentSlide.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-lg line-clamp-3">
            {currentSlide.subtitle}
          </p>

          <div className="pt-2 flex items-center space-x-4">
            <Link
              href={currentSlide.ctaLink || "/shop"}
              className="px-6 py-3.5 bg-gradient-to-r from-fancy-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl active:scale-95 transition-all flex items-center space-x-2"
            >
              <span>{currentSlide.ctaText || "Explore Catalog"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/deals"
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl backdrop-blur-md transition"
            >
              View Flash Deals
            </Link>
          </div>
        </div>

        {/* Previous / Next Arrow Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm border border-white/10"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm border border-white/10"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Pagination Indicator Bullets */}
        <div className="absolute bottom-4 left-6 sm:left-8 md:left-12 z-20 flex items-center space-x-2">
          {activeSlides.map((_: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlideIndex === idx
                  ? "w-8 bg-fancy-orange shadow"
                  : "w-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 2. Secondary Promotional Stack (1/3 width on Desktop, 2-column or hidden on narrow mobile) */}
      <div className="hidden lg:flex flex-col justify-between gap-4 h-full">
        {activeSideBanners.slice(0, 2).map((banner: any, idx: number) => (
          <div
            key={banner.id || idx}
            className="relative flex-1 rounded-3xl overflow-hidden shadow-lg p-6 flex flex-col justify-between bg-slate-900 border border-slate-800 group min-h-[220px]"
          >
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

            <div className="relative z-10 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-mono inline-block">
                {banner.badge}
              </span>
              <h3 className="text-lg font-black text-white line-clamp-1">{banner.title}</h3>
              <p className="text-xs text-slate-300 line-clamp-1">{banner.subtitle}</p>
            </div>

            <div className="relative z-10 pt-2">
              <Link
                href={banner.ctaLink || "/shop"}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 group-hover:underline"
              >
                <span>{banner.ctaText || "Explore"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PromoBannerWidget({ widget }: WidgetProps) {
  const { banners } = widget.settings || {};
  const list = banners || [
    {
      badge: "NEW LAUNCH",
      title: "ANC Audio & Earbuds",
      subtitle: "Starting ₹1,499",
      ctaText: "Explore Audio",
      ctaLink: "/deals",
      imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
    },
    {
      badge: "EXCLUSIVE",
      title: "Custom Print Studio",
      subtitle: "T-Shirts & Hoodies",
      ctaText: "Design Now",
      ctaLink: "/custom-print",
      imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {list.map((b: any, idx: number) => (
        <div
          key={idx}
          className="relative rounded-3xl overflow-hidden shadow-lg p-6 min-h-[180px] flex flex-col justify-between bg-slate-900 border border-slate-800 group"
        >
          <img src={b.imageUrl} alt={b.title} className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition duration-500" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
          <div className="relative z-10 space-y-1">
            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-mono">
              {b.badge}
            </span>
            <h3 className="text-lg font-black text-white">{b.title}</h3>
            <p className="text-xs text-slate-300">{b.subtitle}</p>
          </div>
          <div className="relative z-10 pt-3">
            <Link href={b.ctaLink || "/shop"} className="text-xs font-bold text-fancy-blue hover:underline flex items-center space-x-1">
              <span>{b.ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CouponBannerWidget({ widget }: WidgetProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
      <div className="flex items-center space-x-2">
        <Ticket className="w-5 h-5 text-amber-400" />
        <h3 className="text-base font-black text-white">Exclusive Discount Vouchers</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { code: "FANCYFIRST", discount: "FLAT ₹200 OFF", minOrder: "₹999", badge: "NEW USER" },
          { code: "UPIFANCY", discount: "EXTRA 10% CASHBACK", minOrder: "₹1,499", badge: "PREPAID" },
        ].map((c) => (
          <div key={c.code} className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[9px] font-black uppercase text-amber-400">{c.badge}</span>
              <h4 className="font-bold text-xs text-white">{c.discount} (Min. {c.minOrder})</h4>
              <span className="font-mono text-xs text-fancy-blue font-bold">{c.code}</span>
            </div>
            <button
              onClick={() => copy(c.code)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-fancy-blue text-white rounded-xl text-xs font-bold transition flex items-center space-x-1"
            >
              {copiedCode === c.code ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode === c.code ? "Copied" : "Copy"}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CountdownTimerWidget({ widget }: WidgetProps) {
  const { title = "Diwali Mega Dhamaka Ends In:", hours = 18, minutes = 45, ctaText = "Grab Deal Now", ctaLink = "/deals" } = widget.settings || {};

  return (
    <div className="p-6 bg-gradient-to-r from-fancy-blue via-indigo-900 to-slate-950 text-white rounded-3xl border border-indigo-700/50 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
          <Timer className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">LIMITED TIME FLASH</span>
          <h3 className="text-lg md:text-xl font-black">{title}</h3>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 font-mono font-black text-sm">
          <div className="bg-black/60 px-3 py-2 rounded-xl text-center"><span className="text-amber-400 text-base">{hours}</span><span className="text-[9px] block text-slate-400">HRS</span></div>
          <span>:</span>
          <div className="bg-black/60 px-3 py-2 rounded-xl text-center"><span className="text-white text-base">{minutes}</span><span className="text-[9px] block text-slate-400">MINS</span></div>
          <span>:</span>
          <div className="bg-black/60 px-3 py-2 rounded-xl text-center"><span className="text-white text-base">42</span><span className="text-[9px] block text-slate-400">SECS</span></div>
        </div>

        <Link href={ctaLink} className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-2xl text-xs shadow transition active:scale-95">
          {ctaText}
        </Link>
      </div>
    </div>
  );
}

export function AnnouncementBarWidget({ widget }: WidgetProps) {
  const { text = "⚡ FREE Express Delivery on Prepaid UPI orders | Use Code: FANCYFIRST", badge = "LIVE OFFER", link = "/deals" } = widget.settings || {};

  return (
    <div className="bg-fancy-blue text-white py-2 px-4 rounded-2xl flex items-center justify-center space-x-2 text-xs font-bold shadow">
      <span className="px-2 py-0.5 bg-white text-fancy-blue rounded-md text-[10px] font-black uppercase font-mono">
        {badge}
      </span>
      <span>{text}</span>
      {link && (
        <Link href={link} className="underline text-amber-300 hover:text-white">
          Shop Now →
        </Link>
      )}
    </div>
  );
}

export function OfferStripWidget({ widget }: WidgetProps) {
  return <AnnouncementBarWidget widget={widget} />;
}

export function FestivalBannerWidget({ widget }: WidgetProps) {
  return <HeroBannerWidget widget={widget} />;
}

export function NewsletterWidget({ widget }: WidgetProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="p-8 bg-gradient-to-br from-indigo-950 via-slate-900 to-black rounded-3xl border border-slate-800 text-center space-y-4 max-w-3xl mx-auto shadow-2xl">
      <div className="w-12 h-12 rounded-2xl bg-fancy-blue/20 text-fancy-blue flex items-center justify-center mx-auto">
        <Mail className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-xl md:text-2xl font-black text-white">Join India's Fastest Growing Marketplace Club</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">Get ₹500 instant wallet credits on sign-up, exclusive handloom drops & weekend flash coupons.</p>
      </div>

      {submitted ? (
        <div className="p-4 bg-green-500/20 border border-green-500/40 rounded-2xl text-green-300 text-xs font-bold">
          🎉 Welcome to FancyHub VIP Club! Use Code: <span className="font-mono text-amber-300 font-black">FANCYVIP500</span> at checkout.
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email or WhatsApp number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white outline-none focus:border-fancy-blue"
            required
          />
          <button type="submit" className="px-5 py-2.5 bg-fancy-blue hover:bg-blue-600 text-white font-black text-xs rounded-2xl shadow active:scale-95 transition">
            Claim ₹500
          </button>
        </form>
      )}
    </div>
  );
}

export function CtaBannerWidget({ widget }: WidgetProps) {
  return (
    <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 text-center space-y-4">
      <h3 className="text-xl font-black text-white">Start Selling on FancyHub.in Today</h3>
      <p className="text-xs text-slate-400 max-w-md mx-auto">Join 5,000+ Indian weavers, artisans & electronics innovators with zero onboarding fees.</p>
      <div className="flex justify-center space-x-3 text-xs">
        <Link href="/vendor/register" className="px-5 py-2.5 bg-fancy-blue text-white font-bold rounded-2xl">Register as Seller</Link>
        <Link href="/help" className="px-5 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-2xl">Learn More</Link>
      </div>
    </div>
  );
}

// --- 2. TRUST WIDGETS ---

export function TrustBadgesWidget({ widget }: WidgetProps) {
  const BADGES = [
    { icon: Truck, title: "Pan-India Express Delivery", sub: "Dispatched within 24 hours" },
    { icon: ShieldCheck, title: "100% Genuine Artisans", sub: "Direct weaver verification" },
    { icon: CreditCard, title: "Secure Razorpay / UPI", sub: "256-Bit SSL protection" },
    { icon: RotateCcw, title: "7-Day Hassle-Free Returns", sub: "Doorstep pickup & refund" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {BADGES.map((b, idx) => {
        const Icon = b.icon;
        return (
          <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-fancy-blue/10 text-fancy-blue flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">{b.title}</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{b.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function FastDeliveryWidget({ widget }: WidgetProps) {
  return <TrustBadgesWidget widget={widget} />;
}

export function SecurePaymentsWidget({ widget }: WidgetProps) {
  return <TrustBadgesWidget widget={widget} />;
}

export function TrustedVendorsWidget({ widget }: WidgetProps) {
  return <TrustBadgesWidget widget={widget} />;
}

export function EasyReturnsWidget({ widget }: WidgetProps) {
  return <TrustBadgesWidget widget={widget} />;
}
