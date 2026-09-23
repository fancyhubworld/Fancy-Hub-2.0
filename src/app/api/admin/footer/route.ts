import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { DEFAULT_FOOTER_CONFIG, FooterBuilderConfig } from "@/lib/footer-builder-types";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const record = await prisma.systemPageConfig.findUnique({
      where: { id: "footer-builder-config" },
    });

    if (!record) {
      return NextResponse.json({
        success: true,
        footer: DEFAULT_FOOTER_CONFIG,
      });
    }

    const config: FooterBuilderConfig = JSON.parse(record.configJson);
    return NextResponse.json({
      success: true,
      footer: config,
    });
  } catch (error: any) {
    console.error("GET /api/admin/footer error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch footer config" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const payload: FooterBuilderConfig = {
      id: "footer-builder-config",
      showTrustBadges: body.showTrustBadges ?? true,
      showNewsletter: body.showNewsletter ?? true,
      showContactInfo: body.showContactInfo ?? true,
      showAppDownload: body.showAppDownload ?? true,
      showSocialIcons: body.showSocialIcons ?? true,
      showPaymentIcons: body.showPaymentIcons ?? true,
      copyrightText: body.copyrightText || DEFAULT_FOOTER_CONFIG.copyrightText,
      legalNotice: body.legalNotice || DEFAULT_FOOTER_CONFIG.legalNotice,
      trustBadges: Array.isArray(body.trustBadges) ? body.trustBadges : DEFAULT_FOOTER_CONFIG.trustBadges,
      newsletter: body.newsletter || DEFAULT_FOOTER_CONFIG.newsletter,
      contactInfo: body.contactInfo || DEFAULT_FOOTER_CONFIG.contactInfo,
      appDownload: body.appDownload || DEFAULT_FOOTER_CONFIG.appDownload,
      columns: Array.isArray(body.columns) ? body.columns : DEFAULT_FOOTER_CONFIG.columns,
      socialIcons: Array.isArray(body.socialIcons) ? body.socialIcons : DEFAULT_FOOTER_CONFIG.socialIcons,
      paymentIcons: Array.isArray(body.paymentIcons) ? body.paymentIcons : DEFAULT_FOOTER_CONFIG.paymentIcons,
      updatedAt: new Date().toISOString(),
    };

    const saved = await prisma.systemPageConfig.upsert({
      where: { id: "footer-builder-config" },
      update: {
        name: "Global Footer Configuration",
        configJson: JSON.stringify(payload),
      },
      create: {
        id: "footer-builder-config",
        name: "Global Footer Configuration",
        configJson: JSON.stringify(payload),
      },
    });

    // Also keep legacy footerConfig synchronized
    try {
      await prisma.footerConfig.upsert({
        where: { id: "global-footer" },
        update: {
          showNewsletter: payload.showNewsletter,
          newsletterTitle: payload.newsletter.title,
          newsletterSubtitle: payload.newsletter.subtitle,
          copyrightText: payload.copyrightText,
          columnsJson: JSON.stringify(payload.columns),
          socialLinksJson: JSON.stringify(payload.socialIcons),
          paymentIconsJson: JSON.stringify(payload.paymentIcons),
        },
        create: {
          id: "global-footer",
          showNewsletter: payload.showNewsletter,
          newsletterTitle: payload.newsletter.title,
          newsletterSubtitle: payload.newsletter.subtitle,
          copyrightText: payload.copyrightText,
          columnsJson: JSON.stringify(payload.columns),
          socialLinksJson: JSON.stringify(payload.socialIcons),
          paymentIconsJson: JSON.stringify(payload.paymentIcons),
        },
      });
    } catch (e) {
      // Non-blocking sync
    }

    return NextResponse.json({
      success: true,
      footer: JSON.parse(saved.configJson),
    });
  } catch (error: any) {
    console.error("POST /api/admin/footer error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save footer configuration" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
