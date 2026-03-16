export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getProducts } from "@/lib/db";
import ShopPage from "./shop-client";

export const metadata: Metadata = {
  title: "Shop All Products - Sarees, Lehengas, Dresses & More",
  description:
    "Browse our complete collection of Sarees, Lehengas, Western Wear, Fusion Wear, Co-ords & Kids Wear. Shop online at Bhuvika Studio with fast delivery across India.",
  alternates: { canonical: "https://bhuvikastudio.com/shop" },
  openGraph: {
    title: "Shop All Products | Bhuvika Studio",
    description: "Browse our complete collection of ethnic and western fashion.",
    url: "https://bhuvikastudio.com/shop",
  },
};

export default async function Shop() {
  const products = await getProducts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Shop All Products - Bhuvika Studio",
    description: "Browse our complete collection of fashion products.",
    url: "https://bhuvikastudio.com/shop",
    isPartOf: { "@type": "WebSite", name: "Bhuvika Studio", url: "https://bhuvikastudio.com" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ShopPage products={products} />
    </>
  );
}
