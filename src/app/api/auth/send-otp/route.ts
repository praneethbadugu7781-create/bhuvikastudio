import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

  const code = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Delete old OTPs for this email
  await prisma.otp.deleteMany({ where: { email } });

  // Save new OTP
  await prisma.otp.create({ data: { email, code, expiresAt } });

  // Send email via Resend
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || "Bhuvika Studio <onboarding@resend.dev>",
      to: [email],
      subject: "Your Bhuvika Studio Login Code",
      html: `
        <div style="font-family:sans-serif;max-width:400px;margin:0 auto;padding:20px;">
          <h2 style="color:#1a1a2e;margin-bottom:8px;">Bhuvika Studio</h2>
          <p style="color:#555;font-size:14px;">Your verification code is:</p>
          <div style="background:#f5f5f5;border-radius:12px;padding:20px;text-align:center;margin:16px 0;">
            <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#1a1a2e;">${code}</span>
          </div>
          <p style="color:#888;font-size:12px;">This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    return NextResponse.json({ error: err.message || "Failed to send email" }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "OTP sent to your email" });
}
