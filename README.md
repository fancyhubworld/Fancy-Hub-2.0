# FancyHub.in — Complete Full-Stack Multi-Vendor E-Commerce Platform & PWA

**Tagline:** *Shop More, Pay Less*  
**Platform Version:** `2.0.0` (Production Ready)  
**Target Market:** Indian Multi-Vendor Marketplace & Direct Weaver / Creator Commerce

---

## 🌟 Overview & Architecture

FancyHub.in is a high-performance, accessible, and scalable Indian multi-vendor marketplace application built with **Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Prisma ORM, and Recharts**.

### Core Pillars:
1. **Customer Marketplace (`/`, `/shop`, `/product/[slug]`, `/category/[slug]`, `/cart`, `/checkout`, `/custom-print`)**
   - Responsive Header with Indian PIN code delivery auto-detection & dynamic ETA calculations (2–4 days across India).
   - Instant Search Autocomplete with Voice Search and Visual Camera search triggers.
   - Live Flash Deals with real-time countdown timer (`02:45:18`), stock progress bars, and discount percentages.
   - Dynamic variant selectors (color swatches & size chips) with live price/stock synchronization.
   - Multi-Vendor Cart grouping items by verified seller with seller-level sub-totals and express shipping.
   - Frictionless Indian Checkout supporting Razorpay, PayU, UPI QR/ID, Cards, NetBanking, and COD with 7-day return guarantee.
   - Interactive **Custom Print Studio** for live designing of T-Shirts, Hoodies, Mugs, and Phone Cases with DTG print mockup previews.

2. **Vendor Portal (`/vendor/dashboard`, `/vendor/products`, `/vendor/orders`, `/vendor/withdraw`, `/vendor/coupons`)**
   - Deep Navy Sidebar (`#0B2A63`) and mobile-optimized bottom navigation.
   - Live KPI cards for Total Sales, Orders, Views, and Customers with percentage growth indicators.
   - Recharts interactive Sales & Revenue analytics with time-range filtering (7 Days, 30 Days).
   - Multi-vendor Sub-Order fulfillment with packing slips and Delhivery/Blue Dart tracking assignment.
   - Dokan-style wallet and withdrawal request engine with UTR reference tracking.

3. **Admin ERP Console (`/admin/dashboard`, `/admin/vendors`, `/admin/categories`, `/admin/payouts`, `/admin/homepage`, `/admin/settings`)**
   - Super Admin oversight on platform GMV, Net commissions, active merchants, and pending payouts.
   - Vendor KYC & GSTIN verification workflows.
   - Hierarchical category builder and Visual Homepage CMS block manager.
   - Platform tax (GST) and payment gateway configuration.

4. **Progressive Web App (PWA) & Technical SEO**
   - Web App Manifest (`manifest.json`) and Service Worker (`sw.js`) with offline caching shell.
   - Dynamic JSON-LD structured data schemas for `Product`, `Offer`, and `AggregateRating`.
   - `sitemap.xml` and `robots.txt` compliant with modern search engine standards.

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher

### 2. Install Dependencies
```bash
npm install
```

### 3. Initialize & Seed Database
```bash
npx prisma db push
npm run db:seed
```

### 4. Run Automated Test Suite
```bash
npm test
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated Testing
Run the comprehensive test suite validating PIN code lookups, currency formatting, savings calculations, order splitting, and coupon rules:
```bash
npx tsx test/run-tests.ts
```

---

## 🐳 Docker Deployment
Build and run via Docker Compose:
```bash
docker-compose up -d --build
```

---

## 📄 License & Compliance
© 2026 FancyHub.in — All Rights Reserved. Built with standard Indian GST compliance, 256-bit SSL encryption, and WCAG 2.2 AA accessibility guidelines.
# Fancy-Hub-2.0
# Fancy-Hub-2.0
