"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, ShoppingBag, ChevronRight, Home } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export function LoadingSpinner({ size = "md", text = "Loading FancyHub..." }: { size?: "sm" | "md" | "lg"; text?: string }) {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div
        className={`${sizeClasses[size]} rounded-full border-fancy-blue border-t-transparent animate-spin`}
      />
      {text && <p className="text-xs font-semibold text-slate-500 animate-pulse">{text}</p>}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl ${className}`} />;
}

export function EmptyState({
  title = "No Items Found",
  description = "We couldn't find what you were looking for. Try adjusting your filters or search keywords.",
  actionText = "Continue Shopping",
  actionHref = ROUTES.shop,
  icon: Icon = ShoppingBag,
}: {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 md:p-12 text-center max-w-lg mx-auto shadow-subtle my-8 space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-slate-700 text-fancy-blue flex items-center justify-center mx-auto shadow-inner">
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">{title}</h3>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">{description}</p>
      </div>
      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="inline-block py-2.5 px-6 bg-fancy-blue hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition active:scale-95"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}

export function ErrorState({
  title = "Something Went Wrong",
  message = "We encountered an unexpected error while loading this content.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-3xl p-8 text-center max-w-md mx-auto my-8 space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/60 text-red-600 flex items-center justify-center mx-auto">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <div>
        <h3 className="text-base md:text-lg font-black text-red-900 dark:text-red-200">{title}</h3>
        <p className="text-xs text-red-700 dark:text-red-300 mt-1">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-1.5 py-2 px-5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}

export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto no-scrollbar py-2">
      <Link href={ROUTES.home} className="hover:text-fancy-blue flex items-center space-x-1">
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
          {item.href ? (
            <Link href={item.href} className="hover:text-fancy-blue truncate max-w-[150px]">
              {item.label}
            </Link>
          ) : (
            <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
