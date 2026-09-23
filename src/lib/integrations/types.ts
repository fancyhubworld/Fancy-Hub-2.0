export type IntegrationCategory =
  | "PAYMENTS"
  | "GOOGLE"
  | "COMMUNICATION"
  | "SHIPPING"
  | "STORAGE"
  | "SOCIAL"
  | "ANALYTICS"
  | "AI"
  | "CUSTOM";

export type IntegrationProvider =
  | "RAZORPAY"
  | "PAYU"
  | "STRIPE"
  | "PHONEPE"
  | "CASHFREE"
  | "GOOGLE_OAUTH"
  | "GOOGLE_MAPS"
  | "GOOGLE_ANALYTICS"
  | "FIREBASE"
  | "SMTP"
  | "SMS_GATEWAY"
  | "WHATSAPP"
  | "SHIPROCKET"
  | "DELHIVERY"
  | "AWS_S3"
  | "CLOUDINARY"
  | "FACEBOOK"
  | "INSTAGRAM"
  | "META_PIXEL"
  | "GEMINI_AI"
  | "CUSTOM";

export type IntegrationEnvironment = "DEVELOPMENT" | "STAGING" | "PRODUCTION";
export type IntegrationMode = "TEST" | "LIVE";
export type IntegrationStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "ERROR"
  | "TESTING"
  | "EXPIRED"
  | "NOT_CONFIGURED";

export interface IntegrationTestResult {
  isSuccess: boolean;
  status: "CONNECTED" | "FAILED" | "ERROR";
  statusCode: number;
  responseTimeMs: number;
  message: string;
  providerDetails?: Record<string, any>;
  error?: string;
}

export interface WebhookVerificationResult {
  isValid: boolean;
  eventId?: string;
  eventType?: string;
  message: string;
}

export interface IntegrationSchemaField {
  key: string;
  label: string;
  type: "text" | "password" | "select" | "number" | "url" | "textarea";
  required: boolean;
  isSecret: boolean;
  placeholder?: string;
  helpText?: string;
  defaultValue?: string | number;
  options?: { label: string; value: string }[];
}

export interface ProviderSchemaDefinition {
  provider: IntegrationProvider;
  name: string;
  category: IntegrationCategory;
  description: string;
  docsUrl: string;
  supportsTestMode: boolean;
  supportsWebhooks: boolean;
  defaultBaseUrl: string;
  defaultSandboxUrl?: string;
  fields: IntegrationSchemaField[];
  webhookEvents?: string[];
}
