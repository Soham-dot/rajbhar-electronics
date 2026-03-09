import { CalendarDays, UserCheck, ClipboardList, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: CalendarDays,
    title: "Book a Service",
    description:
      "Call us, WhatsApp, or fill out the booking form. Choose a convenient time slot between 9 AM and 8 PM.",
  },
  {
    icon: UserCheck,
    title: "Technician Visits",
    description:
      "Our certified technician arrives at your home within 30 minutes, fully equipped with tools and spare parts.",
  },
  {
    icon: ClipboardList,
    title: "Diagnosis & Quote",
    description:
      "We diagnose the issue thoroughly and provide a transparent, upfront quote before starting any work.",
  },
  {
    icon: CheckCircle2,
    title: "Repair & Payment",
    description:
      "We fix your TV on the spot in most cases. Pay only after you're 100% satisfied. Warranty on all repairs.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background py-20 border-y border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-blue-accent text-sm font-semibold uppercase tracking-wider">
            Simple Process
          </span>
          <h2 className="text-4xl font-extrabold text-white mt-2 mb-4">How It Works</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Getting your TV repaired is easy. We handle everything from booking to fixing.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-accent/40 via-green-accent/30 to-blue-accent/40" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative flex flex-col items-center text-center">
                  {/* Step number bubble */}
                  <div className="relative z-10 w-14 h-14 rounded-full bg-blue-accent flex items-center justify-center mb-4 shadow-lg shadow-blue-accent/30">
                    <Icon className="w-6 h-6 text-white" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-background border border-blue-accent rounded-full text-xs text-blue-accent font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
