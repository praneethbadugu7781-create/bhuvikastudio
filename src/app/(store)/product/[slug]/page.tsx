export const dynamic = "force-dynamic";
import { getProductBySlug, getProducts } from "@/lib/db";
import ProductPageClient from "./product-client";

type Props = { params: Promise<{ slug: string }> };

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([getProductBySlug(slug), getProducts()]);

  const related = product
    ? allProducts.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3)
    : [];

  return <ProductPageClient product={product} related={related} />;
}
