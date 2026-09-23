"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";
import { BRANDS_DATA } from "@/data/mock-catalog";
import { ROUTES } from "@/lib/routes";

export default function AdminBrandsPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href={ROUTES.admin.dashboard} className="text-slate-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-black text-white">Brand Directory & Approvals</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {BRANDS_DATA.map((b) => (
          <div key={b.id} className="bg-slate-800 border border-slate-700 rounded-3xl p-5 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white text-sm">{b.name}</span>
              <span className="bg-blue-900/60 text-blue-300 font-bold px-2 py-0.5 rounded text-[10px]">Verified</span>
            </div>
            <p className="text-slate-400">{b.description}</p>
            <span className="text-[11px] text-amber-400 font-mono">Slug: /{b.slug}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
