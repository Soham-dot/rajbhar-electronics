import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import PageTransition from "@/components/PageTransition";

const geistMono = localFont({
  src: [
    {
      path: "./fonts/GeistMonoVF.woff",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "./fonts/GeistVF.woff",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-geist",
  display: "swap",
});

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
    <html lang="en" className={`${geistMono.variable} dark`}>
      <body className="bg-background text-white min-h-screen">
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  );
}
