import { Tv, Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

const quickLinks = [
  { label: "Home", href: "#" },
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

const serviceLinks = [
  { label: "LED/LCD TV Repair", href: "#services" },
  { label: "Smart TV Repair", href: "#services" },
  { label: "CRT TV Repair", href: "#services" },
  { label: "TV Installation", href: "#services" },
  { label: "Annual Maintenance", href: "#services" },
  { label: "Emergency Repairs", href: "#services" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Tv className="w-6 h-6 text-blue-accent" />
              <span className="font-bold text-white text-lg">{BUSINESS.name}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Mumbai&apos;s most trusted TV repair service since {BUSINESS.since}. Expert technicians, transparent pricing, and 100% satisfaction guarantee.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {[
                { Icon: Facebook, href: "#", label: "Facebook" },
                { Icon: Twitter, href: "#", label: "Twitter" },
                { Icon: Instagram, href: "#", label: "Instagram" },
                { Icon: Youtube, href: "#", label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 bg-white/5 hover:bg-blue-accent/20 border border-white/10 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4 text-muted hover:text-blue-accent" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Services</h4>
            <ul className="flex flex-col gap-2.5">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-accent flex-shrink-0 mt-0.5" />
                <p className="text-gray-400 text-sm">
                  {BUSINESS.address}
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-accent flex-shrink-0" />
                <a href={`tel:${BUSINESS.phoneRaw}`} className="text-gray-400 hover:text-white text-sm transition-colors">
                  {BUSINESS.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-accent flex-shrink-0" />
                <a href={`mailto:${BUSINESS.email}`} className="text-gray-400 hover:text-white text-sm transition-colors">
                  {BUSINESS.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>© {currentYear} {BUSINESS.name}. All rights reserved.</p>
          <p>
            Made with ❤️ in Mumbai · Serving Chunabhatti since {BUSINESS.since}
          </p>
        </div>
      </div>
    </footer>
  );
}
