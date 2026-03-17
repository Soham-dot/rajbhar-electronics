import type { Metadata } from "next";
import LocalSeoPage from "@/components/LocalSeoPage";

export const metadata: Metadata = {
  title: "TV Repair in Thane | Doorstep LED, LCD & Smart TV Service",
  description:
    "Book doorstep TV repair in Thane with trained technicians. Fast response, transparent pricing, and up to 180 days warranty.",
  alternates: { canonical: "/tv-repair-thane" },
};

export default function TvRepairThanePage() {
  return (
    <LocalSeoPage
      heading="TV Repair Service in Thane"
      intro="Get expert TV repair support in and around Thane with quick doorstep visits. We fix LED, LCD, and Smart TV problems with transparent inspection and clear pricing."
      serviceTag="Thane Service"
      areas={["Naupada", "Ghodbunder", "Majiwada", "Kolshet", "Vartak Nagar", "Kasarvadavali"]}
      highlights={[
        "Same-day diagnostic visit for common TV issues",
        "Skilled technicians for LED/LCD/Smart TV and power/display faults",
        "Genuine-part recommendations with clear estimate before repair",
        "Up to 180 days warranty support after service completion",
      ]}
      faqs={[
        {
          question: "How soon can a technician visit in Thane?",
          answer:
            "For most requests, we schedule a same-day visit depending on slot availability and location.",
        },
        {
          question: "Do you repair all TV brands?",
          answer:
            "Yes. We service major brands including Samsung, LG, Sony, Panasonic, Mi, TCL, and more.",
        },
        {
          question: "Is inspection charge adjusted in final repair?",
          answer:
            "For eligible repair jobs, diagnostic or check-up fees are adjusted in final billing as per service policy.",
        },
      ]}
      bookHref="/book?service=TV%20Check-up"
    />
  );
}
