"use client";

import React, { useState } from "react";
import { COUPONS_DATA } from "@/data/mock-catalog";
import { formatINR } from "@/lib/design-tokens";
import { Breadcrumbs } from "@/components/ui/StateFeedback";
import { Tag, Check, Copy } from "lucide-react";

export default function CouponsHubPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <Breadcrumbs items={[{ label: "Discount Coupons & Vouchers" }]} />

      <div className="bg-gradient-to-r from-fancy-blue to-[#0B2A63] text-white rounded-3xl p-6 md:p-8 shadow-card space-y-1">
        <span className="text-xs text-blue-200 font-bold uppercase tracking-wider">Save Big</span>
        <h1 className="text-2xl md:text-3xl font-black">Active Marketplace Coupons</h1>
        <p className="text-xs text-slate-200">Apply these discount codes at checkout for instant cash discounts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {COUPONS_DATA.map((c) => (
          <div key={c.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-subtle space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-fancy-blue text-lg">{c.code}</span>
              <button
                onClick={() => copyCode(c.code)}
                className="flex items-center space-x-1 text-xs font-bold text-fancy-blue bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-xl transition"
              >
                {copiedCode === c.code ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-green-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">{c.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{c.description}</p>
            </div>
            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700">
              Min. Order Value: <strong>{formatINR(c.minOrderValue)}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
