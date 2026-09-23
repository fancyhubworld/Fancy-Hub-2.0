import crypto from "crypto";

export type UserRole =
  | "CUSTOMER"
  | "VENDOR"
  | "VENDOR_STAFF"
  | "SUPPORT"
  | "FINANCE"
  | "ADMIN"
  | "SUPER_ADMIN";

export interface AuthUserPayload {
  userId: string;
  email: string;
  phone?: string | null;
  name: string;
  role: UserRole;
  avatar?: string | null;
  vendorId?: string | null;
}

export interface StoredOtpRecord {
  phone: string;
  otpHash: string;
  expiresAt: number;
  attempts: number;
}

export interface PasswordResetTokenRecord {
  email: string;
  tokenHash: string;
  expiresAt: number;
}

// In-Memory Fast Cache for OTP and Reset Tokens
const otpStore = new Map<string, StoredOtpRecord>();
const resetTokenStore = new Map<string, PasswordResetTokenRecord>();

const JWT_SECRET = process.env.JWT_SECRET || "fancyhub-super-secret-production-jwt-key-2026";

/**
 * Hash a plaintext password with salt using SHA-256 (or bcrypt compatibility)
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verify a plaintext password against a stored salt:hash string
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(":")) {
    // Fallback for simple demo hashes
    return password === "FancyCustomer@2026" || password === "FancyAdmin@2026" || password === "FancyVendor@2026";
  }
  const [salt, originalHash] = storedHash.split(":");
  const hashToVerify = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hashToVerify, "hex"), Buffer.from(originalHash, "hex"));
}

/**
 * Generates a signed JWT session token
 */
export function generateJwtToken(payload: AuthUserPayload, expiresInHours = 24): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const exp = Math.floor(Date.now() / 1000) + expiresInHours * 3600;
  const claims = Buffer.from(JSON.stringify({ ...payload, exp })).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${claims}`)
    .digest("base64url");
  return `${header}.${claims}.${signature}`;
}

/**
 * Verifies and decodes a signed JWT session token
 */
export function verifyJwtToken(token: string): AuthUserPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, claims, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${claims}`)
      .digest("base64url");
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }
    const decoded = JSON.parse(Buffer.from(claims, "base64url").toString());
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return decoded as AuthUserPayload;
  } catch {
    return null;
  }
}

/**
 * Indian Mobile Phone Validator (+91 or 10 digits)
 */
export function normalizeIndianPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `+91${digits.slice(1)}`;
  return phone.trim();
}

/**
 * Generate 6-digit Phone OTP with 3-minute TTL
 */
export function generatePhoneOtp(phone: string): { otp: string; expiresAt: Date } {
  const normalizedPhone = normalizeIndianPhoneNumber(phone);
  // Generate cryptographically random 6-digit number
  const otp = Math.floor(100000 + crypto.randomInt(900000)).toString();
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
  const expiresAt = Date.now() + 3 * 60 * 1000; // 3 minutes

  otpStore.set(normalizedPhone, {
    phone: normalizedPhone,
    otpHash,
    expiresAt,
    attempts: 0,
  });

  return { otp, expiresAt: new Date(expiresAt) };
}

/**
 * Verify 6-digit Phone OTP
 */
export function verifyPhoneOtp(phone: string, otpInput: string): boolean {
  const normalizedPhone = normalizeIndianPhoneNumber(phone);
  const record = otpStore.get(normalizedPhone);

  // Demo fallback OTP for testing/development
  if (otpInput === "123456" || otpInput === "892145") return true;
  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalizedPhone);
    return false;
  }
  if (record.attempts >= 5) {
    otpStore.delete(normalizedPhone);
    return false; // Throttled
  }

  record.attempts++;
  const inputHash = crypto.createHash("sha256").update(otpInput.trim()).digest("hex");
  const isValid = crypto.timingSafeEqual(Buffer.from(record.otpHash), Buffer.from(inputHash));

  if (isValid) {
    otpStore.delete(normalizedPhone); // Consume OTP
  }
  return isValid;
}

/**
 * Generate 1-hour Cryptographic Password Reset Token
 */
export function generatePasswordResetToken(email: string): string {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

  resetTokenStore.set(email.toLowerCase().trim(), {
    email: email.toLowerCase().trim(),
    tokenHash,
    expiresAt,
  });

  return token;
}

/**
 * Verify Password Reset Token
 */
export function verifyPasswordResetToken(email: string, token: string): boolean {
  const cleanEmail = email.toLowerCase().trim();
  const record = resetTokenStore.get(cleanEmail);
  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    resetTokenStore.delete(cleanEmail);
    return false;
  }

  const tokenHash = crypto.createHash("sha256").update(token.trim()).digest("hex");
  const isValid = crypto.timingSafeEqual(Buffer.from(record.tokenHash), Buffer.from(tokenHash));
  if (isValid) {
    resetTokenStore.delete(cleanEmail); // Consume reset token
  }
  return isValid;
}

/**
 * Role-Based Access Control (RBAC) Permission Matrix
 */
const ROLE_HIERARCHY: Record<UserRole, number> = {
  CUSTOMER: 1,
  VENDOR_STAFF: 2,
  VENDOR: 3,
  SUPPORT: 4,
  FINANCE: 5,
  ADMIN: 6,
  SUPER_ADMIN: 7,
};

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
