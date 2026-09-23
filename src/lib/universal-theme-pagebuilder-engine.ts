import crypto from "crypto";

export type DisplayMode = "LIGHT_MODE" | "DARK_MODE" | "GLASSY_MODE";

export type PageScope =
  | "HOME"
  | "SHOP"
  | "CATEGORY"
  | "PRODUCT"
  | "CART"
  | "CHECKOUT"
  | "LOGIN"
  | "REGISTER"
  | "ACCOUNT"
  | "ORDERS"
  | "WISHLIST"
  | "VENDOR_STORE"
  | "VENDOR_DASHBOARD"
  | "BLOG"
  | "ABOUT"
  | "CONTACT"
  | "FAQ"
  | "LEGAL";

export type WidgetType =
  | "HERO"
  | "BANNER"
  | "PRODUCT_GRID"
  | "PRODUCT_CAROUSEL"
  | "CATEGORY_GRID"
  | "BRAND_GRID"
  | "COLLECTION"
  | "COUNTDOWN"
  | "REVIEWS"
  | "FAQ"
  | "NEWSLETTER"
  | "CTA"
  | "VIDEO"
  | "IMAGE"
  | "TEXT"
  | "HTML"
  | "STATS"
  | "BLOG"
  | "VENDOR_SHOWCASE";

export interface GlassySettings {
  opacity: number; // e.g. 0.75
  blurPx: number; // e.g. 20
  borderWidthPx: number;
  borderColor: string;
  shadow: string;
  gradientBackground: string;
  cardTransparency: number;
  navTransparency: number;
}

export interface UniversalThemeConfig {
  id: string;
  name: string;
  displayMode: DisplayMode;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
  };
  typography: {
    fontFamily: string;
    headingScale: number;
    bodyScale: number;
    fontWeightNormal: number;
    fontWeightBold: number;
  };
  spacing: {
    baseUnitPx: number;
    containerPaddingPx: number;
  };
  borderRadius: {
    buttonPx: number;
    cardPx: number;
    inputPx: number;
  };
  shadows: {
    card: string;
    button: string;
    modal: string;
  };
  glassy: GlassySettings;
  componentOverrides?: Record<string, Record<string, string>>;
}

export interface ResponsiveControls {
  desktop: { visible: boolean; columns: number; padding: string; fontSize: string; alignment: string };
  tablet: { visible: boolean; columns: number; padding: string; fontSize: string; alignment: string };
  mobile: { visible: boolean; columns: number; padding: string; fontSize: string; alignment: string };
}

export interface WidgetEntity {
  id: string;
  type: WidgetType;
  title: string;
  dataBinding?: {
    source: "PRODUCTS" | "CATEGORIES" | "BRANDS" | "COLLECTIONS" | "VENDORS" | "BLOGS" | "CAMPAIGNS";
    filterIds?: string[];
    limit?: number;
  };
  responsive: ResponsiveControls;
  customStyles?: Record<string, string>;
}

export interface PageSectionEntity {
  id: string;
  title: string;
  widgets: WidgetEntity[];
  responsive: ResponsiveControls;
  customStyles?: Record<string, string>;
}

export interface PageLayoutEntity {
  id: string;
  pageType: PageScope;
  title: string;
  slug: string;
  status: "DRAFT" | "PREVIEW" | "PUBLISHED";
  sections: PageSectionEntity[];
  customStyles?: Record<string, string>;
  version: number;
  updatedAt: string;
}

export interface PageRevision {
  revisionId: string;
  pageId: string;
  version: number;
  snapshot: PageLayoutEntity;
  author: string;
  createdAt: string;
}

// In-Memory Theme & Page Store
const themePresetsStore: UniversalThemeConfig[] = [];
const pageLayoutsStore: Record<string, PageLayoutEntity> = {};
const pageRevisionsStore: PageRevision[] = [];

// -------------------------------------------------------------------------
// 1. UNIVERSAL THEME STUDIO ENGINE 2.0
// -------------------------------------------------------------------------

export class UniversalThemeStudioEngine {
  /**
   * Compiles theme tokens and display mode to standard CSS variables
   */
  static compileCssVariables(theme: UniversalThemeConfig): Record<string, string> {
    const vars: Record<string, string> = {
      "--fh-color-primary": theme.colors.primary,
      "--fh-color-secondary": theme.colors.secondary,
      "--fh-color-accent": theme.colors.accent,
      "--fh-color-bg": theme.colors.background,
      "--fh-color-surface": theme.colors.surface,
      "--fh-color-text": theme.colors.text,
      "--fh-color-text-muted": theme.colors.textMuted,
      "--fh-color-border": theme.colors.border,
      "--fh-font-family": theme.typography.fontFamily,
      "--fh-radius-btn": `${theme.borderRadius.buttonPx}px`,
      "--fh-radius-card": `${theme.borderRadius.cardPx}px`,
      "--fh-radius-input": `${theme.borderRadius.inputPx}px`,
      "--fh-shadow-card": theme.shadows.card,
      "--fh-shadow-btn": theme.shadows.button,
    };

    if (theme.displayMode === "GLASSY_MODE") {
      vars["--fh-glass-blur"] = `${theme.glassy.blurPx}px`;
      vars["--fh-glass-opacity"] = theme.glassy.opacity.toString();
      vars["--fh-glass-border"] = `${theme.glassy.borderWidthPx}px solid ${theme.glassy.borderColor}`;
      vars["--fh-glass-bg"] = theme.glassy.gradientBackground;
      vars["--fh-glass-card-opacity"] = theme.glassy.cardTransparency.toString();
      vars["--fh-glass-nav-opacity"] = theme.glassy.navTransparency.toString();
    } else if (theme.displayMode === "DARK_MODE") {
      vars["--fh-color-bg"] = "#090D16";
      vars["--fh-color-surface"] = "#131B2E";
      vars["--fh-color-text"] = "#F8FAFC";
      vars["--fh-color-border"] = "#1E293B";
    }

    return vars;
  }

  /**
   * Saves a theme preset
   */
  static saveThemePreset(theme: UniversalThemeConfig): UniversalThemeConfig {
    const existingIdx = themePresetsStore.findIndex((t) => t.id === theme.id);
    if (existingIdx >= 0) {
      themePresetsStore[existingIdx] = theme;
    } else {
      themePresetsStore.push(theme);
    }
    return theme;
  }

  /**
   * Retrieves all saved theme presets
   */
  static getThemePresets(): UniversalThemeConfig[] {
    return [...themePresetsStore];
  }
}

// -------------------------------------------------------------------------
// 2. SCOPE PRECEDENCE RESOLVER (WIDGET > SECTION > PAGE > GLOBAL)
// -------------------------------------------------------------------------

export class ThemeScopeResolver {
  /**
   * Resolves styles following strict precedence: Widget > Section > Page > Global
   */
  static resolveStyles(params: {
    globalStyles: Record<string, string>;
    pageStyles?: Record<string, string>;
    sectionStyles?: Record<string, string>;
    widgetStyles?: Record<string, string>;
  }): Record<string, string> {
    return {
      ...params.globalStyles,
      ...(params.pageStyles || {}),
      ...(params.sectionStyles || {}),
      ...(params.widgetStyles || {}),
    };
  }
}

// -------------------------------------------------------------------------
// 3. PAGE BUILDER & REVISION ROLLBACK ENGINE
// -------------------------------------------------------------------------

export class PageVersioningEngine {
  /**
   * Saves and publishes a page layout with revision snapshot
   */
  static savePageLayout(
    layout: PageLayoutEntity,
    author: string,
    publish: boolean = false
  ): PageLayoutEntity {
    layout.version = (layout.version || 0) + 1;
    layout.status = publish ? "PUBLISHED" : "DRAFT";
    layout.updatedAt = new Date().toISOString();

    pageLayoutsStore[layout.id] = layout;

    // Snapshot revision
    const revision: PageRevision = {
      revisionId: `rev_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
      pageId: layout.id,
      version: layout.version,
      snapshot: JSON.parse(JSON.stringify(layout)),
      author,
      createdAt: new Date().toISOString(),
    };

    pageRevisionsStore.unshift(revision);
    return layout;
  }

  /**
   * Rolls back a page to a previous revision snapshot
   */
  static rollbackRevision(pageId: string, revisionId: string): { success: boolean; restoredLayout?: PageLayoutEntity } {
    const rev = pageRevisionsStore.find((r) => r.pageId === pageId && r.revisionId === revisionId);
    if (!rev) return { success: false };

    const restored: PageLayoutEntity = JSON.parse(JSON.stringify(rev.snapshot));
    restored.version = (pageLayoutsStore[pageId]?.version || 0) + 1;
    restored.updatedAt = new Date().toISOString();
    pageLayoutsStore[pageId] = restored;

    return { success: true, restoredLayout: restored };
  }

  /**
   * Retrieves revision history for a page
   */
  static getRevisions(pageId: string): PageRevision[] {
    return pageRevisionsStore.filter((r) => r.pageId === pageId);
  }
}

// -------------------------------------------------------------------------
// 4. SECURITY & SANDBOX VALIDATOR
// -------------------------------------------------------------------------

export class ThemeSecuritySandbox {
  /**
   * Sanitizes custom HTML & CSS disallowing arbitrary code execution or credential stealing
   */
  static sanitizeCustomContent(rawContent: string): { isSafe: boolean; sanitized: string } {
    const dangerousPatterns = [
      /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
      /onerror\s*=/gi,
      /onload\s*=/gi,
      /javascript:/gi,
      /eval\s*\(/gi,
      /document\.cookie/gi,
      /localStorage/gi,
    ];

    let sanitized = rawContent;
    let isSafe = true;

    for (const pattern of dangerousPatterns) {
      if (pattern.test(rawContent)) {
        isSafe = false;
        sanitized = sanitized.replace(pattern, "/* blocked_payload */");
      }
    }

    return { isSafe, sanitized };
  }
}
