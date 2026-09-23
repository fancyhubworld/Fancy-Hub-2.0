export interface FooterLinkItem {
  id: string;
  label: string;
  url: string;
  badge?: string;
  isNewTab?: boolean;
}

export interface FooterColumn {
  id: string;
  title: string;
  sortOrder: number;
  isActive: boolean;
  links: FooterLinkItem[];
}

export interface SocialIconItem {
  id: string;
  platform: "instagram" | "facebook" | "youtube" | "twitter" | "pinterest" | "linkedin" | "whatsapp";
  label: string;
  url: string;
  isActive: boolean;
}

export interface PaymentIconItem {
  id: string;
  name: string;
  code: "upi" | "gpay" | "phonepe" | "paytm" | "rupay" | "visa" | "mastercard" | "netbanking" | "cod" | "emi";
  isActive: boolean;
}

export interface TrustBadgeItem {
  id: string;
  icon: "Truck" | "ShieldCheck" | "RotateCcw" | "Headphones" | "Sparkles" | "Award";
  title: string;
  description: string;
  isActive: boolean;
}

export interface FooterContactInfo {
  showContact: boolean;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  workingHours: string;
}

export interface FooterAppDownload {
  showAppDownload: boolean;
  title: string;
  subtitle: string;
  ratingText: string;
  playStoreUrl: string;
  appStoreUrl: string;
  qrCodeUrl?: string;
}

export interface FooterNewsletter {
  showNewsletter: boolean;
  badge: string;
  title: string;
  subtitle: string;
  placeholder: string;
  buttonText: string;
  disclaimer: string;
}

export interface FooterBuilderConfig {
  id: string;
  showTrustBadges: boolean;
  showNewsletter: boolean;
  showContactInfo: boolean;
  showAppDownload: boolean;
  showSocialIcons: boolean;
  showPaymentIcons: boolean;
  copyrightText: string;
  legalNotice: string;
  trustBadges: TrustBadgeItem[];
  newsletter: FooterNewsletter;
  contactInfo: FooterContactInfo;
  appDownload: FooterAppDownload;
  columns: FooterColumn[];
  socialIcons: SocialIconItem[];
  paymentIcons: PaymentIconItem[];
  updatedAt?: string;
}

export const DEFAULT_FOOTER_CONFIG: FooterBuilderConfig = {
  id: "footer-builder-config",
  showTrustBadges: true,
  showNewsletter: true,
  showContactInfo: true,
  showAppDownload: true,
  showSocialIcons: true,
  showPaymentIcons: true,
  copyrightText: "© 2026 FancyHub.in — India's Premier Multi-Vendor Artisan Marketplace. All rights reserved.",
  legalNotice: "Registered with MSME, Startup India & GSTIN: 24AAACF1234F1Z5. Direct weaver & manufacturer delivery.",
  trustBadges: [
    {
      id: "trust-1",
      icon: "Truck",
      title: "2–4 Days Express Delivery",
      description: "Fast surface & air shipping across 28,000+ Indian PIN codes",
      isActive: true,
    },
    {
      id: "trust-2",
      icon: "ShieldCheck",
      title: "100% Safe Payments",
      description: "Encrypted Razorpay, PayU, UPI & Cash on Delivery",
      isActive: true,
    },
    {
      id: "trust-3",
      icon: "RotateCcw",
      title: "7-Day Easy Returns",
      description: "Instant doorstep pickup with instant wallet refunds",
      isActive: true,
    },
    {
      id: "trust-4",
      icon: "Headphones",
      title: "Dedicated Indian Care",
      description: "Multilingual support in Hindi, English, Bengali & Gujarati",
      isActive: true,
    },
  ],
  newsletter: {
    showNewsletter: true,
    badge: "EXCLUSIVE ₹500 WELCOME GIFT",
    title: "Join India's Fastest Growing Marketplace Club",
    subtitle: "Subscribe for curated handloom drops, weekly flash sales, festive coupon drops and artisan stories.",
    placeholder: "Enter your mobile number or email...",
    buttonText: "Claim ₹500 OFF",
    disclaimer: "No spam ever. Unsubscribe at any time with 1-click.",
  },
  contactInfo: {
    showContact: true,
    phone: "1800-890-3262 (Toll Free)",
    email: "care@fancyhub.in",
    whatsapp: "+91 98250 12345",
    address: "FancyHub Towers, Ring Road Textile Market, Surat, Gujarat - 395003, India",
    workingHours: "Monday to Sunday: 9:00 AM – 9:00 PM IST",
  },
  appDownload: {
    showAppDownload: true,
    title: "Shop On-The-Go with FancyHub App",
    subtitle: "Enjoy app-only 15% extra discounts, AR Saree drape preview & instant order tracking.",
    ratingText: "⭐ 4.8 / 5.0 (500K+ Downloads)",
    playStoreUrl: "https://play.google.com/store/apps/details?id=in.fancyhub.app",
    appStoreUrl: "https://apps.apple.com/in/app/fancyhub-artisan-shopping/id1234567890",
  },
  columns: [
    {
      id: "col-1",
      title: "About FancyHub",
      sortOrder: 0,
      isActive: true,
      links: [
        { id: "l-1", label: "About Us & Vision", url: "/p/about" },
        { id: "l-2", label: "Artisan & Weaver Stories", url: "/p/about" },
        { id: "l-3", label: "FancyHub Careers", url: "/p/about", badge: "Hiring" },
        { id: "l-4", label: "Press & Media Mentions", url: "/p/about" },
        { id: "l-5", label: "Sustainability & Handloom Pledge", url: "/p/about" },
      ],
    },
    {
      id: "col-2",
      title: "Customer Service",
      sortOrder: 1,
      isActive: true,
      links: [
        { id: "l-6", label: "Track Your Order", url: "/track-order" },
        { id: "l-7", label: "Returns & Refund Center", url: "/p/refund" },
        { id: "l-8", label: "Shipping Rates & ETAs", url: "/p/shipping" },
        { id: "l-9", label: "Help & FAQ Directory", url: "/help" },
        { id: "l-10", label: "Grievance Officer", url: "/p/contact" },
      ],
    },
    {
      id: "col-3",
      title: "Sell on FancyHub",
      sortOrder: 2,
      isActive: true,
      links: [
        { id: "l-11", label: "Become a Verified Vendor", url: "/vendor/register", badge: "0% Fee" },
        { id: "l-12", label: "Seller Login & ERP", url: "/vendor/login" },
        { id: "l-13", label: "Artisan Onboarding Guide", url: "/help" },
        { id: "l-14", label: "Commission & Payout Policy", url: "/p/terms" },
        { id: "l-15", label: "Vendor Success Stories", url: "/vendors" },
      ],
    },
    {
      id: "col-4",
      title: "Policies & Legal",
      sortOrder: 3,
      isActive: true,
      links: [
        { id: "l-16", label: "Privacy Policy", url: "/p/privacy-policy" },
        { id: "l-17", label: "Terms of Service", url: "/p/terms" },
        { id: "l-18", label: "Return & Cancellation Policy", url: "/p/refund" },
        { id: "l-19", label: "Security & Trust Compliance", url: "/p/privacy-policy" },
        { id: "l-20", label: "Intellectual Property Policy", url: "/p/terms" },
      ],
    },
    {
      id: "col-5",
      title: "Download App",
      sortOrder: 4,
      isActive: true,
      links: [
        { id: "l-21", label: "Android Play Store", url: "https://play.google.com", isNewTab: true },
        { id: "l-22", label: "iOS Apple App Store", url: "https://apple.com", isNewTab: true },
        { id: "l-23", label: "Custom Print Studio", url: "/custom-print", badge: "New" },
        { id: "l-24", label: "Festive Offers & Coupons", url: "/deals" },
        { id: "l-25", label: "Contact Support Team", url: "/p/contact" },
      ],
    },
  ],
  socialIcons: [
    { id: "soc-1", platform: "instagram", label: "Instagram", url: "https://instagram.com/fancyhub.in", isActive: true },
    { id: "soc-2", platform: "facebook", label: "Facebook", url: "https://facebook.com/fancyhub.in", isActive: true },
    { id: "soc-3", platform: "youtube", label: "YouTube", url: "https://youtube.com/@fancyhub", isActive: true },
    { id: "soc-4", platform: "twitter", label: "X (Twitter)", url: "https://x.com/fancyhub_in", isActive: true },
    { id: "soc-5", platform: "whatsapp", label: "WhatsApp Support", url: "https://wa.me/919825012345", isActive: true },
    { id: "soc-6", platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com/company/fancyhub", isActive: true },
  ],
  paymentIcons: [
    { id: "pay-1", name: "UPI (Google Pay, PhonePe, Paytm)", code: "upi", isActive: true },
    { id: "pay-2", name: "RuPay Cards", code: "rupay", isActive: true },
    { id: "pay-3", name: "Visa", code: "visa", isActive: true },
    { id: "pay-4", name: "MasterCard", code: "mastercard", isActive: true },
    { id: "pay-5", name: "Net Banking (50+ Banks)", code: "netbanking", isActive: true },
    { id: "pay-6", name: "Cash on Delivery", code: "cod", isActive: true },
    { id: "pay-7", name: "No-Cost EMI", code: "emi", isActive: true },
  ],
};
