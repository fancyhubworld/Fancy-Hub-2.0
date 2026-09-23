"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Globe,
  Search,
  Check,
  Save,
  Sparkles,
  Share2,
  Code2,
  ExternalLink,
  Tag,
  Layers,
} from "lucide-react";
import { DEFAULT_STORE_SEO, PageSeoConfig, generateAutomatedCategorySeo } from "@/lib/seo-engine";

export default function AdminSeoStudioPage() {
  const [seo, setSeo] = useState<PageSeoConfig>(DEFAULT_STORE_SEO);
  const [testHierarchy, setTestHierarchy] = useState("Fashion > Men > Shirts");
  const [activeTab, setActiveTab] = useState<"global" | "automation" | "schema">("global");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAutomateCategory = () => {
    const parts = testHierarchy.split(">").map((s) => s.trim()).filter(Boolean);
    const generated = generateAutomatedCategorySeo(parts);
    setSeo(generated);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }, 400);
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
              <Globe className="w-4 h-4 text-fancy-blue" />
              <h1 className="text-sm md:text-base font-black text-white">SEO & Metadata Automation Studio</h1>
              <span className="text-[10px] bg-fancy-blue/20 text-fancy-blue font-bold px-2.5 py-0.5 rounded-full border border-fancy-blue/30">
                AUTO-META • SERP PREVIEW • JSON-LD
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Manage OpenGraph, Twitter cards, Canonical tags & Category hierarchy automation</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2 bg-gradient-to-r from-fancy-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-lg active:scale-95 transition disabled:opacity-50"
        >
          {saveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saveSuccess ? "Saved!" : isSaving ? "Saving..." : "Save SEO Config"}</span>
        </button>
      </header>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab("global")}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === "global" ? "bg-fancy-blue text-white shadow" : "text-slate-400 hover:text-white"
          }`}
        >
          Global Meta Tags
        </button>
        <button
          onClick={() => setActiveTab("automation")}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === "automation" ? "bg-fancy-blue text-white shadow" : "text-slate-400 hover:text-white"
          }`}
        >
          Category Hierarchy Automation
        </button>
        <button
          onClick={() => setActiveTab("schema")}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === "schema" ? "bg-fancy-blue text-white shadow" : "text-slate-400 hover:text-white"
          }`}
        >
          JSON-LD Structured Data
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Form */}
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
          {activeTab === "global" && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">SEO Title (50-60 chars)</label>
                <input
                  type="text"
                  value={seo.seoTitle}
                  onChange={(e) => setSeo({ ...seo, seoTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Meta Description (140-160 chars)</label>
                <textarea
                  rows={3}
                  value={seo.metaDescription}
                  onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Canonical URL</label>
                  <input
                    type="text"
                    value={seo.canonicalUrl}
                    onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Robots Directives</label>
                  <select
                    value={seo.robots}
                    onChange={(e) => setSeo({ ...seo, robots: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
                  >
                    <option value="index,follow">index, follow (Search Visible)</option>
                    <option value="noindex,nofollow">noindex, nofollow (Hidden)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {activeTab === "automation" && (
            <div className="space-y-4">
              <span className="text-xs font-black text-slate-300 uppercase block">
                Category Breadcrumb Path
              </span>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={testHierarchy}
                  onChange={(e) => setTestHierarchy(e.target.value)}
                  placeholder="e.g. Fashion > Men > Shirts"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
                />
                <button
                  onClick={handleAutomateCategory}
                  className="px-4 py-2 bg-fancy-blue text-white rounded-xl text-xs font-bold transition shadow flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Meta</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Example rule: Category "Fashion → Men → Shirts" generates title: "Men's Shirts Online | FancyHub.in"
              </p>
            </div>
          )}

          {activeTab === "schema" && (
            <div className="space-y-3">
              <span className="text-xs font-black text-slate-300 uppercase block">
                Breadcrumb & WebSite JSON-LD
              </span>
              <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto">
                {JSON.stringify(seo.jsonLdSchema || { "@context": "https://schema.org", "@type": "WebSite", "name": "FancyHub" }, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Right Google SERP Live Snippet */}
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-300 uppercase tracking-wider">
              Google Search Result Snippet
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/40 border border-emerald-800 px-2 py-0.5 rounded">
              LIVE SERP PREVIEW
            </span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 text-slate-900 shadow-xl space-y-1.5 font-sans">
            <div className="flex items-center space-x-2 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-800">fancyhub.in</span>
              <span>›</span>
              <span className="text-slate-500 line-clamp-1">{seo.canonicalUrl || "https://fancyhub.in"}</span>
            </div>

            <h3 className="text-base font-medium text-blue-800 hover:underline cursor-pointer line-clamp-1">
              {seo.seoTitle}
            </h3>

            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {seo.metaDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
