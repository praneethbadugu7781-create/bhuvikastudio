"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle, Clock, Search, MapPin, ExternalLink } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

type OrderItem = {
  productName: string;
  size: string;
  quantity: number;
  unitPrice: number;
};

type TrackingData = {
  orderId: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  couponDiscount: number;
  totalAmount: number;
  trackingNumber: string | null;
  courierCompany: string | null;
  trackingUrl: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  address: {
    city: string;
    state: string;
    postalCode: string;
  };
};

const statusSteps = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"];

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  PENDING: { label: "Order Placed", icon: Clock, color: "text-yellow-500" },
  CONFIRMED: { label: "Confirmed", icon: CheckCircle, color: "text-blue-500" },
  PACKED: { label: "Packed", icon: Package, color: "text-purple-500" },
  SHIPPED: { label: "Shipped", icon: Truck, color: "text-indigo-500" },
  DELIVERED: { label: "Delivered", icon: CheckCircle, color: "text-green-500" },
  CANCELLED: { label: "Cancelled", icon: Clock, color: "text-red-500" },
};

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("orderId") || "");
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = searchParams.get("orderId");
    if (id) {
      setOrderId(id);
      fetchOrder(id);
    }
  }, [searchParams]);

  const fetchOrder = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError("");
    setTracking(null);

    try {
      const res = await fetch(`/api/orders/track/${id.trim()}`);
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Order not found");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setTracking(data);
    } catch {
      setError("Failed to fetch order. Please try again.");
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderId);
  };

  const getCurrentStepIndex = () => {
    if (!tracking) return -1;
    if (tracking.status === "CANCELLED") return -1;
    return statusSteps.indexOf(tracking.status);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12">
      <AnimatedSection>
        <h1 className="font-display text-4xl text-brand-950">Track Your Order</h1>
        <p className="mt-2 text-brand-600">Enter your order ID to see the current status</p>
      </AnimatedSection>

      <form onSubmit={handleSearch} className="mt-8">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400" />
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID (e.g., 65f1a2b3c4d5e6f7...)"
              className="w-full rounded-xl border border-brand-200 bg-brand-50/50 py-3.5 pl-12 pr-4 text-brand-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading || !orderId.trim()}
            className="rounded-xl bg-brand-900 px-6 font-semibold text-white transition hover:bg-brand-950 disabled:opacity-50"
          >
            {loading ? "..." : "Track"}
          </motion.button>
        </div>
      </form>

      {error && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-xl bg-red-50 p-4 text-center text-red-600">
          {error}
        </motion.div>
      )}

      {tracking && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-6">
          {/* Order Status Header */}
          <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-500">Order ID</p>
                <p className="font-mono text-lg font-bold text-brand-900">#{tracking.orderId.slice(0, 8).toUpperCase()}</p>
              </div>
              <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${tracking.status === "CANCELLED" ? "bg-red-100" : tracking.status === "DELIVERED" ? "bg-green-100" : "bg-brand-100"}`}>
                {(() => {
                  const config = statusConfig[tracking.status] || statusConfig.PENDING;
                  const Icon = config.icon;
                  return (
                    <>
                      <Icon size={18} className={config.color} />
                      <span className={`font-semibold ${config.color}`}>{config.label}</span>
                    </>
                  );
                })()}
              </div>
            </div>
            <p className="mt-2 text-sm text-brand-600">Ordered on {formatDate(tracking.createdAt)}</p>
          </div>

          {/* Progress Tracker */}
          {tracking.status !== "CANCELLED" && (
            <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-bold text-brand-950">Order Progress</h2>
              <div className="relative">
                <div className="absolute left-5 top-5 h-[calc(100%-40px)] w-0.5 bg-brand-100" />
                <div
                  className="absolute left-5 top-5 w-0.5 bg-brand-500 transition-all duration-500"
                  style={{ height: `${(getCurrentStepIndex() / (statusSteps.length - 1)) * 100}%` }}
                />
                <div className="space-y-6">
                  {statusSteps.map((step, index) => {
                    const isCompleted = index <= getCurrentStepIndex();
                    const isCurrent = index === getCurrentStepIndex();
                    const config = statusConfig[step];
                    const Icon = config.icon;

                    return (
                      <div key={step} className="flex items-center gap-4">
                        <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${isCompleted ? "bg-brand-500" : "bg-brand-100"} ${isCurrent ? "ring-4 ring-brand-500/20" : ""}`}>
                          <Icon size={18} className={isCompleted ? "text-white" : "text-brand-400"} />
                        </div>
                        <div>
                          <p className={`font-semibold ${isCompleted ? "text-brand-900" : "text-brand-400"}`}>{config.label}</p>
                          {step === "SHIPPED" && tracking.shippedAt && (
                            <p className="text-sm text-brand-500">{formatDate(tracking.shippedAt)}</p>
                          )}
                          {step === "DELIVERED" && tracking.deliveredAt && (
                            <p className="text-sm text-brand-500">{formatDate(tracking.deliveredAt)}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tracking Details */}
          {tracking.trackingNumber && (
            <div className="rounded-2xl border-2 border-brand-500 bg-gradient-to-br from-brand-50 to-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Truck size={20} className="text-brand-500" />
                <h2 className="text-lg font-bold text-brand-950">Shipping Details</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-white p-4 border border-brand-100">
                  <p className="text-sm text-brand-500">Tracking Number</p>
                  <p className="font-mono text-lg font-bold text-brand-900">{tracking.trackingNumber}</p>
                </div>
                {tracking.courierCompany && (
                  <div className="rounded-xl bg-white p-4 border border-brand-100">
                    <p className="text-sm text-brand-500">Courier Partner</p>
                    <p className="text-lg font-bold text-brand-900">{tracking.courierCompany}</p>
                  </div>
                )}
              </div>
              {tracking.trackingUrl && (
                <a
                  href={tracking.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-900 px-6 py-3 font-semibold text-white transition hover:bg-brand-950"
                >
                  Track on Courier Website <ExternalLink size={16} />
                </a>
              )}
            </div>
          )}

          {/* Order Items */}
          <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-brand-950">Order Items</h2>
            <div className="space-y-3">
              {tracking.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between rounded-xl bg-brand-50 p-4">
                  <div>
                    <p className="font-semibold text-brand-900">{item.productName}</p>
                    <p className="text-sm text-brand-600">Size: {item.size} &bull; Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-brand-900">₹{item.unitPrice.toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
            <hr className="my-4 border-brand-100" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-brand-700">
                <span>Subtotal</span>
                <span>₹{tracking.subtotal.toLocaleString("en-IN")}</span>
              </div>
              {tracking.couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{tracking.couponDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-brand-700">
                <span>Shipping</span>
                <span>{tracking.deliveryCharge === 0 ? "FREE" : `₹${tracking.deliveryCharge}`}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-brand-950 pt-2 border-t border-brand-100">
                <span>Total</span>
                <span>₹{tracking.totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-brand-500" />
              <h2 className="text-lg font-bold text-brand-950">Delivery Location</h2>
            </div>
            <p className="mt-2 text-brand-700">
              {tracking.address.city}, {tracking.address.state} - {tracking.address.postalCode}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
