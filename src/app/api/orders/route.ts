import { NextRequest, NextResponse } from "next/server";

// Hardcode the backend URL to rule out env variable issues
const API_URL = "https://bhuvika-api.onrender.com";
const BUILD_TIME = new Date().toISOString();

export async function GET(request: NextRequest) {
  try {
    const cookie = request.headers.get("cookie") || "";

    const response = await fetch(`${API_URL}/api/orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookie,
      },
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("API Route GET /orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cookie = request.headers.get("cookie") || "";

    // Ensure coupon fields exist with defaults
    const orderPayload = {
      address: body.address,
      paymentMethod: body.paymentMethod,
      items: body.items,
      couponCode: body.couponCode || null,
      couponDiscount: Number(body.couponDiscount) || 0,
    };

    const bodyString = JSON.stringify(orderPayload);

    // Log for debugging
    console.log(`[${BUILD_TIME}] API Route - Sending to backend:`, bodyString);
    console.log(`[${BUILD_TIME}] API Route - Content-Length:`, bodyString.length);

    const response = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": String(bodyString.length),
        "Cookie": cookie,
      },
      body: bodyString,
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("API Route POST /orders error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
