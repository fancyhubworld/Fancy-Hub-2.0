"use client";

import React from "react";
import Link from "next/link";
import { Package, Truck, ChevronRight, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/StateFeedback";
import { formatINR } from "@/lib/design-tokens";
import { ROUTES } from "@/lib/routes";

export default function RootOrdersPage() {
  const orders = [
    { id: "FH89201", date: "24 Aug 2026", total: 3398, status: "Shipped", items: ["FancyHub Pro Wireless ANC Earbuds", "Pure Banarasi Silk Saree"] },
    { id: "FH78120", date: "15 Jul 2026", total: 899, status: "Delivered", items: ["Handcrafted Teakwood Spice Box"] },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <Breadcrumbs items={[{ label: "Order History" }]} />

      <div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">Your Orders & Fulfillment</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Track shipments, download GST invoices and request returns</p>
      </div>

      <div className="space-y-4">
        {orders.map((ord) => (
          <div
            key={ord.id}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-fancy-blue">{ord.id}</span>
                <span className="bg-blue-100 dark:bg-blue-950 text-fancy-blue text-[10px] font-black px-2 py-0.5 rounded">
                  {ord.status}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{ord.items.join(" + ")}</p>
              <p className="text-[11px] text-slate-400">Ordered on {ord.date} • Total: {formatINR(ord.total)}</p>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href={ROUTES.trackOrder}
                className="py-2 px-4 bg-blue-50 dark:bg-slate-700 text-fancy-blue dark:text-blue-300 hover:bg-fancy-blue hover:text-white text-xs font-bold rounded-xl transition"
              >
                Track Shipment
              </Link>
              <Link
                href={ROUTES.orderDetail(ord.id)}
                className="py-2 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-white text-xs font-bold rounded-xl transition"
              >
                View Invoice
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
