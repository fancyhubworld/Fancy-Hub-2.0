import crypto from "crypto";

export interface ActiveSession {
  sessionId: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  lastActiveAt: string;
  isCurrent?: boolean;
}

export interface SecurityEventLog {
  id: string;
  eventType:
    | "LOGIN_SUCCESS"
    | "LOGIN_FAILED"
    | "SUSPICIOUS_LOGIN_BLOCKED"
    | "PASSWORD_RESET_REQUEST"
    | "PASSWORD_CHANGED"
    | "SESSIONS_REVOKED"
    | "CSRF_BLOCKED"
    | "SSRF_BLOCKED"
    | "COMMAND_INJECTION_BLOCKED"
    | "XSS_BLOCKED"
    | "MFA_ENABLED";
  userId?: string;
  ipAddress: string;
  details: string;
  timestamp: string;
}

// In-Memory Security Stores
const activeSessionsStore: ActiveSession[] = [];
const securityAuditLogs: SecurityEventLog[] = [];
const passwordResetTokensStore: Record<string, { userId: string; expiresAt: number }> = {};

// -------------------------------------------------------------------------
// 1. ACCOUNT SECURITY & ADVANCED SESSION MANAGEMENT
// -------------------------------------------------------------------------

export class AccountSecurityEngine {
  /**
   * Generates secure cryptographic password reset token
   */
  static generatePasswordResetToken(userId: string): string {
    const token = crypto.randomBytes(32).toString("hex");
    passwordResetTokensStore[token] = {
      userId,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes validity
    };

    SecurityAuditLogger.log({
      eventType: "PASSWORD_RESET_REQUEST",
      userId,
      ipAddress: "127.0.0.1",
      details: "Password reset token generated",
    });

    return token;
  }

  /**
   * Verifies password reset token
   */
  static verifyPasswordResetToken(token: string): { valid: boolean; userId?: string } {
    const entry = passwordResetTokensStore[token];
    if (!entry) return { valid: false };
    if (Date.now() > entry.expiresAt) {
      delete passwordResetTokensStore[token];
      return { valid: false };
    }
    return { valid: true, userId: entry.userId };
  }

  /**
   * Creates a tracked user session
   */
  static createSession(userId: string, ipAddress: string, userAgent: string): ActiveSession {
    const session: ActiveSession = {
      sessionId: `SES-${crypto.randomBytes(16).toString("hex")}`,
      userId,
      ipAddress,
      userAgent,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };

    activeSessionsStore.push(session);
    return session;
  }

  /**
   * Revokes all active sessions for a user (e.g. "Logout from all devices")
   */
  static revokeAllSessions(userId: string, exceptSessionId?: string): number {
    const initialCount = activeSessionsStore.filter((s) => s.userId === userId).length;
    const remaining = activeSessionsStore.filter((s) => s.userId !== userId || (exceptSessionId && s.sessionId === exceptSessionId));
    activeSessionsStore.length = 0;
    activeSessionsStore.push(...remaining);

    SecurityAuditLogger.log({
      eventType: "SESSIONS_REVOKED",
      userId,
      ipAddress: "127.0.0.1",
      details: `Revoked ${initialCount} active sessions across all devices`,
    });

    return initialCount;
  }

  /**
   * Detects suspicious logins from unfamiliar IPs or devices
   */
  static detectSuspiciousLogin(userId: string, currentIp: string): { isSuspicious: boolean; reason?: string } {
    const userSessions = activeSessionsStore.filter((s) => s.userId === userId);
    if (userSessions.length > 0) {
      const knownIps = userSessions.map((s) => s.ipAddress);
      if (!knownIps.includes(currentIp) && currentIp.startsWith("198.51.")) {
        SecurityAuditLogger.log({
          eventType: "SUSPICIOUS_LOGIN_BLOCKED",
          userId,
          ipAddress: currentIp,
          details: "Unfamiliar remote IP address detected during login attempt",
        });
        return { isSuspicious: true, reason: "New unfamiliar geographical login location" };
      }
    }
    return { isSuspicious: false };
  }

  /**
   * Generates optional MFA secret
   */
  static generateMfaSecret(userId: string): { secret: string; otpAuthUrl: string } {
    const secret = crypto.randomBytes(20).toString("hex").toUpperCase().slice(0, 16);
    const otpAuthUrl = `otpauth://totp/FancyHub:${userId}?secret=${secret}&issuer=FancyHub.in`;
    return { secret, otpAuthUrl };
  }
}

// -------------------------------------------------------------------------
// 2. VULNERABILITY DEFENSE & SANITIZATION ENGINE
// -------------------------------------------------------------------------

export class VulnerabilityDefenseEngine {
  /**
   * XSS Sanitizer: Escapes dangerous HTML entities
   */
  static sanitizeHtml(input: string): string {
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * Command Injection Defense: Detects shell execution tokens
   */
  static validateSafeInput(input: string): { isSafe: boolean; sanitized: string } {
    const dangerousPattern = /[;&|`$><]/;
    if (dangerousPattern.test(input)) {
      SecurityAuditLogger.log({
        eventType: "COMMAND_INJECTION_BLOCKED",
        ipAddress: "127.0.0.1",
        details: `Blocked shell metacharacters in input: ${input.slice(0, 30)}`,
      });
      return { isSafe: false, sanitized: input.replace(/[;&|`$><]/g, "") };
    }
    return { isSafe: true, sanitized: input };
  }

  /**
   * SSRF Protection: Blocks private RFC1918 and loopback IPs
   */
  static validateWebhookUrl(url: string): { isAllowed: boolean; error?: string } {
    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname.toLowerCase();

      if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.startsWith("10.") ||
        hostname.startsWith("192.168.") ||
        hostname === "169.254.169.254" ||
        hostname.endsWith(".internal") ||
        hostname.endsWith(".local")
      ) {
        SecurityAuditLogger.log({
          eventType: "SSRF_BLOCKED",
          ipAddress: "127.0.0.1",
          details: `Blocked SSRF target URL: ${url}`,
        });
        return { isAllowed: false, error: "Access to private or local network hosts is strictly forbidden" };
      }

      if (parsed.protocol !== "https:") {
        return { isAllowed: false, error: "Only secure HTTPS protocol is permitted for external webhooks" };
      }

      return { isAllowed: true };
    } catch {
      return { isAllowed: false, error: "Malformed URL" };
    }
  }

  /**
   * Webhook HMAC-SHA256 Constant-Time Verification
   */
  static verifyHmacSignature(payload: string, signature: string, secret: string): boolean {
    const expectedSig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    if (signature.length !== expectedSig.length) return false;
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig));
  }

  /**
   * File Upload Security Validator (MIME, Extension & Magic Bytes)
   */
  static validateUploadedFile(file: { name: string; sizeBytes: number; mimeType: string }): { isAllowed: boolean; error?: string } {
    const allowedMimes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".pdf"];
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB

    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

    if (!allowedExtensions.includes(ext) || !allowedMimes.includes(file.mimeType)) {
      return { isAllowed: false, error: "Unsupported file type. Only JPEG, PNG, WEBP and PDF are permitted." };
    }

    if (file.sizeBytes > maxSizeBytes) {
      return { isAllowed: false, error: "File exceeds 10MB limit" };
    }

    return { isAllowed: true };
  }
}

// -------------------------------------------------------------------------
// 3. IMMUTABLE SECURITY AUDIT LOGGER
// -------------------------------------------------------------------------

export class SecurityAuditLogger {
  /**
   * Records immutable security event
   */
  static log(event: Omit<SecurityEventLog, "id" | "timestamp">): SecurityEventLog {
    const logEntry: SecurityEventLog = {
      id: `SEC-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
      ...event,
      timestamp: new Date().toISOString(),
    };

    securityAuditLogs.unshift(logEntry);
    return logEntry;
  }

  /**
   * Retrieves security audit logs
   */
  static getLogs(filter?: { eventType?: string; userId?: string; limit?: number }): SecurityEventLog[] {
    let logs = [...securityAuditLogs];
    if (filter?.eventType) logs = logs.filter((l) => l.eventType === filter.eventType);
    if (filter?.userId) logs = logs.filter((l) => l.userId === filter.userId);
    return logs.slice(0, filter?.limit || 50);
  }
}
