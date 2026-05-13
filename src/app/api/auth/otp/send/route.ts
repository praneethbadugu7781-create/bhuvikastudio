import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { mobile } = await req.json();

    if (!mobile || mobile.length !== 10) {
      return NextResponse.json({ error: "Valid 10-digit mobile number is required" }, { status: 400 });
    }

    // 1. Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // 2. Save to database
    await prisma.otp.create({
      data: {
        identifier: mobile,
        code: otp,
        expiresAt,
      },
    });

    // 3. Send SMS via Fast2SMS (Optional - replace with your API Key)
    const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY;
    
    if (FAST2SMS_API_KEY) {
      const response = await fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${FAST2SMS_API_KEY}&route=otp&variables_values=${otp}&numbers=${mobile}`);
      const result = await response.json();
      if (!result.return) {
        return NextResponse.json({ error: result.message || "Failed to send SMS" }, { status: 500 });
      }
    } else {
      // If no API key, we simulate by logging (for testing)
      console.log(`[OTP DEBUG] OTP for ${mobile} is ${otp}`);
      return NextResponse.json({ 
        success: true, 
        message: "OTP sent! (Simulation: Try 1234 if you don't have an API key yet)",
        debug_otp: otp // Only for development
      });
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (err: any) {
    console.error("OTP Send Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
