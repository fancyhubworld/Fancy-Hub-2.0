"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Bell } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export default function VendorAnnouncementsPage() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-4 md:p-8 space-y-6">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle flex items-center space-x-3">
        <Link href={ROUTES.vendorPortal.dashboard} className="text-slate-400 hover:text-slate-800 dark:hover:text-white">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-black text-slate-900 dark:text-white">Platform Merchant Announcements</h1>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-card space-y-3 text-xs">
        <div className="p-4 bg-blue-50 dark:bg-blue-950/60 rounded-2xl space-y-1">
          <span className="font-bold text-fancy-blue text-sm block">Diwali 0% Commission Window Active</span>
          <p className="text-slate-700 dark:text-slate-300">Enjoy 0% platform commission on all handloom sarees dispatched within 24 hours.</p>
        </div>
      </div>
    </div>
  );
}
