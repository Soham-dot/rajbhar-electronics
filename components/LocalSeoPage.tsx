import Link from "next/link";
import { MapPin, Phone, ShieldCheck, Star, Timer } from "lucide-react";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrustProofSection from "@/components/TrustProofSection";
import { BUSINESS } from "@/lib/constants";

interface FaqItem {
  question: string;
  answer: string;
}

interface LocalSeoPageProps {
  heading: string;
  intro: string;
  serviceTag: string;
  areas: string[];
  highlights: string[];
  faqs: FaqItem[];
  bookHref: string;
}

export default function LocalSeoPage({
  heading,
  intro,
  serviceTag,
  areas,
  highlights,
  faqs,
  bookHref,
}: LocalSeoPageProps) {
  return (
    <main className="min-h-screen bg-background dark:bg-gray-950 text-gray-900 dark:text-white">
      <TopBar />
      <Navbar />

      <section className="pt-24 pb-12 px-4 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-300 uppercase tracking-wider">
            {serviceTag}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-4 mb-4">
            {heading}
          </h1>
          <p className="text-gray-200 max-w-3xl leading-relaxed">{intro}</p>
          <div className="flex flex-wrap items-center gap-4 mt-6 text-sm">
            <span className="inline-flex items-center gap-2 text-gray-200">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              4.3 Rated Service
            </span>
            <span className="inline-flex items-center gap-2 text-gray-200">
              <Timer className="w-4 h-4 text-blue-accent" />
              Technician in 30 minutes
            </span>
            <span className="inline-flex items-center gap-2 text-gray-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Up to 180 days warranty
            </span>
          </div>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card dark:bg-gray-800 border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                What You Get
              </h2>
              <ul className="space-y-3">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                    <ShieldCheck className="w-4 h-4 text-blue-accent mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card dark:bg-gray-800 border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Areas We Cover
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {areas.map((area) => (
                  <div
                    key={area}
                    className="rounded-lg border border-border px-3 py-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {area}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card dark:bg-gray-800 border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">FAQs</h2>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.question} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{faq.question}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 bg-card dark:bg-gray-800 border border-border rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Book Service Now
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
                Call now or book online for fast doorstep service in Mumbai.
              </p>
              <div className="space-y-3">
                <a
                  href={`tel:${BUSINESS.phoneRaw}`}
                  className="h-12 w-full rounded-xl bg-gray-900 dark:bg-gray-700 text-white font-bold flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Call {BUSINESS.phone}
                </a>
                <Link
                  href={bookHref}
                  className="h-12 w-full rounded-xl bg-blue-accent text-white font-bold flex items-center justify-center"
                >
                  Book Online
                </Link>
                <a
                  href={BUSINESS.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 w-full rounded-xl border border-blue-accent text-blue-accent font-bold flex items-center justify-center"
                >
                  WhatsApp Booking
                </a>
              </div>
              <div className="mt-5 rounded-xl bg-blue-accent/10 border border-blue-accent/20 p-3">
                <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-accent" />
                  Service Available Across Mumbai
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <TrustProofSection />

      <Footer />
    </main>
  );
}
