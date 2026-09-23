"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Layout,
  Palette,
  Type,
  Maximize2,
  Sliders,
  Sparkles,
  Save,
  Check,
  RotateCcw,
  Eye,
  Lock,
  ShoppingBag,
  Heart,
  Package,
  Store,
  User,
  ShieldCheck,
  FileText,
  Smartphone,
  Tablet,
  Monitor,
} from "lucide-react";
import {
  SystemPageKey,
  SystemPageUIConfig,
  DEFAULT_SYSTEM_PAGES_CONFIG,
} from "@/lib/system-page-config";
import { ROUTES } from "@/lib/routes";

const SYSTEM_PAGES_LIST: { id: SystemPageKey; name: string; icon: any; route: string }[] = [
  { id: "login", name: "Login Portal", icon: Lock, route: "/login" },
  { id: "register", name: "Registration", icon: User, route: "/register" },
  { id: "cart", name: "Cart / Bag", icon: ShoppingBag, route: "/cart" },
  { id: "checkout", name: "Checkout Flow", icon: ShieldCheck, route: "/checkout" },
  { id: "account", name: "My Account", icon: User, route: "/account/profile" },
  { id: "orders", name: "Orders & Tracking", icon: Package, route: "/orders" },
  { id: "wishlist", name: "My Wishlist", icon: Heart, route: "/wishlist" },
  { id: "vendor-dashboard", name: "Vendor Dashboard", icon: Store, route: "/vendor/dashboard" },
];

export default function AdminSystemPagesCustomizerPage() {
  const [selectedKey, setSelectedKey] = useState<SystemPageKey>("login");
  const [configs, setConfigs] = useState<Record<SystemPageKey, SystemPageUIConfig>>(DEFAULT_SYSTEM_PAGES_CONFIG);
  const [activeTab, setActiveTab] = useState<"layout" | "colors" | "typography" | "components" | "emptystates" | "messages">("layout");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/system-pages")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.pages) {
          setConfigs(data.pages);
        }
      })
      .catch(() => {});
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const currentConfig = configs[selectedKey] || DEFAULT_SYSTEM_PAGES_CONFIG[selectedKey];

  const updateCurrentConfig = (updater: (prev: SystemPageUIConfig) => SystemPageUIConfig) => {
    setConfigs((prev) => ({
      ...prev,
      [selectedKey]: updater(prev[selectedKey] || DEFAULT_SYSTEM_PAGES_CONFIG[selectedKey]),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/system-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageKey: selectedKey,
          config: currentConfig,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✅ Saved UI Configuration for ${currentConfig.name}!`);
      } else {
        showToast(`❌ Save failed: ${data.error}`);
      }
    } catch (e: any) {
      showToast("❌ Network error saving configuration");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    if (!confirm(`Reset ${currentConfig.name} styling back to system defaults?`)) return;
    setConfigs((prev) => ({
      ...prev,
      [selectedKey]: JSON.parse(JSON.stringify(DEFAULT_SYSTEM_PAGES_CONFIG[selectedKey])),
    }));
    showToast("Reset to default settings");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-4">
          <Link
            href={ROUTES.admin.dashboard}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Admin ERP</span>
              <span className="text-[11px] text-slate-600">→</span>
              <span className="text-sm font-black text-white">System Pages UI Customizer</span>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                Protected Business Logic
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleResetToDefault}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition text-xs font-bold flex items-center space-x-1"
            title="Reset to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-fancy-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black flex items-center space-x-2 shadow-lg active:scale-95 transition disabled:opacity-40 text-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? "Saving..." : "Save UI Config"}</span>
          </button>
        </div>
      </header>

      {/* Main Studio Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: System Pages List */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 p-3 space-y-1.5 overflow-y-auto">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider px-2 py-1 block">
            System Pages ({SYSTEM_PAGES_LIST.length})
          </span>

          {SYSTEM_PAGES_LIST.map((page) => {
            const Icon = page.icon;
            const isSelected = selectedKey === page.id;
            return (
              <button
                key={page.id}
                onClick={() => setSelectedKey(page.id)}
                className={`w-full p-3 rounded-2xl text-left flex items-center space-x-3 transition ${
                  isSelected
                    ? "bg-fancy-blue text-white shadow-md font-bold"
                    : "bg-slate-950 text-slate-400 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <div className={`p-2 rounded-xl ${isSelected ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold block truncate">{page.name}</span>
                  <span className={`text-[10px] font-mono block ${isSelected ? "text-blue-100" : "text-slate-500"}`}>
                    {page.route}
                  </span>
                </div>
              </button>
            );
          })}

          <div className="pt-4 mt-auto border-t border-slate-800 text-[11px] text-slate-500 p-2 space-y-1">
            <span className="font-bold text-amber-400 block">🔒 Business Logic Safe</span>
            <p className="leading-tight">
              Changes only affect colors, typography, cards, buttons, header/footer, and empty states. Payment processing & authentication logic cannot be modified or broken.
            </p>
          </div>
        </aside>

        {/* Center: Interactive Customizer Inspector */}
        <div className="w-96 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 overflow-y-auto">
          {/* Customizer Tabs */}
          <div className="grid grid-cols-3 p-2 border-b border-slate-800 text-[11px] font-bold text-center gap-1">
            <button
              onClick={() => setActiveTab("layout")}
              className={`py-2 rounded-xl transition ${activeTab === "layout" ? "bg-slate-800 text-fancy-blue shadow" : "text-slate-400 hover:text-white"}`}
            >
              Header/Footer
            </button>
            <button
              onClick={() => setActiveTab("colors")}
              className={`py-2 rounded-xl transition ${activeTab === "colors" ? "bg-slate-800 text-fancy-blue shadow" : "text-slate-400 hover:text-white"}`}
            >
              Colors & Fonts
            </button>
            <button
              onClick={() => setActiveTab("components")}
              className={`py-2 rounded-xl transition ${activeTab === "components" ? "bg-slate-800 text-fancy-blue shadow" : "text-slate-400 hover:text-white"}`}
            >
              Cards & Forms
            </button>
          </div>

          <div className="p-4 space-y-5 text-xs">
            {/* 1. LAYOUT TAB */}
            {activeTab === "layout" && (
              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Header Style</label>
                  <select
                    value={currentConfig.headerStyle}
                    onChange={(e: any) =>
                      updateCurrentConfig((prev) => ({ ...prev, headerStyle: e.target.value }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  >
                    <option value="default">Full Storefront Header</option>
                    <option value="minimal">Minimal Distraction-Free Header</option>
                    <option value="sticky">Sticky Floating Header</option>
                    <option value="hidden">Hidden (Zero Distraction)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Footer Style</label>
                  <select
                    value={currentConfig.footerStyle}
                    onChange={(e: any) =>
                      updateCurrentConfig((prev) => ({ ...prev, footerStyle: e.target.value }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  >
                    <option value="default">Full Multi-Column Footer</option>
                    <option value="compact">Compact Single-Row Footer</option>
                    <option value="minimal">Minimal Copyright Bar</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Page Spacing Scale</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["compact", "normal", "relaxed"].map((sp) => (
                      <button
                        key={sp}
                        onClick={() => updateCurrentConfig((prev) => ({ ...prev, spacing: sp as any }))}
                        className={`p-2.5 rounded-xl border text-center font-bold capitalize transition ${
                          currentConfig.spacing === sp
                            ? "bg-fancy-blue/20 border-fancy-blue text-fancy-blue"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {sp}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <label className="block font-bold text-slate-300">Top Notice Ribbon Message</label>
                  <input
                    type="text"
                    placeholder="e.g. Free delivery on orders above ₹999"
                    value={currentConfig.messages?.topNotice || ""}
                    onChange={(e) =>
                      updateCurrentConfig((prev) => ({
                        ...prev,
                        messages: { ...prev.messages, topNotice: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />

                  <label className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800 cursor-pointer">
                    <span className="font-bold text-white">Show Security & Trust Badges</span>
                    <input
                      type="checkbox"
                      checked={currentConfig.messages?.showTrustBadges}
                      onChange={(e) =>
                        updateCurrentConfig((prev) => ({
                          ...prev,
                          messages: { ...prev.messages, showTrustBadges: e.target.checked },
                        }))
                      }
                      className="w-4 h-4 accent-fancy-blue"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* 2. COLORS & FONTS TAB */}
            {activeTab === "colors" && (
              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Primary Action Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={currentConfig.colors.primaryColor}
                      onChange={(e) =>
                        updateCurrentConfig((prev) => ({
                          ...prev,
                          colors: { ...prev.colors, primaryColor: e.target.value },
                        }))
                      }
                      className="w-9 h-9 rounded-xl bg-transparent cursor-pointer border border-slate-700"
                    />
                    <input
                      type="text"
                      value={currentConfig.colors.primaryColor}
                      onChange={(e) =>
                        updateCurrentConfig((prev) => ({
                          ...prev,
                          colors: { ...prev.colors, primaryColor: e.target.value },
                        }))
                      }
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono uppercase font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Font Family</label>
                  <select
                    value={currentConfig.typography.fontFamily}
                    onChange={(e: any) =>
                      updateCurrentConfig((prev) => ({
                        ...prev,
                        typography: { ...prev.typography, fontFamily: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  >
                    <option value="Inter">Inter (Clean & Modern)</option>
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans (SaaS & Premium)</option>
                    <option value="Outfit">Outfit (Contemporary Indian)</option>
                    <option value="Playfair Display">Playfair Display (Luxury & Silk Heritage)</option>
                    <option value="Roboto">Roboto (Classic)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Heading Size Scale</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["sm", "md", "lg", "xl"].map((scale) => (
                      <button
                        key={scale}
                        onClick={() =>
                          updateCurrentConfig((prev) => ({
                            ...prev,
                            typography: { ...prev.typography, headingScale: scale as any },
                          }))
                        }
                        className={`p-2 rounded-xl border text-center font-bold uppercase transition ${
                          currentConfig.typography.headingScale === scale
                            ? "bg-fancy-blue/20 border-fancy-blue text-fancy-blue"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {scale}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. COMPONENTS TAB (CARDS, BUTTONS, FORMS & EMPTY STATES) */}
            {activeTab === "components" && (
              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Card Presentation Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["elevated", "glass", "flat", "bordered"].map((st) => (
                      <button
                        key={st}
                        onClick={() =>
                          updateCurrentConfig((prev) => ({
                            ...prev,
                            cards: { ...prev.cards, style: st as any },
                          }))
                        }
                        className={`p-2 rounded-xl border text-left font-bold capitalize transition ${
                          currentConfig.cards.style === st
                            ? "bg-fancy-blue/20 border-fancy-blue text-fancy-blue"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Card Border Radius</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["rounded-lg", "rounded-2xl", "rounded-3xl"].map((rad) => (
                      <button
                        key={rad}
                        onClick={() =>
                          updateCurrentConfig((prev) => ({
                            ...prev,
                            cards: { ...prev.cards, borderRadius: rad as any },
                          }))
                        }
                        className={`p-2 rounded-xl border text-center font-mono text-[10px] transition ${
                          currentConfig.cards.borderRadius === rad
                            ? "bg-fancy-blue/20 border-fancy-blue text-fancy-blue font-bold"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {rad}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Primary Button Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["gradient", "solid", "outline", "soft"].map((bStyle) => (
                      <button
                        key={bStyle}
                        onClick={() =>
                          updateCurrentConfig((prev) => ({
                            ...prev,
                            buttons: { ...prev.buttons, style: bStyle as any },
                          }))
                        }
                        className={`p-2 rounded-xl border text-left font-bold capitalize transition ${
                          currentConfig.buttons.style === bStyle
                            ? "bg-fancy-blue/20 border-fancy-blue text-fancy-blue"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {bStyle}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <label className="block font-bold text-slate-300">Custom Empty State Title</label>
                  <input
                    type="text"
                    value={currentConfig.emptyStates.title}
                    onChange={(e) =>
                      updateCurrentConfig((prev) => ({
                        ...prev,
                        emptyStates: { ...prev.emptyStates, title: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  />

                  <label className="block font-bold text-slate-300">Empty State Description</label>
                  <textarea
                    rows={2}
                    value={currentConfig.emptyStates.description}
                    onChange={(e) =>
                      updateCurrentConfig((prev) => ({
                        ...prev,
                        emptyStates: { ...prev.emptyStates, description: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Mockup Canvas */}
        <main className="flex-1 bg-slate-950/80 p-6 flex flex-col items-center justify-start overflow-y-auto">
          <div className="w-full max-w-4xl mb-4 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white">Live System Page Preview:</span>
              <span className="text-fancy-blue font-mono font-bold">{currentConfig.name}</span>
            </div>

            <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800 space-x-1">
              <button
                onClick={() => setViewport("desktop")}
                className={`p-1.5 rounded-xl transition ${viewport === "desktop" ? "bg-fancy-blue text-white" : "text-slate-400 hover:text-white"}`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewport("tablet")}
                className={`p-1.5 rounded-xl transition ${viewport === "tablet" ? "bg-fancy-blue text-white" : "text-slate-400 hover:text-white"}`}
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewport("mobile")}
                className={`p-1.5 rounded-xl transition ${viewport === "mobile" ? "bg-fancy-blue text-white" : "text-slate-400 hover:text-white"}`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Device Mockup */}
          <div
            className={`transition-all duration-300 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col min-h-[600px] ${
              viewport === "mobile"
                ? "w-[375px] max-w-[375px]"
                : viewport === "tablet"
                ? "w-[768px] max-w-[768px]"
                : "w-full max-w-4xl"
            }`}
            style={{ fontFamily: currentConfig.typography.fontFamily }}
          >
            {/* Header Preview */}
            {currentConfig.headerStyle !== "hidden" && (
              <div className="bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 flex items-center justify-between">
                <span className="font-black text-fancy-blue text-sm">FancyHub.in</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {currentConfig.headerStyle.toUpperCase()} HEADER
                </span>
              </div>
            )}

            {/* Top Notice */}
            {currentConfig.messages?.topNotice && (
              <div className="bg-gradient-to-r from-fancy-blue to-indigo-600 text-white text-xs font-bold py-1.5 px-4 text-center">
                {currentConfig.messages.topNotice}
              </div>
            )}

            {/* Dynamic System Page Body Simulation */}
            <div className="p-8 flex-1 flex flex-col items-center justify-center space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  {currentConfig.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {currentConfig.description}
                </p>
              </div>

              {/* Sample Card Mockup */}
              <div
                className={`w-full max-w-md p-6 space-y-4 ${
                  currentConfig.cards.style === "glass"
                    ? "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60"
                    : currentConfig.cards.style === "bordered"
                    ? "bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl"
                } ${currentConfig.cards.borderRadius}`}
              >
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    Sample Input Field
                  </label>
                  <input
                    type="text"
                    disabled
                    placeholder="Enter email or mobile number..."
                    className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 text-xs ${currentConfig.forms.inputRadius}`}
                  />
                </div>

                <button
                  className={`w-full py-3 text-xs uppercase tracking-wider font-black ${
                    currentConfig.buttons.style === "gradient"
                      ? "bg-gradient-to-r from-fancy-blue to-indigo-600 text-white shadow-md"
                      : currentConfig.buttons.style === "outline"
                      ? "border-2 border-fancy-blue text-fancy-blue"
                      : "bg-fancy-blue text-white"
                  } ${currentConfig.buttons.radius}`}
                >
                  Proceed with Business Action
                </button>
              </div>

              {/* Trust Badges Strip */}
              {currentConfig.messages?.showTrustBadges && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-4 text-xs text-slate-500">
                  <span className="flex items-center space-x-1">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span>256-Bit SSL Encrypted</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>100% Guaranteed</span>
                  </span>
                </div>
              )}
            </div>

            {/* Footer Preview */}
            {currentConfig.footerStyle !== "hidden" && (
              <div className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-3 px-6 text-center text-xs text-slate-400 font-mono">
                {currentConfig.footerStyle.toUpperCase()} FOOTER
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-slide-up">
          <Sparkles className="w-4 h-4 text-fancy-blue" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
