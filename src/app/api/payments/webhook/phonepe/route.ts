import { NextResponse } from "next/server";
import {
  reconcilePaymentOrder,
  verifyPhonePeCallback,
} from "@/lib/payment-gateway-engine";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const xVerify = request.headers.get("x-verify") || "";
    const saltKey = process.env.PHONEPE_SALT_KEY || "mock_phonepe_salt_key_2026";
    const saltIndex = process.env.PHONEPE_SALT_INDEX || "1";

    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      payload = {};
    }

    const responseBase64 = payload.response || "";
    
    // Checksum verification
    const isValid = verifyPhonePeCallback(responseBase64, xVerify, saltKey, saltIndex);
    if (!isValid && process.env.NODE_ENV === "production") {
      return NextResponse.json({ success: false, error: "Invalid PhonePe X-VERIFY checksum." }, { status: 400 });
    }

    // Decode Base64 payload
    let decodedData: any = {};
    if (responseBase64) {
      try {
        const decodedStr = Buffer.from(responseBase64, "base64").toString("utf8");
        decodedData = JSON.parse(decodedStr);
      } catch {}
    }

    const transactionId = decodedData?.data?.merchantTransactionId || payload?.transactionId || "TXN_MOCK";
    const orderId = transactionId.replace("TXN_", "");
    const paymentState = decodedData?.code === "PAYMENT_SUCCESS" ? "SUCCESS" : "FAILED";
    const amountRupees = decodedData?.data?.amount ? decodedData.data.amount / 100 : undefined;

    // Idempotent reconciliation
    const result = await reconcilePaymentOrder({
      orderId,
      paymentId: decodedData?.data?.transactionId || transactionId,
      provider: "PHONEPE",
      status: paymentState,
      amountPaid: amountRupees,
      rawPayload: decodedData,
    });

    return NextResponse.json({
      success: true,
      received: true,
      orderId,
      reconciliation: result,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
