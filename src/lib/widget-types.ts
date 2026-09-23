export type WidgetCategory =
  | "content"
  | "ecommerce"
  | "category"
  | "vendor"
  | "marketing"
  | "trust"
  | "social"
  | "utility";

export type WidgetType =
  // 1. Content
  | "TEXT"
  | "HEADING"
  | "RICH_TEXT"
  | "IMAGE"
  | "VIDEO"
  | "ICON"
  | "BUTTON"
  | "HTML_BLOCK"
  // 2. E-commerce
  | "PRODUCT_GRID"
  | "PRODUCT_CAROUSEL"
  | "PRODUCT_SLIDER"
  | "PRODUCT_CARD"
  | "FLASH_DEALS"
  | "BEST_SELLERS"
  | "NEW_ARRIVALS"
  | "FEATURED_PRODUCTS"
  | "TRENDING_PRODUCTS"
  | "RECENTLY_VIEWED"
  | "RECOMMENDED_PRODUCTS"
  | "DEALS"
  | "WISHLIST_PRODUCTS"
  | "GROUP_BUYING"
  // 3. Category
  | "CATEGORY_GRID"
  | "CATEGORY_CAROUSEL"
  | "CATEGORY_CARDS"
  | "FEATURED_CATEGORIES"
  | "MEGA_CATEGORY_MENU"
  // 4. Vendor
  | "VENDOR_GRID"
  | "TOP_VENDORS"
  | "FEATURED_VENDORS"
  | "VENDOR_STORE_CARD"
  | "VENDOR_PRODUCTS"
  // 5. Marketing
  | "HERO_BANNER"
  | "PROMO_BANNER"
  | "COUPON_BANNER"
  | "COUNTDOWN_TIMER"
  | "ANNOUNCEMENT_BAR"
  | "OFFER_STRIP"
  | "FESTIVAL_BANNER"
  | "NEWSLETTER"
  | "CTA_BANNER"
  | "SPIN_WHEEL"
  | "SCRATCH_CARD"
  // 6. Trust
  | "FAST_DELIVERY"
  | "SECURE_PAYMENTS"
  | "TRUSTED_VENDORS"
  | "EASY_RETURNS"
  | "TRUST_BADGES"
  // 7. Social & Content
  | "BLOG_POSTS"
  | "TESTIMONIALS"
  | "FAQ"
  | "REVIEWS"
  | "INSTAGRAM_GALLERY"
  | "SHOPPABLE_REELS"
  | "LIVE_VIDEO_COMMERCE"
  | "BRAND_LOGOS"
  // 8. Utility
  | "SEARCH"
  | "BREADCRUMBS"
  | "PAGINATION"
  | "FILTERS"
  | "SORT"
  | "RECENTLY_VIEWED_UTILITY"
  | "COMPARE_TRAY"
  | "WISHLIST_BUTTON"
  | "CART_SUMMARY"
  | "ACCOUNT_SUMMARY";

export interface WidgetResponsiveDeviceSettings {
  columns?: number;
  paddingY?: string;
  paddingX?: string;
  fontSize?: string;
  gap?: string;
  alignment?: "left" | "center" | "right";
  visible?: boolean;
}

export interface WidgetResponsiveSettings {
  desktop?: WidgetResponsiveDeviceSettings;
  tablet?: WidgetResponsiveDeviceSettings;
  mobile?: WidgetResponsiveDeviceSettings;
}

export interface WidgetDataSource {
  type: "STATIC" | "PRODUCTS" | "CATEGORIES" | "VENDORS" | "BLOGS" | "REVIEWS" | "CUSTOM" | string;
  sourceType?: string;
  filter?: "trending" | "best_sellers" | "new_arrivals" | "flash_deals" | "featured" | "all" | string;
  categorySlug?: string;
  categoryId?: string;
  parentId?: string;
  vendorId?: string;
  vendorSlug?: string;
  tagSlug?: string;
  query?: string;
  manualIds?: string[];
  limit?: number;
  sortBy?: "popularity" | "price_asc" | "price_desc" | "rating" | "newest" | string;
  [key: string]: any;
}

export interface WidgetVisibilityRules {
  desktop: boolean;
  tablet: boolean;
  mobile: boolean;
  userRole?: "ALL" | "LOGGED_IN" | "GUEST" | "VENDOR" | "CUSTOMER";
  startDate?: string | null;
  endDate?: string | null;
}

export interface WidgetStyle {
  backgroundColor?: string;
  backgroundGradient?: string;
  textColor?: string;
  accentColor?: string;
  paddingY?: string;
  paddingX?: string;
  marginTop?: string;
  marginBottom?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  boxShadow?: string;
  backdropBlur?: string;
  opacity?: number;
  customClass?: string;
}

export interface WidgetInstance {
  id: string;
  pageId?: string;
  type: WidgetType | string;
  name: string;
  status: "ACTIVE" | "INACTIVE" | "DRAFT" | "SCHEDULED";
  settings: Record<string, any>;
  style: WidgetStyle;
  responsiveSettings: WidgetResponsiveSettings;
  dataSource: WidgetDataSource;
  visibilityRules: WidgetVisibilityRules;
  sortOrder: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  // Compatibility fields
  title?: string | null;
  subtitle?: string | null;
  badgeText?: string | null;
  contentJson?: any;
  stylingJson?: any;
  isActive?: boolean;
  desktopVisible?: boolean;
  mobileVisible?: boolean;
}

export interface ProductWidgetCustomSettings {
  title?: string;
  subtitle?: string;
  badge?: string;
  productSource?: "latest" | "best_selling" | "trending" | "featured" | "discounted" | "category" | "vendor" | "search" | "manual" | string;
  category?: string;
  categorySlug?: string;
  vendor?: string;
  vendorSlug?: string;
  limit?: number;
  columns?: number;
  desktopColumns?: number;
  tabletColumns?: number;
  mobileColumns?: number;
  cardStyle?: "modern" | "classic" | "minimal" | "bordered" | "elevated" | "glass" | "compact" | string;
  imageRatio?: "1:1" | "3:4" | "4:5" | "16:9" | "auto" | string;
  showPrice?: boolean;
  showDiscount?: boolean;
  showRating?: boolean;
  showWishlist?: boolean;
  showCompare?: boolean;
  showQuickView?: boolean;
  showAddToCart?: boolean;
  showStock?: boolean;
  showBadges?: boolean;
  showVendor?: boolean;
  showDeliveryInfo?: boolean;
  showCountdown?: boolean;
  [key: string]: any;
}

export interface WidgetDefinition {
  type: WidgetType;
  name: string;
  category: WidgetCategory;
  categoryName: string;
  description: string;
  iconName: string;
  defaultSettings: Record<string, any>;
  defaultStyle: WidgetStyle;
  defaultResponsive: WidgetResponsiveSettings;
  defaultDataSource: WidgetDataSource;
}

