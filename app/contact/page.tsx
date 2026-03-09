import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1a] text-white">
      <TopBar />
      <Navbar />
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-extrabold mb-6">Contact Us</h1>
        <p className="text-gray-300 max-w-3xl leading-relaxed">
          Have a question or need a quick TV service? Fill the form below or call us directly.
        </p>
      </section>
      <Contact />
    </main>
  );
}
