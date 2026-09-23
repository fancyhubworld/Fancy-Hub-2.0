"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, Truck, ArrowRight, Printer, ShieldCheck } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { formatINR } from "@/lib/design-tokens";

export default function OrderSuccessDynamicPage() {
  const params = useParams();
  const orderId = (params?.id as string) || "FH89201";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-10 shadow-card text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/80 text-green-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-black text-green-700 uppercase tracking-wider">Payment Confirmed</span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Thank You for Your Order!
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Order ID: <strong className="text-fancy-blue font-mono font-bold">{orderId}</strong>
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-left space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Estimated Delivery:</span>
            <span className="font-bold text-slate-900 dark:text-white">2–4 Business Days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Carrier Partner:</span>
            <span className="font-bold text-slate-900 dark:text-white">Delhivery Express Surface</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Total Paid:</span>
            <span className="font-black text-fancy-blue">{formatINR(3398)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Link
            href={ROUTES.trackOrder}
            className="py-3 px-4 bg-fancy-blue hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition text-center"
          >
            Live Multi-Stage Tracking →
          </Link>
          <Link
            href={ROUTES.shop}
            className="py-3 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-white font-bold text-xs rounded-xl transition text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
