import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_GLOBAL_WIDGETS, GlobalWidgetsConfig } from "@/lib/global-widgets-engine";

export async function GET() {
  try {
    const config = await prisma.systemPageConfig.findUnique({
      where: { id: "global-widgets-config" },
    });

    if (!config) {
      return NextResponse.json({ success: true, widgets: DEFAULT_GLOBAL_WIDGETS });
    }

    return NextResponse.json({ success: true, widgets: JSON.parse(config.configJson) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: GlobalWidgetsConfig = await request.json();

    const saved = await prisma.systemPageConfig.upsert({
      where: { id: "global-widgets-config" },
      update: {
        name: "Global Widgets Configuration",
        configJson: JSON.stringify(body),
      },
      create: {
        id: "global-widgets-config",
        name: "Global Widgets Configuration",
        configJson: JSON.stringify(body),
      },
    });

    return NextResponse.json({ success: true, widgets: JSON.parse(saved.configJson) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
