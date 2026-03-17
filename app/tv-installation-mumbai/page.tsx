import type { Metadata } from "next";
import LocalSeoPage from "@/components/LocalSeoPage";

export const metadata: Metadata = {
  title: "TV Installation in Mumbai | Wall Mount & Setup Service",
  description:
    "Professional TV installation service in Mumbai for wall mount, bracket fitting, and clean cable setup. Book a technician now.",
  alternates: { canonical: "/tv-installation-mumbai" },
};

export default function TvInstallationMumbaiPage() {
  return (
    <LocalSeoPage
      heading="TV Installation Service in Mumbai"
      intro="Book professional TV wall mount and installation support across Mumbai. We handle bracket fitting, alignment, and safe setup for all major TV brands and sizes."
      serviceTag="Installation Service"
      areas={["Sion", "Bandra", "Chembur", "Ghatkopar", "Andheri", "Powai", "Dadar", "Wadala", "Kurla"]}
      highlights={[
        "Wall mounting with proper alignment and secure drilling",
        "Compatible bracket guidance for your TV size and wall type",
        "Neat cable routing and basic input source setup",
        "Experienced team for first-time setup and relocation installs",
      ]}
      faqs={[
        {
          question: "Do you install TVs on all wall types?",
          answer:
            "Yes, we handle common wall types after checking load capacity and bracket compatibility.",
        },
        {
          question: "Can you help with cable arrangement too?",
          answer:
            "Yes. We provide clean cable setup and basic connection support during installation.",
        },
        {
          question: "Do I need to buy bracket separately?",
          answer:
            "If you already have a bracket we can install it, or we can guide you on the right bracket options.",
        },
      ]}
      bookHref="/book?service=TV%20Installation"
    />
  );
}
