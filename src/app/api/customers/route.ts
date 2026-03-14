import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: { orders: { select: { id: true, totalAmount: true, status: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(customers);
}
