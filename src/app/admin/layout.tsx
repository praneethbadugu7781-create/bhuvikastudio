"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3,
  Menu, X, ChevronLeft,
} from "lucide-react";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        <div className="border-t border-brand-800 p-3">
          <Link href="/" className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-brand-300 transition hover:bg-brand-800/50 hover:text-white">
            <ChevronLeft size={18} /> Back to Store
          </Link>
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
              <div className="border-t border-brand-800 p-3">
                <Link href="/" className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-brand-300 hover:text-white">
                  <ChevronLeft size={18} /> Back to Store
                </Link>
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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-900 text-xs font-bold text-white">BS</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
