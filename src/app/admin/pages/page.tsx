"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Plus,
  FileText,
  Eye,
  Trash2,
  ExternalLink,
  Edit,
  Sparkles,
  Check,
  X,
  Copy,
  Archive,
  RotateCcw,
  Calendar,
  Send,
  Search,
  LayoutTemplate,
  Filter,
  ArrowRight,
  Globe,
  Clock,
  Layers,
  Grid,
  Sliders,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { BUILTIN_PAGE_TEMPLATES } from "@/lib/page-templates";

interface PageData {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: string;
  isHomepage: boolean;
  sections: any[];
  scheduledAt?: string | null;
  updatedAt: string;
}

export default function AdminPagesCMS() {
  const router = useRouter();
  const [pages, setPages] = useState<PageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT" | "ARCHIVED" | "SCHEDULED">("ALL");

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState<PageData | null>(null);

  // Form Inputs
  const [newPage, setNewPage] = useState({
    title: "",
    slug: "",
    description: "",
    selectedTemplate: "tpl_landing_default",
    seoTitle: "",
    seoDescription: "",
  });
  const [scheduleDate, setScheduleDate] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/pages");
      const data = await res.json();
      if (data.pages) setPages(data.pages);
    } catch (e) {
      console.error("Failed to load pages", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  // 1. CREATE PAGE
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPage.title) return;

    try {
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPage),
      });
      const data = await res.json();

      if (data.success && data.page) {
        setShowCreateModal(false);
        setNewPage({ title: "", slug: "", description: "", selectedTemplate: "tpl_landing_default", seoTitle: "", seoDescription: "" });
        showToast(`✅ Created page "${data.page.title}"!`);
        fetchPages();
        // Redirect to visual builder
        router.push(`/admin/visual-builder?slug=${data.page.slug}`);
      }
    } catch (e) {
      showToast("Error creating page");
    }
  };

  // 2. DUPLICATE PAGE
  const handleDuplicate = async (page: PageData) => {
    try {
      const res = await fetch(`/api/admin/pages/${page.id}/duplicate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${page.title} (Copy)`,
          slug: `${page.slug}-copy-${Date.now() % 10000}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✅ Duplicated "${page.title}"!`);
        fetchPages();
      }
    } catch (e) {
      showToast("Duplicate failed");
    }
  };

  // 3. ARCHIVE / UNARCHIVE PAGE
  const handleToggleArchive = async (page: PageData) => {
    if (page.isHomepage) {
      showToast("Cannot archive default homepage");
      return;
    }
    const newStatus = page.status === "ARCHIVED" ? "PUBLISHED" : "ARCHIVED";
    try {
      await fetch(`/api/admin/pages/${page.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      showToast(newStatus === "ARCHIVED" ? `📦 Archived "${page.title}"` : `🚀 Restored "${page.title}"`);
      fetchPages();
    } catch (e) {
      showToast("Archive toggle failed");
    }
  };

  // 4. PUBLISH PAGE
  const handlePublish = async (page: PageData) => {
    try {
      await fetch(`/api/admin/pages/${page.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PUBLISHED" }),
      });
      showToast(`🚀 Published "${page.title}" Live!`);
      fetchPages();
    } catch (e) {
      showToast("Publish failed");
    }
  };

  // 5. SCHEDULE PAGE
  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPage || !scheduleDate) return;

    try {
      await fetch(`/api/admin/pages/${selectedPage.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "SCHEDULED",
          scheduledAt: new Date(scheduleDate).toISOString(),
        }),
      });
      setShowScheduleModal(false);
      showToast(`⏰ Scheduled "${selectedPage.title}" for ${new Date(scheduleDate).toLocaleString()}`);
      fetchPages();
    } catch (e) {
      showToast("Scheduling failed");
    }
  };

  // 6. DELETE PAGE
  const handleDelete = async (id: string, isHomepage: boolean) => {
    if (isHomepage) {
      showToast("Cannot delete default homepage");
      return;
    }
    if (!confirm("Are you sure you want to permanently delete this page?")) return;
    await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
    showToast("Page deleted");
    fetchPages();
  };

  // Filter pages
  const filteredPages = pages.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-6 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-4">
          <Link
            href={ROUTES.admin.dashboard}
            className="w-10 h-10 rounded-2xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Website Management</span>
              <span className="text-[11px] text-slate-600">→</span>
              <span className="text-xl font-black text-white">Pages & Builder Directory</span>
              <span className="text-[10px] bg-fancy-blue/10 text-fancy-blue font-bold px-2 py-0.5 rounded-full border border-fancy-blue/30">
                {pages.length} Pages
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage Home, Shop, Fashion, Electronics, Policies, Blog & Custom Landing Pages
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/header-builder"
            className="px-4 py-2 rounded-xl bg-blue-900/30 hover:bg-blue-900/50 text-blue-200 font-bold text-xs flex items-center space-x-2 transition border border-blue-700/50"
          >
            <Sliders className="w-4 h-4 text-blue-400" />
            <span>Header Builder</span>
          </Link>

          <Link
            href="/admin/footer-builder"
            className="px-4 py-2 rounded-xl bg-teal-900/30 hover:bg-teal-900/50 text-teal-200 font-bold text-xs flex items-center space-x-2 transition border border-teal-700/50"
          >
            <Sliders className="w-4 h-4 text-teal-400" />
            <span>Footer Builder</span>
          </Link>

          <Link
            href="/admin/category-builder"
            className="px-4 py-2 rounded-xl bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-200 font-bold text-xs flex items-center space-x-2 transition border border-emerald-700/50"
          >
            <Grid className="w-4 h-4 text-emerald-400" />
            <span>Category Page Builder</span>
          </Link>

          <Link
            href="/admin/product-builder"
            className="px-4 py-2 rounded-xl bg-purple-900/30 hover:bg-purple-900/50 text-purple-200 font-bold text-xs flex items-center space-x-2 transition border border-purple-700/50"
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Product Page Builder</span>
          </Link>

          <Link
            href="/admin/visual-builder"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center space-x-2 transition border border-slate-700"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Open Visual Builder</span>
          </Link>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-fancy-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black text-xs flex items-center space-x-2 shadow-lg active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Page</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search pages by name, slug or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 outline-none focus:border-fancy-blue"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto font-bold">
          {(["ALL", "PUBLISHED", "DRAFT", "SCHEDULED", "ARCHIVED"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl transition ${
                statusFilter === st
                  ? "bg-fancy-blue text-white shadow"
                  : "bg-slate-950 text-slate-400 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Pages Table / Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-16 text-center text-slate-400 text-xs">Loading website pages catalog...</div>
        ) : filteredPages.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-xs space-y-2">
            <p>No pages match your filter query.</p>
            <button
              onClick={() => { setSearchQuery(""); setStatusFilter("ALL"); }}
              className="text-fancy-blue font-bold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filteredPages.map((p) => {
              const liveUrl = p.isHomepage ? "/" : p.slug.startsWith("/") ? p.slug : `/p/${p.slug}`;
              const isArchived = p.status === "ARCHIVED";

              return (
                <div
                  key={p.id}
                  className={`p-5 hover:bg-slate-800/50 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    isArchived ? "opacity-60 bg-slate-950/40" : ""
                  }`}
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-black text-sm text-white">{p.title}</span>

                      {p.isHomepage && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 shadow">
                          HOMEPAGE
                        </span>
                      )}

                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                          p.status === "PUBLISHED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : p.status === "SCHEDULED"
                            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30"
                            : p.status === "ARCHIVED"
                            ? "bg-slate-800 text-slate-400 border border-slate-700"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-slate-400">
                      <span className="font-mono text-fancy-blue">{liveUrl}</span>
                      <span>•</span>
                      <span>{p.sections?.length || 0} Widgets</span>
                      <span>•</span>
                      <span className="text-slate-500">{p.description || "Dynamic website page"}</span>
                    </div>
                  </div>

                  {/* 7 Action Buttons */}
                  <div className="flex items-center space-x-1.5 text-xs font-bold flex-wrap gap-y-1.5">
                    {/* 1. EDIT IN VISUAL BUILDER */}
                    <Link
                      href={`/admin/visual-builder?slug=${p.slug}`}
                      className="px-3 py-1.5 bg-fancy-blue hover:bg-blue-600 text-white rounded-xl flex items-center space-x-1 shadow transition"
                      title="Edit in Visual Builder"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>

                    {/* 2. DUPLICATE */}
                    <button
                      onClick={() => handleDuplicate(p)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition"
                      title="Duplicate Page"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* 3. PREVIEW */}
                    <Link
                      href={liveUrl}
                      target="_blank"
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition"
                      title="Preview Page Live"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>

                    {/* 4. PUBLISH / STATUS TOGGLE */}
                    {p.status !== "PUBLISHED" && (
                      <button
                        onClick={() => handlePublish(p)}
                        className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-xl border border-emerald-500/40 transition flex items-center space-x-1"
                        title="Publish Page"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Publish</span>
                      </button>
                    )}

                    {/* 5. SCHEDULE */}
                    <button
                      onClick={() => { setSelectedPage(p); setShowScheduleModal(true); }}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-indigo-400 rounded-xl transition"
                      title="Schedule Publication"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                    </button>

                    {/* 6. ARCHIVE / RESTORE */}
                    {!p.isHomepage && (
                      <button
                        onClick={() => handleToggleArchive(p)}
                        className={`p-2 rounded-xl transition ${
                          isArchived
                            ? "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white"
                            : "bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700"
                        }`}
                        title={isArchived ? "Restore Page" : "Archive Page"}
                      >
                        {isArchived ? <RotateCcw className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                      </button>
                    )}

                    {/* 7. DELETE (NON-HOMEPAGE) */}
                    {!p.isHomepage && (
                      <button
                        onClick={() => handleDelete(p.id, p.isHomepage)}
                        className="p-2 bg-slate-800 hover:bg-red-600/20 text-slate-400 hover:text-red-400 rounded-xl transition"
                        title="Delete Page"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE PAGE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white flex items-center space-x-2">
                  <Plus className="w-4 h-4 text-fancy-blue" />
                  <span>Create New Website Page</span>
                </h3>
                <p className="text-xs text-slate-400">Add a landing page, campaign page or policy page</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Page Title</label>
                <input
                  type="text"
                  placeholder="e.g. Diwali Silk Festive Sale"
                  value={newPage.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
                    setNewPage({ ...newPage, title, slug });
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">URL Slug</label>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-slate-400">
                  <span>/p/</span>
                  <input
                    type="text"
                    value={newPage.slug}
                    onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                    className="bg-transparent border-0 text-white outline-none flex-1 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Starting Page Template</label>
                <select
                  value={newPage.selectedTemplate}
                  onChange={(e) => setNewPage({ ...newPage, selectedTemplate: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                >
                  <option value="tpl_homepage_default">🏠 Homepage Template (Slider, Flash Deals, Bestsellers)</option>
                  <option value="tpl_category_default">📂 Category Template (Grid, Subcategories, FAQ)</option>
                  <option value="tpl_product_default">🛍️ Product Template (Spotlight, Reviews, Warranty)</option>
                  <option value="tpl_vendor_store_default">🏬 Vendor Store Template (Artisan Header, Catalog)</option>
                  <option value="tpl_blog_default">📰 Blog Template (Stories, Dispatches, Interview)</option>
                  <option value="tpl_landing_default">🚀 Landing Page Template (Hero, Pillars, CTA)</option>
                  <option value="tpl_campaign_default">⚡ Campaign Template (Festive Banner, Coupons, Timer)</option>
                  <option value="blank">⚪ Blank Canvas</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Description / Purpose</label>
                <textarea
                  rows={2}
                  placeholder="Short description for admin reference..."
                  value={newPage.description}
                  onChange={(e) => setNewPage({ ...newPage, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-fancy-blue hover:bg-blue-600 text-white font-black rounded-xl shadow"
                >
                  Create & Launch Studio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCHEDULE MODAL */}
      {showScheduleModal && selectedPage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>Schedule Page Launch</span>
                </h3>
                <p className="text-xs text-slate-400">Set future release timestamp for &quot;{selectedPage.title}&quot;</p>
              </div>
              <button onClick={() => setShowScheduleModal(false)} className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Launch Date & Time</label>
                <input
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST ALERT */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-slide-up">
          <Sparkles className="w-4 h-4 text-fancy-blue" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
