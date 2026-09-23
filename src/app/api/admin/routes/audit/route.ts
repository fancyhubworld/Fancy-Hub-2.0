import { NextResponse } from "next/server";
import { performSystemRouteAudit } from "@/lib/route-manager-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const report = await performSystemRouteAudit();
    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error("GET /api/admin/routes/audit error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to perform system route audit" },
      { status: 500 }
    );
  }
}
