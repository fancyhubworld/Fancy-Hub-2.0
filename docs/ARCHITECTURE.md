# FancyHub.in 2.0 — Production Architecture Specification

## 1. System Overview
FancyHub.in 2.0 is an enterprise multi-tenant Indian e-commerce marketplace built on Next.js 14 (App Router), Prisma ORM, TypeScript, Tailwind CSS, and Edge-optimized API handlers.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 🏛️ FANCYHUB.IN 2.0 — MULTI-TIER SYSTEM ARCHITECTURE                                    │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   [ADMIN ERP]               [VENDOR PORTAL]             [CUSTOMER STOREFRONT]          │
│   • Website Control Center   • Multi-Tenant Dashboard   • PWA / Responsive Web App     │
│   • Theme Studio             • Catalog CRUD & Inventory • Multi-Tier Mega Menu         │
│   • Visual Page Builder      • Order Fulfillment        • Instant Cart & 1-Click Buy   │
│   • RBAC & Security Audit    • Telemetry & AI Pricing   • INR Multi-Gateway Payments   │
│             │                       │                               │                  │
│             └───────────────────────┼───────────────────────────────┘                  │
│                                     ▼                                                  │
│                       [CENTRALIZED ROUTE & API LAYER]                                  │
│                       • /api/auth, /api/public, /api/admin                             │
│                       • Type-Safe Route Registry (`src/lib/routes.ts`)                 │
│                       • Pre-Publish Route Health Auditor                               │
│                                     │                                                  │
│                                     ▼                                                  │
│                       [DATABASE & PRISMA ORM ENGINE]                                   │
│                       • PostgreSQL / SQLite Dual Compatibility                         │
│                       • Immutable Versioning & Audit Ledger                            │
│                       • Automatic 301 Permanent Redirect Cascade                       │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

## 2. Core Architectural Principles
1. **Database-First**: All storefront menus, widgets, design tokens, category hierarchies, and pages are driven by relational database records.
2. **Zero Hardcoded URLs**: Centralized route resolution in `src/lib/routes.ts` prevents dead links across Desktop, Tablet, and Mobile.
3. **Migration-Safe**: No destructive database modifications. All schema updates utilize forward-compatible Prisma migrations.
4. **Resilient Fallbacks**: Cold-boot fallbacks and error boundaries ensure no customer ever experiences a blank or crashed page.
