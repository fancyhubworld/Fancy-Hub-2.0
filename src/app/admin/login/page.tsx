"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMarketplace } from "@/lib/context";
import { ROUTES } from "@/lib/routes";
import { ShieldAlert, ShieldCheck, Lock, Key, ArrowRight, Server, Database, CheckCircle2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { setUser, theme } = useMarketplace();
  const [email, setEmail] = useState("admin@fancyhub.in");
  const [password, setPassword] = useState("FancyAdmin@2026");
  const [twoFactorCode, setTwoFactorCode] = useState("892145");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      if (!email.includes("@")) {
        setError("Invalid administrative email address");
        setIsLoading(false);
        return;
      }

      const adminUser = {
        id: "usr-admin-master",
        name: "Enterprise Super Admin",
        email: email || "admin@fancyhub.in",
        role: "SUPER_ADMIN" as const,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120",
        themePreference: theme,
      };

      setUser(adminUser);
      try {
        localStorage.setItem("fancyhub_user", JSON.stringify(adminUser));
      } catch (err) {}

      router.push(ROUTES.admin.dashboard);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100 selection:bg-purple-600 selection:text-white">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-800 text-purple-400 mb-1">
            <Lock className="w-6 h-6" />
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl font-black text-white">Fancy<span className="text-fancy-orange">Hub</span>.in</span>
            <span className="text-[10px] font-black uppercase tracking-wider bg-purple-900/80 text-purple-300 border border-purple-700 px-2 py-0.5 rounded-full">
              Enterprise ERP
            </span>
          </div>
          <h1 className="text-lg font-black text-white">Restricted Admin Authentication</h1>
          <p className="text-xs text-slate-400">Authorized personnel only. All access attempts are audit logged.</p>
        </div>

        {/* Demo Credentials Box */}
        <div className="bg-slate-950 border border-purple-900/60 rounded-2xl p-3.5 text-xs space-y-1.5">
          <div className="flex items-center justify-between font-bold text-purple-400">
            <span className="flex items-center space-x-1.5">
              <Key className="w-3.5 h-3.5" />
              <span>Admin ERP Demo Credentials:</span>
            </span>
            <span className="text-[9px] bg-purple-950 text-purple-300 border border-purple-800 px-1.5 py-0.5 rounded font-mono">
              PRE-FILLED
            </span>
          </div>
          <div className="font-mono text-[11px] text-slate-300 space-y-0.5">
            <p>Admin Email: <strong className="text-white">admin@fancyhub.in</strong></p>
            <p>Password: <strong className="text-white">FancyAdmin@2026</strong></p>
            <p>2FA Passcode: <strong className="text-emerald-400">892145</strong></p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-300 font-semibold flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Administrative Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@fancyhub.in"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono outline-none focus:border-purple-500 transition"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Master Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono outline-none focus:border-purple-500 transition"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">2FA Security Token / Passcode</label>
            <input
              type="text"
              required
              maxLength={6}
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              placeholder="892145"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-emerald-400 font-mono tracking-widest font-bold outline-none focus:border-purple-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 active:scale-98 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <span>Authenticating Secure Session...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Enter Admin ERP Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <Link href={ROUTES.home} className="hover:text-slate-300 transition">
            ← Return to Storefront
          </Link>
          <span className="font-mono">Security: TLS 1.3 / AES-256</span>
        </div>
      </div>
    </div>
  );
}
