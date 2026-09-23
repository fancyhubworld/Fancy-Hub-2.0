"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Save,
  Check,
  Eye,
  Sliders,
  Smartphone,
  Monitor,
  Tag,
  Gift,
  Clock,
  LogOut,
  Mail,
  Flame,
  UserCheck,
  ShoppingCart,
  X,
} from "lucide-react";
import {
  PopupConfig,
  PopupType,
  POPUP_PRESETS,
  PopupTrigger,
  PopupDevice,
  PopupFrequency,
  PopupTargetPage,
  PopupUserType,
  PopupLoggedStatus,
} from "@/lib/popup-builder-types";

export default function AdminPopupsPage() {
  const [popups, setPopups] = useState<PopupConfig[]>([]);
  const [activePopup, setActivePopup] = useState<PopupConfig | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/admin/popups")
      .then((res) => res.json())
      .then((data) => {
        if (data.popups && data.popups.length > 0) {
          const formatted: PopupConfig[] = data.popups.map((p: any) => ({
            id: p.id,
            name: p.title,
            type: (p.type || "welcome") as PopupType,
            isActive: p.isActive ?? true,
            title: p.title,
            description: p.description,
            badgeText: p.badgeText || "SPECIAL OFFER",
            imageUrl: p.imageUrl || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
            buttonText: p.buttonText || "Claim Offer",
            buttonLink: p.buttonLink || "/shop",
            couponCode: p.couponCode || "FANCYFIRST",
            trigger: (p.triggerType?.toLowerCase() || "time_delay") as PopupTrigger,
            delaySeconds: p.delaySeconds || 3,
            scrollPercent: p.scrollPercent || 40,
            targetPage: "all",
            device: "all",
            frequency: "once_per_session",
            userType: "all",
            loggedStatus: "all",
          }));
          setPopups(formatted);
          setActivePopup(formatted[0]);
        } else {
          // Initialize from presets
          const initial: PopupConfig[] = Object.entries(POPUP_PRESETS).map(([key, p], idx) => ({
            id: `pop-${idx + 1}`,
            name: p.name || key,
            type: key as PopupType,
            isActive: idx < 2,
            title: p.title || "",
            description: p.description || "",
            badgeText: p.badgeText || "PROMO",
            imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
            buttonText: p.buttonText || "Shop Now",
            buttonLink: p.buttonLink || "/shop",
            couponCode: p.couponCode || "",
            trigger: p.trigger || "time_delay",
            delaySeconds: p.delaySeconds || 3,
            scrollPercent: p.scrollPercent || 40,
            targetPage: p.targetPage || "all",
            device: p.device || "all",
            frequency: p.frequency || "once_per_session",
            userType: p.userType || "all",
            loggedStatus: p.loggedStatus || "all",
          }));
          setPopups(initial);
          setActivePopup(initial[0]);
        }
      })
      .catch(() => {});
  }, []);

  const handleSelectPreset = (pType: PopupType) => {
    const preset = POPUP_PRESETS[pType];
    const newPopup: PopupConfig = {
      id: `pop-${Date.now()}`,
      name: preset.name || "New Popup",
      type: pType,
      isActive: true,
      title: preset.title || "",
      description: preset.description || "",
      badgeText: preset.badgeText || "OFFER",
      imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
      buttonText: preset.buttonText || "Shop Now",
      buttonLink: preset.buttonLink || "/shop",
      couponCode: preset.couponCode || "",
      trigger: preset.trigger || "time_delay",
      delaySeconds: preset.delaySeconds || 3,
      scrollPercent: preset.scrollPercent || 40,
      targetPage: preset.targetPage || "all",
      device: preset.device || "all",
      frequency: preset.frequency || "once_per_session",
      userType: preset.userType || "all",
      loggedStatus: preset.loggedStatus || "all",
    };
    setPopups([newPopup, ...popups]);
    setActivePopup(newPopup);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (activePopup) {
        await fetch("/api/admin/popups", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: activePopup.title,
            description: activePopup.description,
            badgeText: activePopup.badgeText,
            imageUrl: activePopup.imageUrl,
            buttonText: activePopup.buttonText,
            buttonLink: activePopup.buttonLink,
            couponCode: activePopup.couponCode,
            triggerType: activePopup.trigger.toUpperCase(),
            delaySeconds: activePopup.delaySeconds,
            scrollPercent: activePopup.scrollPercent,
            isActive: activePopup.isActive,
          }),
        });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (e) {
      console.error("Save popup failed:", e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* 1. Header */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 md:px-8 flex items-center justify-between z-30">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/pages"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <Gift className="w-4 h-4 text-fancy-blue" />
              <h1 className="text-sm md:text-base font-black text-white">Marketing Popup Builder</h1>
              <span className="text-[10px] bg-fancy-blue/20 text-fancy-blue font-bold px-2.5 py-0.5 rounded-full">
                7 PRESETS • SMART TRIGGERS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Exit-intent, Welcome offers, Cart abandonment & Festive popups</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPreviewModal(true)}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Test Live Popup</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 bg-gradient-to-r from-fancy-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-lg active:scale-95 transition disabled:opacity-50"
          >
            {saveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{saveSuccess ? "Published!" : isSaving ? "Saving..." : "Save Popup"}</span>
          </button>
        </div>
      </header>

      {/* 2. Main Studio Grid */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Popups List */}
        <div className="w-full lg:w-80 bg-slate-900 border-r border-slate-800 p-4 space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Active Popups</span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
              {popups.length}
            </span>
          </div>

          <div className="space-y-2">
            {popups.map((p) => (
              <div
                key={p.id}
                onClick={() => setActivePopup(p)}
                className={`p-3 rounded-2xl border cursor-pointer transition space-y-1 ${
                  activePopup?.id === p.id
                    ? "bg-slate-800 border-fancy-blue ring-1 ring-fancy-blue"
                    : "bg-slate-950 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{p.name}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      p.isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {p.isActive ? "ACTIVE" : "PAUSED"}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                  <span>Trigger: {p.trigger}</span>
                  <span>•</span>
                  <span>{p.device}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Add from 7 Presets</span>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                { id: "welcome" as PopupType, label: "Welcome Popup" },
                { id: "coupon" as PopupType, label: "Coupon Popup" },
                { id: "exit_intent" as PopupType, label: "Exit Intent" },
                { id: "newsletter" as PopupType, label: "Newsletter Popup" },
                { id: "festival_offer" as PopupType, label: "Festival Offer" },
                { id: "login_offer" as PopupType, label: "Login Offer" },
                { id: "cart_abandonment" as PopupType, label: "Cart Abandonment" },
              ].map((pst) => (
                <button
                  key={pst.id}
                  onClick={() => handleSelectPreset(pst.id)}
                  className="w-full text-left p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition flex items-center justify-between"
                >
                  <span>+ {pst.label}</span>
                  <Sparkles className="w-3 h-3 text-fancy-blue" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center/Right Customizer Form & Live Canvas */}
        {activePopup && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto">
            {/* Form Controls */}
            <div className="w-full lg:w-96 bg-slate-900/50 p-6 space-y-5 border-r border-slate-800 overflow-y-auto">
              <span className="text-xs font-black text-slate-300 block uppercase tracking-wider">
                Popup Content & Rules
              </span>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="font-bold text-white text-xs">Enable Popup Globally</span>
                <input
                  type="checkbox"
                  checked={activePopup.isActive}
                  onChange={(e) => setActivePopup({ ...activePopup, isActive: e.target.checked })}
                  className="w-4 h-4 accent-fancy-blue rounded cursor-pointer"
                />
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Headline</label>
                  <input
                    type="text"
                    value={activePopup.title}
                    onChange={(e) => setActivePopup({ ...activePopup, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={activePopup.description}
                    onChange={(e) => setActivePopup({ ...activePopup, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Coupon Code</label>
                  <input
                    type="text"
                    value={activePopup.couponCode || ""}
                    onChange={(e) => setActivePopup({ ...activePopup, couponCode: e.target.value })}
                    placeholder="e.g. FANCYFIRST"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                  />
                </div>
              </div>

              {/* Smart Triggers & Targeting Controls */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3.5">
                <span className="text-[11px] font-bold text-white block uppercase tracking-wider">
                  Triggers & Audience Targeting
                </span>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Trigger Event</label>
                  <select
                    value={activePopup.trigger}
                    onChange={(e) => setActivePopup({ ...activePopup, trigger: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-xs"
                  >
                    <option value="time_delay">Time Delay (Seconds)</option>
                    <option value="on_load">Instant On Load</option>
                    <option value="exit_intent">Exit Intent (Mouse Leaves Viewport)</option>
                    <option value="scroll_depth">Scroll Depth (%)</option>
                    <option value="inactivity">User Inactivity</option>
                  </select>
                </div>

                {activePopup.trigger === "time_delay" && (
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                      <span>Delay (Seconds)</span>
                      <span className="text-fancy-blue">{activePopup.delaySeconds}s</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={activePopup.delaySeconds}
                      onChange={(e) => setActivePopup({ ...activePopup, delaySeconds: Number(e.target.value) })}
                      className="w-full accent-fancy-blue"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Target Device</label>
                    <select
                      value={activePopup.device}
                      onChange={(e) => setActivePopup({ ...activePopup, device: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-white font-bold text-xs"
                    >
                      <option value="all">All Devices</option>
                      <option value="desktop">Desktop Only</option>
                      <option value="mobile">Mobile Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Frequency</label>
                    <select
                      value={activePopup.frequency}
                      onChange={(e) => setActivePopup({ ...activePopup, frequency: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-white font-bold text-xs"
                    >
                      <option value="once_per_session">Once Per Session</option>
                      <option value="once_per_day">Once Per Day</option>
                      <option value="always">Always Trigger</option>
                      <option value="once_per_user">Once Per User</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">User Status</label>
                    <select
                      value={activePopup.loggedStatus}
                      onChange={(e) => setActivePopup({ ...activePopup, loggedStatus: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-white font-bold text-xs"
                    >
                      <option value="all">All Users</option>
                      <option value="guest">Guest Only</option>
                      <option value="logged_in">Logged In Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Customer Type</label>
                    <select
                      value={activePopup.userType}
                      onChange={(e) => setActivePopup({ ...activePopup, userType: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-white font-bold text-xs"
                    >
                      <option value="all">All Customers</option>
                      <option value="new_customer">New Customers</option>
                      <option value="returning_customer">Returning</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Visual Popup Canvas */}
            <div className="flex-1 p-8 flex items-center justify-center bg-slate-950">
              <div className="w-full max-w-lg bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl relative">
                {/* Image Banner */}
                <div className="h-44 bg-slate-800 relative overflow-hidden">
                  <img
                    src={activePopup.imageUrl || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80"}
                    alt="Popup Banner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 bg-fancy-blue text-white font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                    {activePopup.badgeText || "SPECIAL OFFER"}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-black text-white">{activePopup.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{activePopup.description}</p>
                  </div>

                  {activePopup.couponCode && (
                    <div className="p-3 bg-slate-950 rounded-xl border border-dashed border-fancy-blue/60 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Tag className="w-4 h-4 text-fancy-blue" />
                        <span className="text-xs text-slate-300 font-bold">Coupon Code:</span>
                      </div>
                      <span className="text-xs font-mono font-black text-fancy-blue bg-fancy-blue/10 px-2 py-0.5 rounded">
                        {activePopup.couponCode}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 flex items-center space-x-3">
                    <button className="flex-1 py-3 bg-fancy-blue hover:bg-blue-600 text-white rounded-xl font-black text-xs transition shadow-lg">
                      {activePopup.buttonText}
                    </button>
                    <button className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl font-bold text-xs transition">
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Test Live Modal Dialog */}
      {showPreviewModal && activePopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/80 hover:bg-slate-950 flex items-center justify-center text-white z-10 transition"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="h-40 bg-slate-800 relative">
              <img src={activePopup.imageUrl} alt="Popup" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-black text-white">{activePopup.title}</h3>
              <p className="text-xs text-slate-300">{activePopup.description}</p>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="w-full py-3 bg-fancy-blue text-white font-black text-xs rounded-xl shadow"
              >
                {activePopup.buttonText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
