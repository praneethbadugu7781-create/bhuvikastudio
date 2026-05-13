import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CatalogItem } from "@/lib/catalog";

interface WishlistStore {
  items: CatalogItem[];
  add: (product: CatalogItem) => void;
  remove: (slug: string) => void;
  toggle: (product: CatalogItem) => void;
  isInWishlist: (slug: string) => boolean;
  clear: () => void;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product) => {
        const { items } = get();
        if (!items.find((i) => i.slug === product.slug)) {
          set({ items: [...items, product] });
        }
      },
      remove: (slug) => {
        set({ items: get().items.filter((i) => i.slug !== slug) });
      },
      toggle: (product) => {
        const { items } = get();
        if (items.find((i) => i.slug === product.slug)) {
          set({ items: items.filter((i) => i.slug !== product.slug) });
        } else {
          set({ items: [...items, product] });
        }
      },
      isInWishlist: (slug) => {
        return !!get().items.find((i) => i.slug === slug);
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: "bhuvika-wishlist",
    }
  )
);
