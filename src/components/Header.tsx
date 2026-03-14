"use client";
import Link from "next/link";
import Image from "next/image";
import { User, LogOut } from "lucide-react";
import CartBadge from "./CartBadge";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-brand-100/60 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-2">
        <Link href="/" className="transition hover:opacity-80">
          <Image src="/logo.svg" alt="Bhuvika Studio" width={200} height={50} className="h-[42px] w-auto md:h-[52px]" priority />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-brand-800 md:flex">
          <Link href="/shop" className="transition hover:text-brand-500">Shop</Link>
          <Link href="/categories" className="transition hover:text-brand-500">Categories</Link>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-brand-600">
                <User size={15} /> {user.name || user.email?.split("@")[0]}
              </span>
              <button onClick={logout} className="flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100">
                <LogOut size={13} /> Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="rounded-full bg-brand-900 px-5 py-2 text-white transition hover:bg-brand-950">Login</Link>
          )}
          <CartBadge />
        </nav>
        {/* Mobile: just show cart badge, bottom tab handles nav */}
        <div className="flex items-center gap-3 md:hidden">
          <CartBadge />
        </div>
      </div>
    </header>
  );
}
