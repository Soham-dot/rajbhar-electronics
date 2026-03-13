"use client";
import { useState } from "react";
import Link from "next/link";
import { Phone, Menu, X } from "lucide-react";
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
      <div className="max-w-7xl mx-auto px-6 py-0">
        {/* Desktop Nav - Logo Centered like Zaptoz */}
        <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center min-h-[64px]">
          {/* Left Nav Links */}
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

          {/* Center Logo — large, no box */}
          <Link href="/" className="flex flex-col items-center px-8">
            <div className="h-[44px] overflow-hidden flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.jpg"
                alt="Rajbhar Electronics"
                className="h-[100px] w-auto object-cover"
              />
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 tracking-[0.15em] font-medium">SINCE 1996</p>
          </Link>

          {/* Right Nav Links + Actions */}
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

        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between py-2">
          <Link href="/" className="flex flex-col items-center">
            <div className="h-8 overflow-hidden flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.jpg"
                alt="Rajbhar Electronics"
                className="h-[56px] w-auto object-cover"
              />
            </div>
            <p className="text-[8px] text-gray-400 dark:text-gray-500 tracking-[0.15em] font-medium">SINCE 1996</p>
          </Link>
          <button
            className="text-gray-700 dark:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-background border-t border-gray-200 dark:border-border px-4 py-4 flex flex-col gap-4">
          {[...leftLinks, ...rightLinks].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm"
          >
            <Phone className="w-4 h-4" />
            {BUSINESS.phone}
          </a>
          <Link
            href="/book"
            className="bg-blue-accent hover:bg-blue-accent/90 text-white text-sm font-semibold px-5 py-2.5 rounded-xl text-center hover:scale-105 transition-all duration-200"
            onClick={() => setMobileOpen(false)}
          >
            Book Now
          </Link>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
  );
}
