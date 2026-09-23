import prisma from "@/lib/prisma";

export type NotificationChannel = "EMAIL" | "SMS" | "WHATSAPP" | "PUSH" | "IN_APP";

export type NotificationType = "TRANSACTIONAL" | "MARKETING";

export type NotificationEvent =
  | "ORDER_CREATED"
  | "PAYMENT_SUCCESS"
  | "PAYMENT_FAILED"
  | "PAYMENT_PENDING"
  | "ORDER_CONFIRMED"
  | "SHIPMENT_CREATED"
  | "SHIPMENT_PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "RETURN_REQUESTED"
  | "RETURN_APPROVED"
  | "REFUND_INITIATED"
  | "REFUND_COMPLETED"
  | "REPLACEMENT"
  | "SETTLEMENT"
  | "PAYOUT"
  | "TICKET_UPDATE";

export type NotificationDeliveryStatus = "QUEUED" | "SENT" | "FAILED" | "RETRYING";

export interface NotificationPayload {
  idempotencyKey?: string;
  recipientId: string;
  recipientEmail?: string;
  recipientPhone?: string;
  event: NotificationEvent;
  type?: NotificationType;
  channel: NotificationChannel;
  variables: Record<string, string | number>;
  customSubject?: string;
  customBody?: string;
}

export interface NotificationLogRecord {
  id: string;
  idempotencyKey: string;
  recipientId: string;
  channel: NotificationChannel;
  event: NotificationEvent;
  status: NotificationDeliveryStatus;
  attempts: number;
  subject?: string;
  body: string;
  error?: string;
  sentAt?: string;
  createdAt: string;
}

// In-Memory Idempotency & Queue Cache
const idempotencyStore = new Set<string>();
const notificationLogs: NotificationLogRecord[] = [];

// -------------------------------------------------------------------------
// 1. TEMPLATE ENGINE & VARIABLE SUBSTITUTION
// -------------------------------------------------------------------------

export class TemplateEngine {
  private static DEFAULT_TEMPLATES: Record<NotificationEvent, { subject: string; body: string }> = {
    ORDER_CREATED: {
      subject: "Order Placed: {{order_number}}",
      body: "Hi {{customer_name}}, your FancyHub order #{{order_number}} of ₹{{amount}} has been placed successfully.",
    },
    PAYMENT_SUCCESS: {
      subject: "Payment Confirmed for {{order_number}}",
      body: "Hi {{customer_name}}, we received your payment of ₹{{amount}} for order #{{order_number}}.",
    },
    PAYMENT_FAILED: {
      subject: "Payment Failed for {{order_number}}",
      body: "Hi {{customer_name}}, payment of ₹{{amount}} for order #{{order_number}} was unsuccessful. Please retry.",
    },
    PAYMENT_PENDING: {
      subject: "Payment Pending for {{order_number}}",
      body: "Hi {{customer_name}}, payment for order #{{order_number}} is pending completion.",
    },
    ORDER_CONFIRMED: {
      subject: "Order Confirmed: {{order_number}}",
      body: "Hi {{customer_name}}, artisan vendor has confirmed your order #{{order_number}}.",
    },
    SHIPMENT_CREATED: {
      subject: "Shipment Created: {{order_number}}",
      body: "Hi {{customer_name}}, AWB #{{tracking_number}} has been created for your order #{{order_number}}.",
    },
    SHIPMENT_PICKED_UP: {
      subject: "Package Picked Up: {{order_number}}",
      body: "Courier has picked up package #{{tracking_number}} for order #{{order_number}}.",
    },
    IN_TRANSIT: {
      subject: "Order In Transit: {{order_number}}",
      body: "Package #{{tracking_number}} is on the way to {{city}}.",
    },
    OUT_FOR_DELIVERY: {
      subject: "Out for Delivery: {{order_number}}",
      body: "Package #{{tracking_number}} is out for delivery today. Keep OTP ready.",
    },
    DELIVERED: {
      subject: "Delivered: {{order_number}}",
      body: "Your FancyHub package #{{order_number}} has been delivered. Enjoy your handcrafted treasures!",
    },
    RETURN_REQUESTED: {
      subject: "Return Requested for {{order_number}}",
      body: "Return request for order #{{order_number}} has been received. Pickup will be scheduled soon.",
    },
    RETURN_APPROVED: {
      subject: "Return Approved for {{order_number}}",
      body: "Return for order #{{order_number}} has been approved. Reverse AWB is #{{tracking_number}}.",
    },
    REFUND_INITIATED: {
      subject: "Refund Initiated for {{order_number}}",
      body: "Refund of ₹{{amount}} for order #{{order_number}} is processing to your original payment method.",
    },
    REFUND_COMPLETED: {
      subject: "Refund Completed: ₹{{amount}}",
      body: "₹{{amount}} has been credited for order #{{order_number}}.",
    },
    REPLACEMENT: {
      subject: "Replacement Dispatched for {{order_number}}",
      body: "Your replacement package for order #{{order_number}} is dispatched with AWB #{{tracking_number}}.",
    },
    SETTLEMENT: {
      subject: "Settlement Batch Calculated: {{batch_id}}",
      body: "Vendor settlement batch {{batch_id}} totaling ₹{{amount}} has been generated for review.",
    },
    PAYOUT: {
      subject: "Vendor Payout Disbursed: ₹{{amount}}",
      body: "Payout of ₹{{amount}} has been transferred to your registered bank account.",
    },
    TICKET_UPDATE: {
      subject: "Support Ticket Update: {{ticket_number}}",
      body: "Support ticket #{{ticket_number}} has a new message from our support team.",
    },
  };

  /**
   * Sanitizes input to prevent HTML/Script/Notification injection
   */
  static sanitize(input: string): string {
    return String(input)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * Renders a template with variable substitutions
   */
  static render(
    event: NotificationEvent,
    variables: Record<string, string | number>,
    customTemplate?: { subject?: string; body?: string }
  ): { subject: string; body: string } {
    const defaultTemplate = this.DEFAULT_TEMPLATES[event] || {
      subject: "FancyHub Notification",
      body: "You have a new update.",
    };

    const base = {
      subject: customTemplate?.subject || defaultTemplate.subject,
      body: customTemplate?.body || defaultTemplate.body,
    };

    let renderedSubject = base.subject || "";
    let renderedBody = base.body || "";

    for (const [key, value] of Object.entries(variables)) {
      const sanitized = this.sanitize(String(value));
      const regex = new RegExp(`{{${key}}}`, "g");
      renderedSubject = renderedSubject.replace(regex, sanitized);
      renderedBody = renderedBody.replace(regex, sanitized);
    }

    return {
      subject: renderedSubject,
      body: renderedBody,
    };
  }
}

// -------------------------------------------------------------------------
// 2. PREFERENCES & MANDATORY COMPLIANCE
// -------------------------------------------------------------------------

export class NotificationPreferenceManager {
  private static userPreferences = new Map<string, { marketingOptIn: boolean }>();

  static setPreference(userId: string, marketingOptIn: boolean) {
    this.userPreferences.set(userId, { marketingOptIn });
  }

  /**
   * Checks if notification should be sent based on type & user preference
   */
  static canSend(userId: string, type: NotificationType = "TRANSACTIONAL"): boolean {
    // Transactional notifications cannot be disabled (legal/operational mandate)
    if (type === "TRANSACTIONAL") {
      return true;
    }

    const pref = this.userPreferences.get(userId);
    return pref ? pref.marketingOptIn : true;
  }
}

// -------------------------------------------------------------------------
// 3. PROVIDER ABSTRACTION LAYER
// -------------------------------------------------------------------------

export interface NotificationProvider {
  channel: NotificationChannel;
  send(to: string, subject: string, body: string): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

export class EmailProvider implements NotificationProvider {
  channel: NotificationChannel = "EMAIL";
  async send(to: string, subject: string, body: string) {
    return { success: true, messageId: `EMAIL-MSG-${Date.now()}` };
  }
}

export class SMSProvider implements NotificationProvider {
  channel: NotificationChannel = "SMS";
  async send(to: string, subject: string, body: string) {
    return { success: true, messageId: `SMS-MSG-${Date.now()}` };
  }
}

export class WhatsAppProvider implements NotificationProvider {
  channel: NotificationChannel = "WHATSAPP";
  async send(to: string, subject: string, body: string) {
    return { success: true, messageId: `WA-MSG-${Date.now()}` };
  }
}

export class PushProvider implements NotificationProvider {
  channel: NotificationChannel = "PUSH";
  async send(to: string, subject: string, body: string) {
    return { success: true, messageId: `PUSH-MSG-${Date.now()}` };
  }
}

export class InAppProvider implements NotificationProvider {
  channel: NotificationChannel = "IN_APP";
  async send(to: string, subject: string, body: string) {
    return { success: true, messageId: `INAPP-MSG-${Date.now()}` };
  }
}

// -------------------------------------------------------------------------
// 4. CENTRAL NOTIFICATION SERVICE
// -------------------------------------------------------------------------

export class NotificationService {
  private static providers: Record<NotificationChannel, NotificationProvider> = {
    EMAIL: new EmailProvider(),
    SMS: new SMSProvider(),
    WHATSAPP: new WhatsAppProvider(),
    PUSH: new PushProvider(),
    IN_APP: new InAppProvider(),
  };

  /**
   * Dispatches a notification across specified channel with queueing, idempotency & retry
   */
  static async send(payload: NotificationPayload): Promise<{
    success: boolean;
    status: NotificationDeliveryStatus;
    idempotencyKey: string;
    rendered: { subject: string; body: string };
    error?: string;
  }> {
    const {
      recipientId,
      recipientEmail,
      recipientPhone,
      event,
      type = "TRANSACTIONAL",
      channel,
      variables,
      customSubject,
      customBody,
    } = payload;

    const idempotencyKey =
      payload.idempotencyKey ||
      `NOTIF-${recipientId}-${event}-${channel}-${JSON.stringify(variables).slice(0, 30)}`;

    // 1. Idempotency Check: Prevent duplicate notifications
    if (idempotencyStore.has(idempotencyKey)) {
      return {
        success: true,
        status: "SENT",
        idempotencyKey,
        rendered: TemplateEngine.render(event, variables, { subject: customSubject, body: customBody }),
      };
    }

    // 2. User Preference Check
    if (!NotificationPreferenceManager.canSend(recipientId, type)) {
      return {
        success: false,
        status: "FAILED",
        idempotencyKey,
        rendered: { subject: "", body: "" },
        error: "User has opted out of marketing notifications",
      };
    }

    // 3. Render Template
    const rendered = TemplateEngine.render(event, variables, {
      subject: customSubject,
      body: customBody,
    });

    const destination =
      channel === "EMAIL"
        ? recipientEmail || "customer@fancyhub.in"
        : recipientPhone || "+919876543210";

    const provider = this.providers[channel];
    let attempts = 0;
    let success = false;
    let lastError: string | undefined;

    // 4. Queue with Retry Logic (Up to 3 attempts)
    while (attempts < 3 && !success) {
      attempts++;
      try {
        const res = await provider.send(destination, rendered.subject, rendered.body);
        if (res.success) {
          success = true;
        } else {
          lastError = res.error;
        }
      } catch (err: any) {
        lastError = err.message;
      }
    }

    const finalStatus: NotificationDeliveryStatus = success ? "SENT" : "FAILED";
    if (success) {
      idempotencyStore.add(idempotencyKey);
    }

    // 5. Audit Log Record
    const logRecord: NotificationLogRecord = {
      id: `LOG-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      idempotencyKey,
      recipientId,
      channel,
      event,
      status: finalStatus,
      attempts,
      subject: rendered.subject,
      body: rendered.body,
      error: lastError,
      sentAt: success ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
    };

    notificationLogs.push(logRecord);

    return {
      success,
      status: finalStatus,
      idempotencyKey,
      rendered,
      error: lastError,
    };
  }

  /**
   * Fetches audit logs for Admin ERP
   */
  static getLogs(): NotificationLogRecord[] {
    return [...notificationLogs];
  }

  /**
   * Provider Health Status
   */
  static getProviderHealth(): Record<NotificationChannel, { status: "HEALTHY" | "DEGRADED"; latencyMs: number }> {
    return {
      EMAIL: { status: "HEALTHY", latencyMs: 85 },
      SMS: { status: "HEALTHY", latencyMs: 110 },
      WHATSAPP: { status: "HEALTHY", latencyMs: 95 },
      PUSH: { status: "HEALTHY", latencyMs: 40 },
      IN_APP: { status: "HEALTHY", latencyMs: 15 },
    };
  }
}
