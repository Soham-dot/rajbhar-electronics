"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsConditions() {
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

        <h1 className="text-4xl font-bold mb-2">Terms & Conditions</h1>
        <p className="text-muted mb-8">Effective Date: March 2026</p>

        <div className="space-y-8 text-gray-600 dark:text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Use License</h2>
            <p className="mb-3">Permission is granted to temporarily download one copy of the materials (information or software) on Rajbhar Electronics&apos; website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software</li>
              <li>Remove any copyright or other proprietary notations</li>
              <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Booking & Service Terms</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Service Area:</strong> We provide services across all areas in Mumbai</li>
              <li><strong>Booking Confirmation:</strong> We will call you within 15 minutes of booking to confirm the appointment</li>
              <li><strong>Service Hours:</strong> 9 AM – 10 PM (Monday – Sunday)</li>
              <li><strong>Technician Visit:</strong> Technicians arrive within 30 minutes of scheduled time (subject to traffic/conditions)</li>
              <li><strong>Diagnosis Fee:</strong> No diagnosis charge; you only pay if we proceed with repairs</li>
              <li><strong>Warranty:</strong> Repairs include up to 180 days warranty on parts and labor</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Payment Terms</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Payment is due upon completion of service</li>
              <li>We accept cash, UPI, card payments, and online transfers</li>
              <li>All prices are final; no refunds once repair is complete</li>
              <li>Cancellations made 2+ hours before appointment are free; less than 2 hours incur a cancellation fee</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Disclaimer of Warranties</h2>
            <p className="mb-3">The materials on Rajbhar Electronics&apos; website are provided on an &apos;as is&apos; basis. Rajbhar Electronics makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Limitations of Liability</h2>
            <p>
              In no event shall Rajbhar Electronics or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Rajbhar Electronics&apos; website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Accuracy of Materials</h2>
            <p>
              The materials appearing on Rajbhar Electronics&apos; website could include technical, typographical, or photographic errors. Rajbhar Electronics does not warrant that any of the materials on its website are accurate, complete, or current. Rajbhar Electronics may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Links</h2>
            <p>
              Rajbhar Electronics has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Rajbhar Electronics of the site. Use of any such linked website is at the user&apos;s own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Modifications</h2>
            <p>
              Rajbhar Electronics may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Governing Law</h2>
            <p>These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in Mumbai.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">11. Contact Information</h2>
            <p>
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
