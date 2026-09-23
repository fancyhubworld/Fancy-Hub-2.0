/**
 * FancyHub.in Central Design Tokens
 * Premium, modern Indian multi-vendor marketplace
 */

export const BRAND = {
  name: "FancyHub.in",
  tagline: "Shop More, Pay Less",
  domain: "fancyhub.in",
  supportPhone: "1800-890-FANCY (32629)",
  supportEmail: "support@fancyhub.in",
  sellerEmail: "sell@fancyhub.in",
  currency: {
    code: "INR",
    symbol: "₹",
    locale: "en-IN",
  },
  colors: {
    fancyBlue: "#1455D9",
    deepNavy: "#0B2A63",
    darkNavy: "#061A40",
    fancyOrange: "#F7941D",
    vibrantOrange: "#FF7A00",
    successGreen: "#10B981",
    warningAmber: "#F59E0B",
    dangerRed: "#EF4444",
    slateMuted: "#64748B",
    borderGray: "#E2E8F0",
    cardBg: "#FFFFFF",
    appBg: "#F8FAFC",
  },
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    full: "9999px",
  },
  shadows: {
    subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
    card: "0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)",
    elevated: "0 10px 25px -5px rgba(20, 85, 217, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
  }
};

export function formatINR(amount: number): string {
  if (isNaN(amount)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function calculateSavings(mrp: number, price: number): { amount: number; percent: number } {
  if (!mrp || mrp <= price) return { amount: 0, percent: 0 };
  const amount = mrp - price;
  const percent = Math.round((amount / mrp) * 100);
  return { amount, percent };
}
