"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Box,
  Plus,
  Trash2,
  Edit2,
  Check,
  Save,
  Layers,
  Link2,
  Copy,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { ReusableBlock, DEFAULT_REUSABLE_BLOCKS } from "@/lib/reusable-sections-engine";

export default function AdminReusableBlocksPage() {
  const [blocks, setBlocks] = useState<ReusableBlock[]>(DEFAULT_REUSABLE_BLOCKS);
  const [activeBlock, setActiveBlock] = useState<ReusableBlock | null>(DEFAULT_REUSABLE_BLOCKS[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/admin/reusable-blocks")
      .then((res) => res.json())
      .then((data) => {
        if (data.blocks && data.blocks.length > 0) {
          setBlocks(data.blocks);
          setActiveBlock(data.blocks[0]);
        }
      })
      .catch(() => {});
  }, []);

  const handleUpdateActiveBlock = async () => {
    if (!activeBlock) return;
    setIsSaving(true);
    try {
      await fetch("/api/admin/reusable-blocks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activeBlock.id,
          contentJson: activeBlock.contentJson,
          stylingJson: activeBlock.stylingJson,
        }),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e) {
      console.error("Save reusable block failed:", e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-6 font-sans select-none">
      {/* Header */}
      <header className="h-16 bg-slate-900 border border-slate-800 rounded-3xl px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/pages"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <Box className="w-4 h-4 text-fancy-blue" />
              <h1 className="text-sm md:text-base font-black text-white">Reusable Section Blocks</h1>
              <span className="text-[10px] bg-fancy-blue/20 text-fancy-blue font-bold px-2.5 py-0.5 rounded-full border border-fancy-blue/30">
                GLOBAL SYNC • LINKED INSTANCES
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Save any section once and embed across Home, Shop, Category & Landing pages</p>
          </div>
        </div>

        <button
          onClick={handleUpdateActiveBlock}
          disabled={isSaving}
          className="px-5 py-2 bg-gradient-to-r from-fancy-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-lg active:scale-95 transition disabled:opacity-50"
        >
          {saveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saveSuccess ? "Synced to All Pages!" : isSaving ? "Saving..." : "Save & Propagate"}</span>
        </button>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Blocks List */}
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-300 uppercase tracking-wider">
              Saved Master Blocks
            </span>
            <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
              {blocks.length}
            </span>
          </div>

          <div className="space-y-2.5">
            {blocks.map((b) => (
              <div
                key={b.id}
                onClick={() => setActiveBlock(b)}
                className={`p-4 rounded-2xl border cursor-pointer transition space-y-1.5 ${
                  activeBlock?.id === b.id
                    ? "bg-slate-800 border-fancy-blue ring-1 ring-fancy-blue"
                    : "bg-slate-950 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{b.name}</span>
                  <span className="text-[9px] bg-fancy-blue/20 text-fancy-blue font-bold px-2 py-0.5 rounded">
                    {b.category || "CUSTOM"}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-1">{b.description || "Reusable component"}</p>
                <div className="flex items-center space-x-2 text-[10px] text-slate-500 pt-1">
                  <Link2 className="w-3 h-3 text-emerald-400" />
                  <span>Linked in multiple pages</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Editor & Inspector */}
        {activeBlock && (
          <div className="lg:col-span-2 p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-sm font-black text-white">{activeBlock.name}</h2>
                <p className="text-xs text-slate-400">Widget Type: {activeBlock.type}</p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded-xl border border-emerald-500/30 flex items-center space-x-1.5">
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Linked Sync Mode Active</span>
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Block Title</label>
                <input
                  type="text"
                  value={activeBlock.name}
                  onChange={(e) => setActiveBlock({ ...activeBlock, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white font-bold text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Content JSON</label>
                <textarea
                  rows={8}
                  value={
                    typeof activeBlock.contentJson === "string"
                      ? activeBlock.contentJson
                      : JSON.stringify(activeBlock.contentJson, null, 2)
                  }
                  onChange={(e) => setActiveBlock({ ...activeBlock, contentJson: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-emerald-400 font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Styling JSON</label>
                <textarea
                  rows={4}
                  value={
                    typeof activeBlock.stylingJson === "string"
                      ? activeBlock.stylingJson || "{}"
                      : JSON.stringify(activeBlock.stylingJson || {}, null, 2)
                  }
                  onChange={(e) => setActiveBlock({ ...activeBlock, stylingJson: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-cyan-400 font-mono text-xs"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
