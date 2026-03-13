import { MonitorPlay, Cast, TvMinimal, Drill, CalendarCheck, Siren, Star } from "lucide-react";

const services = [
  {
    icon: MonitorPlay,
    title: "LED/LCD TV Repair",
    description:
      "Expert repair for all LED and LCD TVs. Screen issues, backlight problems, and more fixed at your doorstep.",
    price: "₹299",
    rating: 4.8,
    reviews: "2.1K",
  },
  {
    icon: Cast,
    title: "Smart TV Repair",
    description:
      "Connectivity issues, software glitches, app problems — we fix all Android, WebOS, and Tizen smart TVs.",
    price: "₹349",
    rating: 4.7,
    reviews: "1.8K",
  },
  {
    icon: TvMinimal,
    title: "CRT TV Repair",
    description:
      "Old-school CRT TVs repaired by experienced technicians. No job too old, no model too obscure.",
    price: "₹199",
    rating: 4.9,
    reviews: "950",
  },
  {
    icon: Drill,
    title: "TV Installation & Mounting",
    description:
      "Professional wall mounting and installation for all TV sizes. Clean cable management included.",
    price: "₹399",
    rating: 4.9,
    reviews: "1.5K",
  },
  {
    icon: CalendarCheck,
    title: "Annual Maintenance",
    description:
      "Keep your TV in top condition with our yearly maintenance packages. Prevent issues before they start.",
    price: "₹999",
    rating: 4.8,
    reviews: "680",
  },
  {
    icon: Siren,
    title: "Emergency Repairs",
    description:
      "Same-day emergency repair service. We're available 7 days a week for urgent TV issues.",
    price: "₹499",
    rating: 4.7,
    reviews: "1.2K",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-background dark:bg-gray-950 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-blue-accent text-sm font-semibold uppercase tracking-wider">
            What We Fix
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2 mb-4">Our Services</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            From old CRTs to the latest OLED smart TVs, we repair them all, right at your home.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="relative overflow-hidden bg-card dark:bg-gray-800 border border-border rounded-2xl p-6 hover:border-blue-accent/30 hover:shadow-lg hover:shadow-blue-accent/10 transition-all group"
              >
                {/* Subtle background icon */}
                <div className="absolute -bottom-4 -right-4 opacity-[0.04] dark:opacity-[0.06] pointer-events-none group-hover:opacity-[0.07] dark:group-hover:opacity-[0.1] transition-opacity duration-500">
                  <Icon className="w-40 h-40 text-blue-accent" strokeWidth={1} />
                </div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-accent/10 rounded-xl flex items-center justify-center group-hover:bg-blue-accent/20 transition-colors">
                      <Icon className="w-6 h-6 text-blue-accent" />
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-lg">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{service.rating}</span>
                      <span className="text-xs text-amber-600/70 dark:text-amber-400/60">({service.reviews})</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Starts at </span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">{service.price}</span>
                    </div>
                    <a
                      href="/book"
                      className="text-blue-accent hover:text-blue-accent/80 text-sm font-medium transition-all duration-200 hover:scale-105"
                    >
                      Book Now →
                    </a>
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
