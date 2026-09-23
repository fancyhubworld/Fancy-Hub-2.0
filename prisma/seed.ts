import { PrismaClient } from "@prisma/client";
import { CATEGORIES_DATA, VENDORS_DATA, PRODUCTS_DATA, BANNERS_DATA, COUPONS_DATA, CUSTOM_PRINT_TEMPLATES } from "../src/data/mock-catalog";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting FancyHub.in Database Seeding...");

  // 1. Seed Categories with fullPath & unlimited hierarchy support
  for (const cat of CATEGORIES_DATA) {
    const parentFullPath = cat.slug;
    const parent = await prisma.category.upsert({
      where: { fullPath: parentFullPath },
      update: {
        name: cat.name,
        slug: cat.slug,
        fullPath: parentFullPath,
        description: cat.description,
        icon: cat.icon,
        image: cat.image,
        isFeatured: cat.isFeatured ?? false,
        showInHeader: true,
        showOnHomepage: true,
        showInMobile: true,
        status: "ACTIVE",
        level: 0,
        sortOrder: cat.sortOrder ?? 0,
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        fullPath: parentFullPath,
        description: cat.description,
        icon: cat.icon,
        image: cat.image,
        isFeatured: cat.isFeatured ?? false,
        showInHeader: true,
        showOnHomepage: true,
        showInMobile: true,
        status: "ACTIVE",
        level: 0,
        sortOrder: cat.sortOrder ?? 0,
      },
    });

    if (cat.subcategories && cat.subcategories.length > 0) {
      for (const sub of cat.subcategories) {
        const subFullPath = `${parentFullPath}/${sub.slug}`;
        await prisma.category.upsert({
          where: { fullPath: subFullPath },
          update: {
            name: sub.name,
            slug: sub.slug,
            fullPath: subFullPath,
            parentId: parent.id,
            level: 1,
            status: "ACTIVE",
            showInHeader: true,
            showOnHomepage: true,
            showInMobile: true,
          },
          create: {
            id: sub.id,
            name: sub.name,
            slug: sub.slug,
            fullPath: subFullPath,
            parentId: parent.id,
            level: 1,
            status: "ACTIVE",
            showInHeader: true,
            showOnHomepage: true,
            showInMobile: true,
          },
        });
      }
    }
  }
  console.log("✅ Categories seeded");

  // 2. Seed Default Admin, Vendors & Users
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@fancyhub.in" },
    update: {},
    create: {
      email: "admin@fancyhub.in",
      name: "FancyHub Administrator",
      passwordHash: "hash_admin_fancyhub_secure_2026",
      role: "ADMIN",
      isEmailVerified: true,
      phone: "+91 98000 00001",
    },
  });

  const demoCustomer = await prisma.user.upsert({
    where: { email: "customer@fancyhub.in" },
    update: {},
    create: {
      email: "customer@fancyhub.in",
      name: "Rahul Sharma",
      passwordHash: "hash_rahul_customer_2026",
      role: "CUSTOMER",
      isEmailVerified: true,
      phone: "+91 98300 12345",
      customerProfile: {
        create: {
          preferredPincode: "700023",
          loyaltyPoints: 350,
          referralCode: "RAHUL77",
        },
      },
      wallet: {
        create: {
          balance: 750.0,
        },
      },
      addresses: {
        create: {
          name: "Rahul Sharma",
          phone: "+91 98300 12345",
          street: "Flat 4B, Silver Oak Heights",
          landmark: "Near Diamond Plaza",
          area: "Hastings",
          city: "Kolkata",
          state: "West Bengal",
          pincode: "700023",
          type: "Home",
          isDefault: true,
        },
      },
    },
  });

  // Seed Vendors
  for (const v of VENDORS_DATA) {
    const vendorEmail = `${v.slug}@fancyhub.in`;
    const user = await prisma.user.upsert({
      where: { email: vendorEmail },
      update: {},
      create: {
        email: vendorEmail,
        name: v.businessName,
        passwordHash: "hash_vendor_pass_2026",
        role: "VENDOR",
        phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
      },
    });

    await prisma.vendor.upsert({
      where: { slug: v.slug },
      update: {
        storeName: v.storeName,
        storeDescription: v.storeDescription,
        storeLogo: v.storeLogo,
        storeBanner: v.storeBanner,
        businessName: v.businessName,
        city: v.city,
        state: v.state,
        pincode: v.pincode,
        address: v.address,
        isVerified: v.isVerified,
        rating: v.rating,
        reviewCount: v.reviewCount,
        followerCount: v.followerCount,
        planName: v.planName,
        commissionRate: v.commissionRate,
        totalSales: v.totalSales,
        walletBalance: v.walletBalance,
        pendingBalance: v.pendingBalance,
        withdrawnTotal: v.withdrawnTotal,
      },
      create: {
        id: v.id,
        userId: user.id,
        storeName: v.storeName,
        slug: v.slug,
        storeDescription: v.storeDescription,
        storeLogo: v.storeLogo,
        storeBanner: v.storeBanner,
        businessName: v.businessName,
        businessType: v.businessType,
        panNumber: v.panNumber,
        gstin: v.gstin,
        city: v.city,
        state: v.state,
        pincode: v.pincode,
        address: v.address,
        isVerified: v.isVerified,
        rating: v.rating,
        reviewCount: v.reviewCount,
        followerCount: v.followerCount,
        planName: v.planName,
        commissionRate: v.commissionRate,
        totalSales: v.totalSales,
        walletBalance: v.walletBalance,
        pendingBalance: v.pendingBalance,
        withdrawnTotal: v.withdrawnTotal,
      },
    });
  }
  console.log("✅ Vendors seeded");

  // 3. Seed Products & Variants
  for (const p of PRODUCTS_DATA) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        sku: p.sku,
        shortDescription: p.shortDescription,
        description: p.description,
        price: p.price,
        mrp: p.mrp,
        discountPercent: p.discountPercent,
        taxRate: p.taxRate,
        stock: p.stock,
        isFeatured: p.isFeatured,
        isFlashDeal: p.isFlashDeal,
        flashPrice: p.flashPrice,
        ratings: p.ratings,
        reviewCount: p.reviewCount,
        soldCount: p.soldCount,
        deliveryDays: p.deliveryDays,
        codAvailable: p.codAvailable,
        highlights: JSON.stringify(p.highlights || []),
        specifications: JSON.stringify(p.specifications || {}),
        tags: (p.tags || []).join(","),
      },
      create: {
        id: p.id,
        title: p.title,
        slug: p.slug,
        sku: p.sku,
        shortDescription: p.shortDescription,
        description: p.description,
        price: p.price,
        mrp: p.mrp,
        discountPercent: p.discountPercent,
        taxRate: p.taxRate,
        stock: p.stock,
        isFeatured: p.isFeatured,
        isFlashDeal: p.isFlashDeal,
        flashPrice: p.flashPrice,
        ratings: p.ratings,
        reviewCount: p.reviewCount,
        soldCount: p.soldCount,
        deliveryDays: p.deliveryDays,
        codAvailable: p.codAvailable,
        highlights: JSON.stringify(p.highlights || []),
        specifications: JSON.stringify(p.specifications || {}),
        tags: (p.tags || []).join(","),
        vendorId: p.vendorId,
        categoryId: p.categoryId,
      },
    });

    // Seed Images
    for (const img of p.images) {
      await prisma.productImage.upsert({
        where: { id: img.id },
        update: {
          url: img.url,
          alt: img.alt,
          isPrimary: img.isPrimary,
          sortOrder: img.sortOrder,
          productId: product.id,
        },
        create: {
          id: img.id,
          url: img.url,
          alt: img.alt,
          isPrimary: img.isPrimary,
          sortOrder: img.sortOrder,
          productId: product.id,
        },
      });
    }

    // Seed Variants
    for (const varItem of p.variants) {
      await prisma.productVariant.upsert({
        where: { sku: varItem.sku },
        update: {},
        create: {
          id: varItem.id,
          sku: varItem.sku,
          title: varItem.title,
          size: varItem.size,
          color: varItem.color,
          colorHex: varItem.colorHex,
          price: varItem.price,
          mrp: varItem.mrp,
          stock: varItem.stock,
          productId: product.id,
        },
      });
    }
  }
  console.log("✅ Products & Variants seeded");

  // 4. Seed Banners, Coupons, Custom Print
  for (const b of BANNERS_DATA) {
    await prisma.banner.upsert({
      where: { id: b.id },
      update: {},
      create: {
        id: b.id,
        title: b.title,
        subtitle: b.subtitle,
        badgeText: b.badgeText,
        ctaText: b.ctaText,
        ctaLink: b.ctaLink,
        imageUrl: b.imageUrl,
        bgColor: b.bgColor,
        device: b.device,
        position: b.position,
        discountTag: b.discountTag,
        sortOrder: b.sortOrder,
        isActive: b.isActive,
      },
    });
  }

  for (const c of COUPONS_DATA) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: {},
      create: {
        id: c.id,
        code: c.code,
        title: c.title,
        description: c.description,
        type: c.type,
        value: c.value,
        minOrderValue: c.minOrderValue,
        maxDiscount: c.maxDiscount,
        expiresAt: new Date(c.expiresAt),
        isActive: c.isActive,
      },
    });
  }

  for (const cp of CUSTOM_PRINT_TEMPLATES) {
    await prisma.customPrintProduct.upsert({
      where: { slug: cp.slug },
      update: {},
      create: {
        id: cp.id,
        name: cp.name,
        slug: cp.slug,
        category: cp.category,
        basePrice: cp.basePrice,
        mrp: cp.mrp,
        mockupFrontUrl: cp.mockupFrontUrl,
        availableColors: JSON.stringify(cp.availableColors),
        availableSizes: JSON.stringify(cp.availableSizes),
        description: cp.description,
      },
    });
  }

  // 6. Seed Baseline API Integrations (with encrypted credentials at rest)
  const defaultIntegrations = [
    {
      id: "int-razorpay",
      name: "Razorpay Payment Gateway",
      category: "PAYMENTS",
      provider: "RAZORPAY",
      environment: "DEVELOPMENT",
      mode: "TEST",
      status: "ACTIVE",
      baseUrl: "https://api.razorpay.com/v1",
      sandboxUrl: "https://api.razorpay.com/v1",
      apiVersion: "v1",
      credentials: { keyId: "rzp_test_51FancyHub2026", keySecret: "secret_sample_test_key_fh_2026", merchantName: "FancyHub Marketplace" },
      publicSettings: { currency: "INR", capturePayment: true },
      webhookUrl: "https://fancyhub.in/api/webhooks/razorpay",
      webhookEvents: ["payment.captured", "payment.failed", "order.paid"],
      lastTestStatus: "CONNECTED",
      lastResponseTimeMs: 142,
    },
    {
      id: "int-google-oauth",
      name: "Google OAuth 2.0 Login",
      category: "GOOGLE",
      provider: "GOOGLE_OAUTH",
      environment: "DEVELOPMENT",
      mode: "TEST",
      status: "ACTIVE",
      baseUrl: "https://accounts.google.com",
      apiVersion: "v2",
      credentials: { clientId: "1098273645-fancyhub.apps.googleusercontent.com", clientSecret: "GOCSPX-SampleSecretKey2026", redirectUri: "https://fancyhub.in/api/auth/callback/google" },
      publicSettings: { autoPrompt: true },
      lastTestStatus: "CONNECTED",
      lastResponseTimeMs: 98,
    },
    {
      id: "int-google-maps",
      name: "Google Maps Platform",
      category: "GOOGLE",
      provider: "GOOGLE_MAPS",
      environment: "DEVELOPMENT",
      mode: "TEST",
      status: "ACTIVE",
      baseUrl: "https://maps.googleapis.com/maps/api",
      apiVersion: "v3",
      credentials: { browserApiKey: "AIzaSyDemoBrowserKeyFancyHub2026", serverApiKey: "AIzaSyDemoServerKeyFancyHub2026", enablePlaces: "true" },
      publicSettings: { defaultCenter: { lat: 21.1702, lng: 72.8311 } },
      lastTestStatus: "CONNECTED",
      lastResponseTimeMs: 115,
    },
    {
      id: "int-smtp-email",
      name: "SMTP & Transactional Email",
      category: "COMMUNICATION",
      provider: "SMTP",
      environment: "DEVELOPMENT",
      mode: "TEST",
      status: "ACTIVE",
      baseUrl: "smtp.sendgrid.net",
      apiVersion: "v3",
      credentials: { host: "smtp.sendgrid.net", port: 587, username: "apikey", password: "SG.sample_sendgrid_token_2026", fromEmail: "orders@fancyhub.in", fromName: "FancyHub India" },
      publicSettings: { enableTls: true },
      lastTestStatus: "CONNECTED",
      lastResponseTimeMs: 130,
    },
    {
      id: "int-gemini-ai",
      name: "Google Gemini AI Engine",
      category: "AI",
      provider: "GEMINI_AI",
      environment: "DEVELOPMENT",
      mode: "TEST",
      status: "ACTIVE",
      baseUrl: "https://generativelanguage.googleapis.com/v1beta",
      apiVersion: "v1beta",
      credentials: { apiKey: "AIzaSyDemoGeminiKeyFancyHub2026", modelName: "gemini-1.5-flash", maxOutputTokens: 2048 },
      publicSettings: { temperature: 0.7 },
      lastTestStatus: "CONNECTED",
      lastResponseTimeMs: 82,
    },
    {
      id: "int-payu",
      name: "PayU Payment Gateway",
      category: "PAYMENTS",
      provider: "PAYU",
      environment: "DEVELOPMENT",
      mode: "TEST",
      status: "NOT_CONFIGURED",
      baseUrl: "https://secure.payu.in",
      sandboxUrl: "https://test.payu.in",
      apiVersion: "v1",
      credentials: {},
      publicSettings: { currency: "INR" },
    },
    {
      id: "int-sms-msg91",
      name: "SMS Gateway (MSG91 / Twilio)",
      category: "COMMUNICATION",
      provider: "SMS_GATEWAY",
      environment: "DEVELOPMENT",
      mode: "TEST",
      status: "NOT_CONFIGURED",
      baseUrl: "https://api.msg91.com/api/v5",
      apiVersion: "v5",
      credentials: {},
      publicSettings: { senderId: "FNCYHB" },
    },
    {
      id: "int-shipping-shiprocket",
      name: "Shipping & Courier Logistics (Shiprocket)",
      category: "SHIPPING",
      provider: "SHIPROCKET",
      environment: "DEVELOPMENT",
      mode: "TEST",
      status: "NOT_CONFIGURED",
      baseUrl: "https://apiv2.shiprocket.in/v1",
      apiVersion: "v1",
      credentials: {},
      publicSettings: { autoSyncTracking: true },
    },
    {
      id: "int-storage-s3",
      name: "AWS S3 / Cloudinary Storage",
      category: "STORAGE",
      provider: "AWS_S3",
      environment: "DEVELOPMENT",
      mode: "TEST",
      status: "ACTIVE",
      baseUrl: "https://s3.ap-south-1.amazonaws.com",
      apiVersion: "2006-03-01",
      credentials: { bucket: "fancyhub-media-prod", region: "ap-south-1", accessKeyId: "AKIAIOSFODNN7EXAMPLE", secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" },
      publicSettings: { cdnDomain: "https://cdn.fancyhub.in" },
      lastTestStatus: "CONNECTED",
      lastResponseTimeMs: 105,
    },
    {
      id: "int-meta-pixel",
      name: "Meta Pixel & Conversion API",
      category: "ANALYTICS",
      provider: "META_PIXEL",
      environment: "DEVELOPMENT",
      mode: "TEST",
      status: "ACTIVE",
      baseUrl: "https://graph.facebook.com/v19.0",
      apiVersion: "v19.0",
      credentials: { pixelId: "123456789012345", accessToken: "EAAG...sample_meta_token" },
      publicSettings: { advancedMatching: true },
      lastTestStatus: "CONNECTED",
      lastResponseTimeMs: 92,
    },
  ];

  // Import encrypt helper inline
  const cryptoModule = await import("crypto");
  const masterKey = cryptoModule.createHash("sha256").update(process.env.API_ENCRYPTION_MASTER_KEY || "fancyhub-master-api-encryption-key-aes256gcm-2026-production").digest();

  function seedEncrypt(data: any) {
    const plainText = JSON.stringify(data);
    const iv = cryptoModule.randomBytes(12);
    const cipher = cryptoModule.createCipheriv("aes-256-gcm", masterKey, iv);
    let enc = cipher.update(plainText, "utf8", "hex");
    enc += cipher.final("hex");
    const tag = cipher.getAuthTag().toString("hex");
    return `${iv.toString("hex")}:${tag}:${enc}`;
  }

  for (const item of defaultIntegrations) {
    const encryptedCredentials = seedEncrypt(item.credentials);
    const existing = await prisma.apiIntegration.findUnique({ where: { id: item.id } });
    if (!existing) {
      await prisma.apiIntegration.create({
        data: {
          id: item.id,
          name: item.name,
          category: item.category,
          provider: item.provider,
          environment: item.environment,
          mode: item.mode,
          status: item.status,
          baseUrl: item.baseUrl,
          sandboxUrl: item.sandboxUrl || null,
          apiVersion: item.apiVersion,
          encryptedCredentials,
          publicSettings: JSON.stringify(item.publicSettings),
          webhookUrl: item.webhookUrl || null,
          webhookEvents: item.webhookEvents ? JSON.stringify(item.webhookEvents) : null,
          lastTestedAt: new Date(),
          lastTestStatus: item.lastTestStatus,
          lastResponseTimeMs: item.lastResponseTimeMs,
        },
      });
    }
  }

  console.log("🎉 Database Seeding Complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
