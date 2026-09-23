import React, { Suspense } from "react";
import { VisualBuilderStudio } from "@/components/builder/VisualBuilderStudio";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visual Website Builder | FancyHub ERP",
  description: "Visual drag-and-drop page and website customizer for FancyHub.in",
};

interface PageProps {
  searchParams: { slug?: string };
}

export default function VisualBuilderPage({ searchParams }: PageProps) {
  const slug = searchParams?.slug || "home";

  return (
    <Suspense fallback={<div className="h-screen w-screen bg-slate-950 flex items-center justify-center text-white text-xs">Loading Visual Studio...</div>}>
      <VisualBuilderStudio initialSlug={slug} />
    </Suspense>
  );
}
