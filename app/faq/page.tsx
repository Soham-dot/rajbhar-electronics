"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BUSINESS } from "@/lib/constants";

const faqs = [
  {
    question: "How much does TV repair cost?",
    answer: "Repair costs vary depending on the issue, brand, and model. We provide a free diagnosis and transparent quote before starting any work. On average, repairs range from ₹500 to ₹5,000. Service call is completely free."
  },
  {
    question: "What brands do you repair?",
    answer: "We repair all major brands including Samsung, LG, Sony, Panasonic, Mi (Xiaomi), OnePlus, TCL, Philips, BPL, Videocon, and more. Whether it's LED, LCD, Smart TV, or old CRT TVs, we've got you covered."
  },
  {
    question: "Do you offer warranty on repairs?",
    answer: "Yes! Our repairs come with up to 180 days warranty on parts and labor. If the same issue occurs within the warranty period, we'll fix it for free."
  },
  {
    question: "How quickly can you come for repair?",
    answer: "We arrive within 30 minutes of your confirmed appointment time. Quick response and fast service are our specialties. In case of emergency, we can expedite the visit."
  },
  {
    question: "Do I have to pay for diagnosis?",
    answer: "No! Our diagnosis is completely FREE. We'll inspect your TV, identify the issue, and give you a detailed quote. You only pay if you decide to proceed with the repair."
  },
  {
    question: "What if my TV cannot be repaired?",
    answer: "If your TV cannot be repaired or repairs cost more than its value, we'll honestly let you know. We won't recommend unnecessary repairs. We provide transparent advice always."
  },
  {
    question: "Do you repair old/vintage TVs?",
    answer: "Yes! We repair CRT TVs and vintage models that are 10+ years old. Many of our customers have old TVs that we've successfully brought back to life."
  },
  {
    question: "Can you install a new TV at my home?",
    answer: "Absolutely! We offer professional TV installation and wall mounting services. We handle cable management, HDMI setup, and ensure everything works perfectly."
  },
  {
    question: "Do you offer maintenance packages?",
    answer: "Yes, we offer annual maintenance packages to keep your TV in top condition. Prevention is better than cure! Ask about our maintenance plans during your booking."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept Cash, UPI, Debit/Credit Cards, and online bank transfers. Pay conveniently using your preferred method."
  },
  {
    question: "Do you service other electronics?",
    answer: "Currently, we specialize in TV repair. For other electronics, please call us to inquire."
  },
  {
    question: "How do I book a service?",
    answer: "You can book in 3 ways: (1) Fill the form on our Contact page, (2) Call us at +91 9224146973, or (3) WhatsApp us for instant booking. We respond within minutes!"
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="bg-background dark:bg-gray-950 text-gray-900 dark:text-white min-h-screen">
      <TopBar />
      <Navbar />
      {/* Hero section */}
      <section className="bg-gradient-to-b from-background via-background to-card py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">Frequently Asked Questions</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Get quick answers to common questions about our TV repair services.</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl overflow-hidden hover:border-blue-accent/30 transition-all"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-blue-accent/5 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">{faq.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-blue-accent flex-shrink-0 transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openIndex === index && (
                  <div className="px-6 py-4 bg-background/50 border-t border-border text-gray-600 dark:text-gray-300">
                    <p className="leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-card border-y border-border py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-gray-400 mb-6">
            Reach out to us directly. We&apos;re here to help!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="bg-blue-accent hover:bg-blue-accent/90 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
            >
              Call Us: {BUSINESS.phone}
            </a>
            <Link
              href="/contact"
              className="border border-blue-accent text-blue-accent hover:bg-blue-accent/10 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Book a Service
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
