"use client";

import { useEffect, useState } from "react";
import { BUSINESS } from "@/lib/constants";

export default function LoadingScreen() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 800);
    return () => clearTimeout(timer);
  }, []);

  if (hidden) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
      }}
      className="dark:!bg-gray-950"
    >
      {/* Logo — width/height attributes prevent 2000px blowup before CSS loads */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.jpg"
        alt={BUSINESS.name}
        width={200}
        height={200}
        style={{ width: 200, height: "auto", marginBottom: 8 }}
      />
      <p style={{ fontSize: 12, color: "#6b7280", letterSpacing: "0.05em", marginBottom: 16 }}>
        Since {BUSINESS.since}
      </p>
      <div style={{ width: 128, marginTop: 16 }}>
        <div className="relative h-0.5 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full animate-loading-bar"
            style={{ background: "linear-gradient(90deg, #20c997, #38d9a9, #63e6be)" }}
          />
        </div>
      </div>
    </div>
  );
}
