# FancyHub.in 2.0 — REST API Specification

## 1. Authentication Endpoints (`/api/auth/*`)
- `POST /api/auth/login`: Unified login for Customers, Vendors, and Admins.
- `POST /api/auth/register`: Customer account creation with bonus loyalty points.
- `POST /api/auth/google`: One-Click Google OAuth token exchange & user sync.
- `POST /api/auth/otp/send`: Indian phone (+91) 6-digit OTP dispatch.
- `POST /api/auth/otp/verify`: Phone OTP verification and session issuance.
- `POST /api/auth/forgot-password`: 64-character cryptographic token generation.
- `POST /api/auth/reset-password`: Token validation and password reset.

## 2. Storefront Public APIs (`/api/public/*` & `/api/*`)
- `GET /api/categories`: Full category catalog.
- `GET /api/categories/tree`: Infinite nested category tree.
- `GET /api/categories/slug/[...slug]`: Deep category resolver with 301 redirect fallback.
- `GET /api/products`: Filterable catalog (search, sort, category, vendor, limit).
- `GET /api/public/theme`: Active theme tokens & CSS variables.
- `GET /api/public/header`: Dynamic header configuration.
- `GET /api/public/footer`: Dynamic footer configuration.
- `GET /api/public/page/[slug]`: Dynamic CMS page layout tree.
- `POST /api/orders`: Order placement and payment verification.

## 3. Vendor Portal APIs (`/api/vendor/*`)
- `POST /api/vendor/register`: Multi-step onboarding application.
- `GET /api/vendor/analytics/telemetry`: Real-time seller telemetry.
- `GET /api/vendor/analytics/price-intelligence`: Gemini AI price recommendations.
- `POST /api/vendor/store-design`: Storefront customization.

## 4. Admin ERP APIs (`/api/admin/*`)
- `POST /api/admin/vendors/[id]/approve`: KYC verification & vendor commission setup.
- `GET /api/admin/routes/audit`: Pre-publish 404, duplicate slug, and broken link audit.
- `POST /api/admin/routes/test`: Live single-route HTTP resolution emulator.
- `POST /api/admin/categories/bulk`: Bulk activation, deactivation, and safe delete.
- `GET /api/admin/website-control`: 9 core status cards & quick action telemetry.
