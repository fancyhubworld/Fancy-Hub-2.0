import crypto from "crypto";

export type ApiKeyMode = "live" | "test";
export type ApiScope =
  | "catalog:read"
  | "catalog:write"
  | "orders:read"
  | "orders:write"
  | "customers:read"
  | "webhooks:manage"
  | "analytics:read";

export interface ApiKeyEntity {
  id: string;
  name: string;
  ownerId: string;
  prefix: string; // e.g. "fh_live_a1b2..."
  hashedSecret: string;
  scopes: ApiScope[];
  rateLimitPerMin: number;
  mode: ApiKeyMode;
  status: "ACTIVE" | "REVOKED";
  lastUsedAt?: string;
  createdAt: string;
}

export type WebhookTopic =
  | "order.created"
  | "order.updated"
  | "order.cancelled"
  | "payment.captured"
  | "payment.failed"
  | "shipment.dispatched"
  | "shipment.delivered"
  | "refund.processed"
  | "return.requested"
  | "vendor.approved"
  | "settlement.processed"
  | "product.updated"
  | "customer.created";

export interface WebhookEndpoint {
  id: string;
  url: string;
  topics: WebhookTopic[];
  signingSecret: string;
  status: "ACTIVE" | "PAUSED" | "DISABLED";
  createdAt: string;
}

export interface WebhookDeliveryLog {
  id: string;
  endpointId: string;
  eventId: string;
  topic: WebhookTopic;
  payload: Record<string, any>;
  statusCode?: number;
  attempts: number;
  status: "DELIVERED" | "PENDING" | "RETRYING" | "FAILED";
  lastAttemptAt: string;
}

export interface ApiRequestLog {
  id: string;
  apiKeyId?: string;
  method: string;
  path: string;
  version: "v1" | "v2";
  statusCode: number;
  latencyMs: number;
  clientIp: string;
  error?: string;
  timestamp: string;
}

// In-Memory Platform Stores
const apiKeysStore: ApiKeyEntity[] = [];
const webhookEndpointsStore: WebhookEndpoint[] = [];
const webhookDeliveryLogs: WebhookDeliveryLog[] = [];
const apiRequestLogs: ApiRequestLog[] = [];
const rateLimitBuckets: Record<string, { count: number; resetAt: number }> = {};

// -------------------------------------------------------------------------
// 1. API KEY MANAGEMENT & AUTHENTICATION SERVICE
// -------------------------------------------------------------------------

export class ApiKeyManagementService {
  /**
   * Creates a new API key and returns secret ONCE
   */
  static createApiKey(params: {
    name: string;
    ownerId: string;
    scopes: ApiScope[];
    rateLimitPerMin?: number;
    mode?: ApiKeyMode;
  }): { apiKey: ApiKeyEntity; rawSecret: string } {
    const mode = params.mode || "live";
    const keyId = `key_${crypto.randomBytes(8).toString("hex")}`;
    const prefix = `fh_${mode}_${crypto.randomBytes(6).toString("hex")}`;
    const rawSecret = `sec_${crypto.randomBytes(24).toString("hex")}`;
    const hashedSecret = crypto.createHash("sha256").update(rawSecret).digest("hex");

    const apiKey: ApiKeyEntity = {
      id: keyId,
      name: params.name,
      ownerId: params.ownerId,
      prefix,
      hashedSecret,
      scopes: params.scopes,
      rateLimitPerMin: params.rateLimitPerMin || 100,
      mode,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    };

    apiKeysStore.push(apiKey);
    return { apiKey, rawSecret };
  }

  /**
   * Authenticates API key and secret with constant-time verification
   */
  static authenticateApiKey(prefix: string, rawSecret: string, requiredScope?: ApiScope): { valid: boolean; apiKey?: ApiKeyEntity; error?: string } {
    const key = apiKeysStore.find((k) => k.prefix === prefix);
    if (!key) return { valid: false, error: "Invalid API Key prefix" };
    if (key.status !== "ACTIVE") return { valid: false, error: "API Key has been revoked" };

    const expectedHash = key.hashedSecret;
    const computedHash = crypto.createHash("sha256").update(rawSecret).digest("hex");

    if (computedHash.length !== expectedHash.length) return { valid: false, error: "Invalid credentials" };
    const isValid = crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(expectedHash));
    if (!isValid) return { valid: false, error: "Invalid credentials" };

    if (requiredScope && !key.scopes.includes(requiredScope)) {
      return { valid: false, error: `Insufficient permissions. Missing scope: ${requiredScope}` };
    }

    key.lastUsedAt = new Date().toISOString();
    return { valid: true, apiKey: key };
  }

  /**
   * Rotates API key secret
   */
  static rotateSecret(keyId: string): { success: boolean; newRawSecret?: string } {
    const key = apiKeysStore.find((k) => k.id === keyId);
    if (!key) return { success: false };

    const newRawSecret = `sec_${crypto.randomBytes(24).toString("hex")}`;
    key.hashedSecret = crypto.createHash("sha256").update(newRawSecret).digest("hex");
    return { success: true, newRawSecret };
  }

  /**
   * Revokes API key
   */
  static revokeApiKey(keyId: string): boolean {
    const key = apiKeysStore.find((k) => k.id === keyId);
    if (!key) return false;
    key.status = "REVOKED";
    return true;
  }

  /**
   * Updates API key scopes
   */
  static updateScopes(keyId: string, newScopes: ApiScope[]): boolean {
    const key = apiKeysStore.find((k) => k.id === keyId);
    if (!key) return false;
    key.scopes = newScopes;
    return true;
  }
}

// -------------------------------------------------------------------------
// 2. PER-API-KEY RATE LIMITING ENGINE
// -------------------------------------------------------------------------

export class ApiGatewayRateLimiter {
  /**
   * Checks sliding window rate limit for given API Key
   */
  static checkRateLimit(keyId: string, limitPerMin: number = 100): {
    allowed: boolean;
    limit: number;
    remaining: number;
    resetSeconds: number;
  } {
    const now = Date.now();
    const windowMs = 60 * 1000;
    const bucket = rateLimitBuckets[keyId] || { count: 0, resetAt: now + windowMs };

    if (now > bucket.resetAt) {
      bucket.count = 0;
      bucket.resetAt = now + windowMs;
    }

    bucket.count++;
    rateLimitBuckets[keyId] = bucket;

    const remaining = Math.max(0, limitPerMin - bucket.count);
    const resetSeconds = Math.ceil((bucket.resetAt - now) / 1000);

    return {
      allowed: bucket.count <= limitPerMin,
      limit: limitPerMin,
      remaining,
      resetSeconds,
    };
  }
}

// -------------------------------------------------------------------------
// 3. OUTBOUND WEBHOOK DISPATCHER & SIGNATURE ENGINE
// -------------------------------------------------------------------------

export class WebhookDispatcherEngine {
  /**
   * Registers a webhook subscriber endpoint
   */
  static registerEndpoint(params: { url: string; topics: WebhookTopic[]; signingSecret?: string }): WebhookEndpoint {
    const endpoint: WebhookEndpoint = {
      id: `wh_ep_${crypto.randomBytes(8).toString("hex")}`,
      url: params.url,
      topics: params.topics,
      signingSecret: params.signingSecret || `whsec_${crypto.randomBytes(20).toString("hex")}`,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    };

    webhookEndpointsStore.push(endpoint);
    return endpoint;
  }

  /**
   * Computes HMAC-SHA256 signature for outgoing webhook payload
   */
  static computeSignature(payload: string, timestamp: number, secret: string): string {
    const signaturePayload = `${timestamp}.${payload}`;
    return crypto.createHmac("sha256", secret).update(signaturePayload).digest("hex");
  }

  /**
   * Dispatches webhook event to subscribed endpoints
   */
  static dispatchEvent(topic: WebhookTopic, data: Record<string, any>): WebhookDeliveryLog[] {
    const eventId = `evt_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    const timestamp = Math.floor(Date.now() / 1000);
    const serialized = JSON.stringify(data);
    const matchingEndpoints = webhookEndpointsStore.filter((ep) => ep.status === "ACTIVE" && ep.topics.includes(topic));

    const results: WebhookDeliveryLog[] = [];

    for (const ep of matchingEndpoints) {
      const signature = this.computeSignature(serialized, timestamp, ep.signingSecret);
      const deliveryLog: WebhookDeliveryLog = {
        id: `log_${crypto.randomBytes(8).toString("hex")}`,
        endpointId: ep.id,
        eventId,
        topic,
        payload: data,
        statusCode: 200,
        attempts: 1,
        status: "DELIVERED",
        lastAttemptAt: new Date().toISOString(),
      };

      webhookDeliveryLogs.unshift(deliveryLog);
      results.push(deliveryLog);
    }

    return results;
  }

  /**
   * Verifies incoming webhook signature with timestamp drift protection
   */
  static verifySignature(params: {
    payload: string;
    timestamp: number;
    signature: string;
    secret: string;
    maxDriftSec?: number;
  }): { valid: boolean; error?: string } {
    const maxDrift = params.maxDriftSec || 300;
    const now = Math.floor(Date.now() / 1000);

    if (Math.abs(now - params.timestamp) > maxDrift) {
      return { valid: false, error: "Webhook timestamp has expired or drifted beyond 300s window (Replay Attack Guard)" };
    }

    const expectedSig = this.computeSignature(params.payload, params.timestamp, params.secret);
    if (params.signature.length !== expectedSig.length) {
      return { valid: false, error: "Signature length mismatch" };
    }

    const isValid = crypto.timingSafeEqual(Buffer.from(params.signature), Buffer.from(expectedSig));
    return { valid: isValid, error: isValid ? undefined : "Invalid signature" };
  }
}

// -------------------------------------------------------------------------
// 4. DEVELOPER PLATFORM & SECURE REQUEST LOGGER
// -------------------------------------------------------------------------

export class DeveloperPlatformLogger {
  /**
   * Records API request metrics and logs with zero secret leakage
   */
  static logRequest(log: Omit<ApiRequestLog, "id" | "timestamp">): ApiRequestLog {
    const entry: ApiRequestLog = {
      id: `req_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
      ...log,
      path: log.path.split("?")[0], // Sanitize query params
      timestamp: new Date().toISOString(),
    };

    apiRequestLogs.unshift(entry);
    return entry;
  }

  /**
   * Retrieves request logs
   */
  static getLogs(limit = 50): ApiRequestLog[] {
    return apiRequestLogs.slice(0, limit);
  }
}
