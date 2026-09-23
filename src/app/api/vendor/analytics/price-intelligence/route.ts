import { NextResponse } from "next/server";
import { analyzePriceIntelligence } from "@/lib/vendor-analytics-engine";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId = "prod-1", title = "Product", category = "General", currentPrice = 4999 } = body;

    const recommendation = analyzePriceIntelligence({
      id: productId,
      title,
      category,
      currentPrice: Number(currentPrice),
    });

    return NextResponse.json({
      success: true,
      recommendation,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate AI price intelligence" },
      { status: 500 }
    );
  }
}
