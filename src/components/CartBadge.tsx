"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";

export default function CartBadge() {
  const count = useCart((s) => s.count());
  return (
    <Link href="/cart" className="relative">
      <ShoppingBag size={22} className="text-brand-800 transition hover:text-brand-500" />
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[11px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
