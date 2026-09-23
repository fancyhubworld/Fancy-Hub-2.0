"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Upload,
  Type,
  Palette,
  Layers,
  RotateCcw,
  Check,
  ShoppingCart,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { CUSTOM_PRINT_TEMPLATES } from "@/data/mock-catalog";
import { formatINR } from "@/lib/design-tokens";
import { useMarketplace } from "@/lib/context";

export default function CustomPrintStudioPage() {
  const router = useRouter();
  const { addToCart } = useMarketplace();

  const [selectedTemplate, setSelectedTemplate] = useState(CUSTOM_PRINT_TEMPLATES[0]);
  const [selectedColor, setSelectedColor] = useState(selectedTemplate.availableColors[0]);
  const [selectedSize, setSelectedSize] = useState(selectedTemplate.availableSizes[1] || "M");
  const [customText, setCustomText] = useState("Fancy Vibe 2026");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [fontSize, setFontSize] = useState(24);
  const [activeSide, setActiveSide] = useState<"front" | "back">("front");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
    }
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart({
      productId: `cp-custom-${Date.now()}`,
      variantId: `cp-var-${selectedColor.name}-${selectedSize}`,
      title: `Custom Printed ${selectedTemplate.name} (${selectedColor.name}, ${selectedSize})`,
      slug: selectedTemplate.slug,
      sku: `CP-${selectedTemplate.category.toUpperCase()}-${Date.now().toString().slice(-4)}`,
      image: selectedTemplate.mockupFrontUrl,
      price: selectedTemplate.basePrice,
      mrp: selectedTemplate.mrp,
      quantity: 1,
      selectedColor: selectedColor.name,
      selectedSize: selectedSize,
      vendorId: "v-4",
      vendorName: "Bengaluru Print Works",
      vendorSlug: "bengaluru-print-works",
      maxStock: 500,
    });

    setTimeout(() => {
      setIsAdding(false);
      router.push("/cart");
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Studio Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-[#0B2A63] text-white rounded-3xl p-6 md:p-8 shadow-elevated flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-fancy-orange text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive 3D Print Studio</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black">Personalized Custom Merchandise Studio</h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Design your apparel or gift with real-time text, color swatches & HD photographic artwork
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
          <Truck className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-bold text-slate-100">Dispatched from Bengaluru Lab in 24 Hours</span>
        </div>
      </div>

      {/* Main Studio Canvas & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Live Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-subtle flex flex-col items-center justify-center relative min-h-[440px] overflow-hidden">
          {/* Side Switcher */}
          <div className="absolute top-4 left-4 z-20 flex space-x-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveSide("front")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                activeSide === "front" ? "bg-white text-fancy-blue shadow-sm" : "text-slate-600"
              }`}
            >
              Front View
            </button>
            <button
              onClick={() => setActiveSide("back")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                activeSide === "back" ? "bg-white text-fancy-blue shadow-sm" : "text-slate-600"
              }`}
            >
              Back View
            </button>
          </div>

          {/* Product Base Mockup Image with Color Filter */}
          <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
            <img
              src={activeSide === "front" ? selectedTemplate.mockupFrontUrl : (selectedTemplate.mockupBackUrl || selectedTemplate.mockupFrontUrl)}
              alt="Custom Print Mockup"
              className="w-full h-full object-contain filter drop-shadow-md"
              style={{
                filter: selectedColor.hex !== "#FFFFFF" ? `hue-rotate(180deg) brightness(0.8)` : "none",
              }}
            />

            {/* Live Custom Overlay Print Area */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 pointer-events-none">
              {uploadedImage && (
                <img
                  src={uploadedImage}
                  alt="Uploaded Artwork"
                  className="w-24 h-24 object-contain rounded-lg shadow-sm mb-2"
                />
              )}

              {customText && (
                <div
                  className="font-black text-center uppercase tracking-wider drop-shadow"
                  style={{
                    color: textColor,
                    fontSize: `${fontSize}px`,
                    textShadow: "0 2px 4px rgba(0,0,0,0.4)",
                  }}
                >
                  {customText}
                </div>
              )}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-2">
            300 DPI Sublimation / Direct-to-Garment (DTG) Print Boundary Simulated
          </p>
        </div>

        {/* Right Column: Customization Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-subtle space-y-6">
          {/* 1. Select Template Item */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              1. Choose Product Model
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CUSTOM_PRINT_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    setSelectedTemplate(tmpl);
                    setSelectedColor(tmpl.availableColors[0]);
                  }}
                  className={`p-2.5 rounded-2xl border text-left transition ${
                    selectedTemplate.id === tmpl.id
                      ? "border-fancy-blue bg-blue-50/70 shadow-sm"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="text-xs font-bold text-slate-800 truncate">{tmpl.name}</div>
                  <div className="text-[11px] font-black text-fancy-blue">{formatINR(tmpl.basePrice)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Choose Color */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              2. Base Fabric Color ({selectedColor.name})
            </label>
            <div className="flex items-center space-x-2">
              {selectedTemplate.availableColors.map((col) => (
                <button
                  key={col.name}
                  onClick={() => setSelectedColor(col)}
                  title={col.name}
                  className={`w-8 h-8 rounded-full border-2 transition ${
                    selectedColor.name === col.name ? "ring-2 ring-fancy-blue ring-offset-2 scale-110" : "border-slate-300"
                  }`}
                  style={{ backgroundColor: col.hex }}
                />
              ))}
            </div>
          </div>

          {/* 3. Choose Size */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              3. Size Selection
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedTemplate.availableSizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                    selectedSize === sz
                      ? "border-fancy-blue bg-fancy-blue text-white shadow-sm"
                      : "border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Text Customizer */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              4. Custom Text & Typography
            </label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="e.g. Your Name, Team, or Quote"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-fancy-blue"
            />

            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-slate-600 font-medium">Text Color:</span>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-7 h-7 rounded border-0 cursor-pointer"
                />
              </div>

              <div className="flex items-center space-x-2 flex-1">
                <span className="text-slate-600 font-medium">Size:</span>
                <input
                  type="range"
                  min="14"
                  max="40"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="accent-fancy-blue flex-1 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 5. Image/Artwork Upload */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              5. Upload Custom Logo / Photo
            </label>
            <label className="border-2 border-dashed border-slate-300 hover:border-fancy-blue rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition bg-slate-50 text-center">
              <Upload className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-xs font-bold text-slate-700">Click to Upload PNG / JPG (Max 15MB)</span>
              <span className="text-[10px] text-slate-400">High resolution recommended for crisp printing</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          {/* Price & Checkout CTA */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black text-slate-900">
                  {formatINR(selectedTemplate.basePrice)}
                </span>
                <span className="text-xs text-slate-400 line-through ml-2">
                  {formatINR(selectedTemplate.mrp)}
                </span>
              </div>
              <span className="text-xs font-black text-green-700 bg-green-50 px-2 py-1 rounded-lg">
                Zero Setup Fee
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-3.5 rounded-2xl font-black text-xs md:text-sm transition flex items-center justify-center space-x-2 ${
                isAdding ? "bg-green-600 text-white" : "bg-fancy-blue hover:bg-blue-700 text-white shadow-elevated"
              }`}
            >
              {isAdding ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add Customized Print to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
