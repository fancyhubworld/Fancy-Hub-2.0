import { PrismaClient } from "@prisma/client";
import { BaseProviderAdapter } from "./adapters/base-adapter";
import { RazorpayAdapter } from "./adapters/razorpay-adapter";
import { GoogleOAuthAdapter } from "./adapters/google-oauth-adapter";
import { GoogleMapsAdapter } from "./adapters/google-maps-adapter";
import { SmtpAdapter } from "./adapters/smtp-adapter";
import { GeminiAiAdapter } from "./adapters/gemini-ai-adapter";
import { CustomApiAdapter } from "./adapters/custom-api-adapter";
import {
  IntegrationCategory,
  IntegrationProvider,
  ProviderSchemaDefinition,
  IntegrationTestResult,
  WebhookVerificationResult,
} from "./types";
import {
  encryptCredentials,
  decryptCredentials,
  maskCredentialsObject,
  sanitizeLogPayload,
} from "../secret-manager";

// Registry of Provider Adapters
const ADAPTERS: Record<string, BaseProviderAdapter> = {
  RAZORPAY: new RazorpayAdapter(),
  GOOGLE_OAUTH: new GoogleOAuthAdapter(),
  GOOGLE_MAPS: new GoogleMapsAdapter(),
  SMTP: new SmtpAdapter(),
  GEMINI_AI: new GeminiAiAdapter(),
  CUSTOM: new CustomApiAdapter(),
};

/**
 * Returns schema definition for a specific provider
 */
export function getProviderSchema(provider: string): ProviderSchemaDefinition | null {
  const adapter = ADAPTERS[provider.toUpperCase()];
  return adapter ? adapter.schema : null;
}

/**
 * Returns all available provider schemas across categories
 */
export function getAllProviderSchemas(): ProviderSchemaDefinition[] {
  return Object.values(ADAPTERS).map((a) => a.schema);
}

/**
 * Executes a live safe connection test for a provider using decrypted credentials
 */
export async function testProviderConnection(
  provider: string,
  credentials: Record<string, any>,
  options?: { environment?: string; mode?: string; baseUrl?: string }
): Promise<IntegrationTestResult> {
  const adapter = ADAPTERS[provider.toUpperCase()] || ADAPTERS.CUSTOM;
  try {
    return await adapter.testConnection(credentials, options);
  } catch (err: any) {
    return {
      isSuccess: false,
      status: "ERROR",
      statusCode: 500,
      responseTimeMs: 0,
      message: `Connection test error: ${err.message || "Unknown error"}`,
      error: err.message,
    };
  }
}

/**
 * Verifies a webhook signature using provider adapter
 */
export async function verifyProviderWebhook(
  provider: string,
  payload: string | Record<string, any>,
  signature: string,
  webhookSecret: string
): Promise<WebhookVerificationResult> {
  const adapter = ADAPTERS[provider.toUpperCase()] || ADAPTERS.CUSTOM;
  return await adapter.verifyWebhook(payload, signature, webhookSecret);
}

/**
 * Logs an external API request securely with automatic payload sanitization
 */
export async function recordApiRequestLog(
  prisma: PrismaClient,
  logData: {
    integrationId?: string;
    provider: string;
    endpoint: string;
    method: string;
    statusCode: number;
    responseTimeMs: number;
    isSuccess: boolean;
    rawPayload?: any;
    rawHeaders?: any;
    errorMessage?: string;
    ipAddress?: string;
  }
) {
  try {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const maskedPayload = logData.rawPayload ? sanitizeLogPayload(logData.rawPayload) : null;
    const maskedHeaders = logData.rawHeaders ? sanitizeLogPayload(logData.rawHeaders) : null;

    return await prisma.apiRequestLog.create({
      data: {
        integrationId: logData.integrationId || null,
        provider: logData.provider,
        endpoint: logData.endpoint,
        method: logData.method,
        statusCode: logData.statusCode,
        responseTimeMs: logData.responseTimeMs,
        isSuccess: logData.isSuccess,
        maskedPayload,
        maskedHeaders,
        errorMessage: logData.errorMessage || null,
        requestId,
        ipAddress: logData.ipAddress || "127.0.0.1",
      },
    });
  } catch (err) {
    console.error("Failed to record API request log:", err);
    return null;
  }
}
