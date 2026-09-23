"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Bot,
  MessageCircle,
  Headphones,
  Tag,
  ArrowUp,
  Save,
  Check,
  Smartphone,
  Monitor,
  Heart,
  ShoppingCart,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import {
  FloatingWidgetSettings,
  FloatingPosition,
  DEFAULT_FLOATING_WIDGETS,
  FloatingActionItem,
} from "@/lib/floating-widgets-types";

export default function AdminFloatingWidgetsPage() {
  const [settings, setSettings] = useState<FloatingWidgetSettings>(DEFAULT_FLOATING_WIDGETS);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/admin/floating-widgets")
      .then((res) => res.json())
      .then((data) => {
        if (data.floating) {
          setSettings(data.floating);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/admin/floating-widgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e) {
      console.error("Save floating widgets failed:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleAction = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      actions: prev.actions.map((act) =>
        act.id === id ? { ...act, isEnabled: !act.isEnabled } : act
      ),
    }));
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
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <h1 className="text-sm md:text-base font-black text-white">Floating Quick Action Bar</h1>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                WHATSAPP • AI • SUPPORT • CART
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Configure quick contact floating triggers across Desktop & Mobile viewports</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2 bg-gradient-to-r from-fancy-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-lg active:scale-95 transition disabled:opacity-50"
        >
          {saveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saveSuccess ? "Saved!" : isSaving ? "Saving..." : "Save Settings"}</span>
        </button>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Settings */}
        <div className="space-y-4">
          <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
            <span className="text-xs font-black text-slate-300 block uppercase tracking-wider">
              Positioning & Viewports
            </span>

            {/* Desktop Position */}
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-white mb-2">
                <Monitor className="w-4 h-4 text-fancy-blue" />
                <span>Desktop Position</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(["bottom_right", "bottom_left", "top_right", "top_left"] as FloatingPosition[]).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setSettings({ ...settings, desktopPosition: pos })}
                    className={`py-2 rounded-xl border font-bold capitalize transition ${
                      settings.desktopPosition === pos
                        ? "bg-fancy-blue text-white border-fancy-blue shadow"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {pos.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Position */}
            <div className="pt-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-white mb-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Mobile Position</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(["bottom_right", "bottom_left", "top_right", "top_left"] as FloatingPosition[]).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setSettings({ ...settings, mobilePosition: pos })}
                    className={`py-2 rounded-xl border font-bold capitalize transition ${
                      settings.mobilePosition === pos
                        ? "bg-emerald-600 text-white border-emerald-500 shadow"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {pos.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center Actions List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
            <span className="text-xs font-black text-slate-300 block uppercase tracking-wider">
              Quick Action Buttons
            </span>

            <div className="space-y-3">
              {settings.actions.map((act) => (
                <div
                  key={act.id}
                  className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow"
                      style={{ backgroundColor: act.iconBgColor || "#1455D9" }}
                    >
                      {act.type === "whatsapp" && <MessageCircle className="w-5 h-5" />}
                      {act.type === "ai_assistant" && <Bot className="w-5 h-5" />}
                      {act.type === "support" && <Headphones className="w-5 h-5" />}
                      {act.type === "coupon" && <Tag className="w-5 h-5" />}
                      {act.type === "back_to_top" && <ArrowUp className="w-5 h-5" />}
                      {act.type === "chat" && <MessageSquare className="w-5 h-5" />}
                      {act.type === "wishlist" && <Heart className="w-5 h-5" />}
                      {act.type === "cart" && <ShoppingCart className="w-5 h-5" />}
                    </div>

                    <div>
                      <span className="font-bold text-white text-xs block">{act.label}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{act.targetLink || "In-page scroll action"}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {act.badge && (
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                        {act.badge}
                      </span>
                    )}

                    <input
                      type="checkbox"
                      checked={act.isEnabled}
                      onChange={() => handleToggleAction(act.id)}
                      className="w-4 h-4 accent-fancy-blue rounded cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
