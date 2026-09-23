import { IntegrationTestResult, WebhookVerificationResult, ProviderSchemaDefinition } from "../types";

export abstract class BaseProviderAdapter {
  abstract readonly provider: string;
  abstract readonly schema: ProviderSchemaDefinition;

  /**
   * Tests the connection with the external provider using decrypted credentials
   */
  abstract testConnection(
    credentials: Record<string, any>,
    options?: { environment?: string; mode?: string; baseUrl?: string }
  ): Promise<IntegrationTestResult>;

  /**
   * Verifies incoming webhook signature and payload authenticity
   */
  abstract verifyWebhook(
    payload: string | Record<string, any>,
    signature: string,
    webhookSecret: string
  ): Promise<WebhookVerificationResult>;

  /**
   * Helper to measure execution time
   */
  protected async measureLatency<T>(fn: () => Promise<T>): Promise<{ result: T; durationMs: number }> {
    const start = Date.now();
    const result = await fn();
    const durationMs = Date.now() - start;
    return { result, durationMs };
  }
}
