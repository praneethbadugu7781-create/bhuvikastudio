import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { email, otp, name } = await req.json();

  if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });
  if (!otp) return NextResponse.json({ error: "OTP is required" }, { status: 400 });

  // Find matching OTP in DB
  const otpRecord = await prisma.otp.findFirst({
    where: { email, code: otp },
  });

  if (!otpRecord) {
    return NextResponse.json({ error: "Invalid OTP. Please try again." }, { status: 401 });
  }

  if (otpRecord.expiresAt < new Date()) {
    await prisma.otp.delete({ where: { id: otpRecord.id } });
    return NextResponse.json({ error: "OTP expired. Please request a new one." }, { status: 401 });
  }

  // OTP valid — delete it
  await prisma.otp.delete({ where: { id: otpRecord.id } });

  // Create or find user
  let user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: { name: name || null, email, role: "CUSTOMER" },
    });
  } else if (name && !user.name) {
    user = await prisma.user.update({ where: { id: user.id }, data: { name } });
  }

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set("userId", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
  });
}
