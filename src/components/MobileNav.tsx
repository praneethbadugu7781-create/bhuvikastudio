"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Heart, User, Search } from "lucide-react";
import { useWishlist } from "@/store/wishlist";

export default function MobileNav() {
  const pathname = usePathname();
  const wishlistCount = useWishlist((s) => s.items.length);

  const navItems = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Shop", icon: Search, href: "/shop" },
    { label: "Wishlist", icon: Heart, href: "/wishlist", count: wishlistCount },
    { label: "Account", icon: User, href: "/account" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-brand-100 bg-white/90 px-2 py-3 backdrop-blur-lg md:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`relative flex flex-col items-center gap-1 transition ${isActive ? "text-brand-900" : "text-brand-400 hover:text-brand-600"}`}
          >
            <item.icon size={22} fill={isActive && item.label !== "Shop" ? "currentColor" : "none"} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            {item.count ? item.count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-900 text-[10px] font-bold text-white">
                {item.count}
              </span>
            ) : null}
            {isActive && (
              <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-brand-900" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
