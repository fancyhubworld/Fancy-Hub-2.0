"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Users,
  Check,
  Lock,
  Sparkles,
  Key,
  Layers,
  FileText,
  Palette,
  Megaphone,
} from "lucide-react";
import { AdminRole, AdminPermission, ROLE_PERMISSIONS, hasPermission } from "@/lib/cms-governance-types";

export default function AdminRolesPage() {
  const [selectedRole, setSelectedRole] = useState<AdminRole>("SUPER_ADMIN");

  const roles: Array<{ role: AdminRole; label: string; desc: string; icon: any; color: string }> = [
    {
      role: "SUPER_ADMIN",
      label: "Super Administrator",
      desc: "Full unrestricted platform control, critical system settings, custom script authorization and security keys.",
      icon: ShieldAlert,
      color: "#EF4444",
    },
    {
      role: "ADMIN",
      label: "Operations Administrator",
      desc: "Full builder, page, catalog, order, and marketing campaign management.",
      icon: ShieldCheck,
      color: "#1455D9",
    },
    {
      role: "DESIGNER",
      label: "Lead UI/UX Designer",
      desc: "Theme Studio tokens, typography, colors, layout styling and page templates.",
      icon: Palette,
      color: "#8B5CF6",
    },
    {
      role: "MARKETING_MANAGER",
      label: "Growth & Marketing Manager",
      desc: "Banners, coupons, popup campaigns, festive promotions and announcement bars.",
      icon: Megaphone,
      color: "#F59E0B",
    },
    {
      role: "CONTENT_MANAGER",
      label: "Content & CMS Manager",
      desc: "Static CMS pages, blogs, artisan stories, FAQs, and policy documents.",
      icon: FileText,
      color: "#10B981",
    },
  ];

  const allPermissions: Array<{ key: AdminPermission; label: string; desc: string; category: string }> = [
    { key: "THEME_MANAGE", label: "Theme Studio & Design Tokens", desc: "Modify colors, fonts, buttons, cards and glassy settings", category: "DESIGN" },
    { key: "PAGES_MANAGE", label: "Page Builder & Sections", desc: "Create, edit, duplicate and publish visual page layouts", category: "CONTENT" },
    { key: "BLOG_MANAGE", label: "Artisan Stories & Blogs", desc: "Manage weaving stories, press releases and articles", category: "CONTENT" },
    { key: "BANNERS_MANAGE", label: "Homepage & Carousel Banners", desc: "Manage hero banners, promo tiles and promotional badges", category: "MARKETING" },
    { key: "CAMPAIGNS_MANAGE", label: "Festive Campaigns & Schedules", desc: "Schedule Diwali, Eid, and Mega Sale campaign launches", category: "MARKETING" },
    { key: "POPUPS_MANAGE", label: "Marketing Popups & Offers", desc: "Build exit-intent, welcome gift and coupon popups", category: "MARKETING" },
    { key: "NAVIGATION_MANAGE", label: "Navigation Menus & Links", desc: "Reorder header, footer and mobile drawer links", category: "DESIGN" },
    { key: "CRITICAL_SETTINGS_MANAGE", label: "Critical System & Database Settings", desc: "Modify database connections, payment gateways, and GST settings", category: "SECURITY" },
    { key: "CUSTOM_JS_MANAGE", label: "Custom JavaScript & Tracking Tags", desc: "Inject third-party analytics and tracking scripts", category: "SECURITY" },
    { key: "USER_ROLES_MANAGE", label: "RBAC & Staff Team Roles", desc: "Provision and revoke administrator access permissions", category: "SECURITY" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-6 font-sans select-none">
      {/* Header */}
      <header className="h-16 bg-slate-900 border border-slate-800 rounded-3xl px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/pages"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-fancy-blue" />
              <h1 className="text-sm md:text-base font-black text-white">Role-Based Access Control (RBAC)</h1>
              <span className="text-[10px] bg-fancy-blue/20 text-fancy-blue font-bold px-2.5 py-0.5 rounded-full border border-fancy-blue/30">
                5 SYSTEM ROLES • GRANULAR POLICIES
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Strict authorization preventing unauthorized access to critical settings</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded-xl border border-emerald-500/30 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Multi-Factor 2FA Enforced</span>
          </span>
        </div>
      </header>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Roles List */}
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
          <span className="text-xs font-black text-slate-300 uppercase tracking-wider block">
            System Admin Roles
          </span>

          <div className="space-y-2.5">
            {roles.map((r) => {
              const IconComp = r.icon;
              const isSelected = selectedRole === r.role;
              return (
                <div
                  key={r.role}
                  onClick={() => setSelectedRole(r.role)}
                  className={`p-4 rounded-2xl border cursor-pointer transition space-y-1.5 ${
                    isSelected
                      ? "bg-slate-800 border-fancy-blue ring-1 ring-fancy-blue"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: r.color }}
                      >
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-white text-xs">{r.label}</span>
                    </div>

                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-black/40 text-slate-400">
                      {ROLE_PERMISSIONS[r.role].length} PERMS
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">{r.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Permission Matrix */}
        <div className="lg:col-span-2 p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-sm font-black text-white">
                Permissions for {roles.find((r) => r.role === selectedRole)?.label}
              </h2>
              <p className="text-xs text-slate-400">
                {selectedRole === "SUPER_ADMIN"
                  ? "Unrestricted platform privileges including critical infrastructure and arbitrary scripts."
                  : "Scoped access limited to specified functional domains."}
              </p>
            </div>

            {selectedRole === "SUPER_ADMIN" && (
              <span className="text-xs bg-rose-500/20 text-rose-300 font-bold px-3 py-1 rounded-xl border border-rose-500/30 flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Super Admin Exclusive</span>
              </span>
            )}
          </div>

          <div className="space-y-3">
            {allPermissions.map((perm) => {
              const allowed = hasPermission(selectedRole, perm.key);
              const isSecurity = perm.category === "SECURITY";

              return (
                <div
                  key={perm.key}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between transition ${
                    allowed
                      ? isSecurity
                        ? "bg-rose-950/20 border-rose-900/60"
                        : "bg-slate-950 border-slate-800"
                      : "bg-slate-950/40 border-slate-900 opacity-50"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-xs">{perm.label}</span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                          isSecurity
                            ? "bg-rose-500/20 text-rose-300"
                            : perm.category === "DESIGN"
                            ? "bg-purple-500/20 text-purple-300"
                            : "bg-blue-500/20 text-blue-300"
                        }`}
                      >
                        {perm.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">{perm.desc}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {allowed ? (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-xl flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>GRANTED</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-500 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-xl flex items-center space-x-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>RESTRICTED</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
