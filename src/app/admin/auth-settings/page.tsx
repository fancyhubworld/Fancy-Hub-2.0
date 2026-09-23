"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Key,
  ShieldCheck,
  Check,
  Save,
  Lock,
  Smartphone,
  Mail,
  Palette,
} from "lucide-react";
import { DEFAULT_AUTH_DESIGN, AuthPageDesignConfig } from "@/lib/auth-designer-types";

export default function AdminAuthSettingsPage() {
  const [design, setDesign] = useState<AuthPageDesignConfig>(DEFAULT_AUTH_DESIGN);
  const [googleOAuthConfig, setGoogleOAuthConfig] = useState<{ isEnabled: boolean; clientId: string }>({
    isEnabled: true,
    clientId: "demo-google-client-id",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/admin/auth-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.authDesign) setDesign(data.authDesign);
        if (data.googleAuth) setGoogleOAuthConfig(data.googleAuth);
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/admin/auth-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(design),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e) {
      console.error("Save auth settings failed:", e);
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
              <Key className="w-4 h-4 text-fancy-blue" />
              <h1 className="text-sm md:text-base font-black text-white">Login & Register Page Designer</h1>
              <span className="text-[10px] bg-fancy-blue/20 text-fancy-blue font-bold px-2.5 py-0.5 rounded-full border border-fancy-blue/30">
                GOOGLE OAUTH • PHONE OTP • EMAIL
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Customize sign-in appearance, illustrations, Google login provider & terms</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2 bg-gradient-to-r from-fancy-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-lg active:scale-95 transition disabled:opacity-50"
        >
          {saveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saveSuccess ? "Published!" : isSaving ? "Saving..." : "Save Auth Settings"}</span>
        </button>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Form */}
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
          <span className="text-xs font-black text-slate-300 uppercase tracking-wider block">
            Auth Providers & OAuth Settings
          </span>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex items-center space-x-2.5">
                <span className="w-6 h-6 rounded-full bg-white text-slate-900 flex items-center justify-center font-black text-xs">
                  G
                </span>
                <span className="font-bold text-white text-xs">Google OAuth Sign-In</span>
              </div>
              <input
                type="checkbox"
                checked={design.enableGoogleAuth}
                onChange={(e) => setDesign({ ...design, enableGoogleAuth: e.target.checked })}
                className="w-4 h-4 accent-fancy-blue rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex items-center space-x-2.5">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white text-xs">Mobile Phone OTP Login</span>
              </div>
              <input
                type="checkbox"
                checked={design.enablePhoneAuth}
                onChange={(e) => setDesign({ ...design, enablePhoneAuth: e.target.checked })}
                className="w-4 h-4 accent-fancy-blue rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-white text-xs">Email & Password Login</span>
              </div>
              <input
                type="checkbox"
                checked={design.enableEmailAuth}
                onChange={(e) => setDesign({ ...design, enableEmailAuth: e.target.checked })}
                className="w-4 h-4 accent-fancy-blue rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Headline Heading</label>
              <input
                type="text"
                value={design.headingText}
                onChange={(e) => setDesign({ ...design, headingText: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Subheading Copy</label>
              <textarea
                rows={2}
                value={design.subheadingText}
                onChange={(e) => setDesign({ ...design, subheadingText: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Right Live Visual Render */}
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 flex items-center justify-center">
          <div className="w-full max-w-sm bg-slate-950 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="text-center space-y-1">
              <span className="text-lg font-black text-fancy-blue">Fancy<span className="text-amber-500">Hub.in</span></span>
              <h3 className="text-sm font-bold text-white">{design.headingText}</h3>
              <p className="text-[11px] text-slate-400">{design.subheadingText}</p>
            </div>

            {design.enableGoogleAuth && (
              <button className="w-full py-2.5 bg-white text-slate-900 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow">
                <span className="font-black">G</span>
                <span>Continue with Google</span>
              </button>
            )}

            {design.enablePhoneAuth && (
              <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Continue with Mobile OTP</span>
              </button>
            )}

            <p className="text-[9px] text-slate-500 text-center leading-relaxed">
              {design.termsText} {design.privacyText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
