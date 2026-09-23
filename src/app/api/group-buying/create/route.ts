import { NextResponse } from "next/server";
import { MOCK_GROUP_DEALS } from "@/lib/group-buying-engine";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dealId, creatorName = "Shopper", city = "Mumbai", pincode = "400001" } = body;

    const deal = MOCK_GROUP_DEALS.find((d) => d.id === dealId) || MOCK_GROUP_DEALS[0];
    const newPoolId = `pool-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(); // 2 hours

    return NextResponse.json({
      success: true,
      poolId: newPoolId,
      dealId: deal.id,
      creatorName,
      city,
      pincode,
      expiresAt,
      membersJoined: 1,
      targetMembers: 3,
      unlockedPrice: deal.tieredPricing[2].pricePerUnit,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create group buy pool" },
      { status: 500 }
    );
  }
}
