import prisma from "@/lib/prisma";

export type DiscountType = "PERCENTAGE" | "FIXED" | "FREE_SHIPPING" | "BUY_X_GET_Y";

export interface CartItemPricingInput {
  productId: string;
  variantId?: string;
  title: string;
  basePrice: number; // MRP
  salePrice: number; // Selling price
  quantity: number;
  vendorId?: string;
  categoryId?: string;
  brandId?: string;
  collectionId?: string;
}

export interface PricingContext {
  userId?: string;
  isFirstOrder?: boolean;
  customerSegment?: "STANDARD" | "VIP" | "WHOLESALE";
  couponCode?: string;
  shippingMethod?: "STANDARD" | "EXPRESS";
  items: CartItemPricingInput[];
}

export interface AppliedPromotion {
  type: "PRODUCT_DISCOUNT" | "FLASH_SALE" | "COUPON" | "BXGY" | "FIRST_ORDER" | "FREE_SHIPPING";
  code?: string;
  description: string;
  discountAmount: number;
}

export interface PriceBreakdown {
  rawSubtotal: number; // Sum of basePrice * qty (MRP)
  itemSubtotal: number; // Sum of salePrice * qty
  productDiscountTotal: number; // Difference between MRP and salePrice
  promotionDiscountTotal: number;
  couponDiscountTotal: number;
  totalDiscount: number;
  netTaxableSubtotal: number;
  shippingFee: number;
  tax: number; // 5% GST on net taxable
  grandTotal: number;
  appliedPromotions: AppliedPromotion[];
  couponSnapshot?: {
    code: string;
    type: string;
    value: number;
    discount: number;
  };
}

export class PromotionPricingEngine {
  /**
   * Evaluates coupon validity and calculates applicable discount
   */
  static async validateAndApplyCoupon(params: {
    couponCode: string;
    subtotal: number;
    userId?: string;
    items: CartItemPricingInput[];
  }): Promise<{ valid: boolean; discount: number; error?: string; couponRecord?: any }> {
    const { couponCode, subtotal, userId, items } = params;
    const cleanCode = couponCode.trim().toUpperCase();

    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (!coupon) {
      return { valid: false, discount: 0, error: "Invalid coupon code" };
    }

    if (!coupon.isActive) {
      return { valid: false, discount: 0, error: "Coupon is currently inactive" };
    }

    const now = new Date();
    if (now < new Date(coupon.startsAt) || now > new Date(coupon.expiresAt)) {
      return { valid: false, discount: 0, error: "Coupon has expired or is not yet active" };
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, discount: 0, error: "Coupon global usage limit exceeded" };
    }

    if (subtotal < coupon.minOrderValue) {
      return {
        valid: false,
        discount: 0,
        error: `Minimum cart value of ₹${coupon.minOrderValue} required for this coupon`,
      };
    }

    // Vendor specific coupon validation
    if (coupon.vendorId) {
      const vendorItems = items.filter((i) => i.vendorId === coupon.vendorId);
      if (vendorItems.length === 0) {
        return { valid: false, discount: 0, error: "Coupon is only applicable to products from specific artisan vendor" };
      }
    }

    // Calculate discount amount
    let discount = 0;
    if (coupon.type === "PERCENTAGE") {
      discount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else if (coupon.type === "FIXED") {
      discount = Math.min(coupon.value, subtotal);
    } else if (coupon.type === "FREE_SHIPPING") {
      discount = 0; // Handled in shipping fee calculation
    }

    return {
      valid: true,
      discount: Math.round(discount * 100) / 100,
      couponRecord: coupon,
    };
  }

  /**
   * Authoritative server-side price calculation pipeline
   */
  static async calculateOrderPrices(context: PricingContext): Promise<PriceBreakdown> {
    const { items, couponCode, isFirstOrder = false, shippingMethod = "STANDARD" } = context;

    let rawSubtotal = 0;
    let itemSubtotal = 0;
    const appliedPromotions: AppliedPromotion[] = [];

    // 1. Calculate Base Subtotal & Item Subtotal
    for (const item of items) {
      rawSubtotal += item.basePrice * item.quantity;
      itemSubtotal += item.salePrice * item.quantity;
    }

    const productDiscountTotal = Math.max(0, rawSubtotal - itemSubtotal);
    let promoDiscountTotal = 0;

    // 2. First Order Promo check (e.g. Extra 5% off for new customers)
    if (isFirstOrder && itemSubtotal > 500) {
      const firstOrderDiscount = Math.round((itemSubtotal * 5) / 100);
      promoDiscountTotal += firstOrderDiscount;
      appliedPromotions.push({
        type: "FIRST_ORDER",
        description: "Welcome Offer: 5% off on your first handcrafted order",
        discountAmount: firstOrderDiscount,
      });
    }

    // 3. Buy X Get Y (BXGY) Check: If customer buys 3+ sarees, gets ₹300 flat bundle discount
    const totalQty = items.reduce((acc, i) => acc + i.quantity, 0);
    if (totalQty >= 3) {
      const bxgyDiscount = 300;
      promoDiscountTotal += bxgyDiscount;
      appliedPromotions.push({
        type: "BXGY",
        description: "Artisan Bundle: ₹300 off on purchasing 3+ items",
        discountAmount: bxgyDiscount,
      });
    }

    // 4. Coupon Discount Calculation
    let couponDiscountTotal = 0;
    let couponSnapshot: PriceBreakdown["couponSnapshot"] | undefined;
    let isFreeShippingCoupon = false;

    if (couponCode) {
      const couponRes = await this.validateAndApplyCoupon({
        couponCode,
        subtotal: itemSubtotal - promoDiscountTotal,
        userId: context.userId,
        items,
      });

      if (couponRes.valid) {
        couponDiscountTotal = couponRes.discount;
        if (couponRes.couponRecord?.type === "FREE_SHIPPING") {
          isFreeShippingCoupon = true;
        }

        appliedPromotions.push({
          type: "COUPON",
          code: couponRes.couponRecord?.code || couponCode.toUpperCase(),
          description: couponRes.couponRecord?.title || `Coupon ${couponCode.toUpperCase()}`,
          discountAmount: couponDiscountTotal,
        });

        couponSnapshot = {
          code: couponRes.couponRecord?.code || couponCode.toUpperCase(),
          type: couponRes.couponRecord?.type || "PERCENTAGE",
          value: couponRes.couponRecord?.value || 0,
          discount: couponDiscountTotal,
        };
      }
    }

    const totalDiscount = productDiscountTotal + promoDiscountTotal + couponDiscountTotal;
    const netTaxableSubtotal = Math.max(0, itemSubtotal - promoDiscountTotal - couponDiscountTotal);

    // 5. Dynamic Shipping Calculation (Free if Net >= 999 or Free Shipping Coupon)
    let shippingFee = 0;
    if (isFreeShippingCoupon || netTaxableSubtotal >= 999) {
      shippingFee = 0;
    } else {
      shippingFee = shippingMethod === "EXPRESS" ? 99 : 49;
    }

    // 6. Tax Calculation (5% Indian GST on net taxable subtotal)
    const tax = Math.round(netTaxableSubtotal * 0.05 * 100) / 100;

    // 7. Grand Total
    const grandTotal = Math.round((netTaxableSubtotal + shippingFee + tax) * 100) / 100;

    return {
      rawSubtotal,
      itemSubtotal,
      productDiscountTotal,
      promotionDiscountTotal: promoDiscountTotal,
      couponDiscountTotal,
      totalDiscount,
      netTaxableSubtotal,
      shippingFee,
      tax,
      grandTotal,
      appliedPromotions,
      couponSnapshot,
    };
  }
}
