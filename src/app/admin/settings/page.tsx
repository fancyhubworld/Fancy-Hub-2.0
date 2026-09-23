"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Settings, ShieldCheck, Check, Sparkles, Layers, Sliders } from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "FancyHub.in",
    tagline: "Shop More, Pay Less",
    currency: "INR (₹)",
    defaultGst: "18",
    globalCommission: "10.0",
    razorpayKey: "rzp_test_fancyhub_dev123",
    delhiveryApiKey: "del_live_partner_key_fancyhub",
    shiprocketEmail: "shipping@fancyhub.in",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/admin/dashboard" className="text-slate-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white">Platform Configuration & System Settings</h1>
            <p className="text-xs text-slate-400">Payment credentials, Indian GST tax rates, and logistics gateways</p>
          </div>
        </div>
      </div>

      {/* Visual Customizer Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/theme-studio"
          className="bg-slate-800 border border-slate-700 hover:border-fancy-blue rounded-3xl p-5 space-y-2 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-white group-hover:text-fancy-blue transition">Theme & Design Studio</span>
            <span className="text-[10px] bg-fancy-blue/20 text-fancy-blue font-bold px-2 py-0.5 rounded-full">New 2.0</span>
          </div>
          <p className="text-xs text-slate-400">
            Colors, fonts, border radius, button styles & Apple iOS Glassy mode
          </p>
        </Link>

        <Link
          href="/admin/homepage"
          className="bg-slate-800 border border-slate-700 hover:border-fancy-blue rounded-3xl p-5 space-y-2 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-white group-hover:text-fancy-blue transition">Homepage Layout CMS</span>
            <span className="text-[10px] bg-purple-900/50 text-purple-300 font-bold px-2 py-0.5 rounded-full">Visual Builder</span>
          </div>
          <p className="text-xs text-slate-400">
            Drag & reorder hero sliders, flash deals, product grids & banners
          </p>
        </Link>

        <Link
          href="/admin/menus"
          className="bg-slate-800 border border-slate-700 hover:border-fancy-blue rounded-3xl p-5 space-y-2 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-white group-hover:text-fancy-blue transition">Header & Footer Customizer</span>
            <span className="text-[10px] bg-amber-900/50 text-amber-300 font-bold px-2 py-0.5 rounded-full">Global</span>
          </div>
          <p className="text-xs text-slate-400">
            Sticky navigation, top announcement ribbons & footer newsletters
          </p>
        </Link>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-2xl space-y-4">
        {saved && (
          <div className="p-3 bg-green-900/80 text-green-300 text-xs font-bold rounded-xl border border-green-700 flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Platform settings saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Marketplace Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-fancy-blue font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-fancy-blue"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Global Commission Rate (%)</label>
              <input
                type="text"
                value={settings.globalCommission}
                onChange={(e) => setSettings({ ...settings, globalCommission: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-fancy-blue font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Default GST Rate (%)</label>
              <input
                type="text"
                value={settings.defaultGst}
                onChange={(e) => setSettings({ ...settings, defaultGst: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-fancy-blue font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Razorpay Key ID</label>
            <input
              type="text"
              value={settings.razorpayKey}
              onChange={(e) => setSettings({ ...settings, razorpayKey: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-fancy-blue font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Delhivery Express API Key</label>
            <input
              type="password"
              value={settings.delhiveryApiKey}
              onChange={(e) => setSettings({ ...settings, delhiveryApiKey: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-fancy-blue font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-fancy-blue hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition"
          >
            Save All Platform Settings
          </button>
        </form>
      </div>
    </div>
  );
}
