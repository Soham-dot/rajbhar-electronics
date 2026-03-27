import { NextResponse } from "next/server";
import {
  beginApiIdempotency,
  completeApiIdempotency,
  storeContactLead,
} from "@/lib/server/db";
import { sendContactLeadEmail } from "@/lib/server/email";
import {
  buildContactWhatsappUrl,
  isValidPhone,
  normalizePhone,
  sanitizeText,
  sendLeadToWebhook,
} from "@/lib/server/leads";
import {
  attachRateLimitHeaders,
  checkRateLimit,
  enforceRequestSize,
  enforceSameOrigin,
  parseIdempotencyKey,
  sha256Hex,
} from "../../../lib/server/security";
import { contactBodySchema } from "../../../lib/server/schemas";

const CONTACT_BODY_LIMIT_BYTES = 12 * 1024;
const IDEMPOTENCY_TTL_SECONDS = 24 * 60 * 60;

export async function POST(request: Request) {
  const sameOriginError = enforceSameOrigin(request, "Invalid form submission origin.");
  if (sameOriginError) {
    return sameOriginError;
  }

  const sizeError = enforceRequestSize(
    request,
    CONTACT_BODY_LIMIT_BYTES,
    "Contact payload is too large."
  );
  if (sizeError) {
    return sizeError;
  }

  const rateLimit = checkRateLimit(request, {
    scope: "contact-submit",
    limit: 6,
    windowMs: 10 * 60 * 1000,
  });
  if (!rateLimit.allowed) {
    return attachRateLimitHeaders(
      NextResponse.json(
        {
          ok: false,
          error: "Too many requests. Please wait a few minutes and try again.",
        },
        { status: 429 }
      ),
      rateLimit
    );
  }

  const idempotencyHeader = parseIdempotencyKey(
    request.headers.get("idempotency-key")
  );
  if (idempotencyHeader.error) {
    return attachRateLimitHeaders(
      NextResponse.json({ ok: false, error: idempotencyHeader.error }, { status: 400 }),
      rateLimit
    );
  }

  let rawBody = "";
  let parsedBody: unknown;
  try {
    rawBody = await request.text();
    parsedBody = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    return attachRateLimitHeaders(
      NextResponse.json({ ok: false, error: "Invalid request payload." }, { status: 400 }),
      rateLimit
    );
  }

  const bodyResult = contactBodySchema.safeParse(parsedBody);
  if (!bodyResult.success) {
    return attachRateLimitHeaders(
      NextResponse.json({ ok: false, error: "Invalid request payload." }, { status: 400 }),
      rateLimit
    );
  }

  const idempotencyKey = idempotencyHeader.key;
  let idempotencyMode: "new" | "skipped" = "skipped";

  if (idempotencyKey) {
    const idempotencyStart = await beginApiIdempotency({
      scope: "contact-submit",
      idempotencyKey,
      requestHash: sha256Hex(rawBody),
      ttlSeconds: IDEMPOTENCY_TTL_SECONDS,
    });

    if (idempotencyStart.mode === "replay") {
      const response = attachRateLimitHeaders(
        NextResponse.json(idempotencyStart.responsePayload, {
          status: idempotencyStart.statusCode,
        }),
        rateLimit
      );
      response.headers.set("Idempotency-Key", idempotencyKey);
      response.headers.set("X-Idempotent-Replay", "true");
      return response;
    }

    if (idempotencyStart.mode === "conflict") {
      const response = attachRateLimitHeaders(
        NextResponse.json(
          {
            ok: false,
            error: "This Idempotency-Key was already used with a different payload.",
          },
          { status: 409 }
        ),
        rateLimit
      );
      response.headers.set("Idempotency-Key", idempotencyKey);
      return response;
    }

    if (idempotencyStart.mode === "pending") {
      const response = attachRateLimitHeaders(
        NextResponse.json(
          {
            ok: false,
            error: "A request with this Idempotency-Key is already in progress.",
          },
          { status: 409 }
        ),
        rateLimit
      );
      response.headers.set("Idempotency-Key", idempotencyKey);
      return response;
    }

    if (idempotencyStart.mode === "new") {
      idempotencyMode = "new";
    }
  }

  const respond = async (body: Record<string, unknown>, status = 200) => {
    if (idempotencyKey && idempotencyMode === "new") {
      await completeApiIdempotency({
        scope: "contact-submit",
        idempotencyKey,
        statusCode: status,
        responsePayload: body,
      });
    }

    const response = attachRateLimitHeaders(
      NextResponse.json(body, { status }),
      rateLimit
    );

    if (idempotencyKey) {
      response.headers.set("Idempotency-Key", idempotencyKey);
    }

    return response;
  };

  const name = sanitizeText(bodyResult.data.name, 80);
  const phone = normalizePhone(bodyResult.data.phone);
  const tvBrand = sanitizeText(bodyResult.data.tvBrand, 80);
  const issue = sanitizeText(bodyResult.data.issue, 600);

  if (name.length < 2) {
    return respond({ ok: false, error: "Please enter a valid name." }, 400);
  }

  if (!isValidPhone(phone)) {
    return respond({ ok: false, error: "Please enter a valid phone number." }, 400);
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

  const databaseResult = await storeContactLead({
    source: lead.source,
    createdAt,
    userAgent: lead.userAgent,
    name,
    phone,
    tvBrand,
    issue,
  });

  const emailResult = await sendContactLeadEmail({
    name,
    phone,
    tvBrand,
    issue,
    createdAt,
  });

  const hasDelivered =
    webhookResult.delivered || emailResult.delivered || databaseResult.stored;
  const allSkipped =
    webhookResult.skipped && emailResult.skipped && databaseResult.skipped;

  if (!hasDelivered && !allSkipped) {
    return respond(
      {
        ok: false,
        error: "Unable to submit right now. Please try again in a moment.",
      },
      502
    );
  }

  if (allSkipped) {
    console.warn("[lead:contact] No delivery channel configured.", {
      source: lead.source,
      createdAt,
      contactNameLength: name.length,
      hasIssue: Boolean(issue),
    });
  }

  if (webhookResult.error) {
    console.warn("[lead:contact] Webhook delivery issue:", webhookResult.error);
  }

  if (emailResult.error) {
    console.warn("[lead:contact] Email delivery issue:", emailResult.error);
  }

  if (databaseResult.error) {
    console.warn("[lead:contact] Database storage issue:", databaseResult.error);
  }

  return respond(
    {
      ok: true,
      message: "Contact request received. We'll call you within 15 minutes.",
      whatsappUrl: buildContactWhatsappUrl({ name, phone, tvBrand, issue }),
      createdAt,
    },
    201
  );
}

