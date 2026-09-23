"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, Tag } from "lucide-react";
import { TAGS_DATA } from "@/data/mock-catalog";
import { ROUTES } from "@/lib/routes";

export default function AdminTagsPage() {
  const [tags, setTags] = useState(TAGS_DATA);
  const [newTagName, setNewTagName] = useState("");

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName) return;
    setTags([
      ...tags,
      {
        id: `tag-${Date.now()}`,
        name: newTagName,
        slug: newTagName.toLowerCase().replace(/\s+/g, "-"),
        productCount: 0,
        isActive: true,
      },
    ]);
    setNewTagName("");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href={ROUTES.admin.dashboard} className="text-slate-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-black text-white">Product Tag Manager</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-xs">
        <div className="lg:col-span-8 bg-slate-800 border border-slate-700 rounded-3xl p-6 space-y-3">
          <h3 className="font-bold text-white text-sm border-b border-slate-700 pb-2">Active Tags</h3>
          <div className="grid grid-cols-2 gap-3">
            {tags.map((t) => (
              <div key={t.id} className="p-3 bg-slate-900 rounded-2xl border border-slate-700 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{t.name}</span>
                  <span className="text-[10px] text-amber-300 font-mono">/tag/{t.slug}</span>
                </div>
                <p className="text-[11px] text-slate-400">{t.description || "Product promotional badge tag."}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-slate-800 border border-slate-700 rounded-3xl p-6 space-y-3">
          <h3 className="font-bold text-white text-sm border-b border-slate-700 pb-2">Create New Tag</h3>
          <form onSubmit={handleAddTag} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Tag Label *</label>
              <input
                type="text"
                required
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="e.g. Festive Exclusive"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-fancy-blue"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-fancy-blue text-white font-bold rounded-xl shadow"
            >
              Add Tag
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
