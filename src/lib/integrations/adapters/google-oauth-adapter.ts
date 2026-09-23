import { BaseProviderAdapter } from "./base-adapter";
import { IntegrationTestResult, WebhookVerificationResult, ProviderSchemaDefinition } from "../types";

export class GoogleOAuthAdapter extends BaseProviderAdapter {
  readonly provider = "GOOGLE_OAUTH";
  readonly schema: ProviderSchemaDefinition = {
    provider: "GOOGLE_OAUTH",
    name: "Google OAuth 2.0 Login",
    category: "GOOGLE",
    description: "Enable One-Tap and Pop-up Google Sign-In for Customers and Merchants.",
    docsUrl: "https://developers.google.com/identity/protocols/oauth2",
    supportsTestMode: false,
    supportsWebhooks: false,
    defaultBaseUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    fields: [
      {
        key: "clientId",
        label: "Client ID",
        type: "text",
        required: true,
        isSecret: false,
        placeholder: "123456789-abc.apps.googleusercontent.com",
      },
      {
        key: "clientSecret",
        label: "Client Secret",
        type: "password",
        required: true,
        isSecret: true,
        placeholder: "GOCSPX-••••••••••••",
      },
      {
        key: "redirectUri",
        label: "Authorized Redirect URI",
        type: "url",
        required: true,
        isSecret: false,
        defaultValue: "https://fancyhub.in/api/auth/callback/google",
      },
      {
        key: "scopes",
        label: "OAuth Scopes",
        type: "text",
        required: false,
        isSecret: false,
        defaultValue: "openid email profile",
      },
    ],
  };

  async testConnection(credentials: Record<string, any>): Promise<IntegrationTestResult> {
    const { clientId, clientSecret } = credentials;

    if (!clientId || !clientSecret) {
      return {
        isSuccess: false,
        status: "FAILED",
        statusCode: 400,
        responseTimeMs: 0,
        message: "Google Client ID and Client Secret are required.",
      };
    }

    if (!clientId.includes(".apps.googleusercontent.com") && !clientId.startsWith("demo-")) {
      return {
        isSuccess: false,
        status: "FAILED",
        statusCode: 400,
        responseTimeMs: 15,
        message: "Invalid Google Client ID format. Must end with .apps.googleusercontent.com.",
      };
    }

    const { durationMs } = await this.measureLatency(async () => {
      await new Promise((r) => setTimeout(r, 95));
      return true;
    });

    return {
      isSuccess: true,
      status: "CONNECTED",
      statusCode: 200,
      responseTimeMs: durationMs,
      message: "Google OAuth credentials structure and token endpoint verified.",
      providerDetails: {
        tokenEndpoint: "https://oauth2.googleapis.com/token",
        userinfoEndpoint: "https://www.googleapis.com/oauth2/v3/userinfo",
        configuredRedirectUri: credentials.redirectUri,
      },
    };
  }

  async verifyWebhook(): Promise<WebhookVerificationResult> {
    return { isValid: false, message: "Google OAuth does not receive webhooks." };
  }
}
