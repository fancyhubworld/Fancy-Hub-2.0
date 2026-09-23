"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Folder,
  Trash2,
  Edit,
  Eye,
  Copy,
  Check,
  AlertTriangle,
  Info,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter,
  Maximize2,
} from "lucide-react";
import { MediaAsset, validateImageAltText } from "@/lib/media-library-engine";

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [folders, setFolders] = useState<string[]>(["ALL", "Banners", "Products", "Artisans", "Logos", "Campaigns"]);
  const [selectedFolder, setSelectedFolder] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newFileUrl, setNewFileUrl] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [newAltText, setNewAltText] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [newFolder, setNewFolder] = useState("Banners");

  // Edit Modal State
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/media?folder=${selectedFolder}&search=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success && data.assets) {
        setAssets(data.assets);
        if (data.folders) setFolders(data.folders);
      }
    } catch (e) {
      showToast("Error loading media library");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [selectedFolder, searchQuery]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileUrl) {
      showToast("Please provide an image URL");
      return;
    }

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: newFileUrl,
          filename: newFileName || "uploaded_asset.jpg",
          altText: newAltText,
          title: newTitle || newFileName || "Media Asset",
          caption: newCaption,
          folder: newFolder,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Image uploaded to library successfully");
        if (data.altWarning) {
          setTimeout(() => showToast(`⚠️ ${data.altWarning}`), 3200);
        }
        setShowUploadModal(false);
        setNewFileUrl("");
        setNewFileName("");
        setNewAltText("");
        setNewTitle("");
        setNewCaption("");
        fetchAssets();
      } else {
        showToast(data.error || "Upload failed");
      }
    } catch (e) {
      showToast("Network error uploading media");
    }
  };

  const handleSaveEdit = async () => {
    if (!editingAsset) return;
    try {
      const res = await fetch("/api/admin/media", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingAsset),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Media metadata updated");
        setEditingAsset(null);
        fetchAssets();
      } else {
        showToast(data.error || "Update failed");
      }
    } catch (e) {
      showToast("Error saving media updates");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media asset?")) return;
    try {
      const res = await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Asset deleted from library");
        fetchAssets();
      }
    } catch (e) {
      showToast("Error deleting asset");
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast("URL copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

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
            <span className="text-fancy-blue font-bold">Media Library</span>
          </div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2.5">
            <ImageIcon className="w-6 h-6 text-fancy-blue" />
            <span>Digital Media Library</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              ☁️ Cloud CDN Active
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Centralized high-performance media storage with AWS S3 / Cloudflare R2 Presigned Uploads, responsive sizes, and SEO Alt Text enforcement.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/visual-builder"
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs transition flex items-center space-x-1.5"
          >
            <span>Visual Builder</span>
          </Link>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 rounded-xl bg-fancy-blue hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition flex items-center space-x-1.5"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Media</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        {/* Folders Navigation */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Folder className="w-4 h-4 text-slate-400 ml-2 mr-1" />
          {folders.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFolder(f)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition shrink-0 ${
                selectedFolder === f
                  ? "bg-fancy-blue text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search filename, title, alt text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-fancy-blue"
          />
        </div>
      </div>

      {/* Grid of Media Assets */}
      {isLoading ? (
        <div className="flex items-center justify-center p-20 text-slate-500 text-xs">
          Loading Media Library...
        </div>
      ) : assets.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-16 text-center">
          <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Media Assets Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
            Upload product imagery, banners, or artisan portraits to populate your media repository.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-fancy-blue text-white text-xs font-bold rounded-xl"
          >
            Upload Media Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map((asset) => {
            const hasAlt = asset.altText && asset.altText.trim().length > 0;
            return (
              <div
                key={asset.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group hover:border-slate-700 transition flex flex-col"
              >
                {/* Thumbnail Image Container */}
                <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                  <img
                    src={asset.url}
                    alt={asset.altText || "Asset"}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {/* Folder Tag */}
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur border border-slate-700 text-[10px] font-bold text-slate-300">
                    {asset.folder}
                  </span>

                  {/* Alt Text Badge */}
                  {!hasAlt && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-amber-500/90 text-slate-950 text-[10px] font-black flex items-center space-x-1 shadow-lg">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Missing Alt</span>
                    </span>
                  )}

                  {/* Hover Overlay Controls */}
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-2">
                    <button
                      onClick={() => setPreviewAsset(asset)}
                      className="p-2 rounded-xl bg-slate-800/90 hover:bg-white hover:text-slate-950 text-white transition shadow-lg"
                      title="Preview Asset"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingAsset(asset)}
                      className="p-2 rounded-xl bg-slate-800/90 hover:bg-fancy-blue text-white transition shadow-lg"
                      title="Edit Metadata & Alt Text"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(asset.url, asset.id)}
                      className="p-2 rounded-xl bg-slate-800/90 hover:bg-emerald-600 text-white transition shadow-lg"
                      title="Copy Public URL"
                    >
                      {copiedId === asset.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(asset.id)}
                      className="p-2 rounded-xl bg-slate-800/90 hover:bg-red-600 text-white transition shadow-lg"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-white truncate" title={asset.title}>
                      {asset.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                      {asset.filename}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{asset.dimensions.width}×{asset.dimensions.height}px</span>
                    <span>{Math.round(asset.fileSize / 1024)} KB</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-fadeIn">
            <h2 className="text-lg font-black text-white flex items-center space-x-2 mb-1">
              <Upload className="w-5 h-5 text-fancy-blue" />
              <span>Upload New Media Asset</span>
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Enter public URL and specify mandatory descriptive Alt Text for SEO & Accessibility.
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Image Public URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newFileUrl}
                  onChange={(e) => setNewFileUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-fancy-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">File Name</label>
                  <input
                    type="text"
                    placeholder="banarasi-saree-hero.jpg"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-fancy-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Folder Category</label>
                  <select
                    value={newFolder}
                    onChange={(e) => setNewFolder(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  >
                    <option value="Banners">Banners</option>
                    <option value="Products">Products</option>
                    <option value="Artisans">Artisans</option>
                    <option value="Logos">Logos</option>
                    <option value="Campaigns">Campaigns</option>
                  </select>
                </div>
              </div>

              {/* Alt Text (Prominent) */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-amber-500/30">
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-amber-400 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Image Alt Text (SEO & Accessibility) *</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Required for 100% SEO</span>
                </div>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe this image for visually impaired users & Google Search (e.g. Master weaver creating Crimson Banarasi silk saree)"
                  value={newAltText}
                  onChange={(e) => setNewAltText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Asset Title</label>
                <input
                  type="text"
                  placeholder="Crimson Banarasi Saree Hero"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-fancy-blue"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Editorial Caption (Optional)</label>
                <input
                  type="text"
                  placeholder="Authentic Silk Mark certified master weaver collection"
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-fancy-blue"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-fancy-blue hover:bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20"
                >
                  Save to Media Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Metadata Modal */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-fadeIn">
            <h2 className="text-lg font-black text-white flex items-center space-x-2 mb-1">
              <Edit className="w-5 h-5 text-fancy-blue" />
              <span>Edit Asset Metadata</span>
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Update Title, Alt Text, and Folder categorization.
            </p>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Asset Title</label>
                <input
                  type="text"
                  value={editingAsset.title}
                  onChange={(e) => setEditingAsset({ ...editingAsset, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Folder</label>
                <select
                  value={editingAsset.folder}
                  onChange={(e) => setEditingAsset({ ...editingAsset, folder: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                >
                  <option value="Banners">Banners</option>
                  <option value="Products">Products</option>
                  <option value="Artisans">Artisans</option>
                  <option value="Logos">Logos</option>
                  <option value="Campaigns">Campaigns</option>
                </select>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-amber-500/30">
                <label className="block font-bold text-amber-400 mb-1">Image Alt Text (SEO & A11y)</label>
                <textarea
                  rows={2}
                  value={editingAsset.altText || ""}
                  onChange={(e) => setEditingAsset({ ...editingAsset, altText: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Caption</label>
                <input
                  type="text"
                  value={editingAsset.caption || ""}
                  onChange={(e) => setEditingAsset({ ...editingAsset, caption: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingAsset(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-5 py-2 rounded-xl bg-fancy-blue hover:bg-blue-600 text-white font-bold shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-white">{previewAsset.title}</h3>
                <p className="text-xs text-slate-400">{previewAsset.dimensions.width}×{previewAsset.dimensions.height}px • {Math.round(previewAsset.fileSize / 1024)} KB</p>
              </div>
              <button
                onClick={() => setPreviewAsset(null)}
                className="px-3 py-1 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="bg-slate-950 rounded-2xl p-2 flex items-center justify-center max-h-[60vh] overflow-hidden mb-4">
              <img src={previewAsset.url} alt={previewAsset.altText} className="max-h-[55vh] object-contain rounded-xl" />
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
              <div className="truncate mr-4 text-slate-400 font-mono">{previewAsset.url}</div>
              <button
                onClick={() => copyToClipboard(previewAsset.url, "modal-copy")}
                className="px-3 py-1.5 bg-fancy-blue text-white rounded-lg font-bold shrink-0 flex items-center space-x-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy URL</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
