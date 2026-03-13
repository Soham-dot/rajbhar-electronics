import { Star } from "lucide-react";

const reviews = [
  {
    name: "Priya Sharma",
    date: "November 2024",
    rating: 5,
    text: "Excellent service! The technician arrived within 30 minutes and fixed my Samsung LED TV in under an hour. Very professional and the pricing was transparent. Highly recommended!",
    tvBrand: 'Samsung LED 55"',
  },
  {
    name: "Rajesh Patil",
    date: "October 2024",
    rating: 5,
    text: "I had a screen blackout issue with my Sony Bravia. Called Rajbhar Electronics and they sent a technician the same evening. The issue was resolved perfectly. Will definitely call them again.",
    tvBrand: 'Sony Bravia 43"',
  },
  {
    name: "Meena Joshi",
    date: "October 2024",
    rating: 5,
    text: "Amazing service at great prices. My old CRT TV stopped working and I thought it was beyond repair. These guys fixed it easily. Glad I called them instead of buying a new one!",
    tvBrand: 'BPL CRT 29"',
  },
  {
    name: "Arjun Nair",
    date: "September 2024",
    rating: 5,
    text: "Quick response, honest diagnosis, and fair pricing. The technician was knowledgeable and explained everything clearly. My LG Smart TV is working perfectly again. 5 stars!",
    tvBrand: 'LG Smart TV 50"',
  },
];

export default function Reviews() {
  return (
    <section id="reviews" className="bg-background dark:bg-gray-950 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-blue-accent text-sm font-semibold uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Don&apos;t just take our word for it — hear from our satisfied customers across Mumbai.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="bg-card dark:bg-gray-800 border border-border rounded-2xl p-6 hover:border-blue-accent/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{review.name}</p>
                  <p className="text-xs text-gray-700 dark:text-gray-500 mt-0.5">{review.tvBrand}</p>
                </div>
                <span className="text-xs text-gray-700 dark:text-gray-500">{review.date}</span>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-3">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{review.text}</p>
            </div>
          ))}
        </div>

        {/* Overall rating badge */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-3 bg-card dark:bg-gray-800 border border-border rounded-2xl px-6 py-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <div className="text-left">
              <p className="text-gray-900 dark:text-white font-bold text-lg">4.3 out of 5</p>
              <p className="text-gray-700 dark:text-gray-500 text-xs">Based on Google reviews</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
