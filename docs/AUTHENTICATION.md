# FancyHub.in 2.0 — Authentication & Role-Based Access Control (RBAC)

## 1. Multi-Role Identity Hierarchy
FancyHub 2.0 defines 7 hierarchical user roles:
1. `SUPER_ADMIN` (Level 7) — Full platform access, security logs, system settings.
2. `ADMIN` (Level 6) — Catalog, vendors, themes, pages, orders, reviews.
3. `FINANCE` (Level 5) — Payouts, commissions, transaction audits.
4. `SUPPORT` (Level 4) — Customer queries, return requests, dispute handling.
5. `VENDOR` (Level 3) — Store management, product upload, fulfillment.
6. `VENDOR_STAFF` (Level 2) — Inventory updates and shipment packing.
7. `CUSTOMER` (Level 1) — Storefront shopping, orders, wishlist, wallet.

## 2. Customer Authentication Suite
- **Email & Password**: Salted PBKDF2/bcrypt password hashing (`hashPassword`, `verifyPassword`).
- **Google OAuth**: One-Click sign-in token exchange and account auto-provisioning.
- **Indian Phone OTP**: 6-digit cryptographic OTP generation with `+91` normalizer, 3-minute TTL, and replay protection.
- **Password Recovery**: 64-character cryptographic token generation with 1-hour expiry.

## 3. Vendor Onboarding Lifecycle
- **Step 1: Registration**: Owner details, store name, PAN, GSTIN, Bank IFSC, City/State/Pincode (`POST /api/vendor/register`).
- **Step 2: Verification**: Admin KYC review in `/admin/vendors/[id]`.
- **Step 3: Approval**: State transition from `PENDING` → `APPROVED` (`POST /api/admin/vendors/[id]/approve`).
- **Step 4: Active Store**: Vendor accesses `/vendor/dashboard`.
