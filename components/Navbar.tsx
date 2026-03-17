"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, Menu, Phone, X } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import ThemeToggle from "./ThemeToggle";

const leftLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "How It Works", href: "/about" },
  { label: "Rate Card", href: "/rate-card" },
];

const rightLinks = [
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 nav-gradient border-b border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center min-h-[64px]">
          <div className="flex items-center gap-8">
            {leftLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors text-[15px] font-medium tracking-tight after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-blue-accent after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link href="/" className="flex flex-col items-center px-8">
            <div className="h-[44px] overflow-hidden flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpg" alt="Rajbhar Electronics" className="h-[100px] w-auto object-cover" />
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 tracking-[0.15em] font-medium">SINCE 1996</p>
          </Link>

          <div className="flex items-center justify-end gap-8">
            {rightLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors text-[15px] font-medium tracking-tight after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-blue-accent after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-[15px] font-medium"
            >
              <Phone className="w-4 h-4" />
              {BUSINESS.phone}
            </a>
            <Link
              href="/book"
              className="bg-blue-accent hover:bg-blue-accent/90 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:scale-105 transition-all duration-200"
            >
              Book Now
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <div className="flex md:hidden items-center justify-between gap-2 py-2.5">
          <Link href="/" className="flex flex-col items-start">
            <div className="h-8 overflow-hidden flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpg" alt="Rajbhar Electronics" className="h-[56px] w-auto object-cover" />
            </div>
            <p className="text-[9px] text-gray-500 dark:text-gray-400 tracking-[0.12em] font-semibold">SINCE 1996</p>
          </Link>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              aria-label="Call now"
              className="h-10 w-10 rounded-xl border border-border bg-white/80 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 flex items-center justify-center"
            >
              <Phone className="w-4.5 h-4.5" />
            </a>
            <Link
              href="/book"
              className="h-10 px-3 rounded-xl bg-blue-accent text-white text-sm font-bold inline-flex items-center"
            >
              Book
            </Link>
            <button
              className="h-10 w-10 rounded-xl border border-border bg-white/80 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 flex items-center justify-center"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-border bg-white/95 dark:bg-gray-950/95 backdrop-blur px-4 pb-4 pt-3">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="h-11 rounded-xl border border-border bg-card dark:bg-gray-800 text-sm font-semibold text-gray-900 dark:text-white inline-flex items-center justify-center gap-1.5"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
            <a
              href={BUSINESS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 rounded-xl bg-whatsapp text-sm font-semibold text-white inline-flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            {[...leftLinks, ...rightLinks].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="h-11 px-3 rounded-xl border border-border bg-card dark:bg-gray-800 text-sm font-medium text-gray-800 dark:text-gray-200 inline-flex items-center justify-between"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-card dark:bg-gray-800 px-3 py-2.5">
            <span className="text-sm text-gray-700 dark:text-gray-300">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
  );
}
