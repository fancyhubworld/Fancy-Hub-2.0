import { NextRequest, NextResponse } from "next/server";
import { verifyPayUResponseHash, PaymentService } from "@/lib/payment-gateway-engine";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, status, txnid, amount, productinfo, firstname, email, hash } = body;
    const merchantKey = process.env.PAYU_MERCHANT_KEY || "payu_test_key_fancyhub";
    const merchantSalt = process.env.PAYU_MERCHANT_SALT || "payu_test_salt_fancyhub";

    if (!hash || !txnid) {
      return NextResponse.json({ success: false, error: "Missing PayU hash or transaction ID" }, { status: 400 });
    }

    const isValid = verifyPayUResponseHash({
      key: merchantKey,
      salt: merchantSalt,
      status: status || "success",
      txnid,
      amount,
      productinfo: productinfo || "",
      firstname: firstname || "",
      email: email || "",
      receivedHash: hash,
    });

    if (!isValid) {
      console.warn("Security Alert: Invalid PayU response hash blocked.");
      return NextResponse.json({ success: false, error: "Invalid hash signature" }, { status: 401 });
    }

    if (status === "success") {
      await PaymentService.verifyPayment({
        orderId: txnid,
        paymentId: `payu_${txnid}`,
        provider: "PAYU",
      });
    }

    return NextResponse.json({ success: true, message: "PayU webhook processed" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
