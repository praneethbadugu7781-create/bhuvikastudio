"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, ShoppingCart, Users, IndianRupee, TrendingUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";

type Product = { id: string; name: string; category: string; images: { imageUrl: string }[]; variants: { price: string }[] };

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({ productCount: 0, orderCount: 0, userCount: 0, revenue: 0 });

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then(setProducts);
    fetch("/api/stats").then((r) => r.json()).then(setStats);
  }, []);

  const statCards = [
    { label: "Total Products", value: stats.productCount, icon: Package, color: "bg-blue-50 text-blue-600" },
    { label: "Total Orders", value: stats.orderCount, icon: ShoppingCart, color: "bg-green-50 text-green-600" },
    { label: "Customers", value: stats.userCount, icon: Users, color: "bg-purple-50 text-purple-600" },
    { label: "Revenue", value: `₹${stats.revenue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "bg-brand-50 text-brand-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-brand-950">Dashboard</h1>
        <p className="mt-1 text-brand-700">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}><stat.icon size={22} /></div>
              <span className="flex items-center gap-0.5 text-xs font-semibold text-green-600"><TrendingUp size={12} /> Live</span>
            </div>
            <p className="mt-3 text-2xl font-bold text-brand-950">{typeof stat.value === "number" ? stat.value : stat.value}</p>
            <p className="text-sm text-brand-700">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-brand-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-brand-100 px-6 py-4">
            <h2 className="text-lg font-bold text-brand-950">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-2">
            <Link href="/admin/products" className="flex items-center gap-3 rounded-xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-900 transition hover:bg-brand-100">
              <Package size={18} className="text-brand-500" /> Manage Products
            </Link>
            <Link href="/admin/orders" className="flex items-center gap-3 rounded-xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-900 transition hover:bg-brand-100">
              <ShoppingCart size={18} className="text-brand-500" /> View Orders
            </Link>
            <Link href="/" className="flex items-center gap-3 rounded-xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-900 transition hover:bg-brand-100">
              <ArrowUpRight size={18} className="text-brand-500" /> Visit Storefront
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-brand-950">Top Products</h2>
          <div className="mt-4 space-y-3">
            {products.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img src={item.images[0]?.imageUrl || ""} alt={item.name} className="h-10 w-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-brand-900">{item.name}</p>
                  <p className="text-xs text-brand-700">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
