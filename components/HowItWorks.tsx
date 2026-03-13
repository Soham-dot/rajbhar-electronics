import { Search, PhoneCall, Wrench, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: 1,
    title: "Inspection & Quote",
    description:
      "We inspect your TV thoroughly and share a transparent repair quote for your approval before any work begins.",
  },
  {
    icon: PhoneCall,
    number: 2,
    title: "Approval or Expert Review",
    description:
      "Repair begins after your approval. Not sure? Call our expert for a second opinion — no pressure, no obligation.",
  },
  {
    icon: Wrench,
    number: 3,
    title: "Repair & Spare Parts",
    description:
      "If needed, we source genuine spare parts at fixed rates. Most repairs are completed on the spot at your home.",
  },
  {
    icon: ShieldCheck,
    number: 4,
    title: "Warranty Activation",
    description:
      "Your TV automatically comes under our 180-day warranty after the repair. Full peace of mind, guaranteed.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background dark:bg-gray-950 py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-blue-accent text-sm font-semibold uppercase tracking-wider">
            Simple Process
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2 mb-4">
            Our Process
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            From inspection to warranty — we handle everything so you don&apos;t have to worry.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical connector line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-accent/40 via-emerald-500/30 to-blue-accent/40 dark:from-blue-accent/50 dark:via-emerald-500/40 dark:to-blue-accent/50" />

          <div className="flex flex-col gap-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;
              return (
                <div key={step.title} className="relative flex items-start gap-5 md:gap-6 group">
                  {/* Number circle */}
                  <div className="relative z-10 shrink-0">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm group-hover:border-blue-accent/50 group-hover:shadow-md group-hover:shadow-blue-accent/10 transition-all duration-300">
                      <span className="text-xl md:text-2xl font-extrabold text-blue-accent">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Content card */}
                  <div className={`flex-1 bg-card dark:bg-gray-800/60 border border-border rounded-2xl p-5 md:p-6 group-hover:border-blue-accent/20 group-hover:shadow-sm transition-all duration-300 ${isLast ? "mb-0" : "mb-2"}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-accent/10 dark:bg-blue-accent/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-4 h-4 text-blue-accent" />
                      </div>
                      <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed pl-11">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
