import "server-only";
import { prisma } from "./prisma";
import type { CatalogItem } from "./catalog";

export async function getProducts(): Promise<CatalogItem[]> {
  const products = await prisma.product.findMany({
    include: { variants: true, images: { orderBy: { displayRank: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return products.map((p) => {
    const firstVariant = p.variants[0];
    const price = firstVariant ? Number(firstVariant.price) : 0;
    const salePrice = firstVariant?.salePrice ? Number(firstVariant.salePrice) : undefined;
    const sizes = [...new Set(p.variants.map((v) => v.size))];
    const color = firstVariant?.color ?? "";
    const image = p.images[0]?.imageUrl ?? "";

    return {
      slug: p.slug,
      name: p.name,
      category: p.category,
      price,
      oldPrice: salePrice,
      sizes,
      color,
      image,
      stock: p.stockStatus === "IN_STOCK" ? "In Stock" : "Out of Stock",
      featured: p.featured,
    } satisfies CatalogItem;
  });
}

export async function getProductBySlug(slug: string) {
  const p = await prisma.product.findUnique({
    where: { slug },
    include: { variants: true, images: { orderBy: { displayRank: "asc" } } },
  });
  if (!p) return null;

  const firstVariant = p.variants[0];
  const price = firstVariant ? Number(firstVariant.price) : 0;
  const salePrice = firstVariant?.salePrice ? Number(firstVariant.salePrice) : undefined;
  const sizes = [...new Set(p.variants.map((v) => v.size))];
  const color = firstVariant?.color ?? "";
  const image = p.images[0]?.imageUrl ?? "";

  return {
    slug: p.slug,
    name: p.name,
    description: p.description,
    category: p.category,
    price,
    oldPrice: salePrice,
    sizes,
    color,
    image,
    images: p.images.map((i) => i.imageUrl),
    stock: (p.stockStatus === "IN_STOCK" ? "In Stock" : "Out of Stock") as "In Stock" | "Out of Stock",
    featured: p.featured,
  };
}

export async function getFeaturedProducts(): Promise<CatalogItem[]> {
  const products = await prisma.product.findMany({
    where: { featured: true },
    include: { variants: true, images: { orderBy: { displayRank: "asc" } } },
  });

  return products.map((p) => {
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
      stock: p.stockStatus === "IN_STOCK" ? "In Stock" : "Out of Stock",
      featured: true,
    } satisfies CatalogItem;
  });
}

export async function getAdminStats() {
  const [productCount, orderCount, userCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
  ]);

  return { productCount, orderCount, userCount, revenue: 0 };
}

export async function getAdminProducts() {
  return prisma.product.findMany({
    include: { variants: true, images: { orderBy: { displayRank: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminOrders() {
  return prisma.order.findMany({
    include: { user: true, items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCategories() {
  const products = await prisma.product.groupBy({
    by: ["category"],
    _count: { id: true },
  });
  return products.map((p) => ({ name: p.category, count: p._count.id }));
}
