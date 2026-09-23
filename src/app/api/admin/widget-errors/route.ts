import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { widgetType, widgetId, pageSlug, errorMessage, timestamp } = body;

    // Log to AuditLog or return success
    console.warn(`[Widget Error Telemetry] ${widgetType} on ${pageSlug}: ${errorMessage}`);

    return NextResponse.json({ success: true, logged: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
