import { NextResponse } from "next/server";
import {
  PaymentProvider,
  createPhonePePaymentPayload,
  generatePhonePeChecksum,
} from "@/lib/payment-gateway-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, amount, provider = "RAZORPAY", customerPhone, customerEmail, customerName } = body;

    if (!orderId || !amount) {
      return NextResponse.json(
        { success: false, error: "Missing required orderId or amount." },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // 1. PhonePe Gateway Initiation
    if (provider === "PHONEPE") {
      const merchantId = process.env.PHONEPE_MERCHANT_ID || "M220192837465";
      const saltKey = process.env.PHONEPE_SALT_KEY || "mock_phonepe_salt_key_2026";
      const saltIndex = process.env.PHONEPE_SALT_INDEX || "1";

      const base64Payload = createPhonePePaymentPayload({
        merchantId,
        transactionId: `TXN_${orderId}`,
        amount,
        merchantUserId: `USR_${customerPhone || "CUST"}`,
        redirectUrl: `${appUrl}/order-success/${orderId}`,
        callbackUrl: `${appUrl}/api/payments/webhook/phonepe`,
        phone: customerPhone,
      });

      const xVerifyChecksum = generatePhonePeChecksum(base64Payload, "/pg/v1/pay", saltKey, saltIndex);

      return NextResponse.json({
        success: true,
        provider: "PHONEPE",
        orderId,
        amount,
        phonepe: {
          merchantId,
          transactionId: `TXN_${orderId}`,
          base64Payload,
          xVerifyChecksum,
          gatewayUrl: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
        },
      });
    }

    // 2. Razorpay Gateway Initiation
    if (provider === "RAZORPAY") {
      const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_fancyhub_dev123";
      const mockRazorpayOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      return NextResponse.json({
        success: true,
        provider: "RAZORPAY",
        orderId,
        amount,
        razorpay: {
          keyId,
          orderId: mockRazorpayOrderId,
          amountPaise: Math.round(amount * 100),
          currency: "INR",
          name: "FancyHub.in",
          description: `Order #${orderId}`,
        },
      });
    }

    // 3. Cashfree Gateway Initiation
    if (provider === "CASHFREE") {
      const mockPaymentSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      return NextResponse.json({
        success: true,
        provider: "CASHFREE",
        orderId,
        amount,
        cashfree: {
          paymentSessionId: mockPaymentSessionId,
          orderId,
          orderAmount: amount,
          orderCurrency: "INR",
        },
      });
    }

    // 4. Cash on Delivery (COD)
    return NextResponse.json({
      success: true,
      provider: "COD",
      orderId,
      amount,
      message: "Order placed with Cash on Delivery payment mode.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create payment order" },
      { status: 500 }
    );
  }
}
