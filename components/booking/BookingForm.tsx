"use client";

import { useState } from "react";
import { ArrowLeft, Send, CheckCircle } from "lucide-react";
import type { CartItem } from "@/lib/booking-data";
import { BUSINESS } from "@/lib/constants";

interface BookingFormProps {
  cart: CartItem[];
  onBack: () => void;
  appliedCoupon: string | null;
  discount: number;
}

export default function BookingForm({ cart, onBack, appliedCoupon, discount }: BookingFormProps) {
  const [step, setStep] = useState<"details" | "confirmed">("details");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    date: "",
    time: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalTotal = Math.max(0, total - discount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          cart,
          appliedCoupon,
          discount,
        }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Unable to submit booking right now.");
      }

      setStep("confirmed");
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

        {/* Order summary */}
        <div className="bg-card dark:bg-gray-800 border border-border rounded-2xl p-5 text-left mb-6">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Order Summary</h3>
          <div className="divide-y divide-border">
            {cart.map((item) => (
              <div key={`${item.serviceId}-${item.issueId}`} className="flex justify-between py-2">
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">{item.serviceName}</p>
                  <p className="text-xs text-gray-500">{item.issueName} × {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-2 pt-3">
            {discount > 0 && (
              <>
                <div className="flex justify-between mb-1">
                  <p className="text-sm text-gray-500">Subtotal</p>
                  <p className="text-sm text-gray-500 line-through">₹{total}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">Coupon ({appliedCoupon})</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">-₹{discount}</p>
                </div>
              </>
            )}
            <div className="flex justify-between">
              <p className="font-bold text-gray-900 dark:text-white">Total</p>
              <p className="font-bold text-blue-accent text-lg">₹{finalTotal}</p>
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
      {/* Back to services */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-accent mb-6 transition-all duration-200 hover:scale-105"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to services
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Preferred Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full bg-white dark:bg-gray-700 border border-border text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Preferred Time</label>
                <select
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full bg-white dark:bg-gray-700 border border-border text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-accent"
                >
                  <option value="">Select time</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                  <option value="6:00 PM">6:00 PM</option>
                  <option value="7:00 PM">7:00 PM</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-blue-accent hover:bg-blue-accent/90 text-white font-bold py-3.5 rounded-xl transition-all duration-200 hover:scale-105 text-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Submitting Booking..." : `Confirm Booking · ₹${finalTotal}`}
            </button>
          </form>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="bg-card dark:bg-gray-800/60 border border-border rounded-2xl p-5 sticky top-24">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4">Order Summary</h3>
            <div className="flex flex-col gap-3">
              {cart.map((item) => (
                <div key={`${item.serviceId}-${item.issueId}`} className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">{item.serviceName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.issueName} × {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-4 pt-4">
              {discount > 0 && (
                <>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm text-gray-500">Subtotal</p>
                    <p className="text-sm text-gray-500 line-through">₹{total}</p>
                  </div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">Coupon ({appliedCoupon})</p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">-₹{discount}</p>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <p className="font-bold text-gray-900 dark:text-white">Total</p>
                <p className="font-bold text-blue-accent text-xl">₹{finalTotal}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
