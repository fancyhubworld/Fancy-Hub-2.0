/**
 * FancyHub.in — CMS & Builder Security Engine (Section 79)
 * Enforces XSS protection, HTML sanitization, Safe CSS validation,
 * Image upload security, Role permission checking, and prevents arbitrary code execution.
 */

export interface SecurityAuditResult {
  isValid: boolean;
  sanitized: string;
  violations: string[];
}

/**
 * 1. XSS & HTML Sanitizer
 * Strips script tags, onerror/onclick event handlers, javascript: URIs, eval/exec
 */
export function sanitizeHtmlContent(input: string): string {
  if (!input) return "";

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .replace(/on\w+=\S+/gi, "")
    .replace(/javascript:[^"']*/gi, "#unsafe-javascript-blocked")
    .replace(/eval\((.*?)\)/gi, "")
    .trim();
}

/**
 * 2. Safe CSS Validator & Sanitizer
 * Blocks expression(), @import urls, behavior:, javascript:, and server includes
 */
export function sanitizeCustomCss(rawCss: string): SecurityAuditResult {
  if (!rawCss) return { isValid: true, sanitized: "", violations: [] };

  const violations: string[] = [];
  let sanitized = rawCss;

  const dangerousPatterns = [
    { pattern: /expression\s*\(.*?\)/gi, name: "CSS expression() execution" },
    { pattern: /javascript\s*:/gi, name: "CSS javascript: URI" },
    { pattern: /behavior\s*:/gi, name: "IE behavior script attachment" },
    { pattern: /@import\s+url/gi, name: "Unsafe external @import" },
    { pattern: /vbscript\s*:/gi, name: "CSS vbscript: URI" },
    { pattern: /<\s*script/gi, name: "Embedded <script> in CSS" },
    { pattern: /binding\s*:/gi, name: "XBL XML binding" },
  ];

  for (const { pattern, name } of dangerousPatterns) {
    if (pattern.test(sanitized)) {
      violations.push(`Blocked unsafe CSS pattern: ${name}`);
      sanitized = sanitized.replace(pattern, "/* blocked-unsafe-rule */");
    }
  }

  return {
    isValid: violations.length === 0,
    sanitized,
    violations,
  };
}

/**
 * 3. Safe Image Upload Validator
 * Verifies MIME types, file extensions, and prevents executable payload uploads
 */
export interface ImageUploadCheck {
  name: string;
  size: number; // in bytes
  mimeType: string;
}

export function validateImageUpload(file: ImageUploadCheck): { isValid: boolean; error?: string } {
  const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/svg+xml",
    "image/gif",
    "image/avif",
  ];

  const FORBIDDEN_EXTENSIONS = [
    ".exe", ".sh", ".php", ".js", ".html", ".htm", ".phtml", ".py", ".rb", ".bat", ".cmd", ".cgi"
  ];

  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (FORBIDDEN_EXTENSIONS.includes(ext)) {
    return { isValid: false, error: `Executable or script extension '${ext}' is strictly forbidden.` };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimeType.toLowerCase())) {
    return { isValid: false, error: `Invalid image type '${file.mimeType}'. Supported: JPEG, PNG, WebP, SVG, GIF, AVIF.` };
  }

  const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: "Image file exceeds maximum allowable size (15MB)." };
  }

  return { isValid: true };
}

/**
 * 4. Role Permissions Gatekeeper
 * Enforces Super Admin, Admin, Designer, Marketing, and Content Manager capabilities
 */
export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "DESIGNER" | "MARKETING" | "CONTENT_MANAGER";

export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  SUPER_ADMIN: [
    "theme.edit", "theme.publish", "theme.delete",
    "pages.create", "pages.edit", "pages.publish", "pages.delete",
    "security.edit", "roles.edit", "brand.lock", "custom_css.edit",
    "widgets.install", "banners.edit", "popups.edit", "media.upload",
    "redirects.edit", "audit.view"
  ],
  ADMIN: [
    "theme.edit", "theme.publish",
    "pages.create", "pages.edit", "pages.publish",
    "widgets.install", "banners.edit", "popups.edit", "media.upload",
    "redirects.edit", "audit.view"
  ],
  DESIGNER: [
    "theme.edit", "pages.edit", "banners.edit", "media.upload", "widgets.view"
  ],
  MARKETING: [
    "banners.edit", "popups.edit", "pages.edit", "media.upload", "scheduled.edit"
  ],
  CONTENT_MANAGER: [
    "pages.edit", "media.upload", "seo.edit"
  ],
};

export function verifyAdminRolePermission(userRole: string, permission: string): boolean {
  const normalizedRole = userRole.toUpperCase() as AdminRole;
  const permissions = ROLE_PERMISSIONS[normalizedRole] || [];
  return permissions.includes(permission);
}
