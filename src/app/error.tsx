"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("FancyHub Application Error Boundary Caught:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 text-center shadow-card space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Something Went Wrong</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            An unexpected error occurred. Please try refreshing or return to the marketplace homepage.
          </p>
        </div>

        {process.env.NODE_ENV === "development" && error?.message && (
          <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl text-left text-[11px] font-mono text-red-600 dark:text-red-400 overflow-x-auto max-h-32">
            {error.message}
          </div>
        )}

        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-4 bg-fancy-blue hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href={ROUTES.home}
            className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-white font-bold text-xs rounded-xl transition"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
