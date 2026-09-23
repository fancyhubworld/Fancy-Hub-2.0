"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Award,
  Heart,
  Star,
  ArrowRight,
  ExternalLink,
  Play,
} from "lucide-react";
import { WidgetInstance } from "@/lib/widget-types";

interface WidgetProps {
  widget: WidgetInstance;
  isEditing?: boolean;
}

export function HeadingWidget({ widget }: WidgetProps) {
  const { title, subtitle, tag = "H2", badgeText, useGradient = true, alignment = "left" } = widget.settings || {};
  const displayTitle = title || widget.title || "Section Heading";
  const displaySub = subtitle || widget.subtitle;
  const displayBadge = badgeText || widget.badgeText;

  const alignClass = alignment === "center" ? "text-center items-center" : alignment === "right" ? "text-right items-end" : "text-left items-start";

  return (
    <div className={`flex flex-col ${alignClass} space-y-1.5`}>
      {displayBadge && (
        <span className="inline-flex items-center space-x-1 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-fancy-blue/10 text-fancy-blue border border-fancy-blue/20">
          <Sparkles className="w-3 h-3" />
          <span>{displayBadge}</span>
        </span>
      )}
      {tag === "H1" ? (
        <h1 className={`text-3xl md:text-5xl font-black tracking-tight ${useGradient ? "bg-gradient-to-r from-fancy-blue via-indigo-600 to-amber-500 bg-clip-text text-transparent" : "text-slate-900 dark:text-white"}`}>
          {displayTitle}
        </h1>
      ) : tag === "H3" ? (
        <h3 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          {displayTitle}
        </h3>
      ) : (
        <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${useGradient ? "bg-gradient-to-r from-fancy-blue to-indigo-600 bg-clip-text text-transparent" : "text-slate-900 dark:text-white"}`}>
          {displayTitle}
        </h2>
      )}
      {displaySub && (
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
          {displaySub}
        </p>
      )}
    </div>
  );
}

export function TextWidget({ widget }: WidgetProps) {
  const { text, fontSize = "text-sm", alignment = "left", lineHeight = "leading-relaxed" } = widget.settings || {};
  const displayText = text || widget.title || "Custom text paragraph content.";

  const alignClass = alignment === "center" ? "text-center" : alignment === "right" ? "text-right" : "text-left";

  return (
    <div className={`max-w-4xl ${alignClass}`}>
      <p className={`${fontSize} ${lineHeight} text-slate-600 dark:text-slate-300 font-normal`}>
        {displayText}
      </p>
    </div>
  );
}

export function RichTextWidget({ widget }: WidgetProps) {
  const { heading, bodyHtml, columns = 1 } = widget.settings || {};

  return (
    <div className="space-y-3 max-w-5xl">
      {heading && (
        <h3 className="text-xl font-black text-slate-900 dark:text-white">{heading}</h3>
      )}
      <div
        className={`prose dark:prose-invert max-w-none text-xs md:text-sm text-slate-600 dark:text-slate-300 ${
          columns === 2 ? "grid md:grid-cols-2 gap-6" : ""
        }`}
        dangerouslySetInnerHTML={{
          __html: bodyHtml || "<p>Editorial handcrafted Indian craftsmanship narrative.</p>",
        }}
      />
    </div>
  );
}

export function ImageWidget({ widget }: WidgetProps) {
  const { imageUrl, altText, caption, targetUrl, aspectRatio = "16/9", borderRadius = "rounded-3xl" } = widget.settings || {};

  const content = (
    <div className="space-y-2 group overflow-hidden">
      <div className={`overflow-hidden ${borderRadius} border border-slate-200 dark:border-slate-800 shadow-md`}>
        <img
          src={imageUrl || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&auto=format&fit=crop&q=80"}
          alt={altText || "FancyHub Showcase"}
          className="w-full h-auto object-cover group-hover:scale-102 transition duration-500"
          style={{ aspectRatio }}
        />
      </div>
      {caption && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center font-medium italic">
          {caption}
        </p>
      )}
    </div>
  );

  return targetUrl ? <Link href={targetUrl}>{content}</Link> : content;
}

export function VideoWidget({ widget }: WidgetProps) {
  const { videoUrl, title, autoplay = false, muted = true } = widget.settings || {};

  return (
    <div className="space-y-2 max-w-4xl mx-auto">
      <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&auto=format&fit=crop&q=80"
          alt="Video Preview"
          className="w-full h-full object-cover opacity-60"
        />
        <button className="relative z-20 w-16 h-16 rounded-full bg-fancy-blue text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition">
          <Play className="w-6 h-6 fill-current ml-1" />
        </button>
        {title && (
          <div className="absolute bottom-4 left-6 right-6 z-20 text-white">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">VIDEO SPOTLIGHT</span>
            <h4 className="text-sm md:text-base font-bold">{title}</h4>
          </div>
        )}
      </div>
    </div>
  );
}

export function IconWidget({ widget }: WidgetProps) {
  const { title, subtitle } = widget.settings || {};

  return (
    <div className="inline-flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
      <div className="w-10 h-10 rounded-xl bg-fancy-blue/10 text-fancy-blue flex items-center justify-center flex-shrink-0">
        <ShieldCheck className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-bold text-xs text-slate-900 dark:text-white">{title || "Certified Mark"}</h4>
        {subtitle && <p className="text-[11px] text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}

export function ButtonWidget({ widget }: WidgetProps) {
  const { label = "Explore Collection →", targetUrl = "/shop", variant = "gradient", size = "lg" } = widget.settings || {};

  return (
    <div className="inline-block">
      <Link
        href={targetUrl}
        className={`inline-flex items-center space-x-2 font-black rounded-2xl shadow-md transition active:scale-95 ${
          size === "lg" ? "px-6 py-3 text-sm" : "px-4 py-2 text-xs"
        } ${
          variant === "gradient"
            ? "bg-gradient-to-r from-fancy-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
            : "bg-slate-900 text-white hover:bg-slate-800"
        }`}
      >
        <span>{label}</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export function HtmlBlockWidget({ widget }: WidgetProps) {
  const { htmlContent } = widget.settings || {};

  return (
    <div
      className="w-full"
      dangerouslySetInnerHTML={{
        __html: htmlContent || "<div class='text-xs text-slate-400'>Custom HTML Content Block</div>",
      }}
    />
  );
}
