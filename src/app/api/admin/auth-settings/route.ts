import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_AUTH_DESIGN, AuthPageDesignConfig, getClientGoogleOAuthConfig } from "@/lib/auth-designer-types";

export async function GET() {
  try {
    const config = await prisma.systemPageConfig.findUnique({
      where: { id: "auth-pages-design-config" },
    });

    const googleAuth = getClientGoogleOAuthConfig();

    const authDesign: AuthPageDesignConfig = config
      ? JSON.parse(config.configJson)
      : DEFAULT_AUTH_DESIGN;

    return NextResponse.json({
      success: true,
      authDesign,
      googleAuth,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: AuthPageDesignConfig = await request.json();

    const saved = await prisma.systemPageConfig.upsert({
      where: { id: "auth-pages-design-config" },
      update: {
        name: "Login & Register Page Design Settings",
        configJson: JSON.stringify(body),
      },
      create: {
        id: "auth-pages-design-config",
        name: "Login & Register Page Design Settings",
        configJson: JSON.stringify(body),
      },
    });

    return NextResponse.json({
      success: true,
      authDesign: JSON.parse(saved.configJson),
      googleAuth: getClientGoogleOAuthConfig(),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
