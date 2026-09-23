import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function generateHumanOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `FH-2026-${timestamp}${random}`.slice(0, 18);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, address, paymentMethod, couponCode, userEmail, userName } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "Cannot create order with empty items" }, { status: 400 });
    }

    if (!address || !address.name || !address.phone || !address.street || !address.city || !address.pincode) {
      return NextResponse.json({ success: false, error: "Complete shipping address is required" }, { status: 400 });
    }

    // 1. Resolve or create customer account
    let user = await prisma.user.findFirst({
      where: userEmail ? { email: userEmail } : undefined,
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userEmail || `guest-${Date.now()}@fancyhub.in`,
          name: userName || address.name || "Customer",
          role: "CUSTOMER",
          passwordHash: "GUEST_UNREGISTERED_ACCOUNT_2026",
        },
      });
    }

    // 2. Validate items & group by vendor
    let subtotal = 0;
    const vendorGroups: Record<string, { vendorId: string; items: any[]; subtotal: number }> = {};

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Product '${product?.title || item.productId}' is out of stock.` },
          { status: 400 }
        );
      }

      const price = product.price;
      const mrp = product.mrp;
      const qty = item.quantity;
      const itemTotal = price * qty;
      subtotal += itemTotal;

      const vendorId = product.vendorId;
      if (!vendorGroups[vendorId]) {
        vendorGroups[vendorId] = { vendorId, items: [], subtotal: 0 };
      }

      vendorGroups[vendorId].items.push({
        productId: product.id,
        title: product.title,
        sku: product.sku,
        variantInfo: item.selectedColor ? `${item.selectedColor}, ${item.selectedSize}` : null,
        price,
        mrp,
        quantity: qty,
        total: itemTotal,
      });

      vendorGroups[vendorId].subtotal += itemTotal;
    }

    const orderNumber = generateHumanOrderNumber();
    const couponDiscount = couponCode && couponCode.toUpperCase() === "FANCYFIRST" ? Math.round(subtotal * 0.15) : 0;
    const tax = Math.round(subtotal * 0.05);
    const shippingFee = subtotal >= 999 ? 0 : 49 * Object.keys(vendorGroups).length;
    const grandTotal = subtotal - couponDiscount + tax + shippingFee;

    // 3. Execute Atomic Database Transaction
    const createdOrder = await prisma.$transaction(async (tx) => {
      // Create Parent Order
      const parentOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          status: "CONFIRMED",
          paymentStatus: paymentMethod === "COD" ? "PENDING" : "SUCCESS",
          paymentMethod: paymentMethod || "COD",
          subtotal,
          discount: couponDiscount,
          tax,
          shippingFee,
          totalAmount: grandTotal,
          shippingAddressJson: JSON.stringify(address),
          notes: "Placed via FancyHub 2.0 Checkout Engine",
        },
      });

      // Create Child Vendor Orders & Order Items
      let vendorIndex = 1;
      for (const vg of Object.values(vendorGroups)) {
        const subOrderNumber = `${orderNumber}-V${vendorIndex++}`;
        const commissionRate = 10.0;
        const commissionAmount = Math.round((vg.subtotal * commissionRate) / 100);
        const vendorEarnings = vg.subtotal - commissionAmount;

        const vendorOrder = await tx.vendorOrder.create({
          data: {
            subOrderNumber,
            orderId: parentOrder.id,
            vendorId: vg.vendorId,
            status: "CONFIRMED",
            subtotal: vg.subtotal,
            commissionRate,
            commissionAmount,
            vendorEarnings,
          },
        });

        for (const itm of vg.items) {
          await tx.orderItem.create({
            data: {
              orderId: parentOrder.id,
              vendorOrderId: vendorOrder.id,
              productId: itm.productId,
              title: itm.title,
              sku: itm.sku,
              variantInfo: itm.variantInfo,
              price: itm.price,
              mrp: itm.mrp,
              quantity: itm.quantity,
              total: itm.total,
            },
          });

          // Deduct Stock
          await tx.product.update({
            where: { id: itm.productId },
            data: { stock: { decrement: itm.quantity } },
          });
        }
      }

      return parentOrder;
    });

    return NextResponse.json({
      success: true,
      message: "Order placed and split across marketplace vendors successfully",
      orderNumber: createdOrder.orderNumber,
      orderId: createdOrder.id,
      totalAmount: createdOrder.totalAmount,
      status: createdOrder.status,
      paymentStatus: createdOrder.paymentStatus,
    });
  } catch (error: any) {
    console.error("POST /api/checkout/create-order error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
