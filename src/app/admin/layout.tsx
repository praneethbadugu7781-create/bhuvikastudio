"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3,
  Menu, X, ChevronLeft, LogIn, Lock, LogOut, Loader2,
  Truck, Ticket, Image as ImageIcon, Star, Settings,
} from "lucide-react";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/shipping", label: "Shipping", icon: Truck },
];

type AdminUser = { id: string; name: string; email: string; role: string };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const user = await res.json();
      if (user && user.role === "ADMIN") {
        setAdmin(user);
      } else {
        setAdmin(null);
      }
    } catch {
      setAdmin(null);
    }
    setChecking(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Login failed");
        setLoggingIn(false);
        return;
      }
      setAdmin(data);
    } catch {
      setLoginError("Network error. Please try again.");
    }
    setLoggingIn(false);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAdmin(null);
    setEmail("");
    setPassword("");
  };

  // Loading state
  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-50">
        <Loader2 size={32} className="animate-spin text-brand-500" />
      </div>
    );
  }

  // Admin Login Screen
  if (!admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="rounded-2xl border border-brand-200 bg-white p-8 shadow-xl">
            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-900">
                <Lock size={28} className="text-white" />
              </div>
              <h1 className="mt-4 font-display text-2xl text-brand-950">Admin Login</h1>
              <p className="mt-1 text-sm text-brand-600">Bhuvika Studio Admin Panel</p>
            </div>

            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              <div>
                <label className="text-sm font-semibold text-brand-800">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-brand-200 bg-brand-50/50 px-4 py-3 text-brand-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  placeholder="admin@bhuvikastudio.com"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-brand-800">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-brand-200 bg-brand-50/50 px-4 py-3 text-brand-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  placeholder="Enter password"
                />
              </div>

              {loginError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{loginError}</p>
              )}

              <button
                type="submit"
                disabled={loggingIn}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-900 py-3.5 font-semibold text-white transition hover:bg-brand-950 disabled:opacity-50"
              >
                {loggingIn ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
                {loggingIn ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-brand-500 hover:text-brand-700">
                &larr; Back to Store
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Admin Panel (authenticated)
  return (
    <div className="flex h-screen bg-brand-50">
      {/* Desktop Sidebar */}
      <aside className="admin-sidebar hidden w-64 flex-col md:flex">
        <div className="flex items-center gap-3 border-b border-brand-800 px-5 py-4">
          <Image src="/logo-icon.svg" alt="Bhuvika" width={36} height={36} className="h-9 w-9" />
          <div className="flex items-center gap-2">
            <span className="font-display text-lg text-white">Bhuvika</span>
            <span className="rounded bg-brand-500 px-2 py-0.5 text-xs font-bold text-white">Admin</span>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {sidebarLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${active ? "bg-brand-800 text-white" : "text-brand-300 hover:bg-brand-800/50 hover:text-white"}`}>
                <Icon size={18} /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-brand-800 p-3 space-y-1">
          <Link href="/" className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-brand-300 transition hover:bg-brand-800/50 hover:text-white">
            <ChevronLeft size={18} /> Back to Store
          </Link>
          <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-900/20 hover:text-red-300">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/50" />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25 }} className="admin-sidebar fixed left-0 top-0 z-50 flex h-full w-64 flex-col">
              <div className="flex items-center justify-between border-b border-brand-800 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Image src="/logo-icon.svg" alt="Bhuvika" width={32} height={32} className="h-8 w-8" />
                  <span className="font-display text-lg text-white">Bhuvika</span>
                  <span className="rounded bg-brand-500 px-2 py-0.5 text-xs font-bold text-white">Admin</span>
                </div>
                <button onClick={() => setSidebarOpen(false)}><X size={20} className="text-brand-300" /></button>
              </div>
              <nav className="flex-1 space-y-1 p-3">
                {sidebarLinks.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href;
                  return (
                    <Link key={href} href={href} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${active ? "bg-brand-800 text-white" : "text-brand-300 hover:bg-brand-800/50 hover:text-white"}`}>
                      <Icon size={18} /> {label}
                    </Link>
                  );
                })}
              </nav>
              <div className="border-t border-brand-800 p-3 space-y-1">
                <Link href="/" className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-brand-300 hover:text-white">
                  <ChevronLeft size={18} /> Back to Store
                </Link>
                <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300">
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center gap-4 border-b border-brand-100 bg-white px-5 py-3.5">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden"><Menu size={22} className="text-brand-900" /></button>
          <h1 className="text-sm font-bold uppercase tracking-wider text-brand-500">Admin Panel</h1>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-brand-600">{admin.email}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-900 text-xs font-bold text-white">
              {admin.name?.charAt(0) || "A"}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
