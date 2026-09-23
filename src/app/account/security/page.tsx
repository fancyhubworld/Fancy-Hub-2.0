"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/components/ui/StateFeedback";
import { ROUTES } from "@/lib/routes";
import {
  ShieldCheck,
  Smartphone,
  Lock,
  Laptop,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  Key,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";

interface SessionItem {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

export default function AccountSecurityPage() {
  const [sessions, setSessions] = useState<SessionItem[]>([
    {
      id: "sess-1",
      device: "Apple MacBook Pro 14 (macOS Sonoma)",
      browser: "Chrome 128.0",
      location: "Kolkata, West Bengal, India",
      ip: "103.21.124.89",
      lastActive: "Active Now (Current Session)",
      isCurrent: true,
    },
    {
      id: "sess-2",
      device: "Apple iPhone 15 Pro (iOS 17.6)",
      browser: "Mobile Safari / FancyHub App",
      location: "Kolkata, West Bengal, India",
      ip: "49.36.192.12",
      lastActive: "3 hours ago",
      isCurrent: false,
    },
    {
      id: "sess-3",
      device: "Windows Desktop (Work PC)",
      browser: "Microsoft Edge 127.0",
      location: "Bandra, Mumbai, India",
      ip: "157.34.88.12",
      lastActive: "2 days ago",
      isCurrent: false,
    },
  ]);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [googleLinked, setGoogleLinked] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogoutOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    showToast("Successfully logged out from all other 2 devices!");
  };

  const handleLogoutSingleSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    showToast("Session terminated successfully.");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }
    setPasswordError(null);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast("Account password updated successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Breadcrumbs items={[{ label: "Account", href: ROUTES.account.dashboard }, { label: "Security & Login Sessions" }]} />

      <div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
          <ShieldCheck className="w-6 h-6 text-emerald-500" />
          <span>Security & Login Sessions</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your account credentials, multi-factor authentication, and connected browser sessions.
        </p>
      </div>

      {toastMessage && (
        <div className="p-3.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-2xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Multi-Factor Auth & Identity */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle space-y-4">
        <h2 className="font-bold text-sm text-slate-900 dark:text-white">Authentication & Verification</h2>

        <div className="space-y-3 text-xs">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Two-Factor Authentication (SMS / WhatsApp OTP)</span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Active on registered phone +91 98300 12345</span>
              </div>
            </div>
            <button
              onClick={() => {
                setTwoFactorEnabled(!twoFactorEnabled);
                showToast(twoFactorEnabled ? "2FA disabled." : "2FA enabled with SMS OTP.");
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                twoFactorEnabled
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
              }`}
            >
              {twoFactorEnabled ? "Active (Enabled)" : "Disabled"}
            </button>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-fancy-blue flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Google Identity Login</span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Linked to customer@fancyhub.in</span>
              </div>
            </div>
            <button
              onClick={() => {
                setGoogleLinked(!googleLinked);
                showToast(googleLinked ? "Google account unlinked." : "Google account linked.");
              }}
              className="px-3 py-1.5 rounded-xl bg-blue-100 text-fancy-blue dark:bg-blue-950 dark:text-blue-300 font-bold text-xs"
            >
              {googleLinked ? "Linked" : "Connect"}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Change Password */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle space-y-4">
        <h2 className="font-bold text-sm text-slate-900 dark:text-white">Change Account Password</h2>

        {passwordError && (
          <div className="p-3 bg-red-50 text-red-600 text-xs font-medium rounded-xl flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-3 max-w-lg text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* 3. Active Login Sessions */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">Active Login Sessions ({sessions.length})</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Devices and browsers currently authenticated to your FancyHub account.
            </p>
          </div>

          {sessions.length > 1 && (
            <button
              onClick={handleLogoutOtherSessions}
              className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center space-x-1.5 transition self-start sm:self-auto border border-red-200 dark:border-red-900/50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out All Other Devices</span>
            </button>
          )}
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700 text-xs">
          {sessions.map((sess) => (
            <div key={sess.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-400">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">{sess.device}</span>
                    {sess.isCurrent && (
                      <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[9px] px-2 py-0.2 rounded-full">
                        THIS DEVICE
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {sess.browser} • {sess.location} • <span className="font-mono">{sess.ip}</span>
                  </p>
                  <span className="text-[10px] text-slate-400">{sess.lastActive}</span>
                </div>
              </div>

              {!sess.isCurrent && (
                <button
                  onClick={() => handleLogoutSingleSession(sess.id)}
                  className="font-bold text-red-500 hover:underline text-xs"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
