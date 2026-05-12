import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "https://bhuvika-api.onrender.com";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return proxyRequest(request, slug);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return proxyRequest(request, slug);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return proxyRequest(request, slug);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return proxyRequest(request, slug);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return proxyRequest(request, slug);
}

async function proxyRequest(request: NextRequest, slug: string[]) {
  try {
    const path = slug.join("/");
    const url = new URL(`${API_URL}/api/${path}`);
    
    // Copy search params
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    const headers = new Headers(request.headers);
    headers.delete("host"); // Let fetch set the host
    headers.set("Origin", API_URL);

    const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.blob();

    const response = await fetch(url.toString(), {
      method: request.method,
      headers: headers,
      body: body,
      cache: "no-store",
      redirect: "manual",
    });

    const data = await response.blob();
    const responseHeaders = new Headers(response.headers);
    
    // Don't leak certain headers
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");

    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(`Proxy error for ${slug.join("/")}:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
