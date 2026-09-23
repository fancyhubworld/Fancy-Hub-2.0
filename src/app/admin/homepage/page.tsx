"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Smartphone,
  Tablet,
  Monitor,
  Check,
  Save,
  Layers,
  Sparkles,
  RefreshCw,
  X,
} from "lucide-react";
import { SectionRenderer } from "@/components/builder/SectionRenderer";
import { SECTION_REGISTRY, SectionType } from "@/lib/page-builder";

interface SectionItem {
  id: string;
  type: string;
  title: string | null;
  subtitle: string | null;
  badgeText: string | null;
  sortOrder: number;
  isActive: boolean;
  desktopVisible: boolean;
  mobileVisible: boolean;
  contentJson: string;
  stylingJson: string | null;
}

export default function AdminHomepageVisualBuilder() {
  const [pageId, setPageId] = useState<string>("");
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [editingSection, setEditingSection] = useState<SectionItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchSections = async () => {
    try {
      const res = await fetch("/api/admin/sections?slug=home");
      const data = await res.json();
      if (data.sections) {
        setSections(data.sections);
        if (data.sections.length > 0) {
          setPageId(data.sections[0].pageId);
        }
      }
    } catch (e) {
      console.error("Failed to load sections", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    setSections(newSections);

    // Save reorder
    const sectionIds = newSections.map((s) => s.id);
    await fetch("/api/admin/sections/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sectionIds }),
    });
  };

  const handleToggleActive = async (sec: SectionItem) => {
    const updated = { ...sec, isActive: !sec.isActive };
    setSections((prev) => prev.map((s) => (s.id === sec.id ? updated : s)));

    await fetch(`/api/admin/sections/${sec.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: updated.isActive }),
    });
  };

  const handleToggleDevice = async (sec: SectionItem, device: "desktop" | "mobile") => {
    const updated = {
      ...sec,
      [device === "desktop" ? "desktopVisible" : "mobileVisible"]:
        !sec[device === "desktop" ? "desktopVisible" : "mobileVisible"],
    };
    setSections((prev) => prev.map((s) => (s.id === sec.id ? updated : s)));

    await fetch(`/api/admin/sections/${sec.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        desktopVisible: updated.desktopVisible,
        mobileVisible: updated.mobileVisible,
      }),
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return;
    setSections((prev) => prev.filter((s) => s.id !== id));
    await fetch(`/api/admin/sections/${id}`, { method: "DELETE" });
  };

  const handleAddSection = async (type: SectionType) => {
    setShowAddModal(false);
    const desc = SECTION_REGISTRY[type];
    const res = await fetch("/api/admin/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pageId,
        type,
        title: desc.name,
        subtitle: desc.description,
        contentJson: JSON.stringify(desc.defaultContent),
        stylingJson: JSON.stringify(desc.defaultStyling),
      }),
    });
    if (res.ok) {
      fetchSections();
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    await fetch(`/api/admin/sections/${editingSection.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editingSection.title,
        subtitle: editingSection.subtitle,
        badgeText: editingSection.badgeText,
        contentJson: editingSection.contentJson,
        stylingJson: editingSection.stylingJson,
      }),
    });

    setEditingSection(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
    fetchSections();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Bar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 md:px-8 flex items-center justify-between z-30">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/dashboard"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-fancy-blue" />
              <h1 className="text-sm md:text-base font-black text-white">Homepage Visual Layout & Section Builder</h1>
            </div>
            <p className="text-[11px] text-slate-400">Reorder, configure widgets, and customize mobile vs desktop visibility</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Device Switcher */}
          <div className="hidden md:flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 space-x-1 text-xs">
            <button
              onClick={() => setDeviceView("desktop")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition ${
                deviceView === "desktop" ? "bg-fancy-blue text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setDeviceView("tablet")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition ${
                deviceView === "tablet" ? "bg-fancy-blue text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet</span>
            </button>
            <button
              onClick={() => setDeviceView("mobile")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition ${
                deviceView === "mobile" ? "bg-fancy-blue text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>

          <Link
            href="/admin/visual-builder?slug=home"
            className="px-4 py-2 bg-gradient-to-r from-fancy-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 shadow active:scale-95 transition"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Open 3-Column Visual Studio</span>
          </Link>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Section</span>
          </button>
        </div>
      </header>

      {/* Main Studio Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Section List Panel */}
        <div className="w-full lg:w-[420px] bg-slate-900 border-r border-slate-800 flex flex-col h-auto lg:h-[calc(100vh-4rem)] overflow-y-auto p-4 space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
            <span className="font-black text-slate-400 uppercase tracking-wider">
              Sections Stack ({sections.length})
            </span>
            <button
              onClick={fetchSections}
              className="text-slate-400 hover:text-white flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-slate-500 text-xs">Loading homepage sections...</div>
          ) : (
            sections.map((sec, idx) => (
              <div
                key={sec.id}
                className={`p-3.5 bg-slate-900/90 rounded-2xl border transition space-y-2 ${
                  sec.isActive ? "border-slate-800 hover:border-slate-700" : "border-slate-800/40 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 font-bold flex items-center justify-center text-[11px] flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="truncate">
                      <span className="font-black text-white block truncate text-xs">
                        {sec.title || sec.type}
                      </span>
                      <span className="text-[10px] text-fancy-blue uppercase tracking-wider font-mono font-bold block">
                        {sec.type}
                      </span>
                    </div>
                  </div>

                  {/* Move Up/Down Controls */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleMove(idx, "up")}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMove(idx, "down")}
                      disabled={idx === sections.length - 1}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bottom Row Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                  <div className="flex items-center space-x-2">
                    {/* Active toggle */}
                    <button
                      onClick={() => handleToggleActive(sec)}
                      className={`px-2 py-1 rounded-lg font-bold flex items-center space-x-1 transition ${
                        sec.isActive
                          ? "bg-green-950 text-green-400 border border-green-800"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {sec.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{sec.isActive ? "Active" : "Hidden"}</span>
                    </button>

                    {/* Desktop / Mobile toggles */}
                    <button
                      onClick={() => handleToggleDevice(sec, "desktop")}
                      className={`p-1 rounded-lg border transition ${
                        sec.desktopVisible
                          ? "bg-slate-800 border-slate-700 text-fancy-blue"
                          : "bg-slate-900 border-slate-800 text-slate-600 line-through"
                      }`}
                      title="Toggle Desktop Visibility"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleDevice(sec, "mobile")}
                      className={`p-1 rounded-lg border transition ${
                        sec.mobileVisible
                          ? "bg-slate-800 border-slate-700 text-fancy-blue"
                          : "bg-slate-900 border-slate-800 text-slate-600 line-through"
                      }`}
                      title="Toggle Mobile Visibility"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => setEditingSection(sec)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                      title="Edit Settings"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(sec.id)}
                      className="p-1.5 text-red-400 hover:text-red-300 rounded-lg hover:bg-slate-800 transition"
                      title="Delete Section"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Live Preview Canvas */}
        <div className="flex-1 bg-slate-900/40 p-4 md:p-8 flex items-center justify-center overflow-auto">
          <div
            className={`transition-all duration-300 bg-slate-50 dark:bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col ${
              deviceView === "mobile"
                ? "w-[375px] h-[720px]"
                : deviceView === "tablet"
                ? "w-[768px] h-[780px]"
                : "w-full h-full max-w-6xl"
            }`}
          >
            {/* Mock Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between text-xs font-black">
              <span className="text-fancy-blue font-black text-sm">FancyHub.in</span>
              <span className="text-slate-400 text-[10px]">LIVE STOREFRONT CANVAS</span>
            </div>

            {/* Live Rendered Sections */}
            <div className="flex-1 overflow-y-auto space-y-2 p-2">
              {sections
                .filter((s) => s.isActive)
                .map((sec) => (
                  <SectionRenderer
                    key={sec.id}
                    section={sec}
                    isEditing={true}
                    onSelect={() => setEditingSection(sec)}
                    isSelected={editingSection?.id === sec.id}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* ADD SECTION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-4">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">Add New Homepage Section Widget</h3>
                <p className="text-xs text-slate-400">Choose from 13 high-performance e-commerce widgets</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
              {Object.entries(SECTION_REGISTRY).map(([type, desc]) => (
                <button
                  key={type}
                  onClick={() => handleAddSection(type as SectionType)}
                  className="p-4 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-fancy-blue rounded-2xl text-left transition group space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs group-hover:text-fancy-blue transition">
                      {desc.name}
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                      {desc.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{desc.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EDIT SECTION MODAL */}
      {editingSection && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">Edit {editingSection.type}</h3>
                <p className="text-xs text-slate-400">Configure content, title, and JSON options</p>
              </div>
              <button
                onClick={() => setEditingSection(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Section Heading Title</label>
                <input
                  type="text"
                  value={editingSection.title || ""}
                  onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Subtitle / Description</label>
                <input
                  type="text"
                  value={editingSection.subtitle || ""}
                  onChange={(e) => setEditingSection({ ...editingSection, subtitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Content JSON Options</label>
                <textarea
                  rows={6}
                  value={editingSection.contentJson}
                  onChange={(e) => setEditingSection({ ...editingSection, contentJson: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-amber-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-fancy-blue hover:bg-blue-600 text-white rounded-xl font-black shadow"
                >
                  Save Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
