import type { Metadata } from "next";
import LocalSeoPage from "@/components/LocalSeoPage";

export const metadata: Metadata = {
  title: "LED TV Wall Mount Service in Mumbai | Fast Installation",
  description:
    "Need LED TV wall mounting in Mumbai? Get safe installation, proper alignment, and clean setup by trained technicians.",
  alternates: { canonical: "/led-wall-mount-service" },
};

export default function LedWallMountServicePage() {
  return (
    <LocalSeoPage
      heading="LED TV Wall Mount Service"
      intro="Get LED TV wall mount service by trained technicians in Mumbai. We ensure secure fitting, viewing-angle alignment, and proper setup for your home layout."
      serviceTag="LED Wall Mount"
      areas={["Chunabhatti", "Sion", "Matunga", "BKC", "Vikhroli", "Mulund", "Borivali", "Kandivali"]}
      highlights={[
        "Safe and balanced wall mounting for LED TVs",
        "Precise alignment based on room viewing distance",
        "Basic AV connection checks after installation",
        "Support for reinstall and relocation requests",
      ]}
      faqs={[
        {
          question: "Can you remount an already installed LED TV?",
          answer:
            "Yes, we provide remounting and repositioning after checking bracket and wall condition.",
        },
        {
          question: "Do you support large screen TVs?",
          answer:
            "Yes, we install multiple screen sizes with compatible mounting hardware and safe handling.",
        },
        {
          question: "Is this service available on weekends?",
          answer:
            "Yes, weekend slots are available based on technician schedule and location.",
        },
      ]}
      bookHref="/book?service=TV%20Installation"
    />
  );
}
