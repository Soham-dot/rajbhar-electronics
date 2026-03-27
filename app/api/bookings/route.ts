import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import {
  beginApiIdempotency,
  completeApiIdempotency,
  hasBookingCouponUsage,
  logCouponReuseBlockedAttempt,
  storeBookingLead,
} from "@/lib/server/db";
import { sendBookingLeadEmail } from "@/lib/server/email";
import { BOOKING_SERVICES, applyCoupon, type CartItem } from "@/lib/booking-data";
import {
  buildBookingWhatsappUrl,
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
import { bookingBodySchema } from "../../../lib/server/schemas";

const BOOKING_BODY_LIMIT_BYTES = 32 * 1024;
const MAX_LINE_ITEM_QTY = 10;
const MAX_LINE_ITEMS = 25;
const IDEMPOTENCY_TTL_SECONDS = 24 * 60 * 60;
const BOOKING_TIMEZONE = "Asia/Kolkata";
const INVALID_SCHEDULE_MESSAGE = "Please enter valid time or date.";
const BOOKING_TIME_SLOT_SET = new Set([
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
]);

const SERVICE_BY_ID = new Map(BOOKING_SERVICES.map((service) => [service.id, service]));

function parseTimeLabelToMinutes(label: string): number | null {
  const match = label.match(/^([1-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/);
  if (!match) return null;

  const hour12 = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3];
  const hour24 = (hour12 % 12) + (period === "PM" ? 12 : 0);

  return hour24 * 60 + minute;
}

function getNowInBookingTimezone() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BOOKING_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const partValue = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  const year = Number(partValue("year"));
  const month = partValue("month");
  const day = partValue("day");
  const hour = Number(partValue("hour"));
  const minute = Number(partValue("minute"));

  return {
    date: `${year}-${month}-${day}`,
    minutes: hour * 60 + minute,
  };
}

function isValidIsoDate(value: string): boolean {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (month < 1 || month > 12 || day < 1 || day > 31) return false;

  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function validatePreferredSchedule(date: string, time: string): string | null {
  if (!date || !time) return INVALID_SCHEDULE_MESSAGE;
  if (!isValidIsoDate(date)) return INVALID_SCHEDULE_MESSAGE;
  if (!BOOKING_TIME_SLOT_SET.has(time)) return INVALID_SCHEDULE_MESSAGE;

  const now = getNowInBookingTimezone();
  if (date < now.date) {
    return INVALID_SCHEDULE_MESSAGE;
  }

  const selectedMinutes = parseTimeLabelToMinutes(time);
  if (selectedMinutes === null) return INVALID_SCHEDULE_MESSAGE;

  if (date === now.date && selectedMinutes <= now.minutes) {
    return INVALID_SCHEDULE_MESSAGE;
  }

  return null;
}

function normalizeCart(cartInput: unknown): CartItem[] {
  if (!Array.isArray(cartInput)) return [];

  const normalizedItems = new Map<string, CartItem>();

  for (const item of cartInput) {
    if (!item || typeof item !== "object") continue;

    const entry = item as {
      serviceId?: unknown;
      issueId?: unknown;
      quantity?: unknown;
    };

    const serviceId = sanitizeText(entry.serviceId, 80);
    const issueId = sanitizeText(entry.issueId, 80);
    const quantity = Number(entry.quantity);

    if (!serviceId || !issueId) continue;
    if (!Number.isFinite(quantity) || quantity <= 0) continue;

    const service = SERVICE_BY_ID.get(serviceId);
    const issue = service?.issueTypes.find((issueOption) => issueOption.id === issueId);
    if (!service || !issue) continue;

    const safeQuantity = Math.max(
      1,
      Math.min(MAX_LINE_ITEM_QTY, Math.floor(quantity))
    );
    const lineKey = `${service.id}:${issue.id}`;
    const existing = normalizedItems.get(lineKey);

    if (existing) {
      existing.quantity = Math.min(MAX_LINE_ITEM_QTY, existing.quantity + safeQuantity);
      normalizedItems.set(lineKey, existing);
      continue;
    }

    if (normalizedItems.size >= MAX_LINE_ITEMS) {
      break;
    }

    normalizedItems.set(lineKey, {
      serviceId: service.id,
      issueId: issue.id,
      serviceName: service.title,
      issueName: issue.name,
      quantity: safeQuantity,
      price: issue.price,
    });
  }

  return Array.from(normalizedItems.values());
}

export async function POST(request: Request) {
  const sameOriginError = enforceSameOrigin(request, "Invalid booking request origin.");
  if (sameOriginError) {
    return sameOriginError;
  }

  const sizeError = enforceRequestSize(
    request,
    BOOKING_BODY_LIMIT_BYTES,
    "Booking payload is too large."
  );
  if (sizeError) {
    return sizeError;
  }

  const rateLimit = checkRateLimit(request, {
    scope: "booking-submit",
    limit: 6,
    windowMs: 10 * 60 * 1000,
  });
  if (!rateLimit.allowed) {
    return attachRateLimitHeaders(
      NextResponse.json(
        {
          ok: false,
          error: "Too many booking attempts. Please wait a few minutes and try again.",
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

  const bodyResult = bookingBodySchema.safeParse(parsedBody);
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
      scope: "booking-submit",
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
        scope: "booking-submit",
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
  const address = sanitizeText(bodyResult.data.address, 220);
  const date = sanitizeText(bodyResult.data.date, 30);
  const time = sanitizeText(bodyResult.data.time, 30);
  const requestedCoupon = sanitizeText(bodyResult.data.appliedCoupon, 30).toUpperCase();

  if (name.length < 2) {
    return respond({ ok: false, error: "Please enter a valid name." }, 400);
  }

  if (!isValidPhone(phone)) {
    return respond({ ok: false, error: "Please enter a valid phone number." }, 400);
  }

  if (address.length < 8) {
    return respond({ ok: false, error: "Please enter a complete address." }, 400);
  }

  const scheduleValidationError = validatePreferredSchedule(date, time);
  if (scheduleValidationError) {
    return respond({ ok: false, error: scheduleValidationError }, 400);
  }

  const cart = normalizeCart(bodyResult.data.cart);
  if (cart.length === 0) {
    return respond({ ok: false, error: "Your booking cart is empty." }, 400);
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let appliedCoupon = "";
  let discount = 0;
  if (requestedCoupon) {
    try {
      const alreadyUsed = await hasBookingCouponUsage(phone, requestedCoupon);
      if (alreadyUsed) {
        const blockedAt = new Date().toISOString();
        const blockedLogResult = await logCouponReuseBlockedAttempt({
          source: "website-booking-form",
          createdAt: blockedAt,
          userAgent: request.headers.get("user-agent") ?? "unknown",
          name,
          phone,
          address,
          date,
          time,
          attemptedCoupon: requestedCoupon,
          cart,
          total,
        });

        if (blockedLogResult.error) {
          console.warn(
            "[lead:coupon_blocked] Failed to store blocked attempt:",
            blockedLogResult.error
          );
        }

        return respond(
          {
            ok: false,
            error: "This coupon code has already been used with this phone number.",
          },
          409
        );
      }
    } catch (error) {
      console.error("[booking:coupon-validate] Validation failed:", error);
      return respond(
        { ok: false, error: "Unable to validate coupon right now." },
        503
      );
    }

    const couponResult = applyCoupon(requestedCoupon, cart);
    if (!couponResult.valid) {
      return respond({ ok: false, error: couponResult.message }, 400);
    }

    appliedCoupon = requestedCoupon;
    discount = couponResult.discount;
  }

  const finalTotal = Math.max(0, total - discount);

  const createdAt = new Date().toISOString();
  const bookingId = `BK-${randomUUID().split("-")[0].toUpperCase()}`;

  const lead = {
    type: "booking" as const,
    source: "website-booking-form",
    bookingId,
    createdAt,
    customer: {
      name,
      phone,
      address,
      date,
      time,
    },
    cart,
    pricing: {
      total,
      discount,
      finalTotal,
      appliedCoupon,
    },
    userAgent: request.headers.get("user-agent") ?? "unknown",
  };

  const webhookResult = await sendLeadToWebhook(lead);

  const databaseResult = await storeBookingLead({
    source: lead.source,
    bookingId,
    createdAt,
    userAgent: lead.userAgent,
    name,
    phone,
    address,
    date,
    time,
    cart,
    appliedCoupon,
    discount,
    total,
    finalTotal,
  });

  const emailResult = await sendBookingLeadEmail({
    bookingId,
    createdAt,
    name,
    phone,
    address,
    date,
    time,
    cart,
    appliedCoupon,
    discount,
    total,
    finalTotal,
  });

  const hasDelivered = webhookResult.delivered || emailResult.delivered || databaseResult.stored;
  const allSkipped = webhookResult.skipped && emailResult.skipped && databaseResult.skipped;

  if (!hasDelivered && !allSkipped) {
    return respond(
      { ok: false, error: "Unable to confirm booking right now. Please try again." },
      502
    );
  }

  if (allSkipped) {
    console.warn("[lead:booking] No delivery channel configured.", {
      bookingId,
      source: lead.source,
      createdAt,
      itemCount: cart.length,
    });
  }

  if (webhookResult.error) {
    console.warn("[lead:booking] Webhook delivery issue:", webhookResult.error);
  }

  if (emailResult.error) {
    console.warn("[lead:booking] Email delivery issue:", emailResult.error);
  }

  if (databaseResult.error) {
    console.warn("[lead:booking] Database storage issue:", databaseResult.error);
  }

  return respond(
    {
      ok: true,
      bookingId,
      message: "Booking received successfully.",
      finalTotal,
      whatsappUrl: buildBookingWhatsappUrl({
        name,
        phone,
        address,
        date,
        time,
        cart,
        appliedCoupon,
        discount,
        total,
        finalTotal,
      }),
      createdAt,
    },
    201
  );
}
