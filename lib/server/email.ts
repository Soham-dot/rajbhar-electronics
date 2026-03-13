import { Resend } from "resend";
import { BUSINESS } from "@/lib/constants";
import type { BookingLead, ContactLead } from "@/lib/server/leads";

export interface LeadEmailResult {
  delivered: boolean;
  skipped: boolean;
  provider: "resend";
  id?: string;
  error?: string;
}

interface EmailConfig {
  apiKey: string;
  from: string;
  to: string;
}

function getEmailConfig(): EmailConfig | null {
  const apiKey = process.env.RESEND_API_KEY?.trim() ?? "";
  const from = process.env.LEADS_FROM_EMAIL?.trim() ?? "";
  const to = process.env.LEADS_NOTIFY_EMAIL?.trim() ?? BUSINESS.email;

  if (!apiKey || !from || !to) {
    return null;
  }

  return { apiKey, from, to };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendEmail(params: {
  subject: string;
  text: string;
  html: string;
}): Promise<LeadEmailResult> {
  const config = getEmailConfig();

  if (!config) {
    return {
      delivered: false,
      skipped: true,
      provider: "resend",
    };
  }

  const resend = new Resend(config.apiKey);

  try {
    const response = await resend.emails.send({
      from: config.from,
      to: config.to,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });

    if (response.error) {
      return {
        delivered: false,
        skipped: false,
        provider: "resend",
        error: response.error.message,
      };
    }

    return {
      delivered: true,
      skipped: false,
      provider: "resend",
      id: response.data?.id,
    };
  } catch (error) {
    return {
      delivered: false,
      skipped: false,
      provider: "resend",
      error: error instanceof Error ? error.message : "Unknown email error",
    };
  }
}

export async function sendContactLeadEmail(input: ContactLead & { createdAt: string }): Promise<LeadEmailResult> {
  const issueText = input.issue || "Not provided";
  const tvBrandText = input.tvBrand || "Not provided";

  const subject = `New Contact Lead - ${input.name}`;
  const text = [
    "New contact lead received from website.",
    "",
    `Name: ${input.name}`,
    `Phone: ${input.phone}`,
    `TV Brand: ${tvBrandText}`,
    `Issue: ${issueText}`,
    `Submitted At: ${input.createdAt}`,
  ].join("\n");

  const html = `
    <h2>New contact lead received</h2>
    <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(input.phone)}</p>
    <p><strong>TV Brand:</strong> ${escapeHtml(tvBrandText)}</p>
    <p><strong>Issue:</strong> ${escapeHtml(issueText)}</p>
    <p><strong>Submitted At:</strong> ${escapeHtml(input.createdAt)}</p>
  `;

  return sendEmail({ subject, text, html });
}

export async function sendBookingLeadEmail(
  input: BookingLead & { bookingId: string; createdAt: string }
): Promise<LeadEmailResult> {
  const dateText = input.date || "Not provided";
  const timeText = input.time || "Not provided";
  const couponText = input.appliedCoupon || "None";

  const cartRowsText = input.cart
    .map(
      (item, index) =>
        `${index + 1}. ${item.serviceName} - ${item.issueName} x${item.quantity} (INR ${item.price * item.quantity})`
    )
    .join("\n");

  const cartRowsHtml = input.cart
    .map(
      (item) =>
        `<li>${escapeHtml(item.serviceName)} - ${escapeHtml(item.issueName)} x${item.quantity} (INR ${item.price * item.quantity})</li>`
    )
    .join("");

  const subject = `New Booking Lead - ${input.bookingId}`;
  const text = [
    "New booking lead received from website.",
    "",
    `Booking ID: ${input.bookingId}`,
    `Name: ${input.name}`,
    `Phone: ${input.phone}`,
    `Address: ${input.address}`,
    `Preferred Date: ${dateText}`,
    `Preferred Time: ${timeText}`,
    "",
    "Service Details:",
    cartRowsText,
    "",
    `Subtotal: INR ${input.total}`,
    `Discount: INR ${input.discount}`,
    `Coupon: ${couponText}`,
    `Final Total: INR ${input.finalTotal}`,
    `Submitted At: ${input.createdAt}`,
  ].join("\n");

  const html = `
    <h2>New booking lead received</h2>
    <p><strong>Booking ID:</strong> ${escapeHtml(input.bookingId)}</p>
    <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(input.phone)}</p>
    <p><strong>Address:</strong> ${escapeHtml(input.address)}</p>
    <p><strong>Preferred Date:</strong> ${escapeHtml(dateText)}</p>
    <p><strong>Preferred Time:</strong> ${escapeHtml(timeText)}</p>
    <h3>Service Details</h3>
    <ul>${cartRowsHtml}</ul>
    <p><strong>Subtotal:</strong> INR ${input.total}</p>
    <p><strong>Discount:</strong> INR ${input.discount}</p>
    <p><strong>Coupon:</strong> ${escapeHtml(couponText)}</p>
    <p><strong>Final Total:</strong> INR ${input.finalTotal}</p>
    <p><strong>Submitted At:</strong> ${escapeHtml(input.createdAt)}</p>
  `;

  return sendEmail({ subject, text, html });
}
