import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import TrustProofSection from "@/components/TrustProofSection";
import Promises from "@/components/Promises";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import Offers from "@/components/Offers";
import HowItWorks from "@/components/HowItWorks";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background dark:bg-gray-950 text-gray-900 dark:text-white">
      <TopBar />
      <Navbar />
      <Hero />
      <section className="bg-background dark:bg-gray-950 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <TrustBadges />
        </div>
      </section>
      <TrustProofSection />
      <Promises />
      <Stats />
      <Services />
      <Offers />
      <HowItWorks />
      <Reviews />
      <Contact />
      <Footer />
    </main>
  );
}
