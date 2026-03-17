"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Phone } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export default function WhatsAppButton() {
  const pathname = usePathname();
  const hideCtas =
    pathname.startsWith("/admin") || pathname.startsWith("/book");

  if (hideCtas) return null;

  return (
    <>
      <a
        href={BUSINESS.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="hidden md:flex fixed bottom-6 right-6 z-50 items-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold px-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm">WhatsApp Us</span>
      </a>

      <a
        href={`tel:${BUSINESS.phoneRaw}`}
        aria-label="Call now"
        className="hidden md:flex fixed bottom-24 left-6 z-50 items-center gap-2 bg-blue-accent hover:bg-blue-accent/90 text-white font-semibold px-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
      >
        <Phone className="w-5 h-5" />
        <span className="text-sm">Call Now</span>
      </a>

      <div className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t border-border bg-white/95 dark:bg-gray-900/95 backdrop-blur px-3 py-2 pb-[calc(env(safe-area-inset-bottom)+8px)]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 gap-2">
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            className="h-12 rounded-xl bg-gray-900 dark:bg-gray-700 text-white font-bold text-sm flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Call Now
          </a>
          <Link
            href="/book"
            className="h-12 rounded-xl bg-blue-accent text-white font-bold text-sm flex items-center justify-center"
          >
            Book Service
          </Link>
        </div>
      </div>
    </>
  );
}
