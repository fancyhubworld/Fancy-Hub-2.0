import { NextRequest, NextResponse } from "next/server";
import { testRouteTarget } from "@/lib/route-manager-engine";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ success: false, error: "URL is required" }, { status: 400 });
    }

    const result = await testRouteTarget(url);
    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error("POST /api/admin/routes/test error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to test route" },
      { status: 500 }
    );
  }
}
