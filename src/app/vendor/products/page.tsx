"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Box,
  Edit2,
  Trash2,
  Copy,
  Archive,
  AlertTriangle,
  CheckCircle2,
  Search,
  ChevronLeft,
  X,
  Filter,
  Layers,
  ArrowUpDown,
} from "lucide-react";
import { PRODUCTS_DATA } from "@/data/mock-catalog";
import { formatINR } from "@/lib/design-tokens";
import { ROUTES } from "@/lib/routes";
import { VendorShell } from "@/components/vendor/VendorShell";

interface VendorProductItem {
  id: string;
  title: string;
  sku: string;
  categoryName: string;
  price: number;
  mrp: number;
  discountPercent: number;
  stock: number;
  variantsCount: number;
  status: "APPROVED" | "PENDING_APPROVAL" | "DRAFT" | "ARCHIVED";
  image: string;
}

export default function VendorProductsPage() {
  const initialProducts: VendorProductItem[] = PRODUCTS_DATA.slice(0, 6).map((p, idx) => ({
    id: p.id,
    title: p.title,
    sku: p.sku || `SKU-SSM-${1000 + idx}`,
    categoryName: p.categoryName,
    price: p.price,
    mrp: p.mrp || p.price * 1.4,
    discountPercent: p.discountPercent || 25,
    stock: p.stock,
    variantsCount: p.variants?.length || 3,
    status: idx === 1 ? "PENDING_APPROVAL" : idx === 4 ? "ARCHIVED" : "APPROVED",
    image: (typeof p.images?.[0] === "string" ? p.images[0] : p.images?.[0]?.url) || (p as any).image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800",
  }));

  const [products, setProducts] = useState<VendorProductItem[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDuplicate = (prod: VendorProductItem) => {
    const dup: VendorProductItem = {
      ...prod,
      id: `p-v-${Date.now()}`,
      title: `${prod.title} (Copy)`,
      sku: `${prod.sku}-COPY`,
      status: "DRAFT",
    };
    setProducts([dup, ...products]);
    showToast(`Duplicated "${prod.title}" as draft!`);
  };

  const handleToggleArchive = (id: string) => {
    setProducts(
      products.map((p) => {
        if (p.id === id) {
          const nextStatus = p.status === "ARCHIVED" ? "APPROVED" : "ARCHIVED";
          showToast(`Product status updated to ${nextStatus}`);
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    showToast("Product deleted from your catalog.");
  };

  const handleStockChange = (id: string, delta: number) => {
    setProducts(
      products.map((p) => {
        if (p.id === id) {
          const newStock = Math.max(0, p.stock + delta);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <VendorShell>
      <div className="p-4 md:p-8 space-y-6">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                Catalog & Inventory Management
              </h1>
              <span className="bg-blue-100 text-fancy-blue text-[10px] font-black px-2 py-0.5 rounded-full">
                {products.length} Listings
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Add, edit, duplicate, manage multi-sku variants, and monitor admin approval status.
            </p>
          </div>

          <Link
            href={ROUTES.vendorPortal.newProduct}
            className="flex items-center space-x-1.5 bg-fancy-blue hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center rounded-xl border border-slate-300 dark:border-slate-600 px-3 py-2 text-xs w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, SKU, or tag..."
              className="w-full outline-none bg-transparent dark:text-white"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 text-xs font-bold">
            <span className="text-slate-400 text-[11px]">Status:</span>
            {["ALL", "APPROVED", "PENDING_APPROVAL", "DRAFT", "ARCHIVED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                  statusFilter === st
                    ? "bg-fancy-blue text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {st === "ALL" ? "All Statuses" : st.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-card space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-black uppercase">
                  <th className="py-3 px-3">Product</th>
                  <th className="py-3 px-3">SKU & Variants</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Price / MRP</th>
                  <th className="py-3 px-3">Stock Units</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={prod.image}
                          alt=""
                          className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                        />
                        <div>
                          <span className="font-black text-slate-900 dark:text-white line-clamp-1 max-w-[220px]">
                            {prod.title}
                          </span>
                          <span className="text-[10px] text-slate-400">ID: {prod.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="space-y-0.5">
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300 block">
                          {prod.sku}
                        </span>
                        <span className="inline-flex items-center space-x-1 text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.2 rounded">
                          <Layers className="w-3 h-3 text-slate-400" />
                          <span>{prod.variantsCount} variants</span>
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-semibold">{prod.categoryName}</td>

                    <td className="py-3 px-3">
                      <div>
                        <span className="font-black text-slate-900 dark:text-white">{formatINR(prod.price)}</span>
                        <span className="text-[10px] text-slate-400 line-through ml-1.5">{formatINR(prod.mrp)}</span>
                        <span className="text-[10px] text-emerald-600 font-bold block">{prod.discountPercent}% OFF</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleStockChange(prod.id, -5)}
                          className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 font-bold hover:bg-slate-200 flex items-center justify-center text-xs"
                        >
                          -
                        </button>
                        <span className={`font-mono font-black ${prod.stock < 10 ? "text-rose-600" : "text-slate-900 dark:text-white"}`}>
                          {prod.stock}
                        </span>
                        <button
                          onClick={() => handleStockChange(prod.id, 5)}
                          className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 font-bold hover:bg-slate-200 flex items-center justify-center text-xs"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                          prod.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : prod.status === "PENDING_APPROVAL"
                            ? "bg-amber-100 text-amber-800"
                            : prod.status === "DRAFT"
                            ? "bg-slate-100 text-slate-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {prod.status.replace("_", " ")}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/vendor/products/${prod.id}/edit`}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-fancy-blue"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(prod)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
                          title="Duplicate Listing"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleArchive(prod.id)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-amber-600"
                          title="Archive / Restore"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-rose-100 text-rose-600"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </VendorShell>
  );
}
