"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Heart, ShoppingBag, User, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/store/cart";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/store/wishlist";

export default function BottomTabBar() {
  const pathname = usePathname();
  const cartCount = useCart((s) => s.count());
  const wishlistCount = useWishlist((s) => s.items.length);
  const { user } = useAuth();

  const tabs = [
    { href: "/", label: "Home", icon: Home },
    { href: "/categories", label: "Categories", icon: Grid },
    { href: "/wishlist", label: "Wishlist", icon: Heart, count: wishlistCount },
    { href: user ? "/account" : "/login", label: "Account", icon: User },
    { href: "/cart", label: "Cart", icon: ShoppingBag, count: cartCount },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-brand-100 bg-white/95 pb-safe backdrop-blur-lg md:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {tabs.map(({ href, label, icon: Icon, count }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

          return (
            <Link
              key={label}
              href={href}
              className={`relative flex flex-col items-center gap-1 rounded-xl px-2 py-1 text-[10px] font-bold uppercase tracking-tighter transition ${
                isActive ? "text-brand-900" : "text-brand-400"
              }`}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} fill={isActive && label !== "Categories" ? "currentColor" : "none"} />
                {count !== undefined && count > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-900 text-[9px] font-bold text-white ring-2 ring-white">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </div>
              <span className="whitespace-nowrap">{label}</span>
              {isActive && (
                <motion.span 
                  layoutId="activeTab"
                  className="absolute -bottom-1 h-1 w-1 rounded-full bg-brand-900" 
                />
              )}
            </Link>
          );
        })}
      </div>
      {/* Safe area for phones with bottom bars */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
