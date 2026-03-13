import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const { email, phone, method } = await req.json();

  const supabase = createAdminClient();

  if (method === "email") {
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: true, message: "OTP sent to your email" });
  }

  if (method === "phone") {
    if (!phone) return NextResponse.json({ error: "Phone number is required" }, { status: 400 });

    // Format phone with country code if not present
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    const { error } = await supabase.auth.signInWithOtp({ phone: formattedPhone });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: true, message: "OTP sent to your phone" });
  }

  return NextResponse.json({ error: "Invalid method" }, { status: 400 });
}
