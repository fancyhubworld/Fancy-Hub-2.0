"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { formatINR } from "@/lib/design-tokens";

export default function AdminOrdersPage() {
  const orders = [
    { id: "FH89201", customer: "Rahul Sharma", total: 3398, payment: "RAZORPAY_UPI", status: "SHIPPED", date: "24 Aug 2026" },
    { id: "FH91844", customer: "Priya Patel", total: 1899, payment: "COD", status: "CONFIRMED", date: "24 Aug 2026" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href={ROUTES.admin.dashboard} className="text-slate-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-black text-white">Platform Orders & Multi-Vendor Splits</h1>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 space-y-4 text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-slate-300">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 uppercase font-bold">
                <th className="py-3 px-3">Order #</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Total Amount</th>
                <th className="py-3 px-3">Gateway</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-750">
                  <td className="py-3 px-3 font-bold text-white">{o.id}</td>
                  <td className="py-3 px-3">{o.customer}</td>
                  <td className="py-3 px-3 font-black text-white">{formatINR(o.total)}</td>
                  <td className="py-3 px-3 font-mono text-amber-300">{o.payment}</td>
                  <td className="py-3 px-3">
                    <span className="bg-blue-900/80 text-blue-300 px-2 py-0.5 rounded font-black text-[10px]">
                      {o.status}
                    </span>
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
