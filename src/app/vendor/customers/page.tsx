"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { formatINR } from "@/lib/design-tokens";

export default function VendorCustomersPage() {
  const customers = [
    { id: "c-1", name: "Rahul Sharma", email: "rahul@fancyhub.in", city: "Kolkata", ordersCount: 4, spent: 7890 },
    { id: "c-2", name: "Priya Patel", email: "priya@gmail.com", city: "Surat", ordersCount: 2, spent: 3798 },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-4 md:p-8 space-y-6">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle flex items-center space-x-3">
        <Link href={ROUTES.vendorPortal.dashboard} className="text-slate-400 hover:text-slate-800 dark:hover:text-white">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-black text-slate-900 dark:text-white">Customer Insights & Repeat Buyers</h1>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-card space-y-4">
        <div className="divide-y divide-slate-100 dark:divide-slate-700 text-xs">
          {customers.map((c) => (
            <div key={c.id} className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">{c.name} ({c.city})</span>
                <span className="text-slate-400 text-[11px]">{c.email} • {c.ordersCount} Orders</span>
              </div>
              <span className="font-black text-slate-900 dark:text-white">{formatINR(c.spent)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
