# FancyHub.in 2.0 — Database Schema & Entity Relationships

## 1. Overview
The database layer is managed via Prisma ORM supporting SQLite for local zero-config development and PostgreSQL for high-concurrency cloud production.

## 2. Core Relational Models

### 1. Identity & Multi-Tenancy
- **`User`**: Core identity (id, name, email, phone, passwordHash, role, isActive, isEmailVerified, isPhoneVerified, avatar, createdAt, updatedAt).
- **`Vendor`**: Multi-tenant merchant profile (id, userId, storeName, slug, businessType, panNumber, gstin, city, state, pincode, bankName, accountNumber, ifscCode, upiId, status, commissionRate, walletBalance).
- **`CustomerProfile`**: Loyalty points, wallet cashbacks, and customer preferences.
- **`Address`**: Multi-address book with Indian PIN code lookup.

### 2. Catalog & Taxonomy
- **`Category`**: Unlimited nested hierarchy (id, name, slug, fullPath, parentId, description, image, icon, sortOrder, status, isActive, seoTitle, seoDescription, createdAt, updatedAt).
- **`CategoryRedirect`**: 301/308 redirect history (id, sourcePath, destinationPath, categoryId).
- **`Product`**: Product catalog with SKU, pricing, MRP, discountPercent, stock, status, ratings, highlights, specifications.
- **`ProductImage`**: Cloud CDN asset links with sort order.
- **`ProductVariant`**: Color, size, SKU, stock, and price modifiers.
- **`Brand`**: Brand profiles and logo bindings.
- **`Tag`**: Taxonomy filtering tags.

### 3. Orders & Commerce
- **`Order`**: Order header with totalAmount, taxAmount, shippingAmount, status, paymentStatus, paymentMethod, trackingNumber.
- **`OrderItem`**: Item line records with unitPrice, quantity, and vendor attribution.
- **`Payment`**: Multi-gateway transaction logs (Razorpay, PhonePe, Cashfree, COD).
- **`Coupon`**: Discount vouchers (Percentage, Fixed, Free Shipping).
- **`Review`**: 5-star customer feedback and photo uploads.
- **`Wishlist` & `Cart`**: Customer shopping sessions.

### 4. CMS, Layout & Theme Engine
- **`PageConfig`**: CMS Pages (id, title, slug, status, layoutType, seoTitle, seoDescription).
- **`PageVersion`**: Immutable revision snapshot history.
- **`SectionConfig` & `WidgetInstance`**: Modular layout sections and interactive widget definitions.
- **`ThemeConfig` & `ThemeVersion`**: 15 global color tokens, typography scales, card presets, and glassy settings.
- **`SystemConfig`**: Key-value system storage for header, footer, payment, and media configurations.
- **`AuditLog`**: Security audit logs recording user, action, entity, diff, and timestamps.
