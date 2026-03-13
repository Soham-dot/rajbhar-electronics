"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <main className="bg-background dark:bg-gray-950 text-gray-900 dark:text-white min-h-screen">
      <TopBar />
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Back button */}
        <Link href="/" className="inline-flex items-center gap-2 text-blue-accent hover:text-blue-accent/80 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted mb-8">Effective Date: March 2026</p>

        <div className="space-y-8 text-gray-600 dark:text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Introduction</h2>
            <p>
              Rajbhar Electronics (&quot;we,&quot; &quot;us,&quot; &quot;our,&quot; or &quot;Company&quot;) is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you visit our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Information We Collect</h2>
            <p className="mb-3">We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Personal Data:</strong> Name, email address, phone number, address, TV brand, and issue description</li>
              <li><strong>Device Data:</strong> Browser type, IP address, operating system</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, referral source</li>
              <li><strong>Location Data:</strong> Area/neighborhood for service delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Use of Your Information</h2>
            <p className="mb-3">Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Process booking requests and schedule service appointments</li>
              <li>Follow up on service and send repair updates</li>
              <li>Generate analytics to improve our website and services</li>
              <li>Send marketing communications (only if you opt-in)</li>
              <li>Prevent fraudulent transactions</li>
              <li>Respond to your inquiries and customer support requests</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Disclosure of Your Information</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may disclose your information only:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>When required by law or government request</li>
              <li>To prevent illegal activities or harm</li>
              <li>To third-party service providers (payment processors, email services) who are bound by confidentiality</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Security of Your Information</h2>
            <p>
              We use administrative, technical, and physical security measures to protect your personal information. However, no method 
              of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at:</p>
            <p className="mt-3">
              <strong>Rajbhar Electronics</strong><br />
              Chunabhatti, Mumbai<br />
              Phone: +91 92241 46973<br />
              Email: info@rajbharelectronics.in
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
