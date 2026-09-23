import { NextResponse } from "next/server";
import {
  generateSeoCopy,
  generateProductDescription,
} from "@/lib/gemini-ai-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type = "SEO", ...payload } = body;

    if (type === "PRODUCT") {
      const productResult = generateProductDescription({
        productTitle: payload.productTitle || "Handloom Silk Saree",
        category: payload.category || "Sarees",
        price: payload.price || 4999,
        artisanOrBrand: payload.artisanOrBrand,
        fabricOrMaterial: payload.fabricOrMaterial,
        keyFeatures: payload.keyFeatures,
      });

      return NextResponse.json({
        success: true,
        type: "PRODUCT_COPY",
        data: productResult,
      });
    }

    // Default: SEO Copy Generation
    const seoResult = generateSeoCopy({
      entityType: payload.entityType || "PAGE",
      title: payload.title || "Festive Grand Sale",
      category: payload.category,
      targetKeywords: payload.targetKeywords,
      tone: payload.tone || "LUXURY",
    });

    return NextResponse.json({
      success: true,
      type: "SEO_COPY",
      data: seoResult,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate AI copy" },
      { status: 500 }
    );
  }
}
