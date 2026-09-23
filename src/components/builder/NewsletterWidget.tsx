"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2, Sparkles } from "lucide-react";

interface NewsletterProps {
  content?: {
    title?: string;
    subtitle?: string;
    couponCode?: string;
    btnText?: string;
  };
}

export function NewsletterWidget({ content }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubmitted(true);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-gradient-to-r from-fancy-blue via-indigo-700 to-slate-900 rounded-3xl p-6 md:p-10 text-white shadow-card relative overflow-hidden">
        <div className="max-w-2xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>EXCLUSIVE SHOPPER CLUB</span>
          </div>

          <h2 className="text-xl md:text-3xl font-black leading-tight">
            {content?.title || "Join India's Fastest Growing Marketplace Club"}
          </h2>

          <p className="text-xs md:text-sm text-slate-200">
            {content?.subtitle ||
              "Subscribe to receive ₹500 instant wallet credits and exclusive festive coupon codes."}
          </p>

          {submitted ? (
            <div className="p-4 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl flex items-center justify-center space-x-2 text-emerald-200 font-bold text-xs md:text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              <span>
                Awesome! Use code <strong className="text-white underline">{content?.couponCode || "FANCYFIRST"}</strong> for FLAT ₹500 OFF on checkout!
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl pl-10 pr-4 py-3 text-xs md:text-sm text-white placeholder-slate-300 focus:outline-none focus:bg-white/20 focus:border-white transition"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-fancy-orange hover:bg-orange-600 text-slate-950 font-black text-xs md:text-sm px-6 py-3 rounded-2xl shadow-md transition whitespace-nowrap active:scale-95"
              >
                {content?.btnText || "Get ₹500 Off"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
