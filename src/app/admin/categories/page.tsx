"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Edit2,
  Trash2,
  Search,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Upload,
  Download,
  Folder,
  FolderOpen,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  X,
  Layers,
  Eye,
  EyeOff,
  Move,
  RefreshCw,
} from "lucide-react";
import { CategoryTreeNode } from "@/lib/categories";
import { useCategories } from "@/lib/use-categories";
import { LoadingSpinner } from "@/components/ui/StateFeedback";

export default function AdminCategoriesPage() {
  const { refreshCategories } = useCategories();
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryTreeNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<any | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parentId: "",
    description: "",
    icon: "Sparkles",
    image: "",
    bannerImage: "",
    mobileBanner: "",
    sortOrder: 0,
    status: "ACTIVE",
    isFeatured: false,
    showInHeader: true,
    showOnHomepage: true,
    showInMobile: true,
    showInFooter: true,
    showInSearch: true,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    canonicalUrl: "",
    commissionRate: 10,
  });

  const [importCsvText, setImportCsvText] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showFeedback = (type: "success" | "error", text: string) => {
    setFeedbackMessage({ type, text });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const fetchAdminCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/categories?search=${encodeURIComponent(search)}&status=${statusFilter}`);
      const data = await res.json();
      if (data.success) {
        setCategories(data.data || []);
      }

      const treeRes = await fetch(`/api/categories/tree?refresh=true`);
      const treeData = await treeRes.json();
      if (treeData.success) {
        setCategoryTree(treeData.data || []);
        // Auto expand root nodes
        const defaultExpanded: Record<string, boolean> = {};
        (treeData.data || []).forEach((c: CategoryTreeNode) => {
          defaultExpanded[c.id] = true;
        });
        setExpandedNodes((prev) => ({ ...defaultExpanded, ...prev }));
      }
    } catch (err: any) {
      showFeedback("error", err.message || "Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchAdminCategories();
  }, [fetchAdminCategories]);

  const toggleExpand = (id: string) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenCreate = (parentId = "") => {
    setFormData({
      name: "",
      slug: "",
      parentId: parentId || "",
      description: "",
      icon: "Sparkles",
      image: "",
      bannerImage: "",
      mobileBanner: "",
      sortOrder: categories.length + 1,
      status: "ACTIVE",
      isFeatured: false,
      showInHeader: true,
      showOnHomepage: true,
      showInMobile: true,
      showInFooter: true,
      showInSearch: true,
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
      canonicalUrl: "",
      commissionRate: 10,
    });
    setShowCreateModal(true);
  };

  const handleOpenEdit = (cat: any) => {
    setActiveCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId || "",
      description: cat.description || "",
      icon: cat.icon || "Sparkles",
      image: cat.image || "",
      bannerImage: cat.bannerImage || "",
      mobileBanner: cat.mobileBanner || "",
      sortOrder: cat.sortOrder ?? 0,
      status: cat.status || "ACTIVE",
      isFeatured: cat.isFeatured ?? false,
      showInHeader: cat.showInHeader ?? true,
      showOnHomepage: cat.showOnHomepage ?? true,
      showInMobile: cat.showInMobile ?? true,
      showInFooter: cat.showInFooter ?? true,
      showInSearch: cat.showInSearch ?? true,
      seoTitle: cat.seoTitle || "",
      seoDescription: cat.seoDescription || "",
      seoKeywords: cat.seoKeywords || "",
      canonicalUrl: cat.canonicalUrl || "",
      commissionRate: cat.commissionRate ?? 10,
    });
    setShowEditModal(true);
  };

  const handleOpenDelete = (cat: any) => {
    setActiveCategory(cat);
    setShowDeleteModal(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        showFeedback("success", data.message || "Category created successfully");
        setShowCreateModal(false);
        await fetchAdminCategories();
        await refreshCategories();
      } else {
        showFeedback("error", data.error || "Failed to create category");
      }
    } catch (err: any) {
      showFeedback("error", err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCategory) return;
    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/categories/${activeCategory.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        showFeedback("success", data.message || "Category updated successfully");
        setShowEditModal(false);
        await fetchAdminCategories();
        await refreshCategories();
      } else {
        showFeedback("error", data.error || "Failed to update category");
      }
    } catch (err: any) {
      showFeedback("error", err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSubmit = async (permanent = false) => {
    if (!activeCategory) return;
    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/categories/${activeCategory.id}?permanent=${permanent}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showFeedback("success", data.message || "Category archived");
        setShowDeleteModal(false);
        await fetchAdminCategories();
        await refreshCategories();
      } else {
        showFeedback("error", data.error || "Failed to delete/archive category");
      }
    } catch (err: any) {
      showFeedback("error", err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReorder = async (id: string, newOrder: number) => {
    try {
      const res = await fetch("/api/admin/categories/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ id, sortOrder: newOrder }] }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchAdminCategories();
        await refreshCategories();
      }
    } catch (err: any) {
      showFeedback("error", err.message);
    }
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importCsvText.trim()) return;
    try {
      setActionLoading(true);
      const res = await fetch("/api/admin/categories/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvData: importCsvText }),
      });
      const data = await res.json();
      if (data.success) {
        showFeedback("success", data.message || "Categories imported");
        setShowImportModal(false);
        setImportCsvText("");
        await fetchAdminCategories();
        await refreshCategories();
      } else {
        showFeedback("error", data.error || "Import failed");
      }
    } catch (err: any) {
      showFeedback("error", err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Recursive Tree Node Renderer
  const renderTreeNode = (node: CategoryTreeNode, depth = 0) => {
    const isExpanded = expandedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="border-b border-slate-700/50 last:border-0">
        <div
          className={`flex items-center justify-between py-2.5 px-3 hover:bg-slate-700/40 transition group ${
            depth > 0 ? "bg-slate-800/40" : ""
          }`}
          style={{ paddingLeft: `${Math.max(12, depth * 28)}px` }}
        >
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            {hasChildren ? (
              <button
                onClick={() => toggleExpand(node.id)}
                className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            ) : (
              <div className="w-5 h-5 flex items-center justify-center text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              </div>
            )}

            {node.image ? (
              <img src={node.image} alt={node.name} className="w-6 h-6 rounded object-cover border border-slate-700 flex-shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-fancy-blue flex-shrink-0" />
            )}

            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-xs truncate">{node.name}</span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                  /{node.fullPath}
                </span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-800">
                  Lvl {node.level}
                </span>
                {node.isFeatured && (
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-800">
                    Featured
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0 text-xs">
            <span className="text-slate-400 text-[11px] hidden sm:inline-block">
              {node.productCount} Products
            </span>

            {/* Visibility Pills */}
            <div className="hidden md:flex items-center space-x-1">
              {node.showInHeader && (
                <span className="text-[9px] bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded" title="Visible in Header">
                  Header
                </span>
              )}
              {node.showOnHomepage && (
                <span className="text-[9px] bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded" title="Visible on Homepage">
                  Home
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <Link
              href={`/category/${node.fullPath}`}
              target="_blank"
              title="Preview Live Category Page"
              className="p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-700 rounded-lg transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => handleOpenCreate(node.id)}
              title="Add Subcategory under this"
              className="p-1.5 text-blue-400 hover:text-blue-300 bg-blue-950/60 hover:bg-blue-900/60 rounded-lg transition"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => handleOpenEdit(node)}
              title="Edit Category"
              className="p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-700 rounded-lg transition"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => handleOpenDelete(node)}
              title="Archive / Delete Category"
              className="p-1.5 text-red-400 hover:text-red-300 bg-red-950/60 hover:bg-red-900/60 rounded-lg transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.children.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 space-y-6">
      {/* Toast Feedback Notification */}
      {feedbackMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl text-xs font-bold shadow-2xl flex items-center space-x-2 animate-fadeIn ${
            feedbackMessage.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {feedbackMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-card">
        <div className="flex items-center space-x-3">
          <Link href="/admin/dashboard" className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black text-white">Dynamic Category Engine</h1>
              <span className="bg-fancy-orange text-white font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                Single Source of Truth
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Database-driven category taxonomy with unlimited nesting, automatic slug routing, and redirect protection.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleOpenCreate()}
            className="px-4 py-2 bg-fancy-blue hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Root Department</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>

          <a
            href="/api/admin/categories/export"
            download
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>

          <button
            onClick={() => fetchAdminCategories()}
            title="Refresh from Database"
            className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 flex-1 max-w-md bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter categories by name, slug or path..."
            className="w-full bg-transparent outline-none text-xs text-white placeholder-slate-500"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
            <option value="ARCHIVED">Archived Only</option>
          </select>
        </div>
      </div>

      {/* Main Hierarchical Tree View */}
      <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-card">
        <div className="p-4 bg-slate-850 border-b border-slate-700 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 font-black text-white">
            <Layers className="w-4 h-4 text-fancy-blue" />
            <span>Category Taxonomy Hierarchy</span>
          </div>
          <span className="text-slate-400">
            Total {categories.length} Taxonomies in Database
          </span>
        </div>

        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-2">
            <LoadingSpinner />
            <p className="text-xs text-slate-400">Synchronizing category tree...</p>
          </div>
        ) : categoryTree.length > 0 ? (
          <div className="divide-y divide-slate-700/50">
            {categoryTree.map((node) => renderTreeNode(node, 0))}
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 text-xs space-y-3">
            <p>No categories found matching your filters.</p>
            <button
              onClick={() => handleOpenCreate()}
              className="px-4 py-2 bg-fancy-blue text-white rounded-xl font-bold inline-flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Category</span>
            </button>
          </div>
        )}
      </div>

      {/* CREATE CATEGORY MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div>
                <h3 className="text-base font-black text-white">Add New Marketplace Category</h3>
                <p className="text-xs text-slate-400">Automatically generates slug, fullPath, and hierarchy level</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Formal Shirts"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-fancy-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Custom Slug (Optional)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="Auto-generated from name if blank"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-fancy-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Parent Category</label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-fancy-blue"
                >
                  <option value="">-- None (Root Level Department) --</option>
                  {categories
                    .filter((c) => c.status === "ACTIVE")
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {"— ".repeat(c.level)}
                        {c.name} (/{c.fullPath})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short merchandizing summary for customer category banner..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-fancy-blue"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Thumbnail / Icon Image URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-fancy-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Banner Image URL</label>
                  <input
                    type="url"
                    value={formData.bannerImage}
                    onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-fancy-blue"
                  />
                </div>
              </div>

              {/* Visibility Controls */}
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 space-y-3">
                <span className="font-bold text-white block">Visibility & Placement</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showInHeader}
                      onChange={(e) => setFormData({ ...formData, showInHeader: e.target.checked })}
                      className="rounded accent-fancy-blue"
                    />
                    <span>Header Navbar</span>
                  </label>

                  <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showOnHomepage}
                      onChange={(e) => setFormData({ ...formData, showOnHomepage: e.target.checked })}
                      className="rounded accent-fancy-blue"
                    />
                    <span>Homepage Strip</span>
                  </label>

                  <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showInMobile}
                      onChange={(e) => setFormData({ ...formData, showInMobile: e.target.checked })}
                      className="rounded accent-fancy-blue"
                    />
                    <span>Mobile Menu</span>
                  </label>

                  <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded accent-fancy-blue"
                    />
                    <span>Featured Badge</span>
                  </label>
                </div>
              </div>

              {/* SEO Controls */}
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 space-y-3">
                <span className="font-bold text-white block">SEO Optimization</span>
                <div>
                  <label className="block text-slate-400 mb-1">SEO Title</label>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    placeholder="e.g. Formal Shirts Online Shopping | FancyHub.in"
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-1.5 text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 bg-fancy-blue hover:bg-blue-600 text-white rounded-xl font-bold shadow flex items-center space-x-2"
                >
                  {actionLoading ? <LoadingSpinner size="sm" /> : <span>Create Category</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CATEGORY MODAL */}
      {showEditModal && activeCategory && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div>
                <h3 className="text-base font-black text-white">Edit Category: {activeCategory.name}</h3>
                <p className="text-xs text-slate-400">Updating slug or parent automatically updates descendants and creates redirects</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-fancy-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-fancy-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Move Parent (Circular Protection Enabled)</label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-fancy-blue"
                >
                  <option value="">-- None (Root Level Department) --</option>
                  {categories
                    .filter((c) => c.id !== activeCategory.id && c.status === "ACTIVE")
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {"— ".repeat(c.level)}
                        {c.name} (/{c.fullPath})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-fancy-blue"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-fancy-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Sort Order (Ascending)</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-fancy-blue"
                  />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 space-y-3">
                <span className="font-bold text-white block">Visibility & Placement</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showInHeader}
                      onChange={(e) => setFormData({ ...formData, showInHeader: e.target.checked })}
                      className="rounded accent-fancy-blue"
                    />
                    <span>Header Navbar</span>
                  </label>

                  <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showOnHomepage}
                      onChange={(e) => setFormData({ ...formData, showOnHomepage: e.target.checked })}
                      className="rounded accent-fancy-blue"
                    />
                    <span>Homepage Strip</span>
                  </label>

                  <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showInMobile}
                      onChange={(e) => setFormData({ ...formData, showInMobile: e.target.checked })}
                      className="rounded accent-fancy-blue"
                    />
                    <span>Mobile Menu</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 bg-fancy-blue hover:bg-blue-600 text-white rounded-xl font-bold shadow flex items-center space-x-2"
                >
                  {actionLoading ? <LoadingSpinner size="sm" /> : <span>Save & Sync</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE / ARCHIVE CONFIRMATION MODAL */}
      {showDeleteModal && activeCategory && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-red-400">
              <div className="w-10 h-10 rounded-2xl bg-red-950/80 border border-red-800 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Archive '{activeCategory.name}'</h3>
                <p className="text-xs text-slate-400">Data safety impact verification</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 text-xs space-y-2 text-slate-300">
              <p>
                This category currently contains{" "}
                <strong className="text-white">{activeCategory.productCount || 0} active products</strong> and{" "}
                <strong className="text-white">{activeCategory.children?.length || 0} subcategories</strong>.
              </p>
              <p className="text-slate-400 text-[11px]">
                Archiving will safely hide this taxonomy from customer navigation while keeping all historical orders, products, and vendor links 100% intact.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSubmit(false)}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs"
              >
                Confirm Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV IMPORT MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-base font-black text-white">Bulk CSV Category Import</h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Paste CSV with header: <code className="text-fancy-blue">name,slug,parentSlug,description,sortOrder</code>
            </p>

            <form onSubmit={handleImportSubmit} className="space-y-3">
              <textarea
                rows={8}
                required
                value={importCsvText}
                onChange={(e) => setImportCsvText(e.target.value)}
                placeholder="name,slug,parentSlug,description,sortOrder&#10;Fashion,fashion,,Fashion items,1&#10;Men,men,fashion,Men clothing,1&#10;Shirts,shirts,men,Cotton shirts,1"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 font-mono text-xs text-white outline-none focus:border-fancy-blue"
              />

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 bg-slate-700 text-white rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-fancy-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  Upload & Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
