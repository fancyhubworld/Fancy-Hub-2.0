"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  Copy,
  RotateCcw,
  History,
  Calendar,
  Save,
  Eye,
  Send,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
  Sparkles,
  Settings,
  Sliders,
  ChevronRight,
  ChevronLeft,
  Search,
  Check,
  X,
  ExternalLink,
  FileText,
  Palette,
  EyeOff,
  GripVertical,
  ZoomIn,
  ZoomOut,
  Bookmark,
  BookmarkPlus,
  FileCode,
  Layout,
  LayoutTemplate,
  Tag,
  Zap,
  Database,
  SmartphoneNfc,
  Type,
  ShoppingCart,
  Grid,
  Store,
  ShieldCheck,
  MessageSquare,
  Flame,
  Download,
  SlidersHorizontal,
  DollarSign,
  Star,
  Heart,
  Scale,
  Truck,
  Clock,
  Package,
  Activity,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  Video,
  Box,
  Image as ImageIcon,
} from "lucide-react";
import { SectionRenderer } from "./SectionRenderer";
import { WIDGET_REGISTRY, WIDGET_CATEGORIES } from "@/lib/widget-registry";
import { WidgetType, WidgetCategory, WidgetInstance, ProductWidgetCustomSettings } from "@/lib/widget-types";
import { BUILTIN_PAGE_TEMPLATES, PageTemplateItem, PageTemplateType } from "@/lib/page-templates";
import { ROUTES } from "@/lib/routes";
import { saveAutosaveDraft, getAutosaveDraft, clearAutosaveDraft, shouldPromptRestore, AutosaveDraft } from "@/lib/autosave-engine";
import { RESPONSIVE_BREAKPOINTS, DeviceViewportType, getViewportWidth } from "@/lib/responsive-breakpoints";
import { calculateContrastRatio } from "@/lib/a11y-engine";
import { runPageAudit, PageAuditReport } from "@/lib/page-audit-engine";
import { ANIMATION_TYPES_LIST, AnimationType, AnimationTrigger } from "@/lib/animation-system";
import { getAllMarketplacePlugins } from "@/lib/widget-marketplace-engine";

interface SectionItem {
  id: string;
  type: string;
  name?: string | null;
  status?: string;
  title: string | null;
  subtitle: string | null;
  badgeText: string | null;
  sortOrder: number;
  isActive: boolean;
  desktopVisible: boolean;
  mobileVisible: boolean;
  settings?: any;
  style?: any;
  responsiveSettings?: any;
  dataSource?: any;
  visibilityRules?: any;
  contentJson: any;
  stylingJson: any;
}

interface PageData {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  layoutType: string;
  headerStyle: string;
  footerStyle: string;
  status: string;
  isHomepage: boolean;
  scheduledAt?: string | null;
}

interface VersionItem {
  id: string;
  versionNumber: number;
  label?: string | null;
  note?: string | null;
  createdBy?: string | null;
  createdAt: string;
  snapshotJson: string;
}

interface SavedTemplateItem {
  id: string;
  name: string;
  category: string;
  type: string;
  description?: string | null;
  contentJson: any;
  stylingJson: any;
  createdAt: string;
}

interface VisualBuilderStudioProps {
  initialSlug?: string;
}

export function VisualBuilderStudio({ initialSlug = "home" }: VisualBuilderStudioProps) {
  const router = useRouter();

  // Core Data States
  const [currentSlug, setCurrentSlug] = useState<string>(initialSlug);
  const [page, setPage] = useState<PageData | null>(null);
  const [allPages, setAllPages] = useState<PageData[]>([]);
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplateItem[]>([]);
  const [pageTemplates, setPageTemplates] = useState<PageTemplateItem[]>(BUILTIN_PAGE_TEMPLATES);
  const [selectedTemplateFilter, setSelectedTemplateFilter] = useState<string>("ALL");
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [dbVendors, setDbVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Undo / Redo History Stacks
  const [historyStack, setHistoryStack] = useState<{ sections: SectionItem[]; page: PageData | null }[]>([]);
  const [redoStack, setRedoStack] = useState<{ sections: SectionItem[]; page: PageData | null }[]>([]);

  // Studio UI Controls
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [zoom, setZoom] = useState<number>(100);
  const [leftTab, setLeftTab] = useState<"widgets" | "layers" | "templates">("widgets");
  const [selectedCategory, setSelectedCategory] = useState<WidgetCategory | "ALL">("ALL");
  const [rightTab, setRightTab] = useState<"settings" | "datasource" | "styling" | "responsive" | "visibility">("settings");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Drag & Drop State
  const [draggedWidgetType, setDraggedWidgetType] = useState<WidgetType | null>(null);
  const [draggedTemplate, setDraggedTemplate] = useState<SavedTemplateItem | null>(null);
  const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Modals
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showVersionsModal, setShowVersionsModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [showDuplicatePageModal, setShowDuplicatePageModal] = useState(false);
  const [showPageTemplatesModal, setShowPageTemplatesModal] = useState(false);
  const [showSavePageTemplateModal, setShowSavePageTemplateModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showMarketplaceModal, setShowMarketplaceModal] = useState(false);

  // Section 67: Autosave & Crash Recovery State
  const [autosaveStatus, setAutosaveStatus] = useState<"SAVED" | "SAVING" | "IDLE">("IDLE");
  const [lastAutosaveTime, setLastAutosaveTime] = useState<string | null>(null);
  const [pendingRestoreDraft, setPendingRestoreDraft] = useState<AutosaveDraft | null>(null);

  // Section 68: Configurable Breakpoints Viewport Width
  const [customViewportWidth, setCustomViewportWidth] = useState<number>(1440);

  // Section 72: Live Page Audit Report
  const [auditReport, setAuditReport] = useState<PageAuditReport | null>(null);

  // Section 75: Dynamic Marketplace Plugins
  const [marketplacePlugins, setMarketplacePlugins] = useState<any[]>([]);

  // Modal Inputs
  const [versions, setVersions] = useState<VersionItem[]>([]);
  const [scheduleTime, setScheduleTime] = useState("");
  const [versionNote, setVersionNote] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [templateCategory, setTemplateCategory] = useState("CUSTOM");
  const [newPageTemplateName, setNewPageTemplateName] = useState("");
  const [newPageTemplateType, setNewPageTemplateType] = useState<PageTemplateType>("CUSTOM");
  const [newPageTemplateDesc, setNewPageTemplateDesc] = useState("");
  const [newDuplicateTitle, setNewDuplicateTitle] = useState("");
  const [newDuplicateSlug, setNewDuplicateSlug] = useState("");

  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const parseJson = (val: any) => {
    if (typeof val === "object" && val !== null) return val;
    try {
      return JSON.parse(val || "{}");
    } catch {
      return {};
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const recordHistory = () => {
    setHistoryStack((prev) => [
      ...prev.slice(-30),
      { sections: JSON.parse(JSON.stringify(sections)), page: page ? { ...page } : null },
    ]);
    setRedoStack([]);
  };

  const updateSelectedSectionSetting = (key: string, value: any) => {
    if (!selectedSectionId) return;
    recordHistory();
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== selectedSectionId) return s;
        const newSettings = { ...s.settings, [key]: value };
        return {
          ...s,
          settings: newSettings,
          contentJson: newSettings,
        };
      })
    );
  };

  const updateSelectedSectionStyle = (key: string, value: any) => {
    if (!selectedSectionId) return;
    recordHistory();
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== selectedSectionId) return s;
        const newStyle = { ...s.style, [key]: value };
        return {
          ...s,
          style: newStyle,
          stylingJson: newStyle,
        };
      })
    );
  };

  const updateSelectedSectionProperty = (key: keyof SectionItem, value: any) => {
    if (!selectedSectionId) return;
    recordHistory();
    setSections((prev) =>
      prev.map((s) => (s.id === selectedSectionId ? { ...s, [key]: value } : s))
    );
  };

  const fetchPageTemplates = async () => {
    try {
      const res = await fetch("/api/admin/page-templates");
      const data = await res.json();
      if (data.success && data.templates) {
        setPageTemplates(data.templates);
      }
    } catch (e) {}
  };

  // Fetch Page, Categories, Vendors & Templates
  const loadPageData = async (slugToLoad: string) => {
    setIsLoading(true);
    try {
      const [pagesRes, templatesRes, catsRes, vendorsRes] = await Promise.all([
        fetch("/api/admin/pages").then((r) => r.json()),
        fetch("/api/admin/templates").then((r) => r.json()).catch(() => ({ templates: [] })),
        fetch("/api/categories").then((r) => r.json()).catch(() => ({ categories: [] })),
        fetch("/api/public/dynamic-data?type=vendors").then((r) => r.json()).catch(() => ({ data: [] })),
      ]);

      if (pagesRes.pages) setAllPages(pagesRes.pages);
      if (catsRes.categories) setDbCategories(catsRes.categories);
      if (vendorsRes.data) setDbVendors(vendorsRes.data);

      if (templatesRes.templates) {
        setSavedTemplates(
          templatesRes.templates.map((t: any) => ({
            ...t,
            contentJson: parseJson(t.contentJson),
            stylingJson: parseJson(t.stylingJson),
          }))
        );
      }

      fetchPageTemplates();

      const res = await fetch(`/api/admin/sections?slug=${slugToLoad}`);
      const data = await res.json();
      if (data.sections) {
        const parsed = data.sections.map((s: any) => {
          const content = parseJson(s.contentJson);
          const styling = parseJson(s.stylingJson);
          const settings = parseJson(s.settings);
          const style = parseJson(s.style);
          const responsive = parseJson(s.responsiveSettings);
          const dataSource = parseJson(s.dataSource);
          const visibilityRules = parseJson(s.visibilityRules);

          return {
            ...s,
            title: s.title || settings.title || content.title,
            subtitle: s.subtitle || settings.subtitle || content.subtitle,
            badgeText: s.badgeText || settings.badgeText || content.badgeText,
            settings: { ...content, ...settings },
            style: { ...styling, ...style },
            responsiveSettings: responsive,
            dataSource,
            visibilityRules,
            contentJson: { ...content, ...settings },
            stylingJson: { ...styling, ...style },
          };
        });
        setSections(parsed);
        if (parsed.length > 0) setSelectedSectionId(parsed[0].id);
      }

      const matchedPage = pagesRes.pages?.find((p: any) => p.slug === slugToLoad);
      if (matchedPage) setPage(matchedPage);
    } catch (e) {
      console.error(e);
      showToast("Error loading studio data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPageData(currentSlug);
  }, [currentSlug]);

  // Check for unsaved draft restore prompt on boot
  useEffect(() => {
    if (!isLoading && currentSlug) {
      const restoreCheck = shouldPromptRestore(currentSlug);
      if (restoreCheck.shouldPrompt && restoreCheck.draft) {
        setPendingRestoreDraft(restoreCheck.draft);
      }
    }
  }, [currentSlug, isLoading]);

  // Periodic Autosave every 20 seconds
  useEffect(() => {
    if (isLoading || sections.length === 0) return;
    const interval = setInterval(() => {
      setAutosaveStatus("SAVING");
      saveAutosaveDraft(currentSlug, { sections, page });
      setTimeout(() => {
        setAutosaveStatus("SAVED");
        setLastAutosaveTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      }, 400);
    }, 20000);

    return () => clearInterval(interval);
  }, [currentSlug, sections, page, isLoading]);

  const handleRestoreAutosavedDraft = () => {
    if (!pendingRestoreDraft) return;
    recordHistory();
    if (pendingRestoreDraft.data?.sections) {
      setSections(pendingRestoreDraft.data.sections);
    }
    if (pendingRestoreDraft.data?.page) {
      setPage(pendingRestoreDraft.data.page);
    }
    setPendingRestoreDraft(null);
    showToast("Restored unsaved draft from previous session!");
  };

  const handleDismissRestoreDraft = () => {
    clearAutosaveDraft(currentSlug);
    setPendingRestoreDraft(null);
    showToast("Unsaved session backup dismissed");
  };

  const handleOpenPageAudit = () => {
    const report = runPageAudit({
      page: {
        title: page?.title,
        seoTitle: page?.seoTitle,
        seoDescription: page?.seoDescription,
        seoKeywords: page?.seoKeywords,
      },
      sections,
    });
    setAuditReport(report);
    setShowAuditModal(true);
  };

  const fetchVersions = async () => {
    if (!page?.id) return;
    try {
      const res = await fetch(`/api/admin/pages/${page.id}/versions`);
      const data = await res.json();
      if (data.versions) setVersions(data.versions);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const previous = historyStack[historyStack.length - 1];
    setRedoStack((prev) => [
      ...prev,
      { sections: JSON.parse(JSON.stringify(sections)), page: page ? { ...page } : null },
    ]);
    setHistoryStack((prev) => prev.slice(0, prev.length - 1));
    setSections(previous.sections);
    if (previous.page) setPage(previous.page);
    showToast("Undo completed");
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistoryStack((prev) => [
      ...prev,
      { sections: JSON.parse(JSON.stringify(sections)), page: page ? { ...page } : null },
    ]);
    setRedoStack((prev) => prev.slice(0, prev.length - 1));
    setSections(next.sections);
    if (next.page) setPage(next.page);
    showToast("Redo completed");
  };

  // Keyboard shortcut listener for Undo (Cmd+Z/Ctrl+Z) and Redo (Cmd+Shift+Z/Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [historyStack, redoStack, sections, page]);

  const handleReset = async () => {
    if (!confirm("Reset all visual builder changes to the last published state?")) return;
    recordHistory();
    await loadPageData(currentSlug);
    showToast("Reset to published version");
  };

  const handleDuplicateSection = (secId?: string) => {
    const targetId = secId || selectedSectionId;
    if (!targetId) {
      showToast("Select a section to duplicate");
      return;
    }
    const index = sections.findIndex((s) => s.id === targetId);
    if (index === -1) return;

    recordHistory();
    const source = sections[index];
    const duplicated: SectionItem = {
      ...JSON.parse(JSON.stringify(source)),
      id: `sec_dup_${Date.now()}`,
      title: source.title ? `${source.title} (Copy)` : `${source.type} (Copy)`,
      sortOrder: index + 1,
    };

    const copy = [...sections];
    copy.splice(index + 1, 0, duplicated);
    setSections(copy);
    setSelectedSectionId(duplicated.id);
    showToast(`Duplicated ${source.type}`);
  };

  const handleToggleHideSection = (secId: string) => {
    recordHistory();
    setSections((prev) =>
      prev.map((s) => (s.id === secId ? { ...s, isActive: !s.isActive } : s))
    );
    const target = sections.find((s) => s.id === secId);
    showToast(target?.isActive ? "Section hidden on storefront" : "Section shown on storefront");
  };

  const handleDeleteSection = (id: string) => {
    recordHistory();
    setSections((prev) => prev.filter((s) => s.id !== id));
    if (selectedSectionId === id) setSelectedSectionId(null);
    showToast("Section deleted");
  };

  const handleMoveSection = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= sections.length) return;
    recordHistory();

    const copy = [...sections];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setSections(copy);
  };

  const handleAddWidget = (type: WidgetType, insertIndex?: number) => {
    recordHistory();
    const desc = WIDGET_REGISTRY[type] || {
      name: type,
      description: "Custom Widget",
      defaultSettings: {},
      defaultStyle: { paddingY: "py-4" },
      defaultResponsive: {},
      defaultDataSource: { type: "STATIC" },
    };

    const defaultCustomProductSettings: ProductWidgetCustomSettings = {
      showPrice: true,
      showDiscount: true,
      showRating: true,
      showWishlist: true,
      showCompare: true,
      showQuickView: true,
      showAddToCart: true,
      showStock: true,
      showBadges: true,
      showVendor: true,
      showDeliveryInfo: true,
      showCountdown: false,
      desktopColumns: 4,
      tabletColumns: 3,
      mobileColumns: 2,
      cardStyle: "modern",
      imageRatio: "1:1",
      limit: 8,
    };

    const newSec: SectionItem = {
      id: `sec_${Date.now()}`,
      type,
      name: desc.name,
      status: "ACTIVE",
      title: desc.name,
      subtitle: desc.description,
      badgeText: null,
      sortOrder: insertIndex !== undefined ? insertIndex : sections.length,
      isActive: true,
      desktopVisible: true,
      mobileVisible: true,
      settings: {
        ...JSON.parse(JSON.stringify(desc.defaultSettings)),
        ...(type.includes("PRODUCT") || type.includes("DEALS") || type.includes("SELLERS") || type.includes("ARRIVALS")
          ? defaultCustomProductSettings
          : {}),
      },
      style: JSON.parse(JSON.stringify(desc.defaultStyle)),
      responsiveSettings: JSON.parse(JSON.stringify(desc.defaultResponsive || {})),
      dataSource: JSON.parse(JSON.stringify(desc.defaultDataSource || { type: "STATIC" })),
      visibilityRules: { desktop: true, tablet: true, mobile: true },
      contentJson: JSON.parse(JSON.stringify(desc.defaultSettings)),
      stylingJson: JSON.parse(JSON.stringify(desc.defaultStyle)),
    };

    if (insertIndex !== undefined) {
      const copy = [...sections];
      copy.splice(insertIndex, 0, newSec);
      setSections(copy);
    } else {
      setSections((prev) => [...prev, newSec]);
    }
    setSelectedSectionId(newSec.id);
    showToast(`Added ${desc.name}`);
  };

  const handleInsertSavedTemplate = (tmpl: SavedTemplateItem, insertIndex?: number) => {
    recordHistory();
    const newSec: SectionItem = {
      id: `sec_tmpl_${Date.now()}`,
      type: tmpl.type,
      name: tmpl.name,
      status: "ACTIVE",
      title: tmpl.name,
      subtitle: tmpl.description || null,
      badgeText: null,
      sortOrder: insertIndex !== undefined ? insertIndex : sections.length,
      isActive: true,
      desktopVisible: true,
      mobileVisible: true,
      settings: JSON.parse(JSON.stringify(tmpl.contentJson)),
      style: JSON.parse(JSON.stringify(tmpl.stylingJson || {})),
      contentJson: JSON.parse(JSON.stringify(tmpl.contentJson)),
      stylingJson: JSON.parse(JSON.stringify(tmpl.stylingJson || {})),
    };

    if (insertIndex !== undefined) {
      const copy = [...sections];
      copy.splice(insertIndex, 0, newSec);
      setSections(copy);
    } else {
      setSections((prev) => [...prev, newSec]);
    }
    setSelectedSectionId(newSec.id);
    showToast(`Inserted template "${tmpl.name}"`);
  };

  const handleApplyPageTemplate = (tpl: PageTemplateItem) => {
    if (!confirm(`Apply the "${tpl.name}" template to this page? This will load its pre-configured layout into your canvas.`)) return;

    recordHistory();
    const convertedSections: SectionItem[] = tpl.sections.map((s, idx) => {
      const desc = WIDGET_REGISTRY[s.type as WidgetType] || {
        name: s.name || s.type,
        description: s.title || "",
        defaultSettings: {},
        defaultStyle: { paddingY: "py-4" },
      };

      const settings = s.settings || desc.defaultSettings || {};
      const style = s.style || desc.defaultStyle || { paddingY: "py-4" };
      const dataSource = s.dataSource || { type: "STATIC" };

      return {
        id: `sec_tpl_${Date.now()}_${idx}`,
        type: s.type,
        name: s.name || desc.name,
        status: "ACTIVE",
        title: s.title || desc.name,
        subtitle: s.subtitle || desc.description,
        badgeText: s.badgeText || null,
        sortOrder: idx,
        isActive: true,
        desktopVisible: true,
        mobileVisible: true,
        settings,
        style,
        responsiveSettings: s.responsiveSettings || {},
        dataSource,
        visibilityRules: { desktop: true, tablet: true, mobile: true },
        contentJson: settings,
        stylingJson: style,
      };
    });

    setSections(convertedSections);
    if (convertedSections.length > 0) setSelectedSectionId(convertedSections[0].id);
    setShowPageTemplatesModal(false);
    showToast(`✨ Applied "${tpl.name}" Page Template!`);
  };

  const handleSaveCurrentPageAsTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTemplateName) return;

    try {
      const res = await fetch("/api/admin/page-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newPageTemplateName,
          type: newPageTemplateType,
          description: newPageTemplateDesc || `Custom ${newPageTemplateType} template created from ${page?.title || currentSlug}`,
          sections,
        }),
      });

      const data = await res.json();
      if (data.success && data.template) {
        setPageTemplates((prev) => [data.template, ...prev]);
        setShowSavePageTemplateModal(false);
        setNewPageTemplateName("");
        setNewPageTemplateDesc("");
        showToast(`🎉 Saved "${newPageTemplateName}" as reusable Page Template!`);
      } else {
        showToast(`Error: ${data.error}`);
      }
    } catch (err) {
      showToast("Failed to save custom page template");
    }
  };

  const handleDeletePageTemplate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this custom page template?")) return;
    try {
      await fetch(`/api/admin/page-templates/${id}`, { method: "DELETE" });
      setPageTemplates((prev) => prev.filter((t) => t.id !== id));
      showToast("Template deleted");
    } catch (e) {
      showToast("Error deleting template");
    }
  };

  const handleSaveSectionAsTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = sections.find((s) => s.id === selectedSectionId);
    if (!target || !templateName) return;

    try {
      const res = await fetch("/api/admin/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: templateName,
          category: templateCategory,
          type: target.type,
          description: target.subtitle || `Saved ${target.type} template`,
          contentJson: target.settings || target.contentJson,
          stylingJson: target.style || target.stylingJson,
        }),
      });
      const data = await res.json();
      if (data.success && data.template) {
        setSavedTemplates((prev) => [
          {
            ...data.template,
            contentJson: parseJson(data.template.contentJson),
            stylingJson: parseJson(data.template.stylingJson),
          },
          ...prev,
        ]);
        setShowSaveTemplateModal(false);
        setTemplateName("");
        showToast(`Saved "${templateName}" as reusable template!`);
      }
    } catch (e) {
      showToast("Failed to save template");
    }
  };

  const handleDuplicatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!page?.id) return;
    try {
      const res = await fetch(`/api/admin/pages/${page.id}/duplicate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newDuplicateTitle,
          slug: newDuplicateSlug,
        }),
      });
      const data = await res.json();
      if (data.success && data.page) {
        setShowDuplicatePageModal(false);
        showToast(`Page duplicated as /p/${data.page.slug}!`);
        router.push(`/admin/visual-builder?slug=${data.page.slug}`);
        setCurrentSlug(data.page.slug);
      }
    } catch (e) {
      showToast("Failed to duplicate page");
    }
  };

  const handleCanvasDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setDragOverIndex(index);
  };

  const handleCanvasDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (draggedWidgetType) {
      handleAddWidget(draggedWidgetType, targetIndex);
      setDraggedWidgetType(null);
      return;
    }

    if (draggedTemplate) {
      handleInsertSavedTemplate(draggedTemplate, targetIndex);
      setDraggedTemplate(null);
      return;
    }

    if (draggedSectionIndex !== null && draggedSectionIndex !== targetIndex) {
      recordHistory();
      const copy = [...sections];
      const [moved] = copy.splice(draggedSectionIndex, 1);
      const destination = draggedSectionIndex < targetIndex ? targetIndex - 1 : targetIndex;
      copy.splice(destination, 0, moved);
      setSections(copy);
      setDraggedSectionIndex(null);
      showToast("Section reordered");
    }
  };

  const handleSaveDraft = async () => {
    if (!page?.id) return;
    setIsSavingDraft(true);
    try {
      await fetch(`/api/admin/pages/${page.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...page, sections, isDraft: true }),
      });
      showToast("Draft saved successfully!");
    } catch (e) {
      showToast("Failed to save draft");
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handlePublish = async () => {
    if (!page?.id) return;
    setIsPublishing(true);
    try {
      await fetch(`/api/admin/pages/${page.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...page,
          sections,
          isDraft: false,
          versionLabel: versionNote || undefined,
        }),
      });
      showToast("🚀 Published Live to Website!");
      setVersionNote("");
    } catch (e) {
      showToast("Publish failed");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!page?.id || !scheduleTime) return;
    try {
      await fetch(`/api/admin/pages/${page.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...page,
          sections,
          isDraft: true,
          scheduledAt: new Date(scheduleTime).toISOString(),
        }),
      });
      setShowScheduleModal(false);
      showToast(`Scheduled for ${new Date(scheduleTime).toLocaleString()}`);
    } catch (e) {
      showToast("Scheduling failed");
    }
  };

  const selectedSection = sections.find((s) => s.id === selectedSectionId);
  const secSettings: ProductWidgetCustomSettings = selectedSection?.settings || {};

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* ========================================================
          1. TOP BAR — Viewports, Controls & Page Actions
      ======================================================== */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-40 flex-shrink-0 shadow-lg">
        {/* Left: Breadcrumbs & Page Selector */}
        <div className="flex items-center space-x-3">
          <Link
            href={ROUTES.admin.dashboard}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
            title="Back to Admin ERP"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">Admin ERP</span>
            <span className="text-[11px] text-slate-600 hidden sm:inline">→</span>
            <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">Website</span>
            <span className="text-[11px] text-slate-600 hidden sm:inline">→</span>

            <select
              value={currentSlug}
              onChange={(e) => setCurrentSlug(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white font-black text-xs rounded-xl px-3 py-1.5 outline-none focus:border-fancy-blue cursor-pointer"
            >
              {allPages.map((p) => (
                <option key={p.id} value={p.slug}>
                  {p.isHomepage ? "🏠 Homepage (/)" : `📄 ${p.title} (/p/${p.slug})`}
                </option>
              ))}
            </select>

            {/* Page Templates Selector Button */}
            <button
              onClick={() => setShowPageTemplatesModal(true)}
              className="px-2.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/40 text-indigo-300 hover:text-white font-bold text-xs flex items-center space-x-1.5 transition"
              title="Browse Page Templates"
            >
              <LayoutTemplate className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Templates</span>
            </button>

            <button
              onClick={() => {
                if (page) {
                  setNewDuplicateTitle(`${page.title} (Copy)`);
                  setNewDuplicateSlug(`${page.slug}-copy`);
                  setShowDuplicatePageModal(true);
                }
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-fancy-blue transition text-xs flex items-center space-x-1"
              title="Duplicate Current Page"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden xl:inline text-[10px] font-bold">Duplicate Page</span>
            </button>
          </div>
        </div>

        {/* Center: Viewports & Configurable Breakpoints (Desktop 1440px, Tablet 768px, Mobile 390px) */}
        <div className="flex items-center bg-slate-800/90 p-1 rounded-2xl border border-slate-700 space-x-1 text-xs">
          <button
            onClick={() => {
              setViewport("desktop");
              setCustomViewportWidth(1440);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition ${
              viewport === "desktop" ? "bg-fancy-blue text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop (1440px)</span>
          </button>
          <button
            onClick={() => {
              setViewport("tablet");
              setCustomViewportWidth(768);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition ${
              viewport === "tablet" ? "bg-fancy-blue text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tablet (768px)</span>
          </button>
          <button
            onClick={() => {
              setViewport("mobile");
              setCustomViewportWidth(390);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition ${
              viewport === "mobile" ? "bg-fancy-blue text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mobile (390px)</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-1.5 text-xs">
          {/* Autosave Status Indicator */}
          {lastAutosaveTime && (
            <div className="hidden 2xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-mono">
              <div className={`w-1.5 h-1.5 rounded-full ${autosaveStatus === "SAVING" ? "bg-amber-400 animate-ping" : "bg-emerald-400"}`} />
              <span>{autosaveStatus === "SAVING" ? "Autosaving..." : `Autosaved ${lastAutosaveTime}`}</span>
            </div>
          )}

          <button
            onClick={handleUndo}
            disabled={historyStack.length === 0}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 transition"
            title="Undo (⌘Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 transition"
            title="Redo (⌘⇧Z)"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleDuplicateSection()}
            disabled={!selectedSectionId}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 transition"
            title="Duplicate Section"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Reset to Published"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleOpenPageAudit}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 hover:text-white font-bold flex items-center space-x-1 transition"
            title="Run Real-Time Page Health, SEO & A11y Audit"
          >
            <Gauge className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xl:inline">Audit Score</span>
          </button>

          <Link
            href="/admin/media"
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold flex items-center space-x-1 transition"
            title="Media Library"
          >
            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden xl:inline">Media</span>
          </Link>

          <Link
            href="/admin/widget-marketplace"
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold flex items-center space-x-1 transition"
            title="Widget Marketplace"
          >
            <Grid className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden xl:inline">Marketplace</span>
          </Link>

          <button
            onClick={() => {
              fetchVersions();
              setShowVersionsModal(true);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold flex items-center space-x-1 transition"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">History</span>
          </button>

          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold flex items-center space-x-1 transition"
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden lg:inline">Schedule</span>
          </button>

          <button
            onClick={() => setShowPreviewModal(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold flex items-center space-x-1 transition"
          >
            <Eye className="w-3.5 h-3.5 text-fancy-blue" />
            <span className="hidden sm:inline">Preview</span>
          </button>

          <button
            onClick={handleSaveDraft}
            disabled={isSavingDraft}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center space-x-1.5 transition border border-slate-700 disabled:opacity-40"
          >
            <Save className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isSavingDraft ? "Saving..." : "Save Draft"}</span>
          </button>

          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-fancy-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black flex items-center space-x-1.5 shadow-md active:scale-95 transition disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isPublishing ? "Publishing..." : "Publish"}</span>
          </button>
        </div>
      </header>

      {/* ========================================================
          2. MAIN 3-COLUMN WORKSPACE
      ======================================================== */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ========================================================
            LEFT COLUMN: 40+ Categorized Widgets, Layers & Saved
        ======================================================== */}
        <aside className="w-88 bg-slate-900 border-r border-slate-800 flex flex-col h-full flex-shrink-0 z-20">
          <div className="grid grid-cols-3 p-2 border-b border-slate-800 text-[11px] font-bold text-center">
            <button
              onClick={() => setLeftTab("widgets")}
              className={`py-2 rounded-xl transition ${
                leftTab === "widgets" ? "bg-slate-800 text-fancy-blue shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              Widgets (40+)
            </button>
            <button
              onClick={() => setLeftTab("layers")}
              className={`py-2 rounded-xl transition ${
                leftTab === "layers" ? "bg-slate-800 text-fancy-blue shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              Layers ({sections.length})
            </button>
            <button
              onClick={() => setLeftTab("templates")}
              className={`py-2 rounded-xl transition ${
                leftTab === "templates" ? "bg-slate-800 text-amber-300 shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              Saved Blocks ({savedTemplates.length})
            </button>
          </div>

          {/* TAB 1: 40+ CATEGORIZED WIDGETS */}
          {leftTab === "widgets" && (
            <div className="flex-1 flex flex-col overflow-hidden p-3 space-y-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search 40+ widgets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-fancy-blue"
                />
              </div>

              {/* Category Pills Filter */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px] font-bold">
                <button
                  onClick={() => setSelectedCategory("ALL")}
                  className={`px-2.5 py-1 rounded-lg flex-shrink-0 transition ${
                    selectedCategory === "ALL" ? "bg-fancy-blue text-white" : "bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                >
                  All (40+)
                </button>
                {WIDGET_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg flex-shrink-0 transition ${
                      selectedCategory === cat.id ? "bg-fancy-blue text-white" : "bg-slate-950 text-slate-400 hover:text-white"
                    }`}
                  >
                    {cat.name.split(" ")[0]}
                  </button>
                ))}
              </div>

              {/* Widgets List with Drag & Drop */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {Object.entries(WIDGET_REGISTRY)
                  .filter(([type, desc]) => {
                    const matchCat = selectedCategory === "ALL" || desc.category === selectedCategory;
                    const matchSearch =
                      desc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      desc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      type.toLowerCase().includes(searchQuery.toLowerCase());
                    return matchCat && matchSearch;
                  })
                  .map(([type, desc]) => (
                    <div
                      key={type}
                      draggable
                      onDragStart={(e) => {
                        setDraggedWidgetType(type as WidgetType);
                        e.dataTransfer.setData("text/plain", type);
                      }}
                      className="p-3 bg-slate-950 hover:bg-slate-800/90 border border-slate-800 hover:border-fancy-blue rounded-2xl cursor-grab active:cursor-grabbing transition group space-y-1 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <GripVertical className="w-3.5 h-3.5 text-slate-500 group-hover:text-fancy-blue" />
                          <span className="font-bold text-xs text-white group-hover:text-fancy-blue transition">
                            {desc.name}
                          </span>
                        </div>
                        <button
                          onClick={() => handleAddWidget(type as WidgetType)}
                          className="text-[10px] bg-slate-800 hover:bg-fancy-blue text-slate-300 hover:text-white px-2 py-0.5 rounded-full font-mono transition"
                        >
                          + Add
                        </button>
                      </div>
                      <div className="flex items-center justify-between pl-5 text-[10px]">
                        <span className="text-slate-500">{desc.categoryName}</span>
                        <span className="text-[9px] text-slate-400 font-mono">{type}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 2: LAYERS TREE */}
          {leftTab === "layers" && (
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block px-1">
                Active Sections ({sections.length})
              </span>

              {sections.map((sec, idx) => (
                <div
                  key={sec.id}
                  draggable
                  onDragStart={() => setDraggedSectionIndex(idx)}
                  onDragOver={(e) => handleCanvasDragOver(e, idx)}
                  onDrop={(e) => handleCanvasDrop(e, idx)}
                  onClick={() => setSelectedSectionId(sec.id)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex flex-col space-y-2 ${
                    selectedSectionId === sec.id
                      ? "bg-slate-800 border-fancy-blue ring-1 ring-fancy-blue shadow-md"
                      : "bg-slate-950 border-slate-800/80 hover:border-slate-700"
                  } ${!sec.isActive ? "opacity-50" : ""}`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 min-w-0">
                      <GripVertical className="w-4 h-4 text-slate-500 hover:text-white cursor-grab" />
                      <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        <span className="font-black text-white text-xs block truncate">
                          {sec.title || sec.name || sec.type}
                        </span>
                        <span className="text-[10px] text-fancy-blue font-mono font-bold block">
                          {sec.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleMoveSection(idx, "up")}
                        disabled={idx === 0}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-20"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMoveSection(idx, "down")}
                        disabled={idx === sections.length - 1}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-20"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div
                    className="flex items-center justify-between pt-1.5 border-t border-slate-800/60 text-[11px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleToggleHideSection(sec.id)}
                      className={`text-xs font-bold flex items-center space-x-1 ${
                        sec.isActive ? "text-green-400" : "text-slate-500"
                      }`}
                    >
                      {sec.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{sec.isActive ? "Visible" : "Hidden"}</span>
                    </button>

                    <div className="flex items-center space-x-1.5">
                      <button onClick={() => handleDuplicateSection(sec.id)} className="text-slate-400 hover:text-white p-1">
                        <Copy className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleDeleteSection(sec.id)} className="text-red-400 hover:text-red-300 p-1">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: SAVED REUSABLE TEMPLATES */}
          {leftTab === "templates" && (
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Saved Blocks ({savedTemplates.length})
                </span>
                {selectedSectionId && (
                  <button
                    onClick={() => {
                      const sel = sections.find((s) => s.id === selectedSectionId);
                      setTemplateName(sel?.title || `${sel?.type} Template`);
                      setShowSaveTemplateModal(true);
                    }}
                    className="text-[10px] text-amber-300 font-bold hover:underline flex items-center space-x-1"
                  >
                    <BookmarkPlus className="w-3 h-3" />
                    <span>Save Selected</span>
                  </button>
                )}
              </div>

              {savedTemplates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  draggable
                  onDragStart={() => setDraggedTemplate(tmpl)}
                  className="p-3 bg-slate-950 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-400/80 rounded-2xl cursor-grab transition space-y-1.5 shadow-sm group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-bold text-xs text-white group-hover:text-amber-300">
                        {tmpl.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleInsertSavedTemplate(tmpl)}
                      className="text-[10px] bg-amber-900/40 text-amber-300 px-2 py-0.5 rounded-full font-mono font-bold hover:bg-amber-500 hover:text-black transition"
                    >
                      + Insert
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{tmpl.description}</p>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* ========================================================
            CENTER COLUMN: Live Website Canvas with Drop Zones
        ======================================================== */}
        <main
          className="flex-1 bg-slate-950/60 p-4 md:p-6 flex flex-col items-center justify-start overflow-y-auto"
          onDragOver={(e) => e.preventDefault()}
        >
          {/* SECTION 67: RESTORE UNSAVED DRAFT ALERT BANNER */}
          {pendingRestoreDraft && (
            <div className="w-full max-w-6xl mb-4 bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 border border-amber-500/50 rounded-2xl p-4 flex items-center justify-between shadow-2xl animate-fadeIn">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-amber-200 text-xs block">
                    Unsaved session backup detected ({new Date(pendingRestoreDraft.timestamp).toLocaleTimeString()})
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Your browser was closed with unsaved edits. Would you like to restore your work?
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRestoreAutosavedDraft}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition"
                >
                  Restore Unsaved Changes
                </button>
                <button
                  onClick={handleDismissRestoreDraft}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Zoom Controls Bar */}
          <div className="w-full max-w-6xl mb-3 flex items-center justify-between text-xs text-slate-400 px-2">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-300">Viewport:</span>
              <span className="text-fancy-blue uppercase font-mono font-bold">
                {viewport} ({viewport === "mobile" ? "390px" : viewport === "tablet" ? "768px" : "1440px"})
              </span>
              <span>•</span>
              <span>{sections.length} Widgets ({sections.filter((s) => s.isActive).length} Active)</span>
            </div>

            <div className="flex items-center space-x-2">
              <button onClick={() => setZoom((z) => Math.max(50, z - 25))} className="p-1 rounded hover:bg-slate-800">
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] font-bold text-white">{zoom}%</span>
              <button onClick={() => setZoom((z) => Math.min(125, z + 25))} className="p-1 rounded hover:bg-slate-800">
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Canvas Mockup Frame */}
          <div
            className={`transition-all duration-300 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col ${
              viewport === "mobile"
                ? "w-[390px] min-h-[780px] max-w-[390px]"
                : viewport === "tablet"
                ? "w-[768px] min-h-[820px] max-w-[768px]"
                : "w-full max-w-6xl min-h-[800px]"
            }`}
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: "top center",
            }}
          >
            {viewport === "mobile" && (
              <div className="h-6 bg-black text-white px-6 flex items-center justify-between text-[10px] font-mono">
                <span>9:41</span>
                <div className="w-16 h-3.5 bg-slate-800 rounded-full" />
                <span>5G 100%</span>
              </div>
            )}

            {/* Mock Navigation */}
            <div className="bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between backdrop-blur-md sticky top-0 z-20">
              <div className="flex items-center space-x-2">
                <span className="font-black text-fancy-blue text-sm">FancyHub.in</span>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                  2.0 Live
                </span>
              </div>
              <div className="text-xs text-slate-400 font-medium truncate max-w-[200px]">
                {page?.title || "Storefront Canvas"}
              </div>
            </div>

            {/* Canvas Drop Zones & Sections Stack */}
            <div className="flex-1 space-y-2 p-2 min-h-[500px]">
              {/* Drop Target Top */}
              <div
                onDragOver={(e) => handleCanvasDragOver(e, 0)}
                onDrop={(e) => handleCanvasDrop(e, 0)}
                className={`transition-all duration-200 rounded-xl py-1 text-center text-[10px] font-bold ${
                  dragOverIndex === 0
                    ? "bg-fancy-blue/20 border-2 border-dashed border-fancy-blue text-fancy-blue py-3"
                    : "opacity-0 hover:opacity-100"
                }`}
              >
                + Drop Widget at Top
              </div>

              {sections.length === 0 ? (
                <div
                  onDragOver={(e) => handleCanvasDragOver(e, 0)}
                  onDrop={(e) => handleCanvasDrop(e, 0)}
                  className="p-16 border-2 border-dashed border-slate-700 rounded-3xl text-center space-y-4 my-8"
                >
                  <p className="text-sm font-bold text-slate-400">Canvas is empty</p>
                  <p className="text-xs text-slate-500">
                    Pick a full prebuilt Page Template or drag widgets from the Left Panel
                  </p>
                  <div className="flex items-center justify-center space-x-3">
                    <button
                      onClick={() => setShowPageTemplatesModal(true)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow flex items-center space-x-1.5"
                    >
                      <LayoutTemplate className="w-3.5 h-3.5" />
                      <span>Choose Page Template</span>
                    </button>
                    <button
                      onClick={() => handleAddWidget("HERO_BANNER")}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold shadow"
                    >
                      + Add Hero Banner
                    </button>
                  </div>
                </div>
              ) : (
                sections.map((sec, idx) => (
                  <div key={sec.id} className="relative group/canvas">
                    {/* In-Canvas Floating Toolbar */}
                    {selectedSectionId === sec.id && (
                      <div className="absolute -top-3.5 right-4 z-30 bg-slate-900 border border-fancy-blue text-white text-[11px] font-bold px-2 py-1 rounded-xl shadow-xl flex items-center space-x-1.5 animate-scale-up">
                        <span className="text-fancy-blue font-mono font-black text-[10px] pr-1 border-r border-slate-700">
                          {sec.type}
                        </span>

                        <button onClick={() => handleMoveSection(idx, "up")} disabled={idx === 0} className="p-1 hover:text-fancy-blue disabled:opacity-30">
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleMoveSection(idx, "down")} disabled={idx === sections.length - 1} className="p-1 hover:text-fancy-blue disabled:opacity-30">
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDuplicateSection(sec.id)} className="p-1 hover:text-fancy-blue">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { setTemplateName(sec.title || `${sec.type} Template`); setShowSaveTemplateModal(true); }} className="p-1 text-amber-300 hover:text-amber-200">
                          <BookmarkPlus className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleToggleHideSection(sec.id)} className="p-1 hover:text-white">
                          {sec.isActive ? <Eye className="w-3.5 h-3.5 text-green-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                        </button>
                        <button onClick={() => handleDeleteSection(sec.id)} className="p-1 text-red-400 hover:text-red-300">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Section Container with Selection Ring */}
                    <div
                      draggable
                      onDragStart={() => setDraggedSectionIndex(idx)}
                      className={`relative transition-all duration-200 ${
                        selectedSectionId === sec.id
                          ? "ring-2 ring-fancy-blue rounded-3xl"
                          : "hover:ring-1 hover:ring-slate-400/50 rounded-3xl"
                      } ${!sec.isActive ? "opacity-60" : ""}`}
                    >
                      {!sec.isActive && (
                        <div className="absolute top-2 left-2 z-20 bg-slate-900/80 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/40">
                          👁️ Hidden on Storefront
                        </div>
                      )}

                      <SectionRenderer
                        section={sec}
                        isEditing={true}
                        isSelected={selectedSectionId === sec.id}
                        onSelect={() => setSelectedSectionId(sec.id)}
                      />
                    </div>

                    {/* Drop Target Between Sections */}
                    <div
                      onDragOver={(e) => handleCanvasDragOver(e, idx + 1)}
                      onDrop={(e) => handleCanvasDrop(e, idx + 1)}
                      className={`transition-all duration-200 rounded-xl py-1 text-center text-[10px] font-bold ${
                        dragOverIndex === idx + 1
                          ? "bg-fancy-blue/20 border-2 border-dashed border-fancy-blue text-fancy-blue py-3"
                          : "opacity-0 group-hover/canvas:opacity-100"
                      }`}
                    >
                      <button
                        onClick={() => handleAddWidget("PRODUCT_GRID", idx + 1)}
                        className="px-2.5 py-0.5 bg-fancy-blue text-white rounded-full shadow text-[10px] font-bold"
                      >
                        + Insert Widget Here
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>

        {/* ========================================================
            RIGHT COLUMN: Properties & Custom Settings Inspector
        ======================================================== */}
        <aside className="w-88 bg-slate-900 border-l border-slate-800 flex flex-col h-full flex-shrink-0 z-20 overflow-y-auto">
          {selectedSection ? (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-fancy-blue font-mono font-bold uppercase tracking-wider block">
                    {selectedSection.type}
                  </span>
                  <h3 className="font-black text-white text-sm">
                    {selectedSection.title || selectedSection.name || selectedSection.type}
                  </h3>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => {
                      setTemplateName(selectedSection.title || `${selectedSection.type} Template`);
                      setShowSaveTemplateModal(true);
                    }}
                    className="p-1 rounded-lg text-amber-300 hover:bg-slate-800"
                    title="Save as Reusable Block"
                  >
                    <BookmarkPlus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedSectionId(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                    title="Deselect"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 5 Tabs: Settings | DataSource | Styling | Responsive | Visibility */}
              <div className="grid grid-cols-5 p-1 border-b border-slate-800 text-[10px] font-bold text-center">
                <button
                  onClick={() => setRightTab("settings")}
                  className={`py-1.5 rounded-lg transition ${
                    rightTab === "settings" ? "bg-slate-800 text-fancy-blue" : "text-slate-400"
                  }`}
                >
                  Settings
                </button>
                <button
                  onClick={() => setRightTab("datasource")}
                  className={`py-1.5 rounded-lg transition ${
                    rightTab === "datasource" ? "bg-slate-800 text-indigo-400" : "text-slate-400"
                  }`}
                >
                  Source
                </button>
                <button
                  onClick={() => setRightTab("styling")}
                  className={`py-1.5 rounded-lg transition ${
                    rightTab === "styling" ? "bg-slate-800 text-fancy-blue" : "text-slate-400"
                  }`}
                >
                  Style
                </button>
                <button
                  onClick={() => setRightTab("responsive")}
                  className={`py-1.5 rounded-lg transition ${
                    rightTab === "responsive" ? "bg-slate-800 text-amber-300" : "text-slate-400"
                  }`}
                >
                  Layout
                </button>
                <button
                  onClick={() => setRightTab("visibility")}
                  className={`py-1.5 rounded-lg transition ${
                    rightTab === "visibility" ? "bg-slate-800 text-green-400" : "text-slate-400"
                  }`}
                >
                  Rules
                </button>
              </div>

              <div className="p-4 space-y-4 text-xs flex-1">
                {/* 1. SETTINGS TAB: EXHAUSTIVE CUSTOM SETTINGS */}
                {rightTab === "settings" && (
                  <div className="space-y-4">
                    {/* Basic Headings */}
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Title</label>
                      <input
                        type="text"
                        value={selectedSection.title || ""}
                        onChange={(e) =>
                          setSections((prev) =>
                            prev.map((s) => (s.id === selectedSection.id ? { ...s, title: e.target.value } : s))
                          )
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-fancy-blue"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={selectedSection.subtitle || ""}
                        onChange={(e) =>
                          setSections((prev) =>
                            prev.map((s) => (s.id === selectedSection.id ? { ...s, subtitle: e.target.value } : s))
                          )
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-fancy-blue"
                      />
                    </div>

                    {/* PRODUCT WIDGET CUSTOM SETTINGS (COLUMNS, CARD STYLE, IMAGE RATIO, 12 TOGGLES) */}
                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center space-x-1.5 text-fancy-blue font-bold text-xs border-b border-slate-800 pb-2">
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>Product Grid & Card Custom Settings</span>
                      </div>

                      {/* Product Source */}
                      <div>
                        <label className="block font-bold text-slate-300 mb-1 text-[11px]">Product Source</label>
                        <select
                          value={secSettings.productSource || selectedSection.dataSource?.sourceType || "latest"}
                          onChange={(e) => updateSelectedSectionSetting("productSource", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold text-xs"
                        >
                          <option value="latest">⚡ Latest Products</option>
                          <option value="best_selling">🏆 Best Selling</option>
                          <option value="trending">🔥 Trending</option>
                          <option value="featured">⭐ Featured</option>
                          <option value="discounted">🏷️ Discounted Deals</option>
                          <option value="category">📂 Category Filter</option>
                          <option value="vendor">🏬 Vendor Filter</option>
                          <option value="search">🔍 Search Keyword</option>
                        </select>
                      </div>

                      {/* Category & Vendor pickers */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-bold text-slate-400 text-[10px] mb-1">Category</label>
                          <select
                            value={secSettings.categorySlug || ""}
                            onChange={(e) => updateSelectedSectionSetting("categorySlug", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1 text-white text-[11px]"
                          >
                            <option value="">All Categories</option>
                            {dbCategories.map((c) => (
                              <option key={c.id} value={c.slug}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-400 text-[10px] mb-1">Vendor</label>
                          <select
                            value={secSettings.vendorSlug || ""}
                            onChange={(e) => updateSelectedSectionSetting("vendorSlug", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1 text-white text-[11px]"
                          >
                            <option value="">All Vendors</option>
                            {dbVendors.map((v) => (
                              <option key={v.id} value={v.slug}>
                                {v.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Number of Products */}
                      <div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1">
                          <span>Number of Products: {secSettings.limit || 8}</span>
                        </div>
                        <input
                          type="range"
                          min={2}
                          max={24}
                          step={2}
                          value={secSettings.limit || 8}
                          onChange={(e) => updateSelectedSectionSetting("limit", parseInt(e.target.value))}
                          className="w-full accent-fancy-blue"
                        />
                      </div>

                      {/* Responsive Columns: Desktop, Tablet, Mobile */}
                      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/80 text-[10px]">
                        <div>
                          <label className="block font-bold text-slate-400 mb-1">Desktop Cols</label>
                          <select
                            value={secSettings.desktopColumns || 4}
                            onChange={(e) => updateSelectedSectionSetting("desktopColumns", parseInt(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1 text-white font-bold"
                          >
                            <option value={1}>1 Col</option>
                            <option value={2}>2 Cols</option>
                            <option value={3}>3 Cols</option>
                            <option value={4}>4 Cols</option>
                            <option value={5}>5 Cols</option>
                            <option value={6}>6 Cols</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-400 mb-1">Tablet Cols</label>
                          <select
                            value={secSettings.tabletColumns || 3}
                            onChange={(e) => updateSelectedSectionSetting("tabletColumns", parseInt(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1 text-white font-bold"
                          >
                            <option value={1}>1 Col</option>
                            <option value={2}>2 Cols</option>
                            <option value={3}>3 Cols</option>
                            <option value={4}>4 Cols</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-400 mb-1">Mobile Cols</label>
                          <select
                            value={secSettings.mobileColumns || 2}
                            onChange={(e) => updateSelectedSectionSetting("mobileColumns", parseInt(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1 text-white font-bold"
                          >
                            <option value={1}>1 Col</option>
                            <option value={2}>2 Cols</option>
                          </select>
                        </div>
                      </div>

                      {/* Card Style & Image Ratio */}
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                        <div>
                          <label className="block font-bold text-slate-400 text-[10px] mb-1">Card Style</label>
                          <select
                            value={secSettings.cardStyle || "modern"}
                            onChange={(e) => updateSelectedSectionSetting("cardStyle", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1 text-white text-[11px] font-bold"
                          >
                            <option value="modern">Modern (Rounded)</option>
                            <option value="classic">Classic (Standard)</option>
                            <option value="minimal">Minimal (Clean)</option>
                            <option value="bordered">Bordered (Bold)</option>
                            <option value="elevated">Elevated (Shadow)</option>
                            <option value="glass">Glass (Backdrop)</option>
                            <option value="compact">Compact</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-400 text-[10px] mb-1">Image Ratio</label>
                          <select
                            value={secSettings.imageRatio || "1:1"}
                            onChange={(e) => updateSelectedSectionSetting("imageRatio", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1 text-white text-[11px] font-bold"
                          >
                            <option value="1:1">1:1 Square</option>
                            <option value="3:4">3:4 Portrait</option>
                            <option value="4:5">4:5 Fashion</option>
                            <option value="16:9">16:9 Banner</option>
                          </select>
                        </div>
                      </div>

                      {/* 12 Feature Toggles */}
                      <div className="pt-2 border-t border-slate-800 space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                          Card Feature Toggles (12 Options)
                        </span>

                        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                          {[
                            { key: "showPrice", label: "Show Price (₹)" },
                            { key: "showDiscount", label: "Show Discount (% OFF)" },
                            { key: "showRating", label: "Show Rating (⭐)" },
                            { key: "showWishlist", label: "Show Wishlist (❤️)" },
                            { key: "showCompare", label: "Show Compare (⚖️)" },
                            { key: "showQuickView", label: "Show Quick View (👁️)" },
                            { key: "showAddToCart", label: "Show Add to Cart (🛒)" },
                            { key: "showStock", label: "Show Stock Status" },
                            { key: "showBadges", label: "Show Badges" },
                            { key: "showVendor", label: "Show Vendor Name" },
                            { key: "showDeliveryInfo", label: "Show Delivery Info" },
                            { key: "showCountdown", label: "Show Countdown" },
                          ].map((tog) => {
                            const isChecked = secSettings[tog.key] !== undefined ? secSettings[tog.key] : true;
                            return (
                              <label
                                key={tog.key}
                                className="flex items-center space-x-1.5 p-1.5 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700 text-slate-300"
                              >
                                <input
                                  type="checkbox"
                                  checked={Boolean(isChecked)}
                                  onChange={(e) => updateSelectedSectionSetting(tog.key, e.target.checked)}
                                  className="w-3.5 h-3.5 accent-fancy-blue rounded"
                                />
                                <span className="truncate">{tog.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Raw Settings JSON Editor */}
                    <div className="pt-2 border-t border-slate-800">
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-bold text-slate-400 text-[11px]">Widget Settings JSON</label>
                        <span className="text-[10px] text-amber-400 font-mono">Live</span>
                      </div>
                      <textarea
                        rows={5}
                        value={
                          typeof selectedSection.settings === "string"
                            ? selectedSection.settings
                            : JSON.stringify(selectedSection.settings || selectedSection.contentJson, null, 2)
                        }
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            setSections((prev) =>
                              prev.map((s) =>
                                s.id === selectedSection.id
                                  ? { ...s, settings: parsed, contentJson: parsed }
                                  : s
                              )
                            );
                          } catch (err) {}
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-[11px] text-amber-300 outline-none focus:border-fancy-blue"
                      />
                    </div>
                  </div>
                )}

                {/* 2. DATASOURCE TAB */}
                {rightTab === "datasource" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Data Source Type</label>
                      <select
                        value={selectedSection.dataSource?.type || "PRODUCTS"}
                        onChange={(e) =>
                          setSections((prev) =>
                            prev.map((s) =>
                              s.id === selectedSection.id
                                ? { ...s, dataSource: { ...s.dataSource, type: e.target.value } }
                                : s
                            )
                          )
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                      >
                        <option value="PRODUCTS">Live Products Catalog</option>
                        <option value="CATEGORIES">Database Categories (Live)</option>
                        <option value="VENDORS">Verified Vendors / Sellers (Live)</option>
                        <option value="STATIC">Static / Custom Content</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 3. STYLING TAB */}
                {rightTab === "styling" && (
                  <div className="space-y-4">
                    {/* Background Tone */}
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Background Tone</label>
                      <div className="grid grid-cols-4 gap-2">
                        {["transparent", "#FFFFFF", "#0A1128", "#1E293B"].map((bg) => (
                          <button
                            key={bg}
                            onClick={() => {
                              recordHistory();
                              setSections((prev) =>
                                prev.map((s) =>
                                  s.id === selectedSection.id
                                    ? {
                                        ...s,
                                        style: { ...s.style, backgroundColor: bg },
                                        stylingJson: { ...s.stylingJson, backgroundColor: bg },
                                      }
                                    : s
                                )
                              );
                            }}
                            className="h-8 rounded-xl border border-slate-700 flex items-center justify-center font-mono text-[10px] text-white"
                            style={{ backgroundColor: bg }}
                          >
                            {bg === "transparent" ? "None" : ""}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* SECTION 69: ACCESSIBILITY & CONTRAST RATIO VALIDATOR */}
                    {(() => {
                      const bg = selectedSection.style?.backgroundColor || "#FFFFFF";
                      const fg = bg === "#FFFFFF" || bg === "transparent" ? "#0F172A" : "#FFFFFF";
                      const contrast = calculateContrastRatio(fg, bg === "transparent" ? "#FFFFFF" : bg);
                      return (
                        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-300 text-[11px] flex items-center space-x-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-fancy-blue" />
                              <span>Color Contrast (WCAG 2.1)</span>
                            </span>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg ${
                              contrast.isNormalTextAA ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-red-500/20 text-red-300 border border-red-500/30"
                            }`}>
                              {contrast.ratioFormatted} {contrast.isNormalTextAAA ? "AAA" : contrast.isNormalTextAA ? "AA" : "FAIL"}
                            </span>
                          </div>
                          {contrast.warning && (
                            <p className="text-[10px] text-amber-400 font-medium">
                              ⚠️ {contrast.warning}
                            </p>
                          )}
                        </div>
                      );
                    })()}

                    {/* Vertical Padding */}
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Vertical Padding</label>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        {["py-2", "py-4", "py-8", "py-12"].map((pad) => (
                          <button
                            key={pad}
                            onClick={() => {
                              recordHistory();
                              setSections((prev) =>
                                prev.map((s) =>
                                  s.id === selectedSection.id
                                    ? {
                                        ...s,
                                        style: { ...s.style, paddingY: pad },
                                        stylingJson: { ...s.stylingJson, paddingY: pad },
                                      }
                                    : s
                                )
                              );
                            }}
                            className="p-2 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs hover:border-fancy-blue"
                          >
                            {pad}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* SECTION 71: ANIMATION SYSTEM CONTROLS */}
                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center space-x-1.5 text-fancy-blue font-bold text-xs border-b border-slate-800 pb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Widget Animation System</span>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1 text-[11px]">Animation Type</label>
                        <select
                          value={selectedSection.style?.animation?.type || "none"}
                          onChange={(e) => {
                            recordHistory();
                            const animType = e.target.value as AnimationType;
                            setSections((prev) =>
                              prev.map((s) =>
                                s.id === selectedSection.id
                                  ? {
                                      ...s,
                                      style: {
                                        ...s.style,
                                        animation: {
                                          ...s.style?.animation,
                                          type: animType,
                                          duration: s.style?.animation?.duration || 400,
                                          delay: s.style?.animation?.delay || 0,
                                          trigger: s.style?.animation?.trigger || "on-scroll",
                                        },
                                      },
                                    }
                                  : s
                              )
                            );
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold text-xs"
                        >
                          {ANIMATION_TYPES_LIST.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedSection.style?.animation?.type && selectedSection.style.animation.type !== "none" && (
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-400 font-bold">Duration</span>
                            <span className="text-fancy-blue font-mono">{selectedSection.style?.animation?.duration || 400}ms</span>
                          </div>
                          <input
                            type="range"
                            min="100"
                            max="1500"
                            step="50"
                            value={selectedSection.style?.animation?.duration || 400}
                            onChange={(e) => {
                              const dur = parseInt(e.target.value);
                              setSections((prev) =>
                                prev.map((s) =>
                                  s.id === selectedSection.id
                                    ? {
                                        ...s,
                                        style: {
                                          ...s.style,
                                          animation: { ...s.style?.animation, duration: dur },
                                        },
                                      }
                                    : s
                                )
                              );
                            }}
                            className="w-full accent-fancy-blue"
                          />

                          <div className="flex items-center justify-between text-[11px] pt-1">
                            <span className="text-slate-400 font-bold">Trigger</span>
                            <select
                              value={selectedSection.style?.animation?.trigger || "on-scroll"}
                              onChange={(e) => {
                                const trg = e.target.value;
                                setSections((prev) =>
                                  prev.map((s) =>
                                    s.id === selectedSection.id
                                      ? {
                                          ...s,
                                          style: {
                                            ...s.style,
                                            animation: { ...s.style?.animation, trigger: trg },
                                          },
                                        }
                                      : s
                                  )
                                );
                              }}
                              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-0.5 text-white font-mono text-[10px]"
                            >
                              <option value="on-scroll">On Scroll</option>
                              <option value="on-load">On Page Load</option>
                              <option value="on-hover">On Hover</option>
                              <option value="always">Continuous</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. RESPONSIVE TAB */}
                {rightTab === "responsive" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Desktop Columns</label>
                      <select
                        value={selectedSection.responsiveSettings?.desktop?.columns || 4}
                        onChange={(e) =>
                          setSections((prev) =>
                            prev.map((s) =>
                              s.id === selectedSection.id
                                ? {
                                    ...s,
                                    responsiveSettings: {
                                      ...s.responsiveSettings,
                                      desktop: {
                                        ...s.responsiveSettings?.desktop,
                                        columns: parseInt(e.target.value),
                                      },
                                    },
                                  }
                                : s
                            )
                          )
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                      >
                        <option value={1}>1 Column</option>
                        <option value={2}>2 Columns</option>
                        <option value={3}>3 Columns</option>
                        <option value={4}>4 Columns</option>
                        <option value={6}>6 Columns</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Mobile Columns</label>
                      <select
                        value={selectedSection.responsiveSettings?.mobile?.columns || 2}
                        onChange={(e) =>
                          setSections((prev) =>
                            prev.map((s) =>
                              s.id === selectedSection.id
                                ? {
                                    ...s,
                                    responsiveSettings: {
                                      ...s.responsiveSettings,
                                      mobile: {
                                        ...s.responsiveSettings?.mobile,
                                        columns: parseInt(e.target.value),
                                      },
                                    },
                                  }
                                : s
                            )
                          )
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                      >
                        <option value={1}>1 Column (Stacked)</option>
                        <option value={2}>2 Columns (Compact Grid)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 5. VISIBILITY TAB */}
                {rightTab === "visibility" && (
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800 cursor-pointer">
                      <span className="font-bold text-white">Active on Storefront</span>
                      <input
                        type="checkbox"
                        checked={selectedSection.isActive}
                        onChange={(e) =>
                          setSections((prev) =>
                            prev.map((s) => (s.id === selectedSection.id ? { ...s, isActive: e.target.checked } : s))
                          )
                        }
                        className="w-4 h-4 accent-fancy-blue"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800 cursor-pointer">
                      <span className="font-bold text-white">Desktop Visible</span>
                      <input
                        type="checkbox"
                        checked={selectedSection.desktopVisible}
                        onChange={(e) =>
                          setSections((prev) =>
                            prev.map((s) => (s.id === selectedSection.id ? { ...s, desktopVisible: e.target.checked } : s))
                          )
                        }
                        className="w-4 h-4 accent-fancy-blue"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800 cursor-pointer">
                      <span className="font-bold text-white">Mobile Visible</span>
                      <input
                        type="checkbox"
                        checked={selectedSection.mobileVisible}
                        onChange={(e) =>
                          setSections((prev) =>
                            prev.map((s) => (s.id === selectedSection.id ? { ...s, mobileVisible: e.target.checked } : s))
                          )
                        }
                        className="w-4 h-4 accent-fancy-blue"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* PAGE SETTINGS */
            <div className="p-4 space-y-4 text-xs">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider block">
                  Global Configuration
                </span>
                <h3 className="font-black text-white text-sm">Page & SEO Properties</h3>
              </div>

              {page ? (
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Page Title</label>
                    <input
                      type="text"
                      value={page.title}
                      onChange={(e) => setPage({ ...page, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">URL Path Slug</label>
                    <input
                      type="text"
                      value={page.slug}
                      disabled={page.isHomepage}
                      onChange={(e) => setPage({ ...page, slug: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">SEO Meta Title</label>
                    <input
                      type="text"
                      value={page.seoTitle || ""}
                      onChange={(e) => setPage({ ...page, seoTitle: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">SEO Meta Description</label>
                    <textarea
                      rows={3}
                      value={page.seoDescription || ""}
                      onChange={(e) => setPage({ ...page, seoDescription: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-slate-500">Loading parameters...</p>
              )}
            </div>
          )}
        </aside>
      </div>

      {/* ========================================================
          3. MODALS (Page Templates, Preview, Save Template, Duplicate, History, Schedule)
      ======================================================== */}
      {/* 10. PAGE TEMPLATES SELECTOR MODAL */}
      {showPageTemplatesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-scale-up">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white flex items-center space-x-2">
                  <LayoutTemplate className="w-5 h-5 text-indigo-400" />
                  <span>Reusable Page Templates</span>
                </h3>
                <p className="text-xs text-slate-400">Select a prebuilt template or create your own custom template</p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowSavePageTemplateModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>Save Canvas as Template</span>
                </button>
                <button
                  onClick={() => setShowPageTemplatesModal(false)}
                  className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Template Filter Pills */}
            <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center space-x-2 overflow-x-auto text-[11px] font-bold">
              {[
                { id: "ALL", label: "All Templates" },
                { id: "HOMEPAGE", label: "🏠 Homepage" },
                { id: "CATEGORY", label: "📂 Category" },
                { id: "PRODUCT", label: "🛍️ Product" },
                { id: "VENDOR_STORE", label: "🏬 Vendor Store" },
                { id: "BLOG", label: "📰 Blog" },
                { id: "LANDING", label: "🚀 Landing Page" },
                { id: "CAMPAIGN", label: "⚡ Campaign" },
                { id: "CUSTOM", label: "⭐ Custom Templates" },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setSelectedTemplateFilter(pill.id)}
                  className={`px-3 py-1 rounded-xl flex-shrink-0 transition ${
                    selectedTemplateFilter === pill.id
                      ? "bg-indigo-600 text-white shadow"
                      : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Template Cards Grid */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pageTemplates
                .filter((tpl) => selectedTemplateFilter === "ALL" || tpl.type === selectedTemplateFilter)
                .map((tpl) => (
                  <div
                    key={tpl.id}
                    className="bg-slate-950 border border-slate-800 hover:border-indigo-500/80 rounded-3xl overflow-hidden group transition flex flex-col justify-between shadow-lg"
                  >
                    <div>
                      <div className="relative aspect-video bg-slate-900 overflow-hidden">
                        <img
                          src={tpl.thumbnail}
                          alt={tpl.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80 group-hover:opacity-100"
                        />
                        <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-900/90 text-indigo-300 backdrop-blur-md border border-indigo-500/30">
                            {tpl.type}
                          </span>
                          {tpl.isDefault && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-slate-950">
                              DEFAULT
                            </span>
                          )}
                        </div>

                        {!tpl.isDefault && (
                          <button
                            onClick={(e) => handleDeletePageTemplate(tpl.id, e)}
                            className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-slate-900/80 text-red-400 hover:bg-red-500 hover:text-white transition"
                            title="Delete Custom Template"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="p-4 space-y-1.5">
                        <h4 className="font-bold text-sm text-white group-hover:text-indigo-400 transition">
                          {tpl.name}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {tpl.description}
                        </p>
                        <span className="text-[10px] text-slate-500 font-mono block pt-1">
                          {tpl.sections?.length || 0} Configured Widgets
                        </span>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <button
                        onClick={() => handleApplyPageTemplate(tpl)}
                        className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-xl text-xs font-black transition border border-indigo-500/40 flex items-center justify-center space-x-1.5 shadow"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{tpl.isDefault ? "Use Default Template" : "Apply Template"}</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* SAVE CURRENT CANVAS AS PAGE TEMPLATE MODAL */}
      {showSavePageTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white flex items-center space-x-2">
                  <BookmarkPlus className="w-4 h-4 text-indigo-400" />
                  <span>Create Custom Page Template</span>
                </h3>
                <p className="text-xs text-slate-400">Save current {sections.length} sections into reusable catalog</p>
              </div>
              <button
                onClick={() => setShowSavePageTemplateModal(false)}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCurrentPageAsTemplate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Template Name</label>
                <input
                  type="text"
                  placeholder="e.g. Diwali Handloom Landing Page"
                  value={newPageTemplateName}
                  onChange={(e) => setNewPageTemplateName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Template Type</label>
                <select
                  value={newPageTemplateType}
                  onChange={(e: any) => setNewPageTemplateType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                >
                  <option value="HOMEPAGE">Homepage Template</option>
                  <option value="CATEGORY">Category Template</option>
                  <option value="PRODUCT">Product Template</option>
                  <option value="VENDOR_STORE">Vendor Store Template</option>
                  <option value="BLOG">Blog Template</option>
                  <option value="LANDING">Landing Page Template</option>
                  <option value="CAMPAIGN">Campaign Template</option>
                  <option value="CUSTOM">Custom Template</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe when to use this template..."
                  value={newPageTemplateDesc}
                  onChange={(e) => setNewPageTemplateDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSavePageTemplateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow"
                >
                  Save Page Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col animate-fade-in">
          <div className="h-14 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <span className="font-black text-white">Live Storefront Preview</span>
              <span className="text-slate-400">({currentSlug})</span>
            </div>
            <button
              onClick={() => setShowPreviewModal(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center space-x-1"
            >
              <X className="w-4 h-4" />
              <span>Close Preview</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950 flex justify-center">
            <div className="w-full max-w-6xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-4">
              {sections
                .filter((s) => s.isActive)
                .map((sec) => (
                  <SectionRenderer key={sec.id} section={sec} />
                ))}
            </div>
          </div>
        </div>
      )}

      {showSaveTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white flex items-center space-x-2">
                  <BookmarkPlus className="w-4 h-4 text-amber-400" />
                  <span>Save as Reusable Block</span>
                </h3>
                <p className="text-xs text-slate-400">Reuse this configured section across any page</p>
              </div>
              <button
                onClick={() => setShowSaveTemplateModal(false)}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSectionAsTemplate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Template Name</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g. Diwali Hero Saree Banner"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Category</label>
                <select
                  value={templateCategory}
                  onChange={(e) => setTemplateCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                >
                  <option value="HERO">Hero & Banners</option>
                  <option value="PRODUCTS">Products & Grid</option>
                  <option value="PROMO">Promotions</option>
                  <option value="ENGAGEMENT">Engagement & Reviews</option>
                  <option value="CUSTOM">Custom Blocks</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSaveTemplateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDuplicatePageModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white flex items-center space-x-2">
                  <Copy className="w-4 h-4 text-fancy-blue" />
                  <span>Duplicate Entire Page</span>
                </h3>
                <p className="text-xs text-slate-400">Clone all sections and configurations into a new page</p>
              </div>
              <button
                onClick={() => setShowDuplicatePageModal(false)}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDuplicatePage} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">New Page Title</label>
                <input
                  type="text"
                  value={newDuplicateTitle}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-+|-+$/g, "");
                    setNewDuplicateTitle(title);
                    setNewDuplicateSlug(slug);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">New Page URL Slug</label>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-slate-400">
                  <span>/p/</span>
                  <input
                    type="text"
                    value={newDuplicateSlug}
                    onChange={(e) => setNewDuplicateSlug(e.target.value)}
                    className="bg-transparent border-0 text-white outline-none flex-1 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDuplicatePageModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-fancy-blue hover:bg-blue-600 text-white font-black rounded-xl shadow"
                >
                  Duplicate & Open
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showVersionsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white flex items-center space-x-2">
                  <History className="w-4 h-4 text-amber-400" />
                  <span>Version History & Snapshots</span>
                </h3>
                <p className="text-xs text-slate-400">Inspect or restore past visual layouts</p>
              </div>
              <button
                onClick={() => setShowVersionsModal(false)}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 max-h-80 overflow-y-auto space-y-3 text-xs">
              {versions.length === 0 ? (
                <div className="text-center text-slate-500 py-6">No previous revisions recorded yet.</div>
              ) : (
                versions.map((ver) => (
                  <div
                    key={ver.id}
                    className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-white block">
                        {ver.label || `Revision v${ver.versionNumber}`}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {new Date(ver.createdAt).toLocaleString()} • by {ver.createdBy}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const snap = JSON.parse(ver.snapshotJson);
                        recordHistory();
                        if (snap.sections) {
                          setSections(
                            snap.sections.map((s: any) => ({
                              ...s,
                              contentJson: parseJson(s.contentJson),
                              stylingJson: parseJson(s.stylingJson),
                            }))
                          );
                        }
                        setShowVersionsModal(false);
                        showToast(`Restored Revision #${ver.versionNumber}`);
                      }}
                      className="px-3 py-1.5 bg-fancy-blue hover:bg-blue-600 text-white rounded-xl font-bold text-xs"
                    >
                      Restore
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>Schedule Publication</span>
                </h3>
                <p className="text-xs text-slate-400">Set future release timestamp</p>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Launch Date & Time</label>
                <input
                  type="datetime-local"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
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
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black shadow"
                >
                  Set Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SECTION 72: PAGE AUDIT & HEALTH SCORE MODAL */}
      {showAuditModal && auditReport && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fadeIn flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Live Page Quality & Audit Report</h3>
                  <p className="text-xs text-slate-400">Real-time Performance, Accessibility, SEO & Link validation</p>
                </div>
              </div>
              <button
                onClick={() => setShowAuditModal(false)}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 4 Score Gauges */}
            <div className="p-6 grid grid-cols-4 gap-3 bg-slate-950/60 border-b border-slate-800">
              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-center">
                <span className="text-[10px] text-slate-400 font-bold block mb-1">Performance</span>
                <span className={`text-2xl font-black ${auditReport.performanceScore >= 80 ? "text-emerald-400" : "text-amber-400"}`}>
                  {auditReport.performanceScore}
                </span>
                <span className="text-[9px] text-slate-500 block mt-0.5">DOM & Images</span>
              </div>

              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-center">
                <span className="text-[10px] text-slate-400 font-bold block mb-1">Accessibility</span>
                <span className={`text-2xl font-black ${auditReport.accessibilityScore >= 80 ? "text-emerald-400" : "text-amber-400"}`}>
                  {auditReport.accessibilityScore}
                </span>
                <span className="text-[9px] text-slate-500 block mt-0.5">Alt & Contrast</span>
              </div>

              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-center">
                <span className="text-[10px] text-slate-400 font-bold block mb-1">SEO Health</span>
                <span className={`text-2xl font-black ${auditReport.seoScore >= 80 ? "text-emerald-400" : "text-amber-400"}`}>
                  {auditReport.seoScore}
                </span>
                <span className="text-[9px] text-slate-500 block mt-0.5">Meta & Titles</span>
              </div>

              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-center">
                <span className="text-[10px] text-slate-400 font-bold block mb-1">Link Health</span>
                <span className={`text-2xl font-black ${auditReport.linksScore === 100 ? "text-emerald-400" : "text-red-400"}`}>
                  {auditReport.linksScore}
                </span>
                <span className="text-[9px] text-slate-500 block mt-0.5">0 Dead Links</span>
              </div>
            </div>

            {/* Diagnostic Recommendations List */}
            <div className="p-6 overflow-y-auto flex-1 space-y-3 text-xs">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400 mb-2">
                Diagnostic Findings ({auditReport.issues.length})
              </h4>
              {auditReport.issues.length === 0 ? (
                <div className="p-8 text-center bg-emerald-950/20 border border-emerald-500/30 rounded-2xl">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <span className="font-bold text-emerald-300 block text-sm">Outstanding Optimization!</span>
                  <span className="text-slate-400 text-xs mt-1 block">
                    Zero SEO, Accessibility or Performance violations detected on this page.
                  </span>
                </div>
              ) : (
                auditReport.issues.map((issue) => (
                  <div
                    key={issue.id}
                    className={`p-3.5 rounded-2xl border flex items-start space-x-3 ${
                      issue.severity === "critical"
                        ? "bg-red-950/30 border-red-500/30 text-red-200"
                        : issue.severity === "warning"
                        ? "bg-amber-950/30 border-amber-500/30 text-amber-200"
                        : "bg-slate-950 border-slate-800 text-slate-300"
                    }`}
                  >
                    <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
                      issue.severity === "critical" ? "text-red-400" : issue.severity === "warning" ? "text-amber-400" : "text-cyan-400"
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{issue.title}</span>
                        <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 font-bold border border-slate-800">
                          {issue.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{issue.message}</p>
                      <p className="text-[11px] text-emerald-400 font-medium mt-1">
                        💡 Fix: {issue.recommendation}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                Overall Page Score: <span className="font-bold text-white">{auditReport.overallScore}/100</span>
              </div>
              <button
                onClick={() => setShowAuditModal(false)}
                className="px-4 py-2 bg-fancy-blue hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow"
              >
                Close Audit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 animate-slide-up text-xs font-bold">
          <Sparkles className="w-4 h-4 text-fancy-blue" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
