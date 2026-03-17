import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Services from "@/components/Services";
import TrustProofSection from "@/components/TrustProofSection";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background dark:bg-gray-950 text-gray-900 dark:text-white">
      <TopBar />
      <Navbar />
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-extrabold mb-6">Our Services</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
          We offer full-service TV repair for all major brands, including LED, LCD, Smart TVs, and more.
          Scroll below to explore the full list of services.
        </p>
      </section>
      <Services />
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
          Popular Service Pages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/tv-repair-thane"
            className="rounded-2xl border border-border bg-card dark:bg-gray-800 p-5 hover:border-blue-accent/40 transition-colors"
          >
            <h3 className="font-bold text-gray-900 dark:text-white">TV Repair in Thane</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Same-day doorstep support for LED, LCD, and Smart TV issues.
            </p>
          </Link>
          <Link
            href="/tv-installation-mumbai"
            className="rounded-2xl border border-border bg-card dark:bg-gray-800 p-5 hover:border-blue-accent/40 transition-colors"
          >
            <h3 className="font-bold text-gray-900 dark:text-white">TV Installation Mumbai</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Wall mount, bracket setup, and cable alignment by trained technicians.
            </p>
          </Link>
          <Link
            href="/led-wall-mount-service"
            className="rounded-2xl border border-border bg-card dark:bg-gray-800 p-5 hover:border-blue-accent/40 transition-colors"
          >
            <h3 className="font-bold text-gray-900 dark:text-white">LED Wall Mount Service</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Secure wall mounting with precise viewing-angle alignment.
            </p>
          </Link>
        </div>
      </section>
      <TrustProofSection />
      <Footer />
    </main>
  );
}
