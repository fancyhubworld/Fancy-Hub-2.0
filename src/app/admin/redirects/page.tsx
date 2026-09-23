"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRightLeft,
  Plus,
  Trash2,
  CheckCircle2,
  ChevronLeft,
  ExternalLink,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Copy,
} from "lucide-react";

interface RedirectRule {
  id: string;
  sourceUrl: string;
  targetUrl: string;
  statusCode: 301 | 302;
  hits: number;
  isActive: boolean;
  notes?: string;
  createdAt: string;
}

const INITIAL_REDIRECTS: RedirectRule[] = [
  {
    id: "red-1",
    sourceUrl: "/sarees/banarasi",
    targetUrl: "/category/fashion/sarees/banarasi-silk",
    statusCode: 301,
    hits: 1420,
    isActive: true,
    notes: "Legacy category slug mapping for SEO migration",
    createdAt: "2026-08-01",
  },
  {
    id: "red-2",
    sourceUrl: "/festive-offer",
    targetUrl: "/p/diwali-mega-sale",
    statusCode: 302,
    hits: 890,
    isActive: true,
    notes: "Temporary promotional redirect",
    createdAt: "2026-08-15",
  },
  {
    id: "red-3",
    sourceUrl: "/old-artisan-stories",
    targetUrl: "/p/about-our-craft",
    statusCode: 301,
    hits: 310,
    isActive: true,
    notes: "Brand storytelling redirect",
    createdAt: "2026-08-10",
  },
];

export default function AdminRedirectsPage() {
  const [redirects, setRedirects] = useState<RedirectRule[]>(INITIAL_REDIRECTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSource, setNewSource] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newStatus, setNewStatus] = useState<301 | 302>(301);
  const [newNotes, setNewNotes] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource || !newTarget) return;

    const newRule: RedirectRule = {
      id: `red-${Date.now()}`,
      sourceUrl: newSource.startsWith("/") ? newSource : `/${newSource}`,
      targetUrl: newTarget.startsWith("/") ? newTarget : `/${newTarget}`,
      statusCode: newStatus,
      hits: 0,
      isActive: true,
      notes: newNotes,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setRedirects([newRule, ...redirects]);
    setShowAddModal(false);
    setNewSource("");
    setNewTarget("");
    setNewNotes("");
    showToast("URL Redirect rule created successfully!");
  };

  const handleDelete = (id: string) => {
    setRedirects(redirects.filter((r) => r.id !== id));
    showToast("Redirect rule deleted");
  };

  const handleToggle = (id: string) => {
    setRedirects(
      redirects.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const filtered = redirects.filter(
    (r) =>
      r.sourceUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.targetUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.notes && r.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-1">
            <Link href="/admin/website-control" className="hover:text-white">Website</Link>
            <span>/</span>
            <span className="text-fancy-blue font-bold">Redirects</span>
          </div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2.5">
            <ArrowRightLeft className="w-6 h-6 text-fancy-blue" />
            <span>URL Redirects & 301/302 Forwarding</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage permanent (301) and temporary (302) URL forwards to prevent 404 dead links and preserve SEO authority.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-fancy-blue hover:bg-blue-600 text-white font-bold text-xs shadow-lg flex items-center space-x-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Redirect Rule</span>
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold block">Total Active Rules</span>
            <span className="text-2xl font-black text-white">{redirects.filter((r) => r.isActive).length}</span>
          </div>
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold block">Total Forwarded Hits</span>
            <span className="text-2xl font-black text-fancy-blue">
              {redirects.reduce((acc, r) => acc + r.hits, 0).toLocaleString()}
            </span>
          </div>
          <div className="p-3 bg-blue-500/20 text-fancy-blue rounded-xl">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold block">SEO 301 Permanent</span>
            <span className="text-2xl font-black text-purple-400">
              {redirects.filter((r) => r.statusCode === 301).length}
            </span>
          </div>
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search source URL or destination..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-fancy-blue"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="p-4">Source URL</th>
                <th className="p-4">Target Destination</th>
                <th className="p-4">Type</th>
                <th className="p-4">Traffic Hits</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-mono font-bold text-white">
                    {rule.sourceUrl}
                    {rule.notes && (
                      <span className="block font-sans text-[11px] text-slate-400 font-normal mt-0.5">
                        {rule.notes}
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-mono text-emerald-400 flex items-center space-x-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <span>{rule.targetUrl}</span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black font-mono ${
                        rule.statusCode === 301
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {rule.statusCode} {rule.statusCode === 301 ? "PERM" : "TEMP"}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-300">
                    {rule.hits.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggle(rule.id)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                        rule.isActive
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {rule.isActive ? "ACTIVE" : "DISABLED"}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(rule.id)}
                      className="p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-black text-white flex items-center space-x-2">
              <ArrowRightLeft className="w-4 h-4 text-fancy-blue" />
              <span>Create URL Redirect</span>
            </h3>

            <form onSubmit={handleAddRedirect} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Source URL (Incoming Request)</label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="/old-page or /category/old-name"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Target Destination (Redirect To)</label>
                <input
                  type="text"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  placeholder="/new-page or /category/new-name"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">HTTP Status Code</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(Number(e.target.value) as 301 | 302)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                >
                  <option value={301}>301 Moved Permanently (Recommended for SEO)</option>
                  <option value={302}>302 Found / Temporary Redirect</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Internal Note (Optional)</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Migration from old festival landing page"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-fancy-blue hover:bg-blue-600 text-white font-black rounded-xl shadow"
                >
                  Save Redirect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
