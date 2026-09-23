"use client";

import React, { useState } from "react";
import { Gift, Sparkles, Copy, Check, ArrowRight, Tag, Lock } from "lucide-react";
import { generateScratchCardReward, ScratchReward } from "@/lib/gamification-engine";

export interface ScratchCardWidgetProps {
  settings?: {
    title?: string;
    subtitle?: string;
    rewardCoupon?: string;
    rewardDiscountText?: string;
  };
  style?: {
    paddingY?: string;
  };
}

export function ScratchCardWidget({ settings, style }: ScratchCardWidgetProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [reward, setReward] = useState<ScratchReward>(() => generateScratchCardReward());
  const [copied, setCopied] = useState(false);

  const handleScratch = () => {
    if (isRevealed) return;
    setIsRevealed(true);
  };

  const handleCopy = () => {
    const code = settings?.rewardCoupon || reward.couponCode;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const couponCode = settings?.rewardCoupon || reward.couponCode;
  const discountText = settings?.rewardDiscountText || reward.discountText;

  return (
    <section
      className={`w-full ${
        style?.paddingY || "py-10"
      } bg-slate-950 text-white font-sans overflow-hidden`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black tracking-wider uppercase mb-3">
          <Gift className="w-3.5 h-3.5" />
          <span>FESTIVE MYSTERY SCRATCH CARD</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {settings?.title || "Scratch & Win Golden Festive Voucher"}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl mx-auto">
          {settings?.subtitle ||
            "Click or tap below to scratch the mystery foil and unlock your exclusive surprise coupon!"}
        </p>

        {/* Scratch Card Box */}
        <div className="mt-8 max-w-md mx-auto relative">
          <div
            onClick={handleScratch}
            className={`relative rounded-3xl p-8 cursor-pointer overflow-hidden transition-all duration-500 shadow-2xl border-2 ${
              isRevealed
                ? "bg-slate-900 border-amber-400/80 shadow-[0_0_40px_rgba(245,158,11,0.2)]"
                : "bg-gradient-to-br from-amber-500 via-yellow-600 to-amber-700 border-amber-300 hover:scale-[1.02]"
            }`}
          >
            {!isRevealed ? (
              /* Unscratched Golden Foil */
              <div className="py-8 flex flex-col items-center justify-center space-y-3 select-none">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-slate-950 shadow-inner">
                  <Sparkles className="w-8 h-8 text-white animate-pulse" />
                </div>
                <h3 className="text-lg font-black text-slate-950 uppercase tracking-wider">
                  Tap / Click to Scratch
                </h3>
                <p className="text-xs font-bold text-amber-950/80">
                  ✨ Instant Festive Discount Inside ✨
                </p>
              </div>
            ) : (
              /* Revealed Voucher */
              <div className="space-y-4 animate-fadeIn">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>UNLOCKED PRIZE</span>
                </div>

                <h3 className="text-xl font-black text-white">{discountText}</h3>

                <div className="p-3.5 rounded-2xl bg-black/60 border border-amber-500/40 flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                      COUPON CODE
                    </span>
                    <span className="text-lg font-black text-amber-400 font-mono">
                      {couponCode}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy();
                    }}
                    className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center space-x-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>

                <a
                  href="/shop"
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider transition flex items-center justify-center space-x-1.5 block text-center shadow-lg shadow-purple-500/30"
                >
                  <span>Redeem Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ScratchCardWidget;
