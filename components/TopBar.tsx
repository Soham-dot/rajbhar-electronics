"use client";
import { MapPin } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-[#0d1424] border-b border-white/5 py-2">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2 text-sm text-gray-400">
        <MapPin className="w-4 h-4 text-blue-400" />
        <span>Chunabhatti, Mumbai – Your local TV repair expert</span>
        <a href="#contact" className="text-blue-400 hover:text-blue-300 ml-2">
          Change area ›
        </a>
      </div>
    </div>
  );
}
