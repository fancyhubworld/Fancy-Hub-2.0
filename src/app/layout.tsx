import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { MarketplaceProvider } from "@/lib/context";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { QuickViewModal } from "@/components/products/QuickViewModal";

export const viewport: Viewport = {
  themeColor: "#1455D9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "FancyHub.in — India's Multi-Vendor Marketplace | Shop More, Pay Less",
  description:
    "Buy authentic Indian ethnic fashion, smartphones, ANC audio gadgets, solid wood home decor & custom printed apparel directly from 5,000+ verified Indian weavers and manufacturers.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
  keywords: [
    "FancyHub",
    "Indian marketplace",
    "Banarasi sarees",
    "ANC earbuds",
    "custom print tshirts",
    "multi-vendor ecommerce India",
    "online shopping India",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://fancyhub.in",
    siteName: "FancyHub.in",
    title: "FancyHub.in — Shop More, Pay Less",
    description: "India's trusted multi-vendor marketplace with 2-4 days express delivery & 100% verified sellers.",
  },
};

import { CategoryProvider } from "@/lib/use-categories";
import { ThemeProvider } from "@/lib/theme-context";
import { MarketingPopupModal } from "@/components/marketing/MarketingPopupModal";
import { StorefrontAiAssistant } from "@/components/ui/StorefrontAiAssistant";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FancyHub" />
      </head>
      <body className="min-h-screen flex flex-col justify-between bg-slate-50 antialiased font-sans">
        <ThemeProvider>
          <MarketplaceProvider>
            <CategoryProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <QuickViewModal />
              <MarketingPopupModal />
              <StorefrontAiAssistant />
              <MobileBottomNav />
              <Footer />
            </CategoryProvider>
          </MarketplaceProvider>
        </ThemeProvider>

        {/* PWA Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('FancyHub PWA ServiceWorker registered with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('FancyHub PWA ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
