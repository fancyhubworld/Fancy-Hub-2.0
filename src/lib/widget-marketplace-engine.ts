export interface WidgetMarketplacePlugin {
  id: string;
  widgetType: string;
  name: string;
  icon: string;
  category: "COMMERCE" | "MARKETING" | "MEDIA" | "ENGAGEMENT" | "UTILITY";
  version: string;
  author: string;
  description: string;
  thumbnailUrl: string;
  isInstalled: boolean;
  downloadsCount: number;
  rating: number;
  defaultSettings: Record<string, any>;
  defaultStyle: Record<string, any>;
  settingsSchema: Array<{
    key: string;
    label: string;
    type: "text" | "number" | "boolean" | "select" | "color" | "image";
    options?: { label: string; value: any }[];
    default?: any;
    description?: string;
  }>;
}

export const MARKETPLACE_PLUGINS_REGISTRY: WidgetMarketplacePlugin[] = [
  {
    id: "plugin-insta-reels",
    widgetType: "INSTAGRAM_REELS_FEED",
    name: "Shoppable Instagram Reels & Shorts",
    icon: "Video",
    category: "MEDIA",
    version: "1.2.0",
    author: "FancyHub Verified",
    description: "Vertical video carousel with taggable products and instant 1-click cart checkout.",
    thumbnailUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80",
    isInstalled: true,
    downloadsCount: 1420,
    rating: 4.9,
    defaultSettings: {
      autoplay: true,
      soundMuted: true,
      showProductPill: true,
      feedSource: "@fancyhub.in",
    },
    defaultStyle: {
      paddingY: "py-8",
      backgroundColor: "#0F172A",
    },
    settingsSchema: [
      { key: "feedSource", label: "Instagram Handle / Hashtag", type: "text", default: "@fancyhub.in" },
      { key: "autoplay", label: "Autoplay Video", type: "boolean", default: true },
      { key: "showProductPill", label: "Show Shoppable Product Tag", type: "boolean", default: true },
    ],
  },
  {
    id: "plugin-spin-wheel",
    widgetType: "SPIN_WHEEL_GAMIFICATION",
    name: "Lucky Spin Wheel & Coupon Win",
    icon: "Sparkles",
    category: "ENGAGEMENT",
    version: "2.0.1",
    author: "FancyHub Marketing Labs",
    description: "Gamified reward wheel to capture leads, distribute promo coupons, and boost cart conversions.",
    thumbnailUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&q=80",
    isInstalled: true,
    downloadsCount: 890,
    rating: 4.8,
    defaultSettings: {
      triggerEvent: "exit_intent",
      maxSpinsPerUser: 1,
      rewardCoupons: "FANCY10, SILK20, FREESHIP",
    },
    defaultStyle: {
      paddingY: "py-6",
      backgroundColor: "#FFFFFF",
    },
    settingsSchema: [
      { key: "rewardCoupons", label: "Reward Coupon Codes (comma separated)", type: "text", default: "FANCY10, SILK20" },
      { key: "maxSpinsPerUser", label: "Max Spins Per Customer", type: "number", default: 1 },
    ],
  },
  {
    id: "plugin-countdown-pro",
    widgetType: "COUNTDOWN_TIMER_PRO",
    name: "Festival Flash Sale Sticky Countdown",
    icon: "Clock",
    category: "MARKETING",
    version: "1.0.4",
    author: "FancyHub Verified",
    description: "High-urgency banner with animated flip clock and inventory left indicators.",
    thumbnailUrl: "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=600&q=80",
    isInstalled: true,
    downloadsCount: 2300,
    rating: 5.0,
    defaultSettings: {
      targetDate: "2026-09-01T00:00:00Z",
      bannerText: "Diwali Maha Bumper Sale Starts In:",
      accentColor: "#F7941D",
    },
    defaultStyle: {
      paddingY: "py-3",
      backgroundColor: "#1455D9",
    },
    settingsSchema: [
      { key: "bannerText", label: "Countdown Heading", type: "text", default: "Flash Sale Ending Soon:" },
      { key: "targetDate", label: "Target Expiry Date (ISO)", type: "text", default: "2026-09-01T00:00:00Z" },
    ],
  },
  {
    id: "plugin-3d-model",
    widgetType: "PRODUCT_3D_MODEL_VIEWER",
    name: "Interactive 3D AR Model Showcase",
    icon: "Box",
    category: "COMMERCE",
    version: "1.0.0",
    author: "FancyHub 3D Studio",
    description: "Interactive WebGL 3D rotating product view with WebXR Augmented Reality placement.",
    thumbnailUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80",
    isInstalled: false,
    downloadsCount: 450,
    rating: 4.7,
    defaultSettings: {
      autoRotate: true,
      enableAR: true,
      modelUrl: "/models/fancy_saree.glb",
    },
    defaultStyle: {
      paddingY: "py-10",
      backgroundColor: "#F8FAFC",
    },
    settingsSchema: [
      { key: "modelUrl", label: "GLTF / GLB 3D Model URL", type: "text", default: "/models/fancy_saree.glb" },
      { key: "autoRotate", label: "Auto Rotate Model", type: "boolean", default: true },
    ],
  },
];

let runtimeInstalledPlugins: WidgetMarketplacePlugin[] = [...MARKETPLACE_PLUGINS_REGISTRY];

export function getInstalledWidgetPlugins(): WidgetMarketplacePlugin[] {
  return runtimeInstalledPlugins.filter((p) => p.isInstalled);
}

export function getAllMarketplacePlugins(): WidgetMarketplacePlugin[] {
  return runtimeInstalledPlugins;
}

export function installWidgetPlugin(pluginId: string): boolean {
  const target = runtimeInstalledPlugins.find((p) => p.id === pluginId);
  if (!target) return false;
  target.isInstalled = true;
  return true;
}

export function uninstallWidgetPlugin(pluginId: string): boolean {
  const target = runtimeInstalledPlugins.find((p) => p.id === pluginId);
  if (!target) return false;
  target.isInstalled = false;
  return true;
}
