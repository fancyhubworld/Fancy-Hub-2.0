"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Globe,
  Layout,
  FileText,
  Palette,
  Sliders,
  Grid,
  Layers,
  Sparkles,
  Image as ImageIcon,
  Menu as MenuIcon,
  Search,
  ArrowRightLeft,
  History,
  Calendar,
  Settings,
  ChevronDown,
  ChevronRight,
  Store,
  Box,
  ShoppingCart,
  Users,
  CreditCard,
  Tag,
  Truck,
  RotateCcw,
  DollarSign,
  ShieldCheck,
  Activity,
  Bell,
  MessageSquare,
  Lock,
  ExternalLink,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";

export function AdminSidebar() {
  const pathname = usePathname();
  const [websiteMenuOpen, setWebsiteMenuOpen] = useState(true);
  const [advancedWebsiteOpen, setAdvancedWebsiteOpen] = useState(false);

  const isWebsiteRoute =
    pathname.startsWith("/admin/website") ||
    pathname.startsWith("/admin/visual-builder") ||
    pathname.startsWith("/admin/pages") ||
    pathname.startsWith("/admin/theme") ||
    pathname.startsWith("/admin/header") ||
    pathname.startsWith("/admin/footer") ||
    pathname.startsWith("/admin/navigation") ||
    pathname.startsWith("/admin/widget") ||
    pathname.startsWith("/admin/reusable") ||
    pathname.startsWith("/admin/popups") ||
    pathname.startsWith("/admin/banners") ||
    pathname.startsWith("/admin/media") ||
    pathname.startsWith("/admin/menus") ||
    pathname.startsWith("/admin/seo") ||
    pathname.startsWith("/admin/redirects") ||
    pathname.startsWith("/admin/scheduled");

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col justify-between p-4 flex-shrink-0 border-r border-slate-800 h-screen sticky top-0 overflow-y-auto">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="px-2 py-2 border-b border-slate-800">
          <Link href={ROUTES.home} className="flex items-center space-x-1.5 mb-1">
            <span className="text-xl font-black text-white">
              Fancy<span className="text-fancy-orange">Hub</span>
            </span>
            <span className="text-[10px] bg-purple-600 text-white font-bold px-1.5 rounded">
              ERP 2.0
            </span>
          </Link>
          <p className="text-[11px] text-slate-400">Super Administrator Console</p>
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-4 text-xs font-semibold">
          {/* Main ERP Links */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-mono uppercase px-3 tracking-wider block">
              Core Operations
            </span>
            <Link
              href={ROUTES.admin.dashboard}
              className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition ${
                pathname === "/admin/dashboard"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>ERP Overview</span>
            </Link>

            <Link
              href={ROUTES.admin.orders}
              className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition ${
                pathname.startsWith("/admin/orders")
                  ? "bg-purple-600 text-white shadow-sm"
                  : "hover:bg-slate-900 hover:text-white"
              }`}
            >
              <ShoppingCart className="w-4 h-4 text-blue-400" />
              <span>Orders & Sales</span>
            </Link>

            <Link
              href={ROUTES.admin.products}
              className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition ${
                pathname.startsWith("/admin/products")
                  ? "bg-purple-600 text-white shadow-sm"
                  : "hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Box className="w-4 h-4 text-emerald-400" />
              <span>Products & Catalog</span>
            </Link>

            <Link
              href={ROUTES.admin.vendors}
              className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition ${
                pathname.startsWith("/admin/vendors")
                  ? "bg-purple-600 text-white shadow-sm"
                  : "hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Store className="w-4 h-4 text-amber-400" />
              <span>Vendors / Sellers</span>
            </Link>

            <Link
              href="/admin/monitoring"
              className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition ${
                pathname.startsWith("/admin/monitoring")
                  ? "bg-purple-600 text-white shadow-sm"
                  : "hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Activity className="w-4 h-4 text-pink-400" />
              <span>Observability Center</span>
            </Link>
          </div>

          {/* ========================================================
              SECTION 77: WEBSITE CUSTOMIZATION MENU HIERARCHY
          ======================================================== */}
          <div className="space-y-1">
            <button
              onClick={() => setWebsiteMenuOpen(!websiteMenuOpen)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] text-fancy-blue font-mono uppercase tracking-wider font-black hover:text-blue-400 transition"
            >
              <span className="flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>WEBSITE</span>
              </span>
              {websiteMenuOpen ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>

            {websiteMenuOpen && (
              <div className="space-y-0.5 pl-2 border-l border-slate-800 ml-3">
                {/* 1. Overview */}
                <Link
                  href="/admin/website-control"
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs transition ${
                    pathname === "/admin/website-control"
                      ? "bg-fancy-blue text-white font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Overview</span>
                </Link>

                {/* 2. Visual Builder */}
                <Link
                  href="/admin/visual-builder"
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs transition ${
                    pathname === "/admin/visual-builder"
                      ? "bg-fancy-blue text-white font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <Layout className="w-3.5 h-3.5" />
                  <span>Visual Builder</span>
                </Link>

                {/* 3. Pages */}
                <Link
                  href="/admin/pages"
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs transition ${
                    pathname === "/admin/pages"
                      ? "bg-fancy-blue text-white font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Pages</span>
                </Link>

                {/* 4. Theme Studio */}
                <Link
                  href="/admin/theme-studio"
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs transition ${
                    pathname === "/admin/theme-studio"
                      ? "bg-fancy-blue text-white font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Theme Studio</span>
                </Link>

                {/* 5. Header */}
                <Link
                  href="/admin/header-builder"
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs transition ${
                    pathname === "/admin/header-builder"
                      ? "bg-fancy-blue text-white font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Header</span>
                </Link>

                {/* 6. Footer */}
                <Link
                  href="/admin/footer-builder"
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs transition ${
                    pathname === "/admin/footer-builder"
                      ? "bg-fancy-blue text-white font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Footer</span>
                </Link>

                {/* 7. Navigation */}
                <Link
                  href="/admin/navigation"
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs transition ${
                    pathname === "/admin/navigation"
                      ? "bg-fancy-blue text-white font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <MenuIcon className="w-3.5 h-3.5" />
                  <span>Navigation</span>
                </Link>

                {/* 8. Widgets */}
                <Link
                  href="/admin/widget-marketplace"
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs transition ${
                    pathname === "/admin/widget-marketplace"
                      ? "bg-fancy-blue text-white font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Widgets</span>
                </Link>

                {/* 9. Sections */}
                <Link
                  href="/admin/reusable-blocks"
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs transition ${
                    pathname === "/admin/reusable-blocks"
                      ? "bg-fancy-blue text-white font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Sections</span>
                </Link>

                {/* 10. Popups */}
                <Link
                  href="/admin/popups"
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs transition ${
                    pathname === "/admin/popups"
                      ? "bg-fancy-blue text-white font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Popups</span>
                </Link>

                {/* 11. Banners */}
                <Link
                  href="/admin/banners"
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs transition ${
                    pathname === "/admin/banners"
                      ? "bg-fancy-blue text-white font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Banners</span>
                </Link>

                {/* 12. Media Library */}
                <Link
                  href="/admin/media"
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs transition ${
                    pathname === "/admin/media"
                      ? "bg-fancy-blue text-white font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Media Library</span>
                </Link>

                {/* 13. Menus */}
                <Link
                  href="/admin/menus"
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs transition ${
                    pathname === "/admin/menus"
                      ? "bg-fancy-blue text-white font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <MenuIcon className="w-3.5 h-3.5" />
                  <span>Menus</span>
                </Link>

                {/* 14. SEO */}
                <Link
                  href="/admin/seo"
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs transition ${
                    pathname === "/admin/seo"
                      ? "bg-fancy-blue text-white font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>SEO</span>
                </Link>

                {/* 15. Redirects */}
                <Link
                  href="/admin/redirects"
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs transition ${
                    pathname === "/admin/redirects"
                      ? "bg-fancy-blue text-white font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Redirects</span>
                </Link>

                {/* 16. Theme Versions */}
                <Link
                  href="/admin/theme-versions"
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs transition ${
                    pathname === "/admin/theme-versions"
                      ? "bg-fancy-blue text-white font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Theme Versions</span>
                </Link>

                {/* 17. Scheduled Changes */}
                <Link
                  href="/admin/scheduled-changes"
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs transition ${
                    pathname === "/admin/scheduled-changes"
                      ? "bg-fancy-blue text-white font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Scheduled Changes</span>
                </Link>

                {/* 18. Settings */}
                <Link
                  href="/admin/brand-control"
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs transition ${
                    pathname === "/admin/brand-control"
                      ? "bg-fancy-blue text-white font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Settings (Brand Lockdown)</span>
                </Link>

                {/* 19. Developer & API Integrations */}
                <Link
                  href="/admin/integrations"
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs transition ${
                    pathname.startsWith("/admin/integrations")
                      ? "bg-fancy-blue text-white font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="flex-1">API & Integrations</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold">
                    ACTIVE
                  </span>
                </Link>
              </div>
            )}
          </div>

          {/* ADVANCED WEBSITE TOOLS BONUS */}
          <div className="space-y-1">
            <button
              onClick={() => setAdvancedWebsiteOpen(!advancedWebsiteOpen)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] text-slate-400 font-mono uppercase tracking-wider font-black hover:text-slate-200 transition"
            >
              <span className="flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>ADVANCED DESIGNERS</span>
              </span>
              {advancedWebsiteOpen ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>

            {advancedWebsiteOpen && (
              <div className="space-y-0.5 pl-2 border-l border-slate-800 ml-3">
                <Link
                  href="/admin/floating-widgets"
                  className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-900"
                >
                  <span>Floating Widgets</span>
                </Link>
                <Link
                  href="/admin/category-builder"
                  className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-900"
                >
                  <span>Category Page Builder</span>
                </Link>
                <Link
                  href="/admin/product-builder"
                  className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-900"
                >
                  <span>Product Page Builder</span>
                </Link>
                <Link
                  href="/admin/checkout-designer"
                  className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-900"
                >
                  <span>Checkout Designer</span>
                </Link>
                <Link
                  href="/admin/account-designer"
                  className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-900"
                >
                  <span>Account UI Designer</span>
                </Link>
                <Link
                  href="/admin/empty-states"
                  className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-900"
                >
                  <span>Empty States Designer</span>
                </Link>
                <Link
                  href="/admin/maintenance"
                  className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-900"
                >
                  <span>Maintenance Mode</span>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Footer User Info */}
      <div className="pt-4 border-t border-slate-800 space-y-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold transition"
        >
          <span className="flex items-center space-x-2">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>Storefront Live</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
        </Link>

        <div className="flex items-center space-x-3 px-2">
          <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow">
            SA
          </div>
          <div className="flex-1 truncate">
            <span className="text-xs font-bold text-white block truncate">
              admin@fancyhub.in
            </span>
            <span className="text-[10px] text-emerald-400 block font-mono">
              ● Super Administrator
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
