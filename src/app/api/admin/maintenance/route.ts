import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_MAINTENANCE_CONFIG, MaintenanceModeConfig } from "@/lib/maintenance-engine";

export async function GET() {
  try {
    const config = await prisma.systemPageConfig.findUnique({
      where: { id: "maintenance-mode-config" },
    });

    if (!config) {
      return NextResponse.json({ success: true, maintenance: DEFAULT_MAINTENANCE_CONFIG });
    }

    return NextResponse.json({ success: true, maintenance: JSON.parse(config.configJson) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: MaintenanceModeConfig = await request.json();

    const saved = await prisma.systemPageConfig.upsert({
      where: { id: "maintenance-mode-config" },
      update: {
        name: "Website Maintenance Mode Configuration",
        configJson: JSON.stringify(body),
      },
      create: {
        id: "maintenance-mode-config",
        name: "Website Maintenance Mode Configuration",
        configJson: JSON.stringify(body),
      },
    });

    return NextResponse.json({ success: true, maintenance: JSON.parse(saved.configJson) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
