import { NextResponse } from "next/server";
import { sendContactLeadEmail } from "@/lib/server/email";
import {
  buildContactWhatsappUrl,
  isValidPhone,
  normalizePhone,
  sanitizeText,
  sendLeadToWebhook,
} from "@/lib/server/leads";

interface ContactRequestBody {
  name?: unknown;
  phone?: unknown;
  tvBrand?: unknown;
  issue?: unknown;
}

export async function POST(request: Request) {
  let body: ContactRequestBody;

  try {
    body = (await request.json()) as ContactRequestBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request payload." },
      { status: 400 }
    );
  }

  const name = sanitizeText(body.name, 80);
  const phone = normalizePhone(body.phone);
  const tvBrand = sanitizeText(body.tvBrand, 80);
  const issue = sanitizeText(body.issue, 600);

  if (name.length < 2) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid name." },
      { status: 400 }
    );
  }

  if (!isValidPhone(phone)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid phone number." },
      { status: 400 }
    );
  }

  const createdAt = new Date().toISOString();
  const lead = {
    type: "contact" as const,
    source: "website-contact-form",
    createdAt,
    name,
    phone,
    tvBrand,
    issue,
    userAgent: request.headers.get("user-agent") ?? "unknown",
  };

  const webhookResult = await sendLeadToWebhook(lead);

  const emailResult = await sendContactLeadEmail({
    name,
    phone,
    tvBrand,
    issue,
    createdAt,
  });

  const hasDelivered = webhookResult.delivered || emailResult.delivered;
  const allSkipped = webhookResult.skipped && emailResult.skipped;

  if (!hasDelivered && !allSkipped) {
    return NextResponse.json(
      { ok: false, error: "Unable to submit right now. Please try again in a moment." },
      { status: 502 }
    );
  }

  if (allSkipped) {
    console.info("[lead:contact] No delivery channel configured (webhook/email). Payload kept in logs.", lead);
  }

  if (webhookResult.error) {
    console.warn("[lead:contact] Webhook delivery issue:", webhookResult.error);
  }

  if (emailResult.error) {
    console.warn("[lead:contact] Email delivery issue:", emailResult.error);
  }

  return NextResponse.json(
    {
      ok: true,
      message: "Booking request received. We'll call you within 15 minutes.",
      whatsappUrl: buildContactWhatsappUrl({ name, phone, tvBrand, issue }),
      createdAt,
    },
    { status: 201 }
  );
}
