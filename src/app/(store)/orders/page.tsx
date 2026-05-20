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
  AlertCircle,
  RotateCcw,
  X,
  Send,
  CreditCard
} from "lucide-react";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import { motion, AnimatePresence } from "framer-motion";

const returnStatusConfig: Record<string, { label: string; bg: string; text: string; description: string }> = {
  REQUESTED: { label: "Return Requested", bg: "bg-amber-100", text: "text-amber-700", description: "Waiting for approval" },
  APPROVED: { label: "Return Approved", bg: "bg-blue-100", text: "text-blue-700", description: "Ship the item back" },
  RECEIVED: { label: "Item Received", bg: "bg-purple-100", text: "text-purple-700", description: "Refund being processed" },
  REFUNDED: { label: "Refunded", bg: "bg-green-100", text: "text-green-700", description: "" },
  REJECTED: { label: "Return Rejected", bg: "bg-red-100", text: "text-red-700", description: "" },
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Return modal state
  const [returnModal, setReturnModal] = useState<string | null>(null); // order ID
  const [returnReason, setReturnReason] = useState("");
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const [returnError, setReturnError] = useState("");
  const [returnSuccess, setReturnSuccess] = useState("");

  // Courier info state
  const [courierOrderId, setCourierOrderId] = useState<string | null>(null);
  const [courierCompany, setCourierCompany] = useState("");
  const [courierTracking, setCourierTracking] = useState("");
  const [submittingCourier, setSubmittingCourier] = useState(false);
  const [courierError, setCourierError] = useState("");
  const [courierSuccess, setCourierSuccess] = useState("");

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

  const isWithin7Days = (dateStr: string | null | undefined) => {
    if (!dateStr) return false;
    const delivered = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - delivered.getTime();
    return diffMs <= 7 * 24 * 60 * 60 * 1000;
  };

  const handleReturnRequest = async (orderId: string) => {
    if (returnReason.trim().length < 10) {
      setReturnError("Please provide a reason with at least 10 characters.");
      return;
    }
    setSubmittingReturn(true);
    setReturnError("");
    setReturnSuccess("");
    try {
      const res = await fetch(`/api/orders/${orderId}/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnReason: returnReason.trim() }),
      });
      if (res.ok) {
        setReturnSuccess("Return request submitted successfully!");
        setReturnReason("");
        await fetchOrders();
        setTimeout(() => {
          setReturnModal(null);
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

  const handleCourierSubmit = async (orderId: string) => {
    if (!courierCompany.trim() || !courierTracking.trim()) {
      setCourierError("Please fill in both courier company and tracking number.");
      return;
    }
    setSubmittingCourier(true);
    setCourierError("");
    setCourierSuccess("");
    try {
      const res = await fetch(`/api/orders/${orderId}/return-courier`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          returnCourierCompany: courierCompany.trim(),
          returnTrackingNumber: courierTracking.trim(),
        }),
      });
      if (res.ok) {
        setCourierSuccess("Courier info submitted successfully!");
        await fetchOrders();
        setTimeout(() => {
          setCourierOrderId(null);
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
            const returnStatus = order.returnStatus || "NONE";
            const hasReturn = returnStatus !== "NONE" && returnStatus !== undefined;
            const canRequestReturn = order.status === "DELIVERED" && returnStatus === "NONE" && isWithin7Days(order.deliveredAt);
            const rConfig = returnStatusConfig[returnStatus];
            
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
                    <span className="text-sm font-bold text-brand-950">₹{(order.totalAmount || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-brand-400">Payment</span>
                    <span className="text-xs font-bold text-brand-800 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded-md w-fit">
                      {order.paymentMethod || "COD"}
                    </span>
                  </div>
                  <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 ${status.bg} ${status.color}`}>
                    <StatusIcon size={16} />
                    <span className="text-xs font-bold uppercase">{status.label}</span>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="p-5">
                  <div className="flex flex-col gap-3">
                    {(order.items || []).map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 text-sm">
                        {item?.image ? (
                          <img 
                            src={item.image} 
                            alt={item?.productName || "Product"} 
                            className="h-12 w-9 rounded object-cover bg-brand-50 border border-brand-100 shrink-0"
                          />
                        ) : (
                          <div className="flex h-12 w-9 items-center justify-center rounded bg-brand-100 text-brand-400 border border-brand-100 shrink-0">
                            <Package size={16} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-brand-900 font-semibold truncate">{item?.productName || item?.name || "Product"}</p>
                          <p className="text-xs text-brand-500">Size: {item?.size || "Free Size"} &bull; Qty: {item?.quantity || item?.qty || 1}</p>
                        </div>
                        <span className="text-brand-900 font-bold shrink-0">₹{(item?.unitPrice || 0).toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Return Status Badge */}
                {hasReturn && rConfig && (
                  <div className="px-5 pb-3">
                    <div className={`flex items-center gap-3 rounded-2xl ${rConfig.bg} px-4 py-3`}>
                      <RotateCcw size={18} className={rConfig.text} />
                      <div className="flex-1">
                        <p className={`text-sm font-bold ${rConfig.text}`}>{rConfig.label}</p>
                        {rConfig.description && (
                          <p className={`text-xs ${rConfig.text} opacity-80`}>{rConfig.description}</p>
                        )}
                        {returnStatus === "REFUNDED" && order.refundAmount && (
                          <p className="text-sm font-bold text-green-800 mt-0.5">
                            Refund of ₹{Number(order.refundAmount).toLocaleString("en-IN")} processed
                          </p>
                        )}
                      </div>
                      {returnStatus === "APPROVED" && (
                        <button
                          onClick={() => {
                            setCourierOrderId(orderId);
                            setCourierCompany(order.returnCourierCompany || "");
                            setCourierTracking(order.returnTrackingNumber || "");
                            setCourierError("");
                            setCourierSuccess("");
                          }}
                          className="rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition flex items-center gap-1.5"
                        >
                          <Truck size={14} />
                          {order.returnCourierCompany ? "Update Courier Info" : "Add Courier Info"}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-brand-50 p-4">
                  <div className="flex items-center gap-4">
                    <Link href={`/track?orderId=${orderId}`} className="text-xs font-bold text-brand-500 hover:underline">
                      Track Order
                    </Link>
                    {canRequestReturn && (
                      <button
                        onClick={() => {
                          setReturnModal(orderId);
                          setReturnReason("");
                          setReturnError("");
                          setReturnSuccess("");
                        }}
                        className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-4 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100 transition"
                      >
                        <RotateCcw size={14} />
                        Request Return
                      </button>
                    )}
                  </div>
                  <Link href={`/track?orderId=${orderId}`} className="flex items-center gap-1 text-xs font-bold text-brand-900">
                    Details <ChevronRight size={14} />
                  </Link>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Return Request Modal */}
      <AnimatePresence>
        {returnModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReturnModal(null)}
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
                <button onClick={() => setReturnModal(null)} className="rounded-lg p-2 hover:bg-brand-50 transition">
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
                  onClick={() => handleReturnRequest(returnModal)}
                  disabled={submittingReturn || returnReason.trim().length < 10}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-900 py-3.5 font-semibold text-white transition hover:bg-brand-950 disabled:opacity-50"
                >
                  {submittingReturn ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  {submittingReturn ? "Submitting..." : "Submit Return Request"}
                </button>

                <p className="text-xs text-center text-brand-400">
                  Returns are accepted within 7 days of delivery. The admin will review your request.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Courier Info Modal */}
      <AnimatePresence>
        {courierOrderId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCourierOrderId(null)}
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
                <button onClick={() => setCourierOrderId(null)} className="rounded-lg p-2 hover:bg-brand-50 transition">
                  <X size={18} />
                </button>
              </div>

              <p className="mt-3 text-sm text-brand-600">
                Send the item back and provide the courier details below so we can track your return.
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
                  onClick={() => handleCourierSubmit(courierOrderId)}
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
