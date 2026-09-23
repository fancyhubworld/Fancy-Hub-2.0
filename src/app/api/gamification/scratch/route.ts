import { NextResponse } from "next/server";
import { generateScratchCardReward } from "@/lib/gamification-engine";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const reward = generateScratchCardReward();

    return NextResponse.json({
      success: true,
      reward,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate scratch reward" },
      { status: 500 }
    );
  }
}
