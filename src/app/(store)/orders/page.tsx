"use client";
import { useState, useEffect } from "react";
import { 
  Package, 
  ChevronRight, 
  Loader2, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import { motion } from "framer-motion";

interface OrderItem {
  id?: string;
  _id?: string;
  name?: string;
  productName?: string;
  price?: number;
  unitPrice?: number;
  quantity?: number;
  qty?: number;
  image?: string;
  imageUrl?: string;
  color?: string;
  size?: string;
}

interface Order {
  id?: string;
  _id?: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  paymentStatus?: string;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders/my-orders");
      const data = await res.json();
      
      if (res.ok) {
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } else {
        setError(`Error ${res.status}: ${data.error || data.message || "Could not load your orders."}`);
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusDetails = (status: string) => {
    const s = status?.toUpperCase();
    switch (s) {
      case "PENDING": return { icon: Clock, color: "text-amber-500", bg: "bg-amber-50", label: "Pending" };
      case "CONFIRMED": return { icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-50", label: "Confirmed" };
      case "PROCESSING": return { icon: Loader2, color: "text-blue-500", bg: "bg-blue-50", label: "Processing" };
      case "SHIPPED": return { icon: Truck, color: "text-purple-500", bg: "bg-purple-50", label: "In Transit" };
      case "DELIVERED": return { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50", label: "Delivered" };
      case "CANCELLED": return { icon: XCircle, color: "text-red-500", bg: "bg-red-50", label: "Cancelled" };
      default: return { icon: Package, color: "text-gray-500", bg: "bg-gray-50", label: status || "Unknown" };
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-10">
      <AnimatedSection>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-900 text-white shadow-lg">
            <Package size={24} />
          </div>
          <div>
            <h1 className="font-display text-3xl text-brand-950">My Orders</h1>
            <p className="text-sm text-brand-600">Track and manage your purchases</p>
          </div>
        </div>
      </AnimatedSection>

      <div className="mt-10 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="animate-spin text-brand-500" size={40} />
            <p className="mt-4 font-medium text-brand-600 tracking-wide">Fetching your order history...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-3xl bg-red-50 p-12 text-center">
            <AlertCircle className="text-red-500" size={48} />
            <h3 className="mt-4 text-xl font-bold text-red-950">Oops! Something went wrong</h3>
            <p className="mt-2 text-red-700">{error}</p>
            <button 
              onClick={fetchOrders}
              className="mt-6 rounded-full bg-red-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 shadow-md"
            >
              Retry Loading
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-brand-100 py-24 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-300">
              <ShoppingBag size={40} />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-brand-950">No orders found</h3>
            <p className="mt-2 text-brand-600">You haven&apos;t placed any orders yet. Start shopping to see them here!</p>
            <Link 
              href="/shop"
              className="mt-8 rounded-full bg-brand-900 px-8 py-3.5 font-bold text-white shadow-lg transition hover:bg-brand-950"
            >
              Explore Shop
            </Link>
          </div>
        ) : (
          orders.map((order, i) => {
            const status = getStatusDetails(order.status);
            const StatusIcon = status.icon;
            const orderId = order.id || order._id || "";
            
            return (
              <motion.div 
                key={orderId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-brand-50/30 p-5 md:px-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-400">Order ID</span>
                    <span className="font-mono text-sm font-bold text-brand-950">#{orderId.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-400">Placed On</span>
                    <span className="text-sm font-semibold text-brand-900">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-400">Total Amount</span>
                    <span className="text-sm font-bold text-brand-950">₹{order.totalAmount?.toLocaleString()}</span>
                  </div>
                  <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 ${status.bg} ${status.color}`}>
                    <StatusIcon size={16} className={status.label === "Processing" ? "animate-spin" : ""} />
                    <span className="text-xs font-bold uppercase tracking-wider">{status.label}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-brand-50 p-5 md:px-8">
                  {(order.items || []).slice(0, 3).map((item, idx) => {
                    const itemName = item.name || item.productName || "Product";
                    const itemPrice = item.price || item.unitPrice || 0;
                    const itemQty = item.quantity || item.qty || 1;
                    const itemImage = item.image || item.imageUrl;

                    return (
                      <div key={idx} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                        <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-brand-50 flex items-center justify-center">
                          {itemImage ? (
                            <Image 
                              src={itemImage} 
                              alt={itemName} 
                              fill 
                              className="object-cover"
                            />
                          ) : (
                            <Package size={24} className="text-brand-200" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-brand-950 line-clamp-1">{itemName}</h4>
                          <div className="mt-1 flex items-center gap-3 text-xs text-brand-500">
                            <span>Qty: {itemQty}</span>
                            {item.size && <span>Size: {item.size}</span>}
                          </div>
                        </div>
                        <div className="text-sm font-bold text-brand-950">₹{itemPrice.toLocaleString()}</div>
                      </div>
                    );
                  })}
                  
                  {order.items?.length > 3 && (
                    <div className="py-3 text-center">
                      <span className="text-xs font-medium text-brand-400">+{order.items.length - 3} more items</span>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between border-t border-brand-50 bg-white p-4 md:px-8">
                  <Link 
                    href={`/track?orderId=${orderId}`}
                    className="text-sm font-bold text-brand-500 hover:text-brand-900 transition"
                  >
                    Track Order
                  </Link>
                  <Link 
                    href={`/track?orderId=${orderId}`}
                    className="flex items-center gap-2 text-sm font-bold text-brand-900 hover:text-brand-600 transition"
                  >
                    View Details <ChevronRight size={18} />
                  </Link>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="mt-12 rounded-3xl bg-brand-50/50 p-8 text-center border border-brand-100">
        <h3 className="font-display text-xl text-brand-900">Need help with an order?</h3>
        <p className="mt-2 text-sm text-brand-600">Our customer support team is here to assist you with any questions or concerns.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/help-center" className="rounded-full bg-white px-8 py-3 text-sm font-bold text-brand-900 shadow-sm transition hover:bg-brand-100 border border-brand-200">
            Help Center
          </Link>
          <Link href="/contact" className="rounded-full bg-brand-900 px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-brand-950">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
