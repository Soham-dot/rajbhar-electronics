import { BadgeCheck, ShieldCheck, Star, Tv, UserCheck, Wrench } from "lucide-react";

const technicians = [
  {
    name: "Ajay Patil",
    role: "Senior TV Technician",
    experience: "12 years on-field experience",
    image: "/technicians/ajay.svg",
  },
  {
    name: "Ravi Shinde",
    role: "Installation Specialist",
    experience: "8 years wall-mount expertise",
    image: "/technicians/ravi.svg",
  },
  {
    name: "Sandeep Yadav",
    role: "Smart TV Engineer",
    experience: "10 years smart TV diagnostics",
    image: "/technicians/sandeep.svg",
  },
];

const proofPoints = [
  {
    icon: Tv,
    title: "500+ TVs installed",
    description: "Completed installs in Mumbai in the last 12 months",
  },
  {
    icon: ShieldCheck,
    title: "Up to 180 days warranty",
    description: "Labour and eligible parts covered after repair",
  },
  {
    icon: UserCheck,
    title: "Background verified team",
    description: "Technicians are ID-verified and trained in-house",
  },
  {
    icon: Wrench,
    title: "10,000+ TV jobs done",
    description: "LED, LCD, Smart TV and installation visits completed",
  },
];

const customerProof = [
  {
    name: "Neha K.",
    quote:
      "Technician reached in 35 minutes, explained issue clearly, and fixed it same day.",
  },
  {
    name: "Harish M.",
    quote:
      "Wall mount installation was neat, aligned perfectly, and cable setup was clean.",
  },
  {
    name: "Farah S.",
    quote:
      "Transparent pricing and warranty support gave us confidence to book quickly.",
  },
];

export default function TrustProofSection() {
  return (
    <section className="bg-background dark:bg-gray-950 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-blue-accent text-sm font-semibold uppercase tracking-wider">
            Trust First
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-2 mb-3">
            Why Mumbai Families Book Rajbhar
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Verified technicians, strong warranty coverage, and proven work across TV
            repairs and installations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-card dark:bg-gray-800 border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <BadgeCheck className="w-5 h-5 text-blue-accent" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Meet Our Technicians
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {technicians.map((tech) => (
                <div
                  key={tech.name}
                  className="rounded-xl border border-border bg-white dark:bg-gray-900 overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tech.image}
                    alt={`${tech.name} - ${tech.role}`}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                  />
                  <div className="p-3">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {tech.name}
                    </p>
                    <p className="text-xs text-blue-accent font-semibold mt-0.5">
                      {tech.role}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {tech.experience}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card dark:bg-gray-800 border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-blue-accent" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Service Proof & Warranty
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {proofPoints.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-xl border border-border bg-white dark:bg-gray-900 p-4"
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-accent/10 flex items-center justify-center mb-2">
                      <Icon className="w-5 h-5 text-blue-accent" />
                    </div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-card dark:bg-gray-800 border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Real Customer Feedback
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {customerProof.map((item) => (
              <div
                key={item.name}
                className="rounded-xl border border-border bg-white dark:bg-gray-900 p-4"
              >
                <div className="flex items-center gap-1 mb-2 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <p className="text-xs font-semibold text-blue-accent mt-3">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
