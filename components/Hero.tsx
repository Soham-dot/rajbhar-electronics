"use client";
import {
  BadgeCheck,
  ChevronDown,
  HeartHandshake,
  LocateFixed,
  MessageCircle,
  Phone,
  Search,
  Sparkles,
  Timer,
} from "lucide-react";
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
  const bookingHref = `/book${selectedService ? `?service=${encodeURIComponent(selectedService)}` : ""}`;

  const handleBookNowClick = () => {
    if (typeof window === "undefined") return;
    window.location.href = bookingHref;
  };

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
    <section className="relative bg-background dark:bg-gray-950 pt-12 md:pt-16 pb-20 md:pb-24 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-accent/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-green-accent/15 rounded-full blur-3xl pointer-events-none" />

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

      <div
        className="absolute inset-0 pointer-events-none dark:hidden"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, var(--background) 80%)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none hidden dark:block"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, #030712 80%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-accent/30 bg-blue-accent/10 px-3 py-1.5 text-xs font-semibold text-blue-accent mb-5">
          <Sparkles className="w-3.5 h-3.5" />
          Same-day TV service in Mumbai
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-4 leading-tight">
          TV Repair at Your {" "}
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Doorstep
          </span>
        </h1>

        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
          Mumbai&apos;s trusted TV repair team since 1996. Verified technicians, upfront pricing, and fast home visits.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 max-w-3xl mx-auto mb-8">
          <div className="rounded-xl border border-border bg-card/90 dark:bg-gray-800/70 p-3 text-left">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
              <Timer className="w-3.5 h-3.5 text-blue-accent" />
              Fast Arrival
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">Technician in 30 mins</p>
          </div>
          <div className="rounded-xl border border-border bg-card/90 dark:bg-gray-800/70 p-3 text-left">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
              Warranty
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">Up to 180 days</p>
          </div>
          <div className="rounded-xl border border-border bg-card/90 dark:bg-gray-800/70 p-3 text-left">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-500" />
              Social Proof
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">10,000+ bookings</p>
          </div>
        </div>

        <div className="bg-card dark:bg-gray-800 border border-border rounded-2xl p-4 md:p-6 max-w-4xl mx-auto mb-6 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-4 text-left">
              <label className="text-xs text-muted dark:text-gray-400 uppercase tracking-wider font-semibold mb-1.5 block">
                Service
              </label>
              <div className="relative">
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full h-12 bg-white dark:bg-gray-700 border border-border text-gray-900 dark:text-white rounded-xl px-3 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-accent pr-8"
                >
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted dark:text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="md:col-span-5 text-left">
              <label className="text-xs text-muted dark:text-gray-400 uppercase tracking-wider font-semibold mb-1.5 block">
                Location
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search your location or society"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-12 bg-white dark:bg-gray-700 border border-border text-gray-900 dark:text-white rounded-xl pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-accent placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleBookNowClick}
              className="md:col-span-3 w-full h-12 font-bold px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] text-sm text-center bg-blue-accent hover:bg-blue-accent/90 text-white flex items-center justify-center"
            >
              Book Now
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={locating}
              className="flex items-center gap-2 text-blue-accent hover:text-blue-accent/80 text-xs font-medium text-left transition-colors disabled:opacity-50"
            >
              <LocateFixed className={`w-3.5 h-3.5 ${locating ? "animate-spin" : ""}`} />
              {locating ? "Detecting location..." : "Use current location"}
            </button>

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide max-w-full pb-1">
              {services.slice(0, 4).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedService(s)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    selectedService === s
                      ? "border-blue-accent bg-blue-accent text-white"
                      : "border-border bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden sm:flex flex-wrap items-center justify-center gap-3">
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            className="flex items-center gap-2 border border-gray-300 dark:border-white/20 hover:border-gray-500 dark:hover:border-white/40 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-white/5"
          >
            <Phone className="w-5 h-5" />
            Call Now
          </a>
          <a
            href={BUSINESS.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 bg-whatsapp"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}
