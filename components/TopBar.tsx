"use client";
import { MapPin } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-card border-b border-border py-2">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2 text-sm text-gray-400">
        <MapPin className="w-4 h-4 text-blue-accent" />
        <span>Chunabhatti, Mumbai – Your local TV repair expert</span>
        <a href="#contact" className="text-blue-accent hover:text-blue-accent/80 ml-2">
          Change area ›
        </a>
      </div>
    </div>
  );
}
