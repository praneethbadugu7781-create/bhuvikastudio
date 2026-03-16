export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getProducts, getFeaturedProducts } from "@/lib/db";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: "Bhuvika Studio | Sarees, Lehengas, Western & Kids Wear Online",
  description:
    "Shop premium Sarees, Lehengas, Western Wear, Fusion Wear, Co-ords & Kids Wear online at Bhuvika Studio. Curated ethnic & modern fashion for every celebration. Based in Vijayawada.",
  alternates: { canonical: "https://bhuvikastudio.com" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Bhuvika Studio",
  url: "https://bhuvikastudio.com",
  logo: "https://bhuvikastudio.com/logo.svg",
  description:
    "Premium ethnic and western fashion boutique offering Sarees, Lehengas, Western Wear, Kids Wear and more. Based in Vijayawada, India.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Vijayawada",
    addressRegion: "Andhra Pradesh",
    addressCountry: "IN",
  },
  sameAs: [],
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Bhuvika Studio",
  url: "https://bhuvikastudio.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://bhuvikastudio.com/shop?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default async function Home() {
  const [products, featured] = await Promise.all([getProducts(), getFeaturedProducts()]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }} />
      <HomeClient products={products} featured={featured} />
    </>
  );
}
