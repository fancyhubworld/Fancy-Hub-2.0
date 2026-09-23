import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, address, couponCode } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "Cart is empty" }, { status: 400 });
    }

    const validationErrors: string[] = [];
    const validatedItems: any[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { vendor: true },
      });

      if (!product) {
        validationErrors.push(`Product '${item.title || item.productId}' no longer exists.`);
        continue;
      }

      if (product.status !== "PUBLISHED") {
        validationErrors.push(`Product '${product.title}' is currently unavailable.`);
        continue;
      }

      if (product.stock < item.quantity) {
        validationErrors.push(`Only ${product.stock} units of '${product.title}' remaining in stock.`);
      }

      validatedItems.push({
        productId: product.id,
        title: product.title,
        sku: product.sku,
        price: product.price,
        mrp: product.mrp,
        vendorId: product.vendorId,
        vendorName: product.vendor?.storeName || "FancyHub Artisan",
        quantity: Math.min(item.quantity, product.stock),
        stock: product.stock,
      });
    }

    // Address validation
    if (address) {
      if (!address.name || !address.phone || !address.street || !address.city || !address.pincode) {
        validationErrors.push("Please provide complete shipping address details.");
      }
    }

    const isValid = validationErrors.length === 0;

    return NextResponse.json({
      success: isValid,
      isValid,
      errors: validationErrors,
      validatedItems,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
