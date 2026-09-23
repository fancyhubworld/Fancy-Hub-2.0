import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_EMPTY_STATES, EmptyStateType, EmptyStateItemConfig } from "@/lib/empty-states-engine";

export async function GET() {
  try {
    const config = await prisma.systemPageConfig.findUnique({
      where: { id: "empty-states-config" },
    });

    if (!config) {
      return NextResponse.json({ success: true, emptyStates: DEFAULT_EMPTY_STATES });
    }

    return NextResponse.json({ success: true, emptyStates: JSON.parse(config.configJson) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: Record<EmptyStateType, EmptyStateItemConfig> = await request.json();

    const saved = await prisma.systemPageConfig.upsert({
      where: { id: "empty-states-config" },
      update: {
        name: "Empty States & 404 Configuration",
        configJson: JSON.stringify(body),
      },
      create: {
        id: "empty-states-config",
        name: "Empty States & 404 Configuration",
        configJson: JSON.stringify(body),
      },
    });

    return NextResponse.json({ success: true, emptyStates: JSON.parse(saved.configJson) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
