# FancyHub.in 2.0 — Admin ERP & Website Control Center Specification

## 1. Structure
The Admin ERP is organized into 5 major operational control systems:
1. **Website Control Center (`/admin/website-control`)**: 9 core telemetry cards (Status, Theme, Drafts, Scheduled, Broken Links, SEO, Performance, Active Pages, Widgets) + 7 Quick Actions.
2. **Theme Studio (`/admin/theme-studio`)**: 15 Global Color Tokens, Typography, Button/Card builders, Glassy Mode fine-tuning, and live preview.
3. **Visual Page Builder (`/admin/visual-builder`)**: Drag-and-drop 5-tier layout editor (`Page → Section → Row → Column → Widget`).
4. **Navigation Manager (`/admin/menus`, `/admin/header-builder`, `/admin/footer-builder`)**: Menu tree editor, Mega Menu generator, and footer columns.
5. **Global Settings (`/admin/settings`, `/admin/redirects`, `/admin/theme-versions`)**: SEO defaults, 301 redirects ledger, security logs, and 1-click rollback restoration.

## 2. 16 Granular Admin Permissions
- `MANAGE_USERS`, `MANAGE_VENDORS`, `MANAGE_PRODUCTS`, `MANAGE_CATEGORIES`
- `MANAGE_ORDERS`, `MANAGE_COUPONS`, `MANAGE_PAGES`, `MANAGE_WIDGETS`
- `MANAGE_THEMES`, `MANAGE_NAVIGATION`, `MANAGE_MEDIA`, `MANAGE_SEO`
- `MANAGE_SETTINGS`, `MANAGE_PAYMENTS`, `MANAGE_SHIPPING`, `VIEW_ANALYTICS`
