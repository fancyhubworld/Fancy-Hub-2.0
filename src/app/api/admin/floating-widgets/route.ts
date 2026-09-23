import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_FLOATING_WIDGETS, FloatingWidgetSettings } from "@/lib/floating-widgets-types";

export async function GET() {
  try {
    const config = await prisma.systemPageConfig.findUnique({
      where: { id: "floating-widgets-config" },
    });

    if (!config) {
      return NextResponse.json({ success: true, floating: DEFAULT_FLOATING_WIDGETS });
    }

    return NextResponse.json({ success: true, floating: JSON.parse(config.configJson) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: FloatingWidgetSettings = await request.json();

    const saved = await prisma.systemPageConfig.upsert({
      where: { id: "floating-widgets-config" },
      update: {
        name: "Floating Widgets Quick Bar",
        configJson: JSON.stringify(body),
      },
      create: {
        id: "floating-widgets-config",
        name: "Floating Widgets Quick Bar",
        configJson: JSON.stringify(body),
      },
    });

    return NextResponse.json({ success: true, floating: JSON.parse(saved.configJson) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
