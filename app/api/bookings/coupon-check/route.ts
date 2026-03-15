import { NextResponse } from "next/server";
import { hasBookingCouponUsage } from "@/lib/server/db";
import { normalizePhone, sanitizeText } from "@/lib/server/leads";

interface CouponCheckBody {
  phone?: unknown;
  coupon?: unknown;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as CouponCheckBody | null;
  const phone = normalizePhone(body?.phone);
  const coupon = sanitizeText(body?.coupon, 30).toUpperCase();

  if (!phone || !coupon) {
    return NextResponse.json({ used: false });
  }

  try {
    const used = await hasBookingCouponUsage(phone, coupon);
    if (used) {
      return NextResponse.json(
        {
          used: true,
          error: "This coupon code has already been used with this phone number.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json({ used: false });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to validate coupon right now.";
    return NextResponse.json(
      { used: false, error: message },
      { status: 503 }
    );
  }
}
