"use client";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

const tvBrands = [
  "Samsung", "LG", "Sony", "Panasonic", "Mi (Xiaomi)", "OnePlus", "TCL",
  "Hisense", "Philips", "BPL", "Videocon", "Other",
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    tvBrand: "",
    issue: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Unable to submit request right now.");
      }

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      setFormData({ name: "", phone: "", tvBrand: "", issue: "" });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-white dark:bg-gray-950 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-blue-accent text-sm font-semibold uppercase tracking-wider">
            Get In Touch
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2 mb-4">Book a Repair</h2>
          <p className="text-gray-400 dark:text-gray-300 max-w-xl mx-auto">
            Fill out the form below or give us a call. We&apos;ll get back to you within minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="bg-card dark:bg-gray-800 border border-border rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Book Your Service</h3>

            {submitted && (
              <div className="mb-4 bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-green-400 text-sm">
                Booking received! We&apos;ll call you within 15 minutes.
              </div>
            )}

            {submitError && (
              <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1.5">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Rajesh Kumar"
                  className="w-full bg-white dark:bg-background border border-border text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-accent placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1.5">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-white dark:bg-background border border-border text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-accent placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1.5">TV Brand</label>
                <select
                  value={formData.tvBrand}
                  onChange={(e) => setFormData({ ...formData, tvBrand: e.target.value })}
                  className="w-full bg-white dark:bg-background border border-border text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-accent"
                >
                  <option value="">Select TV brand</option>
                  {tvBrands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1.5">Describe the Issue</label>
                <textarea
                  rows={4}
                  value={formData.issue}
                  onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                  placeholder="E.g., TV screen has black spots, no display, not turning on..."
                  className="w-full bg-white dark:bg-background border border-border text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-accent placeholder:text-gray-500 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-accent hover:bg-blue-accent/90 text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-105 text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {submitting ? "Submitting..." : "Submit Booking Request"}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            {/* Info cards */}
            <div className="bg-card dark:bg-gray-800 border border-border rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Contact Information</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-blue-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-blue-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Address</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {BUSINESS.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-blue-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-blue-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Phone</p>
                    <a href={`tel:${BUSINESS.phoneRaw}`} className="text-sm text-blue-accent hover:text-blue-accent/80">
                      {BUSINESS.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-blue-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-blue-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Email</p>
                    <a href={`mailto:${BUSINESS.email}`} className="text-sm text-blue-accent hover:text-blue-accent/80">
                      {BUSINESS.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-blue-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-blue-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Business Hours</p>
                    <p className="text-sm text-gray-400">{BUSINESS.hours}</p>
                    <p className="text-xs text-green-accent mt-0.5">Open now</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-card dark:bg-gray-800 border border-border rounded-2xl overflow-hidden flex-1 min-h-[180px] relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 bg-blue-accent/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-accent" />
                </div>
                <div className="text-center">
                  <p className="text-gray-900 dark:text-white font-semibold text-sm">Find Us on Google Maps</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs mt-0.5 max-w-xs">{BUSINESS.address}</p>
                </div>
                <a
                  href={BUSINESS.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-xs bg-blue-accent hover:bg-blue-accent/90 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Open in Maps
                </a>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={BUSINESS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center justify-center gap-3 rounded-2xl py-4 font-semibold text-white transition-all hover:opacity-90 bg-whatsapp"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp for Instant Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

