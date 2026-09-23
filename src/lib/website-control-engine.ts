export interface WebsiteControlCenterData {
  status: {
    websiteStatus: "OPERATIONAL" | "MAINTENANCE" | "DEGRADED";
    uptimePercentage: number;
    lastPing: string;
    maintenanceMode: boolean;
  };
  theme: {
    name: string;
    appearanceMode: "LIGHT" | "DARK" | "GLASSY";
    primaryColor: string;
    fontFamily: string;
    radius: string;
  };
  metrics: {
    draftChanges: number;
    scheduledChanges: number;
    brokenLinks: number;
    seoScore: number;
    performanceScore: number;
    activePages: number;
    activeWidgets: number;
  };
  quickActions: Array<{
    id: string;
    label: string;
    description: string;
    icon: string;
    route: string;
    isExternal?: boolean;
    badge?: string;
  }>;
}

export function getWebsiteControlCenterData(): WebsiteControlCenterData {
  return {
    status: {
      websiteStatus: "OPERATIONAL",
      uptimePercentage: 99.98,
      lastPing: new Date().toISOString(),
      maintenanceMode: false,
    },
    theme: {
      name: "FancyHub Modern 2.0",
      appearanceMode: "LIGHT",
      primaryColor: "#1455D9",
      fontFamily: "Plus Jakarta Sans",
      radius: "1rem",
    },
    metrics: {
      draftChanges: 2,
      scheduledChanges: 1,
      brokenLinks: 0,
      seoScore: 96,
      performanceScore: 94,
      activePages: 14,
      activeWidgets: 42,
    },
    quickActions: [
      {
        id: "edit-homepage",
        label: "Edit Homepage",
        description: "Open live visual drag-and-drop builder for main landing page",
        icon: "Layout",
        route: "/admin/visual-builder?slug=home",
        badge: "Homepage",
      },
      {
        id: "theme-studio",
        label: "Theme Studio",
        description: "Customize global colors, typography, cards, and glassy mode",
        icon: "Palette",
        route: "/admin/theme-studio",
        badge: "Live Tokens",
      },
      {
        id: "navigation",
        label: "Navigation & Menus",
        description: "Configure mega-menus, category strips, and header nav links",
        icon: "Sliders",
        route: "/admin/menus",
        badge: "Header/Footer",
      },
      {
        id: "pages",
        label: "Pages Manager",
        description: "Create, duplicate, schedule, and publish storefront pages",
        icon: "FileText",
        route: "/admin/pages",
        badge: "14 Pages",
      },
      {
        id: "widgets",
        label: "Widget Marketplace",
        description: "Install modular commerce, gamification, and video widgets",
        icon: "Grid",
        route: "/admin/widget-marketplace",
        badge: "40+ Registered",
      },
      {
        id: "media",
        label: "Media Library",
        description: "Upload high-res imagery with SEO alt text and webp sizing",
        icon: "Image",
        route: "/admin/media",
        badge: "Digital Assets",
      },
      {
        id: "preview-website",
        label: "Preview Live Website",
        description: "Open customer storefront in a new browser tab",
        icon: "ExternalLink",
        route: "/",
        isExternal: true,
        badge: "Storefront",
      },
    ],
  };
}
