export const dynamic = "force-dynamic";
import { getProducts, getFeaturedProducts } from "@/lib/db";
import HomeClient from "./home-client";

export default async function Home() {
  const [products, featured] = await Promise.all([getProducts(), getFeaturedProducts()]);
  return <HomeClient products={products} featured={featured} />;
}
