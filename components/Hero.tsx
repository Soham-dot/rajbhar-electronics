"use client";
import { MessageCircle, Phone, ChevronDown } from "lucide-react";
import { useState } from "react";
import { BUSINESS } from "@/lib/constants";

const services = [
  "LED/LCD TV Repair",
  "Smart TV Repair",
  "CRT TV Repair",
  "TV Installation",
  "Annual Maintenance",
  "Emergency Repair",
];

export default function Hero() {
  const [selectedService, setSelectedService] = useState("");
  const [location, setLocation] = useState("");

  return (
    <section className="relative bg-background pt-16 pb-24 overflow-hidden">
      {/* Background gradient blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-accent/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-green-accent/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 text-center">
        {/* Badge pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <span className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-1.5 text-sm text-muted">
            <span className="w-2 h-2 rounded-full bg-green-accent animate-pulse" />
            Open Now · Chunabhatti, Mumbai
          </span>
          <span className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-1.5 text-sm text-muted">
            <span className="w-2 h-2 rounded-full bg-green-accent animate-pulse" />
            Accepting bookings Mon–Sun, 9 AM–8 PM
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          TV Repair at Your{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Doorstep
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Mumbai&apos;s most trusted TV repair service since 1996. Expert technicians at your home within{" "}
          <span className="text-white font-semibold">30 minutes</span>. All brands, all models.
        </p>

        {/* Service selector card */}
        <div className="bg-card border border-border rounded-2xl p-4 md:p-6 max-w-3xl mx-auto mb-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted uppercase tracking-wider font-semibold text-left">
                Service
              </label>
              <div className="relative">
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full bg-background border border-border text-white rounded-lg px-3 py-2.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-accent pr-8"
                >
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted uppercase tracking-wider font-semibold text-left">
                Location
              </label>
              <input
                type="text"
                placeholder="Enter your area"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-background border border-border text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-accent placeholder:text-gray-500"
              />
            </div>
            <div className="flex items-end">
              <a
                href="#contact"
                className="w-full bg-blue-accent hover:bg-blue-accent/90 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors text-sm text-center"
              >
                Book Now
              </a>
            </div>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            className="flex items-center gap-2 border border-white/20 hover:border-white/40 text-white px-6 py-3 rounded-xl font-medium transition-all hover:bg-white/5"
          >
            <Phone className="w-5 h-5" />
            Call Now
          </a>
          <a
            href={BUSINESS.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-medium transition-all bg-whatsapp"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}
