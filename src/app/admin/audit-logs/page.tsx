"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Calendar,
  Eye,
  Activity,
  UserCheck,
  AlertTriangle,
  Lock,
  RefreshCw,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

interface AuditLogEntry {
  id: string;
  adminEmail: string;
  adminName: string;
  role: string;
  action: string;
  resource: string;
  resourceId: string;
  oldValue: Record<string, any> | string | null;
  newValue: Record<string, any> | string | null;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  status: "SUCCESS" | "WARNING" | "BLOCKED";
}

const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "aud-10928",
    adminEmail: "admin@fancyhub.in",
    adminName: "Super Administrator",
    role: "SUPER_ADMIN",
    action: "THEME_PUBLISHED",
    resource: "ThemeStudio.ActiveTokens",
    resourceId: "theme-v2.0-glassy",
    oldValue: { mode: "light", primaryColor: "#1455D9", radius: "12px" },
    newValue: { mode: "glassy", primaryColor: "#1455D9", radius: "16px", blur: "24px" },
    timestamp: "2026-09-09T04:45:12Z",
    ipAddress: "103.21.124.89 (Kolkata, IN)",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    status: "SUCCESS",
  },
  {
    id: "aud-10927",
    adminEmail: "security@fancyhub.in",
    adminName: "Compliance Lead",
    role: "SECURITY_ADMIN",
    action: "API_GATEWAY_ROTATED",
    resource: "PaymentIntegration.Razorpay",
    resourceId: "int_razorpay_sandbox",
    oldValue: { keyId: "rzp_test_***4419", status: "ACTIVE" },
    newValue: { keyId: "rzp_test_***9021", status: "ACTIVE" },
    timestamp: "2026-09-09T03:12:00Z",
    ipAddress: "157.34.88.12 (Mumbai, IN)",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0",
    status: "SUCCESS",
  },
  {
    id: "aud-10926",
    adminEmail: "admin@fancyhub.in",
    adminName: "Super Administrator",
    role: "SUPER_ADMIN",
    action: "VENDOR_KYC_APPROVED",
    resource: "VendorStore.Verification",
    resourceId: "v-surat-silk-weavers",
    oldValue: { kycStatus: "UNDER_REVIEW", gstVerified: false },
    newValue: { kycStatus: "VERIFIED", gstVerified: true, badge: "Silk Mark Certified" },
    timestamp: "2026-09-08T22:15:30Z",
    ipAddress: "103.21.124.89 (Kolkata, IN)",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    status: "SUCCESS",
  },
  {
    id: "aud-10925",
    adminEmail: "finance@fancyhub.in",
    adminName: "Senior Auditor",
    role: "FINANCE_ADMIN",
    action: "COMMISSION_RATE_UPDATED",
    resource: "PlatformSettings.Commissions",
    resourceId: "cat_handlooms_silk",
    oldValue: { takeRatePercent: 12.0 },
    newValue: { takeRatePercent: 10.0 },
    timestamp: "2026-09-08T18:40:11Z",
    ipAddress: "49.36.192.45 (Bengaluru, IN)",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) Firefox/129.0",
    status: "SUCCESS",
  },
  {
    id: "aud-10924",
    adminEmail: "system-guard@fancyhub.in",
    adminName: "Automated WAF Guard",
    role: "SYSTEM",
    action: "UNAUTHORIZED_ACCESS_BLOCKED",
    resource: "AdminAuth.Session",
    resourceId: "auth_attempt_err",
    oldValue: null,
    newValue: { reason: "Invalid TOTP MFA token from blacklisted subnet", ip: "185.220.101.5" },
    timestamp: "2026-09-08T14:02:45Z",
    ipAddress: "185.220.101.5 (Tor Exit Node)",
    userAgent: "Python-urllib/3.10",
    status: "BLOCKED",
  },
];

export default function AdminAuditLogsPage() {
  const [logs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.adminEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = actionFilter === "ALL" || log.action === actionFilter;
    const matchesStatus = statusFilter === "ALL" || log.status === statusFilter;

    return matchesSearch && matchesAction && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link href={ROUTES.admin.dashboard} className="text-slate-400 hover:text-white transition">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white flex items-center space-x-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <span>Super Admin Audit & Security Logs</span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Immutable, cryptographic timestamped records of all administrative actions, configurations, and API changes.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center space-x-1.5 transition"
            >
              <Download className="w-4 h-4" />
              <span>Export Audit Trail</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by action, resource, email or IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
            >
              <option value="ALL">All Actions</option>
              <option value="THEME_PUBLISHED">THEME_PUBLISHED</option>
              <option value="API_GATEWAY_ROTATED">API_GATEWAY_ROTATED</option>
              <option value="VENDOR_KYC_APPROVED">VENDOR_KYC_APPROVED</option>
              <option value="COMMISSION_RATE_UPDATED">COMMISSION_RATE_UPDATED</option>
              <option value="UNAUTHORIZED_ACCESS_BLOCKED">UNAUTHORIZED_ACCESS_BLOCKED</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="WARNING">WARNING</option>
              <option value="BLOCKED">BLOCKED</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-700">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Admin User</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Resource Target</th>
                  <th className="p-4">Origin IP</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-700/40 transition">
                    <td className="p-4 font-mono text-[11px] text-slate-300 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-white block">{log.adminName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{log.adminEmail}</span>
                    </td>
                    <td className="p-4 font-mono font-bold text-purple-300">
                      {log.action}
                    </td>
                    <td className="p-4">
                      <span className="text-slate-200 font-medium block">{log.resource}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{log.resourceId}</span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-slate-400">
                      {log.ipAddress}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          log.status === "SUCCESS"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : log.status === "BLOCKED"
                            ? "bg-red-500/10 text-red-400 border border-red-500/30"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 rounded-lg bg-slate-700 hover:bg-purple-600 text-slate-300 hover:text-white transition"
                        title="View Full JSON Payload"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Full Details Modal */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <h3 className="font-black text-white text-sm flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span>Audit Entry #{selectedLog.id}</span>
                </h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-slate-400 hover:text-white text-xs font-bold"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block">Admin Account:</span>
                  <span className="text-white font-mono">{selectedLog.adminEmail}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Timestamp (IST):</span>
                  <span className="text-white font-mono">{selectedLog.timestamp}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">IP Address:</span>
                  <span className="text-white font-mono">{selectedLog.ipAddress}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">User Agent:</span>
                  <span className="text-white font-mono text-[11px] truncate block">{selectedLog.userAgent}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-700">
                <span className="text-xs font-bold text-slate-300 block">Previous Value (Old State):</span>
                <pre className="p-3 bg-slate-950 rounded-xl text-[11px] font-mono text-amber-300 overflow-x-auto border border-slate-800">
                  {JSON.stringify(selectedLog.oldValue, null, 2)}
                </pre>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block">Applied Value (New State):</span>
                <pre className="p-3 bg-slate-950 rounded-xl text-[11px] font-mono text-emerald-400 overflow-x-auto border border-slate-800">
                  {JSON.stringify(selectedLog.newValue, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
