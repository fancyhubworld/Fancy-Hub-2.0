export type DeviceViewportType = "desktop" | "tablet" | "mobile";

export interface BreakpointConfig {
  id: DeviceViewportType;
  label: string;
  defaultWidth: number;
  minWidth: number;
  maxWidth: number;
  presets: { name: string; width: number; height: number }[];
}

export const RESPONSIVE_BREAKPOINTS: Record<DeviceViewportType, BreakpointConfig> = {
  desktop: {
    id: "desktop",
    label: "Desktop View",
    defaultWidth: 1440,
    minWidth: 1024,
    maxWidth: 2560,
    presets: [
      { name: "HD Desktop (1440px)", width: 1440, height: 900 },
      { name: "Full HD (1920px)", width: 1920, height: 1080 },
      { name: "Compact Laptop (1280px)", width: 1280, height: 800 },
      { name: "Small Desktop (1024px)", width: 1024, height: 768 },
    ],
  },
  tablet: {
    id: "tablet",
    label: "Tablet View",
    defaultWidth: 768,
    minWidth: 640,
    maxWidth: 1023,
    presets: [
      { name: "iPad Air (768px)", width: 768, height: 1024 },
      { name: "iPad Pro 11 (834px)", width: 834, height: 1194 },
      { name: "Surface Pro (912px)", width: 912, height: 1368 },
    ],
  },
  mobile: {
    id: "mobile",
    label: "Mobile View",
    defaultWidth: 390,
    minWidth: 320,
    maxWidth: 639,
    presets: [
      { name: "iPhone 14/15/16 (390px)", width: 390, height: 844 },
      { name: "iPhone Pro Max (430px)", width: 430, height: 932 },
      { name: "Samsung Galaxy S22 (360px)", width: 360, height: 800 },
      { name: "Compact Mobile (320px)", width: 320, height: 568 },
    ],
  },
};

export function getViewportWidth(device: DeviceViewportType, customWidth?: number): number {
  if (customWidth && customWidth > 0) {
    return Math.max(
      RESPONSIVE_BREAKPOINTS[device].minWidth,
      Math.min(RESPONSIVE_BREAKPOINTS[device].maxWidth, customWidth)
    );
  }
  return RESPONSIVE_BREAKPOINTS[device].defaultWidth;
}
