export type ProductSectionType =
  | "PRODUCT_GALLERY"
  | "PRODUCT_TITLE"
  | "PRODUCT_RATING"
  | "PRODUCT_PRICE"
  | "PRODUCT_DISCOUNT"
  | "VARIANT_SELECTOR"
  | "SIZE_SELECTOR"
  | "COLOR_SELECTOR"
  | "QUANTITY_SELECTOR"
  | "ADD_TO_CART"
  | "BUY_NOW"
  | "WISHLIST_BUTTON"
  | "DELIVERY_CHECKER"
  | "SELLER_INFO"
  | "OFFERS_LIST"
  | "DESCRIPTION"
  | "SPECIFICATIONS"
  | "REVIEWS_SECTION"
  | "RELATED_PRODUCTS"
  | "FREQUENTLY_BOUGHT_TOGETHER"
  | "RECENTLY_VIEWED";

export type ProductLayoutZone = "LEFT" | "RIGHT" | "BOTTOM";

export interface ProductPageBlock {
  id: string;
  type: ProductSectionType;
  name: string;
  description: string;
  zone: ProductLayoutZone;
  sortOrder: number;
  isActive: boolean;
  settings?: Record<string, any>;
  style?: Record<string, any>;
}

export interface ProductPageLayoutConfig {
  blocks: ProductPageBlock[];
  updatedAt?: string;
}

export const DEFAULT_PRODUCT_PAGE_BLOCKS: ProductPageBlock[] = [
  // LEFT COLUMN (Media)
  {
    id: "blk_gallery",
    type: "PRODUCT_GALLERY",
    name: "Product Gallery",
    description: "Interactive image zoom, badge overlays & thumbnail reel",
    zone: "LEFT",
    sortOrder: 0,
    isActive: true,
    settings: { showThumbnails: true, zoomEnabled: true, badgePosition: "top-left" },
  },

  // RIGHT COLUMN (Product Details & Purchase Actions)
  {
    id: "blk_title",
    type: "PRODUCT_TITLE",
    name: "Product Title",
    description: "Main product headline, SKU, and category breadcrumbs",
    zone: "RIGHT",
    sortOrder: 1,
    isActive: true,
    settings: { showBreadcrumbs: true, showSku: true, showBrand: true },
  },
  {
    id: "blk_rating",
    type: "PRODUCT_RATING",
    name: "Rating",
    description: "Star rating, review counts & verified purchaser score",
    zone: "RIGHT",
    sortOrder: 2,
    isActive: true,
    settings: { showReviewCount: true, showVerifiedBadge: true },
  },
  {
    id: "blk_price",
    type: "PRODUCT_PRICE",
    name: "Price",
    description: "Selling price, strikethrough MRP & GST inclusive notice",
    zone: "RIGHT",
    sortOrder: 3,
    isActive: true,
    settings: { showGstText: true, showMrp: true },
  },
  {
    id: "blk_discount",
    type: "PRODUCT_DISCOUNT",
    name: "Discount",
    description: "Save percentage badge & total rupee savings highlight",
    zone: "RIGHT",
    sortOrder: 4,
    isActive: true,
    settings: { showPercentage: true, showSavingsAmount: true },
  },
  {
    id: "blk_variant_selector",
    type: "VARIANT_SELECTOR",
    name: "Variant Selector",
    description: "Universal multi-attribute variant selector",
    zone: "RIGHT",
    sortOrder: 5,
    isActive: true,
    settings: { showInStockOnly: false },
  },
  {
    id: "blk_size_selector",
    type: "SIZE_SELECTOR",
    name: "Size Selector",
    description: "Size chips (XS, S, M, L, XL, XXL) with Size Guide popup modal",
    zone: "RIGHT",
    sortOrder: 6,
    isActive: true,
    settings: { showSizeGuide: true },
  },
  {
    id: "blk_color_selector",
    type: "COLOR_SELECTOR",
    name: "Color Selector",
    description: "Color swatches with active swatch label & preview",
    zone: "RIGHT",
    sortOrder: 7,
    isActive: true,
    settings: { showColorName: true },
  },
  {
    id: "blk_quantity",
    type: "QUANTITY_SELECTOR",
    name: "Quantity",
    description: "Quantity stepper plus/minus with live stock limit warnings",
    zone: "RIGHT",
    sortOrder: 8,
    isActive: true,
    settings: { min: 1, max: 10 },
  },
  {
    id: "blk_add_to_cart",
    type: "ADD_TO_CART",
    name: "Add to Cart",
    description: "High-conversion primary Add to Cart CTA button",
    zone: "RIGHT",
    sortOrder: 9,
    isActive: true,
    settings: { fullWidth: true, icon: "ShoppingCart", buttonStyle: "solid" },
  },
  {
    id: "blk_buy_now",
    type: "BUY_NOW",
    name: "Buy Now",
    description: "1-Click Express Direct Checkout with UPI & COD options",
    zone: "RIGHT",
    sortOrder: 10,
    isActive: true,
    settings: { fullWidth: true, icon: "Zap", buttonStyle: "gradient" },
  },
  {
    id: "blk_wishlist",
    type: "WISHLIST_BUTTON",
    name: "Wishlist",
    description: "Bookmark to wishlist & social share copy-link button",
    zone: "RIGHT",
    sortOrder: 11,
    isActive: true,
    settings: { showShare: true },
  },
  {
    id: "blk_delivery_checker",
    type: "DELIVERY_CHECKER",
    name: "Delivery Checker",
    description: "Pincode availability checker with live delivery date estimates",
    zone: "RIGHT",
    sortOrder: 12,
    isActive: true,
    settings: { defaultPincode: "395003" },
  },
  {
    id: "blk_seller_info",
    type: "SELLER_INFO",
    name: "Seller Information",
    description: "Artisan / Vendor credentials, rating, city & store profile link",
    zone: "RIGHT",
    sortOrder: 13,
    isActive: true,
    settings: { showRating: true, showLocation: true, showChat: true },
  },
  {
    id: "blk_offers",
    type: "OFFERS_LIST",
    name: "Offers",
    description: "Available bank vouchers, UPI discounts & coupon codes list",
    zone: "RIGHT",
    sortOrder: 14,
    isActive: true,
    settings: { maxOffers: 4 },
  },

  // FULL-WIDTH BOTTOM REGION
  {
    id: "blk_desc",
    type: "DESCRIPTION",
    name: "Description",
    description: "Rich editorial storytelling, weaving techniques & fabric care guide",
    zone: "BOTTOM",
    sortOrder: 15,
    isActive: true,
    settings: { showCareGuide: true },
  },
  {
    id: "blk_specs",
    type: "SPECIFICATIONS",
    name: "Specifications",
    description: "Structured attributes table (fabric, weave, origin, weight, warranty)",
    zone: "BOTTOM",
    sortOrder: 16,
    isActive: true,
    settings: { layout: "table" },
  },
  {
    id: "blk_reviews",
    type: "REVIEWS_SECTION",
    name: "Reviews",
    description: "Customer photo reviews, rating distribution & verified buyer badge",
    zone: "BOTTOM",
    sortOrder: 17,
    isActive: true,
    settings: { allowUserSubmission: true },
  },
  {
    id: "blk_fbt",
    type: "FREQUENTLY_BOUGHT_TOGETHER",
    name: "Frequently Bought Together",
    description: "Bundle savings showcase with 1-click 'Add Both to Cart'",
    zone: "BOTTOM",
    sortOrder: 18,
    isActive: true,
    settings: { bundleDiscount: 10 },
  },
  {
    id: "blk_related",
    type: "RELATED_PRODUCTS",
    name: "Related Products",
    description: "Similar handloom & category style recommendations carousel",
    zone: "BOTTOM",
    sortOrder: 19,
    isActive: true,
    settings: { limit: 4 },
  },
  {
    id: "blk_recently_viewed",
    type: "RECENTLY_VIEWED",
    name: "Recently Viewed",
    description: "Browsing history product reel",
    zone: "BOTTOM",
    sortOrder: 20,
    isActive: true,
    settings: { limit: 4 },
  },
];
