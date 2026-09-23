"use client";

import React from "react";
import { useMarketplace } from "@/lib/context";
import { Breadcrumbs } from "@/components/ui/StateFeedback";
import { ROUTES } from "@/lib/routes";
import { ThemeMode } from "@/lib/types";
import { Sun, Moon, Layers } from "lucide-react";

export default function AccountSettingsPage() {
  const { theme, setTheme } = useMarketplace();

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <Breadcrumbs items={[{ label: "Account", href: ROUTES.account.dashboard }, { label: "App Preferences" }]} />

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-subtle space-y-4">
        <h1 className="text-xl font-black text-slate-900 dark:text-white">App Appearance & Preferences</h1>

        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Choose Visual Theme</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { mode: "light" as ThemeMode, name: "Light Mode", icon: Sun, color: "text-amber-500" },
              { mode: "dark" as ThemeMode, name: "Dark Navy", icon: Moon, color: "text-blue-400" },
              { mode: "glassy" as ThemeMode, name: "Glassy (iOS)", icon: Layers, color: "text-fancy-orange" },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.mode}
                  onClick={() => setTheme(t.mode)}
                  className={`p-4 rounded-2xl border text-center transition flex flex-col items-center space-y-2 ${
                    theme === t.mode
                      ? "border-fancy-blue bg-blue-50 dark:bg-blue-950/80 font-bold"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <Icon className={`w-6 h-6 ${t.color}`} />
                  <span className="text-xs text-slate-800 dark:text-white">{t.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
