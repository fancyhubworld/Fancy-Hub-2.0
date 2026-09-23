"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export default function AdminCommissionsPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 flex items-center space-x-3">
        <Link href={ROUTES.admin.dashboard} className="text-slate-400 hover:text-white">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-black text-white">Marketplace Commission Rules</h1>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 space-y-3 text-xs">
        <p className="text-slate-400">Global Default Commission: <strong>10.0%</strong></p>
        <p className="text-slate-400">Promotional 30-Day Onboarding Rate: <strong>0.0%</strong></p>
      </div>
    </div>
  );
}
