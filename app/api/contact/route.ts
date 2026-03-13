import { NextResponse } from "next/server";
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
  if (!webhookResult.delivered && !webhookResult.skipped) {
    return NextResponse.json(
      { ok: false, error: "Unable to submit right now. Please try again in a moment." },
      { status: 502 }
    );
  }

  if (webhookResult.skipped) {
    console.info("[lead:contact] LEADS_WEBHOOK_URL not set. Payload kept in logs.", lead);
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
