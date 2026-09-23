import React from "react";
import Link from "next/link";
import { Sparkles, Printer, Palette, Truck, ArrowRight } from "lucide-react";

export function CustomPrintBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-[#0B2A63] text-white p-6 md:p-10 shadow-elevated">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-1.5 bg-fancy-orange text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FancyHub Print Factory</span>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Design Your Own Custom T-Shirts, Hoodies & Mugs in Real-Time
            </h2>

            <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
              Upload your custom photos, artwork, company logos or personalized text. High definition DTG printing on 100% bio-washed cotton and ceramic gifts. Starting at just ₹249 with 24-hour dispatch!
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2 max-w-md text-xs">
              <div className="flex items-center space-x-2 text-slate-200">
                <Palette className="w-4 h-4 text-fancy-orange flex-shrink-0" />
                <span>Live Studio Canvas</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-200">
                <Printer className="w-4 h-4 text-fancy-orange flex-shrink-0" />
                <span>300 DPI Print</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-200">
                <Truck className="w-4 h-4 text-fancy-orange flex-shrink-0" />
                <span>Zero MOQ</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/custom-print"
                className="inline-flex items-center space-x-2 bg-fancy-orange hover:bg-orange-600 text-white font-extrabold text-xs md:text-sm px-6 py-3 rounded-xl shadow-elevated transition"
              >
                <span>Launch Custom Print Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
              <img
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"
                alt="Custom Print Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md p-2.5 rounded-xl text-center">
                <p className="text-[11px] font-bold text-amber-300">Printed & Shipped from Bengaluru Lab</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
