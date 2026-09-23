import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_CHECKOUT_DESIGN_CONFIG, CheckoutDesignerConfig } from "@/lib/brand-lock-engine";

export async function GET() {
  try {
    const config = await prisma.systemPageConfig.findUnique({
      where: { id: "checkout-design-config" },
    });

    if (!config) {
      return NextResponse.json({ success: true, checkoutDesign: DEFAULT_CHECKOUT_DESIGN_CONFIG });
    }

    return NextResponse.json({ success: true, checkoutDesign: JSON.parse(config.configJson) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: CheckoutDesignerConfig = await request.json();

    const saved = await prisma.systemPageConfig.upsert({
      where: { id: "checkout-design-config" },
      update: {
        name: "Cart & Checkout Visual Design",
        configJson: JSON.stringify(body),
      },
      create: {
        id: "checkout-design-config",
        name: "Cart & Checkout Visual Design",
        configJson: JSON.stringify(body),
      },
    });

    return NextResponse.json({ success: true, checkoutDesign: JSON.parse(saved.configJson) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
