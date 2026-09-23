"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Sparkles,
  ChevronLeft,
  Plus,
  Play,
  Pause,
  ExternalLink,
  Tag,
} from "lucide-react";

interface ScheduledItem {
  id: string;
  name: string;
  type: "PAGE" | "BANNER" | "CAMPAIGN" | "POPUP" | "THEME";
  targetRoute: string;
  startDate: string;
  endDate: string;
  status: "UPCOMING" | "RUNNING" | "EXPIRED";
  autoDeactivate: boolean;
}

const INITIAL_SCHEDULED: ScheduledItem[] = [
  {
    id: "sch-1",
    name: "Diwali 2026 Grand Silk Festivities",
    type: "CAMPAIGN",
    targetRoute: "/p/diwali-mega-sale",
    startDate: "2026-10-15 00:00",
    endDate: "2026-10-25 23:59",
    status: "UPCOMING",
    autoDeactivate: true,
  },
  {
    id: "sch-2",
    name: "Midnight Flash 2-Hour Clearance",
    type: "BANNER",
    targetRoute: "/flash-sale",
    startDate: "2026-08-30 22:00",
    endDate: "2026-08-30 23:59",
    status: "UPCOMING",
    autoDeactivate: true,
  },
  {
    id: "sch-3",
    name: "First Order 10% Welcome Popup",
    type: "POPUP",
    targetRoute: "GLOBAL (All Pages)",
    startDate: "2026-08-01 00:00",
    endDate: "2026-12-31 23:59",
    status: "RUNNING",
    autoDeactivate: false,
  },
];

export default function AdminScheduledChangesPage() {
  const [items, setItems] = useState<ScheduledItem[]>(INITIAL_SCHEDULED);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
    showToast("Scheduled item removed");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-1">
            <Link href="/admin/website-control" className="hover:text-white">Website</Link>
            <span>/</span>
            <span className="text-fancy-blue font-bold">Scheduled Changes</span>
          </div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2.5">
            <Calendar className="w-6 h-6 text-indigo-400" />
            <span>Scheduled Releases & Auto-Publish Timers</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Schedule future launches for Themes, Banners, Campaigns, Landing Pages, and Popups with automated start and expiration dates.
          </p>
        </div>

        <Link
          href="/admin/pages"
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg flex items-center space-x-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Page Release</span>
        </Link>
      </div>

      {/* Grid */}
      <div className="space-y-4 max-w-4xl">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl"
          >
            <div className="flex items-start space-x-4">
              <div
                className={`p-3.5 rounded-2xl shrink-0 ${
                  item.status === "RUNNING"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                }`}
              >
                <Clock className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-black text-white">{item.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                    {item.type}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded ${
                      item.status === "RUNNING"
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-indigo-500/30 text-indigo-300 border border-indigo-500/40"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-xs text-slate-400 mt-2 font-mono">
                  <span>Target: {item.targetRoute}</span>
                  <span>•</span>
                  <span>
                    {item.startDate} → {item.endDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 self-end md:self-center">
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-slide-up">
          <Sparkles className="w-4 h-4 text-fancy-blue" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
