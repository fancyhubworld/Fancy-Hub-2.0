"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Box,
  ShoppingCart,
  BarChart3,
  Users,
  Sparkles,
  Tag,
  CreditCard,
  Settings,
  Store,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
  HelpCircle,
  Bell,
  LogOut,
  UserCheck,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";

interface VendorShellProps {
  children: React.ReactNode;
}

export function VendorShell({ children }: VendorShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: ROUTES.vendorPortal.dashboard, icon: LayoutDashboard },
    { label: "Products & Stock", href: ROUTES.vendorPortal.products, icon: Box },
    { label: "Orders Fulfillment", href: ROUTES.vendorPortal.orders, icon: ShoppingCart },
    { label: "Sales Analytics", href: ROUTES.vendorPortal.analytics, icon: BarChart3 },
    { label: "Store Staff & Roles", href: "/vendor/staff", icon: UserCheck },
    { label: "Buyers & Insights", href: ROUTES.vendorPortal.customers, icon: Users },
    { label: "Ratings & Reviews", href: ROUTES.vendorPortal.reviews, icon: Sparkles },
    { label: "Store Coupons", href: ROUTES.vendorPortal.coupons, icon: Tag },
    { label: "Earnings & Payouts", href: ROUTES.vendorPortal.withdraw, icon: CreditCard },
    { label: "Store Settings", href: ROUTES.vendorPortal.storeSettings, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col md:flex-row">
      {/* 1. Desktop Sidebar */}
      <aside className="w-64 bg-[#0B2A63] text-slate-200 hidden md:flex flex-col justify-between p-4 flex-shrink-0 shadow-2xl sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-6">
          <div className="px-2 py-2 border-b border-blue-900/80">
            <Link href={ROUTES.home} className="flex items-center space-x-1.5 mb-1">
              <span className="text-xl font-black text-white">Fancy<span className="text-fancy-orange">Hub</span></span>
              <span className="text-[10px] bg-fancy-orange text-white font-bold px-1.5 py-0.5 rounded">Vendor</span>
            </Link>
            <div className="flex items-center justify-between text-[11px] text-blue-200 mt-1">
              <span className="truncate font-semibold">Surat Silk Mills</span>
              <span className="inline-flex items-center text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                Active
              </span>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${
                    isActive
                      ? "bg-fancy-blue text-white shadow-sm font-bold"
                      : "hover:bg-blue-950 text-slate-300 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-blue-300"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-2 border-t border-blue-900/60 mt-2">
              <Link
                href="/store/surat-silk-mills"
                target="_blank"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-amber-300 hover:bg-blue-950 transition font-bold"
              >
                <ExternalLink className="w-4 h-4 text-amber-400" />
                <span>Preview Storefront</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* Plan / Commission Widget */}
        <div className="bg-blue-950/80 border border-blue-800/60 p-3.5 rounded-2xl text-xs space-y-2 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-blue-300 uppercase font-bold">Seller Tier</span>
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded">
              GOLD VERIFIED
            </span>
          </div>
          <p className="text-[11px] text-slate-300">Commission Rate: <strong>8.5%</strong></p>
          <p className="text-[10px] text-slate-400">Settlements: T+2 Daily Automated</p>
        </div>
      </aside>

      {/* 2. Mobile Top Navigation Header */}
      <div className="md:hidden bg-[#0B2A63] text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        <Link href={ROUTES.vendorPortal.dashboard} className="flex items-center space-x-1.5">
          <span className="text-lg font-black">Fancy<span className="text-fancy-orange">Hub</span></span>
          <span className="text-[9px] bg-fancy-orange text-white font-bold px-1.5 py-0.5 rounded">Vendor</span>
        </Link>

        <div className="flex items-center space-x-2">
          <Link
            href="/store/surat-silk-mills"
            target="_blank"
            className="p-2 rounded-xl bg-blue-900 text-amber-300 hover:bg-blue-800"
          >
            <Store className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-blue-900 text-white hover:bg-blue-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3. Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col justify-between p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-white font-black text-lg">Seller Menu</span>
                <p className="text-xs text-blue-200">Surat Silk Mills</p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold ${
                      isActive ? "bg-fancy-blue text-white" : "text-slate-300 hover:bg-slate-850"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-blue-400" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <Link
              href="/store/surat-silk-mills"
              target="_blank"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 bg-amber-500 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center space-x-2"
            >
              <Store className="w-4 h-4" />
              <span>Open Public Storefront</span>
            </Link>
          </div>
        </div>
      )}

      {/* 4. Main View Body */}
      <div className="flex-1 overflow-y-auto pb-20 md:pb-8">
        {children}
      </div>

      {/* 5. Mobile Fixed Bottom Quick Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-around z-30 shadow-2xl">
        <Link
          href={ROUTES.vendorPortal.dashboard}
          className={`flex flex-col items-center text-[10px] font-bold ${
            pathname === ROUTES.vendorPortal.dashboard ? "text-fancy-blue" : "text-slate-400"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Overview</span>
        </Link>

        <Link
          href={ROUTES.vendorPortal.products}
          className={`flex flex-col items-center text-[10px] font-bold ${
            pathname === ROUTES.vendorPortal.products ? "text-fancy-blue" : "text-slate-400"
          }`}
        >
          <Box className="w-5 h-5" />
          <span>Products</span>
        </Link>

        <Link
          href={ROUTES.vendorPortal.orders}
          className={`flex flex-col items-center text-[10px] font-bold ${
            pathname === ROUTES.vendorPortal.orders ? "text-fancy-blue" : "text-slate-400"
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Orders</span>
        </Link>

        <Link
          href={ROUTES.vendorPortal.withdraw}
          className={`flex flex-col items-center text-[10px] font-bold ${
            pathname === ROUTES.vendorPortal.withdraw ? "text-fancy-blue" : "text-slate-400"
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span>Earnings</span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center text-[10px] font-bold text-slate-400"
        >
          <Menu className="w-5 h-5" />
          <span>More</span>
        </button>
      </div>
    </div>
  );
}
