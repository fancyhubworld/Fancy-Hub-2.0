"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  Box,
  Eye,
  Users,
  TrendingUp,
  Percent,
  CreditCard,
  Clock,
  RotateCcw,
  Sparkles,
  Plus,
  Store,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Package,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { formatINR } from "@/lib/design-tokens";
import { ROUTES } from "@/lib/routes";
import { VendorShell } from "@/components/vendor/VendorShell";

const CHART_DATA_7D = [
  { name: "Mon", grossSales: 14200, netSales: 12993, orders: 12, commission: 1207 },
  { name: "Tue", grossSales: 18800, netSales: 17202, orders: 19, commission: 1598 },
  { name: "Wed", grossSales: 15400, netSales: 14091, orders: 15, commission: 1309 },
  { name: "Thu", grossSales: 28900, netSales: 26443, orders: 24, commission: 2457 },
  { name: "Fri", grossSales: 31200, netSales: 28548, orders: 28, commission: 2652 },
  { name: "Sat", grossSales: 42400, netSales: 38796, orders: 36, commission: 3604 },
  { name: "Sun", grossSales: 48769, netSales: 44623, orders: 32, commission: 4146 },
];

const CHART_DATA_30D = [
  { name: "Week 1", grossSales: 128400, netSales: 117486, orders: 85, commission: 10914 },
  { name: "Week 2", grossSales: 154200, netSales: 141093, orders: 104, commission: 13107 },
  { name: "Week 3", grossSales: 181800, netSales: 166347, orders: 128, commission: 15453 },
  { name: "Week 4", grossSales: 248769, netSales: 227623, orders: 145, commission: 21146 },
];

const CHART_DATA_TODAY = [
  { name: "06:00", grossSales: 1200, netSales: 1098, orders: 1, commission: 102 },
  { name: "09:00", grossSales: 4800, netSales: 4392, orders: 4, commission: 408 },
  { name: "12:00", grossSales: 9500, netSales: 8692, orders: 8, commission: 808 },
  { name: "15:00", grossSales: 15200, netSales: 13908, orders: 12, commission: 1292 },
  { name: "18:00", grossSales: 22400, netSales: 20496, orders: 18, commission: 1904 },
  { name: "21:00", grossSales: 28900, netSales: 26443, orders: 24, commission: 2457 },
];

export default function VendorDashboardPage() {
  const [dateFilter, setDateFilter] = useState<"TODAY" | "7D" | "30D">("7D");

  const chartData =
    dateFilter === "TODAY"
      ? CHART_DATA_TODAY
      : dateFilter === "30D"
      ? CHART_DATA_30D
      : CHART_DATA_7D;

  const kpis = [
    { title: "Gross Sales", value: "₹1,99,669.00", growth: "+18.5%", icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Total Orders", value: "166", growth: "+14.2%", icon: ShoppingCart, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Active Products", value: "48", growth: "+4 new", icon: Box, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Store Views", value: "12,436", growth: "+28.1%", icon: Eye, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Unique Buyers", value: "142", growth: "+9.3%", icon: Users, color: "text-sky-600", bg: "bg-sky-50" },
    { title: "Conversion Rate", value: "3.84%", growth: "+0.6%", icon: TrendingUp, color: "text-teal-600", bg: "bg-teal-50" },
    { title: "Commission (8.5%)", value: "₹16,971.86", growth: "Standard", icon: Percent, color: "text-rose-600", bg: "bg-rose-50" },
    { title: "Withdrawable", value: "₹42,150.00", growth: "Ready", icon: CreditCard, color: "text-green-600", bg: "bg-green-50" },
    { title: "Pending Settlement", value: "₹12,400.00", growth: "In Transit", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Returns & RTO", value: "2.1%", growth: "-0.4%", icon: RotateCcw, color: "text-orange-600", bg: "bg-orange-50" },
    { title: "Store Rating", value: "4.9 ★", growth: "328 reviews", icon: Sparkles, color: "text-amber-500", bg: "bg-amber-50" },
  ];

  const recentOrders = [
    { id: "ord-v1", orderNo: "#FH89201-V1", customer: "Rahul Sharma", product: "FancyHub Pro Wireless ANC Earbuds", amount: 1499, status: "Completed", date: "Today, 02:40 PM" },
    { id: "ord-v2", orderNo: "#FH91844-V1", customer: "Priya Patel", product: "Pure Banarasi Silk Festive Saree", amount: 1899, status: "Processing", date: "Today, 11:15 AM" },
    { id: "ord-v3", orderNo: "#FH88102-V1", customer: "Vikram Das", product: "Custom Bio-Wash T-Shirt (M)", amount: 399, status: "Ready to Ship", date: "Yesterday" },
    { id: "ord-v4", orderNo: "#FH87930-V1", customer: "Ananya Iyer", product: "Temple Jewellery Gold Jhumka Set", amount: 2499, status: "Shipped", date: "Yesterday" },
  ];

  return (
    <VendorShell>
      <div className="p-4 md:p-8 space-y-6">
        {/* Header Banner */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">Seller Dashboard</h1>
              <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Real-time sales, order fulfillment queue, inventory health and settlement ledgers.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <Link
              href="/store/surat-silk-mills"
              target="_blank"
              className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-xs font-bold px-3.5 py-2 rounded-xl transition"
            >
              <Store className="w-4 h-4 text-fancy-blue" />
              <span>Public Store</span>
            </Link>

            <Link
              href={ROUTES.vendorPortal.withdraw}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow transition"
            >
              <CreditCard className="w-4 h-4" />
              <span>Withdrawal (₹42,150)</span>
            </Link>

            <Link
              href={ROUTES.vendorPortal.newProduct}
              className="flex items-center space-x-1.5 bg-fancy-blue hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>

        {/* Date Filter Strip */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 shadow-subtle text-xs">
          <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
            <span>Filter Metrics By Period:</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setDateFilter("TODAY")}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                dateFilter === "TODAY"
                  ? "bg-fancy-blue text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDateFilter("7D")}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                dateFilter === "7D"
                  ? "bg-fancy-blue text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setDateFilter("30D")}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                dateFilter === "30D"
                  ? "bg-fancy-blue text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              Last 30 Days
            </button>
          </div>
        </div>

        {/* 11 Complete KPI Widgets Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.title}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-subtle space-y-1.5 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate">{kpi.title}</span>
                  <div className={`p-1.5 rounded-lg ${kpi.bg} ${kpi.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
                    {kpi.value}
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                    {kpi.growth}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Multi-Series Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-base">Store Gross Sales vs Net Earnings</h3>
                <p className="text-xs text-slate-500">Gross revenue, platform commission, and net settlements</p>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <div className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span className="text-slate-600 dark:text-slate-300 font-bold">Gross</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-300 font-bold">Net Sales</span>
                </div>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" fontSize={11} stroke="#94A3B8" />
                  <YAxis fontSize={11} stroke="#94A3B8" />
                  <Tooltip />
                  <Area type="monotone" dataKey="grossSales" stroke="#1455D9" fill="#1455D9" fillOpacity={0.15} />
                  <Area type="monotone" dataKey="netSales" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Fulfillment Action List */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-card space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900 dark:text-white text-base">Fulfillment Queue</h3>
                <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                  4 Pending
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-750 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-white block">Ready to Pack</span>
                    <span className="text-slate-500 text-[11px]">2 Orders await invoice printing</span>
                  </div>
                  <Link href={ROUTES.vendorPortal.orders} className="text-fancy-blue font-bold text-xs hover:underline">
                    Pack →
                  </Link>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-750 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-white block">Pickup Pending</span>
                    <span className="text-slate-500 text-[11px]">Delhivery express scheduled for 4 PM</span>
                  </div>
                  <Link href={ROUTES.vendorPortal.orders} className="text-fancy-blue font-bold text-xs hover:underline">
                    Manifest →
                  </Link>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-750 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-white block">Low Stock Alert</span>
                    <span className="text-rose-600 font-bold text-[11px]">3 items below threshold</span>
                  </div>
                  <Link href={ROUTES.vendorPortal.products} className="text-rose-600 font-bold text-xs hover:underline">
                    Restock →
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href={ROUTES.vendorPortal.orders}
              className="w-full py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-white font-bold text-xs rounded-xl text-center block transition"
            >
              View Full Order Dispatch Pipeline
            </Link>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 dark:text-white text-base">Recent Store Orders</h3>
            <Link href={ROUTES.vendorPortal.orders} className="text-xs font-bold text-fancy-blue hover:underline">
              View All Orders ({recentOrders.length})
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase font-black">
                  <th className="pb-3 px-3">Order Number</th>
                  <th className="pb-3 px-3">Customer</th>
                  <th className="pb-3 px-3">Product Title</th>
                  <th className="pb-3 px-3">Order Value</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">{ord.orderNo}</td>
                    <td className="py-3 px-3 font-bold">{ord.customer}</td>
                    <td className="py-3 px-3 truncate max-w-[200px]">{ord.product}</td>
                    <td className="py-3 px-3 font-black text-slate-900 dark:text-white">{formatINR(ord.amount)}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                          ord.status === "Completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : ord.status === "Processing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{ord.date}</td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/vendor/orders/${ord.id}`}
                        className="text-fancy-blue hover:underline font-bold"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </VendorShell>
  );
}
