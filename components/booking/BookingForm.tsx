"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, CheckCircle, Send } from "lucide-react";
import type { CartItem } from "@/lib/booking-data";
import { BUSINESS } from "@/lib/constants";
import { createIdempotencyKey } from "@/lib/client/idempotency";

const BOOKING_TIMEZONE = "Asia/Kolkata";
const INVALID_SCHEDULE_MESSAGE = "Please enter valid time or date.";
const BOOKING_TIME_SLOTS = [
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
] as const;

function parseTimeLabelToMinutes(label: string): number | null {
  const match = label.match(/^([1-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/);
  if (!match) return null;

  const hour12 = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3];

  const hour24 = (hour12 % 12) + (period === "PM" ? 12 : 0);
  return hour24 * 60 + minute;
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

const EMPTY_FORM = {
  name: "",
  phone: "",
  address: "",
  date: "",
  time: "",
};

interface BookingFormProps {
  cart: CartItem[];
  onBack: () => void;
  appliedCoupon: string | null;
  discount: number;
  onCouponBlocked?: () => void;
}

export default function BookingForm({
  cart,
  onBack,
  appliedCoupon,
  discount,
  onCouponBlocked,
}: BookingFormProps) {
  const [step, setStep] = useState<"details" | "confirmed">("details");
  const [form, setForm] = useState(EMPTY_FORM);
  const [bookingNow, setBookingNow] = useState(getNowInBookingTimezone);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const submitAttemptRef = useRef<{ fingerprint: string; key: string } | null>(null);
  const minBookingDate = bookingNow.date;
  const isTodaySelected = form.date === minBookingDate;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBookingNow(getNowInBookingTimezone());
    }, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.sessionStorage.getItem("booking-form-draft-v1");
      if (!raw) return;

      const parsed = JSON.parse(raw) as Partial<typeof EMPTY_FORM>;
      setForm({
        name: typeof parsed.name === "string" ? parsed.name : "",
        phone: typeof parsed.phone === "string" ? parsed.phone : "",
        address: typeof parsed.address === "string" ? parsed.address : "",
        date: typeof parsed.date === "string" ? parsed.date : "",
        time: typeof parsed.time === "string" ? parsed.time : "",
      });
    } catch {
      // Ignore invalid draft data
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem("booking-form-draft-v1", JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    if (!isTodaySelected || !form.time) return;

    const selectedMinutes = parseTimeLabelToMinutes(form.time);
    if (selectedMinutes === null) return;

    if (selectedMinutes <= bookingNow.minutes) {
      setForm((current) =>
        current.time ? { ...current, time: "" } : current
      );
    }
  }, [bookingNow.minutes, form.time, isTodaySelected]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalTotal = Math.max(0, total - discount);

  const validatePreferredSchedule = (): string | null => {
    if (!form.date || !form.time) return INVALID_SCHEDULE_MESSAGE;
    if (!isValidIsoDate(form.date)) return INVALID_SCHEDULE_MESSAGE;

    const selectedMinutes = parseTimeLabelToMinutes(form.time);
    if (selectedMinutes === null) return INVALID_SCHEDULE_MESSAGE;

    if (form.date < minBookingDate) return INVALID_SCHEDULE_MESSAGE;
    if (form.date === minBookingDate && selectedMinutes <= bookingNow.minutes) {
      return INVALID_SCHEDULE_MESSAGE;
    }

    if (!BOOKING_TIME_SLOTS.some((slot) => slot === form.time)) {
      return INVALID_SCHEDULE_MESSAGE;
    }

    return null;
  };

  const normalizeDateInput = (value: string): string => {
    if (!value) return "";
    if (isValidIsoDate(value)) return value;

    const match = value.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (!match) return "";

    const normalized = `${match[3]}-${match[2]}-${match[1]}`;
    return isValidIsoDate(normalized) ? normalized : "";
  };

  const handleCouponAlreadyUsed = (message: string) => {
    onCouponBlocked?.();
    if (typeof window !== "undefined") {
      window.alert(message);
    }
    setSubmitError(`${message} Coupon has been removed for this booking.`);
  };

  const validateCouponForPhone = async (): Promise<boolean> => {
    if (!appliedCoupon || !form.phone.trim()) {
      return true;
    }

    const response = await fetch("/api/bookings/coupon-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: form.phone,
        coupon: appliedCoupon,
      }),
    });

    const data = (await response.json().catch(() => null)) as
      | { used?: boolean; error?: string }
      | null;

    if (response.status === 409 || data?.used) {
      handleCouponAlreadyUsed(
        data?.error || "This coupon code has already been used with this phone number."
      );
      return false;
    }

    if (!response.ok) {
      throw new Error(data?.error || "Unable to validate coupon right now.");
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const scheduleError = validatePreferredSchedule();
      if (scheduleError) {
        throw new Error(scheduleError);
      }

      const isCouponAllowed = await validateCouponForPhone();
      if (!isCouponAllowed) {
        return;
      }

      const payload = JSON.stringify({
        ...form,
        cart,
        appliedCoupon: appliedCoupon ?? "",
        discount,
      });
      const currentAttempt = submitAttemptRef.current;
      const idempotencyKey =
        currentAttempt && currentAttempt.fingerprint === payload
          ? currentAttempt.key
          : createIdempotencyKey("booking-submit");

      submitAttemptRef.current = { fingerprint: payload, key: idempotencyKey };

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        body: payload,
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        const errorMessage = data?.error || "Unable to submit booking right now.";
        const isCouponAlreadyUsedError =
          response.status === 409 &&
          /coupon/i.test(errorMessage) &&
          /already/i.test(errorMessage) &&
          /used/i.test(errorMessage);

        if (isCouponAlreadyUsedError) {
          handleCouponAlreadyUsed(errorMessage);
          return;
        }

        throw new Error(errorMessage);
      }

      setStep("confirmed");
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("booking-form-draft-v1");
        window.sessionStorage.removeItem("booking-cart-draft-v1");
      }
      submitAttemptRef.current = null;
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === "confirmed") {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">
          Booking Confirmed!
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-2">
          Thank you, <strong className="text-gray-900 dark:text-white">{form.name}</strong>. Your booking has been received.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Our technician will call you at <strong className="text-gray-900 dark:text-white">{form.phone}</strong> within 15 minutes to confirm the appointment.
        </p>

        <div className="bg-card dark:bg-gray-800 border border-border rounded-2xl p-5 text-left mb-6">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Order Summary</h3>
          <div className="divide-y divide-border">
            {cart.map((item) => (
              <div key={`${item.serviceId}-${item.issueId}`} className="flex justify-between py-2">
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">{item.serviceName}</p>
                  <p className="text-xs text-gray-500">{item.issueName} x {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Rs{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-2 pt-3">
            {discount > 0 && (
              <>
                <div className="flex justify-between mb-1">
                  <p className="text-sm text-gray-500">Subtotal</p>
                  <p className="text-sm text-gray-500 line-through">Rs{total}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">Coupon ({appliedCoupon})</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">-Rs{discount}</p>
                </div>
              </>
            )}
            <div className="flex justify-between">
              <p className="font-bold text-gray-900 dark:text-white">Total</p>
              <p className="font-bold text-blue-accent text-lg">Rs{finalTotal}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            className="inline-flex items-center justify-center gap-2 bg-blue-accent text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-accent/90 transition-colors text-sm"
          >
            Call Us: {BUSINESS.phone}
          </a>
          <a
            href={BUSINESS.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-whatsapp text-white font-semibold px-6 py-3 rounded-xl hover:bg-whatsapp/90 transition-colors text-sm"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-accent mb-6 transition-all duration-200 hover:scale-105"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to services
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-card dark:bg-gray-800/60 border border-border rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Complete Your Booking</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter your details and we&apos;ll schedule the service</p>

          {submitError && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Rajesh Kumar"
                className="w-full bg-white dark:bg-gray-700 border border-border text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-accent placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number *</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                onBlur={() => {
                  void validateCouponForPhone().catch((error) => {
                    setSubmitError(
                      error instanceof Error
                        ? error.message
                        : "Unable to validate coupon right now."
                    );
                  });
                }}
                placeholder="+91 98765 43210"
                className="w-full bg-white dark:bg-gray-700 border border-border text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-accent placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address *</label>
              <input
                type="text"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Flat / Building, Street, Area, Mumbai"
                className="w-full bg-white dark:bg-gray-700 border border-border text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-accent placeholder:text-gray-400"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Preferred Date</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => {
                    const nextDate = normalizeDateInput(e.target.value);
                    setForm((current) => ({
                      ...current,
                      date: nextDate,
                      time: current.date === nextDate ? current.time : "",
                    }));
                  }}
                  min={minBookingDate}
                  className="w-full bg-white dark:bg-gray-700 border border-border text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Preferred Time</label>
                <select
                  required
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full bg-white dark:bg-gray-700 border border-border text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-accent"
                >
                  <option value="">Select time</option>
                  {BOOKING_TIME_SLOTS.map((timeSlot) => {
                    const minutes = parseTimeLabelToMinutes(timeSlot);
                    const isPastSlotToday =
                      isTodaySelected &&
                      minutes !== null &&
                      minutes <= bookingNow.minutes;

                    return (
                      <option key={timeSlot} value={timeSlot} disabled={isPastSlotToday}>
                        {timeSlot}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-blue-accent hover:bg-blue-accent/90 text-white font-bold py-3.5 rounded-xl transition-all duration-200 hover:scale-105 text-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Submitting Booking..." : `Confirm Booking - Rs${finalTotal}`}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-card dark:bg-gray-800/60 border border-border rounded-2xl p-5 sticky top-24">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4">Order Summary</h3>
            <div className="flex flex-col gap-3">
              {cart.map((item) => (
                <div key={`${item.serviceId}-${item.issueId}`} className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">{item.serviceName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.issueName} x {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Rs{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-4 pt-4">
              {discount > 0 && (
                <>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm text-gray-500">Subtotal</p>
                    <p className="text-sm text-gray-500 line-through">Rs{total}</p>
                  </div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">Coupon ({appliedCoupon})</p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">-Rs{discount}</p>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <p className="font-bold text-gray-900 dark:text-white">Total</p>
                <p className="font-bold text-blue-accent text-xl">Rs{finalTotal}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
