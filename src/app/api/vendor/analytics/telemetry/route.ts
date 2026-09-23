import { NextResponse } from "next/server";
import {
  MOCK_STATE_SALES,
  MOCK_TOP_PINCODES,
  getVendorCohortMetrics,
  predictRestockSchedule,
} from "@/lib/vendor-analytics-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cohort = getVendorCohortMetrics();
    const restockSchedule = predictRestockSchedule();

    return NextResponse.json({
      success: true,
      cohort,
      stateSales: MOCK_STATE_SALES,
      topPincodes: MOCK_TOP_PINCODES,
      restockSchedule,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch vendor telemetry" },
      { status: 500 }
    );
  }
}
