import { NextResponse } from "next/server";
import {
  calculateSpinResult,
  validateIndianPhoneNumber,
  DEFAULT_FESTIVE_SLICES,
} from "@/lib/gamification-engine";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, requirePhone = true, slices = DEFAULT_FESTIVE_SLICES } = body;

    if (requirePhone) {
      const validation = validateIndianPhoneNumber(phone);
      if (!validation.isValid) {
        return NextResponse.json(
          { success: false, error: validation.error || "Valid mobile number required" },
          { status: 400 }
        );
      }
    }

    const spinResult = calculateSpinResult(slices, phone);

    return NextResponse.json({
      success: true,
      result: spinResult,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to calculate spin result" },
      { status: 500 }
    );
  }
}
