import { getProducts } from "@/lib/db";
import ShopPage from "./shop-client";

export default async function Shop() {
  const products = await getProducts();
  return <ShopPage products={products} />;
}
