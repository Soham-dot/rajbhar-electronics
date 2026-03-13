"use client";

import { Ticket, ChevronRight, Gift, BadgePercent, Stethoscope } from "lucide-react";
import { useState } from "react";

const offers = [
  {
    icon: Gift,
    title: "First Repair 10% Off",
    description: "New customers get 10% off on first repair service",
    code: "FIRST10",
    color: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50",
    bgDark: "dark:bg-emerald-900/20",
  },
  {
    icon: BadgePercent,
    title: "Flat ₹100 Off on AMC",
    description: "Annual Maintenance Contract at special discounted rate",
    code: "AMC100",
    color: "from-blue-500 to-indigo-600",
    bgLight: "bg-blue-50",
    bgDark: "dark:bg-blue-900/20",
  },
  {
    icon: Stethoscope,
    title: "Free Check-Up",
    description: "Free TV health check-up with any repair service",
    code: "FREECHECK",
    color: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-50",
    bgDark: "dark:bg-amber-900/20",
  },
];

export default function Offers() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section className="bg-background dark:bg-gray-950 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
            <Ticket className="w-3.5 h-3.5" />
            Special Offers
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">
            Deals & Discounts
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Save more on your TV repair with these exclusive offers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {offers.map((offer) => {
            const Icon = offer.icon;
            const isCopied = copiedCode === offer.code;
            return (
              <div
                key={offer.code}
                className={`relative overflow-hidden rounded-2xl border border-border ${offer.bgLight} ${offer.bgDark} p-5 group hover:shadow-lg transition-all`}
              >
                {/* Gradient accent strip */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${offer.color}`}
                />

                <div className="flex items-start gap-4">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${offer.color} flex items-center justify-center shrink-0 shadow-sm`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                      {offer.description}
                    </p>
                    <button
                      onClick={() => handleCopy(offer.code)}
                      className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-gray-700 dark:text-gray-300 hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-200 hover:scale-105"
                    >
                      {isCopied ? (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          Copied!
                        </span>
                      ) : (
                        <>
                          {offer.code}
                          <ChevronRight className="w-3 h-3 text-gray-400" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
