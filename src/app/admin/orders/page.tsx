"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Truck, CheckCircle, XCircle, Clock, Package, X, ChevronDown } from "lucide-react";

type OrderItem = { id: string; quantity: number; unitPrice: number; productName: string; size: string; color: string };
type Address = { fullName: string; phone: string; line1: string; line2?: string; city: string; state: string; postalCode: string };
type Order = {
  id: string; status: string; paymentStatus: string; paymentMethod: string;
  subtotal: number; deliveryCharge: number; totalAmount: number; adminNote: string | null;
  createdAt: string; user: { name: string | null; email: string | null; mobile: string | null } | null;
  address: Address;
  items: OrderItem[];
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700", CONFIRMED: "bg-blue-100 text-blue-700",
  PACKED: "bg-indigo-100 text-indigo-700", SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700", CANCELLED: "bg-red-100 text-red-700",
};
const allStatuses = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];
const payStatuses = ["PENDING", "VERIFIED", "REJECTED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) setOrders(await res.json());
      else setOrders([]);
    } catch { setOrders([]); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateOrder = async (id: string, data: Record<string, string>) => {
    setUpdating(true);
    await fetch(`/api/orders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    await load();
    setUpdating(false);
  };

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = o.id.toLowerCase().includes(q) || o.user?.name?.toLowerCase().includes(q) || o.user?.email?.toLowerCase().includes(q);
    const matchStatus = filter === "All" || o.status === filter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-3xl text-brand-950">Orders</h1><p className="mt-1 text-brand-700">{orders.length} total orders</p></div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1"><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="w-full rounded-xl border border-brand-200 bg-white py-3 pl-11 pr-4 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", ...allStatuses].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filter === s ? "bg-brand-900 text-white" : "border border-brand-200 bg-white text-brand-700 hover:bg-brand-50"}`}>{s}</button>
          ))}
        </div>
      </div>

      {loading ? <div className="py-12 text-center text-brand-700">Loading orders...</div> : orders.length === 0 ? (
        <div className="rounded-2xl border border-brand-100 bg-white py-16 text-center shadow-sm">
          <Package size={48} className="mx-auto text-brand-300" />
          <h3 className="mt-4 text-xl font-bold text-brand-950">No orders yet</h3>
          <p className="mt-2 text-brand-700">Orders will appear here when customers place them from the storefront.</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm">
          <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-brand-100 text-left text-xs font-semibold uppercase tracking-wider text-brand-500">
            <th className="px-6 py-4">Order</th><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Items</th><th className="px-6 py-4">Total</th><th className="px-6 py-4">Payment</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Date</th>
          </tr></thead><tbody>
            {filtered.map(o => (
              <tr key={o.id} className="border-b border-brand-50 hover:bg-brand-50/50 cursor-pointer" onClick={() => setDetail(o)}>
                <td className="px-6 py-4 text-sm font-semibold text-brand-900">{o.id.slice(0, 8)}...</td>
                <td className="px-6 py-4"><p className="text-sm font-semibold text-brand-900">{o.user?.name || "Guest"}</p><p className="text-xs text-brand-500">{o.user?.email}</p></td>
                <td className="px-6 py-4 text-sm text-brand-700">{o.items.length}</td>
                <td className="px-6 py-4 text-sm font-semibold text-brand-900">₹{Number(o.totalAmount).toLocaleString("en-IN")}</td>
                <td className="px-6 py-4"><span className="rounded bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-800">{o.paymentMethod}</span></td>
                <td className="px-6 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColors[o.status] || "bg-gray-100 text-gray-700"}`}>{o.status}</span></td>
                <td className="px-6 py-4 text-sm text-brand-700">{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody></table></div>
          {filtered.length === 0 && <div className="py-12 text-center text-brand-700">No orders match.</div>}
        </motion.div>
      )}

      <AnimatePresence>
        {detail && (<>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDetail(null)} className="fixed inset-0 z-50 bg-black/50" />
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="fixed right-0 top-0 z-50 h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between"><h2 className="font-display text-2xl text-brand-950">Order Details</h2><button onClick={() => setDetail(null)} className="rounded-lg p-2 hover:bg-brand-50"><X size={20} /></button></div>
            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-brand-50 p-4"><p className="text-xs text-brand-500">Order ID</p><p className="font-mono text-sm font-semibold text-brand-900">{detail.id}</p></div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-brand-500">Customer</p><p className="text-sm font-semibold text-brand-900">{detail.user?.name || detail.address?.fullName || "Guest"}</p></div>
                <div><p className="text-xs text-brand-500">Email</p><p className="text-sm text-brand-900">{detail.user?.email || "—"}</p></div>
                <div><p className="text-xs text-brand-500">Phone</p><p className="text-sm text-brand-900">{detail.address?.phone || detail.user?.mobile || "—"}</p></div>
                <div><p className="text-xs text-brand-500">Date</p><p className="text-sm text-brand-900">{new Date(detail.createdAt).toLocaleString()}</p></div>
              </div>
              {detail.address && (
                <div className="rounded-xl border border-brand-100 p-4">
                  <p className="text-xs font-semibold text-brand-500 uppercase tracking-wide">Shipping Address</p>
                  <p className="mt-2 text-sm font-semibold text-brand-900">{detail.address.fullName}</p>
                  <p className="text-sm text-brand-700">{detail.address.line1}</p>
                  {detail.address.line2 && <p className="text-sm text-brand-700">{detail.address.line2}</p>}
                  <p className="text-sm text-brand-700">{detail.address.city}, {detail.address.state} - {detail.address.postalCode}</p>
                  <p className="mt-1 text-sm font-semibold text-brand-800">📞 {detail.address.phone}</p>
                </div>
              )}
              <div><p className="text-sm font-semibold text-brand-800">Payment Method</p>
                <p className="mt-1 rounded-lg bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-900">{detail.paymentMethod}</p>
              </div>
              <div><p className="text-sm font-semibold text-brand-800">Order Status</p>
                <select value={detail.status} onChange={e => { updateOrder(detail.id, { status: e.target.value }); setDetail({ ...detail, status: e.target.value }); }} disabled={updating} className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-2.5 outline-none">
                  {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div><p className="text-sm font-semibold text-brand-800">Payment Status</p>
                <select value={detail.paymentStatus} onChange={e => { updateOrder(detail.id, { paymentStatus: e.target.value }); setDetail({ ...detail, paymentStatus: e.target.value }); }} disabled={updating} className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-2.5 outline-none">
                  {payStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div><p className="text-sm font-semibold text-brand-800">Items</p>
                <div className="mt-2 space-y-2">{detail.items.map((item, idx) => (
                  <div key={item.id || idx} className="flex justify-between rounded-xl bg-brand-50 p-3">
                    <div><p className="text-sm font-semibold text-brand-900">{item.productName}</p><p className="text-xs text-brand-500">x{item.quantity} • {item.size}</p></div>
                    <p className="text-sm font-semibold text-brand-900">₹{Number(item.unitPrice).toLocaleString("en-IN")}</p>
                  </div>
                ))}</div>
              </div>
              <div className="rounded-xl bg-brand-950 p-4 text-white">
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>₹{Number(detail.subtotal).toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between text-sm mt-1"><span>Delivery</span><span>₹{Number(detail.deliveryCharge).toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-brand-800"><span>Total</span><span>₹{Number(detail.totalAmount).toLocaleString("en-IN")}</span></div>
              </div>
            </div>
          </motion.div>
        </>)}
      </AnimatePresence>
    </div>
  );
}
