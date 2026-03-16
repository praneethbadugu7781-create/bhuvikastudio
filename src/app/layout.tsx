import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });

const SITE_URL = "https://bhuvikastudio.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Bhuvika Studio | Sarees, Lehengas, Western & Kids Wear Online",
    template: "%s | Bhuvika Studio",
  },
  description:
    "Shop premium Sarees, Lehengas, Western Wear, Fusion Wear, Co-ords & Kids Wear online at Bhuvika Studio. Curated ethnic & modern fashion for every celebration. Based in Vijayawada, India.",
  keywords: [
    "sarees online", "buy sarees", "lehengas online", "buy lehengas",
    "western wear women", "dresses online", "kids wear online",
    "ethnic wear", "fusion wear", "co-ord sets", "indian fashion",
    "women clothing online", "festive wear", "party wear",
    "Bhuvika Studio", "Vijayawada fashion", "boutique online",
    "designer sarees", "bridal lehengas", "women dresses India",
  ],
  authors: [{ name: "Bhuvika Studio" }],
  creator: "Bhuvika Studio",
  publisher: "Bhuvika Studio",
  formatDetection: { telephone: true, email: true },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Bhuvika Studio",
    title: "Bhuvika Studio | Sarees, Lehengas, Western & Kids Wear Online",
    description:
      "Shop premium Sarees, Lehengas, Western Wear, Fusion Wear & Kids Wear at Bhuvika Studio. Curated fashion for every celebration.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bhuvika Studio - Curated Fashion for Every Celebration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bhuvika Studio | Sarees, Lehengas, Western & Kids Wear Online",
    description:
      "Shop premium Sarees, Lehengas, Western Wear & Kids Wear at Bhuvika Studio. Curated fashion for every celebration.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: "PASTE_YOUR_GOOGLE_VERIFICATION_CODE_HERE",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${manrope.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
