"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Monitor,
  Tablet,
  Smartphone,
  Sparkles,
  Layers,
  Sliders,
  Check,
  X,
  GripVertical,
  Star,
  Heart,
  ShoppingCart,
  Zap,
  Truck,
  Filter,
  SlidersHorizontal,
  ChevronRight,
  Sparkle,
  Grid,
  FileText,
  Search,
  Tag,
  ArrowUpDown,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { DEFAULT_CATEGORY_PAGE_BLOCKS, CategoryPageBlock, CategorySectionType, CategoryLayoutZone } from "@/lib/category-page-layout";
import { PRODUCTS_DATA, CATEGORIES_DATA } from "@/data/mock-catalog";

export default function AdminCategoryPageBuilder() {
  const [blocks, setBlocks] = useState<CategoryPageBlock[]>(DEFAULT_CATEGORY_PAGE_BLOCKS);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>("blk_cat_banner");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchLayout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/category-layout");
      const data = await res.json();
      if (data.success && data.blocks) {
        setBlocks(data.blocks);
      }
    } catch (e) {
      console.error("Failed to load category layout", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLayout();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/category-layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocks }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("🚀 Category page layout saved successfully!");
      }
    } catch (e) {
      showToast("Error saving layout");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (!confirm("Reset all 13 category page sections to default order and settings?")) return;
    setBlocks(DEFAULT_CATEGORY_PAGE_BLOCKS);
    showToast("Reset to default category page layout");
  };

  const handleMoveBlock = (index: number, direction: "up" | "down", zone: CategoryLayoutZone) => {
    const zoneBlocks = blocks.filter((b) => b.zone === zone);
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= zoneBlocks.length) return;

    const sourceBlock = zoneBlocks[index];
    const targetBlock = zoneBlocks[targetIdx];

    const updatedBlocks = blocks.map((b) => {
      if (b.id === sourceBlock.id) return { ...b, sortOrder: targetBlock.sortOrder };
      if (b.id === targetBlock.id) return { ...b, sortOrder: sourceBlock.sortOrder };
      return b;
    });

    setBlocks(updatedBlocks);
  };

  const handleToggleActive = (id: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  };

  const handleZoneChange = (id: string, newZone: CategoryLayoutZone) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, zone: newZone } : b))
    );
  };

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  // Mock Category & Products
  const sampleCategory = CATEGORIES_DATA[0] || {
    name: "Handloom Sarees",
    slug: "sarees",
    description: "Explore authentic Banarasi, Kanjeevaram and Chanderi sarees woven with pure mulberry silk.",
  };

  const topBlocks = blocks.filter((b) => b.zone === "TOP_HEADER" && b.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const sidebarBlocks = blocks.filter((b) => b.zone === "SIDEBAR" && b.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const mainBlocks = blocks.filter((b) => b.zone === "MAIN_CONTENT" && b.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const bottomBlocks = blocks.filter((b) => b.zone === "BOTTOM_FOOTER" && b.isActive).sort((a, b) => a.sortOrder - b.sortOrder);

  // Renders individual modular block for live preview
  const renderPreviewBlock = (block: CategoryPageBlock) => {
    const isSelected = selectedBlockId === block.id;

    const wrapper = (content: React.ReactNode) => (
      <div
        key={block.id}
        onClick={() => setSelectedBlockId(block.id)}
        className={`cursor-pointer transition-all duration-200 relative group p-2 rounded-2xl ${
          isSelected
            ? "ring-2 ring-fancy-blue bg-fancy-blue/5 shadow-md"
            : "hover:bg-slate-100 dark:hover:bg-slate-800/40"
        }`}
      >
        {isSelected && (
          <span className="absolute -top-2.5 right-2 bg-fancy-blue text-white text-[9px] font-mono font-black px-2 py-0.5 rounded-full shadow z-20">
            {block.name}
          </span>
        )}
        {content}
      </div>
    );

    switch (block.type) {
      case "CATEGORY_BREADCRUMB":
        return wrapper(
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-semibold">
            <span className="hover:text-white">Home</span>
            <span>/</span>
            <span className="hover:text-white">Womenswear</span>
            <span>/</span>
            <span className="text-fancy-blue font-bold">{sampleCategory.name}</span>
          </div>
        );

      case "CATEGORY_BANNER":
        return wrapper(
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 p-6 text-white shadow-lg border border-slate-800">
            <div className="relative z-10 max-w-xl space-y-1.5">
              <span className="bg-fancy-orange text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                FESTIVE SALE 2026
              </span>
              <h2 className="text-xl md:text-2xl font-black">Varanasi & Surat Silk Masterpieces</h2>
              <p className="text-xs text-slate-300">Direct from heritage weaver clusters with certified Silk Mark tag.</p>
            </div>
          </div>
        );

      case "CATEGORY_TITLE":
        return wrapper(
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">{sampleCategory.name}</h1>
              <p className="text-xs text-slate-400 mt-0.5">Showing 24 handloom sarees direct from master artisans</p>
            </div>
            <span className="px-3 py-1 bg-fancy-blue/20 text-fancy-blue border border-fancy-blue/30 text-xs font-black rounded-xl">
              24 ITEMS
            </span>
          </div>
        );

      case "CATEGORY_DESCRIPTION":
        return wrapper(
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {sampleCategory.description}
          </div>
        );

      case "SUBCATEGORIES_LIST":
        return wrapper(
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subcategories:</span>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {["Banarasi Sarees", "Kanjeevaram Silk", "Chanderi Cotton", "Bandhani Weaves", "Tussar Silk"].map((sub) => (
                <button
                  key={sub}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:border-fancy-blue flex-shrink-0"
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        );

      case "SIDEBAR_LAYOUT":
        return wrapper(
          <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1 text-xs">
            <span className="font-black text-fancy-blue block uppercase text-[10px]">Sidebar Layout</span>
            <span className="text-slate-300">Position: Left • Sticky: Yes</span>
          </div>
        );

      case "FILTERS_SIDEBAR":
        return wrapper(
          <div className="p-4 bg-slate-50 dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
            <div className="flex items-center justify-between font-black text-slate-900 dark:text-white border-b border-slate-700 pb-2">
              <span className="flex items-center space-x-1.5">
                <Filter className="w-3.5 h-3.5 text-fancy-blue" />
                <span>Filters</span>
              </span>
              <button className="text-[10px] text-fancy-blue font-bold">Clear All</button>
            </div>

            {/* Price Filter */}
            <div className="space-y-1">
              <span className="font-bold text-slate-300 block text-[11px]">Price Range</span>
              <div className="flex items-center space-x-2">
                <input type="range" className="w-full accent-fancy-blue" />
              </div>
              <span className="text-[10px] text-slate-400 font-mono">₹499 - ₹12,999</span>
            </div>

            {/* Fabric Filter */}
            <div className="space-y-1">
              <span className="font-bold text-slate-300 block text-[11px]">Fabric</span>
              {["Mulberry Silk", "Organza", "Chanderi"].map((f) => (
                <label key={f} className="flex items-center space-x-2 text-slate-400">
                  <input type="checkbox" defaultChecked className="rounded accent-fancy-blue" />
                  <span>{f}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case "SORTING_BAR":
        return wrapper(
          <div className="flex items-center justify-between bg-white dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
            <span className="text-slate-400 font-medium">Showing 1-24 of 24 products</span>
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-slate-300">Sort:</span>
              <select className="bg-slate-900 border border-slate-700 text-fancy-blue font-bold rounded-lg px-2 py-1 outline-none">
                <option>Popularity</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Customer Rating</option>
                <option>Newest First</option>
              </select>
            </div>
          </div>
        );

      case "MOBILE_FILTER_DRAWER":
        return wrapper(
          <div className="p-3 bg-gradient-to-r from-fancy-blue to-indigo-600 text-white rounded-2xl shadow-lg flex items-center justify-between text-xs font-bold md:hidden">
            <span className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filters & Sorting</span>
            </span>
            <span className="bg-white text-slate-900 text-[10px] px-2 py-0.5 rounded-full font-black">2 Active</span>
          </div>
        );

      case "PRODUCT_GRID":
        return wrapper(
          <div className="space-y-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PRODUCTS_DATA.slice(0, 4).map((p) => (
                <div key={p.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden p-2 space-y-1.5">
                  <div className="aspect-[3/4] bg-slate-900 rounded-xl overflow-hidden">
                    <img src={p.images[0]?.url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-bold text-fancy-blue block">{p.brandName}</span>
                  <h4 className="font-bold text-xs text-white truncate">{p.title}</h4>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="font-black text-xs text-white">₹{p.price.toLocaleString("en-IN")}</span>
                    <span className="text-[10px] text-slate-400 line-through">₹{p.mrp.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "PAGINATION_CONTROLS":
        return wrapper(
          <div className="flex items-center justify-center space-x-2 py-2">
            <button className="px-3 py-1.5 bg-slate-800 rounded-xl text-xs font-bold text-slate-400">Prev</button>
            <button className="px-3 py-1.5 bg-fancy-blue text-white rounded-xl text-xs font-bold">1</button>
            <button className="px-3 py-1.5 bg-slate-800 rounded-xl text-xs font-bold text-slate-400">2</button>
            <button className="px-3 py-1.5 bg-slate-800 rounded-xl text-xs font-bold text-slate-400">Next</button>
          </div>
        );

      case "RECOMMENDED_PRODUCTS":
        return wrapper(
          <div className="p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h3 className="font-black text-sm text-slate-900 dark:text-white">Recommended for You</h3>
            <p className="text-xs text-slate-400">Handpicked based on your recent searches</p>
          </div>
        );

      case "SEO_CONTENT":
        return wrapper(
          <div className="p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h3 className="font-black text-sm text-slate-900 dark:text-white">Handloom Sarees Buying Guide & SEO FAQs</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              FancyHub.in offers India's most authentic handloom collection direct from weavers in Varanasi, Surat, and Kanchipuram with zero middleman markup.
            </p>
          </div>
        );

      default:
        return wrapper(
          <div className="p-3 bg-slate-800 rounded-2xl text-xs font-bold text-slate-300">
            {block.name}
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* 1. TOP BAR */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-40 flex-shrink-0 shadow-lg">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/pages"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
            title="Back to Pages Directory"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-slate-500">Website</span>
              <span className="text-[11px] text-slate-600">→</span>
              <span className="text-base font-black text-white">Category Page Builder</span>
              <span className="text-[10px] bg-fancy-blue/20 text-fancy-blue font-bold px-2 py-0.5 rounded-full border border-fancy-blue/30">
                13 Modular Blocks
              </span>
            </div>
          </div>
        </div>

        {/* Viewports */}
        <div className="flex items-center bg-slate-800/90 p-1 rounded-2xl border border-slate-700 space-x-1 text-xs">
          <button
            onClick={() => setViewport("desktop")}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition ${
              viewport === "desktop" ? "bg-fancy-blue text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>
          <button
            onClick={() => setViewport("tablet")}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition ${
              viewport === "tablet" ? "bg-fancy-blue text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tablet</span>
          </button>
          <button
            onClick={() => setViewport("mobile")}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition ${
              viewport === "mobile" ? "bg-fancy-blue text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold flex items-center space-x-1 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-fancy-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black flex items-center space-x-1.5 shadow-lg active:scale-95 transition disabled:opacity-40"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? "Saving..." : "Save Category Layout"}</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN 3-COLUMN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: 13 REORDERABLE BLOCKS */}
        <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full flex-shrink-0 z-20">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-black text-white flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-fancy-blue" />
              <span>Category Blocks ({blocks.length})</span>
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {(["TOP_HEADER", "SIDEBAR", "MAIN_CONTENT", "BOTTOM_FOOTER"] as CategoryLayoutZone[]).map((zone) => {
              const zoneBlocks = blocks.filter((b) => b.zone === zone).sort((a, b) => a.sortOrder - b.sortOrder);
              return (
                <div key={zone} className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {zone === "TOP_HEADER" ? "Top Header Area" : zone === "SIDEBAR" ? "Sidebar Filter Zone" : zone === "MAIN_CONTENT" ? "Main Catalog Grid" : "Bottom Footer Zone"} ({zoneBlocks.length})
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {zoneBlocks.map((blk, idx) => (
                      <div
                        key={blk.id}
                        onClick={() => setSelectedBlockId(blk.id)}
                        className={`p-2.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                          selectedBlockId === blk.id
                            ? "bg-slate-800 border-fancy-blue ring-1 ring-fancy-blue shadow"
                            : "bg-slate-950 border-slate-800/80 hover:border-slate-700"
                        } ${!blk.isActive ? "opacity-50" : ""}`}
                      >
                        <div className="flex items-center space-x-2 min-w-0">
                          <GripVertical className="w-3.5 h-3.5 text-slate-500 cursor-grab" />
                          <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div className="truncate">
                            <span className="font-bold text-white text-xs block truncate">{blk.name}</span>
                            <span className="text-[9px] text-fancy-blue font-mono">{blk.type}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleMoveBlock(idx, "up", zone)}
                            disabled={idx === 0}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-20"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleMoveBlock(idx, "down", zone)}
                            disabled={idx === zoneBlocks.length - 1}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-20"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(blk.id)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                          >
                            {blk.isActive ? <Eye className="w-3.5 h-3.5 text-green-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* CENTER COLUMN: LIVE CATEGORY MOCKUP */}
        <main className="flex-1 bg-slate-950/60 p-4 md:p-6 flex flex-col items-center justify-start overflow-y-auto">
          <div
            className={`transition-all duration-300 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 p-4 md:p-6 flex flex-col space-y-6 ${
              viewport === "mobile"
                ? "w-[375px] max-w-[375px]"
                : viewport === "tablet"
                ? "w-[768px] max-w-[768px]"
                : "w-full max-w-5xl"
            }`}
          >
            {/* Top Header Zone */}
            <div className="space-y-4">
              {topBlocks.map((blk) => renderPreviewBlock(blk))}
            </div>

            {/* Split: Sidebar & Main Content */}
            <div className={`grid gap-6 ${viewport === "mobile" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-4"}`}>
              {/* Sidebar (1 col) */}
              {sidebarBlocks.length > 0 && viewport !== "mobile" && (
                <div className="md:col-span-1 space-y-3">
                  {sidebarBlocks.map((blk) => renderPreviewBlock(blk))}
                </div>
              )}

              {/* Main Content (3 cols) */}
              <div className={`space-y-4 ${sidebarBlocks.length > 0 && viewport !== "mobile" ? "md:col-span-3" : "md:col-span-4"}`}>
                {mainBlocks.map((blk) => renderPreviewBlock(blk))}
              </div>
            </div>

            {/* Bottom Footer Zone */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              {bottomBlocks.map((blk) => renderPreviewBlock(blk))}
            </div>
          </div>
        </main>

        {/* RIGHT COLUMN: INSPECTOR */}
        <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full flex-shrink-0 z-20 overflow-y-auto p-4 space-y-4 text-xs">
          {selectedBlock ? (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] text-fancy-blue font-mono font-bold uppercase tracking-wider block">
                  {selectedBlock.type}
                </span>
                <h3 className="font-black text-white text-sm">{selectedBlock.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedBlock.description}</p>
              </div>

              {/* Block Zone Selector */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">Layout Zone</label>
                <div className="grid grid-cols-2 gap-1.5 text-center font-bold text-[11px]">
                  {(["TOP_HEADER", "SIDEBAR", "MAIN_CONTENT", "BOTTOM_FOOTER"] as CategoryLayoutZone[]).map((z) => (
                    <button
                      key={z}
                      onClick={() => handleZoneChange(selectedBlock.id, z)}
                      className={`py-1.5 rounded-xl border transition ${
                        selectedBlock.zone === z
                          ? "bg-fancy-blue text-white border-fancy-blue shadow"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {z === "TOP_HEADER" ? "Header" : z === "SIDEBAR" ? "Sidebar" : z === "MAIN_CONTENT" ? "Main Grid" : "Footer"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Switch */}
              <label className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800 cursor-pointer">
                <span className="font-bold text-white">Active on Storefront</span>
                <input
                  type="checkbox"
                  checked={selectedBlock.isActive}
                  onChange={() => handleToggleActive(selectedBlock.id)}
                  className="w-4 h-4 accent-fancy-blue"
                />
              </label>

              {/* Block Specific Settings */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Block Parameters
                </span>

                <div>
                  <label className="block font-bold text-slate-300 mb-1 text-[11px]">Display Label</label>
                  <input
                    type="text"
                    value={selectedBlock.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setBlocks((prev) =>
                        prev.map((b) => (b.id === selectedBlock.id ? { ...b, name: val } : b))
                      );
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold text-xs"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">Select any category block to customize</div>
          )}
        </aside>
      </div>

      {/* TOAST ALERT */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-slide-up">
          <Sparkles className="w-4 h-4 text-fancy-blue" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
