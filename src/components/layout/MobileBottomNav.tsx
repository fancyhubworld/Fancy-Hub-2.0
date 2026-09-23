"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Wallet, ShoppingCart, User } from "lucide-react";
import { useMarketplace } from "@/lib/context";
import { ROUTES } from "@/lib/routes";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { cart, theme } = useMarketplace();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { label: "Home", href: ROUTES.home, icon: Home },
    { label: "Categories", href: ROUTES.categories, icon: Grid },
    { label: "Wallet", href: ROUTES.account.wallet, icon: Wallet },
    { label: "Cart", href: ROUTES.cart, icon: ShoppingCart, count: totalCartCount },
    { label: "Account", href: ROUTES.account.dashboard, icon: User },
  ];

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 transition-all duration-200 ${
        theme === "glassy"
          ? "glass-pill mx-3 mb-2 rounded-2xl border border-white/60 dark:border-slate-700/60"
          : "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800"
      } safe-bottom`}
    >
      <div className="flex items-center justify-around py-2 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href)) ||
            (item.label === "Categories" && pathname.startsWith("/category"));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 relative py-1 text-[10px] font-bold transition ${
                isActive
                  ? "text-fancy-blue"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-fancy-orange text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="mt-0.5">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 bg-fancy-blue rounded-full absolute -bottom-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
