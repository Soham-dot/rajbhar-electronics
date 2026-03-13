import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Services from "@/components/Services";

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
    </main>
  );
}
