"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  AlertTriangle,
  Clock,
  Shield,
  Check,
  Save,
  Lock,
  Share2,
  Power,
} from "lucide-react";
import { DEFAULT_MAINTENANCE_CONFIG, MaintenanceModeConfig } from "@/lib/maintenance-engine";

export default function AdminMaintenancePage() {
  const [config, setConfig] = useState<MaintenanceModeConfig>(DEFAULT_MAINTENANCE_CONFIG);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/admin/maintenance")
      .then((res) => res.json())
      .then((data) => {
        if (data.maintenance) {
          setConfig(data.maintenance);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/admin/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e) {
      console.error("Save maintenance config failed:", e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-6 font-sans select-none">
      {/* Header */}
      <header className="h-16 bg-slate-900 border border-slate-800 rounded-3xl px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/pages"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h1 className="text-sm md:text-base font-black text-white">Maintenance Mode Control</h1>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  config.isEnabled
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                }`}
              >
                {config.isEnabled ? "MAINTENANCE ACTIVE" : "WEBSITE LIVE"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Put website in maintenance mode with live countdown and Super Admin bypass</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2 bg-gradient-to-r from-fancy-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-lg active:scale-95 transition disabled:opacity-50"
        >
          {saveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saveSuccess ? "Published!" : isSaving ? "Saving..." : "Save Settings"}</span>
        </button>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Form */}
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <div>
              <span className="font-bold text-white text-xs block">Enable Maintenance Mode Globally</span>
              <span className="text-[10px] text-slate-400">Restricts public traffic to countdown screen</span>
            </div>
            <input
              type="checkbox"
              checked={config.isEnabled}
              onChange={(e) => setConfig({ ...config, isEnabled: e.target.checked })}
              className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Headline Message</label>
            <input
              type="text"
              value={config.headline}
              onChange={(e) => setConfig({ ...config, headline: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Detailed Explanation</label>
            <textarea
              rows={3}
              value={config.message}
              onChange={(e) => setConfig({ ...config, message: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Launch Date / Countdown</label>
              <input
                type="text"
                value={config.expectedLaunchTime || ""}
                onChange={(e) => setConfig({ ...config, expectedLaunchTime: e.target.value })}
                placeholder="2026-08-30T18:00:00"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 font-mono text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Super Admin Bypass Key</label>
              <input
                type="text"
                value={config.bypassSecret}
                onChange={(e) => setConfig({ ...config, bypassSecret: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Right Maintenance Preview Screen */}
        <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-black text-white max-w-sm">{config.headline}</h3>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed">{config.message}</p>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center space-x-3 text-xs font-mono text-amber-300">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Target Launch: {config.expectedLaunchTime || "Coming Soon"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
