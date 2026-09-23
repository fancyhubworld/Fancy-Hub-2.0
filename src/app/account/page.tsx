"use client";

import React from "react";
import Link from "next/link";
import {
  User,
  Package,
  Heart,
  Wallet,
  Tag,
  MapPin,
  RotateCcw,
  Shield,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useMarketplace } from "@/lib/context";
import { MOCK_USER_ORDERS } from "@/data/mock-catalog";
import { formatINR } from "@/lib/design-tokens";

export default function AccountDashboardPage() {
  const { user, wishlist } = useMarketplace();

  const accountCards = [
    { title: "My Orders & Returns", count: `${MOCK_USER_ORDERS.length} Orders`, desc: "Track shipments, invoices & initiate return", href: "/account/orders", icon: Package, color: "text-fancy-blue", bg: "bg-blue-50" },
    { title: "Fancy Wallet & Credits", count: "₹750.00", desc: "Instant refund balance & promotional credits", href: "/account/wallet", icon: Wallet, color: "text-green-700", bg: "bg-green-50" },
    { title: "Saved Wishlist", count: `${wishlist.length} Items`, desc: "Your saved products & stock notifications", href: "/account/wishlist", icon: Heart, color: "text-red-600", bg: "bg-red-50" },
    { title: "Coupons & Vouchers", count: "3 Active", desc: "Special discounts for Indian shoppers", href: "/account/coupons", icon: Tag, color: "text-fancy-orange", bg: "bg-orange-50" },
    { title: "Delivery Addresses", count: "1 Saved", desc: "Manage home & office delivery addresses", href: "/account/addresses", icon: MapPin, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Returns & Exchanges", count: "0 Active", desc: "Doorstep return requests and status", href: "/account/returns", icon: RotateCcw, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-[#0B2A63] to-blue-900 text-white rounded-3xl p-6 md:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-white text-2xl font-black">
            {user?.name ? user.name.charAt(0) : "R"}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl md:text-2xl font-black">Hello, {user?.name || "Rahul Sharma"} 👋</h1>
              <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                VIP Gold
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-0.5">{user?.email || "customer@fancyhub.in"} • +91 98300 12345</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/vendor/dashboard"
            className="px-4 py-2.5 bg-fancy-orange hover:bg-orange-600 text-white text-xs font-black rounded-xl shadow transition flex items-center space-x-1.5"
          >
            <span>Seller Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Grid of Navigation Hub Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {accountCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="bg-white border border-slate-200 hover:border-fancy-blue rounded-3xl p-5 shadow-subtle hover:shadow-card transition duration-200 flex flex-col justify-between space-y-4 group"
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center group-hover:scale-110 transition duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-xl">
                  {card.count}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-fancy-blue transition">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{card.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders Snapshot */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-black text-slate-900 text-base">Recent Orders</h3>
          <Link href="/account/orders" className="text-xs font-bold text-fancy-blue hover:underline">
            View All ({MOCK_USER_ORDERS.length}) →
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {MOCK_USER_ORDERS.map((ord) => (
            <div key={ord.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold">
                  <span className="text-slate-900">Order #{ord.orderNumber}</span>
                  <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.2 rounded font-black">
                    {ord.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Placed on {new Date(ord.createdAt).toLocaleDateString("en-IN")} • {ord.vendorOrders.length} Sub-Orders
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <span className="font-black text-slate-900 text-sm">{formatINR(ord.totalAmount)}</span>
                <Link
                  href={`/track-order?orderId=${ord.orderNumber}`}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-xl transition"
                >
                  Track Status
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
