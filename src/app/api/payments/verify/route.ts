import { NextResponse } from "next/server";
import {
  reconcilePaymentOrder,
  verifyRazorpayPaymentSignature,
} from "@/lib/payment-gateway-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, provider, paymentId, razorpaySignature, razorpayOrderId } = body;

    if (!orderId || !provider) {
      return NextResponse.json(
        { success: false, error: "Missing required orderId or provider." },
        { status: 400 }
      );
    }

    // Razorpay signature validation if provided
    if (provider === "RAZORPAY" && razorpaySignature) {
      const keySecret = process.env.RAZORPAY_KEY_SECRET || "rzp_secret_fancyhub_dev456";
      const isValidSig = verifyRazorpayPaymentSignature({
        orderId: razorpayOrderId || orderId,
        paymentId: paymentId || "pay_test",
        signature: razorpaySignature,
        keySecret,
      });

      if (!isValidSig) {
        return NextResponse.json(
          { success: false, error: "Invalid Razorpay payment signature." },
          { status: 400 }
        );
      }
    }

    // Reconcile in database
    const result = await reconcilePaymentOrder({
      orderId,
      paymentId: paymentId || `pay_${Date.now()}`,
      provider,
      status: "SUCCESS",
      rawPayload: body,
    });

    return NextResponse.json({
      success: result.success,
      reconciliation: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}
