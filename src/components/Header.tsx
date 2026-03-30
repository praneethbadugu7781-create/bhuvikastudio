"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { User, LogOut, Home, ArrowLeft } from "lucide-react";
import CartBadge from "./CartBadge";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-30 border-b border-brand-100/60 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-2">
        {/* Left: Back button (mobile, not on home) + Logo */}
        <div className="flex items-center gap-2">
          {!isHome && (
            <button
              onClick={() => router.back()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition hover:bg-brand-100 md:hidden"
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <Link href="/" className="transition hover:opacity-80">
            <span className="font-script text-3xl text-brand-900 md:text-4xl">Bhuvika Studio</span>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm font-semibold text-brand-800 md:flex">
          <Link href="/" className="flex items-center gap-1.5 transition hover:text-brand-500">
            <Home size={16} /> Home
          </Link>
          <Link href="/shop" className="transition hover:text-brand-500">Shop</Link>
          <Link href="/categories" className="transition hover:text-brand-500">Categories</Link>
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/account" className="flex items-center gap-1.5 text-brand-600 transition hover:text-brand-900">
                <User size={15} /> {user.name || user.email?.split("@")[0]}
              </Link>
              <button onClick={logout} className="flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100">
                <LogOut size={13} /> Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="rounded-full bg-brand-900 px-5 py-2 text-white transition hover:bg-brand-950">Login</Link>
          )}
          <CartBadge />
        </nav>

        {/* Mobile: Home + Account + Cart */}
        <div className="flex items-center gap-2 md:hidden">
          {!isHome && (
            <Link href="/" className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition hover:bg-brand-100" aria-label="Home">
              <Home size={18} />
            </Link>
          )}
          {user ? (
            <Link href="/account" className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition hover:bg-brand-100" aria-label="Account">
              <User size={18} />
            </Link>
          ) : (
            <Link href="/login" className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-900 text-white transition hover:bg-brand-950" aria-label="Login">
              <User size={18} />
            </Link>
          )}
          <CartBadge />
        </div>
      </div>
    </header>
  );
}
