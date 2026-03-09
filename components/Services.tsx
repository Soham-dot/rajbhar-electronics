import { Monitor, Wifi, Tv, Wrench, Shield, Zap } from "lucide-react";

const services = [
  {
    icon: Monitor,
    title: "LED/LCD TV Repair",
    description:
      "Expert repair for all LED and LCD TVs. Screen issues, backlight problems, and more fixed at your doorstep.",
  },
  {
    icon: Wifi,
    title: "Smart TV Repair",
    description:
      "Connectivity issues, software glitches, app problems — we fix all Android, WebOS, and Tizen smart TVs.",
  },
  {
    icon: Tv,
    title: "CRT TV Repair",
    description:
      "Old-school CRT TVs repaired by experienced technicians. No job too old, no model too obscure.",
  },
  {
    icon: Wrench,
    title: "TV Installation & Mounting",
    description:
      "Professional wall mounting and installation for all TV sizes. Clean cable management included.",
  },
  {
    icon: Shield,
    title: "Annual Maintenance",
    description:
      "Keep your TV in top condition with our yearly maintenance packages. Prevent issues before they start.",
  },
  {
    icon: Zap,
    title: "Emergency Repairs",
    description:
      "Same-day emergency repair service. We're available 7 days a week for urgent TV issues.",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-[#0a0f1a] py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-wider">
            What We Fix
          </span>
          <h2 className="text-4xl font-extrabold text-white mt-2 mb-4">Our Services</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            From old CRTs to the latest OLED smart TVs, we repair them all — right at your home.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="bg-[#111827] border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-900/10 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600/20 transition-colors">
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{service.description}</p>
                <a
                  href="#contact"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  Learn More →
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
