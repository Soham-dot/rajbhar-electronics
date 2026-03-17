import { Gauge, Hammer, Star, Trophy } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

const currentYear = new Date().getFullYear();
const yearsExperience = currentYear - parseInt(BUSINESS.since, 10);

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
    description: "All brands and models",
  },
  {
    icon: Star,
    value: "4.3/5",
    label: "Google Rating",
    description: "Rated on Google",
  },
  {
    icon: Gauge,
    value: "30 min",
    label: "Response Time",
    description: "Fast service across Mumbai",
  },
];

export default function Stats() {
  return (
    <section className="bg-background dark:bg-gray-950 py-14 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-card dark:bg-gray-800 border border-border rounded-2xl p-4 md:p-6 text-center hover:border-blue-accent/30 transition-colors min-h-[200px] md:min-h-[230px]"
              >
                <div className="flex justify-center mb-2 md:mb-3">
                  <div className="w-11 h-11 md:w-12 md:h-12 bg-blue-accent/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-blue-accent" />
                  </div>
                </div>
                <p className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-none mb-2 break-words">
                  {stat.value}
                </p>
                <p className="text-sm md:text-base font-semibold text-gray-700 dark:text-gray-200 mb-1 leading-tight">
                  {stat.label}
                </p>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-snug">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
