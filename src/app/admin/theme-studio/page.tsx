"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Palette,
  Sparkles,
  Smartphone,
  Tablet,
  Monitor,
  Check,
  RotateCcw,
  Save,
  Sliders,
  Type,
  Layers,
  Sun,
  Moon,
  Droplet,
  Search,
  ShoppingCart,
  Heart,
  Tag,
  Star,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Info,
  SlidersHorizontal,
  Square,
  CircleDot,
  MousePointerClick,
  Ban,
  ArrowRight,
  Zap,
  Box,
  Image as ImageIcon,
  ShieldCheck,
  Compass,
  X,
  LayoutGrid,
  Eye,
  EyeOff,
  Laptop,
  Download,
  Upload,
  Copy,
  Code,
  FileCode,
  Lock,
  RefreshCw,
} from "lucide-react";
import {
  THEME_PRESETS,
  ThemeTokens,
  getThemeCssVariables,
  TypographyRoleKey,
  TypographyRoleConfig,
  TypographyConfig,
  DEFAULT_TYPOGRAPHY_CONFIG,
  ButtonConfig,
  ButtonStyleType,
  ButtonShape,
  ButtonShadow,
  DEFAULT_BUTTON_CONFIG,
  CardConfig,
  CardPresetType,
  CARD_PRESETS,
  DEFAULT_CARD_CONFIG,
  AppearanceMode,
  ThemeModePreference,
  GlassyModeConfig,
  DEFAULT_GLASSY_CONFIG,
  GlassyPresetType,
  GlassyShadowStrength,
  GlassyBackgroundGradient,
  GlassySettingsConfig,
  GLASSY_PRESETS,
  DEFAULT_GLASSY_SETTINGS,
  UniversalSectionSettings,
  DEFAULT_SECTION_SETTINGS,
  SectionLayoutType,
  SectionColumnType,
  ResponsiveVisibility,
  MobileSpecificContent,
} from "@/lib/theme-engine";
import { sanitizeCustomCss, validateThemeImportPackage } from "@/lib/cms-governance-types";

export default function AdminThemeStudioPage() {
  const [tokens, setTokens] = useState<ThemeTokens>(THEME_PRESETS["fancyhub-classic"]);
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState<
    "presets" | "darkmode" | "sections" | "glassy" | "cards" | "buttons" | "typography" | "colors" | "customcss" | "customjs"
  >("presets");
  const [selectedTypoRole, setSelectedTypoRole] = useState<TypographyRoleKey>("H1");
  const [previewPresetKey, setPreviewPresetKey] = useState<string | null>(null);
  const [sectionSettings, setSectionSettings] = useState<UniversalSectionSettings>(DEFAULT_SECTION_SETTINGS);

  // CMS Governance States (Sections 44, 45, 48, 49, 50)
  const [customCssInput, setCustomCssInput] = useState("");
  const [cssValidationMsg, setCssValidationMsg] = useState<string | null>(null);
  const [customJsInput, setCustomJsInput] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const [cloneThemeName, setCloneThemeName] = useState("FancyHub Festival 2026");

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/admin/theme")
      .then((res) => res.json())
      .then((data) => {
        if (data.theme) {
          setTokens({
            ...data.theme,
            typography: data.theme.typography || DEFAULT_TYPOGRAPHY_CONFIG,
            buttons: data.theme.buttons || DEFAULT_BUTTON_CONFIG,
            cards: data.theme.cards || DEFAULT_CARD_CONFIG,
            glassyConfig: data.theme.glassyConfig || DEFAULT_GLASSY_CONFIG,
            glassySettings: data.theme.glassySettings || DEFAULT_GLASSY_SETTINGS,
            defaultSectionSettings: data.theme.defaultSectionSettings || DEFAULT_SECTION_SETTINGS,
            modePreference: data.theme.modePreference || "system",
            appearanceMode: (data.theme.appearanceMode || (data.theme.activeMode === "dark" ? "DARK" : data.theme.activeMode === "glassy" ? "GLASSY" : "NORMAL")) as AppearanceMode,
          });
          if (data.theme.customCss) setCustomCssInput(data.theme.customCss);
          if (data.theme.defaultSectionSettings) {
            setSectionSettings(data.theme.defaultSectionSettings);
          }
        }
      })
      .catch(() => {});
  }, []);

  const currentThemeToRender = previewPresetKey && THEME_PRESETS[previewPresetKey]
    ? THEME_PRESETS[previewPresetKey]
    : tokens;

  const typography = currentThemeToRender.typography || DEFAULT_TYPOGRAPHY_CONFIG;
  const buttons = currentThemeToRender.buttons || DEFAULT_BUTTON_CONFIG;
  const cards = currentThemeToRender.cards || DEFAULT_CARD_CONFIG;
  const glassySettings = currentThemeToRender.glassySettings || DEFAULT_GLASSY_SETTINGS;
  const currentMode: AppearanceMode = currentThemeToRender.appearanceMode || (currentThemeToRender.activeMode === "dark" ? "DARK" : currentThemeToRender.activeMode === "glassy" ? "GLASSY" : "NORMAL");
  const modePreference: ThemeModePreference = currentThemeToRender.modePreference || "system";

  const handleSetModePreference = (pref: ThemeModePreference) => {
    if (pref === "dark") {
      setTokens((prev) => ({
        ...prev,
        modePreference: "dark",
        appearanceMode: "DARK",
        activeMode: "dark",
        activePreset: "fancyhub-dark",
        backgroundColor: "#0A0F1D",
        surfaceColor: "#111827",
        cardColor: "#1E293B",
        textColor: "#F9FAFB",
        mutedTextColor: "#94A3B8",
        borderColor: "#334155",
      }));
    } else if (pref === "light") {
      setTokens((prev) => ({
        ...prev,
        modePreference: "light",
        appearanceMode: "NORMAL",
        activeMode: "light",
        backgroundColor: "#F8FAFC",
        surfaceColor: "#FFFFFF",
        cardColor: "#FFFFFF",
        textColor: "#0F172A",
        mutedTextColor: "#64748B",
        borderColor: "#E2E8F0",
      }));
    } else {
      setTokens((prev) => ({
        ...prev,
        modePreference: "system",
      }));
    }
  };

  const handleApplyPreset = (presetKey: string) => {
    const pst = THEME_PRESETS[presetKey];
    if (!pst) return;
    setTokens({
      ...pst,
      activePreset: presetKey,
      typography: pst.typography || DEFAULT_TYPOGRAPHY_CONFIG,
      buttons: pst.buttons || DEFAULT_BUTTON_CONFIG,
      cards: pst.cards || DEFAULT_CARD_CONFIG,
      glassyConfig: pst.glassyConfig || DEFAULT_GLASSY_CONFIG,
      glassySettings: pst.glassySettings || DEFAULT_GLASSY_SETTINGS,
      defaultSectionSettings: pst.defaultSectionSettings || DEFAULT_SECTION_SETTINGS,
    });
    setPreviewPresetKey(null);
  };

  // Instant state updaters (Section 65)
  const updateColorToken = (key: keyof ThemeTokens, value: string) => {
    setTokens((prev) => ({ ...prev, [key]: value }));
  };

  const updateButtonConfig = (updates: Partial<ButtonConfig>) => {
    setTokens((prev) => ({
      ...prev,
      buttons: {
        ...(prev.buttons || DEFAULT_BUTTON_CONFIG),
        ...updates,
      },
      borderRadius: updates.borderRadius || prev.borderRadius,
    }));
  };

  const updateCardConfig = (updates: Partial<CardConfig>) => {
    setTokens((prev) => ({
      ...prev,
      cards: {
        ...(prev.cards || DEFAULT_CARD_CONFIG),
        ...updates,
      },
    }));
  };

  const updateGlassySettings = (updates: Partial<GlassySettingsConfig>) => {
    setTokens((prev) => ({
      ...prev,
      glassySettings: {
        ...(prev.glassySettings || DEFAULT_GLASSY_SETTINGS),
        ...updates,
      },
      glassyBlur: updates.blurIntensity ?? prev.glassyBlur,
      glassyOpacity: updates.glassOpacity ?? prev.glassyOpacity,
    }));
  };

  const updateTypographyConfig = (updates: Partial<TypographyConfig>) => {
    setTokens((prev) => ({
      ...prev,
      fontFamily: updates.headingFontFamily || prev.fontFamily,
      typography: {
        ...(prev.typography || DEFAULT_TYPOGRAPHY_CONFIG),
        ...updates,
      },
    }));
  };

  const updateTypographyRole = (role: TypographyRoleKey, updates: Partial<TypographyRoleConfig>) => {
    setTokens((prev) => {
      const currentTypo = prev.typography || DEFAULT_TYPOGRAPHY_CONFIG;
      return {
        ...prev,
        typography: {
          ...currentTypo,
          roles: {
            ...currentTypo.roles,
            [role]: {
              ...currentTypo.roles[role],
              ...updates,
            },
          },
        },
      };
    });
  };

  const handleSaveTheme = async () => {
    setIsSaving(true);
    try {
      const sanitized = sanitizeCustomCss(customCssInput);
      if (!sanitized.isValid) {
        setCssValidationMsg(sanitized.error || "Invalid CSS");
        setIsSaving(false);
        return;
      }

      await fetch("/api/admin/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...tokens,
          customCss: customCssInput,
          defaultSectionSettings: sectionSettings,
        }),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e) {
      console.error("Save theme failed:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportTheme = () => {
    window.open("/api/admin/theme/export", "_blank");
  };

  const handleImportThemeSubmit = async () => {
    try {
      const parsed = JSON.parse(importJsonText);
      const res = await fetch("/api/admin/theme/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      const data = await res.json();
      if (data.success && data.theme) {
        setTokens(data.theme);
        setShowImportModal(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      } else {
        alert(data.error || "Import failed");
      }
    } catch (e: any) {
      alert("Invalid JSON format: " + e.message);
    }
  };

  const handleCloneThemeSubmit = async () => {
    try {
      const res = await fetch("/api/admin/theme/duplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourcePresetKey: tokens.activePreset,
          newThemeName: cloneThemeName,
        }),
      });
      const data = await res.json();
      if (data.success && data.theme) {
        setTokens(data.theme);
        setShowCloneModal(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (e) {
      console.error("Clone failed:", e);
    }
  };

  const handleResetTheme = async (scope: "THEME" | "PAGE" | "SECTION") => {
    try {
      const res = await fetch("/api/admin/theme/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope }),
      });
      const data = await res.json();
      if (data.success) {
        if (scope === "THEME") {
          setTokens(THEME_PRESETS["fancyhub-classic"]);
        }
        setShowResetModal(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (e) {
      console.error("Reset failed:", e);
    }
  };

  const previewStyles = getThemeCssVariables(currentThemeToRender);
  const activeCols =
    deviceView === "mobile"
      ? sectionSettings.responsive?.mobile?.columns || 2
      : deviceView === "tablet"
      ? sectionSettings.responsive?.tablet?.columns || 3
      : sectionSettings.responsive?.desktop?.columns || 4;

  const cardShadowMap: Record<string, string> = {
    none: "none",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    glow: "0 0 25px rgba(20, 85, 217, 0.35)",
    glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* 1. TOP CONTROL BAR */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 md:px-8 flex items-center justify-between z-30 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/pages"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4 text-fancy-blue" />
              <h1 className="text-sm md:text-base font-black text-white">FancyHub Theme Studio 2.0</h1>
              <span className="text-[10px] bg-fancy-blue/20 text-fancy-blue font-bold px-2.5 py-0.5 rounded-full border border-fancy-blue/30">
                INSTANT LIVE PREVIEW
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Active: {tokens.name} • {tokens.activePreset} • {modePreference.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Viewport device switcher */}
        <div className="hidden md:flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setDeviceView("desktop")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
              deviceView === "desktop" ? "bg-fancy-blue text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setDeviceView("tablet")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
              deviceView === "tablet" ? "bg-fancy-blue text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet</span>
          </button>
          <button
            onClick={() => setDeviceView("mobile")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
              deviceView === "mobile" ? "bg-fancy-blue text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportTheme}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center space-x-1 transition"
            title="Export Theme JSON Package"
          >
            <Download className="w-3.5 h-3.5 text-fancy-blue" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center space-x-1 transition"
            title="Import Theme JSON Package"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Import</span>
          </button>

          <button
            onClick={() => setShowCloneModal(true)}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center space-x-1 transition"
            title="Duplicate / Clone Current Theme"
          >
            <Copy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Clone</span>
          </button>

          <button
            onClick={() => setShowResetModal(true)}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center space-x-1 transition"
            title="Reset Theme or Sections"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={handleSaveTheme}
            disabled={isSaving}
            className="px-4 py-2 bg-gradient-to-r from-fancy-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-lg active:scale-95 transition disabled:opacity-50"
          >
            {saveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{saveSuccess ? "Published!" : isSaving ? "Saving..." : "Publish"}</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN STUDIO BODY */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Customizer Sidebar */}
        <div className="w-full lg:w-96 bg-slate-900 border-r border-slate-800 flex flex-col h-auto lg:h-[calc(100vh-4rem)] overflow-y-auto flex-shrink-0">
          {/* Subsystem Tabs Row 1 */}
          <div className="grid grid-cols-4 p-2 border-b border-slate-800 text-[11px] font-bold text-center gap-1">
            <button
              onClick={() => setActiveTab("presets")}
              className={`py-2 rounded-lg transition ${
                activeTab === "presets" ? "bg-fancy-blue text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              5 Presets
            </button>
            <button
              onClick={() => setActiveTab("darkmode")}
              className={`py-2 rounded-lg transition ${
                activeTab === "darkmode" ? "bg-fancy-blue text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Dark Mode
            </button>
            <button
              onClick={() => setActiveTab("sections")}
              className={`py-2 rounded-lg transition ${
                activeTab === "sections" ? "bg-fancy-blue text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Sections
            </button>
            <button
              onClick={() => setActiveTab("glassy")}
              className={`py-2 rounded-lg transition ${
                activeTab === "glassy" ? "bg-slate-800 text-cyan-400" : "text-slate-400 hover:text-white"
              }`}
            >
              Glassy
            </button>
          </div>

          {/* Subsystem Tabs Row 2 */}
          <div className="grid grid-cols-4 p-2 border-b border-slate-800 text-[10px] font-bold text-center gap-1">
            <button
              onClick={() => setActiveTab("cards")}
              className={`py-1.5 rounded-lg transition ${
                activeTab === "cards" ? "bg-slate-800 text-fancy-blue" : "text-slate-400 hover:text-white"
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setActiveTab("buttons")}
              className={`py-1.5 rounded-lg transition ${
                activeTab === "buttons" ? "bg-slate-800 text-fancy-blue" : "text-slate-400 hover:text-white"
              }`}
            >
              Buttons
            </button>
            <button
              onClick={() => setActiveTab("typography")}
              className={`py-1.5 rounded-lg transition ${
                activeTab === "typography" ? "bg-slate-800 text-fancy-blue" : "text-slate-400 hover:text-white"
              }`}
            >
              Fonts
            </button>
            <button
              onClick={() => setActiveTab("colors")}
              className={`py-1.5 rounded-lg transition ${
                activeTab === "colors" ? "bg-slate-800 text-fancy-blue" : "text-slate-400 hover:text-white"
              }`}
            >
              Colors
            </button>
          </div>

          {/* Subsystem Tabs Row 3 (Governance Tabs) */}
          <div className="grid grid-cols-2 p-2 border-b border-slate-800 text-[10px] font-bold text-center gap-1 bg-slate-950/40">
            <button
              onClick={() => setActiveTab("customcss")}
              className={`py-1.5 rounded-lg transition flex items-center justify-center space-x-1 ${
                activeTab === "customcss" ? "bg-slate-800 text-emerald-400" : "text-slate-400 hover:text-white"
              }`}
            >
              <Code className="w-3 h-3" />
              <span>Advanced CSS</span>
            </button>
            <button
              onClick={() => setActiveTab("customjs")}
              className={`py-1.5 rounded-lg transition flex items-center justify-center space-x-1 ${
                activeTab === "customjs" ? "bg-slate-800 text-rose-400" : "text-slate-400 hover:text-white"
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>Custom JS / Tags</span>
            </button>
          </div>

          {/* Tab Contents */}
          <div className="p-5 space-y-5 text-xs">
            {/* TAB 1: 5 PRESETS */}
            {activeTab === "presets" && (
              <div className="space-y-4">
                <span className="font-black text-slate-300 text-xs block uppercase tracking-wider">
                  5 Curated Presets
                </span>
                <div className="space-y-2.5">
                  {Object.entries(THEME_PRESETS).map(([k, p]) => (
                    <div
                      key={k}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                        tokens.activePreset === k
                          ? "bg-slate-800 border-fancy-blue ring-1 ring-fancy-blue"
                          : "bg-slate-950 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{p.name}</span>
                        <button
                          onClick={() => handleApplyPreset(k)}
                          className="px-2.5 py-1 bg-fancy-blue hover:bg-blue-600 text-white rounded-lg text-[10px] font-bold"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: DARK MODE */}
            {activeTab === "darkmode" && (
              <div className="space-y-4">
                <span className="font-black text-slate-300 text-xs block uppercase tracking-wider">
                  Dark Mode & Appearance
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(["light", "dark", "system"] as ThemeModePreference[]).map((pref) => (
                    <button
                      key={pref}
                      onClick={() => handleSetModePreference(pref)}
                      className={`p-3 rounded-xl border font-bold capitalize transition text-center ${
                        modePreference === pref
                          ? "bg-fancy-blue text-white border-fancy-blue shadow"
                          : "bg-slate-950 text-slate-400 border-slate-800"
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: GLOBAL COLORS (Section 18 & 65) */}
            {activeTab === "colors" && (
              <div className="space-y-4">
                <span className="font-black text-slate-300 text-xs block uppercase tracking-wider">
                  15 Global Color Tokens
                </span>
                <div className="space-y-3">
                  {[
                    { key: "primaryColor" as keyof ThemeTokens, label: "Primary Color", val: currentThemeToRender.primaryColor },
                    { key: "secondaryColor" as keyof ThemeTokens, label: "Secondary Color", val: currentThemeToRender.secondaryColor },
                    { key: "accentColor" as keyof ThemeTokens, label: "Accent Color", val: currentThemeToRender.accentColor },
                    { key: "backgroundColor" as keyof ThemeTokens, label: "Background Color", val: currentThemeToRender.backgroundColor },
                    { key: "surfaceColor" as keyof ThemeTokens, label: "Surface Color", val: currentThemeToRender.surfaceColor },
                    { key: "cardColor" as keyof ThemeTokens, label: "Card Color", val: currentThemeToRender.cardColor },
                    { key: "textColor" as keyof ThemeTokens, label: "Text Color", val: currentThemeToRender.textColor },
                    { key: "mutedTextColor" as keyof ThemeTokens, label: "Muted Text Color", val: currentThemeToRender.mutedTextColor },
                    { key: "borderColor" as keyof ThemeTokens, label: "Border Color", val: currentThemeToRender.borderColor },
                    { key: "buttonColor" as keyof ThemeTokens, label: "Button Background", val: currentThemeToRender.buttonColor },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                      <div>
                        <span className="font-bold text-white text-xs block">{item.label}</span>
                        <span className="text-[10px] font-mono text-slate-400">{item.val}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={item.val}
                          onChange={(e) => updateColorToken(item.key, e.target.value)}
                          className="w-7 h-7 rounded-lg border-0 bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={item.val}
                          onChange={(e) => updateColorToken(item.key, e.target.value)}
                          className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-[10px]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: TYPOGRAPHY / FONTS (Section 19 & 65) */}
            {activeTab === "typography" && (
              <div className="space-y-4">
                <span className="font-black text-slate-300 text-xs block uppercase tracking-wider">
                  Typography & Font Families
                </span>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Heading Font Family</label>
                    <select
                      value={typography.headingFontFamily}
                      onChange={(e) => updateTypographyConfig({ headingFontFamily: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Playfair Display">Playfair Display (Festive Heritage)</option>
                      <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                      <option value="Cinzel">Cinzel (Royal Indian)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Body Font Family</label>
                    <select
                      value={typography.bodyFontFamily}
                      onChange={(e) => updateTypographyConfig({ bodyFontFamily: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                      <option value="system-ui">System UI</option>
                    </select>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Select Role to Customize</label>
                    <div className="grid grid-cols-5 gap-1 text-[10px] font-bold text-center">
                      {(["H1", "H2", "H3", "Body", "Button"] as TypographyRoleKey[]).map((r) => (
                        <button
                          key={r}
                          onClick={() => setSelectedTypoRole(r)}
                          className={`py-1 rounded-lg border ${
                            selectedTypoRole === r ? "bg-fancy-blue text-white border-fancy-blue" : "bg-slate-950 text-slate-400 border-slate-800"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Role Detail Editor */}
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <span className="font-bold text-white text-xs block">{selectedTypoRole} Role Settings</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Font Size</label>
                        <input
                          type="text"
                          value={typography.roles[selectedTypoRole]?.fontSize || "1rem"}
                          onChange={(e) => updateTypographyRole(selectedTypoRole, { fontSize: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-[10px]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Line Height</label>
                        <input
                          type="text"
                          value={typography.roles[selectedTypoRole]?.lineHeight || "1.5"}
                          onChange={(e) => updateTypographyRole(selectedTypoRole, { lineHeight: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-[10px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: BUTTONS & RADIUS (Section 20 & 65) */}
            {activeTab === "buttons" && (
              <div className="space-y-4">
                <span className="font-black text-slate-300 text-xs block uppercase tracking-wider">
                  Button Shapes & Radius
                </span>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Button Shape</label>
                    <div className="grid grid-cols-5 gap-1">
                      {(["rounded", "pill", "square", "leaf", "minimal"] as ButtonShape[]).map((shape) => (
                        <button
                          key={shape}
                          onClick={() => {
                            const radiusMap: Record<ButtonShape, string> = {
                              rounded: "0.75rem",
                              pill: "9999px",
                              square: "0.25rem",
                              leaf: "1rem 0.25rem 1rem 0.25rem",
                              minimal: "0.35rem",
                            };
                            updateButtonConfig({ shape, borderRadius: radiusMap[shape] });
                          }}
                          className={`py-1.5 rounded-lg border font-bold capitalize text-[10px] transition ${
                            buttons.shape === shape ? "bg-fancy-blue text-white border-fancy-blue" : "bg-slate-950 border-slate-800 text-slate-400"
                          }`}
                        >
                          {shape}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                      <span>Border Radius</span>
                      <span className="font-mono text-fancy-blue">{buttons.borderRadius}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={parseInt(buttons.borderRadius) || 12}
                      onChange={(e) => updateButtonConfig({ borderRadius: `${e.target.value}px` })}
                      className="w-full accent-fancy-blue"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Button Shadow Elevation</label>
                    <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                      {(["none", "sm", "md", "lg", "glow", "neon"] as ButtonShadow[]).map((sh) => (
                        <button
                          key={sh}
                          onClick={() => updateButtonConfig({ shadow: sh })}
                          className={`py-1.5 rounded-lg border font-bold uppercase transition ${
                            buttons.shadow === sh ? "bg-fancy-blue text-white border-fancy-blue" : "bg-slate-950 border-slate-800 text-slate-400"
                          }`}
                        >
                          {sh}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: CARDS & SHADOW (Section 21 & 65) */}
            {activeTab === "cards" && (
              <div className="space-y-4">
                <span className="font-black text-slate-300 text-xs block uppercase tracking-wider">
                  Card Presets & Shadows
                </span>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">5 Card Presets</label>
                    <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                      {(["classic", "minimal", "soft", "glass", "premium"] as CardPresetType[]).map((preset) => (
                        <button
                          key={preset}
                          onClick={() => {
                            const config = CARD_PRESETS[preset];
                            if (config) updateCardConfig(config);
                          }}
                          className="py-1.5 rounded-lg border bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 capitalize font-bold"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                      <span>Card Border Radius</span>
                      <span className="font-mono text-fancy-blue">{cards.borderRadius}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={parseInt(cards.borderRadius) || 16}
                      onChange={(e) => updateCardConfig({ borderRadius: `${e.target.value}px` })}
                      className="w-full accent-fancy-blue"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                      <span>Card Image Corner Radius</span>
                      <span className="font-mono text-fancy-blue">{cards.imageRadius}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="24"
                      value={parseInt(cards.imageRadius) || 12}
                      onChange={(e) => updateCardConfig({ imageRadius: `${e.target.value}px` })}
                      className="w-full accent-fancy-blue"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Card Shadow</label>
                    <div className="grid grid-cols-4 gap-1 text-[10px]">
                      {(["none", "sm", "md", "lg", "xl", "glow", "glass"] as const).map((sh) => (
                        <button
                          key={sh}
                          onClick={() => updateCardConfig({ shadow: sh as any })}
                          className={`py-1.5 rounded-lg border font-bold uppercase transition ${
                            cards.shadow === sh ? "bg-fancy-blue text-white border-fancy-blue" : "bg-slate-950 border-slate-800 text-slate-400"
                          }`}
                        >
                          {sh}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: GLASSY MODE (Section 22, 23 & 65) */}
            {activeTab === "glassy" && (
              <div className="space-y-4">
                <span className="font-black text-slate-300 text-xs block uppercase tracking-wider">
                  Glassy OS Mode & Blur Sliders
                </span>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="font-bold text-white text-xs">Appearance Mode</span>
                    <select
                      value={currentMode}
                      onChange={(e) => {
                        const newMode = e.target.value as AppearanceMode;
                        setTokens((prev) => ({
                          ...prev,
                          appearanceMode: newMode,
                          activeMode: newMode === "DARK" ? "dark" : newMode === "GLASSY" ? "glassy" : "light",
                        }));
                      }}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold text-xs"
                    >
                      <option value="NORMAL">NORMAL</option>
                      <option value="DARK">DARK</option>
                      <option value="GLASSY">GLASSY</option>
                    </select>
                  </div>

                  {/* 4 Glassy Presets */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">4 Glassy Presets</label>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      {(["light-glass", "premium-glass", "deep-glass", "color-glass"] as GlassyPresetType[]).map((preset) => (
                        <button
                          key={preset}
                          onClick={() => {
                            const config = GLASSY_PRESETS[preset];
                            if (config) updateGlassySettings(config);
                          }}
                          className="py-1.5 rounded-lg border bg-slate-950 border-slate-800 text-cyan-300 hover:text-white capitalize font-bold"
                        >
                          {preset.replace("-", " ")}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Blur Intensity Slider */}
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                      <span>Blur Intensity</span>
                      <span className="font-mono text-cyan-400">{glassySettings.blurIntensity}px</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="48"
                      value={glassySettings.blurIntensity}
                      onChange={(e) => updateGlassySettings({ blurIntensity: Number(e.target.value) })}
                      className="w-full accent-cyan-400"
                    />
                  </div>

                  {/* Card Transparency Slider */}
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                      <span>Card Transparency</span>
                      <span className="font-mono text-cyan-400">{Math.round(glassySettings.cardTransparency * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={glassySettings.cardTransparency}
                      onChange={(e) => updateGlassySettings({ cardTransparency: Number(e.target.value) })}
                      className="w-full accent-cyan-400"
                    />
                  </div>

                  {/* Border Opacity Slider */}
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                      <span>Border Opacity</span>
                      <span className="font-mono text-cyan-400">{Math.round(glassySettings.borderOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.9"
                      step="0.05"
                      value={glassySettings.borderOpacity}
                      onChange={(e) => updateGlassySettings({ borderOpacity: Number(e.target.value) })}
                      className="w-full accent-cyan-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SECTIONS & RESPONSIVE */}
            {activeTab === "sections" && (
              <div className="space-y-4">
                <span className="font-black text-slate-300 text-xs block uppercase tracking-wider">
                  Section Layout & Columns
                </span>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Section Layout</label>
                    <select
                      value={sectionSettings.layout}
                      onChange={(e) => setSectionSettings({ ...sectionSettings, layout: e.target.value as SectionLayoutType })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
                    >
                      <option value="boxed">Boxed (Contained)</option>
                      <option value="full-width">Full Width</option>
                      <option value="screen-fit">Screen Fit</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div>
                      <label className="font-bold text-slate-400 block mb-1">Desktop Cols</label>
                      <input
                        type="number"
                        min="1"
                        max="6"
                        value={sectionSettings.responsive?.desktop?.columns || 4}
                        onChange={(e) => setSectionSettings({
                          ...sectionSettings,
                          responsive: {
                            ...sectionSettings.responsive,
                            desktop: { ...sectionSettings.responsive?.desktop, columns: Number(e.target.value) as any }
                          }
                        })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-400 block mb-1">Tablet Cols</label>
                      <input
                        type="number"
                        min="1"
                        max="4"
                        value={sectionSettings.responsive?.tablet?.columns || 3}
                        onChange={(e) => setSectionSettings({
                          ...sectionSettings,
                          responsive: {
                            ...sectionSettings.responsive,
                            tablet: { ...sectionSettings.responsive?.tablet, columns: Number(e.target.value) as any }
                          }
                        })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-400 block mb-1">Mobile Cols</label>
                      <input
                        type="number"
                        min="1"
                        max="2"
                        value={sectionSettings.responsive?.mobile?.columns || 2}
                        onChange={(e) => setSectionSettings({
                          ...sectionSettings,
                          responsive: {
                            ...sectionSettings.responsive,
                            mobile: { ...sectionSettings.responsive?.mobile, columns: Number(e.target.value) as any }
                          }
                        })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CUSTOM CSS (Section 44) */}
            {activeTab === "customcss" && (
              <div className="space-y-4">
                <div className="p-3.5 bg-amber-950/40 border border-amber-800/80 rounded-2xl flex items-start space-x-2.5 text-amber-300">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-xs block">Advanced CSS Warning</span>
                    <p className="text-[11px] opacity-90 leading-relaxed mt-0.5">
                      Advanced CSS can affect website layout across all pages. Unsafe script injections or arbitrary server imports are blocked.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-300 block">Scoped CSS Editor</label>
                  <textarea
                    rows={10}
                    value={customCssInput}
                    onChange={(e) => {
                      setCustomCssInput(e.target.value);
                      const res = sanitizeCustomCss(e.target.value);
                      setCssValidationMsg(res.isValid ? null : res.error || null);
                    }}
                    placeholder=":root { /* custom styles */ } .hero-badge { transform: rotate(1deg); }"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 font-mono text-xs text-emerald-400 leading-relaxed"
                  />
                  {cssValidationMsg && (
                    <span className="text-[11px] text-rose-400 font-bold block">{cssValidationMsg}</span>
                  )}
                </div>
              </div>
            )}

            {/* TAB: CUSTOM JS / ANALYTICS (Section 45) */}
            {activeTab === "customjs" && (
              <div className="space-y-4">
                <div className="p-3.5 bg-rose-950/40 border border-rose-800/80 rounded-2xl flex items-start space-x-2.5 text-rose-300">
                  <Lock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-xs block">Super Admin Authorization Required</span>
                    <p className="text-[11px] opacity-90 leading-relaxed mt-0.5">
                      Custom JavaScript is restricted to Super Admins. Arbitrary database and server commands are prohibited. Controlled client analytics tags are permitted.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Google Tag / GA4 ID</label>
                    <input
                      type="text"
                      placeholder="e.g. G-XXXXXXXXXX"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Meta Pixel ID</label>
                    <input
                      type="text"
                      placeholder="e.g. 123456789012345"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Live Canvas Preview */}
        <main
          className="flex-1 p-4 md:p-8 flex flex-col items-center justify-start overflow-y-auto"
          style={{
            background:
              currentMode === "GLASSY"
                ? "radial-gradient(at 10% 20%, rgba(37, 99, 235, 0.15) 0px, transparent 50%), radial-gradient(at 90% 80%, rgba(249, 115, 22, 0.15) 0px, transparent 50%), radial-gradient(at 50% 50%, rgba(6, 182, 212, 0.1) 0px, transparent 50%), #0B1120"
                : currentMode === "DARK"
                ? "#030712"
                : "#F1F5F9",
          }}
        >
          <div
            className={`transition-all duration-300 rounded-3xl overflow-hidden shadow-2xl border flex flex-col relative ${
              deviceView === "mobile"
                ? "w-[375px] max-w-[375px]"
                : deviceView === "tablet"
                ? "w-[768px] max-w-[768px]"
                : "w-full max-w-5xl"
            }`}
            style={{
              backgroundColor: currentMode === "GLASSY" ? "rgba(15, 23, 42, 0.65)" : currentThemeToRender.backgroundColor,
              color: currentMode === "GLASSY" ? "#F8FAFC" : currentThemeToRender.textColor,
              borderColor: currentMode === "GLASSY" ? "rgba(255, 255, 255, 0.15)" : currentThemeToRender.borderColor,
              backdropFilter: currentMode === "GLASSY" ? `blur(${glassySettings.blurIntensity}px)` : "none",
              fontFamily: currentThemeToRender.fontFamily,
              borderRadius: glassySettings.cornerRadius,
              ...(previewStyles as any),
            }}
          >
            {/* 1. Header Bar */}
            <div className="p-4 flex items-center justify-between relative z-20">
              <div
                className="w-full p-3 px-5 flex items-center justify-between transition-all duration-300 rounded-2xl border shadow-xl backdrop-blur-2xl"
                style={{
                  backgroundColor:
                    currentMode === "GLASSY"
                      ? `rgba(255, 255, 255, ${glassySettings.navbarTransparency * 0.25})`
                      : currentThemeToRender.surfaceColor,
                  borderColor:
                    currentMode === "GLASSY" ? `rgba(255, 255, 255, ${glassySettings.borderOpacity})` : currentThemeToRender.borderColor,
                  backdropFilter: currentMode === "GLASSY" ? `blur(${glassySettings.blurIntensity}px)` : "none",
                }}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl font-black" style={{ color: currentThemeToRender.primaryColor }}>
                    Fancy<span style={{ color: currentThemeToRender.secondaryColor }}>Hub.in</span>
                  </span>
                  <span
                    className="text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider"
                    style={{
                      backgroundColor: currentMode === "GLASSY" ? "rgba(6, 182, 212, 0.2)" : `${currentThemeToRender.accentColor}20`,
                      color: currentMode === "GLASSY" ? "#22D3EE" : currentThemeToRender.accentColor,
                      borderColor: currentMode === "GLASSY" ? "rgba(6, 182, 212, 0.4)" : "transparent",
                    }}
                  >
                    {currentThemeToRender.name}
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <button
                    className="px-4 py-2 rounded-xl font-bold flex items-center space-x-1.5 shadow-lg border"
                    style={{
                      backgroundColor: currentThemeToRender.buttonColor || currentThemeToRender.primaryColor,
                      borderColor: "rgba(255, 255, 255, 0.4)",
                      color: "#FFFFFF",
                      borderRadius: buttons.borderRadius,
                    }}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Cart (3)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Responsive Product Showcase Grid */}
            <div className="p-6 md:p-8 space-y-8 relative z-10">
              <div
                className="p-6 md:p-8 rounded-3xl border relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl"
                style={{
                  backgroundColor:
                    currentMode === "GLASSY"
                      ? `rgba(255, 255, 255, ${glassySettings.cardTransparency * 0.15})`
                      : currentThemeToRender.cardColor,
                  borderColor: `rgba(255, 255, 255, ${glassySettings.borderOpacity})`,
                  backdropFilter: `blur(${glassySettings.blurIntensity}px)`,
                }}
              >
                <div className="space-y-2 max-w-xl">
                  <span
                    className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full text-white shadow"
                    style={{ backgroundColor: currentThemeToRender.secondaryColor }}
                  >
                    {sectionSettings.mobileContent?.mobileText || "SURAT HERITAGE WEAVERS"}
                  </span>
                  <h2 className="text-xl md:text-2xl font-black" style={{ color: currentMode === "GLASSY" ? "#FFFFFF" : currentThemeToRender.textColor }}>
                    Handcrafted Pure Silk & Zari Sarees
                  </h2>
                  <p className="text-xs leading-relaxed" style={{ color: currentMode === "GLASSY" ? "#94A3B8" : currentThemeToRender.mutedTextColor }}>
                    Layout: {sectionSettings.layout} • Columns: {activeCols} ({deviceView}) • Mode: {modePreference}
                  </p>
                </div>

                <div
                  className="w-48 h-32 md:w-64 md:h-40 rounded-2xl overflow-hidden shadow-2xl border flex-shrink-0"
                  style={{ borderColor: `rgba(255, 255, 255, ${glassySettings.borderOpacity})` }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80"
                    alt="Silk Saree"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Dynamic Responsive Columns Grid */}
              <div
                className={`grid gap-5 ${
                  activeCols === 1
                    ? "grid-cols-1"
                    : activeCols === 2
                    ? "grid-cols-2"
                    : activeCols === 3
                    ? "grid-cols-3"
                    : "grid-cols-4"
                }`}
              >
                {[
                  {
                    title: "Banarasi Pure Soft Silk Saree",
                    vendor: "Surat Silk Mills",
                    price: "₹2,499",
                    oldPrice: "₹4,999",
                    img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80",
                    badge: "50% OFF",
                  },
                  {
                    title: "AeroPods Pro ANC Earbuds",
                    vendor: "Fancy Audio Hub",
                    price: "₹1,999",
                    oldPrice: "₹3,999",
                    img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80",
                    badge: "TRENDING",
                  },
                  {
                    title: "Artisan Handcrafted Kurta",
                    vendor: "Jaipur Loom Studio",
                    price: "₹1,299",
                    oldPrice: "₹2,499",
                    img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&q=80",
                    badge: "VERIFIED",
                  },
                  {
                    title: "Kashmiri Hand-Embroidered Shawl",
                    vendor: "Srinagar Guild",
                    price: "₹3,499",
                    oldPrice: "₹6,999",
                    img: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=500&q=80",
                    badge: "EXCLUSIVE",
                  },
                ].slice(0, activeCols).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border transition duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
                    style={{
                      backgroundColor:
                        currentMode === "GLASSY"
                          ? `rgba(255, 255, 255, ${glassySettings.cardTransparency * 0.18})`
                          : currentThemeToRender.cardColor,
                      borderColor: `rgba(255, 255, 255, ${glassySettings.borderOpacity})`,
                      backdropFilter: `blur(${glassySettings.blurIntensity}px)`,
                      borderRadius: cards.borderRadius,
                      boxShadow: cardShadowMap[cards.shadow] || cardShadowMap.md,
                    }}
                  >
                    <div className="space-y-3">
                      <div
                        className="relative h-40 overflow-hidden bg-slate-800 flex items-center justify-center"
                        style={{ borderRadius: cards.imageRadius }}
                      >
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        <span
                          className="absolute top-2 left-2 text-[10px] font-black px-2 py-0.5 rounded-full text-white shadow"
                          style={{ backgroundColor: currentThemeToRender.secondaryColor }}
                        >
                          {item.badge}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: currentMode === "GLASSY" ? "#94A3B8" : currentThemeToRender.mutedTextColor }}>
                          {item.vendor}
                        </span>
                        <h4 className="font-bold text-xs line-clamp-1 mt-0.5" style={{ color: currentMode === "GLASSY" ? "#FFFFFF" : currentThemeToRender.textColor }}>
                          {item.title}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="font-black text-sm" style={{ color: currentMode === "GLASSY" ? "#38BDF8" : currentThemeToRender.primaryColor }}>
                            {item.price}
                          </span>
                          <span className="text-[10px] line-through" style={{ color: currentMode === "GLASSY" ? "#64748B" : currentThemeToRender.mutedTextColor }}>
                            {item.oldPrice}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      className="w-full mt-3 py-2 font-bold text-xs rounded-xl shadow border transition active:scale-95"
                      style={{
                        backgroundColor: currentThemeToRender.buttonColor || currentThemeToRender.primaryColor,
                        borderColor: "rgba(255, 255, 255, 0.4)",
                        color: "#FFFFFF",
                        borderRadius: buttons.borderRadius,
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL 1: RESET CONFIRMATION (Section 48) */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-black text-white text-sm">Reset System Design</span>
              <button onClick={() => setShowResetModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Select the scope you wish to reset. Database catalog items and customer records are safely preserved.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => handleResetTheme("THEME")}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition"
              >
                Reset Global Theme to Factory Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: IMPORT THEME (Section 49) */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 rounded-3xl border border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-black text-white text-sm">Import Theme JSON Package</span>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste exported Theme JSON package here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 font-mono text-xs text-emerald-400"
            />
            <button
              onClick={handleImportThemeSubmit}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition shadow"
            >
              Validate & Apply Theme
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: CLONE / DUPLICATE THEME (Section 50) */}
      {showCloneModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-black text-white text-sm">Clone / Duplicate Theme</span>
              <button onClick={() => setShowCloneModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">New Cloned Theme Name</label>
              <input
                type="text"
                value={cloneThemeName}
                onChange={(e) => setCloneThemeName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
              />
            </div>
            <button
              onClick={handleCloneThemeSubmit}
              className="w-full py-2.5 bg-fancy-blue hover:bg-blue-600 text-white font-black text-xs rounded-xl transition shadow"
            >
              Create Independent Theme Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
