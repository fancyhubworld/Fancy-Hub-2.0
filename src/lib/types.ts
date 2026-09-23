export type ThemeMode = 'light' | 'dark' | 'glassy';

export type UserRole = 
  | 'CUSTOMER' 
  | 'VENDOR' 
  | 'ADMIN' 
  | 'SUPER_ADMIN' 
  | 'VENDOR_STAFF' 
  | 'SUPPORT' 
  | 'FINANCE' 
  | 'DELIVERY_PARTNER';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  vendorId?: string;
  storeName?: string;
  themePreference?: ThemeMode;
}

export interface TagItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  productCount?: number;
  isActive: boolean;
}

export interface BrandItem {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  banner?: string;
  description?: string;
  productCount?: number;
  isFeatured?: boolean;
}

export interface ProductVariantItem {
  id: string;
  sku: string;
  title: string;
  size?: string;
  color?: string;
  colorHex?: string;
  price: number;
  mrp: number;
  stock: number;
  image?: string;
}

export interface ProductImageItem {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductItem {
  id: string;
  title: string;
  slug: string;
  sku: string;
  shortDescription?: string;
  description: string;
  price: number;
  mrp: number;
  discountPercent: number;
  taxRate: number;
  stock: number;
  lowStockThreshold: number;
  isFeatured: boolean;
  isFlashDeal: boolean;
  flashPrice?: number;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'OUT_OF_STOCK' | 'REJECTED' | 'ARCHIVED';
  ratings: number;
  reviewCount: number;
  soldCount: number;
  deliveryDays: number;
  codAvailable: boolean;
  returnDays: number;
  warranty?: string;
  highlights?: string[];
  specifications?: Record<string, string>;
  tags?: string[];
  tagSlugs?: string[];
  vendorId: string;
  vendorName: string;
  vendorSlug: string;
  vendorRating: number;
  vendorIsVerified: boolean;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  parentCategorySlug?: string;
  brandId?: string;
  brandName?: string;
  brandSlug?: string;
  images: ProductImageItem[];
  variants: ProductVariantItem[];
  createdAt: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  banner?: string;
  parentId?: string;
  parentSlug?: string;
  level?: number;
  sortOrder?: number;
  subcategories?: CategoryItem[];
  productCount?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface VendorItem {
  id: string;
  userId?: string;
  storeName: string;
  slug: string;
  storeDescription?: string;
  storeLogo?: string;
  storeBanner?: string;
  businessName: string;
  businessType: string;
  panNumber?: string;
  gstin?: string;
  city: string;
  state: string;
  pincode: string;
  address: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  followerCount: number;
  planName: string;
  commissionRate: number;
  totalSales: number;
  walletBalance: number;
  pendingBalance: number;
  withdrawnTotal: number;
  products?: ProductItem[];
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  title: string;
  slug: string;
  sku: string;
  image: string;
  price: number;
  mrp: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  vendorId: string;
  vendorName: string;
  vendorSlug: string;
  maxStock: number;
}

export interface VendorCartGroup {
  vendorId: string;
  vendorName: string;
  vendorSlug: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  appliedCoupon?: {
    code: string;
    discount: number;
  };
}

export interface DeliveryAddress {
  id?: string;
  name: string;
  phone: string;
  street: string;
  landmark?: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  type: 'Home' | 'Work' | 'Other';
  isDefault?: boolean;
}

export interface OrderItemRecord {
  id: string;
  productId: string;
  title: string;
  sku: string;
  variantInfo?: string;
  price: number;
  mrp: number;
  quantity: number;
  total: number;
  image?: string;
}

export interface VendorSubOrderRecord {
  id: string;
  subOrderNumber: string;
  vendorId: string;
  vendorName: string;
  status: 'PENDING' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
  subtotal: number;
  shippingFee: number;
  discount: number;
  commissionRate: number;
  commissionAmount: number;
  vendorEarnings: number;
  payoutStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
  trackingNumber?: string;
  shippingCarrier?: string;
  items: OrderItemRecord[];
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  status: 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'SUCCESS' | 'PENDING' | 'FAILED';
  paymentMethod: string;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  platformFee: number;
  totalAmount: number;
  shippingAddress: DeliveryAddress;
  createdAt: string;
  vendorOrders: VendorSubOrderRecord[];
}

export interface BannerItem {
  id: string;
  title: string;
  subtitle?: string;
  badgeText?: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  bgColor?: string;
  device?: 'ALL' | 'DESKTOP' | 'MOBILE' | string;
  position: 'HERO' | 'SIDE' | 'MIDDLE' | 'FOOTER';
  discountTag?: string;
  sortOrder?: number;
  isActive: boolean;
}

export interface CouponItem {
  id: string;
  code: string;
  title: string;
  description?: string;
  type: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiresAt: string;
  isActive: boolean;
  vendorId?: string;
}

export interface CustomPrintItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  basePrice: number;
  mrp: number;
  mockupFrontUrl: string;
  mockupBackUrl?: string;
  availableColors: { name: string; hex: string }[];
  availableSizes: string[];
  description: string;
}
