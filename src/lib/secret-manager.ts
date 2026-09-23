import crypto from "crypto";

// Fallback encryption key for development only (production requires API_ENCRYPTION_MASTER_KEY in environment)
const MASTER_KEY_STRING =
  process.env.API_ENCRYPTION_MASTER_KEY ||
  "fancyhub-master-api-encryption-key-aes256gcm-2026-production";

// Generate 32-byte key from string
const KEY = crypto.createHash("sha256").update(MASTER_KEY_STRING).digest();
const ALGORITHM = "aes-256-gcm";

/**
 * Encrypt sensitive credentials JSON string using AES-256-GCM
 */
export function encryptCredentials(data: Record<string, any> | string): string {
  const plainText = typeof data === "string" ? data : JSON.stringify(data);
  const iv = crypto.randomBytes(12); // 96-bit IV recommended for GCM
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  // Format: iv:authTag:encrypted
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypt credentials JSON string using AES-256-GCM
 */
export function decryptCredentials<T = Record<string, any>>(cipherText: string): T | null {
  try {
    if (!cipherText || !cipherText.includes(":")) {
      return null;
    }
    const parts = cipherText.split(":");
    if (parts.length !== 3) return null;

    const [ivHex, authTagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");

    try {
      return JSON.parse(decrypted) as T;
    } catch {
      return decrypted as unknown as T;
    }
  } catch (err) {
    console.error("Decryption error in SecretManager:", (err as Error).message);
    return null;
  }
}

/**
 * Masks a secret string (e.g. "rzp_live_abc12345xyz" -> "••••••••••••5xyz")
 */
export function maskSecretValue(value?: string | null): string {
  if (!value) return "••••••••••••";
  const str = value.trim();
  if (str.length <= 4) return "••••••••";
  const lastFour = str.slice(-4);
  return `••••••••••••${lastFour}`;
}

/**
 * Masks all secret fields in an object for safe Admin UI responses
 */
export function maskCredentialsObject(obj: Record<string, any>): Record<string, string> {
  const masked: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "string") {
      masked[k] = maskSecretValue(v);
    } else {
      masked[k] = "••••••••";
    }
  }
  return masked;
}

/**
 * Sanitizes headers or request payloads to prevent credential leakage in logs
 */
export function sanitizeLogPayload(payload: any): string {
  if (!payload) return "";
  try {
    const data = typeof payload === "string" ? JSON.parse(payload) : { ...payload };
    const sensitiveKeys = [
      "secret",
      "password",
      "token",
      "key",
      "apiKey",
      "secretKey",
      "clientSecret",
      "webhookSecret",
      "cvv",
      "cardNumber",
      "panNumber",
      "accountNumber",
    ];

    function recurse(node: any) {
      if (!node || typeof node !== "object") return;
      for (const k of Object.keys(node)) {
        if (sensitiveKeys.some((s) => k.toLowerCase().includes(s.toLowerCase()))) {
          node[k] = "••••••••[MASKED]";
        } else if (typeof node[k] === "object") {
          recurse(node[k]);
        }
      }
    }

    recurse(data);
    return JSON.stringify(data);
  } catch {
    return "[COMPLEX_PAYLOAD_MASKED]";
  }
}
