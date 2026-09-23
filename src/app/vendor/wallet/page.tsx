"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronLeft,
  DollarSign,
  TrendingUp,
  CreditCard,
  Clock,
  ShieldCheck,
  CheckCircle2,
  FileText,
  ArrowUpRight,
  Info,
  Building2,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { formatINR } from "@/lib/design-tokens";
import { VendorShell } from "@/components/vendor/VendorShell";

export default function VendorWalletPage() {
  const ledgerSummary = {
    grossSales: 492150.0,
    platformCommission: 41832.75, // 8.5%
    tcsGstTaxes: 4921.5, // 1% TCS
    refundAdjustments: 3245.75,
    totalWithdrawn: 400000.0,
    availableBalance: 42150.0,
    pendingInTransit: 12400.0,
  };

  const ledgerEntries = [
    { id: "tx-1", type: "ORDER_CREDIT", desc: "Order #FH89201 Delivered — Surat Silk Mills", amount: +1499.0, date: "Today, 02:40 PM", status: "CLEARED" },
    { id: "tx-2", type: "COMMISSION_DEBIT", desc: "Platform Fee (8.5%) on #FH89201", amount: -127.42, date: "Today, 02:40 PM", status: "CLEARED" },
    { id: "tx-3", type: "TCS_TAX_DEBIT", desc: "TCS (1% GST u/s 52) on #FH89201", amount: -14.99, date: "Today, 02:40 PM", status: "CLEARED" },
    { id: "tx-4", type: "ORDER_CREDIT", desc: "Order #FH91844 Delivered — Banarasi Saree", amount: +1899.0, date: "Yesterday", status: "CLEARED" },
    { id: "tx-5", type: "WITHDRAWAL", desc: "Bank Settlement Payout #PO-88912 (UTR99281109281)", amount: -25000.0, date: "15 Aug 2026", status: "SETTLED" },
    { id: "tx-6", type: "REFUND_DEBIT", desc: "Customer Return Refund Adjustment on #FH81920", amount: -899.0, date: "12 Aug 2026", status: "CLEARED" },
  ];

  return (
    <VendorShell>
      <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto font-sans">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                Seller Financial Ledger & Settlements
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                AUDITED
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Double-entry immutable ledger tracking gross marketplace sales, platform commissions, TCS, and payouts.
            </p>
          </div>

          <Link
            href={ROUTES.vendorPortal.withdraw}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition"
          >
            <CreditCard className="w-4 h-4" />
            <span>Request Bank Withdrawal</span>
          </Link>
        </div>

        {/* Ledger Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-5 shadow-card space-y-1">
            <span className="text-[11px] font-bold text-blue-200 uppercase">Available Withdrawable</span>
            <div className="text-2xl font-black">{formatINR(ledgerSummary.availableBalance)}</div>
            <p className="text-[10px] text-blue-200">Cleared sales ready for direct bank transfer</p>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-subtle space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Pending In Transit</span>
            <div className="text-2xl font-black text-amber-600">{formatINR(ledgerSummary.pendingInTransit)}</div>
            <p className="text-[10px] text-slate-400">Orders currently in transit for delivery</p>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-subtle space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Settled To Date</span>
            <div className="text-2xl font-black text-emerald-600">{formatINR(ledgerSummary.totalWithdrawn)}</div>
            <p className="text-[10px] text-slate-400">Transferred via NEFT/RTGS to HDFC bank</p>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-subtle space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Gross Lifetime Sales</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{formatINR(ledgerSummary.grossSales)}</div>
            <p className="text-[10px] text-slate-400">Total customer orders fulfilled</p>
          </div>
        </div>

        {/* Ledger Transparency Summary Table */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base">Statement Reconciliation Ledger</h3>
              <p className="text-xs text-slate-500">Breakdown of gross sales, platform fees, taxes, and net earnings</p>
            </div>
            <div className="flex items-center space-x-1 text-xs text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
              <span>Immutable Ledger Isolation Active</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-750 rounded-2xl">
              <span className="text-slate-400 text-[10px] font-bold uppercase">Gross Orders</span>
              <p className="font-black text-slate-900 dark:text-white text-sm mt-0.5">{formatINR(ledgerSummary.grossSales)}</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-750 rounded-2xl">
              <span className="text-slate-400 text-[10px] font-bold uppercase">Platform Fee (8.5%)</span>
              <p className="font-black text-rose-600 text-sm mt-0.5">-{formatINR(ledgerSummary.platformCommission)}</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-750 rounded-2xl">
              <span className="text-slate-400 text-[10px] font-bold uppercase">TCS (1% GST)</span>
              <p className="font-black text-rose-600 text-sm mt-0.5">-{formatINR(ledgerSummary.tcsGstTaxes)}</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-750 rounded-2xl">
              <span className="text-slate-400 text-[10px] font-bold uppercase">Refunds / RTO</span>
              <p className="font-black text-rose-600 text-sm mt-0.5">-{formatINR(ledgerSummary.refundAdjustments)}</p>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl">
              <span className="text-fancy-blue text-[10px] font-bold uppercase">Net Payable</span>
              <p className="font-black text-fancy-blue text-sm mt-0.5">{formatINR(ledgerSummary.availableBalance + ledgerSummary.totalWithdrawn)}</p>
            </div>
          </div>
        </div>

        {/* Detailed Immutable Transactions Stream */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-card space-y-4">
          <h3 className="font-black text-slate-900 dark:text-white text-base">Recent Ledger Entries</h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {ledgerEntries.map((entry) => (
              <div key={entry.id} className="py-3.5 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{entry.id}</span>
                    <span
                      className={`px-2 py-0.2 rounded text-[10px] font-black ${
                        entry.type === "ORDER_CREDIT"
                          ? "bg-emerald-100 text-emerald-800"
                          : entry.type === "WITHDRAWAL"
                          ? "bg-blue-100 text-fancy-blue"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {entry.type}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 font-semibold">{entry.desc}</p>
                  <span className="text-[10px] text-slate-400">{entry.date}</span>
                </div>

                <div className="text-right">
                  <span
                    className={`font-black text-sm block ${
                      entry.amount > 0 ? "text-emerald-600" : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {entry.amount > 0 ? `+${formatINR(entry.amount)}` : formatINR(entry.amount)}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">{entry.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </VendorShell>
  );
}
