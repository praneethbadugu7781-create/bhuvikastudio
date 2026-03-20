"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, MapPin, Package, Plus, Edit2, Trash2, ChevronRight, LogOut, Phone, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";

type SavedAddress = {
  _id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
};

type OrderSummary = {
  _id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: { productName: string }[];
};

export default function AccountPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "addresses" | "orders">("profile");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/account");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      // Fetch addresses
      fetch("/api/addresses", { credentials: "include" })
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          setAddresses(data);
          setLoadingAddresses(false);
        })
        .catch(() => setLoadingAddresses(false));

      // Fetch recent orders (we'll create this endpoint)
      fetch("/api/orders/my-orders", { credentials: "include" })
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          setOrders(data);
          setLoadingOrders(false);
        })
        .catch(() => setLoadingOrders(false));
    }
  }, [user]);

  const handleDeleteAddress = async (id: string) => {
    const res = await fetch(`/api/addresses/${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) {
      setAddresses(prev => prev.filter(a => a._id !== id));
    }
  };

  const handleSetDefault = async (id: string) => {
    const res = await fetch(`/api/addresses/${id}/default`, { method: "PUT", credentials: "include" });
    if (res.ok) {
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: a._id === id })));
    }
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    PACKED: "bg-indigo-100 text-indigo-700",
    SHIPPED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-8">
      <AnimatedSection>
        <h1 className="font-display text-3xl text-brand-950">My Account</h1>
      </AnimatedSection>

      {/* Tabs */}
      <div className="mt-6 flex gap-2 border-b border-brand-100">
        {[
          { id: "profile", label: "Profile", icon: User },
          { id: "addresses", label: "Addresses", icon: MapPin },
          { id: "orders", label: "Orders", icon: Package },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition ${activeTab === tab.id ? "border-b-2 border-brand-500 text-brand-900" : "text-brand-500 hover:text-brand-700"}`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-6">
          <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <User size={32} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-brand-950">{user.name || "Customer"}</h2>
                <div className="mt-2 space-y-1">
                  <p className="flex items-center gap-2 text-sm text-brand-600">
                    <Mail size={14} /> {user.email}
                  </p>
                  {user.mobile && (
                    <p className="flex items-center gap-2 text-sm text-brand-600">
                      <Phone size={14} /> {user.mobile}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/track" className="flex items-center justify-between rounded-xl border border-brand-100 bg-white p-4 transition hover:border-brand-300 hover:shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                  <Package size={20} className="text-purple-600" />
                </div>
                <span className="font-semibold text-brand-900">Track Order</span>
              </div>
              <ChevronRight size={20} className="text-brand-400" />
            </Link>

            <button onClick={logout} className="flex items-center justify-between rounded-xl border border-red-100 bg-white p-4 transition hover:border-red-300 hover:shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <LogOut size={20} className="text-red-600" />
                </div>
                <span className="font-semibold text-red-700">Logout</span>
              </div>
              <ChevronRight size={20} className="text-red-400" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Addresses Tab */}
      {activeTab === "addresses" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-brand-600">{addresses.length} saved address{addresses.length !== 1 ? "es" : ""}</p>
            <Link href="/checkout" className="flex items-center gap-1 rounded-full bg-brand-900 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-950">
              <Plus size={16} /> Add New
            </Link>
          </div>

          {loadingAddresses ? (
            <div className="py-8 text-center text-brand-600">Loading addresses...</div>
          ) : addresses.length === 0 ? (
            <div className="rounded-2xl border border-brand-100 bg-white py-12 text-center">
              <MapPin size={40} className="mx-auto text-brand-300" />
              <p className="mt-4 text-brand-700">No saved addresses yet</p>
              <Link href="/checkout" className="mt-4 inline-flex items-center gap-1 rounded-full bg-brand-900 px-6 py-2 text-sm font-semibold text-white">
                <Plus size={16} /> Add Address
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map(addr => (
                <div key={addr._id} className="rounded-xl border border-brand-100 bg-white p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-brand-900">{addr.fullName}</p>
                        {addr.isDefault && <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">Default</span>}
                      </div>
                      <p className="mt-1 text-sm text-brand-600">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                      <p className="text-sm text-brand-600">{addr.city}, {addr.state} - {addr.postalCode}</p>
                      <p className="mt-1 text-sm font-medium text-brand-700">📞 {addr.phone}</p>
                    </div>
                    <div className="flex gap-2">
                      {!addr.isDefault && (
                        <button onClick={() => handleSetDefault(addr._id)} className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-100">
                          Set Default
                        </button>
                      )}
                      <button onClick={() => handleDeleteAddress(addr._id)} className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-4">
          {loadingOrders ? (
            <div className="py-8 text-center text-brand-600">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-brand-100 bg-white py-12 text-center">
              <Package size={40} className="mx-auto text-brand-300" />
              <p className="mt-4 text-brand-700">No orders yet</p>
              <Link href="/shop" className="mt-4 inline-block rounded-full bg-brand-900 px-6 py-2 text-sm font-semibold text-white">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <Link key={order._id} href={`/track?orderId=${order._id}`} className="block rounded-xl border border-brand-100 bg-white p-4 transition hover:border-brand-300 hover:shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-sm font-semibold text-brand-900">#{order._id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-sm text-brand-600">{order.items.length} item{order.items.length > 1 ? "s" : ""} • ₹{order.totalAmount.toLocaleString("en-IN")}</p>
                      <p className="text-xs text-brand-500">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                        {order.status}
                      </span>
                      <ChevronRight size={20} className="text-brand-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
