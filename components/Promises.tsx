import { Handshake, Receipt, Medal, Fingerprint, MousePointerClick, ShieldCheck, CircleCheck, Clock, Zap } from "lucide-react";

const promises = [
  {
    icon: Fingerprint,
    title: "Verified Professionals",
    description: "Background-checked, trained & certified experts",
  },
  {
    icon: Receipt,
    title: "Transparent Pricing",
    description: "No hidden charges, upfront quote before repair",
    link: "/rate-card",
    linkLabel: "View rate card",
  },
  {
    icon: Medal,
    title: "Up to 180 Days Warranty",
    description: "All repairs backed by our service warranty",
  },
  {
    icon: MousePointerClick,
    title: "Hassle-Free Booking",
    description: "Book in seconds, technician at your door in 30 mins",
  },
];

const warrantyTiers = [
  {
    duration: "30 Days",
    services: "TV Check-up & Minor Repairs",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
  },
  {
    duration: "90 Days",
    services: "LED/LCD Panel & Component Repairs",
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
    popular: true,
  },
  {
    duration: "180 Days",
    services: "Full Repairs, Part Replacements & AMC",
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
  },
];

const coverageItems = [
  "Same issue recurrence after repair",
  "Replaced spare parts & components",
  "Labour charges for warranty repairs",
  "Free re-inspection within warranty period",
];

export default function Promises() {
  return (
    <section className="bg-gradient-to-r from-blue-accent/5 via-emerald-50 to-blue-accent/5 dark:from-blue-accent/10 dark:via-gray-900 dark:to-blue-accent/10 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Promise badges */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-blue-accent/10 dark:bg-blue-accent/20 text-blue-accent text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
            <Handshake className="w-3.5 h-3.5" />
            Our Promise
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {promises.map((promise) => {
            const Icon = promise.icon;
            return (
              <div key={promise.title} className="text-center group">
                <div className="w-14 h-14 mx-auto mb-3 bg-white dark:bg-gray-800 border-2 border-blue-accent/20 dark:border-blue-accent/30 rounded-2xl flex items-center justify-center shadow-sm group-hover:border-blue-accent/50 group-hover:shadow-md transition-all">
                  <Icon className="w-6 h-6 text-blue-accent" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                  {promise.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {promise.description}
                </p>
                {promise.link && (
                  <a
                    href={promise.link}
                    className="inline-block mt-1 text-xs text-blue-accent font-semibold underline hover:text-blue-accent/80 transition-colors"
                  >
                    {promise.linkLabel}
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {/* Warranty Coverage Section */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Warranty Coverage
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-3 mb-2">
              We Stand Behind Every Repair
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-lg mx-auto">
              Every service comes with warranty protection. If the same issue returns, so do we — at no extra cost.
            </p>
          </div>

          {/* Warranty tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {warrantyTiers.map((tier) => (
              <div
                key={tier.duration}
                className={`relative rounded-2xl border ${tier.border} ${tier.bg} p-5 text-center`}
              >
                {tier.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
                    Most Common
                  </span>
                )}
                <Clock className={`w-5 h-5 ${tier.color} mx-auto mb-2`} />
                <p className={`text-2xl font-extrabold ${tier.color} mb-1`}>{tier.duration}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{tier.services}</p>
              </div>
            ))}
          </div>

          {/* What's covered */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 max-w-2xl mx-auto">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-accent" />
              What&apos;s Covered Under Warranty
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {coverageItems.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CircleCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
