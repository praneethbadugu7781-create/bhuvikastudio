export const dynamic = "force-dynamic";
import { getCategories } from "@/lib/db";
import CategoriesClient from "./categories-client";

export default async function Categories() {
  const categoryCounts = await getCategories();
  return <CategoriesClient categoryCounts={categoryCounts} />;
}
