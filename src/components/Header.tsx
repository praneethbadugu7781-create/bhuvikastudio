"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { User, LogOut, Home, ArrowLeft, Heart } from "lucide-react";
import CartBadge from "./CartBadge";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/store/wishlist";

export default function Header() {
  const { user, logout } = useAuth();
  const wishlistItems = useWishlist((s) => s.items);
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-30 border-b border-brand-100/60 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-2">
        {/* Left: Back button (mobile, not on home) + Logo */}
        <div className="flex items-center gap-3">
          {!isHome && (
            <button
              onClick={() => router.back()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition hover:bg-brand-100"
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <Link href="/" className="transition hover:opacity-80">
            <div className="flex items-center gap-2">
              {/* Brand Logo */}
              <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-brand-50 md:h-14 md:w-14">
                <img src="/logo-icon.svg" alt="Bhuvika Studio" className="h-full w-full object-contain p-1.5" />
              </div>
              {/* Text */}
              <div className="hidden flex-col sm:flex">
                <span className="text-[14px] font-bold uppercase tracking-[0.2em] text-brand-900 leading-tight">Bhuvika</span>
                <span className="text-[14px] font-bold uppercase tracking-[0.2em] text-brand-900 leading-tight">Studio</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm font-semibold text-brand-800 md:flex">
          <Link href="/" className="flex items-center gap-1.5 transition hover:text-brand-500">
            <Home size={16} /> Home
          </Link>
          <Link href="/shop" className="transition hover:text-brand-500">Shop</Link>
          <Link href="/categories" className="transition hover:text-brand-500">Categories</Link>
          <Link href="/wishlist" className="relative transition hover:text-brand-500" title="Wishlist">
            <Heart size={20} className={wishlistItems.length > 0 ? "fill-red-500 text-red-500" : ""} />
            {wishlistItems.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-900 text-[10px] font-bold text-white">
                {wishlistItems.length}
              </span>
            )}
          </Link>
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

        {/* Mobile: Logo + Cart Only */}
        <div className="flex items-center gap-4 md:hidden">
          <CartBadge />
        </div>
      </div>
    </header>
  );
}
