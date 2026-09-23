"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqAccordionProps {
  content?: {
    title?: string;
    subtitle?: string;
    items?: FaqItem[];
  };
}

export function FaqAccordionWidget({ content }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const items = content?.items || [];
  if (!items.length) return null;

  return (
    <section className="max-w-4xl mx-auto px-4 py-6">
      <div className="text-center mb-6 space-y-1">
        <div className="inline-flex items-center space-x-1.5 text-fancy-blue text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>HELP & ASSURANCE</span>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
          {content?.title || "Frequently Asked Questions"}
        </h2>
        {content?.subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400">{content.subtitle}</p>
        )}
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 md:p-5 flex items-center justify-between text-left font-bold text-xs md:text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ml-2 ${
                    isOpen ? "rotate-180 text-fancy-blue" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 md:px-5 md:pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
