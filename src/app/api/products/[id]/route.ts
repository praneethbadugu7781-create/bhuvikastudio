import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: true, images: { orderBy: { displayRank: "asc" } } },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await ctx.params;
  const body = await req.json();
  const { name, description, category, featured, isNewArrival, isBestSeller, stockStatus, variants, images } = body;

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(category !== undefined && { category }),
      ...(featured !== undefined && { featured }),
      ...(isNewArrival !== undefined && { isNewArrival }),
      ...(isBestSeller !== undefined && { isBestSeller }),
      ...(stockStatus !== undefined && { stockStatus }),
    },
  });

  if (variants) {
    await prisma.productVariant.deleteMany({ where: { productId: id } });
    await prisma.productVariant.createMany({
      data: variants.map((v: { sku: string; size: string; color: string; price: string; salePrice?: string; stockQuantity: number }) => ({
        productId: id,
        sku: v.sku,
        size: v.size,
        color: v.color,
        price: v.price,
        salePrice: v.salePrice || null,
        stockQuantity: v.stockQuantity ?? 0,
      })),
    });
  }

  if (images) {
    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.productImage.createMany({
      data: images.map((url: string, i: number) => ({ productId: id, imageUrl: url, displayRank: i })),
    });
  }

  const updated = await prisma.product.findUnique({
    where: { id },
    include: { variants: true, images: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await ctx.params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
