import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, address, paymentMethod, couponCode, discount } = body;

    const orderNumber = generateOrderNumber();

    return NextResponse.json({
      success: true,
      message: "Order placed and split across marketplace vendors successfully",
      orderNumber,
      status: "CONFIRMED",
      paymentStatus: paymentMethod === "COD" ? "PENDING" : "SUCCESS",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process order" },
      { status: 500 }
    );
  }
}
