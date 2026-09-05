import type { Metadata } from "next";
import "../styles/index.css";
import { BUSINESS, SITE_URL } from "./lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Shree Jagannath Music | Musical Instruments Store in Bilaspur",
    template: "%s | Shree Jagannath Music",
  },
  description: BUSINESS.description,
  keywords: [
    "Shree Jagannath Music",
    "musical instruments Bilaspur",
    "guitar shop Bilaspur",
    "music store Chhattisgarh",
    "professional audio equipment",
    "drums keyboards microphones Bilaspur",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: BUSINESS.name,
    title: "Shree Jagannath Music | Musical Instruments Store in Bilaspur",
    description: BUSINESS.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Shree Jagannath Music | Musical Instruments Store in Bilaspur",
    description: BUSINESS.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MusicStore",
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    description: BUSINESS.description,
    url: SITE_URL,
    telephone: BUSINESS.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.address.streetAddress,
      addressLocality: BUSINESS.address.addressLocality,
      addressRegion: BUSINESS.address.addressRegion,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    openingHoursSpecification: BUSINESS.openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    priceRange: BUSINESS.priceRange,
    sameAs: BUSINESS.sameAs,
    areaServed: {
      "@type": "City",
      name: "Bilaspur",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd()),
          }}
        />
        {children}
      </body>
    </html>
  );
}
