import { NextResponse } from "next/server";
import { getActiveGroupDeals } from "@/lib/group-buying-engine";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const deals = getActiveGroupDeals(category);

    return NextResponse.json({
      success: true,
      total: deals.length,
      deals,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch group buying deals" },
      { status: 500 }
    );
  }
}
