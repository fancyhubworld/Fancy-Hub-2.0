import { NextResponse } from "next/server";
import { getWebsiteControlCenterData } from "@/lib/website-control-engine";

export async function GET() {
  try {
    const data = getWebsiteControlCenterData();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
