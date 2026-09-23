"use client";

import React, { useState } from "react";
import { useMarketplace } from "@/lib/context";
import { Breadcrumbs } from "@/components/ui/StateFeedback";
import { ROUTES } from "@/lib/routes";
import { User, Check } from "lucide-react";

export default function AccountProfilePage() {
  const { user, setUser } = useMarketplace();
  const [name, setName] = useState(user?.name || "Rahul Sharma");
  const [phone, setPhone] = useState(user?.phone || "+91 98300 12345");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      setUser({ ...user, name, phone });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <Breadcrumbs items={[{ label: "Account", href: ROUTES.account.dashboard }, { label: "Profile Details" }]} />

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-subtle space-y-4">
        <h1 className="text-xl font-black text-slate-900 dark:text-white">Personal Profile & Contact</h1>

        {saved && (
          <div className="p-3 bg-green-100 text-green-800 text-xs font-bold rounded-xl flex items-center space-x-1.5">
            <Check className="w-4 h-4" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              disabled
              value={user?.email || "customer@fancyhub.in"}
              className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl px-3 py-2 text-xs text-slate-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile Phone (+91)</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
            />
          </div>

          <button
            type="submit"
            className="py-2.5 px-6 bg-fancy-blue hover:bg-blue-700 text-white font-bold rounded-xl shadow transition"
          >
            Save Profile Changes
          </button>
        </form>
      </div>
    </div>
  );
}
