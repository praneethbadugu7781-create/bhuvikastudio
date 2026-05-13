import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { mobile, otp } = await req.json();
    const user = await getUser(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!mobile || !otp) {
      return NextResponse.json({ error: "Mobile and OTP are required" }, { status: 400 });
    }

    // 1. Check OTP in database
    const validOtp = await prisma.otp.findFirst({
      where: {
        identifier: mobile,
        code: otp,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!validOtp && otp !== "1234") { // Allow 1234 as backup demo
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // 2. Update user mobile number
    await prisma.user.update({
      where: { id: user.id },
      data: { mobile: mobile },
    });

    // 3. Delete the used OTP
    if (validOtp) {
      await prisma.otp.delete({ where: { id: validOtp.id } });
    }

    return NextResponse.json({ success: true, message: "Mobile number verified and updated" });
  } catch (err: any) {
    console.error("OTP Verify Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
