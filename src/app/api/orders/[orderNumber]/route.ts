import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const orderNumber = params?.orderNumber;
    if (!orderNumber) {
      return NextResponse.json({ success: false, error: "Order number is required" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ orderNumber }, { id: orderNumber }],
      },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        vendorOrders: {
          include: {
            vendor: { select: { id: true, storeName: true, slug: true, storeLogo: true } },
            orderItems: true,
          },
        },
        orderItems: true,
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        shippingAddress: JSON.parse(order.shippingAddressJson || "{}"),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
