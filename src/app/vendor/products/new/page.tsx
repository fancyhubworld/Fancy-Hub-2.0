"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Layers,
  Sparkles,
  CheckCircle2,
  Tag,
  ShieldCheck,
} from "lucide-react";
import { useCategories } from "@/lib/use-categories";
import { TAGS_DATA, BRANDS_DATA } from "@/data/mock-catalog";
import { ROUTES } from "@/lib/routes";
import { VendorShell } from "@/components/vendor/VendorShell";

interface VariantItem {
  id: string;
  name: string;
  sku: string;
  price: string;
  stock: string;
}

export default function VendorNewProductPage() {
  const router = useRouter();
  const { categoryTree } = useCategories();

  // Basic Info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState(`SKU-${Date.now().toString().slice(-6)}`);
  const [brand, setBrand] = useState("FancyHub Direct");
  const [collection, setCollection] = useState("Festive Collection 2026");

  // Pricing & Taxes
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [taxRate, setTaxRate] = useState("18"); // 5%, 12%, 18%, 28% GST

  // Inventory & Stock
  const [stock, setStock] = useState("50");
  const [lowStockThreshold, setLowStockThreshold] = useState("5");

  // Category Cascading
  const [selectedRootId, setSelectedRootId] = useState<string>("");
  const [selectedSubId, setSelectedSubId] = useState<string>("");
  const [selectedChildId, setSelectedChildId] = useState<string>("");

  // Tags
  const [selectedTags, setSelectedTags] = useState<string[]>(["New Arrival", "Made in India"]);

  // Images
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800",
  ]);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Variants
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState<VariantItem[]>([
    { id: "v-1", name: "Red / Free Size", sku: "SKU-RED-FS", price: "1499", stock: "25" },
    { id: "v-2", name: "Blue / Free Size", sku: "SKU-BLU-FS", price: "1499", stock: "25" },
  ]);

  const rootCategory = categoryTree.find((c) => c.id === selectedRootId);
  const subCategories = rootCategory?.children || [];
  const subCategory = subCategories.find((s) => s.id === selectedSubId);
  const childCategories = subCategory?.children || [];

  const handleAddImage = () => {
    if (!newImageUrl) return;
    setImages([...images, newImageUrl]);
    setNewImageUrl("");
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        id: `v-${Date.now()}`,
        name: "Standard Variant",
        sku: `SKU-${Date.now().toString().slice(-4)}`,
        price: price || "999",
        stock: "20",
      },
    ]);
  };

  const handleRemoveVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const toggleTag = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]
    );
  };

  const calculateDiscount = () => {
    const p = Number(price);
    const m = Number(mrp);
    if (!p || !m || m <= p) return 0;
    return Math.round(((m - p) / m) * 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(ROUTES.vendorPortal.products);
  };

  return (
    <VendorShell>
      <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href={ROUTES.vendorPortal.products}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white">Create New Product Listing</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Setup variants, GSTIN compliance, multiple images, and submit for admin catalog approval.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs font-sans">
          {/* Section 1: Basic Information */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-card space-y-4">
            <h3 className="font-black text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-700 pb-2">
              1. General Product Details
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Pure Banarasi Katan Silk Embroidered Festive Saree"
                  className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs font-bold dark:text-white outline-none focus:border-fancy-blue"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe material, weave, craftsmanship, dimensions, care instructions..."
                  className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs font-semibold dark:text-white outline-none focus:border-fancy-blue"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Base SKU *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 font-mono font-bold dark:text-white outline-none focus:border-fancy-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 font-bold dark:text-white outline-none focus:border-fancy-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Store Collection</label>
                  <input
                    type="text"
                    value={collection}
                    onChange={(e) => setCollection(e.target.value)}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 font-bold dark:text-white outline-none focus:border-fancy-blue"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing, MRP, GST Tax Rate */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-card space-y-4">
            <h3 className="font-black text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-700 pb-2">
              2. Pricing, Discounts & GST Compliance
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Selling Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1499"
                  className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 font-black text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Maximum Retail Price MRP (₹)</label>
                <input
                  type="number"
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
                  placeholder="2999"
                  className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Discount %</label>
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-black text-sm">
                  {calculateDiscount()}% OFF
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">GST Tax Rate</label>
                <select
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 font-bold dark:text-white outline-none focus:border-fancy-blue"
                >
                  <option value="5" className="dark:bg-slate-800">5% GST (Apparel &lt; ₹1000)</option>
                  <option value="12" className="dark:bg-slate-800">12% GST (Apparel &gt; ₹1000)</option>
                  <option value="18" className="dark:bg-slate-800">18% GST (Standard)</option>
                  <option value="28" className="dark:bg-slate-800">28% GST (Luxury)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Categories & Product Tags */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-card space-y-4">
            <h3 className="font-black text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-700 pb-2">
              3. Category Mapping & Search Tags
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Department *</label>
                <select
                  value={selectedRootId}
                  onChange={(e) => {
                    setSelectedRootId(e.target.value);
                    setSelectedSubId("");
                    setSelectedChildId("");
                  }}
                  className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 font-bold dark:text-white outline-none focus:border-fancy-blue"
                >
                  <option value="" className="dark:bg-slate-800">-- Select Department --</option>
                  {categoryTree.map((cat) => (
                    <option key={cat.id} value={cat.id} className="dark:bg-slate-800">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Subcategory</label>
                <select
                  value={selectedSubId}
                  onChange={(e) => {
                    setSelectedSubId(e.target.value);
                    setSelectedChildId("");
                  }}
                  className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 font-bold dark:text-white outline-none focus:border-fancy-blue"
                >
                  <option value="" className="dark:bg-slate-800">-- Select Subcategory --</option>
                  {subCategories.map((sub) => (
                    <option key={sub.id} value={sub.id} className="dark:bg-slate-800">
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Child Category</label>
                <select
                  value={selectedChildId}
                  onChange={(e) => setSelectedChildId(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 font-bold dark:text-white outline-none focus:border-fancy-blue"
                >
                  <option value="" className="dark:bg-slate-800">-- Select Specific Category --</option>
                  {childCategories.map((child) => (
                    <option key={child.id} value={child.id} className="dark:bg-slate-800">
                      {child.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tag Selection Chips */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">Search Tags (Boosts Discovery)</label>
              <div className="flex flex-wrap gap-2">
                {TAGS_DATA.map((tag) => {
                  const active = selectedTags.includes(tag.name);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.name)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1 ${
                        active
                          ? "bg-fancy-blue text-white shadow-sm"
                          : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      <span>{tag.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 4: Image Gallery */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-card space-y-4">
            <h3 className="font-black text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-700 pb-2">
              4. Product Images Gallery
            </h3>

            <div className="flex items-center space-x-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste public image URL (https://...)"
                className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs font-semibold dark:text-white outline-none focus:border-fancy-blue"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-xl whitespace-nowrap hover:bg-slate-200"
              >
                Add Image
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 group h-32">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute top-2 left-2 bg-fancy-blue text-white text-[9px] font-black px-1.5 py-0.2 rounded">
                      PRIMARY
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 p-1 rounded-lg bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Variants & Multi-SKU Options */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  5. Product Variants & Inventory Stock
                </h3>
                <p className="text-[11px] text-slate-400">Configure Color, Size, and per-variant SKU stock</p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasVariantsToggle"
                  checked={hasVariants}
                  onChange={(e) => setHasVariants(e.target.checked)}
                  className="rounded text-fancy-blue"
                />
                <label htmlFor="hasVariantsToggle" className="font-bold text-slate-700 dark:text-slate-300">
                  Enable Multiple Variants
                </label>
              </div>
            </div>

            {hasVariants ? (
              <div className="space-y-3">
                {variants.map((v, i) => (
                  <div key={v.id} className="grid grid-cols-1 sm:grid-cols-4 gap-2 p-3 bg-slate-50 dark:bg-slate-750 rounded-2xl items-center">
                    <input
                      type="text"
                      value={v.name}
                      onChange={(e) => {
                        const next = [...variants];
                        next[i].name = e.target.value;
                        setVariants(next);
                      }}
                      placeholder="Variant Name"
                      className="border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-2.5 py-1.5 font-bold dark:text-white"
                    />
                    <input
                      type="text"
                      value={v.sku}
                      onChange={(e) => {
                        const next = [...variants];
                        next[i].sku = e.target.value;
                        setVariants(next);
                      }}
                      placeholder="SKU"
                      className="border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-2.5 py-1.5 font-mono font-bold dark:text-white"
                    />
                    <input
                      type="number"
                      value={v.price}
                      onChange={(e) => {
                        const next = [...variants];
                        next[i].price = e.target.value;
                        setVariants(next);
                      }}
                      placeholder="Price"
                      className="border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-2.5 py-1.5 font-bold dark:text-white"
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={v.stock}
                        onChange={(e) => {
                          const next = [...variants];
                          next[i].stock = e.target.value;
                          setVariants(next);
                        }}
                        placeholder="Stock"
                        className="border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-2.5 py-1.5 font-bold dark:text-white w-full"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(v.id)}
                        className="p-1.5 rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-fancy-blue font-bold rounded-xl flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Another Variant</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Single Unit Stock *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 font-bold dark:text-white outline-none focus:border-fancy-blue"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Low Stock Notification Alert</label>
                  <input
                    type="number"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(e.target.value)}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 font-bold dark:text-white outline-none focus:border-fancy-blue"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <Link
              href={ROUTES.vendorPortal.products}
              className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-8 py-3 bg-fancy-blue hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-elevated transition"
            >
              Publish & Submit for Approval
            </button>
          </div>
        </form>
      </div>
    </VendorShell>
  );
}
