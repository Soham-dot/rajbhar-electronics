"use client";
import Link from "next/link";
import { AlertCircle, Home, Phone } from "lucide-react";

export default function NotFound() {
  return (
    <main className="bg-background dark:bg-gray-950 text-gray-900 dark:text-white min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-blue-accent/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-blue-accent" />
          </div>
        </div>

        {/* Error code */}
        <div className="mb-6">
          <p className="text-6xl md:text-8xl font-black text-blue-accent mb-2">404</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Page Not Found</p>
        </div>

        {/* Error message */}
        <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-md mx-auto">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved. 
          Let&apos;s get you back on track.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-blue-accent hover:bg-blue-accent/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <a
            href="tel:+919224146973"
            className="inline-flex items-center justify-center gap-2 border border-blue-accent text-blue-accent hover:bg-blue-accent/10 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Phone className="w-5 h-5" />
            Call Support
          </a>
        </div>

        {/* Helpful links */}
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-gray-400 mb-4">Popular pages:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { label: "Home", href: "/" },
              { label: "Services", href: "/services" },
              { label: "FAQ", href: "/faq" },
              { label: "Contact", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-blue-accent hover:text-blue-accent/80 transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
