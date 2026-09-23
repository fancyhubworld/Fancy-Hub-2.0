"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { COUPONS_DATA } from "@/data/mock-catalog";
import { ROUTES } from "@/lib/routes";

export default function AdminCouponsPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 flex items-center space-x-3">
        <Link href={ROUTES.admin.dashboard} className="text-slate-400 hover:text-slate-800 dark:hover:text-white">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-black text-white">Global Promotional Coupons</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {COUPONS_DATA.map((c) => (
          <div key={c.id} className="bg-slate-800 border border-slate-700 rounded-3xl p-5 space-y-2">
            <span className="font-mono font-black text-fancy-blue text-base">{c.code}</span>
            <p className="text-white font-bold">{c.title}</p>
            <p className="text-slate-400">{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
