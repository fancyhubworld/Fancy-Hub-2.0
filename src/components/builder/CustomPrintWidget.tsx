"use client";

import React from "react";
import Link from "next/link";
import { Palette, Sparkles, ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/routes";

interface CustomPrintProps {
  content?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    priceText?: string;
  };
}

export function CustomPrintWidget({ content }: CustomPrintProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 shadow-card p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl z-10">
          <div className="inline-flex items-center space-x-1.5 bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md">
            <Palette className="w-3.5 h-3.5" />
            <span>{content?.badge || "CREATOR STUDIO"}</span>
          </div>

          <h2 className="text-xl md:text-3xl font-black leading-tight">
            {content?.title || "Print Your Own Brand & Identity"}
          </h2>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {content?.subtitle ||
              "Upload high-res artwork, logos or quotes. Instant live 3D preview on cotton tees, hoodies & mugs with DTF color printing."}
          </p>

          <div className="pt-2 flex items-center space-x-4">
            <Link
              href={content?.ctaLink || ROUTES.customPrint}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-fancy-blue hover:from-indigo-600 hover:to-blue-700 text-white font-black text-xs md:text-sm px-6 py-3 rounded-2xl shadow-lg transition active:scale-95"
            >
              <span>{content?.ctaText || "Start Customizing →"}</span>
            </Link>
            {content?.priceText && (
              <span className="text-xs font-bold text-amber-300">{content.priceText}</span>
            )}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center">
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-800/80 p-2 transform rotate-2 hover:rotate-0 transition duration-500">
            <img
              src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80"
              alt="Custom Print Mockup"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
