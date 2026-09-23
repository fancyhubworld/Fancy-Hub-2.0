"use client";

import React from "react";
import Link from "next/link";
import { Wallet, ArrowDownLeft, ArrowUpRight, Gift, ShieldCheck } from "lucide-react";
import { formatINR } from "@/lib/design-tokens";
import { Breadcrumbs } from "@/components/ui/StateFeedback";
import { ROUTES } from "@/lib/routes";

export default function StandaloneWalletPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <Breadcrumbs items={[{ label: "Fancy Wallet" }]} />

      <div className="bg-gradient-to-r from-blue-900 to-[#0B2A63] text-white rounded-3xl p-6 md:p-8 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs text-blue-200 font-bold uppercase tracking-wider">Available Balance</span>
          <div className="text-3xl md:text-5xl font-black">{formatINR(750.0)}</div>
          <p className="text-xs text-blue-200">100% usable on all multi-vendor orders with 1-click checkout</p>
        </div>

        <Link
          href={ROUTES.shop}
          className="py-3 px-6 bg-fancy-orange hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-elevated transition active:scale-95"
        >
          Redeem on Marketplace →
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle space-y-4">
        <h3 className="font-black text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-700 pb-3">
          Wallet Transactions & Cashback History
        </h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-700 text-xs">
          {[
            { id: "tx-1", title: "Festive Sign Up Welcome Bonus", amount: "+₹500.00", date: "15 Aug 2026", type: "CREDIT" },
            { id: "tx-2", title: "Cashback: Order #FH89201", amount: "+₹250.00", date: "10 Aug 2026", type: "CREDIT" },
          ].map((tx) => (
            <div key={tx.id} className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">{tx.title}</span>
                <span className="text-[11px] text-slate-400">{tx.date}</span>
              </div>
              <span className="font-black text-green-600 text-sm">{tx.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
