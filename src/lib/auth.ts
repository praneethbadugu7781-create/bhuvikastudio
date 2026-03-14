import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getAuthUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, mobile: true, role: true } });
}

export async function requireAdmin() {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}
