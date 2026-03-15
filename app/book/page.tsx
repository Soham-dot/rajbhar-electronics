"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Star, Timer, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import ServiceCard from "@/components/booking/ServiceCard";
import CartSidebar from "@/components/booking/CartSidebar";
import BookingForm from "@/components/booking/BookingForm";
import { BOOKING_SERVICES, type CartItem } from "@/lib/booking-data";

function BookContent() {
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get("service");

  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState<"select" | "checkout">("select");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  const handleApplyCoupon = useCallback((code: string, disc: number) => {
    setAppliedCoupon(code);
    setDiscount(disc);
  }, []);

  const handleRemoveCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setDiscount(0);
  }, []);

  const addToCart = useCallback(
    (serviceId: string, issueId: string, serviceName: string, issueName: string, price: number) => {
      setCart((prev) => {
        const existing = prev.find(
          (item) => item.serviceId === serviceId && item.issueId === issueId
        );
        if (existing) {
          return prev.map((item) =>
            item.serviceId === serviceId && item.issueId === issueId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { serviceId, issueId, serviceName, issueName, price, quantity: 1 }];
      });
    },
    []
  );

  const updateQuantity = useCallback(
    (serviceId: string, issueId: string, delta: number) => {
      setCart((prev) =>
        prev
          .map((item) =>
            item.serviceId === serviceId && item.issueId === issueId
              ? { ...item, quantity: item.quantity + delta }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
    },
    []
  );

  const removeFromCart = useCallback(
    (serviceId: string, issueId: string) => {
      setCart((prev) =>
        prev.filter(
          (item) => !(item.serviceId === serviceId && item.issueId === issueId)
        )
      );
    },
    []
  );

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950 text-gray-900 dark:text-white">
      <TopBar />
      <Navbar />

      {/* Hero banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 pt-24 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Television
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-white font-semibold">4.3</span>
              <span className="text-gray-400">(10K+ bookings)</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-300">
              <Timer className="w-4 h-4 text-blue-accent" />
              <span>In 30 mins</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Up to 180 days warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {step === "select" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left — Service list */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Select a service
              </h2>
              <div className="flex flex-col gap-4">
                {BOOKING_SERVICES.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    cart={cart}
                    onAddToCart={addToCart}
                    defaultExpanded={service.title === preselectedService}
                  />
                ))}
              </div>
            </div>

            {/* Right — Cart sidebar (sticky) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <CartSidebar
                  cart={cart}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                  onCheckout={() => {
                    if (cart.length > 0) setStep("checkout");
                  }}
                  appliedCoupon={appliedCoupon}
                  discount={discount}
                  onApplyCoupon={handleApplyCoupon}
                  onRemoveCoupon={handleRemoveCoupon}
                />
              </div>
            </div>
          </div>
        ) : (
          <BookingForm
            cart={cart}
            onBack={() => setStep("select")}
            appliedCoupon={appliedCoupon}
            discount={discount}
            onCouponBlocked={handleRemoveCoupon}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense>
      <BookContent />
    </Suspense>
  );
}
