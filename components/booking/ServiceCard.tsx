"use client";

import { ChevronDown, ChevronUp, Plus, Star } from "lucide-react";
import { useState } from "react";
import type { CartItem, ServiceItem } from "@/lib/booking-data";

interface ServiceCardProps {
  service: ServiceItem;
  cart: CartItem[];
  onAddToCart: (serviceId: string, issueId: string, serviceName: string, issueName: string, price: number) => void;
  onOpenDetails?: (service: ServiceItem) => void;
  defaultExpanded?: boolean;
}

export default function ServiceCard({
  service,
  cart,
  onAddToCart,
  onOpenDetails,
  defaultExpanded = false,
}: ServiceCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const issueCount = service.issueTypes.length;
  const addedIssues = cart.filter((item) => item.serviceId === service.id);
  const canOpenDetails = Boolean(onOpenDetails);

  const handleCardClick = () => {
    if (!onOpenDetails) return;
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024) {
      onOpenDetails(service);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`border border-border rounded-2xl bg-card dark:bg-gray-800/60 overflow-hidden transition-all hover:border-blue-accent/30 shadow-sm ${
        canOpenDetails ? "cursor-pointer lg:cursor-default" : ""
      }`}
    >
      <div className="p-4 md:p-5">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-1.5">{service.title}</h3>
            <div className="flex items-center gap-1.5 mb-2">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{service.rating}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">({service.reviews} reviews)</span>
            </div>
            <p className="text-sm text-gray-900 dark:text-white">
              Starts at <span className="font-bold text-xl">Rs{service.startingPrice}</span>
            </p>
            {service.note && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{service.note}</p>}
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <button
              onClick={(event) => {
                event.stopPropagation();
                if (!expanded) setExpanded(true);
                else {
                  const first = service.issueTypes[0];
                  onAddToCart(service.id, first.id, service.title, first.name, first.price);
                }
              }}
              className="min-w-[92px] h-10 px-3 border-2 border-blue-accent text-blue-accent rounded-xl text-sm font-bold hover:bg-blue-accent hover:text-white transition-all duration-200"
            >
              {addedIssues.length > 0 ? `Added (${addedIssues.reduce((t, i) => t + i.quantity, 0)})` : "Add"}
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                setExpanded(!expanded);
              }}
              className="flex items-center gap-0.5 text-xs text-gray-500 dark:text-gray-400 hover:text-blue-accent transition-colors"
            >
              {issueCount} options
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {onOpenDetails && (
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenDetails(service);
                }}
                className="text-[11px] text-blue-accent font-semibold underline underline-offset-2 lg:hidden"
              >
                View details
              </button>
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border bg-gray-50/50 dark:bg-gray-900/30">
          <div className="p-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Select issue type
            </p>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {service.issueTypes.map((issue) => {
                const inCart = cart.find((c) => c.serviceId === service.id && c.issueId === issue.id);
                return (
                  <div
                    key={issue.id}
                    className={`shrink-0 w-52 border rounded-xl p-3.5 transition-all ${
                      inCart
                        ? "border-blue-accent bg-blue-accent/5 dark:bg-blue-accent/10"
                        : "border-border bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1 truncate">{issue.name}</p>
                    <div className="flex items-center gap-1 mb-1.5">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300">{issue.rating}</span>
                      <span className="text-[11px] text-gray-400">({issue.reviews})</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-2.5">Rs{issue.price}</p>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        onAddToCart(service.id, issue.id, service.title, issue.name, issue.price);
                      }}
                      className={`w-full h-9 rounded-lg text-xs font-bold transition-all duration-200 ${
                        inCart
                          ? "bg-blue-accent text-white"
                          : "border border-blue-accent text-blue-accent hover:bg-blue-accent hover:text-white"
                      }`}
                    >
                      {inCart ? `Added x ${inCart.quantity}` : (
                        <span className="flex items-center justify-center gap-1">
                          <Plus className="w-3 h-3" /> Add
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
