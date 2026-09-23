import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_HOMEPAGE_EXPERIMENT, ABExperiment } from "@/lib/ab-testing-engine";

export async function GET() {
  try {
    const config = await prisma.systemPageConfig.findUnique({
      where: { id: "ab-testing-experiments" },
    });

    if (!config) {
      return NextResponse.json({ success: true, experiments: [DEFAULT_HOMEPAGE_EXPERIMENT] });
    }

    return NextResponse.json({ success: true, experiments: JSON.parse(config.configJson) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: ABExperiment[] = await request.json();

    const saved = await prisma.systemPageConfig.upsert({
      where: { id: "ab-testing-experiments" },
      update: {
        name: "A/B Testing Experiments Configuration",
        configJson: JSON.stringify(body),
      },
      create: {
        id: "ab-testing-experiments",
        name: "A/B Testing Experiments Configuration",
        configJson: JSON.stringify(body),
      },
    });

    return NextResponse.json({ success: true, experiments: JSON.parse(saved.configJson) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
