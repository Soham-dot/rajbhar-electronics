"use client";
import { Award, Users, Wrench, Star, CheckCircle, MapPin } from "lucide-react";
import Link from "next/link";
import { BUSINESS } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";

const highlights = [
  {
    icon: Award,
    title: "30+ Years Experience",
    description: "Serving Mumbai since 1996 with unwavering commitment to quality and customer satisfaction."
  },
  {
    icon: Users,
    title: "Certified Technicians",
    description: "Our team of expert technicians is trained, certified, and equipped to handle all TV brands and models."
  },
  {
    icon: Wrench,
    title: "Advanced Tools & Equipment",
    description: "We use state-of-the-art diagnostic equipment and genuine spare parts for every repair."
  },
  {
    icon: Star,
    title: "Trusted by Thousands",
    description: "Over 10,000 satisfied customers and 4.3-star rating on Google Reviews speaks volumes about our service."
  }
];

const values = [
  {
    title: "Transparency",
    description: "We provide honest diagnosis and upfront pricing. No hidden charges, ever."
  },
  {
    title: "Quality",
    description: "Using genuine parts and proven repair techniques to ensure long-lasting solutions."
  },
  {
    title: "Speed",
    description: "30-minute response time and same-day repairs in most cases. Your time matters."
  },
  {
    title: "Trust",
    description: "Up to 180-day warranty on all repairs. We stand behind our work 100%."
  }
];

export default function AboutPage() {
  return (
    <main className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white min-h-screen">
      <TopBar />
      <Navbar />
      {/* Hero section */}
      <section className="bg-white dark:bg-gray-950 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">About Rajbhar Electronics</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Mumbai&apos;s most trusted TV repair service since 1996. Expert technicians, genuine parts, and a commitment to quality that spans 30 years.
          </p>
        </div>
      </section>

      {/* Story section */}
      <section className="bg-white dark:bg-gray-950 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Founded in 1996, Rajbhar Electronics started with a simple mission: provide honest, reliable TV repair service 
                to the people of Mumbai. What began as a small neighborhood shop in Chunabhatti has grown into a trusted name across 
                all of Mumbai.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Over 30 years, we&apos;ve witnessed the evolution of television technology, from CRT to LED, LCD, Smart TV, and everything 
                in between. Through every generation of technology, our commitment to quality and customer care has remained unchanged.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Today, we&apos;re proud to have repaired over 10,000 TVs and earned the trust of thousands of families across Mumbai. 
                Every repair is a promise. Every technician is trained. Every customer matters.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
              <div className="space-y-4">
                {[
                  { label: "Years in Business", value: "30+" },
                  { label: "TVs Repaired", value: "10,000+" },
                  { label: "Google Rating", value: "4.3★" },
                  { label: "Happy Customers", value: "Thousands" },
                ].map((stat) => (
                  <div key={stat.label} className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <p className="text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-blue-accent">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-accent/30 transition-colors">
                  <div className="w-12 h-12 bg-blue-accent/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our values section */}
      <section className="bg-white dark:bg-gray-950 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="flex gap-4">
                <CheckCircle className="w-6 h-6 text-green-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                  <p className="text-gray-400 text-sm">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service area section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 bg-blue-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-blue-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Our Service Area</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We serve all areas across Mumbai. From Chunabhatti where we started to every corner of the city, our technicians 
                come to your doorstep. Give us a call to book!
              </p>
              <a
                href={`tel:${BUSINESS.phoneRaw}`}
                className="inline-flex items-center gap-2 text-blue-accent hover:text-blue-accent/80 font-medium transition-colors"
              >
                Contact us: {BUSINESS.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-white dark:bg-gray-950 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Ready to Fix Your TV?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Experience the Rajbhar Electronics difference. Professional repair, personal touch, guaranteed satisfaction.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-blue-accent hover:bg-blue-accent/90 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Book a Service
            </Link>
            <Link
              href="/faq"
              className="border border-blue-accent text-blue-accent hover:bg-blue-accent/10 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
