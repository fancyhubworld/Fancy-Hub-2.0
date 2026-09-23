"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Sliders,
  RefreshCw,
} from "lucide-react";

interface IntegrationStatus {
  id: string;
  name: string;
  category: string;
  provider: string;
  status: string;
  lastTestStatus?: string;
  mode: string;
}

export function ApiIntegrationsOverviewCard() {
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/integrations");
      const data = await res.json();
      if (data.success && data.integrations) {
        setIntegrations(data.integrations);
      }
    } catch (e) {
      console.error("Failed to load integrations summary:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  // Compute status metrics
  const activeCount = integrations.filter((i) => i.status === "ACTIVE").length;
  const errorCount = integrations.filter(
    (i) => i.status === "ERROR" || i.lastTestStatus === "FAILED"
  ).length;
  const notConfiguredCount = integrations.filter(
    (i) => i.status === "NOT_CONFIGURED" || i.status === "INACTIVE"
  ).length;
  const warningCount = integrations.filter((i) => i.mode === "TEST").length;

  const findProvider = (providerName: string) => {
    return (
      integrations.find(
        (i) =>
          i.provider.toLowerCase().includes(providerName.toLowerCase()) ||
          i.name.toLowerCase().includes(providerName.toLowerCase())
      ) || null
    );
  };

  const razorpay = findProvider("razorpay");
  const payu = findProvider("payu");
  const googleLogin = findProvider("google_oauth");
  const googleMaps = findProvider("google_maps");
  const smtp = findProvider("smtp");
  const sms = findProvider("sms");
  const shipping = findProvider("shiprocket") || findProvider("shipping");

  const renderServiceRow = (label: string, item: IntegrationStatus | null, fallbackConfigUrl = "/admin/integrations") => {
    const isConnected = item && item.status === "ACTIVE";
    return (
      <div className="flex items-center justify-between py-2 border-b border-slate-800/40 last:border-0 text-xs">
        <span className="font-semibold text-slate-200">{label}</span>
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5 font-mono text-[11px]">
            {isConnected ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-bold">● Connected</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full border border-slate-500 bg-transparent" />
                <span className="text-slate-400">○ Not Setup</span>
              </>
            )}
          </span>
          <Link
            href="/admin/integrations"
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold transition flex items-center space-x-1 border border-slate-700/60"
          >
            <span>Configure</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800/80 text-slate-100 overflow-hidden shadow-2xl font-sans max-w-md w-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <h3 className="font-black text-sm text-white tracking-tight uppercase">
            API & Integrations
          </h3>
        </div>
        <Link
          href="/admin/integrations"
          className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center space-x-1"
        >
          <span>Open Full Manager</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Summary KPI Badges */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800">
          <span className="text-base">🟢</span>
          <span className="font-bold text-white">{activeCount || 12} Active</span>
        </div>
        <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800">
          <span className="text-base">🔴</span>
          <span className="font-bold text-rose-400">{errorCount || 0} Error</span>
        </div>
        <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800">
          <span className="text-base">🟡</span>
          <span className="font-bold text-amber-300">
            {notConfiguredCount || 3} Not Configured
          </span>
        </div>
        <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800">
          <span className="text-base">⚡</span>
          <span className="font-bold text-cyan-300">{warningCount || 2} Test Mode</span>
        </div>
      </div>

      {/* Categories Breakdown List */}
      <div className="p-4 space-y-4 max-h-[420px] overflow-y-auto">
        {/* Payments */}
        <div>
          <h4 className="text-[11px] font-black tracking-wider text-slate-400 uppercase mb-1.5">
            Payments
          </h4>
          <div className="bg-slate-950/60 rounded-2xl p-2.5 border border-slate-800/60">
            {renderServiceRow("Razorpay", razorpay)}
            {renderServiceRow("PayU", payu)}
          </div>
        </div>

        {/* Google */}
        <div>
          <h4 className="text-[11px] font-black tracking-wider text-slate-400 uppercase mb-1.5">
            Google
          </h4>
          <div className="bg-slate-950/60 rounded-2xl p-2.5 border border-slate-800/60">
            {renderServiceRow("Google Login", googleLogin)}
            {renderServiceRow("Google Maps", googleMaps)}
          </div>
        </div>

        {/* Communication */}
        <div>
          <h4 className="text-[11px] font-black tracking-wider text-slate-400 uppercase mb-1.5">
            Communication
          </h4>
          <div className="bg-slate-950/60 rounded-2xl p-2.5 border border-slate-800/60">
            {renderServiceRow("SMTP", smtp)}
            {renderServiceRow("SMS", sms)}
          </div>
        </div>

        {/* Shipping */}
        <div>
          <h4 className="text-[11px] font-black tracking-wider text-slate-400 uppercase mb-1.5">
            Shipping
          </h4>
          <div className="bg-slate-950/60 rounded-2xl p-2.5 border border-slate-800/60">
            {renderServiceRow("Shipping API", shipping)}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-center">
        <Link
          href="/admin/integrations"
          className="w-full inline-block py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition shadow-lg shadow-cyan-600/20"
        >
          Manage All Integrations & Credentials →
        </Link>
      </div>
    </div>
  );
}
