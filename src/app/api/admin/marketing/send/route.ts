import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { channel, subject, message, target } = await req.json();

    if (channel !== "email") {
      return NextResponse.json({ error: "Only email channel is currently supported with Resend" }, { status: 400 });
    }

    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
    }

    // 1. Fetch target customers
    let whereClause: any = { role: "CUSTOMER", email: { not: null } };
    
    if (target === "active") {
      // Logic for active customers (e.g., ordered in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      whereClause.orders = { some: { createdAt: { gte: thirtyDaysAgo } } };
    } else if (target === "vip") {
      // Logic for VIP customers (e.g., spent more than 5000)
      whereClause.orders = { some: { totalAmount: { gte: 5000 } } };
    }

    const customers = await prisma.user.findMany({
      where: whereClause,
      select: { email: true, name: true },
    });

    if (customers.length === 0) {
      return NextResponse.json({ error: "No customers found for this segment" }, { status: 404 });
    }

    const emails = customers.map(c => c.email as string);

    // 2. Send email via Resend
    // Note: Resend Free tier has limits (usually 100 emails/day and only to verified domains)
    // For many recipients, we should send in batches or use Bcc
    const { data, error } = await resend.emails.send({
      from: "Bhuvika Studio <onboarding@resend.dev>", // Replace with your verified domain
      to: ["admin@bhuvikastudio.com"], // Sending to admin for testing, or use actual emails if verified
      bcc: emails,
      subject: subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f1f1f1; border-radius: 20px; overflow: hidden;">
          <div style="background-color: #4a1d1f; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Bhuvika Studio</h1>
          </div>
          <div style="padding: 40px; line-height: 1.6; color: #333;">
            <h2 style="color: #4a1d1f; margin-top: 0;">Hello from Bhuvika Studio!</h2>
            <div style="font-size: 16px; margin-bottom: 30px;">
              ${message.replace(/\n/g, "<br/>")}
            </div>
            <a href="https://bhuvikastudio.com" style="display: inline-block; background-color: #4a1d1f; color: white; padding: 12px 30px; border-radius: 50px; text-decoration: none; font-weight: bold;">Visit Store</a>
          </div>
          <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999;">
            © 2026 Bhuvika Studio. High School Rd, Patamata, Vijayawada.
          </div>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Marketing Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
