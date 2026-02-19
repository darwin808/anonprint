import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "AnonPrint — Print Anonymous Files Online | Metro Manila Delivery",
  description:
    "AnonPrint — Anonymous online printing service in Metro Manila. Upload your files, we print and deliver. No accounts, no tracking, files deleted after printing.",
  keywords:
    "anonymous printing, online print service, print delivery Manila, document printing Metro Manila, anonymous file printing, print shop Rizal, same day printing Philippines",
  authors: [{ name: "AnonPrint" }],
  openGraph: {
    title: "AnonPrint — Anonymous Online Printing & Delivery",
    description:
      "Upload. Print. Deliver. No accounts, no tracking. Your files are deleted after printing.",
    type: "website",
    url: "https://anonprint.xyz",
    locale: "en_PH",
  },
  twitter: {
    card: "summary_large_image",
    title: "AnonPrint — Anonymous Online Printing & Delivery",
    description:
      "Upload. Print. Deliver. No accounts, no tracking. Your files are deleted after printing.",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://anonprint.xyz",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "AnonPrint",
  description:
    "Anonymous online printing and delivery service in Metro Manila, Philippines.",
  url: "https://anonprint.xyz",
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: 14.5876,
      longitude: 121.0614,
    },
    geoRadius: "30000",
  },
  priceRange: "₱₱",
  paymentAccepted: "GCash, Maya",
  currenciesAccepted: "PHP",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does anonymous printing work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Upload your document, pay via GCash or Maya, and attach your payment receipt. We print your files and deliver via courier. No account needed, no data stored.",
      },
    },
    {
      "@type": "Question",
      name: "What happens to my files after printing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All uploaded files are permanently deleted within 24 hours after your order is printed and delivered.",
      },
    },
    {
      "@type": "Question",
      name: "What areas do you deliver to?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We deliver across Metro Manila via Lalamove courier. Delivery fee starts at ₱60 within 10km.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <JsonLd data={localBusinessSchema} />
        <JsonLd data={faqSchema} />
      </head>
      <body
        className={`${inter.variable} ${spaceMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
