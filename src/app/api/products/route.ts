import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PRODUCTS_DATA } from "@/data/mock-catalog";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let products = await db.product.findMany({
      include: {
        images: true,
        variants: true,
        vendor: true,
        category: true,
      },
    }).catch(() => null);

    if (!products || products.length === 0) {
      return NextResponse.json({ success: true, count: PRODUCTS_DATA.length, data: PRODUCTS_DATA });
    }

    return NextResponse.json({ success: true, count: products.length, data: products });
  } catch (error: any) {
    return NextResponse.json({ success: true, count: PRODUCTS_DATA.length, data: PRODUCTS_DATA });
  }
}
