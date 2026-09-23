"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, DollarSign, CheckCircle2 } from "lucide-react";
import { formatINR } from "@/lib/design-tokens";

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState([
    { id: "po-1", payoutNo: "PO-88912", vendor: "Surat Silk Mills", amount: 25000.0, method: "HDFC Bank (A/C: ...5678)", status: "COMPLETED", utr: "UTR99281109281" },
    { id: "po-2", payoutNo: "PO-89401", vendor: "Mumbai Tech Lab", amount: 35000.0, method: "ICICI Bank (A/C: ...1122)", status: "PENDING", utr: "Pending Approval" },
    { id: "po-3", payoutNo: "PO-89510", vendor: "Jaipur Heritage Crafts", amount: 15000.0, method: "SBI Bank (A/C: ...9944)", status: "PENDING", utr: "Pending Approval" },
  ]);

  const handleApprove = (id: string) => {
    setPayouts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: "COMPLETED", utr: `UTR${Math.floor(10000000000 + Math.random() * 90000000000)}` }
          : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/admin/dashboard" className="text-slate-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white">Vendor Withdrawal & Settlement Approval</h1>
            <p className="text-xs text-slate-400">Review pending payout requests and clear bank NEFT/RTGS transfers</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 uppercase font-bold">
                <th className="py-3 px-3">Payout #</th>
                <th className="py-3 px-3">Vendor / Store</th>
                <th className="py-3 px-3">Bank Details</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">UTR Reference</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {payouts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-750">
                  <td className="py-3 px-3 font-bold text-white">{p.payoutNo}</td>
                  <td className="py-3 px-3 font-semibold text-fancy-blue">{p.vendor}</td>
                  <td className="py-3 px-3 text-slate-400">{p.method}</td>
                  <td className="py-3 px-3 font-black text-white">{formatINR(p.amount)}</td>
                  <td className="py-3 px-3 font-mono font-bold text-amber-300">{p.utr}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      p.status === "COMPLETED" ? "bg-green-900/80 text-green-300" : "bg-amber-900/80 text-amber-300"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {p.status === "PENDING" ? (
                      <button
                        onClick={() => handleApprove(p.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl transition"
                      >
                        Approve & Settle
                      </button>
                    ) : (
                      <span className="text-slate-500 font-bold">Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
