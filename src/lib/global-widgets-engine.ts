export interface GlobalWidgetsConfig {
  header: {
    enabled: boolean;
    sticky: boolean;
    transparentOnHero: boolean;
    showLocation: boolean;
    showWishlist: boolean;
    showCart: boolean;
    showAccount: boolean;
  };
  footer: {
    enabled: boolean;
    showNewsletter: boolean;
    showSocialIcons: boolean;
    showPaymentBadges: boolean;
    showAppDownload: boolean;
    copyrightText: string;
  };
  announcement: {
    enabled: boolean;
    text: string;
    badgeText?: string;
    link?: string;
    bgColor?: string;
    textColor?: string;
    isDismissible: boolean;
    countdownTarget?: string;
    animation: "marquee" | "pulse" | "fade" | "none";
  };
  trustBar: {
    enabled: boolean;
    position: "top" | "below-hero" | "above-footer";
    items: Array<{ icon: string; title: string; desc: string }>;
  };
  floatingHelp: {
    enabled: boolean;
    whatsappNumber?: string;
    aiAssistantEnabled: boolean;
    backToTopEnabled: boolean;
    desktopPosition: "bottom_right" | "bottom_left" | "top_right" | "top_left";
    mobilePosition: "bottom_right" | "bottom_left" | "top_right" | "top_left";
  };
}

export const DEFAULT_GLOBAL_WIDGETS: GlobalWidgetsConfig = {
  header: {
    enabled: true,
    sticky: true,
    transparentOnHero: false,
    showLocation: true,
    showWishlist: true,
    showCart: true,
    showAccount: true,
  },
  footer: {
    enabled: true,
    showNewsletter: true,
    showSocialIcons: true,
    showPaymentBadges: true,
    showAppDownload: true,
    copyrightText: "© 2026 FancyHub.in — Direct Weavers & Artisans Marketplace",
  },
  announcement: {
    enabled: true,
    text: "🚀 Festive Dhamaka: Extra 10% Cashback on UPI Payments above ₹1,499 | Use Code: UPIFANCY",
    badgeText: "LIMITED TIME",
    link: "/deals",
    bgColor: "#1455D9",
    textColor: "#FFFFFF",
    isDismissible: true,
    animation: "marquee",
  },
  trustBar: {
    enabled: true,
    position: "above-footer",
    items: [
      { icon: "ShieldCheck", title: "100% Genuine Handlooms", desc: "Silk Mark & Handloom Board Certified" },
      { icon: "Truck", title: "Free Express Shipping", desc: "Across 19,000+ Indian Pincodes" },
      { icon: "RotateCcw", title: "7-Day Easy Returns", desc: "Instant pickup & full refund" },
      { icon: "IndianRupee", title: "Cash on Delivery", desc: "Doorstep payment with Cash/UPI QR" },
    ],
  },
  floatingHelp: {
    enabled: true,
    whatsappNumber: "+919876543210",
    aiAssistantEnabled: true,
    backToTopEnabled: true,
    desktopPosition: "bottom_right",
    mobilePosition: "bottom_right",
  },
};
