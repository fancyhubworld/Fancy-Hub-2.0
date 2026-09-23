"use client";

import React from "react";
import Link from "next/link";
import { RotateCcw, ChevronRight, PackageCheck, Truck } from "lucide-react";

export default function AccountReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href="/account" className="hover:text-fancy-blue">My Account</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold">Returns & Refunds</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900">7-Day Doorstep Returns & Refunds</h1>
          <p className="text-xs text-slate-500">Transparent pickup tracking and instant wallet credit guarantee</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-subtle space-y-4">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-fancy-blue mx-auto flex items-center justify-center">
          <RotateCcw className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No Active Return Requests</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Need to return a recently delivered order? Visit your orders page to request a doorstep pickup within 7 days.
        </p>
        <Link
          href="/account/orders"
          className="inline-block bg-fancy-blue hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow transition"
        >
          View Delivered Orders
        </Link>
      </div>
    </div>
  );
}
