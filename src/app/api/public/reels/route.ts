import { NextResponse } from "next/server";
import { getShoppableReels } from "@/lib/shoppable-reels-engine";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    const reels = getShoppableReels({ category, limit });

    return NextResponse.json({
      success: true,
      total: reels.length,
      reels,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch shoppable video reels" },
      { status: 500 }
    );
  }
}
