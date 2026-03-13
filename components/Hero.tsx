"use client";
import { MessageCircle, Phone, ChevronDown, Timer, BadgeCheck, HeartHandshake, LocateFixed, Search } from "lucide-react";
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
  const [locating, setLocating] = useState(false);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const area =
            data.address?.suburb ||
            data.address?.neighbourhood ||
            data.address?.city_district ||
            data.address?.city ||
            "";
          setLocation(area);
        } catch {
          setLocation("Mumbai");
        } finally {
          setLocating(false);
        }
      },
      () => setLocating(false),
      { timeout: 10000 }
    );
  };

  return (
    <section className="relative bg-background dark:bg-gray-950 pt-16 pb-24 overflow-hidden">
      {/* Background gradient blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-accent/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-green-accent/15 rounded-full blur-3xl pointer-events-none" />

      {/* TV-related background illustration */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero-bg.svg"
        alt=""
        aria-hidden="true"
        width={900}
        height={700}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-[0.15] dark:opacity-[0.12]"
        loading="eager"
      />
      <div className="absolute inset-0 pointer-events-none dark:hidden" style={{ background: "radial-gradient(ellipse at center, transparent 40%, var(--background) 80%)" }} />
      <div className="absolute inset-0 pointer-events-none hidden dark:block" style={{ background: "radial-gradient(ellipse at center, transparent 40%, #030712 80%)" }} />

      <div className="relative max-w-7xl mx-auto px-4 text-center">
        {/* Badge pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <span className="flex items-center gap-2 bg-card dark:bg-gray-800 border border-border rounded-full px-4 py-1.5 text-sm text-muted dark:text-gray-300">
            <span className="w-2 h-2 rounded-full bg-green-accent animate-pulse" />
            Serving All Mumbai
          </span>
          <span className="flex items-center gap-2 bg-card dark:bg-gray-800 border border-border rounded-full px-4 py-1.5 text-sm text-muted dark:text-gray-300">
            <span className="w-2 h-2 rounded-full bg-green-accent animate-pulse" />
            Accepting bookings Mon–Sun, 9 AM–10 PM
          </span>
        </div>

        {/* Availability & Warranty highlights */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 bg-blue-accent/10 dark:bg-blue-accent/20 rounded-lg flex items-center justify-center">
              <Timer className="w-4 h-4 text-blue-accent" />
            </div>
            <div className="text-left">
              <span className="block text-xs text-gray-500 dark:text-gray-400 leading-none">Available</span>
              <span className="block text-sm font-bold text-gray-900 dark:text-white leading-tight">In 30 mins</span>
            </div>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 hidden sm:block" />
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <BadgeCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-left">
              <span className="block text-xs text-gray-500 dark:text-gray-400 leading-none">Warranty</span>
              <span className="block text-sm font-bold text-gray-900 dark:text-white leading-tight">Up to 180 days</span>
            </div>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 hidden sm:block" />
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 bg-amber-500/10 dark:bg-amber-500/20 rounded-lg flex items-center justify-center">
              <HeartHandshake className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-left">
              <span className="block text-xs text-gray-500 dark:text-gray-400 leading-none">Trusted by</span>
              <span className="block text-sm font-bold text-gray-900 dark:text-white leading-tight">10,000+ customers</span>
            </div>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          TV Repair at Your{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Doorstep
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Mumbai&apos;s most trusted TV repair service since 1996. Expert technicians at your home within{" "}
          <span className="text-gray-900 dark:text-white font-semibold">30 minutes</span>. All brands, all models.
        </p>

        {/* Service selector card */}
        <div className="bg-card dark:bg-gray-800 border border-border rounded-2xl p-4 md:p-6 max-w-3xl mx-auto mb-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted dark:text-gray-400 uppercase tracking-wider font-semibold text-left">
                Service
              </label>
              <div className="relative">
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full bg-white dark:bg-gray-700 border border-border text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-accent pr-8"
                >
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted dark:text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted dark:text-gray-400 uppercase tracking-wider font-semibold text-left">
                Location
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search for your location/society/apartment"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white dark:bg-gray-700 border border-border text-gray-900 dark:text-white rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-accent placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={locating}
                className="flex items-center gap-2 text-blue-accent hover:text-blue-accent/80 text-xs font-medium mt-1 text-left transition-colors disabled:opacity-50"
              >
                <LocateFixed className={`w-3.5 h-3.5 ${locating ? "animate-spin" : ""}`} />
                {locating ? "Detecting location..." : "Use current location"}
              </button>
            </div>
            <div className="flex items-end">
              <a
                href={!location.trim() ? undefined : `/book${selectedService ? `?service=${encodeURIComponent(selectedService)}` : ""}`}
                onClick={(e) => {
                  if (!location.trim()) e.preventDefault();
                }}
                className="w-full font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 hover:scale-105 text-sm text-center bg-blue-accent hover:bg-blue-accent/90 text-white"
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
            className="flex items-center gap-2 border border-gray-300 dark:border-white/20 hover:border-gray-500 dark:hover:border-white/40 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-100 dark:hover:bg-white/5"
          >
            <Phone className="w-5 h-5" />
            Call Now
          </a>
          <a
            href={BUSINESS.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 bg-whatsapp"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}
