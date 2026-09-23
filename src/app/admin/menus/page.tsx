"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Menu,
  Check,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  Link2,
  FolderTree,
  Eye,
  CheckCircle2,
} from "lucide-react";
import {
  NavigationMenuType,
  NavigationMenuItem,
  NavigationItemType,
  NavigationMenuConfig,
  DEFAULT_NAVIGATION_MENUS,
} from "@/lib/navigation-builder-types";
import { LinkValidationReport } from "@/lib/page-link-validator";

export default function AdminNavigationBuilderPage() {
  const [activeMenuType, setActiveMenuType] = useState<NavigationMenuType>("main_menu");
  const [menus, setMenus] = useState<Record<NavigationMenuType, NavigationMenuConfig>>(DEFAULT_NAVIGATION_MENUS);
  const [validationReport, setValidationReport] = useState<LinkValidationReport | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/admin/navigation")
      .then((res) => res.json())
      .then((data) => {
        if (data.menus) {
          setMenus(data.menus);
        }
      })
      .catch(() => {});
  }, []);

  const currentMenu = menus[activeMenuType] || DEFAULT_NAVIGATION_MENUS[activeMenuType];

  const handleValidateLinks = async () => {
    setIsValidating(true);
    try {
      const res = await fetch("/api/admin/validate-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: currentMenu.items }),
      });
      const data = await res.json();
      if (data.report) {
        setValidationReport(data.report);
      }
    } catch (e) {
      console.error("Link validation failed:", e);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/admin/navigation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menuType: activeMenuType,
          menuData: currentMenu,
        }),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      handleValidateLinks();
    } catch (e) {
      console.error("Save menu failed:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddItem = (type: NavigationItemType) => {
    const newItem: NavigationMenuItem = {
      id: `nav-item-${Date.now()}`,
      label: `New ${type.replace("_", " ")}`,
      type,
      target: type === "category" ? "/category/sarees" : type === "product" ? "/product/banarasi-pure-silk-saree" : "/shop",
      sortOrder: currentMenu.items.length,
      isActive: true,
    };

    setMenus((prev) => ({
      ...prev,
      [activeMenuType]: {
        ...prev[activeMenuType],
        items: [...prev[activeMenuType].items, newItem],
      },
    }));
  };

  const handleUpdateItem = (id: string, updates: Partial<NavigationMenuItem>) => {
    setMenus((prev) => ({
      ...prev,
      [activeMenuType]: {
        ...prev[activeMenuType],
        items: prev[activeMenuType].items.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
      },
    }));
  };

  const handleDeleteItem = (id: string) => {
    setMenus((prev) => ({
      ...prev,
      [activeMenuType]: {
        ...prev[activeMenuType],
        items: prev[activeMenuType].items.filter((item) => item.id !== id),
      },
    }));
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const items = [...currentMenu.items];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const temp = items[index];
    items[index] = items[targetIdx];
    items[targetIdx] = temp;

    setMenus((prev) => ({
      ...prev,
      [activeMenuType]: {
        ...prev[activeMenuType],
        items,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* 1. Header */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 md:px-8 flex items-center justify-between z-30">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/pages"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <Menu className="w-4 h-4 text-fancy-blue" />
              <h1 className="text-sm md:text-base font-black text-white">Website Navigation & Menu Builder</h1>
              <span className="text-[10px] bg-fancy-blue/20 text-fancy-blue font-bold px-2.5 py-0.5 rounded-full">
                5 MENUS • LINK VALIDATOR
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Desktop Main Menu, Mobile Drawer, Footers, Account & Seller Menus</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleValidateLinks}
            disabled={isValidating}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isValidating ? "Validating..." : "Run Link Audit"}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 bg-gradient-to-r from-fancy-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-lg active:scale-95 transition disabled:opacity-50"
          >
            {saveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{saveSuccess ? "Published Live!" : isSaving ? "Saving..." : "Save Navigation"}</span>
          </button>
        </div>
      </header>

      {/* 2. Menu Type Tabs */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-2 flex items-center space-x-2 overflow-x-auto">
        {[
          { id: "main_menu" as NavigationMenuType, label: "Main Header Menu" },
          { id: "mobile_menu" as NavigationMenuType, label: "Mobile Menu" },
          { id: "footer_menu" as NavigationMenuType, label: "Footer Menu" },
          { id: "account_menu" as NavigationMenuType, label: "Account Menu" },
          { id: "vendor_menu" as NavigationMenuType, label: "Vendor Menu" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveMenuType(tab.id);
              setValidationReport(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeMenuType === tab.id
                ? "bg-fancy-blue text-white shadow"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 3. Link Audit Report Notice (Section 37) */}
      {validationReport && (
        <div className="p-4 bg-slate-900 border-b border-slate-800">
          <div
            className={`p-3 rounded-2xl border flex items-center justify-between ${
              validationReport.brokenCount === 0
                ? "bg-emerald-950/40 border-emerald-800 text-emerald-300"
                : "bg-rose-950/40 border-rose-800 text-rose-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              {validationReport.brokenCount === 0 ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              )}
              <div className="text-xs">
                <span className="font-bold block">
                  {validationReport.brokenCount === 0
                    ? `✓ Link Audit Passed: All ${validationReport.totalLinksChecked} links verified successfully (Zero 404s).`
                    : `⚠️ Target Validation Alert: ${validationReport.brokenCount} broken link(s) found out of ${validationReport.totalLinksChecked} checked.`}
                </span>
                {validationReport.issues.length > 0 && (
                  <span className="text-[11px] opacity-80 block mt-0.5">
                    {validationReport.issues.map((i) => i.message).join(" • ")}
                  </span>
                )}
              </div>
            </div>

            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-black/40">
              {validationReport.brokenCount} ERRORS • {validationReport.warningCount} WARNS
            </span>
          </div>
        </div>
      )}

      {/* 4. Main Menu Builder Grid */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Items List */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-white">{currentMenu.name}</h2>
              <p className="text-xs text-slate-400">{currentMenu.description}</p>
            </div>
            <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2.5 py-1 rounded-lg">
              {currentMenu.items.length} Menu Items
            </span>
          </div>

          <div className="space-y-2.5">
            {currentMenu.items.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="text-xs font-mono text-slate-500 w-5">#{idx + 1}</span>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleUpdateItem(item.id, { label: e.target.value })}
                      placeholder="Menu Label"
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-bold text-xs flex-1"
                    />
                    <select
                      value={item.type}
                      onChange={(e) => handleUpdateItem(item.id, { type: e.target.value as any })}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-fancy-blue font-bold text-xs"
                    >
                      <option value="page">Page</option>
                      <option value="category">Category</option>
                      <option value="product">Product</option>
                      <option value="product_collection">Collection</option>
                      <option value="vendor">Vendor</option>
                      <option value="external_url">External URL</option>
                      <option value="custom_link">Custom Link</option>
                    </select>
                  </div>

                  {/* Reorder and Delete */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleMove(idx, "up")}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMove(idx, "down")}
                      disabled={idx === currentMenu.items.length - 1}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Target URL & Badge Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      value={item.target}
                      onChange={(e) => handleUpdateItem(item.id, { target: e.target.value })}
                      placeholder="Destination URL (e.g. /category/sarees, /shop)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-300 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={item.badge || ""}
                      onChange={(e) => handleUpdateItem(item.id, { badge: e.target.value })}
                      placeholder="Badge (e.g. HOT, NEW, 50% OFF)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Item Trigger Buttons */}
          <div className="p-4 bg-slate-900 rounded-2xl border border-dashed border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">
              Add New Navigation Item
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { type: "category" as NavigationItemType, label: "+ Category" },
                { type: "page" as NavigationItemType, label: "+ Page" },
                { type: "product" as NavigationItemType, label: "+ Product" },
                { type: "product_collection" as NavigationItemType, label: "+ Collection" },
                { type: "vendor" as NavigationItemType, label: "+ Vendor" },
                { type: "custom_link" as NavigationItemType, label: "+ Custom Link" },
              ].map((btn) => (
                <button
                  key={btn.type}
                  onClick={() => handleAddItem(btn.type)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold transition"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Live Navigation Preview */}
        <div className="w-full lg:w-96 bg-slate-900/50 border-l border-slate-800 p-6 space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-300 uppercase tracking-wider">
              Live Header Render
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-800 px-2 py-0.5 rounded-full">
              LIVE PREVIEW
            </span>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-black text-fancy-blue">
              <span>Fancy</span>
              <span className="text-amber-500">Hub.in</span>
            </div>

            <div className="space-y-1.5 pt-2">
              {currentMenu.items.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                >
                  <span className="font-bold text-white">{it.label}</span>
                  <div className="flex items-center space-x-1.5">
                    {it.badge && (
                      <span className="text-[9px] bg-fancy-blue text-white px-1.5 py-0.5 rounded font-black">
                        {it.badge}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500 font-mono">{it.target}</span>
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
