"use client";

import React from "react";
import { WidgetDispatcher } from "../widgets/WidgetDispatcher";
import { WidgetErrorBoundary } from "./WidgetErrorBoundary";
import {
  UniversalSectionSettings,
  DEFAULT_SECTION_SETTINGS,
  getSectionLayoutClasses,
  getSectionVisibilityClasses,
  resolveDeviceContent,
} from "@/lib/section-builder-types";

export interface RenderSectionData {
  id?: string;
  type: string;
  isActive?: boolean;
  desktopVisible?: boolean;
  mobileVisible?: boolean;
  title?: string | null;
  subtitle?: string | null;
  badgeText?: string | null;
  contentJson?: string | any;
  stylingJson?: string | null | any;
  settings?: any;
  style?: any;
  responsiveSettings?: any;
  dataSource?: any;
  visibilityRules?: any;
  content?: any;
  styling?: any;
  sectionSettings?: UniversalSectionSettings;
}

interface SectionRendererProps {
  section: RenderSectionData;
  isEditing?: boolean;
  onSelect?: () => void;
  isSelected?: boolean;
  isMobilePreview?: boolean;
}

export function SectionRenderer({
  section,
  isEditing = false,
  onSelect,
  isSelected = false,
  isMobilePreview = false,
}: SectionRendererProps) {
  if (section.isActive === false && !isEditing) return null;

  const sectionSettings: UniversalSectionSettings =
    section.sectionSettings ||
    (typeof section.stylingJson === "object" && section.stylingJson?.sectionSettings
      ? section.stylingJson.sectionSettings
      : DEFAULT_SECTION_SETTINGS);

  // Responsive Visibility check
  const visibilityClass = sectionSettings.visibility
    ? getSectionVisibilityClasses(sectionSettings.visibility)
    : section.desktopVisible === false && section.mobileVisible === true
    ? "block md:hidden"
    : section.desktopVisible === true && section.mobileVisible === false
    ? "hidden md:block"
    : "block";

  // Resolve mobile-specific content if needed
  let parsedContent = section.content || section.settings || {};
  if (typeof section.contentJson === "string") {
    try {
      parsedContent = JSON.parse(section.contentJson);
    } catch {}
  }
  const resolvedContent = resolveDeviceContent(
    parsedContent,
    sectionSettings.mobileContent,
    isMobilePreview
  );

  const mergedSectionData: RenderSectionData = {
    ...section,
    content: resolvedContent,
    settings: resolvedContent,
  };

  // Section container inline styles
  const containerStyle: React.CSSProperties = {
    backgroundColor: sectionSettings.background !== "transparent" ? sectionSettings.background : undefined,
    paddingTop: sectionSettings.paddingTop,
    paddingBottom: sectionSettings.paddingBottom,
    paddingLeft: sectionSettings.paddingLeft,
    paddingRight: sectionSettings.paddingRight,
    marginTop: sectionSettings.marginTop,
    marginBottom: sectionSettings.marginBottom,
    borderRadius: sectionSettings.radius,
    borderWidth: sectionSettings.borderWidth,
    borderColor: sectionSettings.borderColor,
    borderStyle: sectionSettings.borderStyle as any,
  };

  return (
    <section
      className={`${visibilityClass} ${sectionSettings.customClass || ""} transition-all duration-200`}
      style={containerStyle}
    >
      <div className={getSectionLayoutClasses(sectionSettings)}>
        <WidgetErrorBoundary widgetType={section.type} widgetId={section.id}>
          <WidgetDispatcher
            widget={mergedSectionData}
            isEditing={isEditing}
            isSelected={isSelected}
            onSelect={onSelect}
          />
        </WidgetErrorBoundary>
      </div>
    </section>
  );
}
