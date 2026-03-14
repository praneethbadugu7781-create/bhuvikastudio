import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const orders = await prisma.order.findMany({
    include: { user: true, items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return NextResponse.json({ error: "Please login first" }, { status: 401 });

  const body = await req.json();
  const { address, paymentMethod, items } = body;

  if (!address || !items?.length) {
    return NextResponse.json({ error: "Address and items are required" }, { status: 400 });
  }

  // Create address
  const savedAddress = await prisma.address.create({
    data: {
      userId,
      fullName: address.fullName,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2 || null,
      city: address.city,
      state: address.state || "Andhra Pradesh",
      postalCode: address.postalCode,
    },
  });

  // Calculate totals
  let subtotal = 0;
  const orderItems: { productId: string; variantId: string | null; quantity: number; unitPrice: number; totalPrice: number }[] = [];

  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { slug: item.slug },
      include: { variants: true },
    });
    if (!product) continue;

    const variant = product.variants.find((v: { size: string }) => v.size === item.size) || product.variants[0];
    const price = variant ? Number(variant.price) : 0;
    const itemTotal = price * item.qty;
    subtotal += itemTotal;

    orderItems.push({
      productId: product.id,
      variantId: variant?.id || null,
      quantity: item.qty,
      unitPrice: price,
      totalPrice: itemTotal,
    });
  }

  const deliveryCharge = subtotal > 2000 ? 0 : 80;
  const totalAmount = subtotal + deliveryCharge;

  const order = await prisma.order.create({
    data: {
      userId,
      addressId: savedAddress.id,
      paymentMethod: paymentMethod === "COD" ? "COD" : "UPI",
      subtotal,
      deliveryCharge,
      totalAmount,
      items: { create: orderItems },
    },
    include: { items: { include: { product: true } } },
  });

  return NextResponse.json(order, { status: 201 });
}
