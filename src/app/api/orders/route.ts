import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://bhuvika-api.onrender.com";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log what we're sending
    console.log("API Route - Forwarding order with body:", JSON.stringify(body, null, 2));

    // Forward cookies for authentication
    const cookie = request.headers.get("cookie") || "";

    const response = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookie,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Route - Error forwarding order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
