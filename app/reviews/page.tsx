import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Reviews from "@/components/Reviews";

export default function ReviewsPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1a] text-white">
      <TopBar />
      <Navbar />
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-extrabold mb-6">Customer Reviews</h1>
        <p className="text-gray-300 max-w-3xl leading-relaxed">
          Read what our happy customers say about our fast and reliable TV repair service.
        </p>
      </section>
      <Reviews />
    </main>
  );
}
