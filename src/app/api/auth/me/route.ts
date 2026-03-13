import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return NextResponse.json(null);

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, mobile: true, role: true } });
  if (!user) return NextResponse.json(null);

  return NextResponse.json(user);
}
