"use client";
import { useState } from "react";
import { Tv, Phone, Menu, X } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0f1a]/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Tv className="w-7 h-7 text-blue-400" />
          <div>
            <p className="font-bold text-white text-lg leading-none">{BUSINESS.name}</p>
            <p className="text-xs text-gray-400">Since {BUSINESS.since} · Chunabhatti</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            className="flex items-center gap-2 text-gray-300 hover:text-white text-sm"
          >
            <Phone className="w-4 h-4" />
            {BUSINESS.phone}
          </a>
          <a
            href="#contact"
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Book Repair
          </a>
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
            <a
              key={link.href}
              href={link.href}
              className="text-gray-300 hover:text-white text-sm"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            className="flex items-center gap-2 text-gray-300 text-sm"
          >
            <Phone className="w-4 h-4" />
            {BUSINESS.phone}
          </a>
          <a
            href="#contact"
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg font-medium text-center"
          >
            Book Repair
          </a>
        </div>
      )}
    </nav>
  );
}
