import { BUSINESS } from "@/lib/constants";

export interface LeadCartItem {
  serviceName: string;
  issueName: string;
  quantity: number;
  price: number;
}

export interface ContactLead {
  name: string;
  phone: string;
  tvBrand: string;
  issue: string;
}

export interface BookingLead {
  name: string;
  phone: string;
  address: string;
  date: string;
  time: string;
  cart: LeadCartItem[];
  appliedCoupon: string;
  discount: number;
  total: number;
  finalTotal: number;
}

export interface LeadWebhookResult {
  delivered: boolean;
  skipped: boolean;
  statusCode?: number;
  error?: string;
}

const MIN_PHONE_DIGITS = 10;
const MAX_PHONE_DIGITS = 15;

export function sanitizeText(value: unknown, maxLength = 250): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

export function normalizePhone(value: unknown): string {
  const raw = sanitizeText(value, 30);
  if (!raw) return "";

  const hasPlus = raw.startsWith("+");
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";

  return `${hasPlus ? "+" : ""}${digits}`;
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= MIN_PHONE_DIGITS && digits.length <= MAX_PHONE_DIGITS;
}

function getBusinessWhatsappBaseUrl(): string {
  const phoneDigits = BUSINESS.phoneRaw.replace(/\D/g, "");
  return `https://wa.me/${phoneDigits}`;
}

export function buildContactWhatsappUrl(lead: ContactLead): string {
  const lines = [
    "Hi, I want to book TV repair service.",
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
  ];

  if (lead.tvBrand) {
    lines.push(`TV Brand: ${lead.tvBrand}`);
  }

  if (lead.issue) {
    lines.push(`Issue: ${lead.issue}`);
  }

  return `${getBusinessWhatsappBaseUrl()}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function buildBookingWhatsappUrl(lead: BookingLead): string {
  const lines = [
    "Hi, I placed a booking request from the website.",
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Address: ${lead.address}`,
    lead.date ? `Preferred Date: ${lead.date}` : "",
    lead.time ? `Preferred Time: ${lead.time}` : "",
    "",
    "Service Details:",
    ...lead.cart.map(
      (item, index) =>
        `${index + 1}. ${item.serviceName} - ${item.issueName} x${item.quantity} (INR ${item.price * item.quantity})`
    ),
    "",
    `Total: INR ${lead.finalTotal}`,
    lead.appliedCoupon ? `Coupon: ${lead.appliedCoupon} (Saved INR ${lead.discount})` : "",
  ].filter(Boolean);

  return `${getBusinessWhatsappBaseUrl()}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export async function sendLeadToWebhook(payload: unknown): Promise<LeadWebhookResult> {
  const webhookUrl = process.env.LEADS_WEBHOOK_URL?.trim();

  if (!webhookUrl) {
    return { delivered: false, skipped: true };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        delivered: false,
        skipped: false,
        statusCode: response.status,
        error: `Webhook responded with status ${response.status}`,
      };
    }

    return {
      delivered: true,
      skipped: false,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      delivered: false,
      skipped: false,
      error: error instanceof Error ? error.message : "Unknown webhook error",
    };
  } finally {
    clearTimeout(timeout);
  }
}
