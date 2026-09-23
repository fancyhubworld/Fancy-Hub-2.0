"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  Palette,
  FileText,
  Clock,
  Link2,
  Sparkles,
  Gauge,
  Layers,
  Grid,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Layout,
  Sliders,
  Image as ImageIcon,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { getWebsiteControlCenterData, WebsiteControlCenterData } from "@/lib/website-control-engine";
import { ApiIntegrationsOverviewCard } from "@/components/admin/ApiIntegrationsOverviewCard";

export default function WebsiteControlCenterPage() {
  const [data, setData] = useState<WebsiteControlCenterData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/website-control")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setData(json.data);
        } else {
          setData(getWebsiteControlCenterData());
        }
      })
      .catch(() => setData(getWebsiteControlCenterData()))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 text-xs font-mono">
        Loading Website Control Center...
      </div>
    );
  }

  const iconMap: Record<string, React.ReactNode> = {
    Layout: <Layout className="w-5 h-5 text-fancy-blue" />,
    Palette: <Palette className="w-5 h-5 text-pink-400" />,
    Sliders: <Sliders className="w-5 h-5 text-amber-400" />,
    FileText: <FileText className="w-5 h-5 text-indigo-400" />,
    Grid: <Grid className="w-5 h-5 text-purple-400" />,
    Image: <ImageIcon className="w-5 h-5 text-cyan-400" />,
    ExternalLink: <ExternalLink className="w-5 h-5 text-emerald-400" />,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-1">
            <Link href="/admin/dashboard" className="hover:text-white">Admin</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-fancy-blue font-bold">Website Control Center</span>
          </div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2.5">
            <Globe className="w-6 h-6 text-fancy-blue" />
            <span>Website Control Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Centralized operational headquarters for storefront status, real-time metrics, theme tokens, and publishing.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs transition flex items-center space-x-1.5"
          >
            <span>Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
          </Link>
          <Link
            href="/admin/visual-builder?slug=home"
            className="px-4 py-2 rounded-xl bg-fancy-blue hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition flex items-center space-x-1.5"
          >
            <Layout className="w-4 h-4" />
            <span>Edit Homepage</span>
          </Link>
        </div>
      </div>

      {/* ========================================================
          1. OPERATIONAL & METRICS CARDS (9 CARDS)
      ======================================================== */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
          <Activity className="w-4 h-4 text-fancy-blue" />
          <span>Real-Time Storefront Health & Activity</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {/* Card 1: Website Status */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400">Website Status</span>
              <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-black text-[10px] flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{data.status.websiteStatus}</span>
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-white">{data.status.uptimePercentage}%</span>
              <span className="text-xs text-slate-400 font-medium">Uptime (30d)</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 font-mono">
              Maintenance Mode: {data.status.maintenanceMode ? "ACTIVE" : "OFF"}
            </p>
          </div>

          {/* Card 2: Current Theme */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400">Current Theme</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-fancy-blue/20 text-fancy-blue font-bold text-[10px]">
                {data.theme.appearanceMode}
              </span>
            </div>
            <div>
              <span className="text-base font-black text-white block">{data.theme.name}</span>
              <div className="flex items-center space-x-2 mt-1">
                <div
                  className="w-3.5 h-3.5 rounded-full border border-white/20"
                  style={{ backgroundColor: data.theme.primaryColor }}
                />
                <span className="text-xs text-slate-400 font-mono">{data.theme.primaryColor}</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">{data.theme.fontFamily}</span>
              </div>
            </div>
            <Link
              href="/admin/theme-studio"
              className="text-[11px] text-fancy-blue hover:text-blue-400 font-bold mt-2 flex items-center space-x-1"
            >
              <span>Manage in Theme Studio</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card 3: Draft Changes */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400">Draft Changes</span>
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <FileText className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-amber-300">{data.metrics.draftChanges}</span>
              <span className="text-xs text-slate-400 font-medium">Unpublished Revisions</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Changes saved in staging without affecting live shoppers.
            </p>
          </div>

          {/* Card 4: Scheduled Changes */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400">Scheduled Changes</span>
              <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-indigo-300">{data.metrics.scheduledChanges}</span>
              <span className="text-xs text-slate-400 font-medium">Active Timers</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Diwali festive banner scheduled to auto-publish.
            </p>
          </div>

          {/* Card 5: Broken Links */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400">Broken Links</span>
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Link2 className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-emerald-400">{data.metrics.brokenLinks}</span>
              <span className="text-xs text-slate-400 font-medium">Dead Anchors</span>
            </div>
            <p className="text-[11px] text-emerald-400/90 mt-2 font-medium flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Valid Internal & External URLs</span>
            </p>
          </div>

          {/* Card 6: SEO Score */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400">SEO Score</span>
              <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <Sparkles className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-purple-300">{data.metrics.seoScore}/100</span>
              <span className="text-xs text-slate-400 font-medium">Optimized</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Automated category schemas & OpenGraph cards active.
            </p>
          </div>

          {/* Card 7: Performance */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400">Performance</span>
              <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                <Gauge className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-cyan-300">{data.metrics.performanceScore}/100</span>
              <span className="text-xs text-slate-400 font-medium">Fast Speed Index</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Lazy loaded widgets, WebP sizing & CDN cached.
            </p>
          </div>

          {/* Card 8: Active Pages */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400">Active Pages</span>
              <span className="p-2 rounded-xl bg-blue-500/20 text-fancy-blue">
                <FileText className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-white">{data.metrics.activePages}</span>
              <span className="text-xs text-slate-400 font-medium">Live Storefront Pages</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Homepage, Categories, Deals, Landing pages & Custom CMS.
            </p>
          </div>

          {/* Card 9: Active Widgets */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400">Active Widgets</span>
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Grid className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-emerald-300">{data.metrics.activeWidgets}</span>
              <span className="text-xs text-slate-400 font-medium">Rendered Instances</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Isolated error boundaries prevent full-page crashes.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. QUICK ACTIONS (7 ACTIONS)
      ======================================================== */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Quick Actions & Studio Management</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.quickActions.map((action) => (
            <Link
              key={action.id}
              href={action.route}
              target={action.isExternal ? "_blank" : undefined}
              className="p-5 bg-slate-900 border border-slate-800 rounded-3xl hover:border-fancy-blue hover:bg-slate-900/90 transition flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 group-hover:border-slate-700 transition">
                    {iconMap[action.icon] || <Layout className="w-5 h-5 text-fancy-blue" />}
                  </div>
                  {action.badge && (
                    <span className="px-2 py-0.5 rounded-lg bg-slate-950 text-[10px] font-bold text-slate-400 border border-slate-800">
                      {action.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-black text-sm text-white group-hover:text-fancy-blue transition">
                  {action.label}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {action.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-fancy-blue">
                <span>Launch Tool</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ========================================================
          3. API & INTEGRATIONS LIVE OVERVIEW WIDGET
      ======================================================== */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Central API & Gateway Integrations</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ApiIntegrationsOverviewCard />
          </div>

          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-bold mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>ENTERPRISE ENCRYPTION AT REST (AES-256-GCM)</span>
              </div>
              <h3 className="text-lg font-black text-white">Dynamic Production Secret Management</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                External credentials, payment keys, SMS sender IDs, and Google OAuth tokens are encrypted with 96-bit random IVs and authenticated tags. Super Admins can update test and live keys dynamically without server downtime or code modifications.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-xs">
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">PAYMENTS</span>
                  <span className="text-emerald-400 font-bold">Razorpay / PayU</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">COMMUNICATION</span>
                  <span className="text-cyan-400 font-bold">SMTP / MSG91</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">AI ENGINE</span>
                  <span className="text-purple-400 font-bold">Gemini 1.5 Flash</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">Zero plaintext keys exposed to customer frontend</span>
              <Link
                href="/admin/integrations"
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
              >
                Open API Manager →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
