import { Wrench, MonitorPlay, Star, Plug, Settings } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";

interface RateItem {
  description: string;
  price: string;
}

interface RateSection {
  title: string;
  icon: React.ElementType;
  items: RateItem[];
}

const rateSections: RateSection[] = [
  {
    title: "Installation / Uninstallation",
    icon: Wrench,
    items: [
      { description: "Installation – Wall Mount 24\" ~ 26\"", price: "₹299" },
      { description: "Installation – Wall Mount 32\" ~ 43\"", price: "₹449" },
      { description: "Installation – Wall Mount 46\" ~ 55\"", price: "₹399" },
      { description: "Installation – Wall Mount 65\"", price: "₹599" },
      { description: "Installation – Wall Mount 68\" ~ 75\"", price: "₹1,000" },
      { description: "Installation – Wall Mount 76\" ~ 85\"", price: "₹3,599" },
      { description: "Rotating Wall Mount Stand 24\" ~ 26\"", price: "₹800" },
      { description: "Rotating Wall Mount Stand 32\" ~ 43\"", price: "₹1,000" },
      { description: "Rotating Wall Mount Stand 46\" ~ 55\"", price: "₹1,399" },
      { description: "Rotating Wall Mount Stand 65\"", price: "₹1,799" },
      { description: "Uninstallation Below 46\"", price: "₹149" },
      { description: "Uninstallation 46\" ~ 55\"", price: "₹149" },
      { description: "Uninstallation 65\"", price: "₹199" },
      { description: "Uninstallation 75\" ~ 85\"", price: "₹249" },
      { description: "Universal Wall Mount Stand 24\" ~ 26\"", price: "₹399" },
      { description: "Universal Wall Mount Stand 32\" ~ 43\"", price: "₹599" },
      { description: "Universal Wall Mount Stand 46\" ~ 55\"", price: "₹699" },
      { description: "Universal Wall Mount Stand 65\"", price: "₹799" },
    ],
  },
  {
    title: "TV Repair (24\" ~ 32\")",
    icon: MonitorPlay,
    items: [
      { description: "Backlight Set 24\" ~ 26\"", price: "₹2,200" },
      { description: "Backlight Set 32\"", price: "On Inspection" },
      { description: "Diffuser Sheet 24\"", price: "On Inspection" },
      { description: "Diffuser Sheet 26\"", price: "On Inspection" },
      { description: "Diffuser Sheet 32\"", price: "On Inspection" },
      { description: "Invertor Board Repair", price: "On Inspection" },
      { description: "Invertor Board Replace (Universal)", price: "On Inspection" },
      { description: "IR Function PCB Repair", price: "On Inspection" },
      { description: "LVDS Cable", price: "On Inspection" },
      { description: "Motherboard Repair", price: "On Inspection" },
      { description: "Motherboard Replace Non-Smart", price: "On Inspection" },
      { description: "Motherboard Replace Smart", price: "On Inspection" },
      { description: "Panel Repair 24\" ~ 26\"", price: "On Inspection" },
      { description: "Panel Repair 32\"", price: "On Inspection" },
      { description: "Panel Replacement HD Ready", price: "On Inspection" },
      { description: "Panel Replacement FHD", price: "On Inspection" },
      { description: "Power Supply Board Repair", price: "On Inspection" },
      { description: "Power Supply Board Replace", price: "On Inspection" },
      { description: "T-Con Repair", price: "On Inspection" },
      { description: "Wire Strip", price: "On Inspection" },
      { description: "LD Board Repair", price: "On Inspection" },
    ],
  },
  {
    title: "TV Repair (40\" ~ 43\")",
    icon: MonitorPlay,
    items: [
      { description: "Backlight Set", price: "On Inspection" },
      { description: "Diffuser Sheet", price: "On Inspection" },
      { description: "Invertor Board Repair", price: "On Inspection" },
      { description: "Invertor Board Replace", price: "On Inspection" },
      { description: "IR Function PCB Repair", price: "On Inspection" },
      { description: "LVDS Cable", price: "On Inspection" },
      { description: "Motherboard Repair", price: "On Inspection" },
      { description: "Motherboard Replace Non-Smart", price: "On Inspection" },
      { description: "Motherboard Replace Smart", price: "On Inspection" },
      { description: "Panel Repair (Bonding Machine)", price: "On Inspection" },
      { description: "Panel Replacement HD / FHD / UHD", price: "On Inspection" },
      { description: "Power Supply Board Repair", price: "On Inspection" },
      { description: "Power Supply Board Replace", price: "On Inspection" },
      { description: "T-Con Repair", price: "On Inspection" },
      { description: "LD Board Repair", price: "On Inspection" },
    ],
  },
  {
    title: "TV Repair (46\" ~ 55\")",
    icon: MonitorPlay,
    items: [
      { description: "Backlight Set", price: "On Inspection" },
      { description: "Diffuser Sheet", price: "On Inspection" },
      { description: "Invertor Board Repair", price: "On Inspection" },
      { description: "Invertor Board Replace", price: "On Inspection" },
      { description: "IR Function PCB Repair", price: "On Inspection" },
      { description: "LVDS Cable", price: "On Inspection" },
      { description: "Motherboard Repair", price: "On Inspection" },
      { description: "Motherboard Replace Non-Smart", price: "On Inspection" },
      { description: "Motherboard Replace Smart", price: "On Inspection" },
      { description: "Panel Repair", price: "On Inspection" },
      { description: "Panel Replacement FHD / UHD", price: "On Inspection" },
      { description: "Power Supply Board Repair", price: "On Inspection" },
      { description: "Power Supply Board Replace", price: "On Inspection" },
      { description: "T-Con Repair", price: "On Inspection" },
      { description: "Wire Strip", price: "On Inspection" },
      { description: "LD Board Repair", price: "On Inspection" },
    ],
  },
  {
    title: "TV Repair (65\" ~ 75\")",
    icon: MonitorPlay,
    items: [
      { description: "Backlight Set", price: "On Inspection" },
      { description: "Motherboard Repair", price: "On Inspection" },
      { description: "Motherboard Replace Smart", price: "On Inspection" },
      { description: "Power Supply Board Repair", price: "On Inspection" },
      { description: "Panel Repair", price: "On Inspection" },
      { description: "Panel Replacement FHD / UHD", price: "On Inspection" },
      { description: "T-Con Repair", price: "On Inspection" },
      { description: "LD Board Repair", price: "On Inspection" },
    ],
  },
  {
    title: "Branded Parts",
    icon: Star,
    items: [
      { description: "Speaker Set", price: "On Inspection" },
      { description: "BT Remote Control", price: "On Inspection" },
      { description: "Invertor Board Replacement", price: "On Inspection" },
      { description: "Motherboard Replacement", price: "On Inspection" },
      { description: "IR PCB Replacement", price: "On Inspection" },
      { description: "Panel Replacement", price: "On Inspection" },
      { description: "Power Supply Board Replacement", price: "On Inspection" },
      { description: "Power Adaptor", price: "On Inspection" },
      { description: "LD Board Replacement", price: "On Inspection" },
      { description: "T-Con Replacement", price: "On Inspection" },
      { description: "Diffuser Sheet", price: "On Inspection" },
      { description: "Panel Minor Repair", price: "On Inspection" },
    ],
  },
  {
    title: "Other Accessories",
    icon: Plug,
    items: [
      { description: "Audio Video RCA Cable", price: "On Inspection" },
      { description: "HDMI Cord", price: "On Inspection" },
      { description: "Universal Remote", price: "On Inspection" },
      { description: "Power Cord", price: "On Inspection" },
      { description: "Speaker Set Universal", price: "On Inspection" },
      { description: "WiFi Module", price: "On Inspection" },
      { description: "External Device Connectivity", price: "On Inspection" },
    ],
  },
  {
    title: "Minor Repair Services",
    icon: Settings,
    items: [
      { description: "Motherboard Cleaning", price: "On Inspection" },
      { description: "Connector / Cable Cleaning", price: "On Inspection" },
      { description: "Software Reset / Upgrade", price: "On Inspection" },
      { description: "Fuse Change Minor Repair", price: "On Inspection" },
      { description: "External Device Issue", price: "On Inspection" },
    ],
  },
];

export default function RateCard() {
  return (
    <main className="min-h-screen bg-background dark:bg-gray-950 text-gray-900 dark:text-white">
      <TopBar />
      <Navbar />

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-blue-accent text-sm font-semibold uppercase tracking-wider">
              Transparent Pricing
            </span>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2 mb-4">
              Our Rate Card
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Fixed, transparent pricing for all our services. No hidden charges, no surprises. Prices may vary based on TV brand and model.
            </p>
          </div>

          {/* Rate sections */}
          <div className="flex flex-col gap-10">
            {rateSections.map((section) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.title}
                  className="bg-card dark:bg-gray-800/60 border border-border rounded-2xl overflow-hidden"
                >
                  {/* Section header */}
                  <div className="flex items-center gap-3 px-6 py-4 bg-blue-accent/5 dark:bg-blue-accent/10 border-b border-border">
                    <div className="w-10 h-10 bg-blue-accent/10 dark:bg-blue-accent/20 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-accent" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      {section.title}
                    </h2>
                  </div>

                  {/* Table header */}
                  <div className="grid grid-cols-[1fr_auto] px-6 py-3 bg-gray-50 dark:bg-gray-800 border-b border-border">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Description
                    </span>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                      Service Charge
                    </span>
                  </div>

                  {/* Items */}
                  <div>
                    {section.items.map((item, idx) => (
                      <div
                        key={idx}
                        className={`grid grid-cols-[1fr_auto] px-6 py-3 items-center ${
                          idx % 2 === 0
                            ? "bg-white dark:bg-gray-800/30"
                            : "bg-gray-50/50 dark:bg-gray-800/60"
                        } ${idx !== section.items.length - 1 ? "border-b border-border/50" : ""}`}
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {item.description}
                        </span>
                        <span
                          className={`text-sm font-bold text-right ${
                            item.price === "On Inspection"
                              ? "text-gray-500 dark:text-gray-400"
                              : "text-blue-accent"
                          }`}
                        >
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Disclaimer */}
          <div className="mt-10 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
              * &quot;On Inspection&quot; prices are determined after our technician inspects your TV. Final pricing depends on the brand, model, and part availability. All prices include labour charges unless stated otherwise.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
