import prisma from "@/lib/prisma";

export type TicketStatus =
  | "OPEN"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "WAITING_CUSTOMER"
  | "WAITING_VENDOR"
  | "RESOLVED"
  | "CLOSED";

export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TicketCategory =
  | "Order"
  | "Payment"
  | "Shipping"
  | "Return"
  | "Refund"
  | "Replacement"
  | "Product"
  | "Account"
  | "Vendor"
  | "Technical"
  | "Other";

export type SLAStatus = "WITHIN_SLA" | "AT_RISK" | "BREACHED" | "RESOLVED";

export interface TicketAttachment {
  name: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface CreateTicketParams {
  userId: string;
  vendorId?: string;
  orderId?: string;
  subject: string;
  category?: TicketCategory | string;
  priority?: TicketPriority;
  message: string;
  attachments?: TicketAttachment[];
}

export interface ReplyTicketParams {
  ticketId: string;
  senderId: string;
  senderRole: "CUSTOMER" | "VENDOR" | "AGENT" | "ADMIN";
  message: string;
  attachments?: TicketAttachment[];
  newStatus?: TicketStatus;
}

export interface AssignTicketParams {
  ticketId: string;
  agentId: string;
  assignedBy: string;
}

export interface SLAMetrics {
  firstResponseHours: number;
  resolutionHours: number;
  status: SLAStatus;
  hoursRemaining: number;
}

// -------------------------------------------------------------------------
// 1. ATTACHMENT SECURITY VALIDATOR
// -------------------------------------------------------------------------

export class AttachmentValidator {
  private static ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "text/plain",
  ];
  private static MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

  static validate(attachment: TicketAttachment): { valid: boolean; error?: string } {
    if (!this.ALLOWED_MIME_TYPES.includes(attachment.mimeType)) {
      return {
        valid: false,
        error: `Unsupported file type: ${attachment.mimeType}. Only images and PDFs are allowed.`,
      };
    }

    if (attachment.size > this.MAX_SIZE_BYTES) {
      return {
        valid: false,
        error: `File size exceeds 10MB limit: ${Math.round(attachment.size / 1024 / 1024)}MB`,
      };
    }

    return { valid: true };
  }
}

// -------------------------------------------------------------------------
// 2. SLA ENGINE
// -------------------------------------------------------------------------

export class SLAEngine {
  /**
   * Returns SLA target hours based on priority
   */
  static getSLATargets(priority: TicketPriority): { firstResponseHours: number; resolutionHours: number } {
    switch (priority) {
      case "URGENT":
        return { firstResponseHours: 2, resolutionHours: 24 };
      case "HIGH":
        return { firstResponseHours: 4, resolutionHours: 48 };
      case "MEDIUM":
        return { firstResponseHours: 12, resolutionHours: 72 };
      case "LOW":
      default:
        return { firstResponseHours: 24, resolutionHours: 120 };
    }
  }

  /**
   * Computes live SLA status for an active ticket
   */
  static evaluateSLA(createdAt: Date | string, priority: TicketPriority, isResolved: boolean): SLAMetrics {
    const { firstResponseHours, resolutionHours } = this.getSLATargets(priority);
    if (isResolved) {
      return { firstResponseHours, resolutionHours, status: "RESOLVED", hoursRemaining: 0 };
    }

    const createdTime = new Date(createdAt).getTime();
    const elapsedHours = (Date.now() - createdTime) / (1000 * 3600);
    const hoursRemaining = Math.max(0, resolutionHours - elapsedHours);

    if (elapsedHours > resolutionHours) {
      return { firstResponseHours, resolutionHours, status: "BREACHED", hoursRemaining: 0 };
    }

    if (hoursRemaining <= resolutionHours * 0.25) {
      return { firstResponseHours, resolutionHours, status: "AT_RISK", hoursRemaining: Math.round(hoursRemaining) };
    }

    return { firstResponseHours, resolutionHours, status: "WITHIN_SLA", hoursRemaining: Math.round(hoursRemaining) };
  }
}

// -------------------------------------------------------------------------
// 3. HELPDESK & SUPPORT SERVICE
// -------------------------------------------------------------------------

export class SupportHelpdeskService {
  /**
   * Creates a new support ticket
   */
  static async createTicket(params: CreateTicketParams) {
    const {
      userId,
      vendorId,
      orderId,
      subject,
      category = "Order",
      priority = "MEDIUM",
      message,
      attachments = [],
    } = params;

    // Validate attachments
    for (const att of attachments) {
      const val = AttachmentValidator.validate(att);
      if (!val.valid) {
        return { success: false, error: val.error };
      }
    }

    const ticketNumber = `TCK-${Date.now().toString().slice(-5)}`;
    const initialThread = [
      {
        senderId: userId,
        senderRole: "CUSTOMER",
        message,
        attachments,
        timestamp: new Date().toISOString(),
      },
    ];

    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        userId,
        subject: orderId ? `[Order #${orderId}] ${subject}` : subject,
        category,
        priority,
        status: "OPEN",
        messages: JSON.stringify(initialThread),
      },
    });

    const sla = SLAEngine.evaluateSLA(ticket.createdAt, priority as TicketPriority, false);

    return {
      success: true,
      ticketId: ticket.id,
      ticketNumber: ticket.ticketNumber,
      status: "OPEN" as TicketStatus,
      priority,
      category,
      sla,
      message: `Support ticket #${ticket.ticketNumber} created successfully. Our team will respond within ${sla.firstResponseHours} hours.`,
    };
  }

  /**
   * Appends a reply to an existing ticket thread
   */
  static async replyTicket(params: ReplyTicketParams) {
    const { ticketId, senderId, senderRole, message, attachments = [], newStatus } = params;

    const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
      return { success: false, error: "Ticket not found" };
    }

    // Validate attachments
    for (const att of attachments) {
      const val = AttachmentValidator.validate(att);
      if (!val.valid) {
        return { success: false, error: val.error };
      }
    }

    const thread = JSON.parse(ticket.messages || "[]");
    thread.push({
      senderId,
      senderRole,
      message,
      attachments,
      timestamp: new Date().toISOString(),
    });

    const updatedStatus = newStatus || (senderRole === "AGENT" ? "WAITING_CUSTOMER" : "IN_PROGRESS");

    const updatedTicket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        status: updatedStatus,
        messages: JSON.stringify(thread),
      },
    });

    return {
      success: true,
      ticketNumber: updatedTicket.ticketNumber,
      status: updatedStatus as TicketStatus,
      messageCount: thread.length,
      message: `Reply appended to ticket #${updatedTicket.ticketNumber}.`,
    };
  }

  /**
   * Assigns ticket to a support agent
   */
  static async assignTicket(params: AssignTicketParams) {
    const { ticketId, agentId, assignedBy } = params;

    const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
      return { success: false, error: "Ticket not found" };
    }

    const thread = JSON.parse(ticket.messages || "[]");
    thread.push({
      senderRole: "SYSTEM",
      message: `Ticket assigned to Agent ${agentId} by ${assignedBy}`,
      timestamp: new Date().toISOString(),
    });

    const updated = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        status: "ASSIGNED",
        messages: JSON.stringify(thread),
      },
    });

    return {
      success: true,
      ticketNumber: updated.ticketNumber,
      assignedAgent: agentId,
      status: "ASSIGNED" as TicketStatus,
      message: `Ticket #${updated.ticketNumber} assigned to agent ${agentId}.`,
    };
  }

  /**
   * Resolves and closes a ticket
   */
  static async closeTicket(ticketId: string, closedBy: string, resolutionSummary?: string) {
    const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
      return { success: false, error: "Ticket not found" };
    }

    const thread = JSON.parse(ticket.messages || "[]");
    thread.push({
      senderRole: "SYSTEM",
      message: `Ticket closed by ${closedBy}. ${resolutionSummary ? `Summary: ${resolutionSummary}` : ""}`,
      timestamp: new Date().toISOString(),
    });

    const updated = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        status: "CLOSED",
        messages: JSON.stringify(thread),
      },
    });

    return {
      success: true,
      ticketNumber: updated.ticketNumber,
      status: "CLOSED" as TicketStatus,
      message: `Ticket #${updated.ticketNumber} has been closed.`,
    };
  }

  /**
   * Multi-channel notification dispatcher abstraction
   */
  static async dispatchNotification(params: {
    recipientType: "CUSTOMER" | "VENDOR" | "AGENT";
    channel: "IN_APP" | "EMAIL" | "WHATSAPP" | "SMS";
    recipient: string;
    template: string;
    data: Record<string, any>;
  }) {
    // Standard provider abstraction for Email / WhatsApp / SMS
    return {
      success: true,
      channel: params.channel,
      recipient: params.recipient,
      deliveredAt: new Date().toISOString(),
    };
  }
}
