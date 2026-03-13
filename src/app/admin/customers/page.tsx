"use client";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Users, Mail, Phone, ShoppingBag } from "lucide-react";

type Customer = {
  id: string; name: string | null; email: string | null; mobile: string | null;
  createdAt: string; orders: { id: string; totalAmount: string; status: string }[];
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/customers");
      if (res.ok) setCustomers(await res.json());
      else setCustomers([]);
    } catch { setCustomers([]); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    return c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.mobile?.includes(q);
  });

  const totalRevenue = (c: Customer) => c.orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-brand-950">Customers</h1>
        <p className="mt-1 text-brand-700">{customers.length} registered customers</p>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..." className="w-full rounded-xl border border-brand-200 bg-white py-3 pl-11 pr-4 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
      </div>

      {loading ? (
        <div className="py-12 text-center text-brand-700">Loading customers...</div>
      ) : customers.length === 0 ? (
        <div className="rounded-2xl border border-brand-100 bg-white py-16 text-center shadow-sm">
          <Users size={48} className="mx-auto text-brand-300" />
          <h3 className="mt-4 text-xl font-bold text-brand-950">No customers yet</h3>
          <p className="mt-2 text-brand-700">Customers will appear here when they register on the storefront.</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-100 text-left text-xs font-semibold uppercase tracking-wider text-brand-500">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Orders</th>
                  <th className="px-6 py-4">Total Spent</th>
                  <th className="px-6 py-4">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="border-b border-brand-50 hover:bg-brand-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                          {(c.name || "?")[0].toUpperCase()}
                        </div>
                        <p className="font-semibold text-brand-900">{c.name || "Guest"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        {c.email && <p className="flex items-center gap-1.5 text-sm text-brand-700"><Mail size={13} /> {c.email}</p>}
                        {c.mobile && <p className="flex items-center gap-1.5 text-sm text-brand-700"><Phone size={13} /> {c.mobile}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-brand-900">
                        <ShoppingBag size={14} /> {c.orders.length}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-brand-900">
                      ₹{totalRevenue(c).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-700">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="py-12 text-center text-brand-700">No customers match your search.</div>}
        </motion.div>
      )}
    </div>
  );
}
