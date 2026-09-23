import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateNavigationLinks } from "@/lib/page-link-validator";
import { NavigationMenuItem } from "@/lib/navigation-builder-types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items: NavigationMenuItem[] = body.items || [];

    const report = await validateNavigationLinks(prisma, items);

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
