"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Phone,
  Gift,
  Copy,
  Check,
  Zap,
  Tag,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import {
  DEFAULT_FESTIVE_SLICES,
  WheelSlice,
  calculateSpinResult,
  validateIndianPhoneNumber,
} from "@/lib/gamification-engine";

export interface SpinWheelWidgetProps {
  settings?: {
    title?: string;
    subtitle?: string;
    buttonText?: string;
    requirePhone?: boolean;
    slices?: WheelSlice[];
  };
  style?: {
    paddingY?: string;
    backgroundColor?: string;
  };
}

export function SpinWheelWidget({ settings, style }: SpinWheelWidgetProps) {
  const slices: WheelSlice[] = settings?.slices && settings.slices.length >= 4 
    ? (settings.slices as WheelSlice[]) 
    : DEFAULT_FESTIVE_SLICES;

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [winningResult, setWinningResult] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSpin = () => {
    if (isSpinning || winningResult) return;

    if (settings?.requirePhone !== false) {
      const validation = validateIndianPhoneNumber(phone);
      if (!validation.isValid) {
        setPhoneError(validation.error || "Please enter a valid mobile number");
        return;
      }
      setPhoneError(null);
    }

    setIsSpinning(true);
    const result = calculateSpinResult(slices, phone);

    // Add previous rotation offset so it spins forward smoothly
    const nextAngle = rotationAngle + result.spinAngle;
    setRotationAngle(nextAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setWinningResult(result);
    }, 4000);
  };

  const handleCopyCoupon = () => {
    if (!winningResult) return;
    navigator.clipboard.writeText(winningResult.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sliceAngle = 360 / slices.length;

  return (
    <section
      className={`w-full ${
        style?.paddingY || "py-12"
      } bg-gradient-to-b from-slate-950 via-purple-950/40 to-slate-950 text-white font-sans overflow-hidden relative`}
    >
      {/* Decorative ambient glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>FESTIVE LUCKY WHEEL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {settings?.title || "Diwali Festive Fortune Wheel"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            {settings?.subtitle ||
              "Spin the golden wheel to unlock exclusive discounts up to ₹500 + Free Express Delivery!"}
          </p>
        </div>

        {/* Content Layout: Left Wheel / Right Reward Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Wheel Graphic Container */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="relative w-[300px] sm:w-[360px] h-[300px] sm:h-[360px]">
              {/* Outer Golden Border Rim */}
              <div className="absolute inset-0 rounded-full border-8 border-amber-400/80 shadow-[0_0_50px_rgba(245,158,11,0.3)] flex items-center justify-center pointer-events-none z-20">
                {/* 12 LED bulbs on rim */}
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_8px_#F59E0B] animate-pulse"
                    style={{
                      transform: `rotate(${i * 30}deg) translateY(-144px)`,
                    }}
                  />
                ))}
              </div>

              {/* Needle Indicator at Top */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
                <div className="w-6 h-8 bg-amber-400 border-2 border-slate-900 clip-triangle shadow-2xl" />
                <div className="w-3 h-3 rounded-full bg-rose-600 -mt-1 border border-white" />
              </div>

              {/* Rotating Wheel Circle */}
              <div
                className="w-full h-full rounded-full overflow-hidden transition-transform duration-[4000ms] cubic-bezier(0.15, 0.9, 0.25, 1)"
                style={{
                  transform: `rotate(${rotationAngle}deg)`,
                }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {slices.map((slice, i) => {
                    const startAngle = (i * sliceAngle - 90) * (Math.PI / 180);
                    const endAngle = ((i + 1) * sliceAngle - 90) * (Math.PI / 180);
                    const x1 = 50 + 50 * Math.cos(startAngle);
                    const y1 = 50 + 50 * Math.sin(startAngle);
                    const x2 = 50 + 50 * Math.cos(endAngle);
                    const y2 = 50 + 50 * Math.sin(endAngle);
                    const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                    // Middle text angle
                    const midAngle = (i * sliceAngle + sliceAngle / 2) * (Math.PI / 180);
                    const textX = 50 + 32 * Math.cos(midAngle - Math.PI / 2);
                    const textY = 50 + 32 * Math.sin(midAngle - Math.PI / 2);

                    return (
                      <g key={slice.id || i}>
                        <path d={pathData} fill={slice.color} stroke="#1E293B" strokeWidth="0.5" />
                        <text
                          x={textX}
                          y={textY}
                          fill={slice.textColor || "#FFFFFF"}
                          fontSize="4"
                          fontWeight="900"
                          textAnchor="middle"
                          dominantBaseline="central"
                          transform={`rotate(${i * sliceAngle + sliceAngle / 2}, ${textX}, ${textY})`}
                        >
                          {slice.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Center Hub */}
              <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-slate-900 border-4 border-amber-400 shadow-xl flex items-center justify-center z-20">
                <Zap className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Form & Reward Container */}
          <div className="lg:col-span-6">
            {!winningResult ? (
              <div className="bg-slate-900/90 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">Enter WhatsApp Number</h3>
                    <p className="text-xs text-slate-400">Claim your instant prize & get coupon alerts</p>
                  </div>
                </div>

                {settings?.requirePhone !== false && (
                  <div>
                    <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
                      WhatsApp Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-xs font-bold">
                        <span>🇮🇳 +91</span>
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (phoneError) setPhoneError(null);
                        }}
                        className={`w-full bg-slate-950 border ${
                          phoneError ? "border-rose-500" : "border-slate-800 focus:border-amber-400"
                        } rounded-2xl py-3 pl-20 pr-4 text-sm text-white placeholder-slate-600 outline-none transition`}
                      />
                    </div>
                    {phoneError && (
                      <p className="text-xs font-bold text-rose-400 mt-1.5">{phoneError}</p>
                    )}
                  </div>
                )}

                <button
                  onClick={handleSpin}
                  disabled={isSpinning}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-2xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>{isSpinning ? "Spinning Lucky Wheel..." : settings?.buttonText || "SPIN & WIN NOW"}</span>
                </button>

                <div className="flex items-center justify-center space-x-4 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <span className="flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>100% Free to Spin</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Tag className="w-3.5 h-3.5 text-amber-400" />
                    <span>Instant Coupon Code</span>
                  </span>
                </div>
              </div>
            ) : (
              /* Winning Card */
              <div className="bg-slate-900/95 backdrop-blur-2xl border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-fadeIn">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 mx-auto rounded-full bg-amber-400/20 border border-amber-400/60 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-7 h-7 animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    🎉 Congratulations! You Won!
                  </h3>
                  <p className="text-sm font-extrabold text-amber-300">
                    {winningResult.discountText}
                  </p>
                </div>

                {/* Coupon Code Pill */}
                <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                      YOUR EXCLUSIVE COUPON CODE
                    </span>
                    <span className="text-xl font-black text-amber-400 font-mono tracking-wider">
                      {winningResult.couponCode}
                    </span>
                  </div>

                  <button
                    onClick={handleCopyCoupon}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center space-x-1.5 shadow-md"
                  >
                    {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
                    <span>{copied ? "Copied!" : "Copy Code"}</span>
                  </button>
                </div>

                {/* Urgency Expiry Timer */}
                <div className="flex items-center justify-center space-x-2 text-xs font-bold text-slate-300 bg-purple-950/40 py-2.5 rounded-xl border border-purple-500/20">
                  <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>Offer valid for next 30 minutes only!</span>
                </div>

                <a
                  href="/shop"
                  className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-purple-500/30 transition flex items-center justify-center space-x-2 block text-center"
                >
                  <span>Apply Coupon & Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SpinWheelWidget;
