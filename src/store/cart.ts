"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CatalogItem } from "@/lib/catalog";

export type CartEntry = CatalogItem & { qty: number; selectedSize: string };

export type AppliedCoupon = {
  code: string;
  type: "PERCENT" | "FLAT";
  value: number;
  maxDiscount: number | null;
  discount: number;
} | null;

type CartState = {
  items: CartEntry[];
  appliedCoupon: AppliedCoupon;
  _hasHydrated: boolean;
  add: (item: CatalogItem, size: string) => void;
  remove: (slug: string) => void;
  updateQty: (slug: string, qty: number) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
  setAppliedCoupon: (coupon: AppliedCoupon) => void;
  setHasHydrated: (state: boolean) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      _hasHydrated: false,
      add: (item, size) =>
        set((s) => {
          const exists = s.items.find((i) => i.slug === item.slug && i.selectedSize === size);
          if (exists) {
            return { items: s.items.map((i) => (i.slug === item.slug && i.selectedSize === size ? { ...i, qty: i.qty + 1 } : i)) };
          }
          return { items: [...s.items, { ...item, qty: 1, selectedSize: size }] };
        }),
      remove: (slug) => set((s) => ({ items: s.items.filter((i) => i.slug !== slug) })),
      updateQty: (slug, qty) =>
        set((s) => ({
          items: qty <= 0 ? s.items.filter((i) => i.slug !== slug) : s.items.map((i) => (i.slug === slug ? { ...i, qty } : i)),
        })),
      clear: () => set({ items: [], appliedCoupon: null }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      count: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      setAppliedCoupon: (coupon) => set({ appliedCoupon: coupon }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "bhuvika-cart",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
