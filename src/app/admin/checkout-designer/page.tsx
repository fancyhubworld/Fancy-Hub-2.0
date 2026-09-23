"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ShoppingCart,
  CreditCard,
  Truck,
  Tag,
  ShieldCheck,
  Check,
  Save,
  Sliders,
  Layers,
  Sparkles,
} from "lucide-react";
import { DEFAULT_CHECKOUT_DESIGN_CONFIG, CheckoutDesignerConfig } from "@/lib/brand-lock-engine";

export default function AdminCheckoutDesignerPage() {
  const [config, setConfig] = useState<CheckoutDesignerConfig>(DEFAULT_CHECKOUT_DESIGN_CONFIG);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/admin/checkout-design")
      .then((res) => res.json())
      .then((data) => {
        if (data.checkoutDesign) setConfig(data.checkoutDesign);
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/admin/checkout-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e) {
      console.error("Save checkout design failed:", e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-6 font-sans select-none">
      {/* Header */}
      <header className="h-16 bg-slate-900 border border-slate-800 rounded-3xl px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/pages"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4 text-fancy-blue" />
              <h1 className="text-sm md:text-base font-black text-white">Cart & Checkout Visual Designer</h1>
              <span className="text-[10px] bg-fancy-blue/20 text-fancy-blue font-bold px-2.5 py-0.5 rounded-full border border-fancy-blue/30">
                ZERO BUSINESS LOGIC MUTATION
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Customize cart layouts, coupon badge styling & payment breakdown elevation safely</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2 bg-gradient-to-r from-fancy-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-lg active:scale-95 transition disabled:opacity-50"
        >
          {saveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saveSuccess ? "Published!" : isSaving ? "Saving..." : "Save Checkout UI"}</span>
        </button>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Controls */}
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
          <span className="text-xs font-black text-slate-300 uppercase tracking-wider block">
            Layout & Checkout Stepper
          </span>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Cart Page Layout</label>
              <div className="grid grid-cols-3 gap-2">
                {(["two_column", "compact", "full_width"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setConfig({ ...config, cartLayout: l })}
                    className={`py-2 rounded-xl border font-bold capitalize text-xs transition ${
                      config.cartLayout === l
                        ? "bg-fancy-blue text-white border-fancy-blue shadow"
                        : "bg-slate-950 border-slate-800 text-slate-400"
                    }`}
                  >
                    {l.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Checkout Flow Experience</label>
              <div className="grid grid-cols-3 gap-2">
                {(["accordion", "single_page", "multi_step"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setConfig({ ...config, checkoutStepStyle: s })}
                    className={`py-2 rounded-xl border font-bold capitalize text-xs transition ${
                      config.checkoutStepStyle === s
                        ? "bg-fancy-blue text-white border-fancy-blue shadow"
                        : "bg-slate-950 border-slate-800 text-slate-400"
                    }`}
                  >
                    {s.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Coupon Box Visual Style</label>
              <div className="grid grid-cols-3 gap-2">
                {(["dashed_pill", "solid_card", "minimal_inline"] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setConfig({ ...config, couponBoxStyle: c })}
                    className={`py-2 rounded-xl border font-bold capitalize text-xs transition ${
                      config.couponBoxStyle === c
                        ? "bg-fancy-blue text-white border-fancy-blue shadow"
                        : "bg-slate-950 border-slate-800 text-slate-400"
                    }`}
                  >
                    {c.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="font-bold text-white text-xs">Free Express Shipping Progress Bar</span>
              <input
                type="checkbox"
                checked={config.showFreeShippingProgressBar}
                onChange={(e) => setConfig({ ...config, showFreeShippingProgressBar: e.target.checked })}
                className="w-4 h-4 accent-fancy-blue rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Live Order Summary Preview */}
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4">
          <span className="text-xs font-black text-slate-300 uppercase tracking-wider block">
            Live Cart Summary Mockup
          </span>

          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4 shadow-2xl">
            {/* Free Shipping Progress Strip */}
            {config.showFreeShippingProgressBar && (
              <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/60 text-emerald-300 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span>🎉 Free Express Delivery Unlocked!</span>
                  <span>100%</span>
                </div>
                <div className="w-full bg-emerald-950 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-400 h-full w-full rounded-full" />
                </div>
              </div>
            )}

            {/* Coupon Box Preview */}
            <div
              className={`p-3 rounded-xl flex items-center justify-between ${
                config.couponBoxStyle === "dashed_pill"
                  ? "border border-dashed border-fancy-blue/60 bg-fancy-blue/5"
                  : "bg-slate-900 border border-slate-800"
              }`}
            >
              <div className="flex items-center space-x-2 text-xs">
                <Tag className="w-4 h-4 text-fancy-blue" />
                <span className="font-bold text-white">FANCYFIRST Applied</span>
              </div>
              <span className="text-xs font-bold text-emerald-400">-₹200</span>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex justify-between">
                <span>Cart Subtotal (2 items)</span>
                <span className="font-mono">₹4,498</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Festive Promo Discount</span>
                <span className="font-mono">-₹200</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Shipping Fee</span>
                <span className="font-bold uppercase text-[10px] bg-emerald-950 px-2 py-0.5 rounded">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                <span>Total Amount</span>
                <span className="text-fancy-blue">₹4,298</span>
              </div>
            </div>

            <button className="w-full py-3 bg-fancy-blue hover:bg-blue-600 text-white font-black text-xs rounded-xl shadow-lg transition">
              Proceed to Secure Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
