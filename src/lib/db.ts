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

export function normalizeCategory(cat: string): string {
  if (!cat) return "";
  const mapping: Record<string, string> = {
    "kurta sets": "Kurta Sets",
    "kurtasets": "Kurta Sets",
    "sarees": "Sarees",
    "saree": "Sarees",
    "lehengas": "Lehengas",
    "lehenga": "Lehengas",
    "indo western": "Indo Western",
    "indowestern": "Indo Western",
    "kids wear": "Kids Wear",
    "kidswear": "Kids Wear",
    "western wear": "Western Wear",
    "westernwear": "Western Wear",
    "co-ords sets": "Co-ords Sets",
    "co-ords": "Co-ords Sets",
    "coords sets": "Co-ords Sets",
    "coordsets": "Co-ords Sets",
    "anarkali": "Anarkali",
    "gowns": "Gowns",
    "gown": "Gowns",
    "fusion wear": "Fusion Wear",
    "fusionwear": "Fusion Wear"
  };
  const key = cat.trim().toLowerCase();
  return mapping[key] || cat.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

function toCatalogItem(p: ApiProduct): CatalogItem {
  const firstVariant = p.variants[0];
  return {
    slug: p.slug,
    name: p.name,
    category: normalizeCategory(p.category),
    price: firstVariant?.salePrice ? Number(firstVariant.salePrice) : (firstVariant ? Number(firstVariant.price) : 0),
    oldPrice: firstVariant?.salePrice ? Number(firstVariant.price) : undefined,
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
    category: normalizeCategory(p.category),
    price: firstVariant?.salePrice ? Number(firstVariant.salePrice) : (firstVariant ? Number(firstVariant.price) : 0),
    oldPrice: firstVariant?.salePrice ? Number(firstVariant.price) : undefined,
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
    const normalizedCat = normalizeCategory(p.category);
    catMap.set(normalizedCat, (catMap.get(normalizedCat) || 0) + 1);
  }
  return Array.from(catMap, ([name, count]) => ({ name, count }));
}
