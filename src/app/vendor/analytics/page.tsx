"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Sparkles,
  MapPin,
  TrendingUp,
  RotateCcw,
  Users,
  AlertTriangle,
  CheckCircle,
  Zap,
  Tag,
  DollarSign,
  Package,
  ShoppingBag,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { formatINR } from "@/lib/design-tokens";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  MOCK_STATE_SALES,
  MOCK_TOP_PINCODES,
  getVendorCohortMetrics,
  predictRestockSchedule,
  analyzePriceIntelligence,
} from "@/lib/vendor-analytics-engine";

const REVENUE_DATA = [
  { name: "Mon", sales: 42000, orders: 12 },
  { name: "Tue", sales: 68000, orders: 19 },
  { name: "Wed", sales: 54000, orders: 15 },
  { name: "Thu", sales: 89000, orders: 24 },
  { name: "Fri", sales: 112000, orders: 31 },
  { name: "Sat", sales: 145000, orders: 42 },
  { name: "Sun", sales: 168000, orders: 48 },
];

export default function VendorAnalyticsPage() {
  const cohort = getVendorCohortMetrics();
  const restockAlerts = predictRestockSchedule();

  const [selectedProductForAi, setSelectedProductForAi] = useState({
    id: "prod-banarasi-crimson",
    title: "Crimson Banarasi Pure Silk Saree",
    category: "Sarees",
    currentPrice: 4999,
  });

  const [aiPriceResult, setAiPriceResult] = useState(() =>
    analyzePriceIntelligence({
      id: "prod-banarasi-crimson",
      title: "Crimson Banarasi Pure Silk Saree",
      category: "Sarees",
      currentPrice: 4999,
    })
  );

  const [appliedPriceToast, setAppliedPriceToast] = useState<string | null>(null);

  const handleSimulateAiPrice = (prod: any) => {
    setSelectedProductForAi(prod);
    const result = analyzePriceIntelligence(prod);
    setAiPriceResult(result);
  };

  const handleApplyPrice = () => {
    setAppliedPriceToast(`Updated live selling price to ${formatINR(aiPriceResult.recommendedOptimalPrice)}!`);
    setTimeout(() => setAppliedPriceToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8 space-y-6 font-sans">
      {/* Toast */}
      {appliedPriceToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-fadeIn">
          <CheckCircle className="w-4 h-4" />
          <span>{appliedPriceToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href={ROUTES.vendorPortal.dashboard}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <span>Live Store Telemetry & AI Price Intelligence</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-black">
                LIVE
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              State-wise heatmaps, repeat customer cohort metrics, inventory restock alerts & AI pricing
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-500">Live Pincode Engine:</span>
          <span className="text-xs font-black text-blue-600 dark:text-blue-400">27,000+ PINCODES ACTIVE</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-black uppercase tracking-wider">Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{formatINR(cohort.totalRevenue)}</p>
          <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">↑ +24.8% vs last month</p>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-black uppercase tracking-wider">Repeat Customer Rate</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{cohort.repeatCustomerRate}%</p>
          <p className="text-[11px] font-bold text-purple-600 dark:text-purple-400 mt-1">315 repeat buyers this month</p>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-black uppercase tracking-wider">RTO / Return Rate</span>
            <RotateCcw className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{cohort.rtoReturnRate}%</p>
          <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">✓ Below industry avg (8.5%)</p>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-black uppercase tracking-wider">Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{cohort.cartToOrderConversion}%</p>
          <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mt-1">AOV: {formatINR(cohort.averageOrderValue)}</p>
        </div>
      </div>

      {/* Main Charts & Heatmap Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Revenue Velocity Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Sales Revenue & Order Velocity</h3>
            <span className="text-xs text-slate-400 font-bold">Past 7 Days</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" fontSize={11} stroke="#94A3B8" />
                <YAxis fontSize={11} stroke="#94A3B8" />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pan-India Geographic Sales Distribution */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Top States Heatmap</span>
            </h3>
            <span className="text-xs text-slate-400 font-bold">By GMV</span>
          </div>

          <div className="space-y-3">
            {MOCK_STATE_SALES.map((st) => (
              <div key={st.state} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-slate-800 dark:text-slate-200">{st.state}</span>
                  <span className="font-bold text-slate-500">
                    {formatINR(st.revenue)} ({st.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                    style={{ width: `${st.percentage * 2.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gemini AI Price Intelligence Simulator */}
      <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-slate-950 border border-purple-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-black uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>GEMINI AI PRICE INTELLIGENCE</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Dynamic Elasticity & Competitor Pricing Model
            </h3>
            <p className="text-xs text-purple-200 mt-1">
              AI analyzes conversion elasticity against competitors across India to optimize selling prices.
            </p>
          </div>

          {/* Product Selector */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                handleSimulateAiPrice({
                  id: "prod-banarasi-crimson",
                  title: "Crimson Banarasi Pure Silk Saree",
                  category: "Sarees",
                  currentPrice: 4999,
                })
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedProductForAi.id === "prod-banarasi-crimson"
                  ? "bg-purple-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Saree
            </button>
            <button
              onClick={() =>
                handleSimulateAiPrice({
                  id: "prod-earbuds-anc",
                  title: "FancyHub Studio ANC Earbuds",
                  category: "Electronics",
                  currentPrice: 2499,
                })
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedProductForAi.id === "prod-earbuds-anc"
                  ? "bg-purple-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              ANC Earbuds
            </button>
          </div>
        </div>

        {/* AI Analysis Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
              CURRENT SELLING PRICE
            </span>
            <p className="text-2xl font-black text-white">{formatINR(aiPriceResult.currentPrice)}</p>
            <p className="text-xs text-slate-400">Competitor Avg: {formatINR(aiPriceResult.competitorAvgPrice)}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-purple-500/40 space-y-1">
            <span className="text-[10px] font-black text-purple-300 uppercase tracking-wider block">
              AI OPTIMAL RECOMMENDED PRICE
            </span>
            <p className="text-2xl font-black text-emerald-400">{formatINR(aiPriceResult.recommendedOptimalPrice)}</p>
            <p className="text-xs text-emerald-300 font-bold">
              Projected Sales Lift: +{aiPriceResult.projectedSalesLiftPercentage}%
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                CONFIDENCE SCORE
              </span>
              <p className="text-xl font-black text-amber-400">{aiPriceResult.confidenceScore}% High Confidence</p>
            </div>

            <button
              onClick={handleApplyPrice}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase shadow-lg shadow-purple-500/30 transition"
            >
              Apply Recommended Price
            </button>
          </div>
        </div>

        {/* Rationale */}
        <div className="p-4 rounded-2xl bg-purple-900/30 border border-purple-500/20 text-xs text-purple-100 leading-relaxed">
          <span className="font-black text-white mr-1.5">AI Insights:</span>
          {aiPriceResult.rationale}
        </div>
      </div>

      {/* Predictive Restock Forecaster Table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Predictive Inventory Restock Schedule
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-bold">Run-Rate Velocity Model</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase font-black">
                <th className="pb-3">Product Name</th>
                <th className="pb-3">Current Stock</th>
                <th className="pb-3">Daily Velocity</th>
                <th className="pb-3">Days of Stock</th>
                <th className="pb-3">Recommended Reorder</th>
                <th className="pb-3">Action Deadline</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {restockAlerts.map((item) => (
                <tr key={item.productId} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition">
                  <td className="py-3.5 font-bold text-slate-900 dark:text-white">{item.title}</td>
                  <td className="py-3.5 font-mono">{item.currentStock} units</td>
                  <td className="py-3.5 font-mono">{item.dailyVelocity} units/day</td>
                  <td className="py-3.5 font-black text-slate-900 dark:text-white">{item.daysOfStockLeft} days</td>
                  <td className="py-3.5 font-black text-purple-600 dark:text-purple-400">+{item.recommendedReorderQty} units</td>
                  <td className="py-3.5 text-slate-500 font-bold">{item.reorderByDate}</td>
                  <td className="py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                        item.urgency === "CRITICAL"
                          ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                          : item.urgency === "WARNING"
                          ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      }`}
                    >
                      {item.urgency}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
