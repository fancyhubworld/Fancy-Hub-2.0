"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  SystemPageKey,
  SystemPageUIConfig,
  DEFAULT_SYSTEM_PAGES_CONFIG,
} from "@/lib/system-page-config";
import {
  ShieldCheck,
  Zap,
  Lock,
  Package,
  ShoppingBag,
  Heart,
  Store,
  MapPin,
  Gift,
  UserX,
  AlertCircle,
  PackageOpen,
  ArrowRight,
} from "lucide-react";

interface SystemPageLayoutProps {
  pageKey: SystemPageKey;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  isEmpty?: boolean;
  emptyStateOverride?: {
    title?: string;
    description?: string;
    actionText?: string;
    actionLink?: string;
  };
}

export function SystemPageLayout({
  pageKey,
  children,
  title,
  subtitle,
  isEmpty = false,
  emptyStateOverride,
}: SystemPageLayoutProps) {
  const [config, setConfig] = useState<SystemPageUIConfig>(
    DEFAULT_SYSTEM_PAGES_CONFIG[pageKey] || DEFAULT_SYSTEM_PAGES_CONFIG.login
  );

  useEffect(() => {
    fetch(`/api/public/system-pages?page=${pageKey}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.page) {
          setConfig(data.page);
        }
      })
      .catch(() => {});
  }, [pageKey]);

  // Card classes helper
  const getCardClasses = () => {
    const radiusMap: Record<string, string> = {
      none: "rounded-none",
      "rounded-lg": "rounded-lg",
      "rounded-2xl": "rounded-2xl",
      "rounded-3xl": "rounded-3xl",
      pill: "rounded-full",
    };
    const shadowMap: Record<string, string> = {
      none: "shadow-none",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
      xl: "shadow-xl",
    };
    const styleMap: Record<string, string> = {
      flat: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800",
      elevated: "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800",
      glass: "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/50",
      bordered: "bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700",
    };

    const radius = radiusMap[config.cards.borderRadius] || "rounded-2xl";
    const shadow = shadowMap[config.cards.shadow] || "shadow-md";
    const style = styleMap[config.cards.style] || styleMap.elevated;

    return `${style} ${radius} ${shadow}`;
  };

  // Button classes helper
  const getButtonClasses = (variant: "primary" | "secondary" = "primary") => {
    const radiusMap: Record<string, string> = {
      "rounded-lg": "rounded-lg",
      "rounded-xl": "rounded-xl",
      "rounded-2xl": "rounded-2xl",
      pill: "rounded-full",
    };
    const radius = radiusMap[config.buttons.radius] || "rounded-xl";
    const hover = config.buttons.hoverEffect === "scale" ? "hover:scale-[1.02] active:scale-95 transition-all" : "transition";

    if (variant === "primary") {
      if (config.buttons.style === "gradient") {
        return `bg-gradient-to-r from-fancy-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold ${radius} ${hover} shadow-md`;
      }
      if (config.buttons.style === "outline") {
        return `border-2 border-fancy-blue text-fancy-blue hover:bg-fancy-blue hover:text-white font-bold ${radius} ${hover}`;
      }
      if (config.buttons.style === "soft") {
        return `bg-fancy-blue/10 hover:bg-fancy-blue/20 text-fancy-blue font-bold ${radius} ${hover}`;
      }
      return `bg-fancy-blue hover:bg-blue-600 text-white font-bold ${radius} ${hover} shadow-sm`;
    }

    return `bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold ${radius} ${hover}`;
  };

  // Spacing container helper
  const getContainerSpacing = () => {
    if (config.spacing === "compact") return "py-4 md:py-6 px-4";
    if (config.spacing === "relaxed") return "py-12 md:py-16 px-4 md:px-8";
    return "py-8 md:py-12 px-4";
  };

  const getEmptyStateIcon = (iconName: string) => {
    switch (iconName) {
      case "ShoppingBag": return <ShoppingBag className="w-12 h-12 text-fancy-blue animate-bounce" />;
      case "Heart": return <Heart className="w-12 h-12 text-red-500 animate-pulse" />;
      case "PackageOpen": return <PackageOpen className="w-12 h-12 text-amber-500" />;
      case "Store": return <Store className="w-12 h-12 text-indigo-500" />;
      case "MapPin": return <MapPin className="w-12 h-12 text-blue-500" />;
      case "Gift": return <Gift className="w-12 h-12 text-pink-500" />;
      case "UserX": return <UserX className="w-12 h-12 text-slate-400" />;
      default: return <AlertCircle className="w-12 h-12 text-fancy-blue" />;
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors"
      style={{
        fontFamily: config.typography.fontFamily,
      }}
    >
      {/* 1. HEADER BASED ON CONFIG */}
      {config.headerStyle !== "hidden" && (
        <header className={`${config.headerStyle === "sticky" ? "sticky top-0 z-40" : ""}`}>
          {config.headerStyle === "minimal" ? (
            <div className="bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between backdrop-blur-md">
              <Link href="/" className="flex items-center space-x-2">
                <span className="font-black text-lg text-fancy-blue">FancyHub.in</span>
                <span className="text-[10px] bg-fancy-blue/10 text-fancy-blue font-bold px-2 py-0.5 rounded-full">
                  Secure
                </span>
              </Link>
              <div className="flex items-center space-x-4 text-xs font-bold text-slate-500">
                <span className="flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5 text-green-500" />
                  <span>256-Bit SSL Encrypted</span>
                </span>
                <Link href="/help" className="hover:text-fancy-blue">
                  Need Help?
                </Link>
              </div>
            </div>
          ) : (
            <Navbar />
          )}
        </header>
      )}

      {/* 2. TOP NOTICE BANNER (ADMIN CONFIGURED) */}
      {config.messages?.topNotice && (
        <div className="bg-gradient-to-r from-fancy-blue to-indigo-600 text-white text-xs font-bold py-2 px-4 text-center shadow-inner flex items-center justify-center space-x-2">
          <span>{config.messages.topNotice}</span>
        </div>
      )}

      {/* 3. MAIN CONTENT WRAPPER */}
      <main className={`flex-1 flex flex-col items-center justify-center ${getContainerSpacing()} max-w-7xl mx-auto w-full`}>
        {/* Page Title & Subtitle */}
        {(title || subtitle) && (
          <div className="text-center mb-6 max-w-2xl">
            {title && (
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Empty State vs Functional Children */}
        {isEmpty ? (
          <div className={`w-full max-w-md p-8 text-center space-y-4 ${getCardClasses()}`}>
            <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-inner">
              {getEmptyStateIcon(config.emptyStates.icon)}
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {emptyStateOverride?.title || config.emptyStates.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {emptyStateOverride?.description || config.emptyStates.description}
              </p>
            </div>
            <Link
              href={emptyStateOverride?.actionLink || config.emptyStates.actionLink}
              className={`inline-flex items-center justify-center space-x-2 px-6 py-3 text-xs uppercase tracking-wider ${getButtonClasses("primary")}`}
            >
              <span>{emptyStateOverride?.actionText || config.emptyStates.actionText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            {children}
          </div>
        )}

        {/* Trust Badges Strip (Configurable) */}
        {config.messages?.showTrustBadges && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 w-full max-w-3xl flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Genuine Handcrafted Goods</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Express 24-48h Dispatch</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Lock className="w-4 h-4 text-blue-500" />
              <span>PCI-DSS SSL Verified Gateway</span>
            </div>
          </div>
        )}
      </main>

      {/* 4. FOOTER BASED ON CONFIG */}
      {config.footerStyle !== "hidden" && (
        <footer>
          {config.footerStyle === "minimal" ? (
            <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4 px-6 text-center text-xs text-slate-400">
              <p>© {new Date().getFullYear()} FancyHub.in — Authentic Indian Marketplace. All Rights Reserved.</p>
            </div>
          ) : (
            <Footer />
          )}
        </footer>
      )}
    </div>
  );
}
