"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Truck,
  Tag,
  ShieldCheck,
  TrendingDown,
  CreditCard,
  Settings,
  Check,
  CheckCircle2,
  Mail,
  Smartphone,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/StateFeedback";
import { ROUTES } from "@/lib/routes";

interface NotificationItem {
  id: string;
  category: "ORDERS" | "OFFERS" | "WALLET" | "PRICE_DROP";
  title: string;
  desc: string;
  time: string;
  read: boolean;
  link?: string;
  icon: any;
  color: string;
  bg: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "nt-1",
      category: "ORDERS",
      title: "Order #FH89201 Out for Delivery",
      desc: "Your ANC Earbuds will arrive today by 06:00 PM via Delhivery Express. Delivery agent: Manoj (+91 98765 43210).",
      time: "2 hours ago",
      read: false,
      link: "/track-order?orderId=FH89201",
      icon: Truck,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-950",
    },
    {
      id: "nt-2",
      category: "PRICE_DROP",
      title: "Price Drop Alert: Pure Banarasi Silk Saree",
      desc: "An item from your wishlist is now ₹3,999 (Flat 35% OFF). Grab it before weaver stock ends!",
      time: "4 hours ago",
      read: false,
      link: "/product/banarasi-saree",
      icon: TrendingDown,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-950",
    },
    {
      id: "nt-3",
      category: "OFFERS",
      title: "Grand Festive Dhamaka Live — Extra ₹150 OFF",
      desc: "Use coupon code FANCYFIRST at checkout on all handloom orders above ₹999.",
      time: "10 hours ago",
      read: true,
      link: "/coupons",
      icon: Tag,
      color: "text-amber-600",
      bg: "bg-amber-100 dark:bg-amber-950",
    },
    {
      id: "nt-4",
      category: "WALLET",
      title: "₹250 Cashback Credited to Fancy Wallet",
      desc: "Instant cashback for order #FH7U7AV has been added to your spendable wallet balance.",
      time: "Yesterday",
      read: true,
      link: "/account/wallet",
      icon: CreditCard,
      color: "text-emerald-600",
      bg: "bg-emerald-100 dark:bg-emerald-950",
    },
  ]);

  const [activeTab, setActiveTab] = useState<"ALL" | "ORDERS" | "OFFERS" | "WALLET" | "PRICE_DROP">("ALL");
  const [showPreferences, setShowPreferences] = useState(false);
  const [channels, setChannels] = useState({
    inApp: true,
    whatsapp: true,
    sms: true,
    email: false,
  });
  const [prefSavedToast, setPrefSavedToast] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleSavePreferences = () => {
    setPrefSavedToast(true);
    setTimeout(() => {
      setPrefSavedToast(false);
      setShowPreferences(false);
    }, 1500);
  };

  const filteredNotifications = notifications.filter(
    (n) => activeTab === "ALL" || n.category === activeTab
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Breadcrumbs items={[{ label: "Notifications" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <Bell className="w-6 h-6 text-fancy-blue" />
            <span>Notification Center</span>
            {unreadCount > 0 && (
              <span className="bg-fancy-orange text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time delivery milestones, price drops, flash sale alerts, and wallet credits.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center space-x-1.5 transition"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Channels</span>
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-3 py-2 rounded-xl bg-fancy-blue hover:bg-blue-600 text-white text-xs font-bold transition"
            >
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: "ALL", label: "All Updates" },
          { id: "ORDERS", label: "Orders & Delivery" },
          { id: "PRICE_DROP", label: "Price Drops" },
          { id: "OFFERS", label: "Deals & Coupons" },
          { id: "WALLET", label: "Wallet & Refunds" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              activeTab === tab.id
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Preferences Panel */}
      {showPreferences && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center space-x-2">
              <Settings className="w-4 h-4 text-fancy-blue" />
              <span>Notification Channel Preferences</span>
            </h3>
            <span className="text-[11px] text-slate-400">Choose how FancyHub updates you</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {[
              { key: "inApp", label: "In-App Feed", icon: Bell },
              { key: "whatsapp", label: "WhatsApp Alerts", icon: MessageSquare },
              { key: "sms", label: "SMS Texts", icon: Smartphone },
              { key: "email", label: "Email Digest", icon: Mail },
            ].map((ch) => {
              const Icon = ch.icon;
              const isChecked = (channels as any)[ch.key];
              return (
                <button
                  key={ch.key}
                  type="button"
                  onClick={() => setChannels({ ...channels, [ch.key]: !isChecked })}
                  className={`p-3 rounded-2xl border flex flex-col items-center space-y-2 text-center transition ${
                    isChecked
                      ? "border-fancy-blue bg-blue-50/80 dark:bg-blue-950/80 text-fancy-blue font-bold"
                      : "border-slate-200 dark:border-slate-700 text-slate-500"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{ch.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            {prefSavedToast ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                <Check className="w-4 h-4" />
                <span>Preferences saved successfully!</span>
              </span>
            ) : <span />}
            <button
              onClick={handleSavePreferences}
              className="px-4 py-2 rounded-xl bg-fancy-blue text-white font-bold text-xs shadow"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle space-y-4">
        <div className="divide-y divide-slate-100 dark:divide-slate-700 text-xs">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((n) => {
              const Icon = n.icon;
              return (
                <div
                  key={n.id}
                  onClick={() => handleToggleRead(n.id)}
                  className={`py-4 flex items-start space-x-3.5 cursor-pointer rounded-2xl transition px-2 ${
                    !n.read ? "bg-blue-50/50 dark:bg-blue-950/20" : "hover:bg-slate-50 dark:hover:bg-slate-750"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-2xl ${n.bg} ${n.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-xs md:text-sm text-slate-900 dark:text-white ${!n.read ? "font-black" : "font-semibold"}`}>
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {n.desc}
                    </p>
                    {n.link && (
                      <Link
                        href={n.link}
                        className="inline-block mt-1.5 text-[11px] font-bold text-fancy-blue hover:underline"
                      >
                        View Details →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Bell className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-bold">No notifications in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
