"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Home, Grid3X3, Tag, CreditCard, Shield, User, LogOut, LogIn } from "lucide-react";
import { useCart } from "@/store/cart";
import { useAuth } from "@/context/AuthContext";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Shop", icon: Tag },
  { href: "/categories", label: "Categories", icon: Grid3X3 },
  { href: "/cart", label: "Cart", icon: ShoppingBag },
  { href: "/checkout", label: "Checkout", icon: CreditCard },
  { href: "/admin", label: "Admin", icon: Shield },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const count = useCart((s) => s.count());
  const { user, logout } = useAuth();

  return (
    <>
      <button onClick={() => setOpen(true)} className="relative md:hidden" aria-label="Open menu">
        <Menu size={26} className="text-brand-900" />
        {count > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
            {count}
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-brand-100 px-5 py-3">
                <Image src="/logo.svg" alt="Bhuvika Studio" width={140} height={35} className="h-9 w-auto" />
                <button onClick={() => setOpen(false)} aria-label="Close menu">
                  <X size={24} className="text-brand-800" />
                </button>
              </div>

              {/* User section */}
              <div className="border-b border-brand-100 px-5 py-3">
                {user ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                        {(user.name || "U")[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-brand-900">{user.name || "User"}</p>
                        <p className="text-xs text-brand-500">{user.email}</p>
                      </div>
                    </div>
                    <button onClick={() => { logout(); setOpen(false); }} className="rounded-lg p-2 text-brand-400 hover:bg-red-50 hover:text-red-500">
                      <LogOut size={18} />
                    </button>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl bg-brand-900 px-4 py-2.5 text-sm font-semibold text-white">
                    <LogIn size={16} /> Login / Register
                  </Link>
                )}
              </div>

              <nav className="flex flex-col gap-1 p-4">
                {links.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-brand-800 transition hover:bg-brand-50 hover:text-brand-900"
                  >
                    <Icon size={20} />
                    <span className="font-semibold">{label}</span>
                    {label === "Cart" && count > 0 && (
                      <span className="ml-auto rounded-full bg-brand-500 px-2 py-0.5 text-xs font-bold text-white">{count}</span>
                    )}
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
