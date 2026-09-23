"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  MessageSquare,
  HelpCircle,
  Star,
  Instagram,
  Sparkles,
  Search,
  ChevronRight,
  Filter,
  ArrowUpDown,
  ShoppingBag,
  Heart,
  User,
  Sliders,
  ChevronDown,
} from "lucide-react";
import { WidgetInstance } from "@/lib/widget-types";

interface WidgetProps {
  widget: WidgetInstance;
  isEditing?: boolean;
}

// --- 1. SOCIAL & REVIEWS WIDGETS ---

export function BlogPostsWidget({ widget }: WidgetProps) {
  const POSTS = [
    { title: "The Art of Banarasi Zari Weaving: An Ancient Legacy", date: "Aug 2026", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80" },
    { title: "How Direct Weaver Sourcing is Saving Traditional Indian Handlooms", date: "Jul 2026", image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&auto=format&fit=crop&q=80" },
    { title: "Top 5 ANC Wireless Earbuds for Indian Commuters in 2026", date: "Jul 2026", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">Stories from Indian Looms</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Heritage, art and weaver craftsmanship insights</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {POSTS.map((p, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition group">
            <div className="aspect-video overflow-hidden">
              <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div className="p-4 space-y-1.5">
              <span className="text-[10px] text-fancy-blue font-bold font-mono">{p.date}</span>
              <h4 className="font-bold text-xs md:text-sm text-slate-900 dark:text-white group-hover:text-fancy-blue transition line-clamp-2">
                {p.title}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TestimonialsWidget({ widget }: WidgetProps) {
  const REVIEWS = [
    { name: "Pooja Sharma", city: "Mumbai", text: "The Banarasi saree quality is breathtaking! Genuine Silk Mark tag and arrived in 48 hours.", rating: 5 },
    { name: "Rahul Verma", city: "Bengaluru", text: "FancyHub ANC Earbuds rival high-end flagships at 1/3rd the price. Solid bass!", rating: 5 },
    { name: "Ananya Iyer", city: "Chennai", text: "Super seamless checkout with UPI cashback. Love buying direct from weavers!", rating: 5 },
  ];

  return (
    <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
      <div className="text-center space-y-1">
        <h3 className="text-xl font-black text-slate-900 dark:text-white">Loved by 50,000+ Indian Shoppers</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Verified buyer ratings from across India</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {REVIEWS.map((r, idx) => (
          <div key={idx} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex text-amber-400">
              {[...Array(r.rating)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{r.text}"</p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-900 dark:text-white">
              {r.name} <span className="text-slate-400 font-normal">({r.city})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FaqWidget({ widget }: WidgetProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const FAQS = [
    { q: "Are all sarees and textiles 100% genuine handloom certified?", a: "Yes. Every weaver on FancyHub is verified with GST and authentic Silk Mark certifications." },
    { q: "What is the delivery timeline across India?", a: "Metro cities receive orders in 24-48 hours. Rest of India within 3-4 working days via Delhivery and BlueDart." },
    { q: "How do returns and refunds work?", a: "We offer 7-day hassle-free doorstep return pickup with instant refund to your FancyHub Wallet or UPI account." },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      <h3 className="text-xl font-black text-slate-900 dark:text-white text-center mb-4">Frequently Asked Questions</h3>
      {FAQS.map((f, idx) => (
        <div key={idx} className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
          <button
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            className="w-full p-4 text-left font-bold text-xs text-slate-900 dark:text-white flex items-center justify-between"
          >
            <span>{f.q}</span>
            <ChevronDown className={`w-4 h-4 transition ${openIdx === idx ? "rotate-180" : ""}`} />
          </button>
          {openIdx === idx && (
            <div className="px-4 pb-4 text-xs text-slate-500 dark:text-slate-400">
              {f.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function ReviewsWidget({ widget }: WidgetProps) {
  return <TestimonialsWidget widget={widget} />;
}

export function InstagramGalleryWidget({ widget }: WidgetProps) {
  const IMGS = [
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80",
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Instagram className="w-5 h-5 text-pink-500" />
          <h3 className="text-base font-black text-slate-900 dark:text-white">Style with #FancyHub</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">@fancyhub.in</span>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {IMGS.map((url, idx) => (
          <div key={idx} className="aspect-square rounded-2xl overflow-hidden shadow-sm group">
            <img src={url} alt="Social Reel" className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function BrandLogosWidget({ widget }: WidgetProps) {
  return (
    <div className="py-4 border-y border-slate-200 dark:border-slate-800 text-center space-y-2">
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Certified Partner Guilds & Brands</span>
      <div className="flex items-center justify-center space-x-8 text-xs font-black text-slate-400 uppercase tracking-wider font-mono">
        <span>Surat Silk</span>
        <span>•</span>
        <span>Kanchi Looms</span>
        <span>•</span>
        <span>Fancy Audio</span>
        <span>•</span>
        <span>Varanasi Guild</span>
        <span>•</span>
        <span>Delhi Fabrics</span>
      </div>
    </div>
  );
}

// --- 2. UTILITY WIDGETS ---

export function SearchWidget({ widget }: WidgetProps) {
  return (
    <div className="relative max-w-xl mx-auto">
      <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
      <input
        type="text"
        placeholder="Search for Sarees, Kurtas, Mobiles, ANC Earbuds, Brands..."
        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-900 dark:text-white shadow-sm outline-none focus:border-fancy-blue"
      />
    </div>
  );
}

export function BreadcrumbsWidget({ widget }: WidgetProps) {
  return (
    <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
      <Link href="/" className="hover:text-fancy-blue">Home</Link>
      <span>/</span>
      <Link href="/category/menswear" className="hover:text-fancy-blue">Menswear</Link>
      <span>/</span>
      <span className="text-slate-900 dark:text-white font-bold">Men's Shirts</span>
    </div>
  );
}

export function PaginationWidget({ widget }: WidgetProps) {
  return (
    <div className="flex items-center justify-center space-x-1.5 text-xs font-bold py-2">
      <button className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400">Prev</button>
      <button className="px-3 py-1.5 rounded-xl bg-fancy-blue text-white">1</button>
      <button className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400">2</button>
      <button className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400">3</button>
      <button className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400">Next</button>
    </div>
  );
}

export function FiltersWidget({ widget }: WidgetProps) {
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
      <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white">
        <Filter className="w-3.5 h-3.5 text-fancy-blue" />
        <span>Filters (Price, Category, Rating)</span>
      </div>
      <div className="flex flex-wrap gap-2 text-[10px]">
        <span className="px-2.5 py-1 bg-fancy-blue text-white rounded-lg">Under ₹1,999</span>
        <span className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg">4+ Stars</span>
        <span className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg">Pure Silk</span>
      </div>
    </div>
  );
}

export function SortWidget({ widget }: WidgetProps) {
  return (
    <div className="flex items-center justify-end space-x-2 text-xs">
      <span className="text-slate-400 font-bold">Sort By:</span>
      <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 font-bold text-xs text-slate-900 dark:text-white">
        <option>🔥 Popularity</option>
        <option>💰 Price: Low to High</option>
        <option>💎 Price: High to Low</option>
        <option>⭐ Rating</option>
      </select>
    </div>
  );
}

export function CompareTrayWidget({ widget }: WidgetProps) {
  return (
    <div className="p-3 bg-slate-900 border border-slate-800 text-white rounded-2xl flex items-center justify-between text-xs font-bold">
      <span>Compare Products (2 selected)</span>
      <button className="px-3 py-1 bg-fancy-blue text-white rounded-xl">View Comparison</button>
    </div>
  );
}

export function WishlistButtonWidget({ widget }: WidgetProps) {
  return (
    <Link href="/wishlist" className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-500 border border-red-200 dark:border-red-800/40 text-xs font-bold">
      <Heart className="w-4 h-4 fill-current" />
      <span>My Wishlist (4 items)</span>
    </Link>
  );
}

export function CartSummaryWidget({ widget }: WidgetProps) {
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
      <div className="flex items-center space-x-2">
        <ShoppingBag className="w-4 h-4 text-fancy-blue" />
        <span className="font-bold text-slate-900 dark:text-white">Bag: 2 items (₹5,398)</span>
      </div>
      <Link href="/cart" className="px-3 py-1.5 bg-fancy-blue text-white rounded-xl font-bold">
        Checkout →
      </Link>
    </div>
  );
}

export function AccountSummaryWidget({ widget }: WidgetProps) {
  return (
    <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-fancy-blue flex items-center justify-center font-bold">
          <User className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold">Welcome, Shopper!</h4>
          <span className="text-amber-400 font-mono text-[11px]">Wallet: ₹500 credits</span>
        </div>
      </div>
      <Link href="/account/profile" className="text-fancy-blue hover:underline font-bold">
        My Orders →
      </Link>
    </div>
  );
}
