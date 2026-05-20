"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw, X, Package, Search, Clock, CheckCircle, XCircle,
  Truck, CreditCard, Loader2, AlertCircle, ArrowRight
} from "lucide-react";

type OrderItem = { id: string; quantity: number; unitPrice: number; productName: string; size: string; color: string };
type ReturnOrder = {
  id: string; status: string; totalAmount: number; createdAt: string;
  returnStatus: string; returnReason: string; returnRequestedAt: string | null;
  returnCourierCompany: string | null; returnTrackingNumber: string | null;
  returnApprovedAt: string | null; returnReceivedAt: string | null;
  refundAmount: number | null; refundNote: string | null; refundedAt: string | null;
  deliveredAt: string | null;
  user: { name: string | null; email: string | null; mobile: string | null } | null;
  items: OrderItem[];
};

const returnStatusColors: Record<string, string> = {
  REQUESTED: "bg-amber-100 text-amber-700",
  APPROVED: "bg-blue-100 text-blue-700",
  RECEIVED: "bg-purple-100 text-purple-700",
  REFUNDED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

const returnStatusIcons: Record<string, React.ElementType> = {
  REQUESTED: Clock,
  APPROVED: CheckCircle,
  RECEIVED: Package,
  REFUNDED: CreditCard,
  REJECTED: XCircle,
};

const allReturnStatuses = ["REQUESTED", "APPROVED", "RECEIVED", "REFUNDED", "REJECTED"];

export default function AdminReturnsPage() {
  const [orders, setOrders] = useState<ReturnOrder[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<ReturnOrder | null>(null);
  const [updating, setUpdating] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");
  const [actionError, setActionError] = useState("");

  // Refund form
  const [refundAmount, setRefundAmount] = useState("");
  const [refundNote, setRefundNote] = useState("");

  const load = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch("/api/analytics/returns");
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    }
    if (showLoading) setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Auto-polling every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => load(false), 30000);
    return () => clearInterval(interval);
  }, [load]);

  // When detail changes, prefill refund amount
  useEffect(() => {
    if (detail) {
      setRefundAmount(String(detail.refundAmount || detail.totalAmount || 0));
      setRefundNote(detail.refundNote || "");
      setActionSuccess("");
      setActionError("");
    }
  }, [detail]);

  const performAction = async (orderId: string, action: string, extra?: Record<string, unknown>) => {
    setUpdating(true);
    setActionSuccess("");
    setActionError("");
    try {
      const res = await fetch(`/api/orders/${orderId}/return-action`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra }),
      });
      if (res.ok) {
        setActionSuccess(`Action "${action}" completed successfully.`);
        await load(false);
        // Refresh detail
        const updatedRes = await fetch("/api/analytics/returns");
        if (updatedRes.ok) {
          const updatedOrders: ReturnOrder[] = await updatedRes.json();
          const refreshed = (Array.isArray(updatedOrders) ? updatedOrders : []).find((o: ReturnOrder) => o.id === orderId);
          if (refreshed) setDetail(refreshed);
        }
      } else {
        const err = await res.json();
        setActionError(err.error || "Action failed.");
      }
    } catch {
      setActionError("Network error. Please try again.");
    }
    setUpdating(false);
  };

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = o.id.toLowerCase().includes(q) ||
      o.user?.name?.toLowerCase().includes(q) ||
      o.user?.email?.toLowerCase().includes(q);
    const matchStatus = filter === "All" || o.returnStatus === filter;
    return matchSearch && matchStatus;
  });

  const getStatusIcon = (status: string) => {
    const Icon = returnStatusIcons[status] || Package;
    return Icon;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
          <RotateCcw size={24} />
        </div>
        <div>
          <h1 className="font-display text-3xl text-brand-950">Returns & Refunds</h1>
          <p className="mt-1 text-brand-700">{orders.length} active return requests</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID or customer..."
            className="w-full rounded-xl border border-brand-200 bg-white py-3 pl-11 pr-4 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", ...allReturnStatuses].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === s
                  ? "bg-brand-900 text-white"
                  : "border border-brand-200 bg-white text-brand-700 hover:bg-brand-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="animate-spin text-brand-500" size={40} />
          <p className="mt-4 font-medium text-brand-600">Loading returns...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-brand-100 bg-white py-16 text-center shadow-sm">
          <RotateCcw size={48} className="mx-auto text-brand-300" />
          <h3 className="mt-4 text-xl font-bold text-brand-950">No return requests</h3>
          <p className="mt-2 text-brand-700">Return requests from customers will appear here.</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-100 text-left text-xs font-semibold uppercase tracking-wider text-brand-500">
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Return Status</th>
                  <th className="px-6 py-4">Requested</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => {
                  const StatusIcon = getStatusIcon(o.returnStatus);
                  return (
                    <tr
                      key={o.id}
                      className="border-b border-brand-50 hover:bg-brand-50/50 cursor-pointer transition"
                      onClick={() => setDetail(o)}
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-brand-900">
                        {o.id.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-brand-900">{o.user?.name || "Guest"}</p>
                        <p className="text-xs text-brand-500">{o.user?.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-brand-700">{o.items?.length || 0}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-brand-900">
                        ₹{Number(o.totalAmount).toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${returnStatusColors[o.returnStatus] || "bg-gray-100 text-gray-700"}`}>
                          <StatusIcon size={14} />
                          {o.returnStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-brand-700">
                        {o.returnRequestedAt ? new Date(o.returnRequestedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-brand-700">No returns match your search.</div>
          )}
        </motion.div>
      )}

      {/* Slide-out Detail Panel */}
      <AnimatePresence>
        {detail && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetail(null)}
              className="fixed inset-0 z-50 bg-black/50"
            />
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="fixed right-0 top-0 z-50 h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <RotateCcw size={20} />
                  </div>
                  <h2 className="font-display text-2xl text-brand-950">Return Details</h2>
                </div>
                <button onClick={() => setDetail(null)} className="rounded-lg p-2 hover:bg-brand-50 transition">
                  <X size={20} />
                </button>
              </div>

              <div className="mt-6 space-y-5">
                {/* Order Info */}
                <div className="rounded-xl bg-brand-50 p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-brand-500">Order ID</p>
                      <p className="font-mono text-sm font-semibold text-brand-900">{detail.id}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${returnStatusColors[detail.returnStatus] || "bg-gray-100 text-gray-700"}`}>
                      {(() => { const I = getStatusIcon(detail.returnStatus); return <I size={14} />; })()}
                      {detail.returnStatus}
                    </span>
                  </div>
                </div>

                {/* Customer & Amount */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-brand-500">Customer</p>
                    <p className="text-sm font-semibold text-brand-900">{detail.user?.name || "Guest"}</p>
                    <p className="text-xs text-brand-500">{detail.user?.email || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-brand-500">Order Total</p>
                    <p className="text-lg font-bold text-brand-950">₹{Number(detail.totalAmount).toLocaleString("en-IN")}</p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">Items</p>
                  <div className="mt-2 space-y-2">
                    {(detail.items || []).map((item, idx) => (
                      <div key={item.id || idx} className="flex justify-between rounded-xl bg-brand-50 p-3">
                        <div>
                          <p className="text-sm font-semibold text-brand-900">{item.productName}</p>
                          <p className="text-xs text-brand-500">x{item.quantity} • {item.size}</p>
                        </div>
                        <p className="text-sm font-semibold text-brand-900">₹{Number(item.unitPrice).toLocaleString("en-IN")}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Return Reason */}
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Return Reason</p>
                  <p className="mt-2 text-sm text-amber-900">{detail.returnReason || "No reason provided"}</p>
                  {detail.returnRequestedAt && (
                    <p className="mt-2 text-xs text-amber-600">
                      Requested on {new Date(detail.returnRequestedAt).toLocaleString("en-IN")}
                    </p>
                  )}
                </div>

                {/* Courier Info (if available) */}
                {(detail.returnCourierCompany || detail.returnTrackingNumber) && (
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck size={16} className="text-blue-600" />
                      <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Return Shipment Info</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-blue-500">Courier</p>
                        <p className="text-sm font-semibold text-blue-900">{detail.returnCourierCompany || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-500">Tracking #</p>
                        <p className="text-sm font-semibold text-blue-900">{detail.returnTrackingNumber || "—"}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success / Error messages */}
                {actionSuccess && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-green-50 border border-green-200 p-3 text-sm text-green-700 font-medium">
                    <CheckCircle size={16} className="inline mr-2" />{actionSuccess}
                  </motion.div>
                )}
                {actionError && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700 font-medium">
                    <AlertCircle size={16} className="inline mr-2" />{actionError}
                  </motion.div>
                )}

                {/* Action Buttons based on status */}
                {detail.returnStatus === "REQUESTED" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">Actions</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => performAction(detail.id, "APPROVE")}
                        disabled={updating}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:opacity-50"
                      >
                        {updating ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                        Approve Return
                      </button>
                      <button
                        onClick={() => performAction(detail.id, "REJECT")}
                        disabled={updating}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                      >
                        {updating ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                        Reject Return
                      </button>
                    </div>
                  </motion.div>
                )}

                {detail.returnStatus === "APPROVED" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <div className="rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-4 text-center">
                      <Truck size={28} className="mx-auto text-blue-500" />
                      <p className="mt-2 text-sm font-semibold text-blue-800">Waiting for customer to ship the item back</p>
                      {detail.returnCourierCompany && (
                        <p className="mt-1 text-xs text-blue-600">
                          Courier: {detail.returnCourierCompany} • Tracking: {detail.returnTrackingNumber || "pending"}
                        </p>
                      )}
                      {detail.returnApprovedAt && (
                        <p className="mt-1 text-xs text-blue-500">
                          Approved on {new Date(detail.returnApprovedAt).toLocaleString("en-IN")}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => performAction(detail.id, "MARK_RECEIVED")}
                      disabled={updating}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-sm font-bold text-white transition hover:bg-purple-700 disabled:opacity-50"
                    >
                      {updating ? <Loader2 size={16} className="animate-spin" /> : <Package size={16} />}
                      Mark as Received
                    </button>
                  </motion.div>
                )}

                {detail.returnStatus === "RECEIVED" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-purple-600 mb-3">Process Refund</p>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-semibold text-purple-700">Refund Amount (₹)</label>
                          <input
                            type="number"
                            value={refundAmount}
                            onChange={e => setRefundAmount(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-purple-200 bg-white px-4 py-2.5 text-sm font-semibold text-brand-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-purple-700">Refund Note (optional)</label>
                          <textarea
                            value={refundNote}
                            onChange={e => setRefundNote(e.target.value)}
                            rows={3}
                            placeholder="Add a note about this refund..."
                            className="mt-1 w-full rounded-lg border border-purple-200 bg-white px-4 py-2.5 text-sm text-brand-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => performAction(detail.id, "REFUND", {
                        refundAmount: Number(refundAmount),
                        refundNote: refundNote || undefined,
                      })}
                      disabled={updating || !refundAmount}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:opacity-50"
                    >
                      {updating ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
                      Process Refund — ₹{Number(refundAmount || 0).toLocaleString("en-IN")}
                    </button>
                  </motion.div>
                )}

                {detail.returnStatus === "REFUNDED" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="rounded-xl border-2 border-green-200 bg-green-50 p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-200">
                          <CheckCircle size={24} className="text-green-700" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-green-800">Refund Processed</p>
                          <p className="text-2xl font-bold text-green-900">₹{Number(detail.refundAmount || 0).toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                      {detail.refundNote && (
                        <div className="mt-3 rounded-lg bg-green-100 p-3">
                          <p className="text-xs font-semibold text-green-700">Note</p>
                          <p className="text-sm text-green-800">{detail.refundNote}</p>
                        </div>
                      )}
                      {detail.refundedAt && (
                        <p className="mt-3 text-xs text-green-600">
                          Refunded on {new Date(detail.refundedAt).toLocaleString("en-IN")}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {detail.returnStatus === "REJECTED" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="rounded-xl border-2 border-red-200 bg-red-50 p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-200">
                          <XCircle size={24} className="text-red-700" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-red-800">Return Rejected</p>
                          <p className="text-sm text-red-700 mt-1">This return request has been declined.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Timeline */}
                <div className="rounded-xl border border-brand-100 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-500 mb-3">Timeline</p>
                  <div className="space-y-3">
                    {detail.returnRequestedAt && (
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                          <Clock size={14} className="text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-brand-900">Return Requested</p>
                          <p className="text-xs text-brand-500">{new Date(detail.returnRequestedAt).toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    )}
                    {detail.returnApprovedAt && (
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                          <CheckCircle size={14} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-brand-900">Return Approved</p>
                          <p className="text-xs text-brand-500">{new Date(detail.returnApprovedAt).toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    )}
                    {detail.returnReceivedAt && (
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                          <Package size={14} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-brand-900">Item Received</p>
                          <p className="text-xs text-brand-500">{new Date(detail.returnReceivedAt).toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    )}
                    {detail.refundedAt && (
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                          <CreditCard size={14} className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-brand-900">Refund Processed</p>
                          <p className="text-xs text-brand-500">{new Date(detail.refundedAt).toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
