import { NextRequest, NextResponse } from "next/server";
import { getDatabaseCategoryTree } from "@/lib/categories";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get("refresh") === "true";
    const tree = await getDatabaseCategoryTree(forceRefresh);

    return NextResponse.json({
      success: true,
      data: tree,
    });
  } catch (error: any) {
    console.error("GET /api/categories/tree error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
