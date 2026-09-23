export type NavigationMenuType =
  | "main_menu"
  | "mobile_menu"
  | "footer_menu"
  | "account_menu"
  | "vendor_menu";

export type NavigationItemType =
  | "page"
  | "category"
  | "product"
  | "product_collection"
  | "external_url"
  | "vendor"
  | "custom_link";

export interface NavigationMenuItem {
  id: string;
  label: string;
  type: NavigationItemType;
  target: string;                // URL or slug or resource ID (e.g. "/category/sarees", "page:festive-sale")
  badge?: string;                // e.g. "HOT", "NEW", "50% OFF"
  badgeColor?: string;
  iconName?: string;
  openInNewTab?: boolean;
  sortOrder: number;
  isActive: boolean;
  children?: NavigationMenuItem[]; // Submenus / Mega Menu Columns
}

export interface NavigationMenuConfig {
  id: NavigationMenuType;
  name: string;
  description: string;
  items: NavigationMenuItem[];
  updatedAt?: string | Date;
}

export const DEFAULT_NAVIGATION_MENUS: Record<NavigationMenuType, NavigationMenuConfig> = {
  main_menu: {
    id: "main_menu",
    name: "Main Desktop Header Menu",
    description: "Primary top navigation bar with dropdowns and category highlights",
    items: [
      {
        id: "nav-1",
        label: "Home",
        type: "page",
        target: "/",
        sortOrder: 0,
        isActive: true,
      },
      {
        id: "nav-2",
        label: "Handloom Sarees",
        type: "category",
        target: "/category/sarees",
        badge: "VERIFIED WEAVES",
        badgeColor: "#F7941D",
        sortOrder: 1,
        isActive: true,
        children: [
          { id: "nav-2-1", label: "Banarasi Pure Silk", type: "category", target: "/category/banarasi-silk", sortOrder: 0, isActive: true },
          { id: "nav-2-2", label: "Kanjivaram Bridal", type: "category", target: "/category/kanjivaram", sortOrder: 1, isActive: true },
          { id: "nav-2-3", label: "Chanderi & Tussar", type: "category", target: "/category/chanderi", sortOrder: 2, isActive: true },
        ],
      },
      {
        id: "nav-3",
        label: "Ethnic Kurtas",
        type: "category",
        target: "/category/kurtas",
        sortOrder: 2,
        isActive: true,
      },
      {
        id: "nav-4",
        label: "5G & Audio Tech",
        type: "category",
        target: "/category/electronics",
        badge: "NEW",
        badgeColor: "#1455D9",
        sortOrder: 3,
        isActive: true,
      },
      {
        id: "nav-5",
        label: "Flash Sale",
        type: "product_collection",
        target: "/flash-sale",
        badge: "50% OFF",
        badgeColor: "#EF4444",
        sortOrder: 4,
        isActive: true,
      },
      {
        id: "nav-6",
        label: "Direct Artisans",
        type: "vendor",
        target: "/vendors",
        sortOrder: 5,
        isActive: true,
      },
    ],
  },

  mobile_menu: {
    id: "mobile_menu",
    name: "Mobile Drawer Navigation",
    description: "Responsive hamburger side navigation optimized for mobile touch targets",
    items: [
      { id: "mob-1", label: "All Categories", type: "page", target: "/categories", iconName: "Grid", sortOrder: 0, isActive: true },
      { id: "mob-2", label: "Deals & Coupons", type: "product_collection", target: "/deals", iconName: "Zap", badge: "HOT", sortOrder: 1, isActive: true },
      { id: "mob-3", label: "Artisan Guilds", type: "vendor", target: "/vendors", iconName: "Users", sortOrder: 2, isActive: true },
      { id: "mob-4", label: "Track Your Order", type: "page", target: "/track-order", iconName: "Truck", sortOrder: 3, isActive: true },
      { id: "mob-5", label: "Customer Support", type: "page", target: "/help", iconName: "Headphones", sortOrder: 4, isActive: true },
    ],
  },

  footer_menu: {
    id: "footer_menu",
    name: "Global Footer Links",
    description: "Organized link columns across About Us, Policies, Seller Portal & Support",
    items: [
      { id: "foot-1", label: "About FancyHub", type: "page", target: "/p/about-us", sortOrder: 0, isActive: true },
      { id: "foot-2", label: "Sell on FancyHub", type: "vendor", target: "/vendor/register", sortOrder: 1, isActive: true },
      { id: "foot-3", label: "Return & Refund Policy", type: "page", target: "/p/returns-policy", sortOrder: 2, isActive: true },
      { id: "foot-4", label: "Terms & Conditions", type: "page", target: "/p/terms", sortOrder: 3, isActive: true },
      { id: "foot-5", label: "Privacy Policy", type: "page", target: "/p/privacy", sortOrder: 4, isActive: true },
    ],
  },

  account_menu: {
    id: "account_menu",
    name: "Customer Account Menu",
    description: "User dashboard dropdown and quick links",
    items: [
      { id: "acc-1", label: "My Orders & Tracking", type: "page", target: "/orders", sortOrder: 0, isActive: true },
      { id: "acc-2", label: "My Wishlist", type: "page", target: "/wishlist", sortOrder: 1, isActive: true },
      { id: "acc-3", label: "Fancy Wallet & Rewards", type: "page", target: "/wallet", sortOrder: 2, isActive: true },
      { id: "acc-4", label: "Account Security & 2FA", type: "page", target: "/account/security", sortOrder: 3, isActive: true },
    ],
  },

  vendor_menu: {
    id: "vendor_menu",
    name: "Vendor Portal Navigation",
    description: "Seller dashboard, catalog management and payout controls",
    items: [
      { id: "ven-1", label: "Vendor Dashboard", type: "page", target: "/vendor/dashboard", sortOrder: 0, isActive: true },
      { id: "ven-2", label: "Catalog & Products", type: "page", target: "/vendor/products", sortOrder: 1, isActive: true },
      { id: "ven-3", label: "Orders & Shipping", type: "page", target: "/vendor/orders", sortOrder: 2, isActive: true },
      { id: "ven-4", label: "Payouts & Wallet", type: "page", target: "/vendor/wallet", sortOrder: 3, isActive: true },
    ],
  },
};
