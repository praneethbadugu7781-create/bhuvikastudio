export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getCategories } from "@/lib/db";
import CategoriesClient from "./categories-client";

export const metadata: Metadata = {
  title: "Shop by Category - Sarees, Lehengas, Western Wear & More",
  description:
    "Explore categories: Sarees, Lehengas, Western Wear, Fusion Wear, Co-ords & Kids Wear at Bhuvika Studio. Find your perfect outfit for every occasion.",
  alternates: { canonical: "https://bhuvikastudio.com/categories" },
  openGraph: {
    title: "Shop by Category | Bhuvika Studio",
    description: "Explore all fashion categories at Bhuvika Studio.",
    url: "https://bhuvikastudio.com/categories",
  },
};

export default async function Categories() {
  const categoryCounts = await getCategories();
  return <CategoriesClient categoryCounts={categoryCounts} />;
}
