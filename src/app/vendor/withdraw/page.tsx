"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, DollarSign, ArrowDownLeft, CheckCircle2, CreditCard, ShieldCheck, Building2 } from "lucide-react";
import { formatINR } from "@/lib/design-tokens";
import { ROUTES } from "@/lib/routes";
import { VendorShell } from "@/components/vendor/VendorShell";

export default function VendorWithdrawPage() {
  const [availableBalance, setAvailableBalance] = useState(42150.0);
  const [pendingBalance] = useState(12400.0);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [history, setHistory] = useState([
    { id: "po-1", payoutNo: "PO-88912", amount: 25000.0, method: "HDFC Bank (A/C: ...5678)", status: "COMPLETED", utr: "UTR99281109281", date: "15 Aug 2026" },
    { id: "po-2", payoutNo: "PO-87541", amount: 40000.0, method: "UPI (suratsilk@hdfcbank)", status: "COMPLETED", utr: "UTR88192004918", date: "01 Aug 2026" },
    { id: "po-3", payoutNo: "PO-86102", amount: 35000.0, method: "HDFC Bank (A/C: ...5678)", status: "COMPLETED", utr: "UTR77281900192", date: "15 Jul 2026" },
  ]);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(withdrawAmount);
    if (!amt || amt > availableBalance) return;

    const newPayout = {
      id: `po-${Date.now()}`,
      payoutNo: `PO-${Math.floor(10000 + Math.random() * 90000)}`,
      amount: amt,
      method: "HDFC Bank (A/C: ...5678)",
      status: "PROCESSING",
      utr: "Pending Bank Clearance",
      date: "Today",
    };

    setHistory([newPayout, ...history]);
    setAvailableBalance((b) => b - amt);
    setIsSuccess(true);
    setWithdrawAmount("");
    setTimeout(() => setIsSuccess(false), 4000);
  };

  return (
    <VendorShell>
      <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto font-sans">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">Seller Earnings & Payout Requests</h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                AUTOMATED NEFT / UPI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Direct NEFT/RTGS bank transfers and verified UPI settlements</p>
          </div>
        </div>

        {/* Balances Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-6 shadow-card space-y-1">
            <span className="text-xs text-blue-200 font-bold uppercase">Available Withdrawable Balance</span>
            <div className="text-2xl md:text-3xl font-black">{formatINR(availableBalance)}</div>
            <p className="text-[11px] text-blue-200">Cleared sales revenue ready for settlement</p>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle space-y-1">
            <span className="text-xs text-slate-400 font-bold uppercase">Pending in Transit</span>
            <div className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">{formatINR(pendingBalance)}</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Orders currently out for customer delivery</p>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle space-y-1">
            <span className="text-xs text-slate-400 font-bold uppercase">Total Settled to Date</span>
            <div className="text-2xl md:text-3xl font-black text-emerald-600 dark:text-emerald-400">{formatINR(400000.0)}</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Settled to verified HDFC bank account</p>
          </div>
        </div>

        {/* Withdrawal Form & Payout History */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Request Form (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-card space-y-4">
            <h3 className="font-black text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-700 pb-2">
              Request Bank Payout
            </h3>

            {isSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-2xl text-center">
                Withdrawal request submitted! Payout will reflect in your HDFC account in 2-4 hours.
              </div>
            )}

            <form onSubmit={handleWithdraw} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Withdrawal Amount (₹) *</label>
                <input
                  type="number"
                  max={availableBalance}
                  required
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="e.g. 20000"
                  className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2.5 text-sm font-black text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Maximum withdrawable: {formatINR(availableBalance)}</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-750 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                <p><strong>Beneficiary Bank:</strong> HDFC Bank</p>
                <p><strong>Account:</strong> ••••••••••••5678</p>
                <p><strong>IFSC:</strong> HDFC0001234 (Surat Textile Market Branch)</p>
                <p><strong>Verification:</strong> Active & Penny-Drop Verified</p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow transition"
              >
                Confirm Bank Transfer Request
              </button>
            </form>
          </div>

          {/* Ledger History (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-card space-y-4">
            <h3 className="font-black text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-700 pb-2">
              Settlement Ledger & UTR Numbers
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {history.map((h) => (
                <div key={h.id} className="py-3.5 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-black text-slate-900 dark:text-white">{h.payoutNo}</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.2 rounded">
                        {h.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{h.method} • {h.date}</p>
                    <p className="text-[10px] font-mono text-slate-400">UTR: {h.utr}</p>
                  </div>
                  <span className="font-black text-slate-900 dark:text-white text-sm">{formatINR(h.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </VendorShell>
  );
}
