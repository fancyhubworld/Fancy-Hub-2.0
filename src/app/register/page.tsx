"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMarketplace } from "@/lib/context";
import { ROUTES } from "@/lib/routes";

export default function RegisterPage() {
  const router = useRouter();
  const { loginWithGoogle, setUser, theme } = useMarketplace();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      id: `usr-${Date.now()}`,
      name: name || "Rahul Sharma",
      email: email || "customer@fancyhub.in",
      phone: phone || "+91 98300 12345",
      role: "CUSTOMER" as const,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120",
      themePreference: theme,
    };
    setUser(newUser);
    try {
      localStorage.setItem("fancyhub_user", JSON.stringify(newUser));
    } catch (err) {}
    router.push(ROUTES.auth.verifyPhone);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-card space-y-6">
        <div className="text-center space-y-1">
          <span className="text-2xl font-black text-fancy-blue">Fancy<span className="text-fancy-orange">Hub</span>.in</span>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Create Customer Account</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Join 500,000+ Indian shoppers for genuine deals</p>
        </div>

        <button
          type="button"
          onClick={() => {
            loginWithGoogle("CUSTOMER");
            router.push(ROUTES.account.dashboard);
          }}
          className="w-full py-3 px-4 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl text-xs font-bold text-slate-800 dark:text-white flex items-center justify-center space-x-3 transition shadow-subtle active:scale-98"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Sign up with Google</span>
        </button>

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-fancy-blue font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rahul@example.com"
              className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-fancy-blue font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile Number (+91) *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="98300 12345"
              className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-fancy-blue font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Set Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-fancy-blue font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-fancy-orange hover:bg-orange-600 text-white font-bold rounded-xl shadow transition"
          >
            Create Account & Get ₹500 Bonus
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-700">
          Already have an account?{" "}
          <Link href={ROUTES.auth.login} className="text-fancy-blue font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
