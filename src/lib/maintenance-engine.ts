export interface MaintenanceModeConfig {
  isEnabled: boolean;
  headline: string;
  message: string;
  logoUrl?: string;
  expectedLaunchTime?: string; // ISO date string or formatted string
  countdownTarget?: string;
  socialLinks?: Array<{ platform: string; url: string }>;
  allowSuperAdminBypass: boolean;
  bypassSecret: string;
}

export const DEFAULT_MAINTENANCE_CONFIG: MaintenanceModeConfig = {
  isEnabled: false,
  headline: "🚀 FancyHub is Upgrading for the Mega Festive Launch",
  message: "We are currently deploying lightning-fast infrastructure and new Indian master weaver collections. We will be back online shortly!",
  expectedLaunchTime: "2026-08-30T18:00:00.000Z",
  countdownTarget: "2026-08-30T18:00:00.000Z",
  socialLinks: [
    { platform: "Instagram", url: "https://instagram.com/fancyhub.in" },
    { platform: "WhatsApp", url: "https://wa.me/919876543210" },
    { platform: "Twitter", url: "https://twitter.com/fancyhub_in" },
  ],
  allowSuperAdminBypass: true,
  bypassSecret: "FancyAdminBypass2026",
};

export function shouldBypassMaintenance(
  urlOrParams: URLSearchParams | string,
  userRole?: string
): boolean {
  if (userRole === "SUPER_ADMIN" || userRole === "ADMIN") return true;
  const params = typeof urlOrParams === "string" ? new URLSearchParams(urlOrParams) : urlOrParams;
  return params.get("bypass") === DEFAULT_MAINTENANCE_CONFIG.bypassSecret;
}
