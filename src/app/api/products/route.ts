import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const products = await prisma.product.findMany({
    include: { variants: true, images: { orderBy: { displayRank: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = await req.json();
  const { name, slug, description, category, featured, isNewArrival, isBestSeller, stockStatus, variants, images } = body;

  const product = await prisma.product.create({
    data: {
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      description: description || "",
      category,
      featured: featured ?? false,
      isNewArrival: isNewArrival ?? false,
      isBestSeller: isBestSeller ?? false,
      stockStatus: stockStatus || "IN_STOCK",
      variants: variants?.length
        ? { create: variants.map((v: { sku: string; size: string; color: string; price: string; salePrice?: string; stockQuantity: number }) => ({
            sku: v.sku,
            size: v.size,
            color: v.color,
            price: v.price,
            salePrice: v.salePrice || null,
            stockQuantity: v.stockQuantity ?? 0,
          })) }
        : undefined,
      images: images?.length
        ? { create: images.map((url: string, i: number) => ({ imageUrl: url, displayRank: i })) }
        : undefined,
    },
    include: { variants: true, images: true },
  });

  return NextResponse.json(product, { status: 201 });
}
