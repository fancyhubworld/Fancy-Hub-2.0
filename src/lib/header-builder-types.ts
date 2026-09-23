export type HeaderElementKey =
  | "HAMBURGER_MENU"
  | "ANNOUNCEMENT_BAR"
  | "LOGO"
  | "LOCATION"
  | "SEARCH"
  | "ACCOUNT"
  | "WISHLIST"
  | "CART"
  | "VENDOR_PORTAL"
  | "ADMIN_ERP"
  | "NAVIGATION"
  | "MEGA_MENU";

export interface HeaderElementConfig {
  key: HeaderElementKey;
  name: string;
  description: string;
  isActive: boolean;
  desktopSortOrder: number;
  mobileSortOrder: number;
  desktopVisible: boolean;
  mobileVisible: boolean;
  settings: Record<string, any>;
}

export interface HeaderBuilderConfig {
  id: string;
  isSticky: boolean;
  desktopLayoutType: "standard" | "compact" | "centered_logo" | "minimal";
  mobileLayoutType: "standard" | "compact_search" | "inline_search" | "minimal" | "bottom_bar";
  elements: HeaderElementConfig[];
  updatedAt?: string;
}

export const DEFAULT_HEADER_ELEMENTS: HeaderElementConfig[] = [
  {
    key: "HAMBURGER_MENU",
    name: "Hamburger Menu (☰)",
    description: "Mobile slide-over navigation drawer trigger icon with category tree & quick links",
    isActive: true,
    desktopSortOrder: 99,
    mobileSortOrder: 0,
    desktopVisible: false,
    mobileVisible: true,
    settings: {
      icon: "Menu",
      showBadge: false,
      drawerTitle: "FancyHub Navigation",
    },
  },
  {
    key: "ANNOUNCEMENT_BAR",
    name: "Announcement bar",
    description: "Top promotional marquee or notification bar with custom badge & coupon link",
    isActive: true,
    desktopSortOrder: 0,
    mobileSortOrder: 1,
    desktopVisible: true,
    mobileVisible: true,
    settings: {
      text: "⚡ Festive Dhamaka: FLAT ₹200 OFF on First Order | Use Code: FANCYFIRST",
      badge: "FESTIVE 2026",
      link: "/deals",
      bgColor: "#0A1128",
      textColor: "#FFFFFF",
    },
  },
  {
    key: "LOGO",
    name: "Logo",
    description: "Brand logo text/image with alignment and optional marketplace tagline",
    isActive: true,
    desktopSortOrder: 1,
    mobileSortOrder: 2,
    desktopVisible: true,
    mobileVisible: true,
    settings: {
      text: "FancyHub",
      subtext: ".in",
      logoUrl: "",
      alignment: "left",
      tagline: "India's Artisan Marketplace",
    },
  },
  {
    key: "SEARCH",
    name: "Search",
    description: "Smart predictive search bar with voice recognition, image lens & category filter",
    isActive: true,
    desktopSortOrder: 3,
    mobileSortOrder: 3,
    desktopVisible: true,
    mobileVisible: true,
    settings: {
      placeholder: "Search for Sarees, Kurtas, Mobiles, ANC Earbuds, Brands...",
      showCategoryDropdown: true,
      enableVoiceSearch: true,
      enableLensSearch: true,
    },
  },
  {
    key: "WISHLIST",
    name: "Wishlist",
    description: "Wishlist counter badge with instant bookmark reel shortcut",
    isActive: true,
    desktopSortOrder: 5,
    mobileSortOrder: 4,
    desktopVisible: true,
    mobileVisible: true,
    settings: {
      showBadgeCount: true,
      icon: "Heart",
    },
  },
  {
    key: "CART",
    name: "Cart",
    description: "Shopping cart action with live items count and mini-cart slideover",
    isActive: true,
    desktopSortOrder: 6,
    mobileSortOrder: 5,
    desktopVisible: true,
    mobileVisible: true,
    settings: {
      showPriceTotal: true,
      showItemCount: true,
      buttonStyle: "pill",
    },
  },
  {
    key: "LOCATION",
    name: "Location",
    description: "Delivery pincode selector modal with live express dispatch estimates",
    isActive: true,
    desktopSortOrder: 2,
    mobileSortOrder: 6,
    desktopVisible: true,
    mobileVisible: false,
    settings: {
      defaultPincode: "395003",
      defaultCity: "Surat",
      showLabel: true,
    },
  },
  {
    key: "ACCOUNT",
    name: "Account",
    description: "User profile dropdown, Google 1-Click login, orders & profile shortcuts",
    isActive: true,
    desktopSortOrder: 4,
    mobileSortOrder: 7,
    desktopVisible: true,
    mobileVisible: false,
    settings: {
      showAvatar: true,
      showOrdersLink: true,
      showWalletLink: true,
    },
  },
  {
    key: "VENDOR_PORTAL",
    name: "Vendor Portal",
    description: "Direct link to verified Indian Artisan seller onboarding & vendor dashboard",
    isActive: true,
    desktopSortOrder: 7,
    mobileSortOrder: 8,
    desktopVisible: true,
    mobileVisible: false,
    settings: {
      label: "Sell on FancyHub",
      badge: "SELL",
      link: "/vendor/login",
    },
  },
  {
    key: "ADMIN_ERP",
    name: "Admin ERP",
    description: "Admin ERP control console shortcut for authenticated super administrators",
    isActive: true,
    desktopSortOrder: 8,
    mobileSortOrder: 9,
    desktopVisible: true,
    mobileVisible: false,
    settings: {
      label: "Admin ERP",
      link: "/admin/dashboard",
    },
  },
  {
    key: "NAVIGATION",
    name: "Navigation",
    description: "Horizontal primary department navigation ribbon with custom links",
    isActive: true,
    desktopSortOrder: 9,
    mobileSortOrder: 10,
    desktopVisible: true,
    mobileVisible: false,
    settings: {
      links: [
        { label: "Deals", href: "/deals", isHighlight: true },
        { label: "Flash Sale", href: "/flash-sale", isHighlight: true },
        { label: "New Arrivals", href: "/new-arrivals" },
        { label: "Best Sellers", href: "/best-sellers" },
        { label: "Custom Print", href: "/custom-print" },
        { label: "Verified Vendors", href: "/vendors" },
      ],
    },
  },
  {
    key: "MEGA_MENU",
    name: "Mega Menu",
    description: "Multi-column category flyout with banners, verified badges & subcategory trees",
    isActive: true,
    desktopSortOrder: 10,
    mobileSortOrder: 11,
    desktopVisible: true,
    mobileVisible: false,
    settings: {
      columns: 4,
      showFeaturedPromo: true,
      showCategoryIcons: true,
    },
  },
];
