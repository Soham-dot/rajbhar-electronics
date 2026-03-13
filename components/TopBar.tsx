"use client";
import { MapPin } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-card dark:bg-gray-900 border-b border-border py-2">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2 text-sm text-gray-400 dark:text-gray-500">
        <MapPin className="w-4 h-4 text-blue-accent" />
        <span>Serving All Mumbai – Your trusted TV repair expert</span>
      </div>
    </div>
  );
}
