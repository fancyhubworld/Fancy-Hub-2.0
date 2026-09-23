"use client";

import React from "react";

interface RichContentProps {
  content?: {
    title?: string;
    subtitle?: string;
    contentHtml?: string;
    alignment?: "left" | "center";
  };
}

export function RichContentWidget({ content }: RichContentProps) {
  const alignment = content?.alignment === "center" ? "text-center mx-auto" : "text-left";

  return (
    <section className="max-w-4xl mx-auto px-4 py-6">
      <div className={`space-y-4 ${alignment}`}>
        {content?.title && (
          <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">
            {content.title}
          </h2>
        )}
        {content?.subtitle && (
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
            {content.subtitle}
          </p>
        )}
        {content?.contentHtml && (
          <div
            className="prose prose-sm dark:prose-invert max-w-none text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3"
            dangerouslySetInnerHTML={{ __html: content.contentHtml }}
          />
        )}
      </div>
    </section>
  );
}
