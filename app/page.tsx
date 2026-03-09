import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0f1a] text-white">
      <TopBar />
      <Navbar />
      <Hero />
      <Stats />
      <Services />
      <HowItWorks />
      <Reviews />
      <Contact />
      <Footer />
    </main>
  );
}
