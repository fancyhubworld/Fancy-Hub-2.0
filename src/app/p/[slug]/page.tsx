import React from "react";
import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { SectionRenderer } from "@/components/builder/SectionRenderer";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const page = await prisma.pageConfig.findUnique({
      where: { slug: params.slug },
    });

    if (!page) {
      return { title: "Page Not Found | FancyHub.in" };
    }

    return {
      title: page.seoTitle || `${page.title} | FancyHub.in`,
      description: page.seoDescription || page.description || "Discover verified Indian marketplace offers on FancyHub.in",
    };
  } catch (e) {
    return { title: "FancyHub.in" };
  }
}

export default async function DynamicCMSPage({ params }: PageProps) {
  const page = await prisma.pageConfig.findUnique({
    where: { slug: params.slug },
    include: {
      sections: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!page || page.status === "ARCHIVED") {
    notFound();
  }

  return (
    <div className="space-y-4 pb-16 min-h-[60vh]">
      {page.sections.length === 0 ? (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">{page.title}</h1>
          {page.description && <p className="text-slate-500 text-sm">{page.description}</p>}
          <div className="p-8 bg-slate-100 dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 text-xs">
            This page has no sections configured yet. Add visual sections from the Admin ERP Page Builder.
          </div>
        </div>
      ) : (
        page.sections.map((section, idx) => (
          <SectionRenderer key={section.id || idx} section={section} />
        ))
      )}
    </div>
  );
}
