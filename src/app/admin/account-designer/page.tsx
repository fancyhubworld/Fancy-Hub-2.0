"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Wallet,
  Tag,
  Headphones,
  Check,
  Save,
  Palette,
  Layers,
  Sparkles,
} from "lucide-react";
import { DEFAULT_ACCOUNT_UI_CONFIG, CustomerAccountUiConfig } from "@/lib/brand-lock-engine";

export default function AdminAccountDesignerPage() {
  const [config, setConfig] = useState<CustomerAccountUiConfig>(DEFAULT_ACCOUNT_UI_CONFIG);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/admin/account-design")
      .then((res) => res.json())
      .then((data) => {
        if (data.accountUi) setConfig(data.accountUi);
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/admin/account-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e) {
      console.error("Save account design failed:", e);
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
              <User className="w-4 h-4 text-fancy-blue" />
              <h1 className="text-sm md:text-base font-black text-white">Customer Account UI Designer</h1>
              <span className="text-[10px] bg-fancy-blue/20 text-fancy-blue font-bold px-2.5 py-0.5 rounded-full border border-fancy-blue/30">
                ZERO BUSINESS LOGIC OVERRIDE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Visually configure user dashboard cards, wallet strips & order tracking layouts</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2 bg-gradient-to-r from-fancy-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-lg active:scale-95 transition disabled:opacity-50"
        >
          {saveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saveSuccess ? "Published!" : isSaving ? "Saving..." : "Save Account UI"}</span>
        </button>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Form */}
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
          <span className="text-xs font-black text-slate-300 uppercase tracking-wider block">
            Dashboard Card Controls
          </span>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Layout Grid Style</label>
              <div className="grid grid-cols-3 gap-2">
                {(["card_grid", "sidebar_list", "minimal_compact"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setConfig({ ...config, dashboardStyle: s })}
                    className={`py-2 rounded-xl border font-bold capitalize text-xs transition ${
                      config.dashboardStyle === s
                        ? "bg-fancy-blue text-white border-fancy-blue shadow"
                        : "bg-slate-950 border-slate-800 text-slate-400"
                    }`}
                  >
                    {s.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="font-bold text-white text-xs">Show Fancy Wallet & Rewards Card</span>
              <input
                type="checkbox"
                checked={config.showWalletCard}
                onChange={(e) => setConfig({ ...config, showWalletCard: e.target.checked })}
                className="w-4 h-4 accent-fancy-blue rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="font-bold text-white text-xs">Show Recent Orders Hero Tracker</span>
              <input
                type="checkbox"
                checked={config.showRecentOrdersHero}
                onChange={(e) => setConfig({ ...config, showRecentOrdersHero: e.target.checked })}
                className="w-4 h-4 accent-fancy-blue rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Live Dashboard Render */}
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
          <span className="text-xs font-black text-slate-300 uppercase tracking-wider block">
            Live Account Dashboard Preview
          </span>

          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4 shadow-2xl">
            {/* Header greeting */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-fancy-blue/20 text-fancy-blue flex items-center justify-center font-black text-base border border-fancy-blue/40">
                P
              </div>
              <div>
                <h3 className="font-black text-white text-sm">Priya Sharma</h3>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded">
                  VIP Artisan Club Member
                </span>
              </div>
            </div>

            {/* Wallet Quick Bar */}
            {config.showWalletCard && (
              <div className="p-4 bg-gradient-to-r from-fancy-blue to-indigo-700 rounded-2xl text-white flex justify-between items-center shadow-lg">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-200 block">Fancy Wallet Balance</span>
                  <span className="text-xl font-black">₹1,500</span>
                </div>
                <span className="text-xs font-bold bg-white/20 px-3 py-1.5 rounded-xl backdrop-blur-md">
                  + ₹200 Cashback
                </span>
              </div>
            )}

            {/* Account Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              {[
                { label: "My Orders (4)", icon: ShoppingBag, color: "#1455D9" },
                { label: "Saved Wishlist (8)", icon: Heart, color: "#EC4899" },
                { label: "Delivery Addresses", icon: MapPin, color: "#10B981" },
                { label: "Active Coupons (3)", icon: Tag, color: "#F59E0B" },
              ].map((c, idx) => {
                const Icon = c.icon;
                return (
                  <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center space-x-2">
                    <Icon className="w-4 h-4" style={{ color: c.color }} />
                    <span className="font-bold text-white text-xs">{c.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
