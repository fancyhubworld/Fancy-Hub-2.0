"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Monitor,
  Smartphone,
  Sparkles,
  Layers,
  Sliders,
  Check,
  X,
  GripVertical,
  Truck,
  ShieldCheck,
  RotateCcw as ReturnIcon,
  Headphones,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Globe,
  CreditCard,
  Smartphone as PhoneIcon,
  ExternalLink,
  Eye,
  EyeOff,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Linkedin,
} from "lucide-react";
import {
  DEFAULT_FOOTER_CONFIG,
  FooterBuilderConfig,
  FooterColumn,
  FooterLinkItem,
  SocialIconItem,
  PaymentIconItem,
  TrustBadgeItem,
} from "@/lib/footer-builder-types";

export default function AdminFooterBuilder() {
  const [config, setConfig] = useState<FooterBuilderConfig>(DEFAULT_FOOTER_CONFIG);
  const [activeTab, setActiveTab] = useState<
    "COLUMNS" | "NEWSLETTER" | "TRUST_BADGES" | "CONTACT_INFO" | "APP_DOWNLOAD" | "SOCIAL_ICONS" | "PAYMENT_ICONS" | "COPYRIGHT"
  >("COLUMNS");
  const [selectedColumnId, setSelectedColumnId] = useState<string>("col-1");
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchFooterConfig = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/footer");
      const data = await res.json();
      if (data.success && data.footer) {
        setConfig(data.footer);
        if (data.footer.columns && data.footer.columns.length > 0) {
          setSelectedColumnId(data.footer.columns[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to load footer config", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFooterConfig();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/footer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        showToast("🚀 Footer configuration saved! Storefront updated.");
      }
    } catch (e) {
      showToast("Error saving footer");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (!confirm("Reset footer configuration, all 5 columns, links, trust badges and settings to default?")) return;
    setConfig(DEFAULT_FOOTER_CONFIG);
    setSelectedColumnId(DEFAULT_FOOTER_CONFIG.columns[0].id);
    showToast("Reset to default footer configuration");
  };

  // Column operations
  const handleAddColumn = () => {
    const newId = `col-${Date.now()}`;
    const newCol: FooterColumn = {
      id: newId,
      title: "New Column",
      sortOrder: config.columns.length,
      isActive: true,
      links: [
        { id: `l-${Date.now()}-1`, label: "Sample Link 1", url: "/help" },
        { id: `l-${Date.now()}-2`, label: "Sample Link 2", url: "/p/about" },
      ],
    };
    setConfig((prev) => ({
      ...prev,
      columns: [...prev.columns, newCol],
    }));
    setSelectedColumnId(newId);
    showToast("Added new footer column");
  };

  const handleDeleteColumn = (colId: string) => {
    if (config.columns.length <= 1) {
      alert("At least one footer column must remain.");
      return;
    }
    if (!confirm("Delete this column and all its links?")) return;
    const filtered = config.columns.filter((c) => c.id !== colId);
    setConfig((prev) => ({
      ...prev,
      columns: filtered,
    }));
    if (selectedColumnId === colId) {
      setSelectedColumnId(filtered[0]?.id || "");
    }
    showToast("Column deleted");
  };

  const handleMoveColumn = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= config.columns.length) return;

    const newColumns = [...config.columns];
    const [moved] = newColumns.splice(index, 1);
    newColumns.splice(targetIdx, 0, moved);

    const reordered = newColumns.map((col, idx) => ({ ...col, sortOrder: idx }));
    setConfig((prev) => ({ ...prev, columns: reordered }));
  };

  // Link operations inside selected column
  const handleAddLink = (colId: string) => {
    const newLink: FooterLinkItem = {
      id: `link-${Date.now()}`,
      label: "New Page Link",
      url: "/help",
    };
    setConfig((prev) => ({
      ...prev,
      columns: prev.columns.map((c) =>
        c.id === colId ? { ...c, links: [...c.links, newLink] } : c
      ),
    }));
  };

  const handleDeleteLink = (colId: string, linkId: string) => {
    setConfig((prev) => ({
      ...prev,
      columns: prev.columns.map((c) =>
        c.id === colId ? { ...c, links: c.links.filter((l) => l.id !== linkId) } : c
      ),
    }));
  };

  const selectedColumn = config.columns.find((c) => c.id === selectedColumnId);

  const isDesktop = viewport === "desktop";

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* 1. TOP BAR */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-40 flex-shrink-0 shadow-lg">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/pages"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
            title="Back to Pages Directory"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-slate-500">Website</span>
              <span className="text-[11px] text-slate-600">→</span>
              <span className="text-base font-black text-white">Footer Builder</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Live Customizer
              </span>
            </div>
          </div>
        </div>

        {/* Viewport switcher */}
        <div className="flex items-center bg-slate-800/90 p-1 rounded-2xl border border-slate-700 space-x-1 text-xs">
          <button
            onClick={() => setViewport("desktop")}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition ${
              viewport === "desktop" ? "bg-fancy-blue text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setViewport("mobile")}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition ${
              viewport === "mobile" ? "bg-fancy-blue text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold flex items-center space-x-1 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-fancy-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black flex items-center space-x-1.5 shadow-lg active:scale-95 transition disabled:opacity-40"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? "Saving..." : "Save Footer"}</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN 3-COLUMN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: FOOTER SECTIONS & COLUMN MANAGER */}
        <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full flex-shrink-0 z-20">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-black text-white flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-fancy-blue" />
              <span>Footer Blocks</span>
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {config.columns.length} Columns
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {/* Section tabs */}
            {[
              { id: "TRUST_BADGES", label: "Trust Badges & Guarantees", icon: ShieldCheck, count: config.trustBadges.length },
              { id: "NEWSLETTER", label: "Newsletter & Instant Coupon", icon: Mail, count: config.showNewsletter ? "Active" : "Off" },
              { id: "COLUMNS", label: "Footer Navigation Columns", icon: Layers, count: config.columns.length },
              { id: "CONTACT_INFO", label: "Contact Information", icon: Phone, count: config.showContactInfo ? "Active" : "Off" },
              { id: "APP_DOWNLOAD", label: "App Download Badges", icon: PhoneIcon, count: config.showAppDownload ? "Active" : "Off" },
              { id: "SOCIAL_ICONS", label: "Social Media Handles", icon: Globe, count: config.socialIcons.length },
              { id: "PAYMENT_ICONS", label: "Payment Method Icons", icon: CreditCard, count: config.paymentIcons.length },
              { id: "COPYRIGHT", label: "Copyright & Registration", icon: Sliders, count: "Legal" },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full p-2.5 rounded-2xl border text-left transition flex items-center justify-between ${
                    isSelected
                      ? "bg-slate-800 border-fancy-blue ring-1 ring-fancy-blue shadow"
                      : "bg-slate-950 border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                        isSelected ? "bg-fancy-blue text-white" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-white text-xs truncate">{tab.label}</span>
                  </div>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-md text-slate-400 font-mono">
                    {tab.count}
                  </span>
                </button>
              );
            })}

            {/* If in COLUMNS tab, show column list manager */}
            {activeTab === "COLUMNS" && (
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-black uppercase text-fancy-blue tracking-wider">
                    Columns ({config.columns.length})
                  </span>
                  <button
                    onClick={handleAddColumn}
                    className="p-1 rounded-lg bg-fancy-blue/20 hover:bg-fancy-blue/40 text-fancy-blue flex items-center space-x-1 text-[11px] font-bold px-2"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Column</span>
                  </button>
                </div>

                <div className="space-y-1">
                  {config.columns.map((col, idx) => {
                    const isSelected = selectedColumnId === col.id;
                    return (
                      <div
                        key={col.id}
                        onClick={() => setSelectedColumnId(col.id)}
                        className={`p-2 rounded-xl border text-xs transition cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-slate-800 border-fancy-blue ring-1 ring-fancy-blue"
                            : "bg-slate-900 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-white truncate">{col.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({col.links.length} links)</span>
                        </div>

                        <div className="flex items-center space-x-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleMoveColumn(idx, "up")}
                            disabled={idx === 0}
                            className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-20"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleMoveColumn(idx, "down")}
                            disabled={idx === config.columns.length - 1}
                            className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-20"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteColumn(col.id)}
                            className="p-1 rounded hover:bg-red-950 text-slate-500 hover:text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* CENTER COLUMN: LIVE FOOTER PREVIEW CANVAS */}
        <main className="flex-1 bg-slate-950/60 p-4 md:p-8 flex flex-col items-center justify-start overflow-y-auto">
          <div
            className={`transition-all duration-300 bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col ${
              !isDesktop ? "w-[375px] max-w-[375px]" : "w-full max-w-5xl"
            }`}
          >
            {/* 1. Trust Badges */}
            {config.showTrustBadges && (
              <div
                onClick={() => setActiveTab("TRUST_BADGES")}
                className={`p-6 border-b border-slate-800 bg-slate-950/40 cursor-pointer transition ${
                  activeTab === "TRUST_BADGES" ? "ring-2 ring-fancy-blue" : ""
                }`}
              >
                <div className={`grid gap-4 ${isDesktop ? "grid-cols-4" : "grid-cols-2"}`}>
                  {config.trustBadges
                    .filter((t) => t.isActive)
                    .map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-2xl bg-blue-900/50 text-fancy-blue flex items-center justify-center flex-shrink-0">
                          {item.icon === "Truck" && <Truck className="w-4 h-4" />}
                          {item.icon === "ShieldCheck" && <ShieldCheck className="w-4 h-4 text-fancy-orange" />}
                          {item.icon === "RotateCcw" && <ReturnIcon className="w-4 h-4 text-emerald-400" />}
                          {item.icon === "Headphones" && <Headphones className="w-4 h-4 text-purple-400" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-xs">{item.title}</h4>
                          <p className="text-[10px] text-slate-400 leading-tight">{item.description}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* 2. Newsletter */}
            {config.showNewsletter && (
              <div
                onClick={() => setActiveTab("NEWSLETTER")}
                className={`p-8 bg-gradient-to-r from-blue-950/80 via-slate-900 to-slate-950 border-b border-slate-800 cursor-pointer transition ${
                  activeTab === "NEWSLETTER" ? "ring-2 ring-fancy-blue" : ""
                }`}
              >
                <div className="max-w-3xl mx-auto text-center space-y-3">
                  <span className="inline-block bg-fancy-orange text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    {config.newsletter.badge}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-white">{config.newsletter.title}</h3>
                  <p className="text-xs text-slate-400 max-w-xl mx-auto">{config.newsletter.subtitle}</p>
                  <div className="flex max-w-md mx-auto space-x-2 pt-2">
                    <input
                      type="text"
                      readOnly
                      placeholder={config.newsletter.placeholder}
                      className="flex-1 bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
                    />
                    <button
                      type="button"
                      className="bg-fancy-blue hover:bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold shadow"
                    >
                      {config.newsletter.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Footer Columns */}
            <div
              onClick={() => setActiveTab("COLUMNS")}
              className={`p-8 border-b border-slate-800 cursor-pointer transition ${
                activeTab === "COLUMNS" ? "ring-2 ring-fancy-blue" : ""
              }`}
            >
              <div className={`grid gap-8 ${isDesktop ? "grid-cols-5" : "grid-cols-2"}`}>
                {config.columns.map((col) => (
                  <div
                    key={col.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab("COLUMNS");
                      setSelectedColumnId(col.id);
                    }}
                    className={`space-y-3 p-2 rounded-2xl transition ${
                      selectedColumnId === col.id && activeTab === "COLUMNS"
                        ? "bg-slate-800/80 ring-1 ring-fancy-blue"
                        : "hover:bg-slate-800/30"
                    }`}
                  >
                    <h4 className="font-black text-white text-xs tracking-wider uppercase flex items-center justify-between">
                      <span>{col.title}</span>
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-400">
                      {col.links.map((link) => (
                        <li key={link.id} className="flex items-center space-x-1.5 hover:text-white transition">
                          <span>{link.label}</span>
                          {link.badge && (
                            <span className="bg-fancy-orange/20 text-fancy-orange text-[9px] font-bold px-1.5 py-0.5 rounded">
                              {link.badge}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Contact & App Download */}
            {(config.showContactInfo || config.showAppDownload) && (
              <div className="p-6 border-b border-slate-800 bg-slate-950/30 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {config.showContactInfo && (
                  <div
                    onClick={() => setActiveTab("CONTACT_INFO")}
                    className={`space-y-2 p-3 rounded-2xl cursor-pointer transition ${
                      activeTab === "CONTACT_INFO" ? "ring-2 ring-fancy-blue bg-slate-800/40" : ""
                    }`}
                  >
                    <span className="font-bold text-white block">Marketplace Support & Headquarters</span>
                    <p className="text-slate-400 text-[11px] flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-fancy-blue flex-shrink-0" />
                      <span>{config.contactInfo.phone}</span>
                    </p>
                    <p className="text-slate-400 text-[11px] flex items-center space-x-1.5">
                      <Mail className="w-3.5 h-3.5 text-fancy-orange flex-shrink-0" />
                      <span>{config.contactInfo.email}</span>
                    </p>
                    <p className="text-slate-400 text-[11px] flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{config.contactInfo.address}</span>
                    </p>
                  </div>
                )}

                {config.showAppDownload && (
                  <div
                    onClick={() => setActiveTab("APP_DOWNLOAD")}
                    className={`space-y-2 p-3 rounded-2xl cursor-pointer transition ${
                      activeTab === "APP_DOWNLOAD" ? "ring-2 ring-fancy-blue bg-slate-800/40" : ""
                    }`}
                  >
                    <span className="font-bold text-white block">{config.appDownload.title}</span>
                    <p className="text-slate-400 text-[11px]">{config.appDownload.subtitle}</p>
                    <div className="flex items-center space-x-2 pt-1">
                      <span className="bg-slate-800 px-3 py-1 rounded-xl text-[11px] font-bold text-white border border-slate-700">
                        Google Play
                      </span>
                      <span className="bg-slate-800 px-3 py-1 rounded-xl text-[11px] font-bold text-white border border-slate-700">
                        App Store
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. Bottom Row: Social, Payment & Copyright */}
            <div className="p-6 bg-slate-950 space-y-4 text-xs">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Social Icons */}
                {config.showSocialIcons && (
                  <div
                    onClick={() => setActiveTab("SOCIAL_ICONS")}
                    className={`flex items-center space-x-2 cursor-pointer p-2 rounded-xl transition ${
                      activeTab === "SOCIAL_ICONS" ? "ring-2 ring-fancy-blue" : ""
                    }`}
                  >
                    <span className="text-[11px] text-slate-500 font-bold uppercase mr-1">Follow Us:</span>
                    {config.socialIcons
                      .filter((s) => s.isActive)
                      .map((soc) => (
                        <div key={soc.id} className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                          {soc.platform === "instagram" && <Instagram className="w-3.5 h-3.5 text-pink-400" />}
                          {soc.platform === "facebook" && <Facebook className="w-3.5 h-3.5 text-blue-400" />}
                          {soc.platform === "youtube" && <Youtube className="w-3.5 h-3.5 text-red-500" />}
                          {soc.platform === "twitter" && <Twitter className="w-3.5 h-3.5 text-sky-400" />}
                          {soc.platform === "linkedin" && <Linkedin className="w-3.5 h-3.5 text-blue-500" />}
                          {soc.platform === "whatsapp" && <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                      ))}
                  </div>
                )}

                {/* Payment Icons */}
                {config.showPaymentIcons && (
                  <div
                    onClick={() => setActiveTab("PAYMENT_ICONS")}
                    className={`flex items-center space-x-1.5 flex-wrap cursor-pointer p-2 rounded-xl transition ${
                      activeTab === "PAYMENT_ICONS" ? "ring-2 ring-fancy-blue" : ""
                    }`}
                  >
                    {config.paymentIcons
                      .filter((p) => p.isActive)
                      .map((pay) => (
                        <span key={pay.id} className="bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300 px-2 py-0.5 rounded">
                          {pay.name.split(" ")[0]}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              {/* Copyright */}
              <div
                onClick={() => setActiveTab("COPYRIGHT")}
                className={`pt-4 border-t border-slate-800 text-center space-y-1 cursor-pointer p-2 rounded-xl transition ${
                  activeTab === "COPYRIGHT" ? "ring-2 ring-fancy-blue" : ""
                }`}
              >
                <p className="text-slate-400 text-[11px]">{config.copyrightText}</p>
                <p className="text-slate-600 text-[10px]">{config.legalNotice}</p>
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT COLUMN: INSPECTOR */}
        <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full flex-shrink-0 z-20 overflow-y-auto p-4 space-y-4 text-xs">
          {/* TAB 1: COLUMNS & LINKS */}
          {activeTab === "COLUMNS" && selectedColumn && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] text-fancy-blue font-mono font-bold uppercase">Column Inspector</span>
                <h3 className="font-black text-white text-sm">Editing {selectedColumn.title}</h3>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 text-[11px]">Column Title</label>
                <input
                  type="text"
                  value={selectedColumn.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setConfig((prev) => ({
                      ...prev,
                      columns: prev.columns.map((c) =>
                        c.id === selectedColumn.id ? { ...c, title: val } : c
                      ),
                    }));
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold text-xs"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300 text-[11px]">Column Links ({selectedColumn.links.length})</span>
                  <button
                    onClick={() => handleAddLink(selectedColumn.id)}
                    className="text-[11px] text-fancy-blue hover:underline font-bold flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Link</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {selectedColumn.links.map((link) => (
                    <div key={link.id} className="p-2 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => {
                            const val = e.target.value;
                            setConfig((prev) => ({
                              ...prev,
                              columns: prev.columns.map((c) =>
                                c.id === selectedColumn.id
                                  ? {
                                      ...c,
                                      links: c.links.map((l) => (l.id === link.id ? { ...l, label: val } : l)),
                                    }
                                  : c
                              ),
                            }));
                          }}
                          placeholder="Link Label"
                          className="font-bold text-white bg-transparent outline-none text-xs flex-1"
                        />
                        <button
                          onClick={() => handleDeleteLink(selectedColumn.id, link.id)}
                          className="text-slate-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => {
                            const val = e.target.value;
                            setConfig((prev) => ({
                              ...prev,
                              columns: prev.columns.map((c) =>
                                c.id === selectedColumn.id
                                  ? {
                                      ...c,
                                      links: c.links.map((l) => (l.id === link.id ? { ...l, url: val } : l)),
                                    }
                                  : c
                              ),
                            }));
                          }}
                          placeholder="URL (e.g. /help)"
                          className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-300 font-mono"
                        />
                        <input
                          type="text"
                          value={link.badge || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setConfig((prev) => ({
                              ...prev,
                              columns: prev.columns.map((c) =>
                                c.id === selectedColumn.id
                                  ? {
                                      ...c,
                                      links: c.links.map((l) => (l.id === link.id ? { ...l, badge: val } : l)),
                                    }
                                  : c
                              ),
                            }));
                          }}
                          placeholder="Badge (optional)"
                          className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-fancy-orange"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NEWSLETTER */}
          {activeTab === "NEWSLETTER" && (
            <div className="space-y-3">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] text-fancy-blue font-mono font-bold uppercase">Newsletter Module</span>
                <h3 className="font-black text-white text-sm">Subscription Box</h3>
              </div>

              <label className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-bold text-white">Show Newsletter Section</span>
                <input
                  type="checkbox"
                  checked={config.showNewsletter}
                  onChange={(e) => setConfig({ ...config, showNewsletter: e.target.checked })}
                  className="w-4 h-4 accent-fancy-blue"
                />
              </label>

              <div>
                <label className="block font-bold text-slate-300 mb-1 text-[11px]">Incentive Badge</label>
                <input
                  type="text"
                  value={config.newsletter.badge}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      newsletter: { ...config.newsletter, badge: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 text-[11px]">Headline Title</label>
                <input
                  type="text"
                  value={config.newsletter.title}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      newsletter: { ...config.newsletter, title: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 text-[11px]">Subtitle</label>
                <textarea
                  rows={3}
                  value={config.newsletter.subtitle}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      newsletter: { ...config.newsletter, subtitle: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 text-[11px]">Button Text</label>
                <input
                  type="text"
                  value={config.newsletter.buttonText}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      newsletter: { ...config.newsletter, buttonText: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT INFO */}
          {activeTab === "CONTACT_INFO" && (
            <div className="space-y-3">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] text-fancy-blue font-mono font-bold uppercase">Contact Info</span>
                <h3 className="font-black text-white text-sm">Support & Office Details</h3>
              </div>

              <label className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-bold text-white">Show Contact Section</span>
                <input
                  type="checkbox"
                  checked={config.showContactInfo}
                  onChange={(e) => setConfig({ ...config, showContactInfo: e.target.checked })}
                  className="w-4 h-4 accent-fancy-blue"
                />
              </label>

              <div>
                <label className="block font-bold text-slate-300 mb-1 text-[11px]">Toll-Free Phone</label>
                <input
                  type="text"
                  value={config.contactInfo.phone}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      contactInfo: { ...config.contactInfo, phone: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 text-[11px]">Support Email</label>
                <input
                  type="text"
                  value={config.contactInfo.email}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      contactInfo: { ...config.contactInfo, email: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 text-[11px]">WhatsApp Support</label>
                <input
                  type="text"
                  value={config.contactInfo.whatsapp}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      contactInfo: { ...config.contactInfo, whatsapp: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 text-[11px]">Address</label>
                <textarea
                  rows={3}
                  value={config.contactInfo.address}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      contactInfo: { ...config.contactInfo, address: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 4: APP DOWNLOAD */}
          {activeTab === "APP_DOWNLOAD" && (
            <div className="space-y-3">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] text-fancy-blue font-mono font-bold uppercase">App Download</span>
                <h3 className="font-black text-white text-sm">Store Badges</h3>
              </div>

              <label className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-bold text-white">Show App Download Block</span>
                <input
                  type="checkbox"
                  checked={config.showAppDownload}
                  onChange={(e) => setConfig({ ...config, showAppDownload: e.target.checked })}
                  className="w-4 h-4 accent-fancy-blue"
                />
              </label>

              <div>
                <label className="block font-bold text-slate-300 mb-1 text-[11px]">Title</label>
                <input
                  type="text"
                  value={config.appDownload.title}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      appDownload: { ...config.appDownload, title: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 text-[11px]">Play Store URL</label>
                <input
                  type="text"
                  value={config.appDownload.playStoreUrl}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      appDownload: { ...config.appDownload, playStoreUrl: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 text-[11px]">Apple App Store URL</label>
                <input
                  type="text"
                  value={config.appDownload.appStoreUrl}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      appDownload: { ...config.appDownload, appStoreUrl: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white text-xs font-mono"
                />
              </div>
            </div>
          )}

          {/* TAB 5: COPYRIGHT & LEGAL */}
          {activeTab === "COPYRIGHT" && (
            <div className="space-y-3">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] text-fancy-blue font-mono font-bold uppercase">Legal & Compliance</span>
                <h3 className="font-black text-white text-sm">Copyright & Entity Info</h3>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 text-[11px]">Copyright Statement</label>
                <textarea
                  rows={3}
                  value={config.copyrightText}
                  onChange={(e) => setConfig({ ...config, copyrightText: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 text-[11px]">Registration & Legal Notice</label>
                <textarea
                  rows={3}
                  value={config.legalNotice}
                  onChange={(e) => setConfig({ ...config, legalNotice: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 6: SOCIAL ICONS */}
          {activeTab === "SOCIAL_ICONS" && (
            <div className="space-y-3">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] text-fancy-blue font-mono font-bold uppercase">Social Links</span>
                <h3 className="font-black text-white text-sm">Marketplace Handles</h3>
              </div>

              <div className="space-y-2">
                {config.socialIcons.map((soc) => (
                  <div key={soc.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white capitalize">{soc.platform}</span>
                      <input
                        type="checkbox"
                        checked={soc.isActive}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setConfig((prev) => ({
                            ...prev,
                            socialIcons: prev.socialIcons.map((s) =>
                              s.id === soc.id ? { ...s, isActive: checked } : s
                            ),
                          }));
                        }}
                        className="w-4 h-4 accent-fancy-blue"
                      />
                    </div>
                    <input
                      type="text"
                      value={soc.url}
                      onChange={(e) => {
                        const val = e.target.value;
                        setConfig((prev) => ({
                          ...prev,
                          socialIcons: prev.socialIcons.map((s) =>
                            s.id === soc.id ? { ...s, url: val } : s
                          ),
                        }));
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300 font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: PAYMENT ICONS */}
          {activeTab === "PAYMENT_ICONS" && (
            <div className="space-y-3">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] text-fancy-blue font-mono font-bold uppercase">Payment Methods</span>
                <h3 className="font-black text-white text-sm">Active Gateways & Badges</h3>
              </div>

              <div className="space-y-2">
                {config.paymentIcons.map((pay) => (
                  <label
                    key={pay.id}
                    className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer"
                  >
                    <span className="font-bold text-white">{pay.name}</span>
                    <input
                      type="checkbox"
                      checked={pay.isActive}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setConfig((prev) => ({
                          ...prev,
                          paymentIcons: prev.paymentIcons.map((p) =>
                            p.id === pay.id ? { ...p, isActive: checked } : p
                          ),
                        }));
                      }}
                      className="w-4 h-4 accent-fancy-blue"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: TRUST BADGES */}
          {activeTab === "TRUST_BADGES" && (
            <div className="space-y-3">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] text-fancy-blue font-mono font-bold uppercase">Trust Badges</span>
                <h3 className="font-black text-white text-sm">Buyer Guarantees</h3>
              </div>

              <div className="space-y-2">
                {config.trustBadges.map((badge) => (
                  <div key={badge.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{badge.title}</span>
                      <input
                        type="checkbox"
                        checked={badge.isActive}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setConfig((prev) => ({
                            ...prev,
                            trustBadges: prev.trustBadges.map((b) =>
                              b.id === badge.id ? { ...b, isActive: checked } : b
                            ),
                          }));
                        }}
                        className="w-4 h-4 accent-fancy-blue"
                      />
                    </div>
                    <input
                      type="text"
                      value={badge.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setConfig((prev) => ({
                          ...prev,
                          trustBadges: prev.trustBadges.map((b) =>
                            b.id === badge.id ? { ...b, description: val } : b
                          ),
                        }));
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* TOAST ALERT */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-slide-up">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
