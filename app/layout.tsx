import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rajbhar Electronics – TV Repair Service in Chunabhatti, Mumbai",
  description:
    "Mumbai's most trusted TV repair service since 1996. LED, LCD, Smart TV, CRT repair at your doorstep in Chunabhatti and nearby areas. Call now for same-day service.",
  keywords: [
    "TV repair Mumbai",
    "LED TV repair Chunabhatti",
    "Smart TV repair",
    "TV technician Mumbai",
    "doorstep TV repair",
  ],
  openGraph: {
    title: "Rajbhar Electronics – TV Repair Service in Chunabhatti, Mumbai",
    description:
      "Mumbai's most trusted TV repair service since 1996. LED, LCD, Smart TV, CRT repair at your doorstep.",
    url: "https://rajbhar-electronics.in",
    siteName: "Rajbhar Electronics",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
      </body>
    </html>
  );
}
