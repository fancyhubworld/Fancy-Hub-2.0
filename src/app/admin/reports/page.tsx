"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Download } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export default function AdminReportsPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href={ROUTES.admin.dashboard} className="text-slate-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-black text-white">Sales & Indian GST Tax Reports</h1>
        </div>

        <button className="flex items-center space-x-1.5 py-2 px-4 bg-fancy-blue text-white text-xs font-bold rounded-xl shadow">
          <Download className="w-4 h-4" />
          <span>Export GSTR-1 CSV</span>
        </button>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 text-xs text-slate-400">
        Monthly reconciliation of platform GST (18%) and HSN code breakdown.
      </div>
    </div>
  );
}
