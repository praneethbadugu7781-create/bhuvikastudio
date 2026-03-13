import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { email, phone, otp, method, name } = await req.json();

  if (!otp) return NextResponse.json({ error: "OTP is required" }, { status: 400 });

  const supabase = createAdminClient();

  // Verify OTP with Supabase
  let verifyResult;
  if (method === "email") {
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });
    verifyResult = await supabase.auth.verifyOtp({ email, token: otp, type: "email" });
  } else if (method === "phone") {
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
    verifyResult = await supabase.auth.verifyOtp({ phone: formattedPhone, token: otp, type: "sms" });
  } else {
    return NextResponse.json({ error: "Invalid method" }, { status: 400 });
  }

  if (verifyResult.error) {
    return NextResponse.json({ error: "Invalid or expired OTP. Please try again." }, { status: 401 });
  }

  // OTP verified — now create or find user in our Prisma DB
  let user;
  if (method === "email") {
    user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { name: name || null, email, role: "CUSTOMER" },
      });
    }
  } else {
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
    user = await prisma.user.findFirst({ where: { mobile: formattedPhone } });
    if (!user) {
      user = await prisma.user.create({
        data: { name: name || null, mobile: formattedPhone, role: "CUSTOMER" },
      });
    }
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
