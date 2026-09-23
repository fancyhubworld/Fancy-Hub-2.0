import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpayWebhookSignature, PaymentService } from "@/lib/payment-gateway-engine";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature") || "";
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "rzp_webhook_secret_fancyhub_dev";

    if (!signature) {
      return NextResponse.json({ success: false, error: "Missing x-razorpay-signature header" }, { status: 400 });
    }

    const isValid = verifyRazorpayWebhookSignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      console.warn("Security Alert: Invalid Razorpay webhook signature attempt blocked.");
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;
    const orderId = paymentEntity?.notes?.orderId || paymentEntity?.description?.replace("Order #", "");

    if (event === "payment.captured" && orderId) {
      await PaymentService.verifyPayment({
        orderId,
        paymentId: paymentEntity.id,
        provider: "RAZORPAY",
      });
    }

    return NextResponse.json({ success: true, message: "Webhook processed idempotently" });
  } catch (error: any) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
