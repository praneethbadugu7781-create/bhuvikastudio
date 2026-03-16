export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getProductBySlug, getProducts } from "@/lib/db";
import ProductPageClient from "./product-client";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const title = `${product.name} - ${product.category}`;
  const description = product.description
    || `Buy ${product.name} online at Bhuvika Studio. ${product.category} starting at ₹${product.price}. Shop now with fast delivery across India.`;

  return {
    title,
    description,
    alternates: { canonical: `https://bhuvikastudio.com/product/${slug}` },
    openGraph: {
      title: `${product.name} | Bhuvika Studio`,
      description,
      url: `https://bhuvikastudio.com/product/${slug}`,
      images: product.image ? [{ url: product.image, width: 800, height: 800, alt: product.name }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Bhuvika Studio`,
      description,
      images: product.image ? [product.image] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([getProductBySlug(slug), getProducts()]);

  const related = product
    ? allProducts.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3)
    : [];

  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description || `${product.name} - ${product.category} from Bhuvika Studio`,
        image: product.images || (product.image ? [product.image] : []),
        brand: { "@type": "Brand", name: "Bhuvika Studio" },
        offers: {
          "@type": "Offer",
          url: `https://bhuvikastudio.com/product/${slug}`,
          priceCurrency: "INR",
          price: product.price,
          availability: product.stock === "In Stock"
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          seller: { "@type": "Organization", name: "Bhuvika Studio" },
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <ProductPageClient product={product} related={related} />
    </>
  );
}
