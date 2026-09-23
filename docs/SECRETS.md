# FancyHub.in 2.0 — Secrets Management & Cryptographic Security

## 1. Encryption at Rest (AES-256-GCM)
All sensitive credentials (API Secret Keys, Private Keys, SMTP Passwords, Webhook Secrets, OAuth Client Secrets) are encrypted before insertion into the database:
- **Algorithm**: `AES-256-GCM` (Galois/Counter Mode).
- **IV Size**: 12 bytes (96-bit cryptographic nonce per record).
- **Authentication Tag**: 16 bytes (128-bit integrity tag).
- **Storage Format**: `ivHex:authTagHex:cipherHex`.

## 2. Master Key Isolation
- The Master Encryption Key is supplied via the environment variable `API_ENCRYPTION_MASTER_KEY`.
- The Master Key is **NEVER** stored in the database, cookies, client bundles, or Admin UI.
- Even if a raw database dump is compromised, credentials cannot be decrypted without the host environment key.

## 3. Frontend Masking & Super Admin Reveal
- Normal API responses return masked strings: `••••••••••••5xyz` for public keys and `••••••••••••` for secrets.
- Decrypted values are never transmitted to customer-facing web pages.
- Only authenticated Super Admins can initiate temporary credential reveals (`POST /api/admin/integrations/[id]/reveal`), which are permanently recorded in the immutable `AuditLog`.

## 4. Log Sanitization & SSRF Protection
- Outbound API logs pass through `sanitizeLogPayload()` stripping passwords, keys, tokens, CVVs, and account numbers.
- Custom Integration base URLs are validated against loopback and private subnets (`127.0.0.1`, `localhost`, `169.254.169.254`, `192.168.*`, `10.*`) to prevent Server-Side Request Forgery.
