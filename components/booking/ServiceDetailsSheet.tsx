"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  ChevronDown,
  Filter,
  ShieldCheck,
  Star,
  Wrench,
  X,
} from "lucide-react";
import type { CartItem, ServiceItem } from "@/lib/booking-data";

interface ServiceDetailsSheetProps {
  open: boolean;
  service: ServiceItem | null;
  cart: CartItem[];
  onClose: () => void;
  onAddToCart: (
    serviceId: string,
    issueId: string,
    serviceName: string,
    issueName: string,
    price: number
  ) => void;
  onUpdateQuantity: (serviceId: string, issueId: string, delta: number) => void;
}

const PROCESS_STEPS = [
  {
    title: "Inspection & quote",
    description:
      "We inspect the appliance and share a repair quote for approval.",
  },
  {
    title: "Approval or expert review",
    description:
      "Repair begins after your approval. If needed, our expert explains options first.",
  },
  {
    title: "Repair & spare parts",
    description:
      "If needed, we source spare parts at fixed rates before starting work.",
  },
  {
    title: "Warranty activation",
    description:
      "Your appliance comes under up to 180 days warranty after the repair.",
  },
];

const BRANDS = [
  "Samsung",
  "LG",
  "Panasonic",
  "BPL",
  "Whirlpool",
  "VU",
  "Hisense",
  "HCL",
  "TCL",
  "Sony",
  "Xiaomi",
  "& more",
];

const REVIEW_FILTERS = ["Most detailed", "In my area", "Frequent users"];

function parseReviewCount(reviews: string): number {
  const value = reviews.trim().toUpperCase();
  if (value.endsWith("K")) {
    const num = Number.parseFloat(value.slice(0, -1));
    if (Number.isFinite(num)) return Math.round(num * 1000);
  }
  const numeric = Number.parseInt(value.replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(numeric) ? numeric : 0;
}

function formatCompact(num: number): string {
  if (num >= 1000) {
    const compact = (num / 1000).toFixed(num >= 10000 ? 0 : 1);
    return `${compact.replace(/\.0$/, "")}K`;
  }
  return `${num}`;
}

function buildReviewRows(service: ServiceItem) {
  const issueA = service.issueTypes[0]?.name ?? "display issue";
  const issueB = service.issueTypes[1]?.name ?? "power issue";
  const issueC = service.issueTypes[2]?.name ?? "sound issue";

  return [
    {
      author: "Amit S.",
      rating: 5,
      text: `Technician reached on time and fixed ${issueA.toLowerCase()} quickly. Very professional service.`,
    },
    {
      author: "Priya M.",
      rating: 5,
      text: `Good diagnosis for ${issueB.toLowerCase()} and clear pricing before repair.`,
    },
    {
      author: "Rohan K.",
      rating: 4,
      text: `Overall smooth experience. ${issueC} was resolved and TV is working fine now.`,
    },
  ];
}

export default function ServiceDetailsSheet({
  open,
  service,
  cart,
  onClose,
  onAddToCart,
  onUpdateQuantity,
}: ServiceDetailsSheetProps) {
  const [faqOpen, setFaqOpen] = useState(true);

  useEffect(() => {
    if (!open) return;
    if (typeof window !== "undefined" && window.innerWidth >= 1024) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const serviceCartItems = useMemo(() => {
    if (!service) return [];
    return cart.filter((item) => item.serviceId === service.id);
  }, [cart, service]);

  const selectedCount = serviceCartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const selectedTotal = serviceCartItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const reviewTotal = service ? parseReviewCount(service.reviews) : 0;
  const ratingRows = [
    { stars: 5, count: Math.max(1, Math.round(reviewTotal * 0.92)) },
    { stars: 4, count: Math.max(1, Math.round(reviewTotal * 0.03)) },
    { stars: 3, count: Math.max(1, Math.round(reviewTotal * 0.015)) },
    { stars: 2, count: Math.max(1, Math.round(reviewTotal * 0.01)) },
    { stars: 1, count: Math.max(1, Math.round(reviewTotal * 0.025)) },
  ];
  const maxBarCount = Math.max(...ratingRows.map((row) => row.count), 1);

  const reviewCards = useMemo(
    () => (service ? buildReviewRows(service) : []),
    [service]
  );

  if (!open || !service) return null;

  return (
    <div className="fixed inset-0 z-[80] lg:hidden">
      <button
        aria-label="Close details"
        className="absolute inset-0 bg-black/55"
        onClick={onClose}
      />

      <div className="absolute inset-x-0 top-20 bottom-0">
        <div className="h-full rounded-t-3xl bg-white dark:bg-gray-950 overflow-hidden flex flex-col shadow-2xl">
          <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-950/95 backdrop-blur border-b border-border">
            <div className="p-4 flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400">Mumbai</p>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {service.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-gray-800 dark:text-gray-200" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pb-28">
            <div className="h-52 relative bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-500">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.24),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.18),transparent_35%)]" />
              <div className="absolute left-4 bottom-4 text-white">
                <p className="text-[11px] uppercase tracking-wider text-white/80">
                  Expert Home Service
                </p>
                <h3 className="text-3xl font-black">{service.title}</h3>
              </div>
            </div>

            <div className="px-4 py-5 border-b border-border">
              <h4 className="text-4xl font-black text-gray-900 dark:text-white">
                {service.title}
              </h4>
              <div className="mt-2 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold">{service.rating.toFixed(2)}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({service.reviews} reviews)
                </span>
              </div>
            </div>

            <div className="p-4 border-b border-border">
              <Link
                href="/rate-card"
                className="flex items-center justify-between rounded-2xl bg-gray-100 dark:bg-gray-900 p-4"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-accent" />
                  <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      Standard rate card
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Fixed pricing and clear estimate before repair
                    </p>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5 -rotate-90 text-gray-400" />
              </Link>
            </div>

            <div className="p-4 border-b border-border">
              <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                Select issue type
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {service.issueTypes.map((issue) => {
                  const inCart = serviceCartItems.find((item) => item.issueId === issue.id);
                  return (
                    <div
                      key={issue.id}
                      className="rounded-2xl border border-border bg-white dark:bg-gray-900 p-3"
                    >
                      <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                        {issue.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        <Star className="w-3 h-3 inline mr-1 fill-amber-400 text-amber-400" />
                        {issue.rating.toFixed(2)} ({issue.reviews} reviews)
                      </p>
                      <p className="text-3xl font-black text-gray-900 dark:text-white mt-2">
                        Rs{issue.price}
                      </p>

                      {inCart ? (
                        <div className="mt-3 border border-blue-accent rounded-xl flex items-center justify-between px-3 py-2">
                          <button
                            onClick={() => onUpdateQuantity(service.id, issue.id, -1)}
                            className="text-xl leading-none text-blue-accent"
                          >
                            -
                          </button>
                          <span className="text-sm font-bold text-blue-accent">
                            {inCart.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(service.id, issue.id, 1)}
                            className="text-xl leading-none text-blue-accent"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            onAddToCart(
                              service.id,
                              issue.id,
                              service.title,
                              issue.name,
                              issue.price
                            )
                          }
                          className="mt-3 w-full rounded-xl border border-blue-accent py-2 text-sm font-bold text-blue-accent hover:bg-blue-accent hover:text-white transition-colors"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-b border-border">
              <button
                onClick={() => setFaqOpen((prev) => !prev)}
                className="w-full rounded-2xl border border-border px-4 py-3 text-left flex items-center justify-between"
              >
                <span className="text-2xl font-semibold text-gray-900 dark:text-white leading-snug">
                  What if the appliance can not be repaired at home?
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${faqOpen ? "rotate-180" : ""}`}
                />
              </button>
              {faqOpen && (
                <p className="text-base text-gray-600 dark:text-gray-300 mt-3 px-1 leading-relaxed">
                  Our technician shares clear next steps and quote details. If workshop
                  repair is required, we guide pickup options after your approval.
                </p>
              )}
            </div>

            <div className="p-4 border-b border-border">
              <h4 className="text-6xl leading-none font-black text-gray-900 dark:text-white">
                {service.rating.toFixed(2)}
              </h4>
              <p className="text-3xl text-gray-600 dark:text-gray-300 mt-2 mb-6">
                {service.reviews} reviews
              </p>
              <div className="space-y-3">
                {ratingRows.map((row) => (
                  <div key={row.stars} className="flex items-center gap-3">
                    <span className="w-7 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {row.stars}
                    </span>
                    <div className="h-2 flex-1 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <div
                        className="h-full bg-gray-900 dark:bg-white rounded-full"
                        style={{ width: `${(row.count / maxBarCount) * 100}%` }}
                      />
                    </div>
                    <span className="w-12 text-sm text-right text-gray-600 dark:text-gray-400">
                      {formatCompact(row.count)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-5xl leading-none font-black text-gray-900 dark:text-white">
                  All reviews
                </h4>
                <button className="text-blue-accent text-sm font-bold flex items-center gap-1">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                {REVIEW_FILTERS.map((filter) => (
                  <button
                    key={filter}
                    className="shrink-0 px-3 py-2 rounded-xl border border-border text-sm text-gray-700 dark:text-gray-300"
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                {reviewCards.map((review, index) => (
                  <div
                    key={`${review.author}-${index}`}
                    className="rounded-2xl border border-border p-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {review.author}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {review.rating}/5
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-b border-border">
              <h4 className="text-5xl leading-none font-black text-gray-900 dark:text-white mb-6">
                Our process
              </h4>
              <div className="space-y-5">
                {PROCESS_STEPS.map((step, index) => (
                  <div key={step.title} className="grid grid-cols-[30px_1fr] gap-4">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-bold text-gray-900 dark:text-white flex items-center justify-center">
                        {index + 1}
                      </div>
                      {index < PROCESS_STEPS.length - 1 && (
                        <div className="absolute left-1/2 top-8 -translate-x-1/2 w-px h-[calc(100%+10px)] bg-gray-200 dark:bg-gray-700" />
                      )}
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {step.title}
                      </p>
                      <p className="text-base text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-b border-border">
              <div className="rounded-3xl bg-gray-100 dark:bg-gray-900 p-4">
                <h4 className="text-5xl leading-none font-black text-gray-900 dark:text-white mb-5">
                  Top technicians
                </h4>
                <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <BadgeCheck className="w-5 h-5 text-blue-accent mt-0.5" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Background verified
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Wrench className="w-5 h-5 text-blue-accent mt-0.5" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Trained across all major brands
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="w-5 h-5 text-blue-accent mt-0.5" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Certified and warranty backed
                      </p>
                    </div>
                  </div>
                  <div className="w-24 h-24 rounded-full bg-gradient-to-b from-blue-accent to-emerald-500 text-white text-xs font-bold flex items-center justify-center text-center p-2">
                    Team
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4">
              <h4 className="text-5xl leading-none font-black text-gray-900 dark:text-white mb-4">
                We service all brands
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {BRANDS.map((brand) => (
                  <div
                    key={brand}
                    className="rounded-2xl border border-border bg-gray-50 dark:bg-gray-900 py-5 text-center text-sm font-bold text-gray-700 dark:text-gray-200"
                  >
                    {brand}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 border-t border-border bg-white dark:bg-gray-950 p-3">
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <div className="rounded-xl bg-gray-100 dark:bg-gray-900 px-4 py-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedCount > 0
                    ? `${selectedCount} item${selectedCount > 1 ? "s" : ""}`
                    : "Starting at"}
                </p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">
                  Rs{selectedCount > 0 ? selectedTotal : service.startingPrice}
                </p>
              </div>
              <button
                onClick={() => {
                  if (selectedCount === 0) {
                    const firstIssue = service.issueTypes[0];
                    onAddToCart(
                      service.id,
                      firstIssue.id,
                      service.title,
                      firstIssue.name,
                      firstIssue.price
                    );
                    return;
                  }
                  onClose();
                }}
                className="min-w-[150px] rounded-2xl bg-blue-accent text-white font-bold text-xl px-6"
              >
                {selectedCount > 0 ? "Done" : "Add"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
