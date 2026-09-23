export type SectionLayoutType = "container" | "row" | "column" | "grid" | "flex" | "stack";
export type SectionColumnType = "1-col" | "2-col" | "3-col" | "4-col" | "custom-grid";
export type SectionAnimationType = "none" | "fade-in" | "slide-up" | "zoom-in" | "pulse" | "bounce";

export interface ResponsiveDeviceSettings {
  width?: string;           // e.g. "100%", "max-w-7xl", "max-w-5xl"
  height?: string;          // e.g. "auto", "min-h-[400px]", "h-screen"
  paddingTop?: string;      // e.g. "1rem", "2rem", "4rem"
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  marginTop?: string;
  marginBottom?: string;
  fontSize?: string;        // e.g. "text-sm", "text-base", "text-xl"
  columns?: number;         // e.g. Desktop: 4, Tablet: 3, Mobile: 2
  visibility?: boolean;     // show or hide on this device
  alignment?: "left" | "center" | "right" | "justify";
  position?: "static" | "relative" | "sticky" | "fixed";
}

export interface ResponsiveVisibility {
  showDesktop: boolean;
  showTablet: boolean;
  showMobile: boolean;
}

export interface MobileSpecificContent {
  desktopImage?: string;
  mobileImage?: string;
  desktopBanner?: string;
  mobileBanner?: string;
  desktopText?: string;
  mobileText?: string;
  desktopSubtitle?: string;
  mobileSubtitle?: string;
  desktopCtaText?: string;
  mobileCtaText?: string;
}

export interface UniversalSectionSettings {
  // 1. Background & Visuals
  background?: string;             // solid hex or token (e.g. "#FFFFFF", "var(--surface)")
  backgroundImage?: string;        // url
  backgroundPosition?: string;     // "center", "top", "bottom"
  backgroundSize?: "cover" | "contain" | "auto";
  gradient?: {
    enabled: boolean;
    type: "linear" | "radial";
    direction?: string;            // "to right", "135deg", "to bottom"
    fromColor?: string;
    toColor?: string;
    stops?: string;
  };

  // 2. Dimensions & Spacing
  width?: "container" | "full" | "narrow" | "custom";
  customWidth?: string;
  height?: "auto" | "min-400" | "min-600" | "screen" | "custom";
  customHeight?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  marginTop?: string;
  marginBottom?: string;

  // 3. Borders, Radius & Elevation
  borderWidth?: string;            // "0px", "1px", "2px"
  borderColor?: string;
  borderStyle?: "solid" | "dashed" | "dotted" | "none";
  radius?: string;                 // "0px", "0.5rem", "1rem", "1.5rem", "9999px"
  shadow?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "glow" | "neon";

  // 4. Animation & Class
  animation?: SectionAnimationType;
  customClass?: string;

  // 5. Section Layout & Grid (Section 30)
  layout: SectionLayoutType;       // Container, Row, Column, Grid, Flex, Stack
  columns: SectionColumnType;      // 1 column, 2 columns, 3 columns, 4 columns, Custom grid
  customGridTemplate?: string;     // e.g. "1fr 2fr", "repeat(auto-fit, minmax(280px, 1fr))"
  gap?: string;                    // "gap-4", "gap-6", "gap-8"

  // 6. Responsive Visibility & Device Settings (Sections 26 & 27)
  visibility: ResponsiveVisibility;
  responsive: {
    desktop: ResponsiveDeviceSettings;
    tablet: ResponsiveDeviceSettings;
    mobile: ResponsiveDeviceSettings;
  };

  // 7. Mobile-Specific Content Payload (Section 28)
  mobileContent?: MobileSpecificContent;
}

export const DEFAULT_SECTION_SETTINGS: UniversalSectionSettings = {
  background: "transparent",
  gradient: { enabled: false, type: "linear", direction: "to right", fromColor: "#1455D9", toColor: "#6366F1" },
  width: "container",
  height: "auto",
  paddingTop: "1rem",
  paddingBottom: "1.5rem",
  paddingLeft: "0px",
  paddingRight: "0px",
  marginTop: "0px",
  marginBottom: "0px",
  borderWidth: "0px",
  borderColor: "transparent",
  borderStyle: "none",
  radius: "1rem",
  shadow: "none",
  animation: "none",
  customClass: "",
  layout: "container",
  columns: "1-col",
  gap: "gap-6",
  visibility: {
    showDesktop: true,
    showTablet: true,
    showMobile: true,
  },
  responsive: {
    desktop: {
      columns: 4,
      paddingTop: "1.5rem",
      paddingBottom: "1.5rem",
      visibility: true,
      alignment: "left",
      position: "relative",
    },
    tablet: {
      columns: 3,
      paddingTop: "1.25rem",
      paddingBottom: "1.25rem",
      visibility: true,
      alignment: "left",
      position: "relative",
    },
    mobile: {
      columns: 2,
      paddingTop: "1rem",
      paddingBottom: "1rem",
      visibility: true,
      alignment: "left",
      position: "relative",
    },
  },
  mobileContent: {
    desktopImage: "",
    mobileImage: "",
    desktopBanner: "",
    mobileBanner: "",
    desktopText: "",
    mobileText: "",
  },
};

/**
 * Resolves content depending on active device viewport
 */
export function resolveDeviceContent<T extends Record<string, any>>(
  content: T,
  mobileContent?: MobileSpecificContent,
  isMobile: boolean = false
): T {
  if (!mobileContent || !isMobile) return content;

  return {
    ...content,
    imageUrl: mobileContent.mobileImage || content.imageUrl,
    bannerUrl: mobileContent.mobileBanner || content.bannerUrl,
    title: mobileContent.mobileText || content.title,
    subtitle: mobileContent.mobileSubtitle || content.subtitle,
    ctaText: mobileContent.mobileCtaText || content.ctaText,
  };
}

/**
 * Generates Tailwind CSS layout classes for a section container
 */
export function getSectionLayoutClasses(settings: UniversalSectionSettings): string {
  const { width = "container", customWidth, customClass = "" } = settings;

  let containerClass = "w-full max-w-[1440px] mx-auto px-4 sm:px-5 md:px-6 lg:px-7 xl:px-8";
  if (width === "full") {
    containerClass = "w-full px-4 sm:px-6";
  } else if (width === "narrow") {
    containerClass = "w-full max-w-4xl mx-auto px-4 sm:px-5 md:px-6";
  } else if (width === "custom" && customWidth) {
    containerClass = `w-full ${customWidth} mx-auto px-4 sm:px-5 md:px-6`;
  }

  return `${containerClass} ${customClass}`.trim();
}

/**
 * Generates responsive visibility CSS classes
 */
export function getSectionVisibilityClasses(visibility: ResponsiveVisibility): string {
  const { showDesktop, showTablet, showMobile } = visibility;

  if (showDesktop && showTablet && showMobile) return "block";
  if (!showDesktop && !showTablet && !showMobile) return "hidden";

  // Desktop only
  if (showDesktop && !showTablet && !showMobile) return "hidden lg:block";
  // Mobile only
  if (!showDesktop && !showTablet && showMobile) return "block md:hidden";
  // Tablet only
  if (!showDesktop && showTablet && !showMobile) return "hidden md:block lg:hidden";
  // Desktop + Tablet (hide mobile)
  if (showDesktop && showTablet && !showMobile) return "hidden md:block";
  // Tablet + Mobile (hide desktop)
  if (!showDesktop && showTablet && showMobile) return "block lg:hidden";
  // Desktop + Mobile (hide tablet)
  if (showDesktop && !showTablet && showMobile) return "block md:hidden lg:block";

  return "block";
}
