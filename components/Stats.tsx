import { Award, Tv, Star, Clock } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

const currentYear = new Date().getFullYear();
const yearsExperience = currentYear - parseInt(BUSINESS.since);

const stats = [
  {
    icon: Award,
    value: `${yearsExperience}+`,
    label: "Years Experience",
    description: `Serving Mumbai since ${BUSINESS.since}`,
  },
  {
    icon: Tv,
    value: "10,000+",
    label: "TVs Repaired",
    description: "All brands & models",
  },
  {
    icon: Star,
    value: "4.8★",
    label: "Google Rating",
    description: "Based on 850+ reviews",
  },
  {
    icon: Clock,
    value: "30 min",
    label: "Response Time",
    description: "Fastest in Mumbai",
  },
];

export default function Stats() {
  return (
    <section className="bg-[#0d1424] py-16 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-[#111827] border border-white/10 rounded-2xl p-6 text-center hover:border-blue-500/30 transition-colors"
              >
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-white mb-1">{stat.value}</p>
                <p className="text-sm font-semibold text-gray-300 mb-1">{stat.label}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
