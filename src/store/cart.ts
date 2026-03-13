"use client";
import { create } from "zustand";
import type { CatalogItem } from "@/lib/catalog";

export type CartEntry = CatalogItem & { qty: number; selectedSize: string };

type CartState = {
  items: CartEntry[];
  add: (item: CatalogItem, size: string) => void;
  remove: (slug: string) => void;
  updateQty: (slug: string, qty: number) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
};

export const useCart = create<CartState>((set, get) => ({
  items: [],
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
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
  count: () => get().items.reduce((sum, i) => sum + i.qty, 0),
}));
