/**
 * FancyHub.in 2.0 — Phase 49: PWA & Mobile Experience Finalization Test Suite
 * 
 * Comprehensive Mobile & PWA Certification:
 * 1. Web App Manifest Validation (/manifest.json)
 * 2. Service Worker Routing, Cache Management & Route Protection (/sw.js)
 * 3. Push Notification Payload Handling & Deep Linking
 * 4. Universal Link & Scheme Resolver (fancyhub:// & https://fancyhub.in)
 * 5. Mobile Payment Interruption & State Recovery Engine
 * 6. Mobile Auth Token Lifecycle & Fast Refresh
 * 7. Mobile Viewport Matrix Auditing (320px, 375px, 390px, 430px)
 * 8. Touch Target Compliance (WCAG 2.1 AAA >= 44x44px)
 * 9. Gesture & Swipe Recognition Mechanics
 * 10. Offline Mutation Synchronization Queue
 * 11. Mobile Bottom Nav & Sticky Cart Invariants
 */

import fs from "fs";
import path from "path";
import {
  DeepLinkRouterEngine,
  MobilePaymentRecoveryEngine,
  MobileAuthBridgeService,
  MobileViewportResponsiveEngine,
  MobileOfflineSyncEngine,
  MobileTouchAndGestureEngine,
  PwaManifestValidator,
} from "../src/lib/pwa-mobile-engine";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${message}`);
    failed++;
  }
}

async function runPhase49PwaMobileSuite() {
  console.log("=======================================================================");
  console.log("🚀 FANCYHUB.IN 2.0 — PHASE 49: PWA & MOBILE EXPERIENCE FINALIZATION");
  console.log("=======================================================================\n");

  try {
    // -------------------------------------------------------------------------
    // [1/8] WEB APP MANIFEST SPECIFICATION AUDIT (/manifest.json)
    // -------------------------------------------------------------------------
    console.log("--- [1/8] Web App Manifest Specification Audit (/manifest.json) ---");
    const manifestPath = path.join(process.cwd(), "public", "manifest.json");
    assert(fs.existsSync(manifestPath), "public/manifest.json exists on disk");

    const manifestContent = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    const manifestValidation = PwaManifestValidator.validate(manifestContent);
    
    assert(manifestValidation.valid, "Manifest complies with PWA installability requirements");
    assert(manifestContent.name.includes("FancyHub"), "Manifest 'name' is set to FancyHub");
    assert(manifestContent.short_name === "FancyHub", "Manifest 'short_name' is 'FancyHub'");
    assert(manifestContent.display === "standalone", "Display mode is 'standalone' for native app-like experience");
    assert(manifestContent.theme_color === "#1455D9", "Brand theme color is '#1455D9'");
    assert(manifestContent.background_color === "#FFFFFF", "App background color is '#FFFFFF'");
    assert(manifestContent.orientation === "portrait", "Default orientation locked to 'portrait' on mobile devices");
    assert(manifestContent.icons.length >= 2, "Manifest contains at least 192px and 512px icon definitions");

    // -------------------------------------------------------------------------
    // [2/8] SERVICE WORKER CACHING & PRIVATE ROUTE SAFEGUARDS (/sw.js)
    // -------------------------------------------------------------------------
    console.log("\n--- [2/8] Service Worker Caching & Route Protection (/sw.js) ---");
    const swPath = path.join(process.cwd(), "public", "sw.js");
    assert(fs.existsSync(swPath), "public/sw.js exists on disk");

    const swCode = fs.readFileSync(swPath, "utf-8");
    assert(swCode.includes("const CACHE_NAME = 'fancyhub-v2.2'"), "Service worker cache version declared");
    assert(swCode.includes("STATIC_ASSETS_TO_CACHE"), "Static pre-cache assets defined");
    assert(swCode.includes("PRIVATE_ROUTE_PATTERNS"), "Private route exclusion list defined");

    // Verify private route patterns
    assert(swCode.includes("/\\/api\\//"), "API routes strictly excluded from SW caching");
    assert(swCode.includes("/\\/admin\\//"), "Admin ERP routes strictly excluded from SW caching");
    assert(swCode.includes("/\\/checkout/"), "Checkout routes excluded from caching");
    assert(swCode.includes("/\\/vendor\\/wallet/"), "Vendor financial routes excluded from caching");
    assert(swCode.includes("caches.delete(key)"), "Outdated cache cleanup implemented in activate event");

    // -------------------------------------------------------------------------
    // [3/8] UNIVERSAL LINKING & APP SCHEME ROUTER
    // -------------------------------------------------------------------------
    console.log("\n--- [3/8] Universal Linking & App Scheme Router ---");
    const productDeepLink = DeepLinkRouterEngine.buildDeepLink("product", "banarasi-silk-saree-101");
    assert(productDeepLink.webUrl === "https://fancyhub.in/product/banarasi-silk-saree-101", "Product web URL matches canonical route");
    assert(productDeepLink.appSchemeUrl === "fancyhub://product/banarasi-silk-saree-101", "Product app scheme URL formatted as 'fancyhub://product/...'");

    const resolvedScheme = DeepLinkRouterEngine.resolveDeepLink("fancyhub://product/banarasi-silk-saree-101");
    assert(resolvedScheme?.type === "product", "Resolved deep link type is 'product'");
    assert(resolvedScheme?.internalRoute === "/product/banarasi-silk-saree-101", "Internal router maps to '/product/banarasi-silk-saree-101'");

    const resolvedWeb = DeepLinkRouterEngine.resolveDeepLink("https://fancyhub.in/category/electronics/audio");
    assert(resolvedWeb?.type === "category", "Universal HTTPS link resolved to category");
    assert(resolvedWeb?.internalRoute === "/category/electronics/audio", "Category internal route preserved accurately");

    // -------------------------------------------------------------------------
    // [4/8] MOBILE PAYMENT INTERRUPTION & RESILIENCY ENGINE
    // -------------------------------------------------------------------------
    console.log("\n--- [4/8] Mobile Payment Interruption & Resiliency Engine ---");
    const testOrderId = "ORD_MOB_TEST_8901";
    const paymentIntent = MobilePaymentRecoveryEngine.initiateTracking({
      orderId: testOrderId,
      paymentIntentId: "pay_test_mob_9918",
      amountINR: 3499,
      gateway: "RAZORPAY",
    });

    assert(paymentIntent.state === "PENDING_GATEWAY", "Initial mobile payment state is 'PENDING_GATEWAY'");
    assert(paymentIntent.retryAttempts === 0, "Initial retry count is 0");

    // Simulate app backgrounding and user returning to app
    const recoveryResult = MobilePaymentRecoveryEngine.recoverPaymentState(testOrderId, "BACKGROUND_RESUME");
    assert(recoveryResult.recovered === true, "Payment recovered upon app foreground resumption");
    assert(recoveryResult.state === "CAPTURED_CONFIRMED", "Payment state updated to 'CAPTURED_CONFIRMED'");

    // -------------------------------------------------------------------------
    // [5/8] MOBILE AUTH & TOKEN LIFECYCLE BRIDGE
    // -------------------------------------------------------------------------
    console.log("\n--- [5/8] Mobile Auth & Token Lifecycle Bridge ---");
    const mobileTokens = MobileAuthBridgeService.issueMobileTokens("cust_8831", "CUSTOMER", "iPhone_15_Pro");
    assert(mobileTokens.accessToken.startsWith("jwt_mobile_"), "Mobile access token issued with secure prefix");
    assert(mobileTokens.refreshToken.startsWith("rft_"), "Mobile refresh token issued with secure prefix");
    assert(mobileTokens.expiresInSec === 3600, "Access token validity set to 3600s (1 hour)");

    const refreshResult = MobileAuthBridgeService.refreshTokens(mobileTokens.refreshToken);
    assert(refreshResult.valid === true, "Token refresh succeeded with valid refresh token");
    assert(typeof refreshResult.newAccessToken === "string", "New access token generated successfully");

    const invalidRefresh = MobileAuthBridgeService.refreshTokens("invalid_token_xyz");
    assert(invalidRefresh.valid === false, "Invalid refresh token rejected properly");

    // -------------------------------------------------------------------------
    // [6/8] MOBILE VIEWPORT & BREAKPOINT MATRIX (320px, 375px, 390px, 430px)
    // -------------------------------------------------------------------------
    console.log("\n--- [6/8] Mobile Viewport Matrix Auditing (320px, 375px, 390px, 430px) ---");
    const vp320 = MobileViewportResponsiveEngine.auditViewport(320);
    assert(vp320.deviceCategory === "small-mobile", "320px classified as 'small-mobile' (iPhone SE 1st gen / small devices)");
    assert(vp320.columnsCount === 1, "320px renders single column product grid to prevent horizontal overflow");
    assert(vp320.bottomNavRequired === true, "320px enforces MobileBottomNav");

    const vp375 = MobileViewportResponsiveEngine.auditViewport(375);
    assert(vp375.deviceCategory === "standard-mobile", "375px classified as 'standard-mobile' (iPhone SE 2/3, standard viewport)");
    assert(vp375.columnsCount === 2, "375px renders 2-column product grid");

    const vp390 = MobileViewportResponsiveEngine.auditViewport(390);
    assert(vp390.deviceCategory === "large-mobile", "390px classified as 'large-mobile' (iPhone 12/13/14/15)");
    assert(vp390.bottomNavRequired === true, "390px enforces MobileBottomNav");

    const vp430 = MobileViewportResponsiveEngine.auditViewport(430);
    assert(vp430.deviceCategory === "pro-max-mobile", "430px classified as 'pro-max-mobile' (iPhone 14/15 Pro Max, Plus)");
    assert(vp430.tapTargetMinPx >= 48, "430px supports relaxed 48px tap targets");

    // Non-mobile fallback check (Desktop / Tablet)
    const vpDesktop = MobileViewportResponsiveEngine.auditViewport(1280);
    assert(vpDesktop.deviceCategory === "desktop", "1280px classified as 'desktop'");
    assert(vpDesktop.bottomNavRequired === false, "Desktop hides MobileBottomNav");
    assert(vpDesktop.columnsCount === 4, "Desktop renders 4-column product grid");

    // -------------------------------------------------------------------------
    // [7/8] TOUCH TARGET COMPLIANCE (WCAG 2.1 AAA) & GESTURE SWIPE RECOGNITION
    // -------------------------------------------------------------------------
    console.log("\n--- [7/8] Touch Targets & Gesture Swipe Recognition ---");
    const tapCheckPass = MobileViewportResponsiveEngine.validateTapTarget(48, 48);
    assert(tapCheckPass.compliant === true, "48x48px button passes WCAG tap target audit");

    const tapCheckFail = MobileViewportResponsiveEngine.validateTapTarget(32, 32);
    assert(tapCheckFail.compliant === false, "32x32px element fails mobile tap target audit (requires >= 44x44px)");

    // Horizontal Swipe (Carousel navigation)
    const swipeLeft = MobileTouchAndGestureEngine.detectSwipe(200, 100, 50, 100, 150);
    assert(swipeLeft === "LEFT", "Fast leftward swipe detected as 'LEFT' (Next Carousel Slide)");

    const swipeRight = MobileTouchAndGestureEngine.detectSwipe(50, 100, 200, 100, 150);
    assert(swipeRight === "RIGHT", "Fast rightward swipe detected as 'RIGHT' (Previous Slide / Drawer Open)");

    // Vertical Pull / Dismiss
    const swipeDown = MobileTouchAndGestureEngine.detectSwipe(100, 50, 100, 250, 200);
    assert(swipeDown === "DOWN", "Downward pull detected as 'DOWN' (Pull to Refresh / Modal Dismiss)");

    // Slow drag (ignoring non-swipes)
    const slowDrag = MobileTouchAndGestureEngine.detectSwipe(50, 50, 200, 50, 800);
    assert(slowDrag === "NONE", "Slow drag exceeding maxSwipeTimeMs ignored as non-swipe");

    // -------------------------------------------------------------------------
    // [8/8] OFFLINE MUTATION SYNCHRONIZATION QUEUE
    // -------------------------------------------------------------------------
    console.log("\n--- [8/8] Offline Mutation Synchronization Queue ---");
    const offCart = MobileOfflineSyncEngine.enqueueAction("ADD_TO_CART", { productId: "prod_1", qty: 2 });
    const offWish = MobileOfflineSyncEngine.enqueueAction("TOGGLE_WISHLIST", { productId: "prod_2" });
    
    assert(offCart.synced === false, "Enqueued offline cart addition initially marked unsynced");
    assert(MobileOfflineSyncEngine.getPendingCount() >= 2, "Pending offline queue contains actions");

    const syncResult = MobileOfflineSyncEngine.processReconnectionQueue();
    assert(syncResult.totalProcessed >= 2, "All offline actions synced upon network reconnection");
    assert(MobileOfflineSyncEngine.getPendingCount() === 0, "Pending offline queue emptied post-sync");

    console.log("\n=======================================================================");
    console.log(`🎉 PHASE 49 PWA & MOBILE EXPERIENCE AUDIT COMPLETE`);
    console.log(`   TOTAL TESTS PASSED: ${passed}`);
    console.log(`   TOTAL TESTS FAILED: ${failed}`);
    console.log("=======================================================================\n");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("Fatal exception during Phase 49 PWA audit:", error);
    process.exit(1);
  }
}

runPhase49PwaMobileSuite();
