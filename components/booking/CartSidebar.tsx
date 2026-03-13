"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, Trash2, ShieldCheck, BadgeCheck, Receipt, ArrowRight, Tag, X, FileText } from "lucide-react";
import type { CartItem } from "@/lib/booking-data";
import { applyCoupon } from "@/lib/booking-data";

interface CartSidebarProps {
  cart: CartItem[];
  onUpdateQuantity: (serviceId: string, issueId: string, delta: number) => void;
  onRemove: (serviceId: string, issueId: string) => void;
  onCheckout: () => void;
  appliedCoupon: string | null;
  discount: number;
  onApplyCoupon: (code: string, discount: number) => void;
  onRemoveCoupon: () => void;
}

export default function CartSidebar({ cart, onUpdateQuantity, onRemove, onCheckout, appliedCoupon, discount, onApplyCoupon, onRemoveCoupon }: CartSidebarProps) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const finalTotal = Math.max(0, total - discount);

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");

  return (
    <div className="flex flex-col gap-4">
      {/* Cart */}
      <div className="bg-card dark:bg-gray-800/60 border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Cart
          </h3>
          {itemCount > 0 && (
            <span className="bg-blue-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {itemCount}
            </span>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">No items in your cart</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Add a service to get started</p>
          </div>
        ) : (
          <div>
            {/* Cart items */}
            <div className="divide-y divide-border">
              {cart.map((item) => (
                <div key={`${item.serviceId}-${item.issueId}`} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {item.serviceName}
                      </p>
                      <p className="text-xs text-blue-accent mt-0.5">{item.issueName}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white shrink-0">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(item.serviceId, item.issueId, -1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center text-sm font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.serviceId, item.issueId, 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => onRemove(item.serviceId, item.issueId)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon section */}
            <div className="p-4 border-t border-border">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{appliedCoupon}</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-500">-₹{discount} off</p>
                    </div>
                  </div>
                  <button onClick={onRemoveCoupon} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                      placeholder="Coupon code"
                      className="flex-1 bg-white dark:bg-gray-700 border border-border text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-accent placeholder:text-gray-400"
                    />
                    <button
                      onClick={() => {
                        const result = applyCoupon(couponInput, cart);
                        if (result.valid) {
                          onApplyCoupon(couponInput.toUpperCase().trim(), result.discount);
                          setCouponInput("");
                          setCouponError("");
                        } else {
                          setCouponError(result.message);
                        }
                      }}
                      className="bg-blue-accent hover:bg-blue-accent/90 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-xs text-red-500 mt-1.5">{couponError}</p>}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {["FIRST10", "AMC100", "FREECHECK"].map((code) => (
                      <button
                        key={code}
                        onClick={() => setCouponInput(code)}
                        className="text-[10px] border border-dashed border-blue-accent/50 text-blue-accent px-2 py-0.5 rounded hover:bg-blue-accent/10 transition-colors"
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Total & checkout */}
            <div className="p-4 bg-blue-accent">
              {discount > 0 && (
                <div className="flex justify-between text-white/70 text-xs mb-1">
                  <span>Subtotal</span>
                  <span className="line-through">₹{total}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-emerald-200 text-xs mb-2">
                  <span>Coupon discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <button
                onClick={onCheckout}
                className="w-full flex items-center justify-between text-white transition-all duration-200 hover:scale-105"
              >
                <span className="text-lg font-bold">₹{finalTotal}</span>
                <span className="flex items-center gap-2 font-bold text-sm">
                  View Cart
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Our Promise */}
      <div className="bg-card dark:bg-gray-800/60 border border-border rounded-2xl p-5">
        <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">Our Promise</h4>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <BadgeCheck className="w-4 h-4 text-blue-accent shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Verified Professionals</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-blue-accent shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-300">180 Days Warranty</span>
          </div>
          <div className="flex items-center gap-3">
            <Receipt className="w-4 h-4 text-blue-accent shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Transparent Pricing</span>
          </div>
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-blue-accent shrink-0" />
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Fixed Rate Card</span>
              <a href="/rate-card" className="block text-xs text-blue-accent font-semibold underline hover:text-blue-accent/80 transition-colors">View rate card</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
