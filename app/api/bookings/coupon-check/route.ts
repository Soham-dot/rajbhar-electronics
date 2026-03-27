import { NextResponse } from "next/server";
import { hasBookingCouponUsage } from "@/lib/server/db";
import { isValidPhone, normalizePhone, sanitizeText } from "@/lib/server/leads";
import {
  attachRateLimitHeaders,
  checkRateLimit,
  enforceRequestSize,
  enforceSameOrigin,
} from "../../../../lib/server/security";
import { couponCheckBodySchema } from "../../../../lib/server/schemas";

const COUPON_CHECK_BODY_LIMIT_BYTES = 8 * 1024;

export async function POST(request: Request) {
  const sameOriginError = enforceSameOrigin(request, "Invalid coupon check request origin.");
  if (sameOriginError) {
    return sameOriginError;
  }

  const sizeError = enforceRequestSize(
    request,
    COUPON_CHECK_BODY_LIMIT_BYTES,
    "Coupon check payload is too large."
  );
  if (sizeError) {
    return sizeError;
  }

  const rateLimit = checkRateLimit(request, {
    scope: "coupon-check",
    limit: 40,
    windowMs: 60 * 1000,
  });
  if (!rateLimit.allowed) {
    return attachRateLimitHeaders(
      NextResponse.json(
        {
          used: false,
          error: "Too many requests. Please try again shortly.",
        },
        { status: 429 }
      ),
      rateLimit
    );
  }

  const respond = (body: Record<string, unknown>, status = 200) =>
    attachRateLimitHeaders(NextResponse.json(body, { status }), rateLimit);

  let parsedBody: unknown;
  try {
    const rawBody = await request.text();
    parsedBody = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    return respond({ used: false, error: "Invalid request payload." }, 400);
  }

  const bodyResult = couponCheckBodySchema.safeParse(parsedBody);
  if (!bodyResult.success) {
    return respond({ used: false, error: "Invalid request payload." }, 400);
  }

  const phone = normalizePhone(bodyResult.data.phone);
  const coupon = sanitizeText(bodyResult.data.coupon, 30).toUpperCase();

  if (!phone || !coupon || !isValidPhone(phone)) {
    return respond({ used: false });
  }

  try {
    const used = await hasBookingCouponUsage(phone, coupon);
    if (used) {
      return respond(
        {
          used: true,
          error: "This coupon code has already been used with this phone number.",
        },
        409
      );
    }

    return respond({ used: false });
  } catch (error) {
    console.error("[booking:coupon-check] Validation failed:", error);
    return respond(
      { used: false, error: "Unable to validate coupon right now." },
      503
    );
  }
}

