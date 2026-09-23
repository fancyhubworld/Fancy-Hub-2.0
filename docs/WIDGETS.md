# FancyHub.in 2.0 — Widget Builder & Dispatcher Specification

## 1. Overview
The Widget Builder system (`src/lib/widget-registry.ts`, `WidgetDispatcher.tsx`) allows admins to assemble pages using 20+ modular interactive widgets.

## 2. Core Widget Catalog
1. `HERO_SLIDER` — Full-width festive carousel with CTA buttons.
2. `PROMO_BANNER` — Split-column promotional tile strips.
3. `CATEGORY_GRID` — Visual tile grid of department categories.
4. `PRODUCT_GRID` — Multi-column catalog grid with quick Add-to-Cart.
5. `PRODUCT_SLIDER` — Touch-friendly horizontal swiper carousel.
6. `FLASH_DEALS` — Ticking lightning sales with stock progress bars.
7. `COUNTDOWN_TIMER` — Standalone countdown clock for festive events.
8. `TRUST_BADGES` — 4-pillar assurance strip.
9. `VENDOR_GRID` — Spotlight on verified master weavers and brands.
10. `BRAND_LOGOS` — Official brand partner carousel.
11. `REVIEWS` & `TESTIMONIALS` — 5-star customer feedback with photos.
12. `FAQ` — Smooth animated collapsible Q&A accordion.
13. `BLOG_POSTS` — Editorial loom heritage stories and style guides.
14. `NEWSLETTER` — Lead generation card with ₹500 OFF voucher code.
15. `SHOPPABLE_REELS` — Short-form vertical video commerce player.
16. `SPIN_WHEEL` & `SCRATCH_CARD` — Gamified festive conversion tools.
17. `GROUP_BUYING` — WhatsApp group buying & wholesale tier discounts.

## 3. 7 Configuration Dimensions per Widget
- **Data Source**: `PRODUCTS`, `CATEGORIES`, `VENDORS`, `BLOGS`, `STATIC`.
- **Style**: Background colors, gradients, padding, corner radius, glassy blur.
- **Layout**: Container constraints (Boxed, Wide, Full Width), gap spacing.
- **Desktop Settings**: 3 to 6 columns.
- **Tablet Settings**: 2 to 4 columns.
- **Mobile Settings**: 1 to 2 columns (Grid vs Carousel).
- **Visibility Rules**: Device toggles, user role targeting, and campaign start/end dates.
