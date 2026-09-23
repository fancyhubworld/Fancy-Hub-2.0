import { NextResponse } from "next/server";
import {
  reconcilePaymentOrder,
  verifyCashfreeWebhookSignature,
} from "@/lib/payment-gateway-engine";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-webhook-signature") || "";
    const timestamp = request.headers.get("x-webhook-timestamp") || "";
    const clientSecret = process.env.CASHFREE_SECRET_KEY || "mock_cashfree_secret_key_2026";

    // Verify webhook signature in production
    const isValid = verifyCashfreeWebhookSignature(rawBody, signature, timestamp, clientSecret);
    if (!isValid && process.env.NODE_ENV === "production") {
      return NextResponse.json({ success: false, error: "Invalid Cashfree webhook signature." }, { status: 400 });
    }

    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      payload = {};
    }

    const type = payload.type || payload.event;
    const orderData = payload.data?.order || payload.order || {};
    const paymentData = payload.data?.payment || payload.payment || {};
    const orderId = orderData.order_id || payload.orderId || "ORD_CASHFREE";

    const isSuccess = type === "PAYMENT_SUCCESS_WEBHOOK" || paymentData.payment_status === "SUCCESS";

    // Idempotent reconciliation
    const result = await reconcilePaymentOrder({
      orderId,
      paymentId: paymentData.cf_payment_id || `cf_${Date.now()}`,
      provider: "CASHFREE",
      status: isSuccess ? "SUCCESS" : "FAILED",
      amountPaid: paymentData.payment_amount || orderData.order_amount,
      rawPayload: payload,
    });

    return NextResponse.json({
      success: true,
      type,
      orderId,
      reconciliation: result,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
