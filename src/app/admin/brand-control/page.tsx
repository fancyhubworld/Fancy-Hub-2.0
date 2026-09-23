"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Lock,
  Unlock,
  Shield,
  ShieldAlert,
  Palette,
  Check,
  Save,
  Type,
  FileText,
  CreditCard,
  Image as ImageIcon,
} from "lucide-react";
import { DEFAULT_BRAND_LOCK_SETTINGS, BrandLockSettings } from "@/lib/brand-lock-engine";

export default function AdminBrandControlPage() {
  const [settings, setSettings] = useState<BrandLockSettings>(DEFAULT_BRAND_LOCK_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/admin/brand-control")
      .then((res) => res.json())
      .then((data) => {
        if (data.brandLock) setSettings(data.brandLock);
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/admin/brand-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e) {
      console.error("Save brand control failed:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const lockToggles = [
    { key: "lockLogo" as keyof BrandLockSettings, label: "Lock Global Marketplace Logo", desc: "Vendors cannot remove FancyHub watermark or replace primary logo", icon: ImageIcon },
    { key: "lockPrimaryColor" as keyof BrandLockSettings, label: "Lock Primary Brand Blue (#1455D9)", desc: "Enforce uniform Indian Royal Blue for global navigation and core buttons", icon: Palette },
    { key: "lockFont" as keyof BrandLockSettings, label: "Lock Typography Scale & Fonts", desc: "Vendors cannot alter global font families or heading sizes", icon: Type },
    { key: "lockFooter" as keyof BrandLockSettings, label: "Lock Global Footer & Copyright", desc: "Preserve mandatory marketplace legal disclaimers and weaver credits", icon: FileText },
    { key: "lockLegalLinks" as keyof BrandLockSettings, label: "Lock Mandatory Policies & Terms", desc: "Require Return Policy, Privacy Policy & Grievance Officer links", icon: Shield },
    { key: "lockPaymentBranding" as keyof BrandLockSettings, label: "Lock Payment Trust Badges", desc: "Display verified UPI, RuPay, Visa, Mastercard & COD assurance strips", icon: CreditCard },
  ];

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
              <ShieldAlert className="w-4 h-4 text-fancy-blue" />
              <h1 className="text-sm md:text-base font-black text-white">Global Brand Lockdown Control</h1>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-2.5 py-0.5 rounded-full border border-rose-500/30">
                SUPER ADMIN GOVERNANCE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Lock core identity tokens to prevent vendors from overriding brand standards</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2 bg-gradient-to-r from-fancy-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-lg active:scale-95 transition disabled:opacity-50"
        >
          {saveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saveSuccess ? "Locks Saved!" : isSaving ? "Saving..." : "Save Brand Locks"}</span>
        </button>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Lock Toggles */}
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
          <span className="text-xs font-black text-slate-300 uppercase tracking-wider block">
            Brand Protection Rules
          </span>

          <div className="space-y-3">
            {lockToggles.map((item) => {
              const IconComp = item.icon;
              const isLocked = Boolean(settings[item.key]);

              return (
                <div
                  key={item.key}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition ${
                    isLocked
                      ? "bg-slate-950 border-slate-800"
                      : "bg-amber-950/20 border-amber-800/40"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isLocked ? "bg-fancy-blue/20 text-fancy-blue" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>

                    <div>
                      <span className="font-bold text-white text-xs block">{item.label}</span>
                      <span className="text-[10px] text-slate-400">{item.desc}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isLocked ? (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded flex items-center space-x-1">
                        <Lock className="w-3 h-3" />
                        <span>LOCKED</span>
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded flex items-center space-x-1">
                        <Unlock className="w-3 h-3" />
                        <span>OPEN</span>
                      </span>
                    )}

                    <input
                      type="checkbox"
                      checked={isLocked}
                      onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                      className="w-4 h-4 accent-fancy-blue rounded cursor-pointer"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Allowed Vendor Palettes */}
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
          <span className="text-xs font-black text-slate-300 uppercase tracking-wider block">
            Approved Vendor Accent Colors
          </span>
          <p className="text-xs text-slate-400">
            Vendors may only select accent highlights from this curated palette to ensure cohesive visual harmony across all seller stores.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {settings.allowedVendorAccentColors.map((hex) => (
              <div
                key={hex}
                className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center space-x-2.5"
              >
                <span className="w-6 h-6 rounded-full border border-white/20 shadow" style={{ backgroundColor: hex }} />
                <span className="text-xs font-mono font-bold text-slate-300">{hex}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-xs font-bold text-white block">Vendor Widget Whitelist</span>
            <div className="flex flex-wrap gap-2">
              {settings.allowedVendorWidgets.map((w) => (
                <span key={w} className="text-[10px] bg-slate-950 border border-slate-800 text-fancy-blue font-mono px-2.5 py-1 rounded-xl">
                  ✓ {w}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
