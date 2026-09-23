"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Store,
  Box,
  ShoppingCart,
  Users,
  CreditCard,
  Tag,
  Truck,
  RotateCcw,
  Sliders,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Layers,
  FileText,
  FileCheck,
  ChevronRight,
  Download,
  Search,
  Sparkles,
  Layout,
  Grid,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { VENDORS_DATA, PRODUCTS_DATA } from "@/data/mock-catalog";
import { formatINR } from "@/lib/design-tokens";
import { ROUTES } from "@/lib/routes";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

const GMV_CHART_DATA = [
  { month: "Jan", gmv: 420000, orders: 1250, commissions: 42000 },
  { month: "Feb", gmv: 580000, orders: 1740, commissions: 58000 },
  { month: "Mar", gmv: 690000, orders: 2010, commissions: 69000 },
  { month: "Apr", gmv: 810000, orders: 2420, commissions: 81000 },
  { month: "May", gmv: 940000, orders: 2850, commissions: 94000 },
  { month: "Jun", gmv: 1120000, orders: 3410, commissions: 112000 },
  { month: "Jul", gmv: 1248500, orders: 3890, commissions: 124850 },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "vendors" | "payouts">("overview");

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* 1. Admin Dark Sidebar with Section 77 Website Customization Menu */}
      <AdminSidebar />

      {/* 2. Main Admin Workspace */}
      <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto">
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white">Platform ERP Admin Console</h1>
            <p className="text-xs text-slate-400">Total 5,000+ Indian Weavers & Sellers • Pan-India Logistics</p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href={ROUTES.admin.reports}
              className="flex items-center space-x-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition"
            >
              <Download className="w-4 h-4" />
              <span>Export Monthly GSTR-1</span>
            </Link>
          </div>
        </div>

        {/* 3. High Level Platform Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Gross Merchandise Value (GMV)", value: formatINR(1248500), growth: "+34.2% YoY", color: "text-green-400" },
            { title: "Net Platform Commission", value: formatINR(124850), growth: "10% Take Rate", color: "text-amber-400" },
            { title: "Active Verified Sellers", value: "486", growth: "14 Pending KYC", color: "text-blue-400" },
            { title: "Monthly Shopper Accounts", value: "524,890", growth: "+18.9% MoM", color: "text-purple-400" },
          ].map((stat) => (
            <div key={stat.title} className="bg-slate-800 border border-slate-700 rounded-3xl p-5 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-bold">{stat.title}</span>
              <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
              <span className="text-[10px] text-slate-400 font-medium">{stat.growth}</span>
            </div>
          ))}
        </div>

        {/* GMV Growth Chart */}
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-white text-base">Monthly GMV & Platform Commission Revenue (INR)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={GMV_CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: "#1E293B", borderColor: "#334155" }} />
                <Bar dataKey="gmv" fill="#1455D9" radius={[6, 6, 0, 0]} />
                <Bar dataKey="commissions" fill="#F7941D" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
