import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const body = await req.json();
  const { status, paymentStatus, adminNote } = body;

  const order = await prisma.order.update({
    where: { id },
    data: {
      ...(status !== undefined && { status }),
      ...(paymentStatus !== undefined && { paymentStatus }),
      ...(adminNote !== undefined && { adminNote }),
    },
    include: { user: true, items: { include: { product: true } } },
  });

  return NextResponse.json(order);
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  await prisma.order.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
