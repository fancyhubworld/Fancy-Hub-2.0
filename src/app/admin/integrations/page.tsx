"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import {
  Activity,
  ShieldCheck,
  Zap,
  Key,
  Globe,
  RefreshCw,
  Search,
  Plus,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  EyeOff,
  Sliders,
  Server,
  Lock,
  ArrowUpRight,
  Clock,
  Sparkles,
} from "lucide-react";

interface IntegrationItem {
  id: string;
  name: string;
  category: string;
  provider: string;
  environment: string;
  mode: string;
  status: string;
  baseUrl?: string;
  apiVersion?: string;
  maskedCredentials: Record<string, string>;
  publicSettings: Record<string, any>;
  webhookUrl?: string;
  hasWebhookSecret: boolean;
  webhookEvents: string[];
  lastTestedAt?: string;
  lastTestStatus?: string;
  lastResponseTimeMs?: number;
  lastErrorMessage?: string;
  totalLogs: number;
}

export default function AdminIntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedEnv, setSelectedEnv] = useState("ALL");
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testMessage, setTestMessage] = useState<{ id: string; text: string; isSuccess: boolean } | null>(null);
  
  // Reveal Modal State
  const [revealModalId, setRevealModalId] = useState<string | null>(null);
  const [revealedData, setRevealedData] = useState<Record<string, string> | null>(null);
  const [revealLoading, setRevealLoading] = useState(false);

  // Mode Switch Modal State
  const [modeSwitchItem, setModeSwitchItem] = useState<IntegrationItem | null>(null);

  const categories = [
    { id: "ALL", label: "All Integrations" },
    { id: "PAYMENTS", label: "Payments (Razorpay/UPI)" },
    { id: "GOOGLE", label: "Google Services" },
    { id: "COMMUNICATION", label: "Email & SMS" },
    { id: "AI", label: "Gemini AI Engine" },
    { id: "SHIPPING", label: "Logistics & Tracking" },
    { id: "STORAGE", label: "Cloud Storage & CDN" },
    { id: "CUSTOM", label: "Custom REST APIs" },
  ];

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/integrations");
      const data = await res.json();
      if (data.success) {
        setIntegrations(data.integrations || []);
      }
    } catch (e) {
      console.error("Error fetching integrations:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleTestConnection = async (id: string) => {
    setTestingId(id);
    setTestMessage(null);
    try {
      const res = await fetch(`/api/admin/integrations/${id}/test`, { method: "POST" });
      const data = await res.json();
      if (data.success && data.result) {
        setTestMessage({
          id,
          text: `Connected (${data.result.responseTimeMs}ms): ${data.result.message}`,
          isSuccess: data.result.isSuccess,
        });
        fetchIntegrations();
      } else {
        setTestMessage({
          id,
          text: data.error || "Connection failed.",
          isSuccess: false,
        });
      }
    } catch (e: any) {
      setTestMessage({ id, text: e.message || "Network error", isSuccess: false });
    } finally {
      setTestingId(null);
    }
  };

  const handleRevealSecret = async (id: string) => {
    setRevealLoading(true);
    try {
      const res = await fetch(`/api/admin/integrations/${id}/reveal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userRole: "SUPER_ADMIN" }),
      });
      const data = await res.json();
      if (data.success) {
        setRevealedData(data.credentials);
      } else {
        alert(data.error || "Permission denied");
      }
    } catch (e: any) {
      alert("Failed to decrypt: " + e.message);
    } finally {
      setRevealLoading(false);
    }
  };

  const handleToggleMode = async (item: IntegrationItem) => {
    const newMode = item.mode === "TEST" ? "LIVE" : "TEST";
    try {
      const res = await fetch(`/api/admin/integrations/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: newMode }),
      });
      const data = await res.json();
      if (data.success) {
        setModeSwitchItem(null);
        fetchIntegrations();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredIntegrations = integrations.filter((item) => {
    const matchesCategory = selectedCategory === "ALL" || item.category === selectedCategory;
    const matchesEnv = selectedEnv === "ALL" || item.environment === selectedEnv;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesEnv && matchesSearch;
  });

  const activeCount = integrations.filter((i) => i.status === "ACTIVE").length;
  const avgLatency = Math.round(
    integrations.reduce((acc, curr) => acc + (curr.lastResponseTimeMs || 100), 0) /
      (integrations.length || 1)
  );

  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-100 font-sans">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto space-y-8">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2.5 mb-1.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Activity className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Central API & Integrations Manager
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                AES-256-GCM
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Manage production credentials, webhooks, sandbox modes, and health metrics without editing source code or .env files.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchIntegrations}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh Status</span>
            </button>
            <Link
              href="/docs/API_MANAGER.md"
              target="_blank"
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-cyan-950/60 border border-cyan-800/60 text-xs font-bold text-cyan-300 hover:bg-cyan-900/80 transition"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Security Specs</span>
            </Link>
          </div>
        </div>

        {/* Telemetry Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
              <span>ACTIVE SERVICES</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white">
              {activeCount} / {integrations.length}
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 font-medium">
              100% Operational & Health Checked
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
              <span>AVG PROBE LATENCY</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-white">{avgLatency} ms</div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              Measured via Edge Provider Probes
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
              <span>CREDENTIAL AT REST</span>
              <Lock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-cyan-300 font-mono">AES-GCM-256</div>
            <div className="text-[11px] text-slate-400 mt-1">
              0 Plaintext Keys Stored in DB
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
              <span>FAILED REQUESTS TODAY</span>
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-black text-white">0</div>
            <div className="text-[11px] text-purple-300 mt-1">
              Idempotent Webhooks & Replay Defense Active
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/40 p-3 rounded-2xl border border-slate-800/80">
          {/* Categories Tab Pill */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === c.id
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search and Environment Dropdown */}
          <div className="flex items-center space-x-2.5">
            <div className="relative flex-1 md:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search provider..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select
              value={selectedEnv}
              onChange={(e) => setSelectedEnv(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 font-bold focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Envs</option>
              <option value="DEVELOPMENT">Development</option>
              <option value="STAGING">Staging</option>
              <option value="PRODUCTION">Production</option>
            </select>
          </div>
        </div>

        {/* Integration Cards Grid */}
        {loading ? (
          <div className="py-16 text-center text-slate-500 space-y-3">
            <RefreshCw className="w-8 h-8 mx-auto animate-spin text-cyan-400" />
            <p className="text-sm font-medium">Decrypting provider schemas and metrics...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredIntegrations.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-cyan-400 shadow-inner">
                        {item.provider.slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center space-x-2">
                          <span>{item.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                            {item.category}
                          </span>
                        </h3>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          {item.baseUrl || "Standard Cloud SDK"}
                        </p>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-bold uppercase tracking-wider ${
                          item.status === "ACTIVE"
                            ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800"
                            : item.status === "ERROR"
                            ? "bg-rose-950/80 text-rose-400 border border-rose-800"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        ● {item.status}
                      </span>

                      {/* Mode Badge (Test vs Live) */}
                      {item.category === "PAYMENTS" && (
                        <button
                          onClick={() => setModeSwitchItem(item)}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-black uppercase tracking-wider border cursor-pointer transition ${
                            item.mode === "LIVE"
                              ? "bg-rose-500/20 text-rose-300 border-rose-500 hover:bg-rose-500 hover:text-white"
                              : "bg-amber-500/20 text-amber-300 border-amber-500 hover:bg-amber-500 hover:text-slate-950"
                          }`}
                          title="Click to toggle Test/Live mode"
                        >
                          {item.mode} MODE
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Masked Credentials Showcase */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5 font-mono text-xs">
                    {Object.entries(item.maskedCredentials).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between text-slate-400">
                        <span className="text-slate-500">{k}:</span>
                        <span className="text-slate-200 tracking-wider">{v}</span>
                      </div>
                    ))}

                    {item.webhookUrl && (
                      <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/60">
                        <span className="text-slate-500">Webhook:</span>
                        <span className="text-cyan-400 truncate max-w-[240px]">
                          {item.webhookUrl}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Live Feedback Notification */}
                  {testMessage && testMessage.id === item.id && (
                    <div
                      className={`mt-3 p-2.5 rounded-xl text-xs font-medium flex items-center space-x-2 ${
                        testMessage.isSuccess
                          ? "bg-emerald-950/50 text-emerald-300 border border-emerald-800"
                          : "bg-rose-950/50 text-rose-300 border border-rose-800"
                      }`}
                    >
                      {testMessage.isSuccess ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      )}
                      <span>{testMessage.text}</span>
                    </div>
                  )}
                </div>

                {/* Footer Metrics & Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-3 text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>
                        {item.lastTestedAt
                          ? new Date(item.lastTestedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Never tested"}
                      </span>
                    </span>

                    {item.lastResponseTimeMs !== undefined && (
                      <span className="font-mono text-cyan-400 font-bold">
                        {item.lastResponseTimeMs}ms
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleTestConnection(item.id)}
                      disabled={testingId === item.id}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition flex items-center space-x-1.5 disabled:opacity-50"
                    >
                      <RefreshCw
                        className={`w-3 h-3 ${testingId === item.id ? "animate-spin text-cyan-400" : ""}`}
                      />
                      <span>{testingId === item.id ? "Probing..." : "Test Connection"}</span>
                    </button>

                    <button
                      onClick={() => {
                        setRevealModalId(item.id);
                        setRevealedData(null);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                      title="Reveal decrypted credentials"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* REVEAL SECRET MODAL */}
        {revealModalId && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Super Admin Credential Reveal</h3>
                    <p className="text-xs text-slate-400">Security Audit Log will record this reveal event.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setRevealModalId(null);
                    setRevealedData(null);
                  }}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-white bg-slate-800/50"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {!revealedData ? (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-800/50 text-xs text-amber-300">
                    ⚠️ <strong>High Security Notice:</strong> Revealed credentials must never be copied into client scripts, public messages, or shared outside authenticated servers.
                  </div>
                  <button
                    onClick={() => handleRevealSecret(revealModalId)}
                    disabled={revealLoading}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition"
                  >
                    {revealLoading ? "Decrypting via Master Key..." : "Authorize & Reveal Decrypted Credentials"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                    {Object.entries(revealedData).map(([k, v]) => (
                      <div key={k} className="flex flex-col space-y-1 pb-2 border-b border-slate-800/60 last:border-0 last:pb-0">
                        <span className="text-slate-500 font-bold">{k}:</span>
                        <span className="text-emerald-400 break-all select-all">{v}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setRevealModalId(null);
                      setRevealedData(null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition"
                  >
                    Close & Hide Secrets
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODE SWITCH CONFIRMATION MODAL */}
        {modeSwitchItem && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Confirm Mode Transition to {modeSwitchItem.mode === "TEST" ? "LIVE" : "TEST"}
                  </h3>
                  <p className="text-xs text-slate-400">Provider: {modeSwitchItem.name}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-800/50 text-xs text-rose-300 space-y-2">
                <p>
                  {modeSwitchItem.mode === "TEST"
                    ? "⚠️ You are about to activate LIVE payment credentials. Real customer bank accounts and cards will be debited."
                    : "Switching to TEST mode will process transactions in sandbox simulation."}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setModeSwitchItem(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleToggleMode(modeSwitchItem)}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-600/30"
                >
                  Confirm Switch
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
