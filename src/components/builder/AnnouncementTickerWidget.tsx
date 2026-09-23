"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

interface TickerProps {
  content?: {
    badge?: string;
    text?: string;
    link?: string;
    speed?: "normal" | "slow" | "fast";
  };
}

export function AnnouncementTickerWidget({ content }: TickerProps) {
  const text = content?.text || "⚡ FESTIVE DHAMAKA: Extra 15% OFF on Indian Handloom Sarees & 5G Smartphones!";
  const link = content?.link || "/deals";

  return (
    <div className="bg-gradient-to-r from-fancy-blue via-indigo-700 to-fancy-blue text-white py-2.5 px-4 overflow-hidden relative shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-bold">
        <div className="flex items-center space-x-2 truncate">
          {content?.badge && (
            <span className="bg-fancy-orange text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0">
              {content.badge}
            </span>
          )}
          <span className="truncate">{text}</span>
        </div>

        {link && (
          <Link
            href={link}
            className="flex-shrink-0 ml-3 inline-flex items-center space-x-1 bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg text-[11px] font-black transition"
          >
            <span>Claim Offer</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
}
