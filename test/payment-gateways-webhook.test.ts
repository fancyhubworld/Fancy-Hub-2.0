import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import {
  generatePhonePeChecksum,
  verifyPhonePeCallback,
  createPhonePePaymentPayload,
  verifyRazorpayWebhookSignature,
  verifyRazorpayPaymentSignature,
  verifyCashfreeWebhookSignature,
  reconcilePaymentOrder,
} from "../src/lib/payment-gateway-engine";

const prisma = new PrismaClient();

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

async function runPaymentGatewayTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN 2.0 — LIVE PAYMENT GATEWAYS & WEBHOOK RECONCILIATION");
  console.log("=======================================================================\n");

  const testSuffix = Date.now();
  let createdOrderId = "";
  let createdCustomerId = "";
  let createdVendorId = "";

  try {
    // -----------------------------------------------------------------------
    // 1. PHONEPE CHECKSUM & PAYLOAD VALIDATION
    // -----------------------------------------------------------------------
    console.log("--- 1. PHONEPE GATEWAY SIGNATURE & PAYLOAD ---");
    const saltKey = "mock_phonepe_salt_key_9988";
    const saltIndex = "1";
    const base64Payload = createPhonePePaymentPayload({
      merchantId: "M220192837465",
      transactionId: `TXN_${testSuffix}`,
      amount: 1499, // ₹1,499
      merchantUserId: "CUST_9830012345",
      redirectUrl: "https://fancyhub.in/order-success",
      callbackUrl: "https://fancyhub.in/api/payments/webhook/phonepe",
    });

    assert(typeof base64Payload === "string" && base64Payload.length > 20, "Generated Base64 PhonePe payment payload");

    const phonepeChecksum = generatePhonePeChecksum(base64Payload, "/pg/v1/pay", saltKey, saltIndex);
    assert(phonepeChecksum.endsWith("###1"), "PhonePe checksum formatted with salt index suffix (###1)");

    const isPhonePeValid = verifyPhonePeCallback(base64Payload, phonepeChecksum, saltKey, saltIndex);
    assert(isPhonePeValid === true, "Valid PhonePe callback verification succeeded");

    const isTamperedPhonePe = verifyPhonePeCallback(base64Payload, "tampered_fake_checksum###1", saltKey, saltIndex);
    assert(isTamperedPhonePe === false, "Tampered PhonePe checksum rejected");

    // -----------------------------------------------------------------------
    // 2. RAZORPAY HMAC-SHA256 SIGNATURE VALIDATION
    // -----------------------------------------------------------------------
    console.log("\n--- 2. RAZORPAY HMAC-SHA256 WEBHOOK & CHECKOUT SIGNATURES ---");
    const razorpaySecret = "rzp_secret_key_ultra_secure_2026";
    const rawWebhookBody = JSON.stringify({
      event: "payment.captured",
      payload: { payment: { entity: { id: `pay_${testSuffix}`, amount: 149900 } } },
    });

    const validRazorpaySig = crypto
      .createHmac("sha256", razorpaySecret)
      .update(rawWebhookBody)
      .digest("hex");

    const isRazorpayWebhookValid = verifyRazorpayWebhookSignature(rawWebhookBody, validRazorpaySig, razorpaySecret);
    assert(isRazorpayWebhookValid === true, "Valid Razorpay webhook HMAC-SHA256 signature verified");

    const isTamperedRazorpay = verifyRazorpayWebhookSignature(rawWebhookBody, "bad_signature_hex", razorpaySecret);
    assert(isTamperedRazorpay === false, "Tampered Razorpay webhook signature rejected");

    // Test Razorpay Checkout client signature (order_id|payment_id)
    const razorpayOrderId = `order_${testSuffix}`;
    const razorpayPaymentId = `pay_${testSuffix}`;
    const validClientSig = crypto
      .createHmac("sha256", razorpaySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    const isClientSigValid = verifyRazorpayPaymentSignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: validClientSig,
      keySecret: razorpaySecret,
    });
    assert(isClientSigValid === true, "Valid Razorpay client payment signature verified");

    // -----------------------------------------------------------------------
    // 3. CASHFREE SIGNATURE VALIDATION
    // -----------------------------------------------------------------------
    console.log("\n--- 3. CASHFREE WEBHOOK SIGNATURE VALIDATION ---");
    const cashfreeSecret = "cashfree_client_secret_2026";
    const timestamp = String(Date.now());
    const cashfreeBody = JSON.stringify({ type: "PAYMENT_SUCCESS_WEBHOOK", orderId: `CF_ORD_${testSuffix}` });

    const validCashfreeSig = crypto
      .createHmac("sha256", cashfreeSecret)
      .update(`${timestamp}${cashfreeBody}`)
      .digest("base64");

    const isCashfreeValid = verifyCashfreeWebhookSignature(cashfreeBody, validCashfreeSig, timestamp, cashfreeSecret);
    assert(isCashfreeValid === true, "Valid Cashfree webhook signature verified");

    // -----------------------------------------------------------------------
    // 4. IDEMPOTENT ORDER RECONCILIATION IN DATABASE
    // -----------------------------------------------------------------------
    console.log("\n--- 4. IDEMPOTENT RECONCILIATION IN DATABASE ---");
    // Create test customer & vendor & order
    const testCustomer = await prisma.user.create({
      data: {
        email: `buyer-${testSuffix}@fancyhub.in`,
        name: "Test Buyer",
        passwordHash: "hash123",
        role: "CUSTOMER",
      },
    });
    createdCustomerId = testCustomer.id;

    const firstVendor = await prisma.vendor.findFirst();
    createdVendorId = firstVendor!.id;

    const testOrder = await prisma.order.create({
      data: {
        userId: testCustomer.id,
        orderNumber: `ORD-${testSuffix}`,
        totalAmount: 1499,
        subtotal: 1499,
        discount: 0,
        tax: 0,
        shippingFee: 0,
        platformFee: 0,
        status: "PENDING",
        paymentStatus: "PENDING",
        paymentMethod: "RAZORPAY",
        shippingAddressJson: JSON.stringify({ street: "Flat 4B, Salt Lake", city: "Kolkata", state: "West Bengal", pincode: "700064" }),
        vendorOrders: {
          create: [
            {
              vendorId: firstVendor!.id,
              subOrderNumber: `ORD-${testSuffix}-V1`,
              status: "PENDING",
              subtotal: 1499,
              commissionAmount: 150,
              vendorEarnings: 1349,
            },
          ],
        },
      },
    });
    createdOrderId = testOrder.id;

    // First reconciliation call (Payment Success)
    const recon1 = await reconcilePaymentOrder({
      orderId: testOrder.id,
      paymentId: `pay_rzp_${testSuffix}`,
      provider: "RAZORPAY",
      status: "SUCCESS",
      amountPaid: 1499,
    });

    assert(recon1.status === "CONFIRMED", "First webhook call: Order status transitioned to CONFIRMED");

    // Verify DB update
    const updatedOrder = await prisma.order.findUnique({
      where: { id: testOrder.id },
      include: { vendorOrders: true },
    });
    assert(updatedOrder?.paymentStatus === "PAID", "Order paymentStatus updated to PAID");
    assert(updatedOrder?.vendorOrders[0].status === "CONFIRMED", "Vendor sub-order updated to CONFIRMED");

    // Second repeated webhook call (Idempotency Test)
    const recon2 = await reconcilePaymentOrder({
      orderId: testOrder.id,
      paymentId: `pay_rzp_${testSuffix}`,
      provider: "RAZORPAY",
      status: "SUCCESS",
      amountPaid: 1499,
    });

    assert(recon2.status === "ALREADY_PROCESSED", "Duplicate webhook retry correctly returned ALREADY_PROCESSED without double-settling");

    console.log("\n=======================================================================");
    console.log(`Payment Gateways & Webhook Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test execution error:", e);
    process.exit(1);
  } finally {
    if (createdOrderId) {
      await prisma.vendorOrder.deleteMany({ where: { orderId: createdOrderId } }).catch(() => {});
      await prisma.order.delete({ where: { id: createdOrderId } }).catch(() => {});
    }
    if (createdCustomerId) {
      await prisma.user.delete({ where: { id: createdCustomerId } }).catch(() => {});
    }
    await prisma.$disconnect();
  }
}

runPaymentGatewayTests();
