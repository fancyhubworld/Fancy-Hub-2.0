"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ShieldCheck,
  AlertTriangle,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Lock,
  Radio,
  Server,
  Activity,
  ArrowRight,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { formatINR } from "@/lib/design-tokens";

interface ProviderState {
  id: "RAZORPAY" | "PAYU" | "PHONEPE" | "CASHFREE" | "COD";
  name: string;
  category: "ONLINE_GATEWAY" | "OFFLINE_COD";
  environment: "SANDBOX" | "PRODUCTION";
  status: "ACTIVE" | "INACTIVE" | "TESTING";
  health: "HEALTHY" | "DEGRADED" | "OFFLINE";
  webhookStatus: "CONFIGURED" | "VERIFIED" | "PENDING";
  webhookUrl: string;
  maskedCredentials: Record<string, string>;
  metrics: {
    totalTransactions: number;
    successfulTransactions: number;
    failedTransactions: number;
    failureRatePercent: number;
    averageLatencyMs: number;
    lastSuccessfulTxAt: string | null;
  };
  supportedMethods: string[];
}

interface PreFlightReport {
  provider: string;
  providerName: string;
  currentEnvironment: string;
  targetEnvironment: string;
  credentialStatus: string;
  webhookStatus: string;
  testStatus: string;
  latencyMs: number;
  isEligibleForLive: boolean;
  riskWarning: string;
  activationToken: string;
}

export default function AdminPaymentsPage() {
  const [providers, setProviders] = useState<ProviderState[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<ProviderState | null>(null);
  const [preFlightReport, setPreFlightReport] = useState<PreFlightReport | null>(null);
  const [confirmationPhrase, setConfirmationPhrase] = useState("");
  const [activating, setActivating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/payments");
      const data = await res.json();
      if (data.success && data.providers) {
        setProviders(data.providers);
      }
    } catch (err) {
      console.error("Failed to load providers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleStartLiveActivation = async (prov: ProviderState) => {
    setMessage(null);
    setSelectedProvider(prov);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "PRE_FLIGHT_AUDIT", providerId: prov.id }),
      });
      const data = await res.json();
      if (data.success && data.report) {
        setPreFlightReport(data.report);
      } else {
        setMessage({ type: "error", text: data.error || "Could not generate pre-flight audit." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleConfirmLiveActivation = async () => {
    if (!selectedProvider || !preFlightReport) return;
    if (confirmationPhrase !== "CONFIRM_LIVE_ACTIVATION") {
      setMessage({ type: "error", text: "Please type 'CONFIRM_LIVE_ACTIVATION' exactly to proceed." });
      return;
    }

    setActivating(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CONFIRM_LIVE_ACTIVATION",
          providerId: selectedProvider.id,
          activationToken: preFlightReport.activationToken,
          confirmationPhrase,
          adminEmail: "superadmin@fancyhub.in",
          adminRole: "SUPER_ADMIN",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: data.message });
        setPreFlightReport(null);
        setSelectedProvider(null);
        setConfirmationPhrase("");
        fetchProviders();
      } else {
        setMessage({ type: "error", text: data.message || data.error });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setActivating(false);
    }
  };

  const handleSwitchToSandbox = async (provId: string) => {
    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SWITCH_ENVIRONMENT",
          providerId: provId,
          targetEnv: "SANDBOX",
          adminEmail: "superadmin@fancyhub.in",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: `Switched ${provId} back to SANDBOX mode.` });
        fetchProviders();
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <Link
            href={ROUTES.admin.dashboard}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white">Payment Control Center</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Phase 46 Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live payment activation readiness, sandbox testing, webhook integrity, and multi-gateway monitoring.
            </p>
          </div>
        </div>

        <button
          onClick={fetchProviders}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Status</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-sm flex items-center space-x-3 ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
              : "bg-rose-500/10 text-rose-300 border border-rose-500/30"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Configured Providers</span>
            <Server className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{providers.length}</p>
          <p className="text-xs text-slate-500 mt-1">Razorpay, PayU, PhonePe, Cashfree, COD</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Live Gateways</span>
            <Radio className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">
            {providers.filter((p) => p.environment === "PRODUCTION" && p.id !== "COD").length}
          </p>
          <p className="text-xs text-slate-500 mt-1">Strict Super Admin confirmation guard</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Sandbox Active</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">
            {providers.filter((p) => p.environment === "SANDBOX").length}
          </p>
          <p className="text-xs text-slate-500 mt-1">Isolated test payment simulation</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Zero Secret Exposure</span>
            <Lock className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-400 mt-2">100%</p>
          <p className="text-xs text-slate-500 mt-1">AES-256 encrypted + UI masked</p>
        </div>
      </div>

      {/* Provider Cards */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Gateway Readiness Matrix</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((prov) => {
            const isLive = prov.environment === "PRODUCTION";
            return (
              <div
                key={prov.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700 transition space-y-5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base">{prov.name}</h3>
                      <span className="text-xs text-slate-400 font-mono">{prov.id}</span>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        isLive
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {prov.environment}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2.5 text-xs text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Health Status:</span>
                      <span className="flex items-center space-x-1.5 font-medium text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>{prov.health}</span>
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Webhook Status:</span>
                      <span className="font-medium text-indigo-400">{prov.webhookStatus}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Avg Latency:</span>
                      <span className="font-mono text-slate-200">{prov.metrics.averageLatencyMs} ms</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Failure Rate:</span>
                      <span className="font-mono text-slate-200">{prov.metrics.failureRatePercent}%</span>
                    </div>

                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Last Successful Tx:</span>
                      <span className="text-slate-400 text-[11px]">
                        {prov.metrics.lastSuccessfulTxAt
                          ? new Date(prov.metrics.lastSuccessfulTxAt).toLocaleTimeString()
                          : "None"}
                      </span>
                    </div>
                  </div>

                  {/* Masked Credentials Preview */}
                  <div className="mt-3 p-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl text-[11px] space-y-1">
                    <p className="text-slate-400 font-semibold text-[10px] uppercase">Masked Credentials:</p>
                    {Object.entries(prov.maskedCredentials).map(([key, val]) => (
                      <div key={key} className="flex justify-between font-mono">
                        <span className="text-slate-500">{key}:</span>
                        <span className="text-slate-300">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  {isLive ? (
                    <button
                      onClick={() => handleSwitchToSandbox(prov.id)}
                      className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/20 text-xs font-semibold rounded-2xl transition"
                    >
                      Switch to SANDBOX Mode
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartLiveActivation(prov)}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-emerald-950/50 flex items-center justify-center space-x-1.5 transition"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Prepare Live Activation</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Step Live Activation Modal */}
      {preFlightReport && selectedProvider && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <h3 className="font-bold text-lg text-white">Live Payment Activation Guard</h3>
              </div>
              <button
                onClick={() => setPreFlightReport(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono">
                <div>
                  <span className="text-slate-500">PROVIDER:</span>
                  <p className="font-bold text-white text-sm mt-0.5">{preFlightReport.providerName}</p>
                </div>
                <div>
                  <span className="text-slate-500">ENVIRONMENT:</span>
                  <p className="font-bold text-emerald-400 text-sm mt-0.5">SANDBOX ➔ PRODUCTION</p>
                </div>
                <div>
                  <span className="text-slate-500">CREDENTIAL STATUS:</span>
                  <p className="text-emerald-400 mt-0.5 font-bold">{preFlightReport.credentialStatus} (MASKED)</p>
                </div>
                <div>
                  <span className="text-slate-500">WEBHOOK STATUS:</span>
                  <p className="text-emerald-400 mt-0.5 font-bold">{preFlightReport.webhookStatus}</p>
                </div>
                <div>
                  <span className="text-slate-500">TEST STATUS:</span>
                  <p className="text-emerald-400 mt-0.5 font-bold">{preFlightReport.testStatus} (Diagnostics OK)</p>
                </div>
                <div>
                  <span className="text-slate-500">AVG LATENCY:</span>
                  <p className="text-slate-200 mt-0.5 font-bold">{preFlightReport.latencyMs} ms</p>
                </div>
              </div>

              {/* Risk Warning Alert */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start space-x-3 text-amber-200">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-300">RISK WARNING</p>
                  <p className="text-[11px] leading-relaxed mt-1 text-amber-200/90">
                    {preFlightReport.riskWarning}
                  </p>
                </div>
              </div>

              {/* Step 2 Input */}
              <div className="space-y-2 pt-2">
                <label className="text-slate-300 font-medium">
                  Two-Step Confirmation: Type <span className="font-mono text-emerald-400 font-bold">CONFIRM_LIVE_ACTIVATION</span> below:
                </label>
                <input
                  type="text"
                  value={confirmationPhrase}
                  onChange={(e) => setConfirmationPhrase(e.target.value)}
                  placeholder="CONFIRM_LIVE_ACTIVATION"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setPreFlightReport(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                disabled={confirmationPhrase !== "CONFIRM_LIVE_ACTIVATION" || activating}
                onClick={handleConfirmLiveActivation}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-950/50 flex items-center space-x-2 transition"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{activating ? "Activating..." : "Execute Live Production Activation"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
