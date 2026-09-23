"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, Tag, X } from "lucide-react";
import { formatINR } from "@/lib/design-tokens";

export default function VendorCouponsPage() {
  const [coupons, setCoupons] = useState([
    { id: "cp-v1", code: "SURAT15", title: "15% Off on Banarasi Sarees", type: "PERCENTAGE", value: 15, minOrder: 1500, used: 84 },
    { id: "cp-v2", code: "FESTIVE200", title: "Flat ₹200 Off on Orders ₹999+", type: "FIXED", value: 200, minOrder: 999, used: 142 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newVal, setNewVal] = useState("");

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newVal) return;
    setCoupons([
      ...coupons,
      {
        id: `cp-${Date.now()}`,
        code: newCode.toUpperCase(),
        title: `Special Store Voucher: ${newCode.toUpperCase()}`,
        type: "PERCENTAGE",
        value: Number(newVal),
        minOrder: 500,
        used: 0,
      },
    ]);
    setShowModal(false);
    setNewCode("");
    setNewVal("");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 space-y-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/vendor/dashboard" className="text-slate-400 hover:text-slate-800">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl md:text-2xl font-black text-slate-900">Store Promotional Coupons</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Create discount codes to boost conversions for your storefront</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-1.5 bg-fancy-blue hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create Store Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coupons.map((c) => (
          <div key={c.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-fancy-blue text-base">{c.code}</span>
              <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded">
                Active
              </span>
            </div>
            <p className="text-xs font-bold text-slate-800">{c.title}</p>
            <p className="text-[11px] text-slate-500">Min Order: {formatINR(c.minOrder)} • Redemptions: {c.used} shoppers</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative space-y-4">
            <button onClick={() => setShowModal(false)} className="absolute right-4 top-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-black text-slate-900 text-base">Create Discount Coupon</h3>
            <form onSubmit={handleAddCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Coupon Code (Uppercase) *</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="e.g. DIWALI20"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Discount % *</label>
                <input
                  type="number"
                  required
                  value={newVal}
                  onChange={(e) => setNewVal(e.target.value)}
                  placeholder="15"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-fancy-blue hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow"
              >
                Create & Activate Coupon
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
