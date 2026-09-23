export type CategorySectionType =
  | "CATEGORY_BANNER"
  | "CATEGORY_BREADCRUMB"
  | "CATEGORY_TITLE"
  | "CATEGORY_DESCRIPTION"
  | "SUBCATEGORIES_LIST"
  | "FILTERS_SIDEBAR"
  | "SORTING_BAR"
  | "PRODUCT_GRID"
  | "SIDEBAR_LAYOUT"
  | "MOBILE_FILTER_DRAWER"
  | "PAGINATION_CONTROLS"
  | "RECOMMENDED_PRODUCTS"
  | "SEO_CONTENT";

export type CategoryLayoutZone = "TOP_HEADER" | "SIDEBAR" | "MAIN_CONTENT" | "BOTTOM_FOOTER";

export interface CategoryPageBlock {
  id: string;
  type: CategorySectionType;
  name: string;
  description: string;
  zone: CategoryLayoutZone;
  sortOrder: number;
  isActive: boolean;
  settings?: Record<string, any>;
  style?: Record<string, any>;
}

export const DEFAULT_CATEGORY_PAGE_BLOCKS: CategoryPageBlock[] = [
  // 1. TOP HEADER ZONE
  {
    id: "blk_cat_breadcrumb",
    type: "CATEGORY_BREADCRUMB",
    name: "Breadcrumb",
    description: "Hierarchical category navigation path trail (Home > Fashion > Sarees)",
    zone: "TOP_HEADER",
    sortOrder: 0,
    isActive: true,
    settings: { showHomeIcon: true, separator: "/" },
  },
  {
    id: "blk_cat_banner",
    type: "CATEGORY_BANNER",
    name: "Banner",
    description: "Hero promotional banner with seasonal tag, gradient overlay & craft badge",
    zone: "TOP_HEADER",
    sortOrder: 1,
    isActive: true,
    settings: { showBadge: true, showOverlay: true, height: "medium" },
  },
  {
    id: "blk_cat_title",
    type: "CATEGORY_TITLE",
    name: "Category title",
    description: "Category headline with level indicator, total item count & verified seller badge",
    zone: "TOP_HEADER",
    sortOrder: 2,
    isActive: true,
    settings: { showItemCount: true, showLevelBadge: true },
  },
  {
    id: "blk_cat_desc",
    type: "CATEGORY_DESCRIPTION",
    name: "Description",
    description: "Rich description of the category origin, weaving techniques and quality promise",
    zone: "TOP_HEADER",
    sortOrder: 3,
    isActive: true,
    settings: { truncateLines: 3, showReadMore: true },
  },
  {
    id: "blk_cat_subcategories",
    type: "SUBCATEGORIES_LIST",
    name: "Subcategories",
    description: "Horizontal scrollable strip or grid of subcategories with counts and images",
    zone: "TOP_HEADER",
    sortOrder: 4,
    isActive: true,
    settings: { style: "cards", showItemCount: true, maxItems: 12 },
  },

  // 2. SIDEBAR ZONE
  {
    id: "blk_cat_sidebar_layout",
    type: "SIDEBAR_LAYOUT",
    name: "Sidebar",
    description: "Desktop sidebar container positioning (Left, Right or Offcanvas)",
    zone: "SIDEBAR",
    sortOrder: 5,
    isActive: true,
    settings: { position: "left", sticky: true, collapsible: true },
  },
  {
    id: "blk_cat_filters",
    type: "FILTERS_SIDEBAR",
    name: "Filters",
    description: "Faceted filters (Price slider, Brands, Ratings, Discount, In-stock)",
    zone: "SIDEBAR",
    sortOrder: 6,
    isActive: true,
    settings: { showPriceRange: true, showBrands: true, showRating: true, showDiscount: true },
  },

  // 3. MAIN CONTENT ZONE
  {
    id: "blk_cat_sorting",
    type: "SORTING_BAR",
    name: "Sorting",
    description: "Sort controls (Popularity, Price: Low-to-High, High-to-Low, Rating, Newest)",
    zone: "MAIN_CONTENT",
    sortOrder: 7,
    isActive: true,
    settings: { showGridListToggle: true, defaultSort: "popular" },
  },
  {
    id: "blk_cat_mobile_filter",
    type: "MOBILE_FILTER_DRAWER",
    name: "Mobile filter",
    description: "Bottom floating action button and slide-up filter sheet for mobile devices",
    zone: "MAIN_CONTENT",
    sortOrder: 8,
    isActive: true,
    settings: { stickyBottom: true, showActiveCountBadge: true },
  },
  {
    id: "blk_cat_product_grid",
    type: "PRODUCT_GRID",
    name: "Product grid",
    description: "Responsive product grid (Desktop 3/4 cols, Tablet 2/3 cols, Mobile 2 cols)",
    zone: "MAIN_CONTENT",
    sortOrder: 9,
    isActive: true,
    settings: {
      desktopColumns: 4,
      tabletColumns: 3,
      mobileColumns: 2,
      cardStyle: "modern",
      imageRatio: "3:4",
      showPrice: true,
      showDiscount: true,
      showRating: true,
      showWishlist: true,
      showAddToCart: true,
    },
  },
  {
    id: "blk_cat_pagination",
    type: "PAGINATION_CONTROLS",
    name: "Pagination",
    description: "Numbered page selector, 'Load More' button or infinite scroll trigger",
    zone: "MAIN_CONTENT",
    sortOrder: 10,
    isActive: true,
    settings: { type: "numeric", perPage: 16 },
  },

  // 4. BOTTOM FOOTER ZONE
  {
    id: "blk_cat_recommended",
    type: "RECOMMENDED_PRODUCTS",
    name: "Recommended products",
    description: "Curated category recommendation carousel & top trending pieces",
    zone: "BOTTOM_FOOTER",
    sortOrder: 11,
    isActive: true,
    settings: { title: "Recommended for You", limit: 4 },
  },
  {
    id: "blk_cat_seo",
    type: "SEO_CONTENT",
    name: "SEO content",
    description: "Bottom editorial SEO article, FAQ accordion and search keyword tags",
    zone: "BOTTOM_FOOTER",
    sortOrder: 12,
    isActive: true,
    settings: { showFaq: true, showTags: true },
  },
];
