import { NextResponse } from "next/server";
import { MOCK_GROUP_DEALS } from "@/lib/group-buying-engine";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { poolId, dealId, userName, city = "Bengaluru", pincode } = body;

    if (!userName || !pincode) {
      return NextResponse.json(
        { success: false, error: "User name and delivery pincode are required" },
        { status: 400 }
      );
    }

    const deal = MOCK_GROUP_DEALS.find((d) => d.id === dealId) || MOCK_GROUP_DEALS[0];
    const wholesalePrice = deal.tieredPricing[deal.tieredPricing.length - 1].pricePerUnit;

    return NextResponse.json({
      success: true,
      poolId: poolId || deal.currentPool.poolId,
      member: {
        id: `m-${Date.now()}`,
        name: userName,
        city,
        pincode,
        joinedAt: "Just now",
      },
      unlockedPrice: wholesalePrice,
      savings: deal.retailPrice - wholesalePrice,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to join group buy pool" },
      { status: 500 }
    );
  }
}
