"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  History,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronLeft,
  Eye,
  Plus,
  Palette,
  ShieldCheck,
} from "lucide-react";

interface ThemeVersion {
  id: string;
  versionNumber: number;
  label: string;
  author: string;
  createdAt: string;
  isActive: boolean;
  themePreset: string;
  primaryColor: string;
  appearanceMode: string;
}

const INITIAL_THEME_VERSIONS: ThemeVersion[] = [
  {
    id: "ver-current",
    versionNumber: 4,
    label: "FancyHub 2.0 Live Production Release",
    author: "Super Admin",
    createdAt: "2026-08-25 18:30",
    isActive: true,
    themePreset: "FancyHub Modern 2.0",
    primaryColor: "#1455D9",
    appearanceMode: "LIGHT",
  },
  {
    id: "ver-3",
    versionNumber: 3,
    label: "Festive Diwali Deep Glass Theme",
    author: "Designer Lead",
    createdAt: "2026-08-20 14:15",
    isActive: false,
    themePreset: "FancyHub Glass",
    primaryColor: "#E11D48",
    appearanceMode: "GLASSY",
  },
  {
    id: "ver-2",
    versionNumber: 2,
    label: "Independence Day Premium Saffron",
    author: "Marketing Manager",
    createdAt: "2026-08-10 10:00",
    isActive: false,
    themePreset: "FancyHub Premium",
    primaryColor: "#D97706",
    appearanceMode: "LIGHT",
  },
  {
    id: "ver-1",
    versionNumber: 1,
    label: "FancyHub Initial Baseline Theme",
    author: "System Initializer",
    createdAt: "2026-07-01 09:00",
    isActive: false,
    themePreset: "FancyHub Classic",
    primaryColor: "#1455D9",
    appearanceMode: "LIGHT",
  },
];

export default function AdminThemeVersionsPage() {
  const [versions, setVersions] = useState<ThemeVersion[]>(INITIAL_THEME_VERSIONS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRollback = (ver: ThemeVersion) => {
    setVersions(
      versions.map((v) => ({
        ...v,
        isActive: v.id === ver.id,
      }))
    );
    showToast(`Successfully rolled back to: ${ver.label} (#v${ver.versionNumber})`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-1">
            <Link href="/admin/theme-studio" className="hover:text-white">Theme Studio</Link>
            <span>/</span>
            <span className="text-fancy-blue font-bold">Theme Versions</span>
          </div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2.5">
            <History className="w-6 h-6 text-amber-400" />
            <span>Theme Version History & Snapshots</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse complete design history, inspect past token revisions, and instantly roll back active storefront styles.
          </p>
        </div>

        <Link
          href="/admin/theme-studio"
          className="px-4 py-2 rounded-xl bg-fancy-blue hover:bg-blue-600 text-white font-bold text-xs shadow-lg flex items-center space-x-1.5 transition"
        >
          <Palette className="w-4 h-4" />
          <span>Open Theme Studio</span>
        </Link>
      </div>

      {/* Timeline List */}
      <div className="space-y-4 max-w-4xl">
        {versions.map((ver) => (
          <div
            key={ver.id}
            className={`p-6 bg-slate-900 border rounded-3xl transition flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl ${
              ver.isActive ? "border-emerald-500/60 bg-slate-900/90" : "border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex items-start space-x-4">
              <div
                className={`p-3.5 rounded-2xl shrink-0 ${
                  ver.isActive
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-slate-950 text-slate-400 border border-slate-800"
                }`}
              >
                <History className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-black text-white">{ver.label}</span>
                  <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-slate-950 text-indigo-300 border border-slate-800">
                    v{ver.versionNumber}
                  </span>
                  {ver.isActive && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-slate-950 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                      <span>LIVE THEME</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3 text-xs text-slate-400 mt-2">
                  <span>Created by {ver.author}</span>
                  <span>•</span>
                  <span>{ver.createdAt}</span>
                  <span>•</span>
                  <span className="flex items-center space-x-1 font-mono text-white">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/20"
                      style={{ backgroundColor: ver.primaryColor }}
                    />
                    <span>{ver.primaryColor}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 self-end md:self-center">
              {ver.isActive ? (
                <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Currently Applied</span>
                </span>
              ) : (
                <button
                  onClick={() => handleRollback(ver)}
                  className="px-4 py-2 bg-slate-950 hover:bg-fancy-blue hover:text-white text-slate-300 rounded-xl text-xs font-bold border border-slate-800 transition flex items-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Rollback to this Version</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-slide-up">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
