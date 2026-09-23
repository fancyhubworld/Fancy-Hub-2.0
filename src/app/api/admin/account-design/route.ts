import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_ACCOUNT_UI_CONFIG, CustomerAccountUiConfig } from "@/lib/brand-lock-engine";

export async function GET() {
  try {
    const config = await prisma.systemPageConfig.findUnique({
      where: { id: "customer-account-ui-config" },
    });

    if (!config) {
      return NextResponse.json({ success: true, accountUi: DEFAULT_ACCOUNT_UI_CONFIG });
    }

    return NextResponse.json({ success: true, accountUi: JSON.parse(config.configJson) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: CustomerAccountUiConfig = await request.json();

    const saved = await prisma.systemPageConfig.upsert({
      where: { id: "customer-account-ui-config" },
      update: {
        name: "Customer Account UI Visual Configuration",
        configJson: JSON.stringify(body),
      },
      create: {
        id: "customer-account-ui-config",
        name: "Customer Account UI Visual Configuration",
        configJson: JSON.stringify(body),
      },
    });

    return NextResponse.json({ success: true, accountUi: JSON.parse(saved.configJson) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
