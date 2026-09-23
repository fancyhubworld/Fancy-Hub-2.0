"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword === confirmPassword) {
      setSuccess(true);
      setTimeout(() => router.push(ROUTES.auth.login), 2000);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-card space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Create New Password</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Set a strong new password for your account</p>
        </div>

        {success ? (
          <div className="p-4 bg-green-50 text-green-800 text-xs font-bold rounded-2xl text-center">
            Password updated successfully! Redirecting to login...
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">New Password *</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Confirm New Password *</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-fancy-blue hover:bg-blue-700 text-white font-bold rounded-xl shadow"
            >
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
