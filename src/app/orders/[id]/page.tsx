"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/StateFeedback";
import { formatINR } from "@/lib/design-tokens";
import { ROUTES } from "@/lib/routes";
import { Printer, Truck, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = (params?.id as string) || "FH89201";

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <Breadcrumbs items={[{ label: "Orders", href: ROUTES.orders }, { label: orderId }]} />

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Order Details</span>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">Order #{orderId}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Placed on 24 August 2026 • Paid via Razorpay UPI</p>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 py-2 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-white text-xs font-bold rounded-xl transition self-start sm:self-auto"
          >
            <Printer className="w-4 h-4" />
            <span>Print Tax Invoice</span>
          </button>
        </div>

        {/* Sub-Orders split */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Vendor Sub-Orders Breakdown</h3>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div className="flex justify-between font-bold">
              <span className="text-fancy-blue">Sub-Order #{orderId}-V1 (Surat Silk Mills)</span>
              <span className="text-green-600">Dispatched (Delhivery DEL9982)</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">Pure Banarasi Silk Saree (Royal Crimson Red) × 1 — {formatINR(1899)}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div className="flex justify-between font-bold">
              <span className="text-fancy-blue">Sub-Order #{orderId}-V2 (Mumbai Tech Lab)</span>
              <span className="text-green-600">Out for Delivery (Blue Dart BLU441)</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">FancyHub Pro Wireless ANC Earbuds (Matte Black) × 1 — {formatINR(1499)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
