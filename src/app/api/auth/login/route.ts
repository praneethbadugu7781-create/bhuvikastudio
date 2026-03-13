import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { name, email, mobile } = await req.json();

  if (!email || !mobile) {
    return NextResponse.json({ error: "Email and phone number are required" }, { status: 400 });
  }

  // Try to find existing user by email or mobile
  let user = await prisma.user.findFirst({
    where: { OR: [{ email }, { mobile }] },
  });

  if (user) {
    // Verify both match
    if (user.email !== email || user.mobile !== mobile) {
      return NextResponse.json({ error: "Email and phone number don't match. Please check your details." }, { status: 401 });
    }
  } else {
    // Register new user
    user = await prisma.user.create({
      data: { name: name || null, email, mobile, role: "CUSTOMER" },
    });
  }

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set("userId", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return NextResponse.json({ id: user.id, name: user.name, email: user.email, mobile: user.mobile, role: user.role });
}
