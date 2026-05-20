"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, Truck, CheckCircle, Clock, Search, MapPin, ExternalLink,
  RotateCcw, X, Send, Loader2, AlertCircle, CheckCircle2 
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

type OrderItem = {
  productName: string;
  size: string;
  quantity: number;
  unitPrice: number;
  image?: string | null;
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
  returnStatus?: string;
  returnReason?: string;
  returnRequestedAt?: string | null;
  returnCourierCompany?: string | null;
  returnTrackingNumber?: string | null;
  returnApprovedAt?: string | null;
  returnReceivedAt?: string | null;
  refundAmount?: number | null;
  refundNote?: string | null;
  refundedAt?: string | null;
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

const returnStatusConfig: Record<string, { label: string; bg: string; text: string; description: string }> = {
  REQUESTED: { label: "Return Requested", bg: "bg-amber-100", text: "text-amber-700", description: "Waiting for admin approval" },
  APPROVED: { label: "Return Approved", bg: "bg-blue-100", text: "text-blue-700", description: "Ship the item back using self-courier" },
  RECEIVED: { label: "Item Received", bg: "bg-purple-100", text: "text-purple-700", description: "Refund is being processed by admin" },
  REFUNDED: { label: "Refunded", bg: "bg-green-100", text: "text-green-700", description: "Refund has been completed" },
  REJECTED: { label: "Return Rejected", bg: "bg-red-100", text: "text-red-700", description: "Your return request was declined" },
};

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("orderId") || "");
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Return modal state
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const [returnError, setReturnError] = useState("");
  const [returnSuccess, setReturnSuccess] = useState("");

  // Courier info state
  const [courierModalOpen, setCourierModalOpen] = useState(false);
  const [courierCompany, setCourierCompany] = useState("");
  const [courierTracking, setCourierTracking] = useState("");
  const [submittingCourier, setSubmittingCourier] = useState(false);
  const [courierError, setCourierError] = useState("");
  const [courierSuccess, setCourierSuccess] = useState("");

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

  const isWithin7Days = (dateStr: string | null | undefined) => {
    if (!dateStr) return false;
    const delivered = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - delivered.getTime();
    return diffMs <= 7 * 24 * 60 * 60 * 1000;
  };

  const handleReturnRequest = async () => {
    if (!tracking) return;
    if (returnReason.trim().length < 10) {
      setReturnError("Please provide a reason with at least 10 characters.");
      return;
    }
    setSubmittingReturn(true);
    setReturnError("");
    setReturnSuccess("");
    try {
      const res = await fetch(`/api/orders/${tracking.orderId}/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnReason: returnReason.trim() }),
      });
      if (res.ok) {
        setReturnSuccess("Return request submitted successfully!");
        setReturnReason("");
        await fetchOrder(tracking.orderId);
        setTimeout(() => {
          setReturnModalOpen(false);
          setReturnSuccess("");
        }, 2000);
      } else {
        const err = await res.json();
        setReturnError(err.error || "Failed to submit return request.");
      }
    } catch {
      setReturnError("Network error. Please try again.");
    }
    setSubmittingReturn(false);
  };

  const handleCourierSubmit = async () => {
    if (!tracking) return;
    if (!courierCompany.trim() || !courierTracking.trim()) {
      setCourierError("Please fill in both courier company and tracking number.");
      return;
    }
    setSubmittingCourier(true);
    setCourierError("");
    setCourierSuccess("");
    try {
      const res = await fetch(`/api/orders/${tracking.orderId}/return-courier`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          returnCourierCompany: courierCompany.trim(),
          returnTrackingNumber: courierTracking.trim(),
        }),
      });
      if (res.ok) {
        setCourierSuccess("Courier info submitted successfully!");
        await fetchOrder(tracking.orderId);
        setTimeout(() => {
          setCourierModalOpen(false);
          setCourierSuccess("");
          setCourierCompany("");
          setCourierTracking("");
        }, 2000);
      } else {
        const err = await res.json();
        setCourierError(err.error || "Failed to submit courier info.");
      }
    } catch {
      setCourierError("Network error. Please try again.");
    }
    setSubmittingCourier(false);
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
                <p className="font-mono text-lg font-bold text-brand-990">#{tracking.orderId.slice(0, 8).toUpperCase()}</p>
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
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
              <p className="text-brand-650">Ordered on {formatDate(tracking.createdAt)}</p>
              <div className="flex gap-3 text-xs font-semibold">
                <div>
                  <span className="text-brand-400 uppercase mr-1 text-[10px] font-black">Payment</span>
                  <span className="rounded bg-brand-50 border border-brand-100 px-2 py-0.5 text-brand-900 font-bold">
                    {tracking.paymentMethod || "COD"}
                  </span>
                </div>
                <div>
                  <span className="text-brand-400 uppercase mr-1 text-[10px] font-black">Status</span>
                  <span className={`rounded px-2 py-0.5 font-bold ${
                    tracking.paymentStatus === "VERIFIED" ? "bg-green-150 text-green-700" :
                    tracking.paymentStatus === "REJECTED" ? "bg-red-100 text-red-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {tracking.paymentStatus || "PENDING"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Returns & Refunds Section */}
          {(() => {
            const returnStatus = tracking.returnStatus || "NONE";
            const hasReturn = returnStatus !== "NONE";
            const canRequestReturn = tracking.status === "DELIVERED" && returnStatus === "NONE" && isWithin7Days(tracking.deliveredAt);
            const rConfig = returnStatusConfig[returnStatus];

            if (!hasReturn && !canRequestReturn) return null;

            return (
              <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 border border-amber-100 text-amber-600">
                    <RotateCcw size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-brand-950">Returns & Refunds</h2>
                    <p className="text-sm text-brand-600">Request or track returns for this order</p>
                  </div>
                </div>

                {hasReturn && rConfig && (
                  <div className={`mt-4 flex items-center gap-3 rounded-2xl ${rConfig.bg} px-4 py-4`}>
                    <RotateCcw size={20} className={rConfig.text} />
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${rConfig.text}`}>{rConfig.label}</p>
                      {rConfig.description && (
                        <p className={`text-xs ${rConfig.text} opacity-80 mt-0.5`}>{rConfig.description}</p>
                      )}
                      {returnStatus === "REFUNDED" && tracking.refundAmount && (
                        <p className="text-sm font-bold text-green-800 mt-1">
                          Refund of ₹{Number(tracking.refundAmount).toLocaleString("en-IN")} processed
                        </p>
                      )}
                    </div>
                    {returnStatus === "APPROVED" && (
                      <button
                        onClick={() => {
                          setCourierCompany(tracking.returnCourierCompany || "");
                          setCourierTracking(tracking.returnTrackingNumber || "");
                          setCourierError("");
                          setCourierSuccess("");
                          setCourierModalOpen(true);
                        }}
                        className="rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition flex items-center gap-1.5 shrink-0"
                      >
                        <Truck size={14} />
                        {tracking.returnCourierCompany ? "Update Courier" : "Add Courier Info"}
                      </button>
                    )}
                  </div>
                )}

                {canRequestReturn && (
                  <div className="mt-4 rounded-xl border border-amber-250 bg-amber-50/50 p-4">
                    <p className="text-sm font-bold text-brand-900">
                      Self-Courier Return Only:
                    </p>
                    <p className="mt-1 text-xs text-brand-700 leading-relaxed">
                      Bhuvika Studio does NOT provide return pickup. You must package the item and send it back via a courier service of your choice at your own expense.
                    </p>
                    <button
                      onClick={() => {
                        setReturnReason("");
                        setReturnError("");
                        setReturnSuccess("");
                        setReturnModalOpen(true);
                      }}
                      className="mt-3 flex items-center gap-1.5 rounded-full bg-amber-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-700 transition shadow-lg shadow-amber-600/10"
                    >
                      <RotateCcw size={16} />
                      Request Return
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Progress Tracker */}
          {tracking.status !== "CANCELLED" && (
            <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-brand-950">Order Progress</h2>
                {tracking.status === "SHIPPED" && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={async () => {
                      if (!confirm("Have you received this order?")) return;
                      try {
                        const res = await fetch(`/api/orders/track/${tracking.orderId}/confirm`, { method: "POST" });
                        if (res.ok) {
                          const data = await res.json();
                          setTracking({ ...tracking, status: data.status, deliveredAt: new Date().toISOString() });
                          alert("Thank you! Order marked as delivered.");
                        }
                      } catch {
                        alert("Something went wrong. Please try again.");
                      }
                    }}
                    className="rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-green-600/20 hover:bg-green-700"
                  >
                    Confirm Delivery
                  </motion.button>
                )}
              </div>
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
                <div key={index} className="flex items-center gap-4 rounded-xl bg-brand-50 p-4">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.productName} 
                      className="h-16 w-12 rounded-lg object-cover bg-white border border-brand-100 shrink-0"
                    />
                  ) : (
                    <div className="flex h-16 w-12 items-center justify-center rounded-lg bg-brand-100 text-brand-400 border border-brand-100 shrink-0">
                      <Package size={20} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-brand-900 truncate">{item.productName}</p>
                    <p className="text-sm text-brand-650">Size: {item.size} &bull; Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-brand-900 shrink-0">₹{item.unitPrice.toLocaleString("en-IN")}</p>
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

      {/* Return Request Modal */}
      <AnimatePresence>
        {returnModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReturnModalOpen(false)}
              className="fixed inset-0 z-50 bg-black/50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                    <RotateCcw size={20} className="text-amber-600" />
                  </div>
                  <h3 className="font-display text-xl text-brand-950">Request Return</h3>
                </div>
                <button onClick={() => setReturnModalOpen(false)} className="rounded-lg p-2 hover:bg-brand-50 transition">
                  <X size={18} />
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-brand-800">Why are you returning this order?</label>
                  <textarea
                    value={returnReason}
                    onChange={e => setReturnReason(e.target.value)}
                    rows={4}
                    placeholder="Please describe the reason for return (min 10 characters)..."
                    className="mt-2 w-full rounded-xl border border-brand-200 bg-brand-50/50 px-4 py-3 text-sm text-brand-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 resize-none"
                  />
                  <p className="mt-1 text-xs text-brand-400">{returnReason.length}/10 characters minimum</p>
                </div>

                {returnError && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-600">
                    {returnError}
                  </motion.p>
                )}

                {returnSuccess && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg bg-green-50 border border-green-100 px-3 py-2 text-sm text-green-600 font-medium">
                    <CheckCircle2 size={14} className="inline mr-1.5" />{returnSuccess}
                  </motion.p>
                )}

                <button
                  onClick={handleReturnRequest}
                  disabled={submittingReturn || returnReason.trim().length < 10}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-900 py-3.5 font-semibold text-white transition hover:bg-brand-950 disabled:opacity-50"
                >
                  {submittingReturn ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  {submittingReturn ? "Submitting..." : "Submit Return Request"}
                </button>

                <p className="text-xs text-center text-brand-400">
                  Returns are accepted within 7 days of delivery. <strong>No pickup service is provided.</strong> You must ship the item back via your own courier at your own expense.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Courier Info Modal */}
      <AnimatePresence>
        {courierModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCourierModalOpen(false)}
              className="fixed inset-0 z-50 bg-black/50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                    <Truck size={20} className="text-blue-600" />
                  </div>
                  <h3 className="font-display text-xl text-brand-950">Ship Return</h3>
                </div>
                <button onClick={() => setCourierModalOpen(false)} className="rounded-lg p-2 hover:bg-brand-50 transition">
                  <X size={18} />
                </button>
              </div>

              <p className="mt-3 text-sm text-brand-600">
                Since returns are <strong>self-courier only</strong>, pack the item and ship it using any courier of your choice at your own expense. Enter the details below so we can track your return.
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-brand-800">Courier Company</label>
                  <input
                    value={courierCompany}
                    onChange={e => setCourierCompany(e.target.value)}
                    placeholder="e.g. Delhivery, Blue Dart, India Post..."
                    className="mt-1 w-full rounded-xl border border-brand-200 bg-brand-50/50 px-4 py-3 text-sm text-brand-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-brand-800">Tracking Number / AWB</label>
                  <input
                    value={courierTracking}
                    onChange={e => setCourierTracking(e.target.value)}
                    placeholder="Enter tracking number..."
                    className="mt-1 w-full rounded-xl border border-brand-200 bg-brand-50/50 px-4 py-3 text-sm text-brand-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                {courierError && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-600">
                    {courierError}
                  </motion.p>
                )}

                {courierSuccess && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg bg-green-50 border border-green-100 px-3 py-2 text-sm text-green-600 font-medium">
                    <CheckCircle2 size={14} className="inline mr-1.5" />{courierSuccess}
                  </motion.p>
                )}

                <button
                  onClick={handleCourierSubmit}
                  disabled={submittingCourier || !courierCompany.trim() || !courierTracking.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {submittingCourier ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  {submittingCourier ? "Submitting..." : "Submit Courier Info"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="mx-auto w-full max-w-3xl px-5 py-12 text-center text-brand-700">Loading...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
