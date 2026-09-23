export type FloatingActionType =
  | "whatsapp"
  | "support"
  | "ai_assistant"
  | "back_to_top"
  | "coupon"
  | "chat"
  | "wishlist"
  | "cart";

export type FloatingPosition =
  | "bottom_right"
  | "bottom_left"
  | "top_right"
  | "top_left";

export interface FloatingActionItem {
  id: string;
  type: FloatingActionType;
  label: string;
  iconName: string;
  isEnabled: boolean;
  targetLink?: string;
  badge?: string;
  customTooltip?: string;
  color?: string;
  iconBgColor?: string;
}

export interface FloatingWidgetSettings {
  isEnabled: boolean;
  desktopPosition: FloatingPosition;
  mobilePosition: FloatingPosition;
  offsetBottomPx: number;
  offsetSidePx: number;
  actions: FloatingActionItem[];
  glassmorphism: boolean;
  showLabels: boolean;
}

export const DEFAULT_FLOATING_WIDGETS: FloatingWidgetSettings = {
  isEnabled: true,
  desktopPosition: "bottom_right",
  mobilePosition: "bottom_right",
  offsetBottomPx: 24,
  offsetSidePx: 24,
  glassmorphism: true,
  showLabels: true,
  actions: [
    {
      id: "fa-whatsapp",
      type: "whatsapp",
      label: "WhatsApp VIP Support",
      iconName: "MessageCircle",
      isEnabled: true,
      targetLink: "https://wa.me/919876543210?text=Hi%20FancyHub%2C%20I%20need%20assistance",
      color: "#25D366",
      iconBgColor: "#25D366",
      badge: "LIVE",
    },
    {
      id: "fa-ai",
      type: "ai_assistant",
      label: "AI Silk & Sizing Assistant",
      iconName: "Bot",
      isEnabled: true,
      targetLink: "/help/ai-assistant",
      color: "#6366F1",
      iconBgColor: "#6366F1",
    },
    {
      id: "fa-support",
      type: "support",
      label: "Customer Care",
      iconName: "Headphones",
      isEnabled: true,
      targetLink: "/help",
      color: "#0EA5E9",
      iconBgColor: "#0EA5E9",
    },
    {
      id: "fa-coupon",
      type: "coupon",
      label: "Active Coupons (3)",
      iconName: "Tag",
      isEnabled: true,
      targetLink: "/coupons",
      color: "#F7941D",
      iconBgColor: "#F7941D",
      badge: "3 OFFERS",
    },
    {
      id: "fa-top",
      type: "back_to_top",
      label: "Back to Top",
      iconName: "ArrowUp",
      isEnabled: true,
      color: "#1E293B",
      iconBgColor: "#334155",
    },
  ],
};
