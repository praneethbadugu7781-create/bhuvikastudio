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
import AnimatedSection from "@/components/AnimatedSection";
import { motion } from "framer-motion";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
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
        setError(`Error ${res.status}: ${data?.error || data?.message || "Could not load orders"}`);
      }
    } catch (err) {
      setError("Network error. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusDetails = (status: string) => {
    const s = (status || "PENDING").toUpperCase();
    switch (s) {
      case "PENDING": return { icon: Clock, color: "text-amber-500", bg: "bg-amber-50", label: "Pending" };
      case "CONFIRMED": return { icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-50", label: "Confirmed" };
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
            <p className="mt-4 font-medium text-brand-600 tracking-wide">Loading your history...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-3xl bg-red-50 p-12 text-center border border-red-100">
            <AlertCircle className="text-red-500" size={48} />
            <h3 className="mt-4 text-xl font-bold text-red-950">Oops!</h3>
            <p className="mt-2 text-red-700">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-6 rounded-full bg-red-600 px-6 py-2.5 text-sm font-bold text-white shadow-md">
              Refresh Page
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-brand-100 py-24 text-center">
            <ShoppingBag size={40} className="text-brand-300" />
            <h3 className="mt-6 text-2xl font-bold text-brand-950">No orders found</h3>
            <p className="mt-2 text-brand-600">Start shopping to see your orders here!</p>
            <Link href="/shop" className="mt-8 rounded-full bg-brand-900 px-8 py-3.5 font-bold text-white shadow-lg">
              Explore Shop
            </Link>
          </div>
        ) : (
          orders.map((order, i) => {
            if (!order) return null;
            const status = getStatusDetails(order.status);
            const StatusIcon = status.icon;
            const orderId = order._id || order.id || `order-${i}`;
            
            return (
              <motion.div 
                key={orderId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-sm"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-brand-50/30 p-5">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-brand-400">Order ID</span>
                    <span className="font-mono text-sm font-bold text-brand-950">#{String(orderId).slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-brand-400">Total</span>
                    <span className="text-sm font-bold text-brand-950">₹{order.totalAmount || 0}</span>
                  </div>
                  <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 ${status.bg} ${status.color}`}>
                    <StatusIcon size={16} />
                    <span className="text-xs font-bold uppercase">{status.label}</span>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="p-5">
                  <div className="flex flex-col gap-2">
                    {(order.items || []).map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-brand-900 font-medium">{item?.productName || item?.name || "Product"}</span>
                        <span className="text-brand-400">x{item?.quantity || item?.qty || 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-brand-50 p-4">
                  <Link href={`/track?orderId=${orderId}`} className="text-xs font-bold text-brand-500 hover:underline">
                    Track Order
                  </Link>
                  <Link href={`/track?orderId=${orderId}`} className="flex items-center gap-1 text-xs font-bold text-brand-900">
                    Details <ChevronRight size={14} />
                  </Link>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
