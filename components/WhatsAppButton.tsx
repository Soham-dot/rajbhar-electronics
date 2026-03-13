"use client";
import { MessageCircle } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export default function WhatsAppButton() {
  return (
    <a
      href={BUSINESS.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold px-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="hidden sm:inline text-sm">WhatsApp Us</span>
    </a>
  );
}
