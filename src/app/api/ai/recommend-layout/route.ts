import { NextResponse } from "next/server";
import { recommendVisualLayout } from "@/lib/gemini-ai-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pageGoal = "FESTIVAL_SALE", primaryCategory } = body;

    const recommendation = recommendVisualLayout({
      pageGoal,
      primaryCategory,
    });

    return NextResponse.json({
      success: true,
      recommendation,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate visual layout recommendation" },
      { status: 500 }
    );
  }
}
