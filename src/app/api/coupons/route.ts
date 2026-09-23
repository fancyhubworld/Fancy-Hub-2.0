import { NextResponse } from "next/server";
import { COUPONS_DATA } from "@/data/mock-catalog";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, cartTotal } = body;

    const coupon = COUPONS_DATA.find((c) => c.code.toUpperCase() === (code || "").toUpperCase());

    if (!coupon) {
      return NextResponse.json({ success: false, message: "Invalid coupon code" }, { status: 400 });
    }

    if (cartTotal < coupon.minOrderValue) {
      return NextResponse.json({
        success: false,
        message: `Minimum order value of ₹${coupon.minOrderValue} required for ${coupon.code}`,
      }, { status: 400 });
    }

    let discountAmount = 0;
    if (coupon.type === "PERCENTAGE") {
      discountAmount = Math.min(Math.round(cartTotal * (coupon.value / 100)), coupon.maxDiscount || 9999);
    } else {
      discountAmount = coupon.value;
    }

    return NextResponse.json({
      success: true,
      code: coupon.code,
      discountAmount,
      message: `Coupon ${coupon.code} applied successfully!`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Failed to validate coupon" }, { status: 500 });
  }
}
