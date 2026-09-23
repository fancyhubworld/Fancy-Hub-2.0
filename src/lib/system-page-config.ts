export type SystemPageKey =
  | "login"
  | "register"
  | "cart"
  | "checkout"
  | "account"
  | "orders"
  | "wishlist"
  | "vendor-dashboard";

export interface SystemPageUIConfig {
  id: SystemPageKey;
  name: string;
  description: string;
  headerStyle: "default" | "minimal" | "transparent" | "sticky" | "hidden";
  footerStyle: "default" | "minimal" | "compact" | "hidden";
  colors: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    cardColor: string;
    textColor: string;
    borderColor: string;
  };
  typography: {
    fontFamily: "Inter" | "Plus Jakarta Sans" | "Outfit" | "Playfair Display" | "Roboto";
    headingScale: "sm" | "md" | "lg" | "xl";
    lineHeight: "tight" | "normal" | "relaxed";
  };
  spacing: "compact" | "normal" | "relaxed";
  cards: {
    style: "flat" | "elevated" | "glass" | "bordered";
    borderRadius: "none" | "rounded-lg" | "rounded-2xl" | "rounded-3xl" | "pill";
    shadow: "none" | "sm" | "md" | "lg" | "xl";
  };
  buttons: {
    style: "solid" | "outline" | "gradient" | "soft";
    radius: "rounded-lg" | "rounded-xl" | "rounded-2xl" | "pill";
    hoverEffect: "scale" | "glow" | "none";
  };
  forms: {
    inputStyle: "outlined" | "filled" | "underlined";
    inputRadius: "rounded-lg" | "rounded-xl" | "rounded-2xl";
    focusRingColor: string;
  };
  emptyStates: {
    title: string;
    description: string;
    icon: string;
    actionText: string;
    actionLink: string;
  };
  messages: {
    topNotice?: string | null;
    showTrustBadges: boolean;
    trustBadgesText?: string;
  };
}

export const DEFAULT_SYSTEM_PAGES_CONFIG: Record<SystemPageKey, SystemPageUIConfig> = {
  login: {
    id: "login",
    name: "Customer & Admin Login",
    description: "Authentication portal for shoppers and administrators",
    headerStyle: "minimal",
    footerStyle: "minimal",
    colors: {
      primaryColor: "#1455D9",
      secondaryColor: "#F7941D",
      accentColor: "#10B981",
      backgroundColor: "#F8FAFC",
      cardColor: "#FFFFFF",
      textColor: "#0F172A",
      borderColor: "#E2E8F0",
    },
    typography: {
      fontFamily: "Plus Jakarta Sans",
      headingScale: "lg",
      lineHeight: "normal",
    },
    spacing: "normal",
    cards: {
      style: "glass",
      borderRadius: "rounded-3xl",
      shadow: "xl",
    },
    buttons: {
      style: "gradient",
      radius: "rounded-2xl",
      hoverEffect: "scale",
    },
    forms: {
      inputStyle: "outlined",
      inputRadius: "rounded-xl",
      focusRingColor: "#1455D9",
    },
    emptyStates: {
      title: "No Account Found",
      description: "Create an account to start shopping and tracking your orders",
      icon: "UserX",
      actionText: "Create Account",
      actionLink: "/register",
    },
    messages: {
      topNotice: "🔐 256-Bit SSL Encrypted Secure Sign-In",
      showTrustBadges: true,
      trustBadgesText: "100% Authentic Indian Artisan Marketplace",
    },
  },

  register: {
    id: "register",
    name: "Customer Registration",
    description: "New user sign up with instant welcome benefits",
    headerStyle: "minimal",
    footerStyle: "minimal",
    colors: {
      primaryColor: "#1455D9",
      secondaryColor: "#F7941D",
      accentColor: "#10B981",
      backgroundColor: "#F8FAFC",
      cardColor: "#FFFFFF",
      textColor: "#0F172A",
      borderColor: "#E2E8F0",
    },
    typography: {
      fontFamily: "Plus Jakarta Sans",
      headingScale: "lg",
      lineHeight: "normal",
    },
    spacing: "normal",
    cards: {
      style: "glass",
      borderRadius: "rounded-3xl",
      shadow: "xl",
    },
    buttons: {
      style: "gradient",
      radius: "rounded-2xl",
      hoverEffect: "scale",
    },
    forms: {
      inputStyle: "outlined",
      inputRadius: "rounded-xl",
      focusRingColor: "#1455D9",
    },
    emptyStates: {
      title: "Join FancyHub Today",
      description: "Get ₹500 discount on your first handloom or tech order",
      icon: "Gift",
      actionText: "Explore Products",
      actionLink: "/shop",
    },
    messages: {
      topNotice: "🎉 Get FLAT ₹500 OFF on your first purchase after registration!",
      showTrustBadges: true,
      trustBadgesText: "Verified Sellers & Guaranteed Artisan Direct Pricing",
    },
  },

  cart: {
    id: "cart",
    name: "Shopping Bag / Cart",
    description: "Cart summary, item breakdown, and pricing calculation",
    headerStyle: "default",
    footerStyle: "compact",
    colors: {
      primaryColor: "#1455D9",
      secondaryColor: "#F7941D",
      accentColor: "#10B981",
      backgroundColor: "#F8FAFC",
      cardColor: "#FFFFFF",
      textColor: "#0F172A",
      borderColor: "#E2E8F0",
    },
    typography: {
      fontFamily: "Inter",
      headingScale: "lg",
      lineHeight: "normal",
    },
    spacing: "normal",
    cards: {
      style: "elevated",
      borderRadius: "rounded-2xl",
      shadow: "md",
    },
    buttons: {
      style: "solid",
      radius: "rounded-xl",
      hoverEffect: "scale",
    },
    forms: {
      inputStyle: "outlined",
      inputRadius: "rounded-xl",
      focusRingColor: "#1455D9",
    },
    emptyStates: {
      title: "Your Shopping Bag is Empty",
      description: "Explore our handpicked collection of sarees, menswear, audio & tech.",
      icon: "ShoppingBag",
      actionText: "Start Shopping",
      actionLink: "/shop",
    },
    messages: {
      topNotice: "🚚 FREE Shipping on all Prepaid & UPI orders above ₹999",
      showTrustBadges: true,
      trustBadgesText: "7-Day Easy Returns • Free Doorstep Pickup",
    },
  },

  checkout: {
    id: "checkout",
    name: "Secure Checkout",
    description: "Address selection, order review, and payment processing",
    headerStyle: "minimal",
    footerStyle: "minimal",
    colors: {
      primaryColor: "#1455D9",
      secondaryColor: "#F7941D",
      accentColor: "#10B981",
      backgroundColor: "#F8FAFC",
      cardColor: "#FFFFFF",
      textColor: "#0F172A",
      borderColor: "#E2E8F0",
    },
    typography: {
      fontFamily: "Plus Jakarta Sans",
      headingScale: "lg",
      lineHeight: "normal",
    },
    spacing: "compact",
    cards: {
      style: "bordered",
      borderRadius: "rounded-2xl",
      shadow: "sm",
    },
    buttons: {
      style: "gradient",
      radius: "rounded-xl",
      hoverEffect: "scale",
    },
    forms: {
      inputStyle: "outlined",
      inputRadius: "rounded-xl",
      focusRingColor: "#1455D9",
    },
    emptyStates: {
      title: "Checkout Unavailable",
      description: "Your cart is currently empty. Add items to proceed to checkout.",
      icon: "AlertCircle",
      actionText: "Return to Shop",
      actionLink: "/shop",
    },
    messages: {
      topNotice: "⚡ Guaranteed 24-48h Dispatch with Live SMS & WhatsApp Tracking",
      showTrustBadges: true,
      trustBadgesText: "Razorpay 256-Bit SSL • PCI-DSS Level 1 Compliant",
    },
  },

  account: {
    id: "account",
    name: "My Account & Profile",
    description: "Customer profile, saved addresses, wallet balance, and security",
    headerStyle: "default",
    footerStyle: "default",
    colors: {
      primaryColor: "#1455D9",
      secondaryColor: "#F7941D",
      accentColor: "#10B981",
      backgroundColor: "#F8FAFC",
      cardColor: "#FFFFFF",
      textColor: "#0F172A",
      borderColor: "#E2E8F0",
    },
    typography: {
      fontFamily: "Plus Jakarta Sans",
      headingScale: "md",
      lineHeight: "normal",
    },
    spacing: "normal",
    cards: {
      style: "elevated",
      borderRadius: "rounded-2xl",
      shadow: "md",
    },
    buttons: {
      style: "solid",
      radius: "rounded-xl",
      hoverEffect: "scale",
    },
    forms: {
      inputStyle: "outlined",
      inputRadius: "rounded-xl",
      focusRingColor: "#1455D9",
    },
    emptyStates: {
      title: "No Saved Addresses",
      description: "Add your shipping address for fast 1-click checkout.",
      icon: "MapPin",
      actionText: "+ Add New Address",
      actionLink: "/account/profile",
    },
    messages: {
      topNotice: "⭐ FancyHub Rewards Member: Earn 5% Cashback in your wallet on every order",
      showTrustBadges: true,
    },
  },

  orders: {
    id: "orders",
    name: "Order History & Tracking",
    description: "Past orders, tracking timeline, invoice download, and return requests",
    headerStyle: "default",
    footerStyle: "default",
    colors: {
      primaryColor: "#1455D9",
      secondaryColor: "#F7941D",
      accentColor: "#10B981",
      backgroundColor: "#F8FAFC",
      cardColor: "#FFFFFF",
      textColor: "#0F172A",
      borderColor: "#E2E8F0",
    },
    typography: {
      fontFamily: "Inter",
      headingScale: "md",
      lineHeight: "normal",
    },
    spacing: "normal",
    cards: {
      style: "bordered",
      borderRadius: "rounded-2xl",
      shadow: "sm",
    },
    buttons: {
      style: "outline",
      radius: "rounded-xl",
      hoverEffect: "scale",
    },
    forms: {
      inputStyle: "outlined",
      inputRadius: "rounded-xl",
      focusRingColor: "#1455D9",
    },
    emptyStates: {
      title: "No Orders Yet",
      description: "You haven't placed any orders yet. Explore our top trending collections!",
      icon: "PackageOpen",
      actionText: "Discover Products",
      actionLink: "/shop",
    },
    messages: {
      topNotice: "📦 Real-Time Order Tracking with BlueDart, Delhivery & DTDC Express",
      showTrustBadges: true,
    },
  },

  wishlist: {
    id: "wishlist",
    name: "My Wishlist",
    description: "Saved favorite items and price-drop notifications",
    headerStyle: "default",
    footerStyle: "default",
    colors: {
      primaryColor: "#1455D9",
      secondaryColor: "#F7941D",
      accentColor: "#10B981",
      backgroundColor: "#F8FAFC",
      cardColor: "#FFFFFF",
      textColor: "#0F172A",
      borderColor: "#E2E8F0",
    },
    typography: {
      fontFamily: "Plus Jakarta Sans",
      headingScale: "md",
      lineHeight: "normal",
    },
    spacing: "normal",
    cards: {
      style: "elevated",
      borderRadius: "rounded-3xl",
      shadow: "md",
    },
    buttons: {
      style: "solid",
      radius: "rounded-xl",
      hoverEffect: "scale",
    },
    forms: {
      inputStyle: "outlined",
      inputRadius: "rounded-xl",
      focusRingColor: "#1455D9",
    },
    emptyStates: {
      title: "Your Wishlist is Empty",
      description: "Click the heart icon on any product to save it here for later.",
      icon: "Heart",
      actionText: "Explore Trending",
      actionLink: "/deals",
    },
    messages: {
      topNotice: "❤️ Get notified immediately when your wishlist items go on discount",
      showTrustBadges: true,
    },
  },

  "vendor-dashboard": {
    id: "vendor-dashboard",
    name: "Vendor ERP Dashboard",
    description: "Seller operations, catalog management, payouts, and customer analytics",
    headerStyle: "minimal",
    footerStyle: "minimal",
    colors: {
      primaryColor: "#1455D9",
      secondaryColor: "#D97706",
      accentColor: "#10B981",
      backgroundColor: "#0F172A",
      cardColor: "#1E293B",
      textColor: "#F8FAFC",
      borderColor: "#334155",
    },
    typography: {
      fontFamily: "Outfit",
      headingScale: "lg",
      lineHeight: "normal",
    },
    spacing: "normal",
    cards: {
      style: "glass",
      borderRadius: "rounded-2xl",
      shadow: "lg",
    },
    buttons: {
      style: "solid",
      radius: "rounded-xl",
      hoverEffect: "scale",
    },
    forms: {
      inputStyle: "outlined",
      inputRadius: "rounded-xl",
      focusRingColor: "#1455D9",
    },
    emptyStates: {
      title: "No Store Products",
      description: "Upload your first master-weaver handicraft or retail product to start selling.",
      icon: "Store",
      actionText: "+ Add First Product",
      actionLink: "/vendor/products/new",
    },
    messages: {
      topNotice: "💼 0% Commission on your first 50 orders • Next-Day Bank Payouts",
      showTrustBadges: true,
      trustBadgesText: "GST & FSSAI Compliant Vendor Hub",
    },
  },
};
