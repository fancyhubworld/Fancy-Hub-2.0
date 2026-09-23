"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { Check } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-card space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Reset Your Password</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your registered email address to receive a secure password reset link.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 bg-green-50 dark:bg-green-950/60 rounded-2xl text-xs text-green-800 dark:text-green-300 space-y-2 text-center">
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
              <Check className="w-5 h-5" />
            </div>
            <p className="font-bold">Password Reset Link Sent!</p>
            <p>Check your email inbox at <strong>{email}</strong> for instructions.</p>
            <Link href={ROUTES.auth.login} className="inline-block mt-2 font-bold text-fancy-blue underline">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none focus:border-fancy-blue font-medium"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-fancy-blue hover:bg-blue-700 text-white font-bold rounded-xl shadow transition"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
