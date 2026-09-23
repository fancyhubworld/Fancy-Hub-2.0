# FancyHub.in 2.0 — Provider Adapter Reference & Extensibility

## 1. Supported Adapters

### 1. Razorpay Payment Gateway (`PAYMENTS`)
- **Key Fields**: `keyId`, `keySecret`, `merchantName`, `webhookSecret`.
- **Modes**: `TEST` vs `LIVE`.
- **Webhook Events**: `payment.captured`, `payment.failed`, `order.paid`, `refund.processed`.
- **Signature Check**: `crypto.createHmac('sha256', webhookSecret).update(payload).digest('hex')`.

### 2. Google OAuth 2.0 (`GOOGLE`)
- **Key Fields**: `clientId`, `clientSecret`, `redirectUri`, `scopes`.
- **Endpoint**: `https://accounts.google.com/o/oauth2/v2/auth`.

### 3. Google Maps Platform (`GOOGLE`)
- **Key Fields**: `browserApiKey` (HTTP referrer restricted), `serverApiKey` (IP restricted).
- **Services**: Geocoding, Places Autocomplete, Distance Matrix.

### 4. SMTP & Transactional Email (`COMMUNICATION`)
- **Key Fields**: `host`, `port`, `username`, `password`, `fromEmail`, `fromName`.
- **Compatibility**: SendGrid, Amazon SES, Mailgun, Postmark, custom SMTP.

### 5. Google Gemini AI Engine (`AI`)
- **Key Fields**: `apiKey`, `modelName` (`gemini-1.5-flash`, `gemini-1.5-pro`), `maxOutputTokens`.
- **Tasks**: Visual layout suggestions, copy generation, SEO tagging, vendor pricing telemetry.

### 6. Custom Partner Integration (`CUSTOM`)
- **Key Fields**: `baseUrl`, `authType` (`BEARER`, `API_KEY`, `BASIC`, `NONE`), `apiKeyOrToken`, `customHeaderName`.
- **Security**: Built-in SSRF protection blocking private IPs and cloud metadata addresses.

## 2. Adding a New Provider Adapter
To add a new provider (e.g. `ShiprocketAdapter` or `PayUAdapter`):
1. Create `src/lib/integrations/adapters/your-provider-adapter.ts` extending `BaseProviderAdapter`.
2. Define the provider schema (`ProviderSchemaDefinition`).
3. Implement `testConnection(credentials, options)` and `verifyWebhook(payload, signature, secret)`.
4. Register the adapter in `src/lib/integrations/integration-manager.ts` `ADAPTERS` map.
