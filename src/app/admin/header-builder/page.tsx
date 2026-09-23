"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
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
  Search,
  ShoppingCart,
  Heart,
  User,
  MapPin,
  Store,
  ShieldCheck,
  Menu,
  Sparkle,
  SlidersHorizontal,
  ChevronDown,
  Layout,
  Tag,
  Mic,
  Camera,
  Layers2,
  Move,
  SmartphoneNfc,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";
import {
  DEFAULT_HEADER_ELEMENTS,
  HeaderElementConfig,
  HeaderElementKey,
  HeaderBuilderConfig,
} from "@/lib/header-builder-types";

export default function AdminHeaderBuilder() {
  const [elements, setElements] = useState<HeaderElementConfig[]>(DEFAULT_HEADER_ELEMENTS);
  const [selectedKey, setSelectedKey] = useState<HeaderElementKey>("HAMBURGER_MENU");
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [desktopLayoutType, setDesktopLayoutType] = useState<"standard" | "compact" | "centered_logo" | "minimal">("standard");
  const [mobileLayoutType, setMobileLayoutType] = useState<"standard" | "compact_search" | "inline_search" | "minimal" | "bottom_bar">("standard");
  const [isSticky, setIsSticky] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Drag & Drop state
  const [draggedKey, setDraggedKey] = useState<HeaderElementKey | null>(null);
  const [dragOverKey, setDragOverKey] = useState<HeaderElementKey | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchHeaderConfig = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/header");
      const data = await res.json();
      if (data.success && data.header) {
        if (data.header.elements) setElements(data.header.elements);
        if (data.header.desktopLayoutType) setDesktopLayoutType(data.header.desktopLayoutType);
        if (data.header.mobileLayoutType) setMobileLayoutType(data.header.mobileLayoutType);
        if (data.header.isSticky !== undefined) setIsSticky(data.header.isSticky);
      }
    } catch (e) {
      console.error("Failed to load header config", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHeaderConfig();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/header", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          elements,
          desktopLayoutType,
          mobileLayoutType,
          isSticky,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("🚀 Header configuration saved! Desktop and Mobile layouts updated.");
      }
    } catch (e) {
      showToast("Error saving header");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (!confirm("Reset all 12 header components and responsive layouts to default?")) return;
    setElements(DEFAULT_HEADER_ELEMENTS);
    setDesktopLayoutType("standard");
    setMobileLayoutType("standard");
    setIsSticky(true);
    showToast("Reset to default header layout");
  };

  const isDesktop = viewport === "desktop";

  const handleMoveElement = (index: number, direction: "up" | "down") => {
    const sorted = [...elements].sort((a, b) =>
      isDesktop ? a.desktopSortOrder - b.desktopSortOrder : a.mobileSortOrder - b.mobileSortOrder
    );

    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;

    const sourceEl = sorted[index];
    const targetEl = sorted[targetIdx];

    const updated = elements.map((el) => {
      if (el.key === sourceEl.key) {
        return isDesktop
          ? { ...el, desktopSortOrder: targetEl.desktopSortOrder }
          : { ...el, mobileSortOrder: targetEl.mobileSortOrder };
      }
      if (el.key === targetEl.key) {
        return isDesktop
          ? { ...el, desktopSortOrder: sourceEl.desktopSortOrder }
          : { ...el, mobileSortOrder: sourceEl.mobileSortOrder };
      }
      return el;
    });

    setElements(updated);
  };

  // Drag & Drop Reorder Handlers (Independent for Desktop and Mobile)
  const handleDragStart = (e: React.DragEvent, key: HeaderElementKey) => {
    e.dataTransfer.setData("text/plain", key);
    e.dataTransfer.effectAllowed = "move";
    setDraggedKey(key);
  };

  const handleDragOver = (e: React.DragEvent, key: HeaderElementKey) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverKey !== key) {
      setDragOverKey(key);
    }
  };

  const handleDrop = (e: React.DragEvent, targetKey: HeaderElementKey) => {
    e.preventDefault();
    const sourceKey = draggedKey;
    if (!sourceKey || sourceKey === targetKey) {
      setDraggedKey(null);
      setDragOverKey(null);
      return;
    }

    const sorted = [...elements].sort((a, b) =>
      isDesktop ? a.desktopSortOrder - b.desktopSortOrder : a.mobileSortOrder - b.mobileSortOrder
    );

    const sourceIdx = sorted.findIndex((el) => el.key === sourceKey);
    const targetIdx = sorted.findIndex((el) => el.key === targetKey);

    if (sourceIdx < 0 || targetIdx < 0) {
      setDraggedKey(null);
      setDragOverKey(null);
      return;
    }

    const reordered = [...sorted];
    const [removed] = reordered.splice(sourceIdx, 1);
    reordered.splice(targetIdx, 0, removed);

    const updated = elements.map((el) => {
      const newPos = reordered.findIndex((item) => item.key === el.key);
      return isDesktop
        ? { ...el, desktopSortOrder: newPos }
        : { ...el, mobileSortOrder: newPos };
    });

    setElements(updated);
    setDraggedKey(null);
    setDragOverKey(null);
    showToast(`Moved ${removed.name} to position #${targetIdx + 1} (${isDesktop ? "Desktop" : "Mobile"})`);
  };

  const handleDragEnd = () => {
    setDraggedKey(null);
    setDragOverKey(null);
  };

  const handleToggleVisibility = (key: HeaderElementKey) => {
    setElements((prev) =>
      prev.map((el) => {
        if (el.key === key) {
          return isDesktop
            ? { ...el, desktopVisible: !el.desktopVisible }
            : { ...el, mobileVisible: !el.mobileVisible };
        }
        return el;
      })
    );
  };

  const selectedElement = elements.find((el) => el.key === selectedKey);
  const getElement = (key: HeaderElementKey) => elements.find((el) => el.key === key);

  const sortedElements = [...elements].sort((a, b) =>
    isDesktop ? a.desktopSortOrder - b.desktopSortOrder : a.mobileSortOrder - b.mobileSortOrder
  );

  // Filter elements for main bar view
  const mainRowKeys: HeaderElementKey[] = [
    "HAMBURGER_MENU",
    "LOGO",
    "LOCATION",
    "SEARCH",
    "ACCOUNT",
    "WISHLIST",
    "CART",
    "VENDOR_PORTAL",
    "ADMIN_ERP",
  ];

  const sortedMainRowElements = sortedElements.filter((el) => mainRowKeys.includes(el.key));

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
              <span className="text-base font-black text-white">Header & Mobile Builder</span>
              <span className="text-[10px] bg-fancy-blue/20 text-fancy-blue font-bold px-2 py-0.5 rounded-full border border-fancy-blue/30">
                Independent Responsive Config
              </span>
            </div>
          </div>
        </div>

        {/* Viewports (Desktop vs Mobile Mode) */}
        <div className="flex items-center bg-slate-800/90 p-1 rounded-2xl border border-slate-700 space-x-1 text-xs">
          <button
            onClick={() => setViewport("desktop")}
            className={`px-4 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition ${
              viewport === "desktop" ? "bg-fancy-blue text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop Header</span>
          </button>
          <button
            onClick={() => setViewport("mobile")}
            className={`px-4 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition ${
              viewport === "mobile" ? "bg-fancy-blue text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Header</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold flex items-center space-x-1 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-fancy-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black flex items-center space-x-1.5 shadow-lg active:scale-95 transition disabled:opacity-40"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? "Saving..." : "Save Header"}</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN 3-COLUMN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: REORDERABLE HEADER COMPONENTS WITH INDEPENDENT DESKTOP / MOBILE LAYERS */}
        <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full flex-shrink-0 z-20">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-black text-white flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-fancy-blue" />
              <span>{isDesktop ? "Desktop Layers" : "Mobile Layers (Independent)"}</span>
            </span>
            <span className="text-[10px] text-fancy-orange font-bold uppercase tracking-wider">
              {isDesktop ? "Desktop Mode" : "Mobile Mode"}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {sortedElements.map((el, idx) => {
              const isVisible = isDesktop ? el.desktopVisible : el.mobileVisible;
              const isDragging = draggedKey === el.key;
              const isOver = dragOverKey === el.key;

              return (
                <div
                  key={el.key}
                  draggable
                  onDragStart={(e) => handleDragStart(e, el.key)}
                  onDragOver={(e) => handleDragOver(e, el.key)}
                  onDrop={(e) => handleDrop(e, el.key)}
                  onDragEnd={handleDragEnd}
                  onClick={() => setSelectedKey(el.key)}
                  className={`p-2.5 rounded-2xl border transition cursor-grab active:cursor-grabbing flex items-center justify-between ${
                    isDragging
                      ? "opacity-30 border-dashed border-fancy-blue bg-slate-800"
                      : isOver
                      ? "bg-slate-800/80 border-fancy-blue ring-2 ring-fancy-blue scale-[1.02]"
                      : selectedKey === el.key
                      ? "bg-slate-800 border-fancy-blue ring-1 ring-fancy-blue shadow"
                      : "bg-slate-950 border-slate-800/80 hover:border-slate-700"
                  } ${!isVisible ? "opacity-35" : ""}`}
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <GripVertical className="w-3.5 h-3.5 text-slate-500 cursor-grab" />
                    <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div className="truncate">
                      <span className="font-bold text-white text-xs block truncate">{el.name}</span>
                      <span className="text-[9px] text-fancy-blue font-mono">{el.key}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleMoveElement(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-20"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleMoveElement(idx, "down")}
                      disabled={idx === sortedElements.length - 1}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-20"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleToggleVisibility(el.key)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                      title={isVisible ? "Visible on " + (isDesktop ? "Desktop" : "Mobile") : "Hidden on " + (isDesktop ? "Desktop" : "Mobile")}
                    >
                      {isVisible ? (
                        <Eye className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* CENTER COLUMN: LIVE INTERACTIVE RESPONSIVE CANVAS */}
        <main className="flex-1 bg-slate-950/60 p-4 md:p-8 flex flex-col items-center justify-start overflow-y-auto">
          {/* Responsive Mode Banner */}
          <div className="mb-4 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl flex items-center space-x-2 text-xs text-slate-400">
            {isDesktop ? <Monitor className="w-4 h-4 text-fancy-blue" /> : <SmartphoneNfc className="w-4 h-4 text-fancy-orange" />}
            <span>
              {isDesktop ? (
                <>Configuring <strong>Desktop Header</strong> layout. Drag elements or toggle visibility independently.</>
              ) : (
                <>Configuring dedicated <strong>Mobile Header (☰, Logo, Search, Wishlist, Cart)</strong> layout.</>
              )}
            </span>
          </div>

          <div
            className={`transition-all duration-300 bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col ${
              !isDesktop ? "w-[375px] max-w-[375px]" : "w-full max-w-5xl"
            }`}
          >
            {/* Top Announcement Bar */}
            {((isDesktop && getElement("ANNOUNCEMENT_BAR")?.desktopVisible) ||
              (!isDesktop && getElement("ANNOUNCEMENT_BAR")?.mobileVisible)) && (
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "ANNOUNCEMENT_BAR")}
                onDragOver={(e) => handleDragOver(e, "ANNOUNCEMENT_BAR")}
                onDrop={(e) => handleDrop(e, "ANNOUNCEMENT_BAR")}
                onDragEnd={handleDragEnd}
                onClick={() => setSelectedKey("ANNOUNCEMENT_BAR")}
                className={`py-2 px-4 text-center text-xs font-bold transition flex items-center justify-center space-x-2 cursor-grab active:cursor-grabbing ${
                  selectedKey === "ANNOUNCEMENT_BAR" ? "ring-2 ring-fancy-blue" : ""
                } ${dragOverKey === "ANNOUNCEMENT_BAR" ? "ring-4 ring-fancy-orange scale-[1.01]" : ""}`}
                style={{
                  backgroundColor: getElement("ANNOUNCEMENT_BAR")?.settings.bgColor || "#0A1128",
                  color: getElement("ANNOUNCEMENT_BAR")?.settings.textColor || "#FFFFFF",
                }}
              >
                <span className="bg-fancy-orange text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                  {getElement("ANNOUNCEMENT_BAR")?.settings.badge || "FESTIVE"}
                </span>
                <span className="truncate">{getElement("ANNOUNCEMENT_BAR")?.settings.text}</span>
              </div>
            )}

            {/* Main Navbar Row (DETERMINED INDEPENDENTLY BY DESKTOP/MOBILE SORT ORDER) */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 flex-wrap">
              {sortedMainRowElements.map((el) => {
                const isVisible = isDesktop ? el.desktopVisible : el.mobileVisible;
                if (!isVisible) return null;

                const isOver = dragOverKey === el.key;

                // 0. HAMBURGER MENU (☰)
                if (el.key === "HAMBURGER_MENU") {
                  return (
                    <div
                      key={el.key}
                      draggable
                      onDragStart={(e) => handleDragStart(e, "HAMBURGER_MENU")}
                      onDragOver={(e) => handleDragOver(e, "HAMBURGER_MENU")}
                      onDrop={(e) => handleDrop(e, "HAMBURGER_MENU")}
                      onDragEnd={handleDragEnd}
                      onClick={() => setSelectedKey("HAMBURGER_MENU")}
                      className={`p-1.5 rounded-xl border border-transparent cursor-grab active:cursor-grabbing transition flex items-center ${
                        selectedKey === "HAMBURGER_MENU" ? "ring-2 ring-fancy-blue bg-slate-900" : "hover:bg-slate-900"
                      } ${isOver ? "border-fancy-orange ring-2 ring-fancy-orange scale-105" : ""}`}
                      title="Drag to Reorder Hamburger Menu (☰)"
                    >
                      <GripVertical className="w-3 h-3 text-slate-600 mr-0.5" />
                      <Menu className="w-6 h-6 text-white" />
                    </div>
                  );
                }

                // 1. LOGO
                if (el.key === "LOGO") {
                  return (
                    <div
                      key={el.key}
                      draggable
                      onDragStart={(e) => handleDragStart(e, "LOGO")}
                      onDragOver={(e) => handleDragOver(e, "LOGO")}
                      onDrop={(e) => handleDrop(e, "LOGO")}
                      onDragEnd={handleDragEnd}
                      onClick={() => setSelectedKey("LOGO")}
                      className={`flex items-center space-x-1 cursor-grab active:cursor-grabbing p-1.5 rounded-xl border border-transparent transition ${
                        selectedKey === "LOGO" ? "ring-2 ring-fancy-blue bg-slate-900" : "hover:bg-slate-900"
                      } ${isOver ? "border-fancy-orange ring-2 ring-fancy-orange scale-105" : ""}`}
                      title="Drag to Reorder Logo"
                    >
                      <GripVertical className="w-3 h-3 text-slate-600 mr-0.5" />
                      <span className="text-xl font-black text-white">
                        {el.settings.text || "FancyHub"}
                        <span className="text-fancy-orange">{el.settings.subtext || ".in"}</span>
                      </span>
                    </div>
                  );
                }

                // 2. LOCATION
                if (el.key === "LOCATION") {
                  return (
                    <div
                      key={el.key}
                      draggable
                      onDragStart={(e) => handleDragStart(e, "LOCATION")}
                      onDragOver={(e) => handleDragOver(e, "LOCATION")}
                      onDrop={(e) => handleDrop(e, "LOCATION")}
                      onDragEnd={handleDragEnd}
                      onClick={() => setSelectedKey("LOCATION")}
                      className={`flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs cursor-grab active:cursor-grabbing transition ${
                        selectedKey === "LOCATION" ? "ring-2 ring-fancy-blue" : "hover:border-slate-700"
                      } ${isOver ? "border-fancy-orange ring-2 ring-fancy-orange scale-105" : ""}`}
                      title="Drag to Reorder Location"
                    >
                      <GripVertical className="w-3 h-3 text-slate-600 mr-0.5" />
                      <MapPin className="w-3.5 h-3.5 text-fancy-blue" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Deliver to</span>
                        <span className="font-bold text-white text-xs">
                          {el.settings.defaultCity || "Surat"} ({el.settings.defaultPincode || "395003"})
                        </span>
                      </div>
                    </div>
                  );
                }

                // 3. SEARCH
                if (el.key === "SEARCH") {
                  return (
                    <div
                      key={el.key}
                      draggable
                      onDragStart={(e) => handleDragStart(e, "SEARCH")}
                      onDragOver={(e) => handleDragOver(e, "SEARCH")}
                      onDrop={(e) => handleDrop(e, "SEARCH")}
                      onDragEnd={handleDragEnd}
                      onClick={() => setSelectedKey("SEARCH")}
                      className={`${isDesktop ? "flex-1 min-w-[200px] max-w-md" : "w-full order-last mt-1"} relative cursor-grab active:cursor-grabbing transition ${
                        selectedKey === "SEARCH" ? "ring-2 ring-fancy-blue rounded-xl" : ""
                      } ${isOver ? "ring-2 ring-fancy-orange scale-[1.02]" : ""}`}
                      title="Drag to Reorder Search"
                    >
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        readOnly
                        placeholder={el.settings.placeholder || "Search products..."}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-14 py-2 text-xs text-white placeholder-slate-500 cursor-grab"
                      />
                      <div className="absolute right-2 top-2 flex items-center space-x-1 text-slate-400">
                        <Mic className="w-3.5 h-3.5" />
                        <Camera className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                }

                // 4. ACCOUNT
                if (el.key === "ACCOUNT") {
                  return (
                    <div
                      key={el.key}
                      draggable
                      onDragStart={(e) => handleDragStart(e, "ACCOUNT")}
                      onDragOver={(e) => handleDragOver(e, "ACCOUNT")}
                      onDrop={(e) => handleDrop(e, "ACCOUNT")}
                      onDragEnd={handleDragEnd}
                      onClick={() => setSelectedKey("ACCOUNT")}
                      className={`flex items-center space-x-1.5 text-slate-300 p-1.5 rounded-xl cursor-grab active:cursor-grabbing border border-transparent transition ${
                        selectedKey === "ACCOUNT" ? "ring-2 ring-fancy-blue bg-slate-900" : "hover:bg-slate-900"
                      } ${isOver ? "border-fancy-orange ring-2 ring-fancy-orange scale-105" : ""}`}
                      title="Drag to Reorder Account"
                    >
                      <GripVertical className="w-3 h-3 text-slate-600 mr-0.5" />
                      <User className="w-4 h-4" />
                      {isDesktop && <span className="text-xs font-bold">Account</span>}
                    </div>
                  );
                }

                // 5. WISHLIST
                if (el.key === "WISHLIST") {
                  return (
                    <div
                      key={el.key}
                      draggable
                      onDragStart={(e) => handleDragStart(e, "WISHLIST")}
                      onDragOver={(e) => handleDragOver(e, "WISHLIST")}
                      onDrop={(e) => handleDrop(e, "WISHLIST")}
                      onDragEnd={handleDragEnd}
                      onClick={() => setSelectedKey("WISHLIST")}
                      className={`relative text-slate-300 p-1.5 rounded-xl cursor-grab active:cursor-grabbing border border-transparent transition flex items-center ${
                        selectedKey === "WISHLIST" ? "ring-2 ring-fancy-blue bg-slate-900" : "hover:bg-slate-900"
                      } ${isOver ? "border-fancy-orange ring-2 ring-fancy-orange scale-105" : ""}`}
                      title="Drag to Reorder Wishlist"
                    >
                      <GripVertical className="w-3 h-3 text-slate-600 mr-0.5" />
                      <Heart className="w-5 h-5 text-slate-300" />
                      <span className="ml-1 bg-fancy-orange text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        2
                      </span>
                    </div>
                  );
                }

                // 6. CART
                if (el.key === "CART") {
                  return (
                    <div
                      key={el.key}
                      draggable
                      onDragStart={(e) => handleDragStart(e, "CART")}
                      onDragOver={(e) => handleDragOver(e, "CART")}
                      onDrop={(e) => handleDrop(e, "CART")}
                      onDragEnd={handleDragEnd}
                      onClick={() => setSelectedKey("CART")}
                      className={`bg-fancy-blue text-white px-3 py-1.5 rounded-xl flex items-center space-x-1.5 shadow cursor-grab active:cursor-grabbing transition ${
                        selectedKey === "CART" ? "ring-2 ring-white" : ""
                      } ${isOver ? "ring-2 ring-fancy-orange scale-105" : ""}`}
                      title="Drag to Reorder Cart"
                    >
                      <GripVertical className="w-3 h-3 text-blue-200" />
                      <ShoppingCart className="w-4 h-4" />
                      <span className="text-xs font-bold">{isDesktop ? "Cart (3)" : "3"}</span>
                    </div>
                  );
                }

                // 7. VENDOR_PORTAL
                if (el.key === "VENDOR_PORTAL" && isDesktop) {
                  return (
                    <div
                      key={el.key}
                      draggable
                      onDragStart={(e) => handleDragStart(e, "VENDOR_PORTAL")}
                      onDragOver={(e) => handleDragOver(e, "VENDOR_PORTAL")}
                      onDrop={(e) => handleDrop(e, "VENDOR_PORTAL")}
                      onDragEnd={handleDragEnd}
                      onClick={() => setSelectedKey("VENDOR_PORTAL")}
                      className={`text-slate-400 hover:text-white p-1.5 rounded-xl cursor-grab active:cursor-grabbing border border-transparent transition flex items-center ${
                        selectedKey === "VENDOR_PORTAL" ? "ring-2 ring-fancy-blue bg-slate-900" : "hover:bg-slate-900"
                      } ${isOver ? "border-fancy-orange ring-2 ring-fancy-orange scale-105" : ""}`}
                      title="Drag to Reorder Vendor Portal"
                    >
                      <GripVertical className="w-3 h-3 text-slate-600 mr-0.5" />
                      <Store className="w-4 h-4 inline mr-1 text-emerald-400" />
                      <span className="text-xs font-bold">{el.settings.label || "Sell"}</span>
                    </div>
                  );
                }

                // 8. ADMIN_ERP
                if (el.key === "ADMIN_ERP" && isDesktop) {
                  return (
                    <div
                      key={el.key}
                      draggable
                      onDragStart={(e) => handleDragStart(e, "ADMIN_ERP")}
                      onDragOver={(e) => handleDragOver(e, "ADMIN_ERP")}
                      onDrop={(e) => handleDrop(e, "ADMIN_ERP")}
                      onDragEnd={handleDragEnd}
                      onClick={() => setSelectedKey("ADMIN_ERP")}
                      className={`text-slate-400 hover:text-white p-1.5 rounded-xl cursor-grab active:cursor-grabbing border border-transparent transition flex items-center ${
                        selectedKey === "ADMIN_ERP" ? "ring-2 ring-fancy-blue bg-slate-900" : "hover:bg-slate-900"
                      } ${isOver ? "border-fancy-orange ring-2 ring-fancy-orange scale-105" : ""}`}
                      title="Drag to Reorder Admin ERP"
                    >
                      <GripVertical className="w-3 h-3 text-slate-600 mr-0.5" />
                      <ShieldCheck className="w-4 h-4 inline mr-1 text-purple-400" />
                      <span className="text-xs font-bold">{el.settings.label || "ERP"}</span>
                    </div>
                  );
                }

                return null;
              })}
            </div>

            {/* Navigation Strip & Mega Menu (Desktop Only) */}
            {isDesktop && getElement("NAVIGATION")?.desktopVisible && (
              <div
                onClick={() => setSelectedKey("NAVIGATION")}
                className={`bg-slate-900/90 px-4 py-2 flex items-center justify-between text-xs font-bold text-slate-300 border-b border-slate-800 cursor-pointer ${
                  selectedKey === "NAVIGATION" ? "ring-2 ring-fancy-blue" : ""
                }`}
              >
                <div className="flex items-center space-x-6">
                  {getElement("MEGA_MENU")?.desktopVisible && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedKey("MEGA_MENU");
                      }}
                      className={`flex items-center space-x-1 text-fancy-blue font-black p-1 rounded-lg ${
                        selectedKey === "MEGA_MENU" ? "ring-2 ring-fancy-blue" : ""
                      }`}
                    >
                      <Menu className="w-3.5 h-3.5" />
                      <span>All Departments</span>
                    </div>
                  )}

                  <span className="text-fancy-orange">⚡ Flash Deals</span>
                  <span>Handloom Sarees</span>
                  <span>Kurtas & Menswear</span>
                  <span>5G Mobile Phones</span>
                  <span>Custom Print Studio</span>
                  <span>Verified Indian Artisans</span>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* RIGHT COLUMN: INSPECTOR */}
        <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full flex-shrink-0 z-20 overflow-y-auto p-4 space-y-4 text-xs">
          {selectedElement ? (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] text-fancy-blue font-mono font-bold uppercase tracking-wider block">
                  {selectedElement.key}
                </span>
                <h3 className="font-black text-white text-sm">{selectedElement.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedElement.description}</p>
              </div>

              {/* Visibility Switches (Desktop vs Mobile) */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Independent Device Visibility
                </span>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-white">Visible on Desktop Header</span>
                  <input
                    type="checkbox"
                    checked={selectedElement.desktopVisible}
                    onChange={() => {
                      setElements((prev) =>
                        prev.map((el) =>
                          el.key === selectedElement.key ? { ...el, desktopVisible: !el.desktopVisible } : el
                        )
                      );
                    }}
                    className="w-4 h-4 accent-fancy-blue"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-white">Visible on Mobile Header</span>
                  <input
                    type="checkbox"
                    checked={selectedElement.mobileVisible}
                    onChange={() => {
                      setElements((prev) =>
                        prev.map((el) =>
                          el.key === selectedElement.key ? { ...el, mobileVisible: !el.mobileVisible } : el
                        )
                      );
                    }}
                    className="w-4 h-4 accent-fancy-blue"
                  />
                </label>
              </div>

              {/* Element Specific Parameters */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Element Settings
                </span>

                {/* 0. HAMBURGER_MENU */}
                {selectedElement.key === "HAMBURGER_MENU" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1 text-[11px]">Drawer Title</label>
                      <input
                        type="text"
                        value={selectedElement.settings.drawerTitle || "FancyHub Navigation"}
                        onChange={(e) => {
                          const val = e.target.value;
                          setElements((prev) =>
                            prev.map((el) =>
                              el.key === "HAMBURGER_MENU"
                                ? { ...el, settings: { ...el.settings, drawerTitle: val } }
                                : el
                            )
                          );
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* 1. ANNOUNCEMENT_BAR */}
                {selectedElement.key === "ANNOUNCEMENT_BAR" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1 text-[11px]">Marquee Text</label>
                      <input
                        type="text"
                        value={selectedElement.settings.text || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setElements((prev) =>
                            prev.map((el) =>
                              el.key === "ANNOUNCEMENT_BAR"
                                ? { ...el, settings: { ...el.settings, text: val } }
                                : el
                            )
                          );
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold text-slate-300 mb-1 text-[11px]">Badge Text</label>
                        <input
                          type="text"
                          value={selectedElement.settings.badge || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setElements((prev) =>
                              prev.map((el) =>
                                el.key === "ANNOUNCEMENT_BAR"
                                  ? { ...el, settings: { ...el.settings, badge: val } }
                                  : el
                              )
                            );
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-300 mb-1 text-[11px]">Link URL</label>
                        <input
                          type="text"
                          value={selectedElement.settings.link || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setElements((prev) =>
                              prev.map((el) =>
                                el.key === "ANNOUNCEMENT_BAR"
                                  ? { ...el, settings: { ...el.settings, link: val } }
                                  : el
                              )
                            );
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. LOGO */}
                {selectedElement.key === "LOGO" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold text-slate-300 mb-1 text-[11px]">Main Text</label>
                        <input
                          type="text"
                          value={selectedElement.settings.text || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setElements((prev) =>
                              prev.map((el) =>
                                el.key === "LOGO" ? { ...el, settings: { ...el.settings, text: val } } : el
                              )
                            );
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-300 mb-1 text-[11px]">Accent Subtext</label>
                        <input
                          type="text"
                          value={selectedElement.settings.subtext || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setElements((prev) =>
                              prev.map((el) =>
                                el.key === "LOGO" ? { ...el, settings: { ...el.settings, subtext: val } } : el
                              )
                            );
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. SEARCH */}
                {selectedElement.key === "SEARCH" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1 text-[11px]">Search Placeholder</label>
                      <input
                        type="text"
                        value={selectedElement.settings.placeholder || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setElements((prev) =>
                            prev.map((el) =>
                              el.key === "SEARCH"
                                ? { ...el, settings: { ...el.settings, placeholder: val } }
                                : el
                            )
                          );
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* 4. WISHLIST */}
                {selectedElement.key === "WISHLIST" && (
                  <div className="space-y-2">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-slate-300 text-[11px] font-bold">Show Item Counter Badge</span>
                      <input
                        type="checkbox"
                        checked={selectedElement.settings.showBadgeCount ?? true}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setElements((prev) =>
                            prev.map((el) =>
                              el.key === "WISHLIST"
                                ? { ...el, settings: { ...el.settings, showBadgeCount: checked } }
                                : el
                            )
                          );
                        }}
                        className="w-3.5 h-3.5 accent-fancy-blue"
                      />
                    </label>
                  </div>
                )}

                {/* 5. CART */}
                {selectedElement.key === "CART" && (
                  <div className="space-y-2">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-slate-300 text-[11px] font-bold">Show Item Counter</span>
                      <input
                        type="checkbox"
                        checked={selectedElement.settings.showItemCount ?? true}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setElements((prev) =>
                            prev.map((el) =>
                              el.key === "CART"
                                ? { ...el, settings: { ...el.settings, showItemCount: checked } }
                                : el
                            )
                          );
                        }}
                        className="w-3.5 h-3.5 accent-fancy-blue"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">Select any header element to customize</div>
          )}
        </aside>
      </div>

      {/* TOAST ALERT */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-slide-up">
          <Sparkles className="w-4 h-4 text-fancy-blue" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
