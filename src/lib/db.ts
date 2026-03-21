import "server-only";
import type { CatalogItem, ColorOption } from "./catalog";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function apiFetch(path: string) {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

type ApiProduct = {
  _id: string; id: string; slug: string; name: string; description: string;
  category: string; featured: boolean; isNewArrival: boolean; isBestSeller: boolean;
  stockStatus: string;
  variants: { _id: string; sku: string; size: string; color: string; price: number; salePrice: number | null; stockQuantity: number }[];
  images: { _id: string; imageUrl: string; altText: string | null; displayRank: number }[];
  colorOptions?: { colorName: string; colorCode: string; images: { imageUrl: string }[] }[];
};

function toCatalogItem(p: ApiProduct): CatalogItem {
  const firstVariant = p.variants[0];
  return {
    slug: p.slug,
    name: p.name,
    category: p.category,
    price: firstVariant ? Number(firstVariant.price) : 0,
    oldPrice: firstVariant?.salePrice ? Number(firstVariant.salePrice) : undefined,
    sizes: [...new Set(p.variants.map((v) => v.size))],
    color: firstVariant?.color ?? "",
    image: p.images[0]?.imageUrl ?? "",
    images: p.images.map((i) => i.imageUrl),
    colorOptions: p.colorOptions?.map(c => ({
      colorName: c.colorName,
      colorCode: c.colorCode,
      images: c.images.map(i => i.imageUrl),
    })),
    stock: p.stockStatus === "IN_STOCK" ? "In Stock" : "Out of Stock",
    featured: p.featured,
  };
}

export async function getProducts(): Promise<CatalogItem[]> {
  const products: ApiProduct[] = (await apiFetch("/api/products")) || [];
  return products.map(toCatalogItem);
}

export async function getProductBySlug(slug: string) {
  const products: ApiProduct[] = (await apiFetch("/api/products")) || [];
  const p = products.find((prod) => prod.slug === slug);
  if (!p) return null;

  const firstVariant = p.variants[0];
  return {
    slug: p.slug,
    name: p.name,
    description: p.description,
    category: p.category,
    price: firstVariant ? Number(firstVariant.price) : 0,
    oldPrice: firstVariant?.salePrice ? Number(firstVariant.salePrice) : undefined,
    sizes: [...new Set(p.variants.map((v) => v.size))],
    color: firstVariant?.color ?? "",
    image: p.images[0]?.imageUrl ?? "",
    images: p.images.map((i) => i.imageUrl),
    colorOptions: p.colorOptions?.map(c => ({
      colorName: c.colorName,
      colorCode: c.colorCode,
      images: c.images.map(i => i.imageUrl),
    })),
    stock: (p.stockStatus === "IN_STOCK" ? "In Stock" : "Out of Stock") as "In Stock" | "Out of Stock",
    featured: p.featured,
  };
}

export async function getFeaturedProducts(): Promise<CatalogItem[]> {
  const products: ApiProduct[] = (await apiFetch("/api/products")) || [];
  return products.filter((p) => p.featured).map(toCatalogItem);
}

export async function getCategories() {
  const products: ApiProduct[] = (await apiFetch("/api/products")) || [];
  const catMap = new Map<string, number>();
  for (const p of products) {
    catMap.set(p.category, (catMap.get(p.category) || 0) + 1);
  }
  return Array.from(catMap, ([name, count]) => ({ name, count }));
}
