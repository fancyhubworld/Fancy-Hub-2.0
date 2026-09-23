"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Headphones, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export default function AdminSupportPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href={ROUTES.admin.dashboard} className="text-slate-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center space-x-2">
            <Headphones className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl font-black text-white">Helpdesk & Support Agent Command Center</h1>
          </div>
        </div>
        <span className="text-xs px-3 py-1 bg-emerald-500/20 text-emerald-300 font-bold rounded-full border border-emerald-500/30">
          SLA Tracker Live
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-1">
          <div className="text-xs text-slate-400 flex items-center gap-1.5 font-bold">
            <Headphones className="w-4 h-4 text-blue-400" /> Open Tickets
          </div>
          <div className="text-2xl font-black text-white">12</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-1">
          <div className="text-xs text-slate-400 flex items-center gap-1.5 font-bold">
            <Clock className="w-4 h-4 text-amber-400" /> Under Review / In Progress
          </div>
          <div className="text-2xl font-black text-amber-400">5</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-1">
          <div className="text-xs text-slate-400 flex items-center gap-1.5 font-bold">
            <AlertTriangle className="w-4 h-4 text-rose-400" /> SLA At Risk / Breached
          </div>
          <div className="text-2xl font-black text-rose-400">0</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-1">
          <div className="text-xs text-slate-400 flex items-center gap-1.5 font-bold">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> Resolved Today
          </div>
          <div className="text-2xl font-black text-emerald-400">28</div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 text-xs text-slate-400">
        Unified agent queue for customer, vendor, and order-linked escalation tickets.
      </div>
    </div>
  );
}
