"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMarketplace } from "@/lib/context";
import { ROUTES } from "@/lib/routes";
import { Store, ShieldCheck, ArrowRight, Key } from "lucide-react";

export default function VendorLoginPage() {
  const router = useRouter();
  const { loginWithGoogle, setUser, theme } = useMarketplace();
  const [email, setEmail] = useState("seller@suratsilk.in");
  const [password, setPassword] = useState("FancyVendor@2026");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const vendorUser = {
      id: "usr-v-1",
      name: "Rahul Sharma (Vendor)",
      email: email || "seller@suratsilk.in",
      role: "VENDOR" as const,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120",
      vendorId: "v-1",
      storeName: "Surat Silk Mills",
      themePreference: theme,
    };
    setUser(vendorUser);
    try {
      localStorage.setItem("fancyhub_user", JSON.stringify(vendorUser));
    } catch (e) {}
    router.push(ROUTES.vendorPortal.dashboard);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-900">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-card space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-fancy-orange text-white flex items-center justify-center mx-auto mb-2 shadow-md">
            <Store className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Vendor Portal Sign In</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage orders, payouts, stock and store analytics</p>
        </div>

        {/* Demo Credentials Box */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-3 text-xs space-y-1 text-slate-700 dark:text-slate-300">
          <div className="flex items-center justify-between font-bold text-amber-800 dark:text-amber-300">
            <span className="flex items-center space-x-1">
              <Key className="w-3.5 h-3.5" />
              <span>Demo Vendor Credentials:</span>
            </span>
            <span className="text-[10px] bg-amber-100 dark:bg-amber-900 px-2 py-0.5 rounded-full uppercase">Pre-filled</span>
          </div>
          <p className="text-[11px] font-mono">Email: <span className="font-bold">seller@suratsilk.in</span></p>
          <p className="text-[11px] font-mono">Pass: <span className="font-bold">FancyVendor@2026</span></p>
        </div>

        <button
          type="button"
          onClick={() => {
            loginWithGoogle("VENDOR");
            router.push(ROUTES.vendorPortal.dashboard);
          }}
          className="w-full py-3 px-4 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl text-xs font-bold text-slate-800 dark:text-white flex items-center justify-center space-x-3 transition shadow-subtle"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue as Vendor with Google</span>
        </button>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Registered Business Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seller@suratsilk.in"
              className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none focus:border-fancy-orange"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none focus:border-fancy-orange"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-fancy-orange hover:bg-orange-600 text-white font-bold rounded-xl shadow transition"
          >
            Access Seller Dashboard
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-700">
          Want to sell on FancyHub?{" "}
          <Link href={ROUTES.vendorPortal.register} className="text-amber-500 font-bold hover:underline">
            Register as Seller (0% Commission)
          </Link>
        </div>
      </div>
    </div>
  );
}
