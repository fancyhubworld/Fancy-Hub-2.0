"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Grid,
  Download,
  Check,
  Star,
  Sparkles,
  ChevronRight,
  Search,
  ExternalLink,
  ShieldCheck,
  Layers,
  ArrowRight,
  Info,
  Trash2,
  PackageCheck,
} from "lucide-react";
import { WidgetMarketplacePlugin } from "@/lib/widget-marketplace-engine";

export default function WidgetMarketplacePage() {
  const [plugins, setPlugins] = useState<WidgetMarketplacePlugin[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchPlugins = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/widget-marketplace");
      const data = await res.json();
      if (data.success && data.plugins) {
        setPlugins(data.plugins);
      }
    } catch (e) {
      showToast("Error loading widget marketplace");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlugins();
  }, []);

  const handleToggleInstall = async (plugin: WidgetMarketplacePlugin) => {
    const action = plugin.isInstalled ? "uninstall" : "install";
    try {
      const res = await fetch("/api/admin/widget-marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pluginId: plugin.id, action }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(plugin.isInstalled ? `Uninstalled ${plugin.name}` : `Installed ${plugin.name}! Ready in Visual Builder`);
        fetchPlugins();
      }
    } catch (e) {
      showToast("Failed to update widget installation");
    }
  };

  const filtered = plugins.filter((p) => {
    const matchesCat = selectedCategory === "ALL" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.widgetType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-fancy-blue text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-fadeIn">
          <Info className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-1">
            <Link href="/admin" className="hover:text-white">Admin</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-fancy-blue font-bold">Widget Marketplace</span>
          </div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2.5">
            <Grid className="w-6 h-6 text-fancy-blue" />
            <span>Widget Marketplace & Extensibility Store</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Install and manage modular commerce, gamification, and rich media widgets for FancyHub Visual Builder.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/visual-builder"
            className="px-4 py-2 rounded-xl bg-fancy-blue hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition flex items-center space-x-1.5"
          >
            <span>Open Visual Builder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        {/* Categories */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {["ALL", "COMMERCE", "MARKETING", "MEDIA", "ENGAGEMENT", "UTILITY"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition shrink-0 ${
                selectedCategory === cat
                  ? "bg-fancy-blue text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search widgets & plugins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-fancy-blue"
          />
        </div>
      </div>

      {/* Plugin Cards Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center p-20 text-slate-500 text-xs">
          Loading Widget Marketplace...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((plugin) => (
            <div
              key={plugin.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 transition flex flex-col justify-between p-5"
            >
              <div>
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 mb-4 border border-slate-800">
                  <img src={plugin.thumbnailUrl} alt={plugin.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur border border-slate-700 text-[10px] font-bold text-fancy-blue">
                    {plugin.category}
                  </span>
                  {plugin.isInstalled && (
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-lg bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center space-x-1 shadow-lg">
                      <Check className="w-3 h-3" />
                      <span>INSTALLED</span>
                    </span>
                  )}
                </div>

                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-sm text-white">{plugin.name}</h3>
                </div>

                <p className="text-xs text-slate-400 mb-4 leading-relaxed line-clamp-2">
                  {plugin.description}
                </p>

                <div className="flex items-center space-x-4 text-[11px] text-slate-400 mb-4 font-mono">
                  <span className="flex items-center space-x-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold">{plugin.rating}</span>
                  </span>
                  <span>{plugin.downloadsCount} installs</span>
                  <span>v{plugin.version}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">{plugin.author}</span>
                <button
                  onClick={() => handleToggleInstall(plugin)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    plugin.isInstalled
                      ? "bg-slate-800 text-red-400 hover:bg-red-500 hover:text-white"
                      : "bg-fancy-blue hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  }`}
                >
                  {plugin.isInstalled ? (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Uninstall</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Install Widget</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
