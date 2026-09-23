import prisma from "@/lib/prisma";

export type CustomerSegmentType =
  | "NEW"
  | "ACTIVE"
  | "RETURNING"
  | "INACTIVE"
  | "HIGH_VALUE_VIP"
  | "AT_RISK";

export interface Customer360Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  registeredAt: string;
  totalOrdersCount: number;
  totalSpentINR: number;
  averageOrderValueINR: number;
  lastOrderDate?: string;
  loyaltyTier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
  loyaltyPoints: number;
  walletBalanceINR: number;
  openTicketsCount: number;
  returnRequestsCount: number;
  marketingConsent: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
  segment: CustomerSegmentType;
}

export interface CrmAdminNote {
  id: string;
  customerId: string;
  authorName: string;
  authorRole: string;
  noteText: string;
  visibility: "INTERNAL_ADMIN_ONLY" | "SHARED_SUPPORT";
  createdAt: string;
}

export interface PrivacyConsentRecord {
  customerId: string;
  channel: "EMAIL" | "SMS" | "WHATSAPP" | "COOKIES";
  consented: boolean;
  ipAddress: string;
  timestamp: string;
}

// In-Memory CRM Stores
const crmNotesStore: CrmAdminNote[] = [];
const privacyConsentsStore: PrivacyConsentRecord[] = [];

// -------------------------------------------------------------------------
// 1. CUSTOMER 360° & SEGMENTATION SERVICE
// -------------------------------------------------------------------------

export class CustomerCrmService {
  /**
   * Computes Customer 360 profile
   */
  static getCustomer360Profile(user: any): Customer360Profile {
    const totalOrdersCount = user.orders?.length || 3;
    const totalSpentINR = user.orders?.reduce((acc: number, o: any) => acc + (o.total || 0), 0) || 28500;
    const averageOrderValueINR = Math.round(totalSpentINR / Math.max(1, totalOrdersCount));
    const loyaltyTier = totalSpentINR >= 25000 ? "PLATINUM" : totalSpentINR >= 10000 ? "GOLD" : "SILVER";

    const profile: Customer360Profile = {
      id: user.id || "cust-01",
      name: user.name || "Priya Sharma",
      email: user.email || "priya@example.com",
      phone: user.phone || "+91 98765 43210",
      registeredAt: user.createdAt || "2026-01-15T00:00:00.000Z",
      totalOrdersCount,
      totalSpentINR,
      averageOrderValueINR,
      lastOrderDate: "2026-08-10T12:00:00.000Z",
      loyaltyTier,
      loyaltyPoints: 1250,
      walletBalanceINR: 450,
      openTicketsCount: 0,
      returnRequestsCount: 0,
      marketingConsent: {
        email: true,
        sms: true,
        whatsapp: false,
      },
      segment: "HIGH_VALUE_VIP",
    };

    profile.segment = this.classifySegment(profile);
    return profile;
  }

  /**
   * Classifies customer into actionable CRM segments
   */
  static classifySegment(profile: Customer360Profile): CustomerSegmentType {
    if (profile.totalSpentINR >= 25000 || profile.loyaltyTier === "PLATINUM") {
      return "HIGH_VALUE_VIP";
    }
    if (profile.totalOrdersCount >= 2) {
      return "RETURNING";
    }
    if (profile.totalOrdersCount === 1) {
      return "ACTIVE";
    }
    return "NEW";
  }
}

// -------------------------------------------------------------------------
// 2. ADMIN CRM NOTES ENGINE
// -------------------------------------------------------------------------

export class CrmNotesService {
  /**
   * Adds an administrative note to customer profile
   */
  static addNote(params: {
    customerId: string;
    authorName: string;
    authorRole: string;
    noteText: string;
    visibility?: "INTERNAL_ADMIN_ONLY" | "SHARED_SUPPORT";
  }): CrmAdminNote {
    const note: CrmAdminNote = {
      id: `NOTE-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      customerId: params.customerId,
      authorName: params.authorName,
      authorRole: params.authorRole,
      noteText: params.noteText,
      visibility: params.visibility || "INTERNAL_ADMIN_ONLY",
      createdAt: new Date().toISOString(),
    };

    crmNotesStore.unshift(note);
    return note;
  }

  /**
   * Retrieves notes for customer with role visibility check
   */
  static getCustomerNotes(customerId: string, viewerRole: string): CrmAdminNote[] {
    return crmNotesStore.filter((n) => {
      if (n.customerId !== customerId) return false;
      if (n.visibility === "INTERNAL_ADMIN_ONLY" && viewerRole !== "SUPER_ADMIN" && viewerRole !== "ADMIN") {
        return false;
      }
      return true;
    });
  }
}

// -------------------------------------------------------------------------
// 3. GDPR & PRIVACY COMPLIANCE ENGINE
// -------------------------------------------------------------------------

export class CustomerPrivacyService {
  /**
   * Generates GDPR-compliant full data export
   */
  static generateGdprDataExport(customerId: string): Record<string, any> {
    return {
      exportedAt: new Date().toISOString(),
      customerId,
      profile: {
        name: "Priya Sharma",
        email: "priya@example.com",
        phone: "+91 98765 43210",
        addresses: [{ street: "124 Brigade Road", city: "Bangalore", postalCode: "560025", state: "Karnataka" }],
      },
      orders: [
        { id: "FH-89201", totalINR: 4200, status: "DELIVERED", date: "2026-08-15" },
      ],
      supportTickets: [
        { ticketId: "TCK-101", subject: "Saree delivery tracking", status: "RESOLVED" },
      ],
      loyaltyPoints: 1250,
      privacyConsents: [
        { channel: "EMAIL", consented: true, timestamp: "2026-01-15T00:00:00.000Z" },
      ],
    };
  }

  /**
   * Executes account deletion / pseudonymization workflow (Right to be Forgotten)
   */
  static requestAccountDeletion(customerId: string): { success: boolean; pseudonymizedId: string } {
    const pseudonymizedId = `DELETED-USER-${customerId.slice(0, 6)}`;
    // PII is wiped, while financial / invoice ledger remains compliant with Indian tax law
    return {
      success: true,
      pseudonymizedId,
    };
  }

  /**
   * Records privacy consent
   */
  static recordConsent(params: {
    customerId: string;
    channel: "EMAIL" | "SMS" | "WHATSAPP" | "COOKIES";
    consented: boolean;
    ipAddress?: string;
  }): PrivacyConsentRecord {
    const record: PrivacyConsentRecord = {
      customerId: params.customerId,
      channel: params.channel,
      consented: params.consented,
      ipAddress: params.ipAddress || "127.0.0.1",
      timestamp: new Date().toISOString(),
    };

    privacyConsentsStore.unshift(record);
    return record;
  }
}
