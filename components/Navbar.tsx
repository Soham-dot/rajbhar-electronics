"use client";
import { useState } from "react";
import Link from "next/link";
import { Tv, Phone, Menu, X } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "How It Works", href: "/about" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Tv className="w-7 h-7 text-blue-accent" />
          <div>
            <p className="font-bold text-white text-lg leading-none">{BUSINESS.name}</p>
            <p className="text-xs text-gray-400">Since {BUSINESS.since} · Chunabhatti</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            className="flex items-center gap-2 text-muted hover:text-white text-sm"
          >
            <Phone className="w-4 h-4 text-blue-accent" />
            {BUSINESS.phone}
          </a>
          <Link
            href="/contact"
            className="bg-blue-accent hover:bg-blue-accent/90 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Book Repair
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0d1424] border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-300 hover:text-white text-sm"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            className="flex items-center gap-2 text-gray-300 text-sm"
          >
            <Phone className="w-4 h-4" />
            {BUSINESS.phone}
          </a>
          <Link
            href="/contact"
            className="bg-blue-accent hover:bg-blue-accent/90 text-white text-sm px-4 py-2 rounded-lg font-medium text-center"
            onClick={() => setMobileOpen(false)}
          >
            Book Repair
          </Link>
        </div>
      )}
    </nav>
  );
}
