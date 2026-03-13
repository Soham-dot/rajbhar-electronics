export const BUSINESS = {
  name: "Rajbhar Electronics",
  since: "1996",
  area: "Mumbai",
  phone: "+91 92241 46973",
  phoneRaw: "+919224146973",
  email: "info@rajbharelectronics.in",
  address: "Fatima Bai Chal, Hill Rd, Sion Chunabhatti, Panchsheel Nagar, Chunabhatti, Sion, Mumbai, Maharashtra 400022",
  hours: "Monday – Sunday: 9:00 AM – 10:00 PM",
  mapsUrl: "https://www.google.com/maps/place/Raju+Electronic/@19.0553749,72.8752219,17z",
  whatsappUrl:
    "https://wa.me/919224146973?text=Hi%2C%20I%20need%20TV%20repair%20service",
  googleRating: "4.3",
  totalRepairs: "10,000+",
  domain: "rajbharelectronics.in",
} as const;

export function isAreaServiceable(): boolean {
  return true; // Available all over Mumbai
}
