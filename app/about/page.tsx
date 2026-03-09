import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import HowItWorks from "@/components/HowItWorks";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1a] text-white">
      <TopBar />
      <Navbar />
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-extrabold mb-6">About Rajbhar Electronics</h1>
        <p className="text-gray-300 max-w-3xl leading-relaxed">
          Rajbhar Electronics has been a trusted TV repair specialist in Chunabhatti, Mumbai since 1996.
          We service all major brands and deliver doorstep support with fast turnaround.
        </p>
      </section>
      <HowItWorks />
    </main>
  );
}
