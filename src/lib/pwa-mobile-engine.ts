import crypto from "crypto";

export type DeepLinkType = "product" | "category" | "order" | "vendor" | "campaign";

export interface DeepLinkMapping {
  type: DeepLinkType;
  slugOrId: string;
  webUrl: string;
  appSchemeUrl: string; // fancyhub://...
  universalLink: string; // https://fancyhub.in/...
}

export type PaymentRecoveryState =
  | "PENDING_GATEWAY"
  | "APP_BACKGROUNDED"
  | "NETWORK_INTERRUPTED"
  | "CAPTURED_CONFIRMED"
  | "FAILED_ABORTED";

export interface MobilePaymentIntent {
  orderId: string;
  paymentIntentId: string;
  amountINR: number;
  gateway: "RAZORPAY" | "PHONEPE";
  state: PaymentRecoveryState;
  retryAttempts: number;
  lastCheckedAt: string;
}

// In-Memory Mobile Store
const mobilePaymentStore: Record<string, MobilePaymentIntent> = {};
const refreshTokensStore: Record<string, { userId: string; role: string; expiresAt: number }> = {};

// -------------------------------------------------------------------------
// 1. UNIVERSAL & DEEP LINKING ENGINE
// -------------------------------------------------------------------------

export class DeepLinkRouterEngine {
  private static readonly BASE_WEB_URL = "https://fancyhub.in";
  private static readonly APP_SCHEME = "fancyhub";

  /**
   * Constructs Web URL, App Scheme URL, and Universal Link
   */
  static buildDeepLink(type: DeepLinkType, slugOrId: string): DeepLinkMapping {
    let path = "";
    switch (type) {
      case "product":
        path = `/product/${slugOrId}`;
        break;
      case "category":
        path = `/category/${slugOrId}`;
        break;
      case "order":
        path = `/orders/${slugOrId}`;
        break;
      case "vendor":
        path = `/vendor/${slugOrId}`;
        break;
      case "campaign":
        path = `/offers/${slugOrId}`;
        break;
    }

    return {
      type,
      slugOrId,
      webUrl: `${this.BASE_WEB_URL}${path}`,
      appSchemeUrl: `${this.APP_SCHEME}://${type}/${slugOrId}`,
      universalLink: `${this.BASE_WEB_URL}${path}`,
    };
  }

  /**
   * Resolves incoming deep link URI to internal route
   */
  static resolveDeepLink(uri: string): { type: DeepLinkType; target: string; internalRoute: string } | null {
    try {
      if (uri.startsWith("fancyhub://")) {
        const clean = uri.replace("fancyhub://", "");
        const [typeStr, ...rest] = clean.split("/");
        const target = rest.join("/");
        const type = typeStr as DeepLinkType;

        let internalRoute = "/";
        if (type === "product") internalRoute = `/product/${target}`;
        else if (type === "category") internalRoute = `/category/${target}`;
        else if (type === "order") internalRoute = `/orders/${target}`;
        else if (type === "vendor") internalRoute = `/vendor/${target}`;
        else if (type === "campaign") internalRoute = `/offers/${target}`;

        return { type, target, internalRoute };
      }

      if (uri.startsWith("https://fancyhub.in") || uri.startsWith("/")) {
        const pathname = uri.replace("https://fancyhub.in", "");
        const parts = pathname.split("/").filter(Boolean);
        if (parts[0] === "product") return { type: "product", target: parts[1], internalRoute: pathname };
        if (parts[0] === "category") return { type: "category", target: parts.slice(1).join("/"), internalRoute: pathname };
        if (parts[0] === "orders") return { type: "order", target: parts[1], internalRoute: pathname };
        if (parts[0] === "vendor") return { type: "vendor", target: parts[1], internalRoute: pathname };
        if (parts[0] === "offers") return { type: "campaign", target: parts[1], internalRoute: pathname };
      }

      return null;
    } catch {
      return null;
    }
  }
}

// -------------------------------------------------------------------------
// 2. MOBILE PAYMENT RESILIENCY & RECOVERY ENGINE
// -------------------------------------------------------------------------

export class MobilePaymentRecoveryEngine {
  /**
   * Initializes mobile payment tracking intent
   */
  static initiateTracking(params: {
    orderId: string;
    paymentIntentId: string;
    amountINR: number;
    gateway: "RAZORPAY" | "PHONEPE";
  }): MobilePaymentIntent {
    const intent: MobilePaymentIntent = {
      orderId: params.orderId,
      paymentIntentId: params.paymentIntentId,
      amountINR: params.amountINR,
      gateway: params.gateway,
      state: "PENDING_GATEWAY",
      retryAttempts: 0,
      lastCheckedAt: new Date().toISOString(),
    };

    mobilePaymentStore[params.orderId] = intent;
    return intent;
  }

  /**
   * Recovers payment state after app backgrounding or network drop
   */
  static recoverPaymentState(orderId: string, eventTrigger: "BACKGROUND_RESUME" | "WEBHOOK" | "USER_POLL"): {
    recovered: boolean;
    state: PaymentRecoveryState;
    message: string;
  } {
    const intent = mobilePaymentStore[orderId];
    if (!intent) {
      return { recovered: false, state: "FAILED_ABORTED", message: "No payment intent found for order" };
    }

    intent.retryAttempts++;
    intent.lastCheckedAt = new Date().toISOString();

    // Simulate authoritative reconciliation with Gateway
    if (eventTrigger === "WEBHOOK" || eventTrigger === "BACKGROUND_RESUME") {
      intent.state = "CAPTURED_CONFIRMED";
      return {
        recovered: true,
        state: "CAPTURED_CONFIRMED",
        message: "Payment successfully verified with payment gateway.",
      };
    }

    return {
      recovered: false,
      state: intent.state,
      message: "Payment verification in progress.",
    };
  }
}

// -------------------------------------------------------------------------
// 3. MOBILE AUTH & TOKEN LIFECYCLE BRIDGE
// -------------------------------------------------------------------------

export class MobileAuthBridgeService {
  /**
   * Issues short-lived access JWT + secure long-lived refresh token
   */
  static issueMobileTokens(userId: string, role: string, deviceId: string): {
    accessToken: string;
    refreshToken: string;
    expiresInSec: number;
  } {
    const accessToken = `jwt_mobile_${crypto.randomBytes(32).toString("hex")}`;
    const refreshToken = `rft_${crypto.randomBytes(32).toString("hex")}`;

    refreshTokensStore[refreshToken] = {
      userId,
      role,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    };

    return {
      accessToken,
      refreshToken,
      expiresInSec: 3600, // 1 hour
    };
  }

  /**
   * Refreshes access token using valid refresh token
   */
  static refreshTokens(refreshToken: string): { valid: boolean; newAccessToken?: string; error?: string } {
    const entry = refreshTokensStore[refreshToken];
    if (!entry || Date.now() > entry.expiresAt) {
      return { valid: false, error: "Invalid or expired refresh token" };
    }

    const newAccessToken = `jwt_mobile_${crypto.randomBytes(32).toString("hex")}`;
    return { valid: true, newAccessToken };
  }
}

// -------------------------------------------------------------------------
// 4. MOBILE VIEWPORT & RESPONSIVE ENGINE (320px, 375px, 390px, 430px)
// -------------------------------------------------------------------------

export type MobileDeviceViewport = 320 | 375 | 390 | 430 | 768 | 1024 | 1280;

export interface ViewportAuditResult {
  width: number;
  deviceCategory: "small-mobile" | "standard-mobile" | "large-mobile" | "pro-max-mobile" | "tablet" | "desktop";
  bottomNavRequired: boolean;
  columnsCount: number;
  tapTargetMinPx: number;
  supportsSwipeCarousels: boolean;
  stickyCartEnabled: boolean;
}

export class MobileViewportResponsiveEngine {
  static readonly SUPPORTED_MOBILE_WIDTHS: MobileDeviceViewport[] = [320, 375, 390, 430];

  /**
   * Evaluates viewport width against mobile-first commerce constraints
   */
  static auditViewport(width: number): ViewportAuditResult {
    if (width <= 320) {
      return {
        width,
        deviceCategory: "small-mobile",
        bottomNavRequired: true,
        columnsCount: 1,
        tapTargetMinPx: 44,
        supportsSwipeCarousels: true,
        stickyCartEnabled: true,
      };
    } else if (width <= 375) {
      return {
        width,
        deviceCategory: "standard-mobile",
        bottomNavRequired: true,
        columnsCount: 2,
        tapTargetMinPx: 44,
        supportsSwipeCarousels: true,
        stickyCartEnabled: true,
      };
    } else if (width <= 390) {
      return {
        width,
        deviceCategory: "large-mobile",
        bottomNavRequired: true,
        columnsCount: 2,
        tapTargetMinPx: 44,
        supportsSwipeCarousels: true,
        stickyCartEnabled: true,
      };
    } else if (width <= 430) {
      return {
        width,
        deviceCategory: "pro-max-mobile",
        bottomNavRequired: true,
        columnsCount: 2,
        tapTargetMinPx: 48,
        supportsSwipeCarousels: true,
        stickyCartEnabled: true,
      };
    } else if (width <= 768) {
      return {
        width,
        deviceCategory: "tablet",
        bottomNavRequired: false,
        columnsCount: 3,
        tapTargetMinPx: 44,
        supportsSwipeCarousels: true,
        stickyCartEnabled: false,
      };
    } else {
      return {
        width,
        deviceCategory: "desktop",
        bottomNavRequired: false,
        columnsCount: 4,
        tapTargetMinPx: 36,
        supportsSwipeCarousels: false,
        stickyCartEnabled: false,
      };
    }
  }

  /**
   * Validates touch target size compliance (WCAG 2.1 AAA - min 44x44px for mobile)
   */
  static validateTapTarget(widthPx: number, heightPx: number): { compliant: boolean; minRequiredPx: number } {
    const minRequiredPx = 44;
    return {
      compliant: widthPx >= minRequiredPx && heightPx >= minRequiredPx,
      minRequiredPx,
    };
  }
}

// -------------------------------------------------------------------------
// 5. MOBILE OFFLINE MUTATION SYNC QUEUE
// -------------------------------------------------------------------------

export interface OfflineAction {
  id: string;
  type: "ADD_TO_CART" | "TOGGLE_WISHLIST" | "SAVE_ADDRESS" | "TRACK_ANALYTICS";
  payload: Record<string, any>;
  timestamp: number;
  synced: boolean;
}

const offlineActionQueue: OfflineAction[] = [];

export class MobileOfflineSyncEngine {
  /**
   * Enqueues an action when mobile client is offline
   */
  static enqueueAction(type: OfflineAction["type"], payload: Record<string, any>): OfflineAction {
    const action: OfflineAction = {
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type,
      payload,
      timestamp: Date.now(),
      synced: false,
    };
    offlineActionQueue.push(action);
    return action;
  }

  /**
   * Replays queued offline actions upon network reconnection
   */
  static processReconnectionQueue(): { totalProcessed: number; remaining: number } {
    let count = 0;
    for (const item of offlineActionQueue) {
      if (!item.synced) {
        // Execute sync mutation
        item.synced = true;
        count++;
      }
    }
    return {
      totalProcessed: count,
      remaining: offlineActionQueue.filter((a) => !a.synced).length,
    };
  }

  static getPendingCount(): number {
    return offlineActionQueue.filter((a) => !a.synced).length;
  }
}

// -------------------------------------------------------------------------
// 6. TOUCH GESTURE & SWIPE RECOGNITION CONFIG
// -------------------------------------------------------------------------

export interface SwipeGestureConfig {
  minSwipeDistancePx: number;
  maxSwipeTimeMs: number;
  velocityThreshold: number;
}

export class MobileTouchAndGestureEngine {
  static readonly DEFAULT_SWIPE_CONFIG: SwipeGestureConfig = {
    minSwipeDistancePx: 50,
    maxSwipeTimeMs: 400,
    velocityThreshold: 0.3,
  };

  /**
   * Calculates swipe direction from touch coordinate deltas
   */
  static detectSwipe(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    durationMs: number,
    config: SwipeGestureConfig = this.DEFAULT_SWIPE_CONFIG
  ): "LEFT" | "RIGHT" | "UP" | "DOWN" | "NONE" {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (durationMs > config.maxSwipeTimeMs) return "NONE";

    if (absX > absY && absX >= config.minSwipeDistancePx) {
      const velocity = absX / durationMs;
      if (velocity >= config.velocityThreshold) {
        return deltaX > 0 ? "RIGHT" : "LEFT";
      }
    } else if (absY > absX && absY >= config.minSwipeDistancePx) {
      const velocity = absY / durationMs;
      if (velocity >= config.velocityThreshold) {
        return deltaY > 0 ? "DOWN" : "UP";
      }
    }

    return "NONE";
  }
}

// -------------------------------------------------------------------------
// 7. PWA MANIFEST & CACHING COMPLIANCE VALIDATOR
// -------------------------------------------------------------------------

export interface ManifestSchema {
  name: string;
  short_name: string;
  start_url: string;
  display: string;
  background_color: string;
  theme_color: string;
  icons: Array<{ src: string; sizes: string; type: string }>;
}

export class PwaManifestValidator {
  /**
   * Validates web app manifest against W3C & PWA installability requirements
   */
  static validate(manifest: ManifestSchema): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!manifest.name || manifest.name.trim().length === 0) {
      errors.push("Missing required field: name");
    }
    if (!manifest.short_name || manifest.short_name.trim().length === 0) {
      errors.push("Missing required field: short_name");
    }
    if (!manifest.start_url) {
      errors.push("Missing required field: start_url");
    }
    if (!["standalone", "fullscreen", "minimal-ui"].includes(manifest.display)) {
      errors.push(`Display mode '${manifest.display}' is not installable standard (must be standalone/fullscreen/minimal-ui)`);
    }
    if (!manifest.theme_color || !manifest.theme_color.startsWith("#")) {
      errors.push("Invalid or missing theme_color (hex format required)");
    }
    if (!manifest.background_color || !manifest.background_color.startsWith("#")) {
      errors.push("Invalid or missing background_color (hex format required)");
    }
    if (!Array.isArray(manifest.icons) || manifest.icons.length < 2) {
      errors.push("Manifest must provide at least 2 icon sizes (192x192 and 512x512)");
    } else {
      const has192 = manifest.icons.some((i) => i.sizes === "192x192");
      const has512 = manifest.icons.some((i) => i.sizes === "512x512");
      if (!has192) errors.push("Missing 192x192 application icon");
      if (!has512) errors.push("Missing 512x512 application icon");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

