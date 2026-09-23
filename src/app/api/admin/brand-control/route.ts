import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_BRAND_LOCK_SETTINGS, BrandLockSettings } from "@/lib/brand-lock-engine";

export async function GET() {
  try {
    const config = await prisma.systemPageConfig.findUnique({
      where: { id: "global-brand-lock-config" },
    });

    if (!config) {
      return NextResponse.json({ success: true, brandLock: DEFAULT_BRAND_LOCK_SETTINGS });
    }

    return NextResponse.json({ success: true, brandLock: JSON.parse(config.configJson) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: BrandLockSettings = await request.json();

    const saved = await prisma.systemPageConfig.upsert({
      where: { id: "global-brand-lock-config" },
      update: {
        name: "Admin Global Brand Control Settings",
        configJson: JSON.stringify(body),
      },
      create: {
        id: "global-brand-lock-config",
        name: "Admin Global Brand Control Settings",
        configJson: JSON.stringify(body),
      },
    });

    return NextResponse.json({ success: true, brandLock: JSON.parse(saved.configJson) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
