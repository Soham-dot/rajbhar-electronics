import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import PageTransition from "@/components/PageTransition";
import { ThemeProvider } from "@/components/ThemeProvider";
import LoadingScreen from "@/components/LoadingScreen";
import WhatsAppButton from "@/components/WhatsAppButton";
import { BUSINESS } from "@/lib/constants";

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
  title: "Rajbhar Electronics - TV Repair Service in Mumbai",
  description:
    "Mumbai's most trusted TV repair service since 1996. LED, LCD, Smart TV, CRT repair at your doorstep across all Mumbai. Call now for same-day service.",
  keywords: [
    "TV repair Mumbai",
    "LED TV repair Mumbai",
    "Smart TV repair Mumbai",
    "TV technician Mumbai",
    "doorstep TV repair",
    "TV repair Chunabhatti",
  ],
  metadataBase: new URL(`https://${BUSINESS.domain}`),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Rajbhar Electronics - TV Repair Service in Chunabhatti, Mumbai",
    description:
      "Mumbai's most trusted TV repair service since 1996. LED, LCD, Smart TV, CRT repair at your doorstep.",
    url: `https://${BUSINESS.domain}`,
    siteName: BUSINESS.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rajbhar Electronics - TV Repair Service in Chunabhatti, Mumbai",
    description:
      "Mumbai's most trusted TV repair service since 1996. LED, LCD, Smart TV, CRT repair at your doorstep.",
  },
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistMono.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const shouldBeDark = theme === 'dark' || (!theme && prefersDark);

                  if (shouldBeDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.backgroundColor = '#0a0a0a';
                    document.documentElement.style.color = '#ffffff';
                  }
                } catch (e) {}
              })();
            `,
          }}
          suppressHydrationWarning
        />
      </head>
      <body className="page-gradient text-black dark:text-white min-h-screen pb-[88px] md:pb-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: BUSINESS.name,
              image: `https://${BUSINESS.domain}/logo.jpg`,
              url: `https://${BUSINESS.domain}`,
              telephone: BUSINESS.phone,
              email: BUSINESS.email,
              address: {
                "@type": "PostalAddress",
                streetAddress: "Fatima Bai Chal, Hill Rd, Sion Chunabhatti",
                addressLocality: "Mumbai",
                addressRegion: "Maharashtra",
                postalCode: "400022",
                addressCountry: "IN",
              },
              geo: { "@type": "GeoCoordinates", latitude: 19.0554, longitude: 72.8752 },
              openingHours: "Mo-Su 09:00-22:00",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: BUSINESS.googleRating,
                reviewCount: "150",
              },
              priceRange: "Rs199-Rs4999",
              description:
                "Mumbai's most trusted TV repair service since 1996. LED, LCD, Smart TV, CRT repair at your doorstep.",
            }),
          }}
        />
        <ThemeProvider>
          <LoadingScreen />
          <PageTransition>{children}</PageTransition>
          <WhatsAppButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
