import React from "react";
import { PrismaClient } from "@prisma/client";
import { SectionRenderer } from "@/components/builder/SectionRenderer";
import { getDefaultHomepageSections } from "@/lib/page-builder";
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/seo-structured-data";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

async function getHomepageSections() {
  try {
    const page = await prisma.pageConfig.findFirst({
      where: { OR: [{ slug: "home" }, { isHomepage: true }] },
      include: {
        sections: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (page && page.sections.length > 0) {
      return page.sections;
    }
  } catch (e) {
    console.error("Could not fetch dynamic homepage sections, using defaults:", e);
  }

  // Fallback to rich defaults
  return getDefaultHomepageSections();
}

export default async function HomePage() {
  const sections = await getHomepageSections();
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <div className="space-y-2 pb-12">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {sections.map((section: any, idx: number) => (
        <SectionRenderer
          key={section.id || `section-${idx}`}
          section={section}
        />
      ))}
    </div>
  );
}
