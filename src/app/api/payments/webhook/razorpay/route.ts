import { NextResponse } from "next/server";
import {
  reconcilePaymentOrder,
  verifyRazorpayWebhookSignature,
} from "@/lib/payment-gateway-engine";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature") || "";
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "mock_razorpay_webhook_secret_2026";

    // Verify webhook signature in production
    const isValid = verifyRazorpayWebhookSignature(rawBody, signature, webhookSecret);
    if (!isValid && process.env.NODE_ENV === "production") {
      return NextResponse.json({ success: false, error: "Invalid Razorpay webhook signature." }, { status: 400 });
    }

    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      payload = {};
    }

    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity || {};
    const orderEntity = payload.payload?.order?.entity || {};
    const orderId = paymentEntity.notes?.orderId || orderEntity.notes?.orderId || paymentEntity.order_id || "ORD_MOCK";

    let status: "SUCCESS" | "FAILED" = "SUCCESS";
    if (event === "payment.captured" || event === "order.paid") {
      status = "SUCCESS";
    } else if (event === "payment.failed") {
      status = "FAILED";
    }

    // Idempotent reconciliation
    const result = await reconcilePaymentOrder({
      orderId,
      paymentId: paymentEntity.id || `pay_${Date.now()}`,
      provider: "RAZORPAY",
      status,
      amountPaid: paymentEntity.amount ? paymentEntity.amount / 100 : undefined,
      rawPayload: payload,
    });

    return NextResponse.json({
      success: true,
      event,
      orderId,
      reconciliation: result,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
