"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, ShieldAlert } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export default function AdminDisputesPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href={ROUTES.admin.dashboard} className="text-slate-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-black text-white">Dispute & Claims Resolution Engine</h1>
          </div>
        </div>
        <span className="text-xs px-3 py-1 bg-amber-500/20 text-amber-300 font-bold rounded-full border border-amber-500/30">
          Admin Mediation Active
        </span>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 text-xs text-slate-400">
        Active dispute resolution tickets with evidence attachments and vendor mediation controls.
      </div>
    </div>
  );
}
