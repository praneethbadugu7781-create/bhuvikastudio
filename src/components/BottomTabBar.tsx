"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Tag, Grid3X3, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/store/cart";
import { useAuth } from "@/context/AuthContext";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Shop", icon: Tag },
  { href: "/categories", label: "Categories", icon: Grid3X3 },
  { href: "/cart", label: "Cart", icon: ShoppingBag },
  { href: "/login", label: "Account", icon: User },
];

export default function BottomTabBar() {
  const pathname = usePathname();
  const count = useCart((s) => s.count());
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-brand-100 bg-white/95 backdrop-blur-lg md:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1.5">
        {tabs.map(({ href, label, icon: Icon }) => {
          const accountHref = user ? "/login" : "/login";
          const finalHref = label === "Account" ? accountHref : href;
          const isActive =
            label === "Home"
              ? pathname === "/"
              : label === "Account"
                ? pathname === "/login"
                : pathname.startsWith(href);

          return (
            <Link
              key={label}
              href={finalHref}
              className={`relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] font-semibold transition ${
                isActive ? "text-brand-600" : "text-brand-400"
              }`}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {label === "Cart" && count > 0 && (
                  <span className="absolute -right-2.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[9px] font-bold text-white">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </div>
              <span>{label === "Account" && user ? (user.name?.split(" ")[0] || "Account") : label}</span>
              {isActive && (
                <span className="absolute -top-1.5 h-0.5 w-6 rounded-full bg-brand-500" />
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
