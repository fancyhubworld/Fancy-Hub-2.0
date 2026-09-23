"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useCategories } from "@/lib/use-categories";
import { ROUTES } from "@/lib/routes";

export default function VendorEditProductPage() {
  const router = useRouter();
  const params = useParams();
  const prodId = (params?.id as string) || "p-1";
  const { categoryTree } = useCategories();

  const [title, setTitle] = useState("FancyHub Pro Wireless ANC Earbuds");
  const [price, setPrice] = useState("1499");
  const [stock, setStock] = useState("65");
  const [selectedRootId, setSelectedRootId] = useState<string>("cat-electronics");
  const [selectedSubId, setSelectedSubId] = useState<string>("cat-audio");

  const rootCategory = categoryTree.find((c) => c.id === selectedRootId);
  const subCategories = rootCategory?.children || [];

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(ROUTES.vendorPortal.products);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-4 md:p-8 space-y-6">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle flex items-center space-x-3">
        <Link href={ROUTES.vendorPortal.products} className="text-slate-400 hover:text-slate-800 dark:hover:text-white">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-black text-slate-900 dark:text-white">Edit Product: {prodId}</h1>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 max-w-2xl shadow-card">
        <form onSubmit={handleUpdate} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Product Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Price (₹)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Stock Units</label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
              <select
                value={selectedRootId}
                onChange={(e) => {
                  setSelectedRootId(e.target.value);
                  setSelectedSubId("");
                }}
                className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
              >
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
                onChange={(e) => setSelectedSubId(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
              >
                <option value="" className="dark:bg-slate-800">-- Select Subcategory --</option>
                {subCategories.map((sub) => (
                  <option key={sub.id} value={sub.id} className="dark:bg-slate-800">
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-fancy-blue hover:bg-blue-700 text-white font-bold rounded-xl shadow transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
