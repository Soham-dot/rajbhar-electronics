"use client";

import {
  Fragment,
  useState,
  useCallback,
  Suspense,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Star, Timer, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import ServiceCard from "@/components/booking/ServiceCard";
import CartSidebar from "@/components/booking/CartSidebar";
import BookingForm from "@/components/booking/BookingForm";
import ServiceDetailsSheet from "@/components/booking/ServiceDetailsSheet";
import { BOOKING_SERVICES, type CartItem } from "@/lib/booking-data";

function BookContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get("service");
  const stepFromUrl = searchParams.get("step") === "checkout" ? "checkout" : "select";

  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState<"select" | "checkout">(stepFromUrl);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [lastAddedServiceId, setLastAddedServiceId] = useState<string | null>(null);
  const [lastAddTick, setLastAddTick] = useState(0);
  const mobileCartRef = useRef<HTMLDivElement | null>(null);

  const handleApplyCoupon = useCallback((code: string, disc: number) => {
    setAppliedCoupon(code);
    setDiscount(disc);
  }, []);

  const handleRemoveCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setDiscount(0);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.sessionStorage.getItem("booking-cart-draft-v1");
      if (!raw) return;

      const parsed = JSON.parse(raw) as {
        cart?: CartItem[];
        appliedCoupon?: string | null;
        discount?: number;
      };

      if (Array.isArray(parsed.cart)) {
        setCart(parsed.cart);
      }
      if (typeof parsed.appliedCoupon === "string") {
        setAppliedCoupon(parsed.appliedCoupon);
      } else if (parsed.appliedCoupon === null) {
        setAppliedCoupon(null);
      }
      if (typeof parsed.discount === "number" && Number.isFinite(parsed.discount)) {
        setDiscount(Math.max(0, parsed.discount));
      }
    } catch {
      // Ignore stale/invalid draft data
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.sessionStorage.setItem(
      "booking-cart-draft-v1",
      JSON.stringify({
        cart,
        appliedCoupon,
        discount,
      })
    );
  }, [cart, appliedCoupon, discount]);

  const addToCart = useCallback(
    (serviceId: string, issueId: string, serviceName: string, issueName: string, price: number) => {
      setLastAddedServiceId(serviceId);
      setLastAddTick((prev) => prev + 1);
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

  const mobileCartAnchorServiceId = useMemo(() => {
    if (cart.length === 0) return null;

    if (
      lastAddedServiceId &&
      cart.some((item) => item.serviceId === lastAddedServiceId)
    ) {
      return lastAddedServiceId;
    }

    return cart[cart.length - 1]?.serviceId ?? null;
  }, [cart, lastAddedServiceId]);

  const activeService = useMemo(
    () =>
      activeServiceId
        ? BOOKING_SERVICES.find((service) => service.id === activeServiceId) ?? null
        : null,
    [activeServiceId]
  );

  useEffect(() => {
    if (lastAddTick === 0) return;
    if (typeof window !== "undefined" && window.innerWidth >= 1024) return;

    window.requestAnimationFrame(() => {
      mobileCartRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });
  }, [lastAddTick]);

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

  const buildStepUrl = useCallback(
    (nextStep: "select" | "checkout") => {
      const params = new URLSearchParams(
        typeof window !== "undefined"
          ? window.location.search
          : searchParams.toString()
      );

      if (nextStep === "checkout") {
        params.set("step", "checkout");
      } else {
        params.delete("step");
      }

      const query = params.toString();
      return query ? `${pathname}?${query}` : pathname;
    },
    [pathname, searchParams]
  );

  useEffect(() => {
    setStep(stepFromUrl);
  }, [stepFromUrl]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      if (window.location.pathname !== pathname) return;
      const params = new URLSearchParams(window.location.search);
      const nextStep = params.get("step") === "checkout" ? "checkout" : "select";
      setStep(nextStep);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (stepFromUrl !== "checkout") return;

    const state = (window.history.state as { bookingSeededCheckout?: boolean } | null) ?? {};
    if (state.bookingSeededCheckout) return;

    const selectUrl = buildStepUrl("select");
    const checkoutUrl = buildStepUrl("checkout");

    window.history.replaceState(
      { ...state, bookingSeededCheckout: true },
      "",
      selectUrl
    );
    window.history.pushState(
      { ...state, bookingSeededCheckout: true },
      "",
      checkoutUrl
    );
    setStep("checkout");
  }, [buildStepUrl, stepFromUrl]);

  const openCheckout = useCallback(() => {
    if (cart.length === 0) return;
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("step") !== "checkout") {
        window.history.pushState(window.history.state, "", buildStepUrl("checkout"));
      }
    }
    setStep("checkout");
  }, [buildStepUrl, cart.length]);

  const backToServices = useCallback(() => {
    if (step === "checkout") {
      setStep("select");
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        if (params.get("step") === "checkout") {
          window.history.replaceState(window.history.state, "", buildStepUrl("select"));
        }
      }
      return;
    }
    if (typeof window !== "undefined") {
      window.history.back();
    }
  }, [buildStepUrl, step]);

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
                  <Fragment key={service.id}>
                    <ServiceCard
                      service={service}
                      cart={cart}
                      onAddToCart={addToCart}
                      onOpenDetails={(selectedService) => {
                        setActiveServiceId(selectedService.id);
                      }}
                      defaultExpanded={service.title === preselectedService}
                    />
                    {mobileCartAnchorServiceId === service.id && cart.length > 0 && (
                      <div ref={mobileCartRef} className="lg:hidden">
                        <CartSidebar
                          cart={cart}
                          onUpdateQuantity={updateQuantity}
                          onRemove={removeFromCart}
                          onCheckout={openCheckout}
                          appliedCoupon={appliedCoupon}
                          discount={discount}
                          onApplyCoupon={handleApplyCoupon}
                          onRemoveCoupon={handleRemoveCoupon}
                        />
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>
            </div>

            {/* Right — Cart sidebar (sticky) */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                <CartSidebar
                  cart={cart}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                  onCheckout={openCheckout}
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
            onBack={backToServices}
            appliedCoupon={appliedCoupon}
            discount={discount}
            onCouponBlocked={handleRemoveCoupon}
          />
        )}
      </div>

      <ServiceDetailsSheet
        open={Boolean(activeService)}
        service={activeService}
        cart={cart}
        onClose={() => setActiveServiceId(null)}
        onAddToCart={addToCart}
        onUpdateQuantity={updateQuantity}
      />

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
