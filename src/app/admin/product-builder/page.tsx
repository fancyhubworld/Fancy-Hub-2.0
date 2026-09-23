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
  ShieldCheck,
  Store,
  Share2,
  Tag,
  Gift,
  HelpCircle,
  Clock,
  LayoutGrid,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { DEFAULT_PRODUCT_PAGE_BLOCKS, ProductPageBlock, ProductSectionType, ProductLayoutZone } from "@/lib/product-page-layout";
import { PRODUCTS_DATA, VENDORS_DATA } from "@/data/mock-catalog";

export default function AdminProductPageBuilder() {
  const [blocks, setBlocks] = useState<ProductPageBlock[]>(DEFAULT_PRODUCT_PAGE_BLOCKS);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>("blk_gallery");
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
      const res = await fetch("/api/admin/product-layout");
      const data = await res.json();
      if (data.success && data.blocks) {
        setBlocks(data.blocks);
      }
    } catch (e) {
      console.error("Failed to load product layout", e);
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
      const res = await fetch("/api/admin/product-layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocks }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("🚀 Product page layout saved successfully!");
      }
    } catch (e) {
      showToast("Error saving layout");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (!confirm("Reset all 21 product page sections to default order and settings?")) return;
    setBlocks(DEFAULT_PRODUCT_PAGE_BLOCKS);
    showToast("Reset to default product page layout");
  };

  const handleMoveBlock = (index: number, direction: "up" | "down", zone: ProductLayoutZone) => {
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

  const handleZoneChange = (id: string, newZone: ProductLayoutZone) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, zone: newZone } : b))
    );
  };

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  // Mock product for live preview
  const sampleProduct = PRODUCTS_DATA[0];
  const sampleVendor = VENDORS_DATA[0];

  const leftBlocks = blocks.filter((b) => b.zone === "LEFT" && b.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const rightBlocks = blocks.filter((b) => b.zone === "RIGHT" && b.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const bottomBlocks = blocks.filter((b) => b.zone === "BOTTOM" && b.isActive).sort((a, b) => a.sortOrder - b.sortOrder);

  // Renders individual modular block for live preview
  const renderPreviewBlock = (block: ProductPageBlock) => {
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
      case "PRODUCT_GALLERY":
        return wrapper(
          <div className="space-y-3">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
              <img
                src={sampleProduct.images[0]?.url}
                alt={sampleProduct.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-slate-950 text-xs font-black uppercase rounded-lg shadow">
                AUTHENTIC SILK
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {sampleProduct.images.slice(0, 4).map((img, i) => (
                <div key={i} className="w-16 h-16 rounded-xl overflow-hidden border-2 border-fancy-blue/60">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        );

      case "PRODUCT_TITLE":
        return wrapper(
          <div>
            <span className="text-[10px] font-bold text-fancy-blue uppercase tracking-wider block">
              {sampleProduct.categoryName} • Handloom
            </span>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {sampleProduct.title}
            </h1>
            <span className="text-[10px] text-slate-400 font-mono">SKU: {sampleProduct.sku}</span>
          </div>
        );

      case "PRODUCT_RATING":
        return wrapper(
          <div className="flex items-center space-x-2 text-xs">
            <div className="flex items-center space-x-1 text-amber-500 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>4.9</span>
            </div>
            <span className="text-slate-400 font-medium">({sampleProduct.reviewCount || 128} verified reviews)</span>
            <span className="text-emerald-500 font-bold flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Silk Mark Verified</span>
            </span>
          </div>
        );

      case "PRODUCT_PRICE":
        return wrapper(
          <div className="flex items-baseline space-x-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{sampleProduct.price.toLocaleString("en-IN")}
            </span>
            <span className="text-sm text-slate-400 line-through">
              ₹{sampleProduct.mrp.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-slate-500 font-bold">(Inclusive of all GST)</span>
          </div>
        );

      case "PRODUCT_DISCOUNT":
        return wrapper(
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-lg bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30">
              50% OFF
            </span>
            <span className="text-xs text-slate-500 font-medium">
              You save ₹{(sampleProduct.mrp - sampleProduct.price).toLocaleString("en-IN")}
            </span>
          </div>
        );

      case "VARIANT_SELECTOR":
        return wrapper(
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Choose Weave Style</label>
            <div className="flex gap-2">
              {["Traditional Zari", "Modern Floral", "Temple Border"].map((v, i) => (
                <button
                  key={v}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                    i === 0
                      ? "bg-fancy-blue text-white border-fancy-blue shadow"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-300 border-slate-700"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        );

      case "SIZE_SELECTOR":
        return wrapper(
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300">Select Size</label>
              <button className="text-fancy-blue font-bold hover:underline text-[11px]">Size Guide</button>
            </div>
            <div className="flex gap-2">
              {["Free Size", "5.5M + Blouse", "6.3M Grand"].map((s, i) => (
                <button
                  key={s}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                    i === 0
                      ? "bg-fancy-blue text-white border-fancy-blue shadow"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-300 border-slate-700"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        );

      case "COLOR_SELECTOR":
        return wrapper(
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Color: Royal Crimson Red</label>
            <div className="flex gap-2">
              {["#DC2626", "#7C3AED", "#059669", "#D97706"].map((hex, i) => (
                <div
                  key={hex}
                  className={`w-7 h-7 rounded-full border-2 cursor-pointer shadow ${
                    i === 0 ? "border-fancy-blue ring-2 ring-fancy-blue/40" : "border-slate-600"
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>
        );

      case "QUANTITY_SELECTOR":
        return wrapper(
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Quantity</span>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-700 rounded-xl p-1 text-xs font-bold">
              <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white">-</button>
              <span className="px-3">1</span>
              <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white">+</button>
            </div>
          </div>
        );

      case "ADD_TO_CART":
        return wrapper(
          <button className="w-full py-3 bg-fancy-blue text-white rounded-2xl font-black text-xs shadow-lg flex items-center justify-center space-x-2">
            <ShoppingCart className="w-4 h-4" />
            <span>ADD TO SHOPPING CART</span>
          </button>
        );

      case "BUY_NOW":
        return wrapper(
          <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl font-black text-xs shadow-lg flex items-center justify-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>BUY NOW (1-CLICK EXPRESS)</span>
          </button>
        );

      case "WISHLIST_BUTTON":
        return wrapper(
          <div className="flex items-center justify-between text-xs pt-1">
            <button className="flex items-center space-x-1.5 text-slate-400 hover:text-red-500 font-bold">
              <Heart className="w-4 h-4" />
              <span>Add to Wishlist</span>
            </button>
            <button className="flex items-center space-x-1.5 text-slate-400 hover:text-fancy-blue font-bold">
              <Share2 className="w-4 h-4" />
              <span>Share Product</span>
            </button>
          </div>
        );

      case "DELIVERY_CHECKER":
        return wrapper(
          <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white">
              <Truck className="w-4 h-4 text-emerald-500" />
              <span>Check Delivery Pincode</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Pincode (e.g. 395003)"
                defaultValue="395003"
                className="flex-1 bg-white dark:bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
              />
              <button className="px-3 py-1.5 bg-fancy-blue text-white rounded-xl font-bold text-xs">Check</button>
            </div>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              ⚡ Express Delivery by Tomorrow • Cash on Delivery Available
            </p>
          </div>
        );

      case "SELLER_INFO":
        return wrapper(
          <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-fancy-blue/20 text-fancy-blue flex items-center justify-center font-black">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">{sampleVendor.storeName}</span>
                <span className="text-[10px] text-slate-400 block">{sampleVendor.city} • 4th Gen Weaver Studio</span>
              </div>
            </div>
            <button className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-bold text-[11px]">
              Visit Store
            </button>
          </div>
        );

      case "OFFERS_LIST":
        return wrapper(
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-1.5 text-xs">
            <div className="flex items-center space-x-1.5 font-bold text-amber-500">
              <Tag className="w-3.5 h-3.5" />
              <span>Available Offers & Coupons</span>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300">
              🏷️ <strong>FANCYFIRST</strong>: FLAT ₹500 OFF on your first purchase
            </p>
            <p className="text-[11px] text-slate-700 dark:text-slate-300">
              💳 Extra 10% instant discount on HDFC / ICICI UPI orders
            </p>
          </div>
        );

      case "DESCRIPTION":
        return wrapper(
          <div className="p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h3 className="font-black text-sm text-slate-900 dark:text-white">Product Description & Artisan Story</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {sampleProduct.description || "Handwoven with pure mulberry silk yarns by 4th-generation master weavers in Varanasi. Every saree features traditional zari motifs certified under the Silk Mark scheme."}
            </p>
          </div>
        );

      case "SPECIFICATIONS":
        return wrapper(
          <div className="p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h3 className="font-black text-sm text-slate-900 dark:text-white">Product Specifications</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Fabric</span>
                <span className="font-bold text-white">Pure Mulberry Silk</span>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Origin</span>
                <span className="font-bold text-white">Varanasi, Uttar Pradesh</span>
              </div>
            </div>
          </div>
        );

      case "REVIEWS_SECTION":
        return wrapper(
          <div className="p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-sm text-slate-900 dark:text-white">Verified Customer Reviews (128)</h3>
              <button className="text-xs bg-fancy-blue text-white px-3 py-1 rounded-xl font-bold">Write Review</button>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs space-y-1">
              <div className="flex items-center space-x-1 text-amber-500">
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
              </div>
              <p className="text-slate-300">“The silk quality is unbelievable for this price! Shipped in 2 days.” — Ananya S.</p>
            </div>
          </div>
        );

      case "FREQUENTLY_BOUGHT_TOGETHER":
        return wrapper(
          <div className="p-4 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-3xl border border-indigo-500/30 space-y-2">
            <h3 className="font-black text-sm text-indigo-300">Frequently Bought Together (Save 10%)</h3>
            <p className="text-xs text-slate-400">Bundle with Silk Petticoat & Designer Blouse Piece</p>
          </div>
        );

      case "RELATED_PRODUCTS":
        return wrapper(
          <div className="p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h3 className="font-black text-sm text-slate-900 dark:text-white">Related Handloom Styles</h3>
            <p className="text-xs text-slate-400">Customers who viewed this item also loved</p>
          </div>
        );

      case "RECENTLY_VIEWED":
        return wrapper(
          <div className="p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h3 className="font-black text-sm text-slate-900 dark:text-white">Recently Viewed by You</h3>
            <p className="text-xs text-slate-400">Products from your browsing history</p>
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
              <span className="text-base font-black text-white">Product Page Builder</span>
              <span className="text-[10px] bg-fancy-blue/20 text-fancy-blue font-bold px-2 py-0.5 rounded-full border border-fancy-blue/30">
                21 Modular Blocks
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
            <span>{isSaving ? "Saving..." : "Save Product Layout"}</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN 3-COLUMN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: 21 REORDERABLE BLOCKS */}
        <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full flex-shrink-0 z-20">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-black text-white flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-fancy-blue" />
              <span>Product Page Blocks ({blocks.length})</span>
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {(["LEFT", "RIGHT", "BOTTOM"] as ProductLayoutZone[]).map((zone) => {
              const zoneBlocks = blocks.filter((b) => b.zone === zone).sort((a, b) => a.sortOrder - b.sortOrder);
              return (
                <div key={zone} className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {zone === "LEFT" ? "Left Media Column" : zone === "RIGHT" ? "Right Details Column" : "Bottom Full-Width"} ({zoneBlocks.length})
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

        {/* CENTER COLUMN: LIVE PRODUCT MOCKUP */}
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
            {/* Top 2-Column Split: Left Media & Right Details */}
            <div className={`grid gap-6 ${viewport === "mobile" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
              {/* Left Column Blocks */}
              <div className="space-y-3">
                {leftBlocks.map((blk) => renderPreviewBlock(blk))}
              </div>

              {/* Right Column Blocks */}
              <div className="space-y-3">
                {rightBlocks.map((blk) => renderPreviewBlock(blk))}
              </div>
            </div>

            {/* Bottom Full-Width Region */}
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
                <div className="grid grid-cols-3 gap-1.5 text-center font-bold text-[11px]">
                  {(["LEFT", "RIGHT", "BOTTOM"] as ProductLayoutZone[]).map((z) => (
                    <button
                      key={z}
                      onClick={() => handleZoneChange(selectedBlock.id, z)}
                      className={`py-1.5 rounded-xl border transition ${
                        selectedBlock.zone === z
                          ? "bg-fancy-blue text-white border-fancy-blue shadow"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {z}
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
            <div className="p-8 text-center text-slate-500">Select any product block to customize</div>
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
