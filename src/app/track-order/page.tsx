"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Truck,
  CheckCircle2,
  Package,
  Clock,
  MapPin,
  Search,
  ChevronRight,
  Store,
} from "lucide-react";
import { formatINR } from "@/lib/design-tokens";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams?.get("orderId") || "FH89201";

  const [orderQuery, setOrderQuery] = useState(initialOrderId);
  const [tracked, setTracked] = useState(true);

  const steps = [
    { label: "Order Confirmed", date: "17 Aug 2026, 09:15 AM", completed: true },
    { label: "Packed at Surat Silk Hub", date: "17 Aug 2026, 02:40 PM", completed: true },
    { label: "Dispatched via Delhivery Express", date: "18 Aug 2026, 11:10 AM", completed: true },
    { label: "Arrived at Kolkata Sorting Hub", date: "19 Aug 2026, 06:30 AM", completed: true },
    { label: "Out for Delivery", date: "20 Aug 2026, 09:00 AM", completed: true },
    { label: "Delivered to Customer", date: "20 Aug 2026, 02:30 PM", completed: true },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Search Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-subtle space-y-4">
        <h1 className="text-xl md:text-2xl font-black text-slate-900">
          Track Your Marketplace Shipment
        </h1>
        <p className="text-xs text-slate-500">
          Enter your FancyHub Order ID (e.g. FH89201) or Delhivery Tracking Number (DELXXXXX)
        </p>

        <div className="flex space-x-2 max-w-lg">
          <input
            type="text"
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value.toUpperCase())}
            placeholder="e.g. FH89201"
            className="flex-1 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-fancy-blue"
          />
          <button
            onClick={() => setTracked(true)}
            className="bg-fancy-blue hover:bg-blue-700 text-white font-bold text-xs px-5 py-2 rounded-xl transition"
          >
            Track
          </button>
        </div>
      </div>

      {tracked && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-subtle space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-black text-slate-900">Shipment Status:</span>
                <span className="bg-green-100 text-green-800 text-xs font-black px-3 py-0.5 rounded-full">
                  DELIVERED
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Order #{orderQuery} • Carrier: <strong>Delhivery Express (AWB: DEL98827110)</strong>
              </p>
            </div>
            <div className="text-left sm:text-right text-xs">
              <span className="text-slate-500">Delivered On:</span>
              <p className="font-bold text-slate-900">Thursday, 20 Aug 2026</p>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-green-600">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex items-start space-x-4">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-green-600 border-2 border-white flex items-center justify-center text-white shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs">
                  <h4 className="font-bold text-slate-900">{step.label}</h4>
                  <p className="text-[11px] text-slate-500">{step.date}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Location Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-start space-x-3 text-xs">
            <MapPin className="w-5 h-5 text-fancy-blue flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">Delivered to:</p>
              <p className="text-slate-600">Rahul Sharma • Hastings, Kolkata, West Bengal - 700023</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Signature Verified by Courier Agent</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading tracking engine...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
