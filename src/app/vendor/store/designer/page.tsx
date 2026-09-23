"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Store,
  Sparkles,
  Check,
  Save,
  Palette,
  Image as ImageIcon,
  Lock,
  Layers,
  AlertCircle,
} from "lucide-react";
import {
  DEFAULT_VENDOR_DESIGN,
  VendorStorefrontDesign,
  VendorStoreLayoutStyle,
  DEFAULT_BRAND_LOCK_SETTINGS,
} from "@/lib/brand-lock-engine";

export default function VendorStoreDesignerPage() {
  const [design, setDesign] = useState<VendorStorefrontDesign>(DEFAULT_VENDOR_DESIGN);
  const [allowedColors, setAllowedColors] = useState<string[]>(DEFAULT_BRAND_LOCK_SETTINGS.allowedVendorAccentColors);
  const [violationAlerts, setViolationAlerts] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/vendor/store-design?vendorId=vendor-surat-silk")
      .then((res) => res.json())
      .then((data) => {
        if (data.design) setDesign(data.design);
      })
      .catch(() => {});

    fetch("/api/admin/brand-control")
      .then((res) => res.json())
      .then((data) => {
        if (data.brandLock?.allowedVendorAccentColors) {
          setAllowedColors(data.brandLock.allowedVendorAccentColors);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/vendor/store-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(design),
      });
      const data = await res.json();
      if (data.violatedRules && data.violatedRules.length > 0) {
        setViolationAlerts(data.violatedRules);
      } else {
        setViolationAlerts([]);
      }
      if (data.design) setDesign(data.design);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e) {
      console.error("Save vendor storefront failed:", e);
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
            href="/vendor/dashboard"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <Store className="w-4 h-4 text-amber-400" />
              <h1 className="text-sm md:text-base font-black text-white">Vendor Storefront Designer</h1>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                BRAND COMPLIANT
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Customize store banner, artisan bio & showcase layout within approved brand guidelines</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2 bg-gradient-to-r from-fancy-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-lg active:scale-95 transition disabled:opacity-50"
        >
          {saveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saveSuccess ? "Published!" : isSaving ? "Saving..." : "Save Storefront"}</span>
        </button>
      </header>

      {/* Violation Alert */}
      {violationAlerts.length > 0 && (
        <div className="p-4 bg-amber-950/40 border border-amber-800 rounded-2xl flex items-center space-x-3 text-amber-300 text-xs">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <span className="font-bold block">Brand Guideline Notice:</span>
            <span>{violationAlerts.join(" • ")}</span>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Form */}
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
          <span className="text-xs font-black text-slate-300 uppercase tracking-wider block">
            Store Identity & Styling
          </span>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Store Name</label>
            <input
              type="text"
              value={design.storeName}
              onChange={(e) => setDesign({ ...design, storeName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Store Tagline / Craft Specialty</label>
            <input
              type="text"
              value={design.tagline || ""}
              onChange={(e) => setDesign({ ...design, tagline: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Artisan Bio & Weaver Story</label>
            <textarea
              rows={3}
              value={design.storyBio || ""}
              onChange={(e) => setDesign({ ...design, storyBio: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs"
            />
          </div>

          {/* Accent Color Selection */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Storefront Accent Highlight (Admin Approved Palette)
            </label>
            <div className="flex space-x-2">
              {allowedColors.map((hex) => (
                <button
                  key={hex}
                  onClick={() => setDesign({ ...design, accentColor: hex })}
                  className={`w-8 h-8 rounded-xl border transition ${
                    design.accentColor === hex ? "ring-2 ring-white scale-110" : "opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>

          {/* Layout Style */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Storefront Showcase Layout</label>
            <div className="grid grid-cols-2 gap-2">
              {(["ARTISAN_SHOWCASE", "GRID", "BANNER_FOCUS", "MINIMAL"] as VendorStoreLayoutStyle[]).map((st) => (
                <button
                  key={st}
                  onClick={() => setDesign({ ...design, layoutStyle: st })}
                  className={`p-2.5 rounded-xl border font-bold text-xs capitalize transition ${
                    design.layoutStyle === st
                      ? "bg-fancy-blue text-white border-fancy-blue shadow"
                      : "bg-slate-950 border-slate-800 text-slate-400"
                  }`}
                >
                  {st.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Live Storefront Preview */}
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
          <span className="text-xs font-black text-slate-300 uppercase tracking-wider block">
            Live Storefront Showcase Mockup
          </span>

          <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl space-y-4">
            {/* Banner */}
            <div className="h-36 bg-slate-800 relative">
              <img src={design.bannerUrl} alt="Store Banner" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
            </div>

            <div className="p-5 pt-0 space-y-3">
              <div className="flex items-center space-x-3 -mt-8 relative z-10">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-xl bg-slate-900">
                  <img src={design.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{design.storeName}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded text-white" style={{ backgroundColor: design.accentColor }}>
                    VERIFIED WEAVER GUILD
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{design.storyBio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
