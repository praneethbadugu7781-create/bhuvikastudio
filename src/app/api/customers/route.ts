import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: { orders: { select: { id: true, totalAmount: true, status: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(customers);
}
