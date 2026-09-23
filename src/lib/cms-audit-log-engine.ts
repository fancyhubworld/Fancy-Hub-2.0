/**
 * FancyHub.in — CMS Audit Logging Engine (Section 80)
 * Tracks granular field-level changes across Themes, Pages, Widgets, Banners, and System Settings.
 */

export interface CmsAuditEntry {
  id: string;
  userId?: string;
  changedBy: string; // e.g. "Admin Rahul", "Designer Pooja"
  action: "THEME_UPDATE" | "PAGE_UPDATE" | "WIDGET_ADD" | "WIDGET_DELETE" | "BANNER_UPDATE" | "SETTINGS_UPDATE";
  entity: string;    // "Theme", "Page", "Widget", "Banner"
  entityId: string;  // ID or slug of target
  field: string;     // e.g. "primaryColor", "mobileColumns", "status"
  previousValue: any;
  newValue: any;
  summary: string;
  ipAddress?: string;
  createdAt: string;
}

// In-memory runtime buffer
let AUDIT_LOGS_BUFFER: CmsAuditEntry[] = [
  {
    id: "audit-1",
    changedBy: "Admin Rahul",
    action: "THEME_UPDATE",
    entity: "Theme",
    entityId: "global-theme",
    field: "primaryColor",
    previousValue: "#123456",
    newValue: "#2458FF",
    summary: "Admin Rahul changed Primary Color from '#123456' to '#2458FF'",
    createdAt: "2026-08-25T18:00:00.000Z",
  },
  {
    id: "audit-2",
    changedBy: "Super Admin",
    action: "PAGE_UPDATE",
    entity: "Page",
    entityId: "home",
    field: "sections",
    previousValue: 5,
    newValue: 6,
    summary: "Super Admin added new 'Flash Deals' widget to Home page",
    createdAt: "2026-08-25T18:15:00.000Z",
  },
];

export function recordCmsAuditLog(params: {
  userId?: string;
  changedBy: string;
  action: CmsAuditEntry["action"];
  entity: string;
  entityId: string;
  field: string;
  previousValue: any;
  newValue: any;
  ipAddress?: string;
}): CmsAuditEntry {
  const prevStr = typeof params.previousValue === "object" ? JSON.stringify(params.previousValue) : String(params.previousValue);
  const newStr = typeof params.newValue === "object" ? JSON.stringify(params.newValue) : String(params.newValue);

  const entry: CmsAuditEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId: params.userId,
    changedBy: params.changedBy,
    action: params.action,
    entity: params.entity,
    entityId: params.entityId,
    field: params.field,
    previousValue: params.previousValue,
    newValue: params.newValue,
    summary: `${params.changedBy} changed ${params.field} from '${prevStr}' to '${newStr}'`,
    ipAddress: params.ipAddress || "127.0.0.1",
    createdAt: new Date().toISOString(),
  };

  AUDIT_LOGS_BUFFER.unshift(entry);
  return entry;
}

export function getCmsAuditLogs(filter?: { entity?: string; changedBy?: string; limit?: number }): CmsAuditEntry[] {
  let list = [...AUDIT_LOGS_BUFFER];
  if (filter?.entity) {
    list = list.filter((l) => l.entity.toLowerCase() === filter.entity!.toLowerCase());
  }
  if (filter?.changedBy) {
    list = list.filter((l) => l.changedBy.toLowerCase().includes(filter.changedBy!.toLowerCase()));
  }
  if (filter?.limit) {
    list = list.slice(0, filter.limit);
  }
  return list;
}
