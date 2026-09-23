"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Printer, Truck, CheckCircle2 } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { formatINR } from "@/lib/design-tokens";

export default function VendorOrderDetailPage() {
  const params = useParams();
  const orderId = (params?.id as string) || "FH89201-V1";
  const [status, setStatus] = useState("Processing");

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-4 md:p-8 space-y-6">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href={ROUTES.vendorPortal.orders} className="text-slate-400 hover:text-slate-800 dark:hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Sub-Order Fulfillment: {orderId}</h1>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center space-x-1.5 py-2 px-4 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold rounded-xl"
        >
          <Printer className="w-4 h-4" />
          <span>Print Packing Slip</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 max-w-3xl space-y-6 shadow-card text-xs">
        <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <span className="font-bold text-slate-900 dark:text-white text-sm block">Customer: Rahul Sharma</span>
            <p className="text-slate-500">Kolkata 700023, West Bengal • Ph: +91 98300 12345</p>
          </div>
          <span className="bg-blue-100 text-fancy-blue font-black px-3 py-1 rounded-xl text-xs h-fit">
            {status}
          </span>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-slate-900 dark:text-white">Fulfillment Details</h4>
          <p>Carrier: <strong>Delhivery Express (AWB: DEL98827110)</strong></p>
          <p>Vendor Net Earnings: <strong>{formatINR(1349.10)}</strong> (after 10% platform commission)</p>
        </div>

        <div className="pt-2 flex space-x-3">
          <button
            onClick={() => setStatus("Packed & Labeled")}
            className="py-2.5 px-5 bg-fancy-blue text-white font-bold rounded-xl shadow"
          >
            Mark Packed & Generate Delhivery Label
          </button>
        </div>
      </div>
    </div>
  );
}
