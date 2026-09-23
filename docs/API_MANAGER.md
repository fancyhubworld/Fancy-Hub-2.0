# FancyHub.in 2.0 — Central API & Integrations Manager

## 1. Executive Summary
The Central API & Integrations Manager (`/admin/integrations`) empowers Super Administrators to centrally manage external API credentials, service configurations, connection statuses, API versions, webhooks, and environment modes without modifying source code or `.env` files.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 🔐 FANCYHUB.IN 2.0 — CENTRAL INTEGRATION ARCHITECTURE                                  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   [ADMIN ERP / API MANAGER UI]                                                         │
│   • Dashboard Telemetry & Health Monitoring                                            │
│   • Masked Credentials Display (••••••••••••ABCD)                                      │
│   • Live Connection Test Probes                                                        │
│   • TEST ↔ LIVE Mode Transition with Safety Guardrails                                 │
│             │                                                                          │
│             ▼                                                                          │
│   [ENCRYPTED SECRET MANAGER] (`src/lib/secret-manager.ts`)                             │
│   • AES-256-GCM Encryption / Decryption at rest                                        │
│   • Master Key derived from process.env outside database                               │
│   • Sensitive payload and header sanitization for logging                              │
│             │                                                                          │
│             ▼                                                                          │
│   [PROVIDER ADAPTER FACADE] (`src/lib/integrations/integration-manager.ts`)            │
│   • RazorpayAdapter, GoogleOAuthAdapter, GoogleMapsAdapter, SmtpAdapter, GeminiAi      │
│   • SSRF Defense on Custom Base URLs                                                   │
│             │                                                                          │
│             ▼                                                                          │
│   [EXTERNAL PROVIDER APIS & WEBHOOKS]                                                  │
│   • Razorpay, Google Cloud, SendGrid/SES, Gemini AI, Logistics                         │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

## 2. Core Capabilities
1. **Dynamic Provider Management**: Add, update, rotate, or disable credentials on the fly.
2. **Environment Separation**: Independent configurations for Development, Staging, and Production.
3. **Automated Live Probes**: Test connection button measuring response latency in milliseconds without storing sensitive data in logs.
4. **Idempotent Webhooks**: Automated signature verification via HMAC-SHA256 protecting against replay and forgery.
5. **No Code / No .env Editing**: Super Admin can switch Razorpay from Test to Live directly via Admin ERP.
