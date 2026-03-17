"use client";
import { Clock3, MapPin } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-card/95 dark:bg-gray-900/95 border-b border-border backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="hidden sm:flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="w-4 h-4 text-blue-accent" />
          <span>Serving all Mumbai - trusted TV repair experts</span>
        </div>
        <div className="sm:hidden flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-accent/30 bg-blue-accent/10 px-2.5 py-1">
            <MapPin className="w-3.5 h-3.5 text-blue-accent" />
            <span className="text-[11px] font-semibold text-blue-accent">Mumbai Service Live</span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-600 dark:text-gray-300">
            <Clock3 className="w-3.5 h-3.5 text-emerald-500" />
            30 min slots
          </div>
        </div>
      </div>
    </div>
  );
}
