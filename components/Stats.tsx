import { Trophy, Hammer, Star, Gauge } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

const currentYear = new Date().getFullYear();
const yearsExperience = currentYear - parseInt(BUSINESS.since);

const stats = [
  {
    icon: Trophy,
    value: `${yearsExperience}+`,
    label: "Years Experience",
    description: `Serving Mumbai since ${BUSINESS.since}`,
  },
  {
    icon: Hammer,
    value: "10,000+",
    label: "TVs Repaired",
    description: "All brands & models",
  },
  {
    icon: Star,
    value: "4.3★",
    label: "Google Rating",
    description: "Rated on Google",
  },
  {
    icon: Gauge,
    value: "30 min",
    label: "Response Time",
    description: "Fastest in Mumbai",
  },
];

export default function Stats() {
  return (
    <section className="bg-background dark:bg-gray-950 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-card dark:bg-gray-800 border border-border rounded-2xl p-6 text-center hover:border-blue-accent/30 transition-colors"
              >
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-blue-accent/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-accent" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">{stat.value}</p>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">{stat.label}</p>
                <p className="text-xs text-gray-700 dark:text-gray-500">{stat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
