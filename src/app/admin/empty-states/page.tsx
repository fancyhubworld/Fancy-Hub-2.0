"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  PackageOpen,
  ShoppingBag,
  Heart,
  Search,
  AlertCircle,
  FileQuestion,
  Check,
  Save,
  Eye,
  Sliders,
} from "lucide-react";
import { DEFAULT_EMPTY_STATES, EmptyStateType, EmptyStateItemConfig } from "@/lib/empty-states-engine";

export default function AdminEmptyStatesPage() {
  const [emptyStates, setEmptyStates] = useState<Record<EmptyStateType, EmptyStateItemConfig>>(DEFAULT_EMPTY_STATES);
  const [activeType, setActiveType] = useState<EmptyStateType>("not_found_404");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/admin/empty-states")
      .then((res) => res.json())
      .then((data) => {
        if (data.emptyStates) {
          setEmptyStates(data.emptyStates);
        }
      })
      .catch(() => {});
  }, []);

  const currentItem = emptyStates[activeType] || DEFAULT_EMPTY_STATES[activeType];

  const handleUpdateCurrent = (updates: Partial<EmptyStateItemConfig>) => {
    setEmptyStates((prev) => ({
      ...prev,
      [activeType]: {
        ...prev[activeType],
        ...updates,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/admin/empty-states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emptyStates),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e) {
      console.error("Save empty states failed:", e);
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
              <PackageOpen className="w-4 h-4 text-fancy-blue" />
              <h1 className="text-sm md:text-base font-black text-white">Empty States & 404 Page Builder</h1>
              <span className="text-[10px] bg-fancy-blue/20 text-fancy-blue font-bold px-2.5 py-0.5 rounded-full border border-fancy-blue/30">
                6 EMPTY STATES • CUSTOM 404
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Configure fallback illustrations, search prompts & quick category links</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2 bg-gradient-to-r from-fancy-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-lg active:scale-95 transition disabled:opacity-50"
        >
          {saveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saveSuccess ? "Published!" : isSaving ? "Saving..." : "Save Empty States"}</span>
        </button>
      </header>

      {/* Tabs for 6 Empty State Screens */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {[
          { type: "not_found_404" as EmptyStateType, label: "404 Not Found", icon: FileQuestion },
          { type: "no_products" as EmptyStateType, label: "No Products", icon: PackageOpen },
          { type: "empty_cart" as EmptyStateType, label: "Empty Cart", icon: ShoppingBag },
          { type: "empty_wishlist" as EmptyStateType, label: "Empty Wishlist", icon: Heart },
          { type: "no_search_results" as EmptyStateType, label: "No Search Results", icon: Search },
          { type: "no_orders" as EmptyStateType, label: "No Orders", icon: AlertCircle },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isSelected = activeType === tab.type;
          return (
            <button
              key={tab.type}
              onClick={() => setActiveType(tab.type)}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-1.5 transition text-center ${
                isSelected
                  ? "bg-fancy-blue text-white border-fancy-blue shadow-lg"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span className="text-xs font-bold">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Form Controls */}
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
          <span className="text-xs font-black text-slate-300 uppercase tracking-wider block">
            Content Customizer
          </span>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Headline Text</label>
            <input
              type="text"
              value={currentItem.title}
              onChange={(e) => handleUpdateCurrent({ title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Description Paragraph</label>
            <textarea
              rows={3}
              value={currentItem.description}
              onChange={(e) => handleUpdateCurrent({ description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Illustration / Image URL</label>
            <input
              type="text"
              value={currentItem.imageUrl}
              onChange={(e) => handleUpdateCurrent({ imageUrl: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 font-mono text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">CTA Button Text</label>
              <input
                type="text"
                value={currentItem.buttonText}
                onChange={(e) => handleUpdateCurrent({ buttonText: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">CTA Destination Link</label>
              <input
                type="text"
                value={currentItem.buttonLink}
                onChange={(e) => handleUpdateCurrent({ buttonLink: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Right Live Render Preview */}
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-36 h-36 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
            <img src={currentItem.imageUrl} alt="Empty State" className="w-full h-full object-cover" />
          </div>

          <div className="space-y-1.5 max-w-sm">
            <h3 className="text-lg font-black text-white">{currentItem.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{currentItem.description}</p>
          </div>

          <Link
            href={currentItem.buttonLink || "/"}
            className="px-6 py-2.5 bg-fancy-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition shadow-lg"
          >
            {currentItem.buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
}
