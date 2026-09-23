import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_VENDOR_DESIGN,
  DEFAULT_BRAND_LOCK_SETTINGS,
  VendorStorefrontDesign,
  enforceBrandRules,
} from "@/lib/brand-lock-engine";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get("vendorId") || "vendor-surat-silk";

    const config = await prisma.systemPageConfig.findUnique({
      where: { id: `vendor-storefront-${vendorId}` },
    });

    if (!config) {
      return NextResponse.json({ success: true, design: { ...DEFAULT_VENDOR_DESIGN, vendorId } });
    }

    return NextResponse.json({ success: true, design: JSON.parse(config.configJson) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const vendorId = body.vendorId || "vendor-surat-silk";

    // Fetch Global Brand Lock Settings
    const lockConfigRecord = await prisma.systemPageConfig.findUnique({
      where: { id: "global-brand-lock-config" },
    });
    const brandLock = lockConfigRecord
      ? JSON.parse(lockConfigRecord.configJson)
      : DEFAULT_BRAND_LOCK_SETTINGS;

    // Enforce brand rules
    const { sanitized, violatedRules } = enforceBrandRules(body, brandLock);

    const saved = await prisma.systemPageConfig.upsert({
      where: { id: `vendor-storefront-${vendorId}` },
      update: {
        name: `Vendor Storefront: ${sanitized.storeName}`,
        configJson: JSON.stringify(sanitized),
      },
      create: {
        id: `vendor-storefront-${vendorId}`,
        name: `Vendor Storefront: ${sanitized.storeName}`,
        configJson: JSON.stringify(sanitized),
      },
    });

    return NextResponse.json({
      success: true,
      design: JSON.parse(saved.configJson),
      violatedRules,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
