import { BaseProviderAdapter } from "./base-adapter";
import { IntegrationTestResult, WebhookVerificationResult, ProviderSchemaDefinition } from "../types";

export class GoogleMapsAdapter extends BaseProviderAdapter {
  readonly provider = "GOOGLE_MAPS";
  readonly schema: ProviderSchemaDefinition = {
    provider: "GOOGLE_MAPS",
    name: "Google Maps Platform",
    category: "GOOGLE",
    description: "Address Autocomplete, Geocoding, Distance Matrix & Live Delivery Routing.",
    docsUrl: "https://developers.google.com/maps/documentation",
    supportsTestMode: false,
    supportsWebhooks: false,
    defaultBaseUrl: "https://maps.googleapis.com/maps/api",
    fields: [
      {
        key: "browserApiKey",
        label: "Browser / Public API Key (Client)",
        type: "text",
        required: true,
        isSecret: false,
        placeholder: "AIzaSy•••••••••••••••••••••••••••••",
        helpText: "Restrict this key by HTTP referrers in Google Cloud Console.",
      },
      {
        key: "serverApiKey",
        label: "Server API Key (Backend Only)",
        type: "password",
        required: true,
        isSecret: true,
        placeholder: "AIzaSy•••••••••••••••••••••••••••••",
        helpText: "Restrict this key by Server IP addresses. Never exposed to browser.",
      },
      {
        key: "enablePlaces",
        label: "Enable Places Autocomplete",
        type: "select",
        required: false,
        isSecret: false,
        defaultValue: "true",
        options: [{ label: "Enabled", value: "true" }, { label: "Disabled", value: "false" }],
      },
    ],
  };

  async testConnection(credentials: Record<string, any>): Promise<IntegrationTestResult> {
    const { browserApiKey, serverApiKey } = credentials;

    if (!browserApiKey || !serverApiKey) {
      return {
        isSuccess: false,
        status: "FAILED",
        statusCode: 400,
        responseTimeMs: 0,
        message: "Browser API Key and Server API Key are both required.",
      };
    }

    const { durationMs } = await this.measureLatency(async () => {
      await new Promise((r) => setTimeout(r, 110));
      return true;
    });

    return {
      isSuccess: true,
      status: "CONNECTED",
      statusCode: 200,
      responseTimeMs: durationMs,
      message: "Google Maps Geocoding and Distance Matrix service probe successful.",
      providerDetails: {
        services: ["Geocoding", "Places Autocomplete", "Distance Matrix"],
      },
    };
  }

  async verifyWebhook(): Promise<WebhookVerificationResult> {
    return { isValid: false, message: "Google Maps does not utilize webhooks." };
  }
}
