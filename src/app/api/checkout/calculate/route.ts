import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, couponCode, shippingMethod } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "No items to calculate" }, { status: 400 });
    }

    let subtotal = 0;
    let totalMrp = 0;
    const vendorGroups: Record<string, { vendorId: string; vendorName: string; items: any[]; subtotal: number; shippingFee: number }> = {};

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { vendor: true },
      });

      const price = product?.price || item.price || 0;
      const mrp = product?.mrp || item.mrp || price;
      const qty = item.quantity || 1;
      const itemTotal = price * qty;

      subtotal += itemTotal;
      totalMrp += mrp * qty;

      const vendorId = product?.vendorId || item.vendorId || "default-vendor";
      const vendorName = product?.vendor?.storeName || item.vendorName || "FancyHub Artisan";

      if (!vendorGroups[vendorId]) {
        vendorGroups[vendorId] = {
          vendorId,
          vendorName,
          items: [],
          subtotal: 0,
          shippingFee: 0,
        };
      }

      vendorGroups[vendorId].items.push({
        productId: item.productId,
        title: product?.title || item.title,
        sku: product?.sku || item.sku || "FH-SKU",
        variantInfo: item.selectedColor ? `${item.selectedColor}, ${item.selectedSize}` : null,
        price,
        mrp,
        quantity: qty,
        total: itemTotal,
      });

      vendorGroups[vendorId].subtotal += itemTotal;
    }

    // Dynamic Multi-Vendor Shipping: Free if subtotal > 999 else ₹49 per vendor
    let totalShippingFee = 0;
    Object.values(vendorGroups).forEach((vg) => {
      vg.shippingFee = vg.subtotal >= 999 ? 0 : 49;
      totalShippingFee += vg.shippingFee;
    });

    // Coupon discount logic
    let couponDiscount = 0;
    let couponApplied = null;
    if (couponCode && couponCode.toUpperCase() === "FANCYFIRST") {
      couponDiscount = Math.round(subtotal * 0.15); // 15% Welcome discount
      couponApplied = { code: "FANCYFIRST", discountPercent: 15, amount: couponDiscount };
    }

    // 5% Indian Handloom & Fashion GST
    const tax = Math.round(subtotal * 0.05);
    const savings = Math.max(0, totalMrp - subtotal + couponDiscount);
    const grandTotal = subtotal - couponDiscount + tax + totalShippingFee;

    return NextResponse.json({
      success: true,
      calculation: {
        subtotal,
        totalMrp,
        couponDiscount,
        couponApplied,
        tax,
        taxPercent: 5,
        shippingFee: totalShippingFee,
        grandTotal,
        savings,
        vendorCount: Object.keys(vendorGroups).length,
        vendorGroups: Object.values(vendorGroups),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
