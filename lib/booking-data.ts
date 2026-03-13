export interface IssueOption {
  id: string;
  name: string;
  rating: number;
  reviews: string;
  price: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  rating: number;
  reviews: string;
  startingPrice: number;
  note?: string;
  issueTypes: IssueOption[];
}

export interface CartItem {
  serviceId: string;
  issueId: string;
  serviceName: string;
  issueName: string;
  price: number;
  quantity: number;
}

export const BOOKING_SERVICES: ServiceItem[] = [
  {
    id: "tv-checkup",
    title: "TV Check-up",
    rating: 4.77,
    reviews: "2.1K",
    startingPrice: 249,
    note: "Visitation fee will be adjusted in the final repair quote",
    issueTypes: [
      { id: "display", name: "Display Issue", rating: 4.8, reviews: "850", price: 249 },
      { id: "power", name: "Power Issue", rating: 4.7, reviews: "620", price: 249 },
      { id: "sound", name: "Sound Issue", rating: 4.8, reviews: "430", price: 249 },
      { id: "unknown", name: "Unknown Issue", rating: 4.7, reviews: "510", price: 299 },
    ],
  },
  {
    id: "led-lcd-repair",
    title: "LED/LCD TV Repair",
    rating: 4.8,
    reviews: "1.8K",
    startingPrice: 299,
    issueTypes: [
      { id: "backlight", name: "Backlight Problem", rating: 4.8, reviews: "680", price: 299 },
      { id: "screen-lines", name: "Screen Lines", rating: 4.7, reviews: "450", price: 349 },
      { id: "no-display", name: "No Display", rating: 4.8, reviews: "520", price: 299 },
      { id: "panel-damage", name: "Panel Damage", rating: 4.6, reviews: "310", price: 499 },
    ],
  },
  {
    id: "smart-tv-repair",
    title: "Smart TV Repair",
    rating: 4.7,
    reviews: "1.5K",
    startingPrice: 349,
    issueTypes: [
      { id: "wifi-issue", name: "WiFi / Connectivity", rating: 4.7, reviews: "420", price: 349 },
      { id: "software", name: "Software Glitch", rating: 4.8, reviews: "380", price: 349 },
      { id: "app-crash", name: "App Crash / Freeze", rating: 4.7, reviews: "290", price: 349 },
      { id: "remote-issue", name: "Remote Not Working", rating: 4.9, reviews: "210", price: 299 },
    ],
  },
  {
    id: "crt-tv-repair",
    title: "CRT TV Repair",
    rating: 4.9,
    reviews: "950",
    startingPrice: 199,
    issueTypes: [
      { id: "no-picture", name: "No Picture / Blank Screen", rating: 4.9, reviews: "320", price: 199 },
      { id: "color-issue", name: "Color Distortion", rating: 4.8, reviews: "280", price: 249 },
      { id: "flyback", name: "Flyback Transformer Issue", rating: 4.9, reviews: "180", price: 349 },
      { id: "crt-general", name: "General CRT Repair", rating: 4.8, reviews: "170", price: 249 },
    ],
  },
  {
    id: "tv-installation",
    title: "TV Installation",
    rating: 4.88,
    reviews: "1.2K",
    startingPrice: 399,
    issueTypes: [
      { id: "wall-mount", name: "Wall Mounting", rating: 4.9, reviews: "580", price: 399 },
      { id: "tabletop", name: "Tabletop Setup", rating: 4.8, reviews: "340", price: 349 },
      { id: "mount-replace", name: "Mount Replacement", rating: 4.9, reviews: "180", price: 449 },
    ],
  },
  {
    id: "tv-uninstall",
    title: "TV Uninstallation",
    rating: 4.89,
    reviews: "680",
    startingPrice: 349,
    issueTypes: [
      { id: "wall-remove", name: "Wall Mount Removal", rating: 4.9, reviews: "380", price: 349 },
      { id: "relocation", name: "TV Relocation", rating: 4.8, reviews: "210", price: 399 },
    ],
  },
  {
    id: "annual-maintenance",
    title: "Annual Maintenance",
    rating: 4.8,
    reviews: "450",
    startingPrice: 999,
    issueTypes: [
      { id: "basic-amc", name: "Basic AMC", rating: 4.8, reviews: "280", price: 999 },
      { id: "premium-amc", name: "Premium AMC", rating: 4.9, reviews: "170", price: 1499 },
    ],
  },
];

// Coupon system
export interface Coupon {
  code: string;
  type: "percent" | "flat" | "free-checkup";
  value: number; // percentage or flat amount
  minOrder?: number;
  appliesTo?: string[]; // service IDs, undefined = all
  description: string;
}

export const COUPONS: Coupon[] = [
  {
    code: "FIRST10",
    type: "percent",
    value: 10,
    description: "10% off on first repair",
  },
  {
    code: "AMC100",
    type: "flat",
    value: 100,
    appliesTo: ["annual-maintenance"],
    description: "₹100 off on Annual Maintenance",
  },
  {
    code: "FREECHECK",
    type: "free-checkup",
    value: 249,
    description: "Free TV check-up with any repair",
  },
];

export function applyCoupon(
  code: string,
  cart: CartItem[]
): { valid: boolean; discount: number; message: string } {
  const coupon = COUPONS.find((c) => c.code === code.toUpperCase().trim());
  if (!coupon) return { valid: false, discount: 0, message: "Invalid coupon code" };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (cart.length === 0) return { valid: false, discount: 0, message: "Add items to cart first" };

  if (coupon.type === "percent") {
    const discount = Math.round(total * (coupon.value / 100));
    return { valid: true, discount, message: `${coupon.value}% off applied! You save ₹${discount}` };
  }

  if (coupon.type === "flat") {
    if (coupon.appliesTo) {
      const hasApplicable = cart.some((item) => coupon.appliesTo!.includes(item.serviceId));
      if (!hasApplicable) {
        return { valid: false, discount: 0, message: "This coupon is not applicable to your cart items" };
      }
    }
    const discount = Math.min(coupon.value, total);
    return { valid: true, discount, message: `₹${discount} off applied!` };
  }

  if (coupon.type === "free-checkup") {
    const checkupItem = cart.find((item) => item.serviceId === "tv-checkup");
    if (checkupItem) {
      return { valid: true, discount: checkupItem.price * checkupItem.quantity, message: "Free check-up applied!" };
    }
    return { valid: true, discount: Math.min(coupon.value, total), message: "₹249 discount applied!" };
  }

  return { valid: false, discount: 0, message: "Invalid coupon" };
}
