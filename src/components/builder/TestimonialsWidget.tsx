"use client";

import React from "react";
import { Star, CheckCircle, Quote } from "lucide-react";

interface TestimonialItem {
  name: string;
  city: string;
  rating: number;
  comment: string;
  verified?: boolean;
}

interface TestimonialsProps {
  content?: {
    title?: string;
    subtitle?: string;
    items?: TestimonialItem[];
  };
}

export function TestimonialsWidget({ content }: TestimonialsProps) {
  const items = content?.items || [];
  if (!items.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-1">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
          {content?.title || "Loved by Shoppers Across India"}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {content?.subtitle || "Over 150,000+ successful verified deliveries across 19,000+ pincodes"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-card hover:shadow-card-hover transition relative flex flex-col justify-between"
          >
            <Quote className="w-8 h-8 text-fancy-blue/15 dark:text-fancy-blue/30 absolute top-4 right-4" />

            <div className="space-y-3">
              <div className="flex items-center space-x-1 text-amber-400">
                {[...Array(item.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "{item.comment}"
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center space-x-1">
                  <span>{item.name}</span>
                  {item.verified && (
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20 inline" />
                  )}
                </h4>
                <span className="text-[10px] text-slate-400">{item.city}</span>
              </div>
              <span className="text-[10px] bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400 font-bold px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
                Verified Buyer
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
