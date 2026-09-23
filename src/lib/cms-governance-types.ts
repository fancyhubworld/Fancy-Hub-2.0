import { ThemeTokens, THEME_PRESETS } from "./theme-engine";
import { UniversalSectionSettings } from "./section-builder-types";

// ==========================================
// SECTION 41: DRAFT / PUBLISH SYSTEM
// ==========================================
export type PublishStatus = "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED";

export interface DraftPublishWorkflow<T = any> {
  pageId: string;
  status: PublishStatus;
  publishedSnapshot?: T;
  draftSnapshot?: T;
  lastEditedBy?: string;
  lastEditedAt?: Date | string;
  publishedAt?: Date | string;
}

// ==========================================
// SECTION 42: SCHEDULED PUBLISHING
// ==========================================
export type SchedulableTargetType =
  | "THEME"
  | "HOMEPAGE"
  | "BANNER"
  | "CAMPAIGN"
  | "LANDING_PAGE"
  | "POPUP";

export interface PublishingSchedule {
  id: string;
  name: string;
  targetType: SchedulableTargetType;
  targetId: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  isActive: boolean;
  scheduledDataJson?: string;
  createdAt?: Date | string;
}

export function isScheduleActive(schedule: PublishingSchedule, now: Date = new Date()): boolean {
  if (!schedule.isActive) return false;
  const start = new Date(schedule.startDate).getTime();
  const current = now.getTime();
  if (current < start) return false;
  if (schedule.endDate) {
    const end = new Date(schedule.endDate).getTime();
    if (current > end) return false;
  }
  return true;
}

// ==========================================
// SECTION 43: ROLE PERMISSIONS (RBAC)
// ==========================================
export type AdminRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "CONTENT_MANAGER"
  | "MARKETING_MANAGER"
  | "DESIGNER";

export type AdminPermission =
  | "THEME_MANAGE"
  | "PAGES_MANAGE"
  | "BLOG_MANAGE"
  | "BANNERS_MANAGE"
  | "CAMPAIGNS_MANAGE"
  | "POPUPS_MANAGE"
  | "NAVIGATION_MANAGE"
  | "CRITICAL_SETTINGS_MANAGE"
  | "CUSTOM_JS_MANAGE"
  | "USER_ROLES_MANAGE";

export const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  SUPER_ADMIN: [
    "THEME_MANAGE",
    "PAGES_MANAGE",
    "BLOG_MANAGE",
    "BANNERS_MANAGE",
    "CAMPAIGNS_MANAGE",
    "POPUPS_MANAGE",
    "NAVIGATION_MANAGE",
    "CRITICAL_SETTINGS_MANAGE",
    "CUSTOM_JS_MANAGE",
    "USER_ROLES_MANAGE",
  ],
  ADMIN: [
    "THEME_MANAGE",
    "PAGES_MANAGE",
    "BLOG_MANAGE",
    "BANNERS_MANAGE",
    "CAMPAIGNS_MANAGE",
    "POPUPS_MANAGE",
    "NAVIGATION_MANAGE",
  ],
  DESIGNER: ["THEME_MANAGE", "PAGES_MANAGE"],
  MARKETING_MANAGER: ["BANNERS_MANAGE", "CAMPAIGNS_MANAGE", "POPUPS_MANAGE"],
  CONTENT_MANAGER: ["PAGES_MANAGE", "BLOG_MANAGE"],
};

export function hasPermission(role: AdminRole, permission: AdminPermission): boolean {
  const allowed = ROLE_PERMISSIONS[role] || [];
  return allowed.includes(permission);
}

// ==========================================
// SECTION 44: CUSTOM CSS SANITIZER
// ==========================================
export interface CustomCssConfig {
  css: string;
  isEnabled: boolean;
  warningAcknowledged: boolean;
}

export function sanitizeCustomCss(rawCss: string): { sanitized: string; isValid: boolean; error?: string } {
  if (!rawCss) return { sanitized: "", isValid: true };

  // Block dangerous expressions, JavaScript protocols & server side scripts
  const dangerousPatterns = [
    /@import/i,
    /javascript:/i,
    /expression\s*\(/i,
    /behavior\s*:/i,
    /-moz-binding/i,
    /<script/i,
    /<\/script>/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(rawCss)) {
      return {
        sanitized: "",
        isValid: false,
        error: `Security violation: Unsafe pattern '${pattern}' is not permitted in Custom CSS.`,
      };
    }
  }

  return { sanitized: rawCss, isValid: true };
}

// ==========================================
// SECTION 45: CUSTOM JAVASCRIPT / TRACKING (Super Admin only)
// ==========================================
export interface CustomJsConfig {
  googleAnalyticsId?: string;
  metaPixelId?: string;
  customScriptHeader?: string;
  customScriptBody?: string;
  isEnabled: boolean;
}

// ==========================================
// SECTION 47: HIERARCHICAL PAGE BLOCK STRUCTURE
// ==========================================
export interface BlockWidget {
  id: string;
  type: string;
  settings: Record<string, any>;
  style: Record<string, any>;
  responsive: Record<string, any>;
  dataSource?: Record<string, any>;
}

export interface BlockColumn {
  id: string;
  widthRatio: string; // e.g. "1/2", "1/3", "1/4", "full"
  widgets: BlockWidget[];
}

export interface BlockRow {
  id: string;
  columns: BlockColumn[];
}

export interface BlockSection {
  id: string;
  name: string;
  type: string;
  settings: UniversalSectionSettings;
  rows: BlockRow[];
}

export interface HierarchicalPageBlockDoc {
  pageId: string;
  title: string;
  slug: string;
  sections: BlockSection[];
}

// ==========================================
// SECTION 49: THEME EXPORT / IMPORT PACKAGE
// ==========================================
export interface ThemeExportPackage {
  formatVersion: "2.0";
  exportedAt: string;
  theme: ThemeTokens;
  pagesSample?: Array<{ slug: string; title: string; layoutType: string }>;
  navigationMenus?: Record<string, any>;
  widgetsSample?: Array<{ name: string; type: string }>;
}

export function createThemeExportPackage(
  theme: ThemeTokens,
  navigation?: Record<string, any>
): ThemeExportPackage {
  // Strip out any accidental secrets, passwords, or API keys
  const sanitizedTheme = { ...theme };
  delete (sanitizedTheme as any).apiKey;
  delete (sanitizedTheme as any).secret;
  delete (sanitizedTheme as any).password;

  return {
    formatVersion: "2.0",
    exportedAt: new Date().toISOString(),
    theme: sanitizedTheme,
    navigationMenus: navigation || {},
    pagesSample: [
      { slug: "home", title: "Homepage", layoutType: "DEFAULT" },
      { slug: "festive-sale", title: "Festive Sale 2026", layoutType: "FULL_WIDTH" },
    ],
  };
}

export function validateThemeImportPackage(data: any): { isValid: boolean; error?: string; theme?: ThemeTokens } {
  if (!data || typeof data !== "object") {
    return { isValid: false, error: "Invalid file format. Must be a valid JSON object." };
  }

  if (!data.theme || !data.theme.primaryColor || !data.theme.fontFamily) {
    return { isValid: false, error: "Corrupted package: Missing essential Theme color and typography tokens." };
  }

  return { isValid: true, theme: data.theme };
}

// ==========================================
// SECTION 50: CLONE / DUPLICATE THEME
// ==========================================
export function duplicateThemePreset(
  sourcePresetKey: string,
  newPresetName: string,
  newPresetKey: string
): ThemeTokens {
  const source = THEME_PRESETS[sourcePresetKey] || THEME_PRESETS["fancyhub-classic"];
  return {
    ...source,
    name: newPresetName,
    activePreset: newPresetKey,
  };
}
