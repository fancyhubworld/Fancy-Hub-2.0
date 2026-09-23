"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Plus,
  Image,
  Sparkles,
  Eye,
  EyeOff,
  Trash2,
  Bell,
  Sliders,
  Check,
  X,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";

interface PopupItem {
  id: string;
  title: string;
  description: string;
  badgeText?: string;
  couponCode?: string;
  triggerType: string;
  delaySeconds: number;
  isActive: boolean;
}

interface AnnouncementItem {
  id: string;
  text: string;
  badge?: string;
  link?: string;
  bgColor: string;
  isActive: boolean;
}

export default function AdminBannersAndMarketingPage() {
  const [popups, setPopups] = useState<PopupItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showAddBar, setShowAddBar] = useState(false);

  const [newPopup, setNewPopup] = useState({
    title: "Special Diwali Festive Reward",
    description: "Sign up today and get ₹500 instant wallet credits on your first purchase!",
    badgeText: "FESTIVE BONUS",
    couponCode: "FANCYFIRST",
    triggerType: "DELAY",
    delaySeconds: 4,
    buttonText: "CLAIM ₹500 DISCOUNT",
    buttonLink: "/register",
  });

  const [newBar, setNewBar] = useState({
    text: "⚡ FREE Express Delivery across India on all prepaid UPI orders!",
    badge: "FLASH OFFER",
    link: "/deals",
    bgColor: "#1455D9",
  });

  const fetchData = async () => {
    try {
      const [pRes, aRes] = await Promise.all([
        fetch("/api/admin/popups").then((r) => r.json()),
        fetch("/api/admin/announcements").then((r) => r.json()),
      ]);
      if (pRes.popups) setPopups(pRes.popups);
      if (aRes.announcements) setAnnouncements(aRes.announcements);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTogglePopup = async (p: PopupItem) => {
    const updated = { ...p, isActive: !p.isActive };
    setPopups((prev) => prev.map((item) => (item.id === p.id ? updated : item)));
    await fetch(`/api/admin/popups/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: updated.isActive }),
    });
  };

  const handleToggleBar = async (b: AnnouncementItem) => {
    const updated = { ...b, isActive: !b.isActive };
    setAnnouncements((prev) => prev.map((item) => (item.id === b.id ? updated : item)));
    await fetch(`/api/admin/announcements/${b.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: updated.isActive }),
    });
  };

  const handleDeletePopup = async (id: string) => {
    setPopups((prev) => prev.filter((p) => p.id !== id));
    await fetch(`/api/admin/popups/${id}`, { method: "DELETE" });
  };

  const handleDeleteBar = async (id: string) => {
    setAnnouncements((prev) => prev.filter((b) => b.id !== id));
    await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
  };

  const handleCreatePopup = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/popups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPopup),
    });
    setShowAddPopup(false);
    fetchData();
  };

  const handleCreateBar = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBar),
    });
    setShowAddBar(false);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href={ROUTES.admin.dashboard} className="text-slate-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-fancy-orange" />
              <h1 className="text-xl font-black text-white">Marketing Popups & Announcement Engine</h1>
            </div>
            <p className="text-xs text-slate-400">
              Configure exit-intent modals, timed discounts, and scrolling announcement bars
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MARKETING POPUPS SECTION */}
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div>
              <h2 className="text-base font-black text-white">Promotional Modal Popups</h2>
              <p className="text-xs text-slate-400">Exit-intent & timed visitor incentive popups</p>
            </div>
            <button
              onClick={() => setShowAddPopup(true)}
              className="px-3 py-1.5 bg-fancy-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Popup</span>
            </button>
          </div>

          <div className="space-y-3">
            {popups.map((p) => (
              <div
                key={p.id}
                className="p-4 bg-slate-900 rounded-2xl border border-slate-700 flex flex-col justify-between space-y-3 text-xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{p.title}</span>
                    <span className="text-[10px] bg-slate-800 text-amber-300 font-mono font-bold px-2 py-0.5 rounded-full">
                      Trigger: {p.triggerType} ({p.delaySeconds}s)
                    </span>
                  </div>
                  <p className="text-slate-400 mt-1">{p.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="font-mono text-fancy-blue font-black">
                    Coupon: {p.couponCode || "None"}
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleTogglePopup(p)}
                      className={`px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1 ${
                        p.isActive
                          ? "bg-green-900/60 text-green-300 border border-green-700"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {p.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{p.isActive ? "Live" : "Inactive"}</span>
                    </button>
                    <button
                      onClick={() => handleDeletePopup(p.id)}
                      className="p-1 text-red-400 hover:text-red-300 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TOP ANNOUNCEMENT BARS SECTION */}
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div>
              <h2 className="text-base font-black text-white">Top Announcement Tickers</h2>
              <p className="text-xs text-slate-400">Ribbon notifications shown at top of website</p>
            </div>
            <button
              onClick={() => setShowAddBar(true)}
              className="px-3 py-1.5 bg-fancy-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Ticker</span>
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map((a) => (
              <div
                key={a.id}
                className="p-4 bg-slate-900 rounded-2xl border border-slate-700 flex flex-col justify-between space-y-3 text-xs"
              >
                <div className="flex items-start space-x-3">
                  {a.badge && (
                    <span className="bg-fancy-orange text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md uppercase flex-shrink-0">
                      {a.badge}
                    </span>
                  )}
                  <span className="text-slate-200 font-bold leading-tight">{a.text}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                  <span className="text-slate-400 font-mono">Link: {a.link || "None"}</span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleBar(a)}
                      className={`px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1 ${
                        a.isActive
                          ? "bg-green-900/60 text-green-300 border border-green-700"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {a.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{a.isActive ? "Active" : "Hidden"}</span>
                    </button>
                    <button
                      onClick={() => handleDeleteBar(a.id)}
                      className="p-1 text-red-400 hover:text-red-300 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CREATE POPUP MODAL */}
      {showAddPopup && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">Create Promotional Popup</h3>
                <p className="text-xs text-slate-400">Configure modal triggers and discount rewards</p>
              </div>
              <button
                onClick={() => setShowAddPopup(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePopup} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Headline Title</label>
                <input
                  type="text"
                  value={newPopup.title}
                  onChange={(e) => setNewPopup({ ...newPopup, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newPopup.description}
                  onChange={(e) => setNewPopup({ ...newPopup, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Coupon Code</label>
                  <input
                    type="text"
                    value={newPopup.couponCode}
                    onChange={(e) => setNewPopup({ ...newPopup, couponCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono uppercase font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Trigger Type</label>
                  <select
                    value={newPopup.triggerType}
                    onChange={(e) => setNewPopup({ ...newPopup, triggerType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  >
                    <option value="DELAY">Time Delay</option>
                    <option value="SCROLL_DEPTH">Scroll Depth</option>
                    <option value="EXIT_INTENT">Exit Intent</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddPopup(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-fancy-blue hover:bg-blue-600 text-white rounded-xl font-black shadow"
                >
                  Create Popup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE ANNOUNCEMENT MODAL */}
      {showAddBar && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">Create Announcement Ticker</h3>
                <p className="text-xs text-slate-400">Add scrolling announcement bar to top of website</p>
              </div>
              <button
                onClick={() => setShowAddBar(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBar} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Announcement Text</label>
                <input
                  type="text"
                  value={newBar.text}
                  onChange={(e) => setNewBar({ ...newBar, text: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={newBar.badge}
                    onChange={(e) => setNewBar({ ...newBar, badge: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Link Destination</label>
                  <input
                    type="text"
                    value={newBar.link}
                    onChange={(e) => setNewBar({ ...newBar, link: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddBar(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-fancy-blue hover:bg-blue-600 text-white rounded-xl font-black shadow"
                >
                  Create Ticker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
