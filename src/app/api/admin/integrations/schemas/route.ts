import { NextResponse } from "next/server";
import { getAllProviderSchemas } from "@/lib/integrations/integration-manager";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const schemas = getAllProviderSchemas();
    return NextResponse.json({
      success: true,
      schemas,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
