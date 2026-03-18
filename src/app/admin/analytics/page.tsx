"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, Users, Package, CreditCard, ArrowUp, ArrowDown } from "lucide-react";

type DashboardData = {
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  thisMonthRevenue: number;
  lastMonthRevenue: number;
  totalRevenue: number;
  ordersByStatus: Record<string, number>;
  recentOrders: { id: string; totalAmount: number; status: string; createdAt: string; user?: { name: string; email: string } }[];
};

type SalesData = { _id: string; revenue: number; orders: number }[];
type BestSeller = { _id: string; name: string; totalSold: number; revenue: number };

export default function AnalyticsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [sales, setSales] = useState<SalesData>([]);
  const [bestSellers, setBestSellers] = useState<BestSeller[]>([]);
  const [period, setPeriod] = useState("7d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/analytics/dashboard").then(r => r.json()),
      fetch(`/api/analytics/sales?period=${period}`).then(r => r.json()),
      fetch("/api/analytics/best-sellers").then(r => r.json()),
    ]).then(([dashboard, salesData, sellers]) => {
      setData(dashboard);
      setSales(salesData);
      setBestSellers(sellers);
      setLoading(false);
    });
  }, [period]);

  if (loading) return <div className="py-12 text-center text-brand-700">Loading analytics...</div>;
  if (!data) return <div className="py-12 text-center text-brand-700">Failed to load analytics</div>;

  const revenueChange = data.lastMonthRevenue > 0
    ? ((data.thisMonthRevenue - data.lastMonthRevenue) / data.lastMonthRevenue * 100).toFixed(1)
    : "100";
  const isPositive = parseFloat(revenueChange) >= 0;

  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-3xl text-brand-950">Analytics</h1><p className="mt-1 text-brand-700">Business insights and performance</p></div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-green-100 p-3"><TrendingUp className="text-green-600" size={20} /></div>
            <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
              {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />} {revenueChange}%
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-brand-950">₹{data.thisMonthRevenue.toLocaleString("en-IN")}</p>
          <p className="text-sm text-brand-500">This month revenue</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
          <div className="rounded-xl bg-brand-100 p-3 w-fit"><ShoppingBag className="text-brand-600" size={20} /></div>
          <p className="mt-3 text-2xl font-bold text-brand-950">{data.totalOrders}</p>
          <p className="text-sm text-brand-500">Total orders</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
          <div className="rounded-xl bg-purple-100 p-3 w-fit"><Users className="text-purple-600" size={20} /></div>
          <p className="mt-3 text-2xl font-bold text-brand-950">{data.totalCustomers}</p>
          <p className="text-sm text-brand-500">Customers</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
          <div className="rounded-xl bg-blue-100 p-3 w-fit"><Package className="text-blue-600" size={20} /></div>
          <p className="mt-3 text-2xl font-bold text-brand-950">{data.totalProducts}</p>
          <p className="text-sm text-brand-500">Products</p>
        </motion.div>
      </div>

      {/* Sales Chart */}
      <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-xl text-brand-950">Sales Overview</h2>
          <div className="flex gap-2">
            {["7d", "30d", "90d"].map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${period === p ? "bg-brand-900 text-white" : "bg-brand-50 text-brand-700 hover:bg-brand-100"}`}>
                {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : "90 Days"}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 h-64 flex items-end gap-1">
          {sales.length === 0 ? (
            <p className="w-full text-center text-brand-500">No sales data</p>
          ) : (
            sales.map((day, i) => {
              const maxRevenue = Math.max(...sales.map(s => s.revenue), 1);
              const height = (day.revenue / maxRevenue * 100);
              return (
                <div key={day._id} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ delay: i * 0.02 }}
                    className="w-full bg-brand-500 rounded-t-lg min-h-[4px]"
                    title={`₹${day.revenue.toLocaleString()}`}
                  />
                  <span className="text-[10px] text-brand-500 rotate-45 origin-left whitespace-nowrap">
                    {new Date(day._id).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Best Sellers */}
        <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl text-brand-950">Best Selling Products</h2>
          <div className="mt-4 space-y-3">
            {bestSellers.length === 0 ? (
              <p className="text-brand-500">No sales data yet</p>
            ) : (
              bestSellers.slice(0, 5).map((product, i) => (
                <div key={product._id} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600">{i + 1}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-brand-900">{product.name}</p>
                    <p className="text-sm text-brand-500">{product.totalSold} sold • ₹{product.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Order Status */}
        <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl text-brand-950">Orders by Status</h2>
          <div className="mt-4 space-y-3">
            {Object.entries(data.ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm font-semibold text-brand-700">{status}</span>
                <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-bold text-brand-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
