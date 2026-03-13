import { NextResponse } from "next/server";
import {
  buildBookingWhatsappUrl,
  isValidPhone,
  normalizePhone,
  sanitizeText,
  sendLeadToWebhook,
  type LeadCartItem,
} from "@/lib/server/leads";

interface BookingRequestBody {
  name?: unknown;
  phone?: unknown;
  address?: unknown;
  date?: unknown;
  time?: unknown;
  cart?: unknown;
  appliedCoupon?: unknown;
  discount?: unknown;
}

function normalizeCart(cartInput: unknown): LeadCartItem[] {
  if (!Array.isArray(cartInput)) return [];

  const normalizedItems: LeadCartItem[] = [];

  for (const item of cartInput) {
    if (!item || typeof item !== "object") continue;

    const entry = item as {
      serviceName?: unknown;
      issueName?: unknown;
      quantity?: unknown;
      price?: unknown;
    };

    const serviceName = sanitizeText(entry.serviceName, 80);
    const issueName = sanitizeText(entry.issueName, 80);

    const quantity = Number(entry.quantity);
    const price = Number(entry.price);

    if (!serviceName || !issueName) continue;
    if (!Number.isFinite(quantity) || !Number.isFinite(price)) continue;

    const safeQuantity = Math.max(1, Math.floor(quantity));
    const safePrice = Math.max(0, Math.floor(price));

    normalizedItems.push({
      serviceName,
      issueName,
      quantity: safeQuantity,
      price: safePrice,
    });
  }

  return normalizedItems;
}

export async function POST(request: Request) {
  let body: BookingRequestBody;

  try {
    body = (await request.json()) as BookingRequestBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request payload." },
      { status: 400 }
    );
  }

  const name = sanitizeText(body.name, 80);
  const phone = normalizePhone(body.phone);
  const address = sanitizeText(body.address, 220);
  const date = sanitizeText(body.date, 30);
  const time = sanitizeText(body.time, 30);
  const appliedCoupon = sanitizeText(body.appliedCoupon, 30);
  const discountInput = Number(body.discount);
  const discount = Number.isFinite(discountInput) ? Math.max(0, Math.floor(discountInput)) : 0;

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

  if (address.length < 8) {
    return NextResponse.json(
      { ok: false, error: "Please enter a complete address." },
      { status: 400 }
    );
  }

  const cart = normalizeCart(body.cart);
  if (cart.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Your booking cart is empty." },
      { status: 400 }
    );
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalTotal = Math.max(0, total - discount);

  const createdAt = new Date().toISOString();
  const bookingId = `BK-${Date.now().toString(36).toUpperCase()}`;

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
  if (!webhookResult.delivered && !webhookResult.skipped) {
    return NextResponse.json(
      { ok: false, error: "Unable to confirm booking right now. Please try again." },
      { status: 502 }
    );
  }

  if (webhookResult.skipped) {
    console.info("[lead:booking] LEADS_WEBHOOK_URL not set. Payload kept in logs.", lead);
  }

  return NextResponse.json(
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
    { status: 201 }
  );
}
