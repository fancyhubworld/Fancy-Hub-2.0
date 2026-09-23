# FancyHub.in 2.0 — Dynamic Routing & Slug Management Specification

## 1. Centralized Route Registry (`src/lib/routes.ts`)
All business routes are defined centrally in `ROUTES` to ensure 100% type safety and zero hardcoded URLs:
- `/` — Homepage
- `/shop` — Global catalog
- `/category/[...slug]` — Dynamic deep category route (e.g. `/category/fashion/men/shirts`)
- `/product/[slug]` — Product details page (PDP)
- `/brand/[slug]` — Brand showcase page
- `/vendor/[slug]` — Vendor microsite storefront
- `/offers` — Promotional discount vouchers & offers
- `/flash-sale` — Ticking lightning deals
- `/cart`, `/checkout`, `/wishlist`, `/orders`, `/account`
- `/help`, `/about`, `/privacy-policy`, `/terms`, `/refund-policy`

## 2. Slug Validation & 301 Permanent Redirect Cascade
- Every category, product, vendor, and CMS page generates a URL-safe lowercase slug.
- When an admin renames any category slug in Admin ERP, the backend:
  1. Recursively updates all child subcategories' `fullPath`.
  2. Inserts rows into `CategoryRedirect` tracking the old paths.
  3. Returns `HTTP 301 Moved Permanently` to client requests on legacy URLs, preserving 100% SEO link juice.

## 3. Pre-Publish Route Health Auditor (`src/lib/route-manager-engine.ts`)
Before publishing website changes, the engine scans the database and flags:
- 404 Dead Links
- Exact Canonical URL collisions
- Missing / Unpublished draft pages
- Inactive categories
- Deleted / Archived products
- Circular redirect loops (`A <-> B`)
