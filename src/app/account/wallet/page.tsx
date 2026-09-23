"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Wallet, ArrowDownLeft, ArrowUpRight, ShieldCheck, ChevronRight, Plus } from "lucide-react";
import { formatINR } from "@/lib/design-tokens";

export default function AccountWalletPage() {
  const [balance, setBalance] = useState<number>(750.0);

  const transactions = [
    { id: "tx-1", type: "CREDIT", title: "Welcome Sign-up Bonus Reward", amount: 250.0, balanceAfter: 750.0, date: "15 Aug 2026", ref: "FANCY-WELCOME" },
    { id: "tx-2", type: "CREDIT", title: "Promotional Cashback Campaign", amount: 500.0, balanceAfter: 500.0, date: "10 Aug 2026", ref: "CB-DIWALI-2026" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href="/account" className="hover:text-fancy-blue">My Account</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold">FancyHub Wallet</span>
      </div>

      {/* Wallet Balance Hero */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-900 text-white rounded-3xl p-6 md:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-200 mb-1">
            <Wallet className="w-4 h-4" />
            <span>FancyHub Store Credit Balance</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black">{formatINR(balance)}</h1>
          <p className="text-xs text-emerald-200 mt-1">Usable instantly on all marketplace purchases with zero expiry</p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/shop"
            className="px-6 py-3 bg-white text-slate-900 font-black text-xs rounded-2xl shadow transition hover:bg-slate-100"
          >
            Shop with Credits →
          </Link>
        </div>
      </div>

      {/* Immutable Ledger Activity Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-slate-900 text-base">Wallet Ledger & Transaction History</h3>
            <p className="text-xs text-slate-500">Immutable records of refunds, rewards, and order deductions</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {transactions.map((tx) => (
            <div key={tx.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0">
                  <ArrowDownLeft className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{tx.title}</h4>
                  <p className="text-[11px] text-slate-400">{tx.date} • Ref: {tx.ref}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-black text-green-700">+ {formatINR(tx.amount)}</span>
                <p className="text-[10px] text-slate-400">Balance: {formatINR(tx.balanceAfter)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
