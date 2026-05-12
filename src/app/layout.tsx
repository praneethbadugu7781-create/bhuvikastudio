import type { Metadata } from "next";
import { Montserrat, Great_Vibes, Playfair_Display } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ variable: "--font-manrope", subsets: ["latin"] });
const greatVibes = Great_Vibes({ variable: "--font-script", weight: "400", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-display", weight: ["400", "500", "600", "700"], subsets: ["latin"] });

const SITE_URL = "https://bhuvikastudio.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Bhuvika Studio | Best Designer Sarees, Lehengas & Kids Wear in Vijayawada",
    template: "%s | Bhuvika Studio",
  },
  description:
    "Bhuvika Studio offers the best collection of Designer Sarees, Bridal Lehengas, Western Wear, and Kids Wear online. Shop premium ethnic & modern fashion for weddings, parties and daily wear. Fast delivery across Vijayawada & Pan-India.",
  keywords: [
    "best designer sarees Vijayawada", "buy lehengas online India", "wedding sarees online", 
    "kids ethnic wear", "designer bridal lehenga", "western dresses for women",
    "boutique in Vijayawada", "online saree shopping", "party wear gowns",
    "Bhuvika Studio online", "latest saree collections 2026", "women fashion boutique",
    "ready to wear sarees", "traditional indian wear", "luxury ethnic wear",
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
    title: "Bhuvika Studio | Premium Sarees, Lehengas & Kids Wear Online",
    description:
      "Discover curated ethnic and modern fashion for every celebration. Shop premium Designer Sarees, Lehengas, and Western Wear at Bhuvika Studio.",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "Bhuvika Studio - Premium Fashion for Every Celebration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bhuvika Studio | Designer Sarees & Lehengas Online",
    description:
      "Shop the latest collection of Designer Sarees, Lehengas, and Kids Wear at Bhuvika Studio. Fast shipping across India.",
    images: ["/logo.svg"],
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
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo-icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo-icon.svg" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${montserrat.variable} ${greatVibes.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
