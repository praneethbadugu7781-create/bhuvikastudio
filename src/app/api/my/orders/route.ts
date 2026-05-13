import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Please log in to view your orders" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    // Format the response to match what the frontend expects
    const formattedOrders = orders.map(order => ({
      id: order.id,
      totalAmount: Number(order.totalAmount),
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      items: order.items.map(item => ({
        id: item.id,
        name: item.product.name,
        image: item.product.images?.[0] || "", // Assuming images is an array or handled by include
        price: Number(item.price),
        quantity: item.quantity,
        size: item.variant?.size,
        color: item.variant?.color,
      }))
    }));

    return NextResponse.json(formattedOrders);
  } catch (err: any) {
    console.error("Fetch My Orders Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
