"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Tag, Copy, Check, ChevronRight } from "lucide-react";
import { COUPONS_DATA } from "@/data/mock-catalog";
import { formatINR } from "@/lib/design-tokens";

export default function AccountCouponsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href="/account" className="hover:text-fancy-blue">My Account</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold">Vouchers & Coupons</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900">Available Coupons & Promo Codes</h1>
          <p className="text-xs text-slate-500">Apply these codes in your cart to unlock direct cash discounts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {COUPONS_DATA.map((coupon) => (
          <div
            key={coupon.id}
            className="bg-white border border-slate-200 hover:border-fancy-blue rounded-3xl p-5 shadow-subtle flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-fancy-orange flex items-center justify-center flex-shrink-0">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{coupon.title}</h3>
                  <p className="text-xs text-slate-500">{coupon.description}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Code:</span>
                <p className="font-mono font-black text-fancy-blue text-sm">{coupon.code}</p>
              </div>
              <button
                onClick={() => handleCopy(coupon.code)}
                className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center space-x-1"
              >
                {copiedCode === coupon.code ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
