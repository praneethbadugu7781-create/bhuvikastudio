"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { useWishlist } from "@/store/wishlist";
import { useCart } from "@/store/cart";
import AnimatedSection from "@/components/AnimatedSection";
import { flyToCart } from "@/lib/animation";

export default function WishlistPage() {
  const { items, remove, clear } = useWishlist();
  const addToCart = useCart((s) => s.add);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-5 py-24 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-50 text-brand-200">
          <Heart size={48} />
        </div>
        <h1 className="font-display text-4xl text-brand-950">Your Wishlist is Empty</h1>
        <p className="mt-3 text-lg text-brand-700">Save your favorite items here to shop them later.</p>
        <Link href="/shop" className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-900 px-8 py-4 font-semibold text-white transition hover:bg-brand-950 hover:shadow-lg">
          Start Shopping <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-4xl text-brand-950 md:text-5xl">My Wishlist</h1>
          <p className="mt-2 text-brand-700">You have {items.length} items saved in your wishlist.</p>
        </div>
        <button 
          onClick={clear}
          className="text-sm font-semibold text-red-600 transition hover:text-red-800 hover:underline"
        >
          Clear Wishlist
        </button>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, idx) => (
          <motion.article
            key={item.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="group relative overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm transition-all hover:shadow-md"
          >
            <div className="relative h-64 overflow-hidden bg-brand-50">
              <Link href={`/product/${item.slug}`}>
                <img src={item.image} alt={item.name} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110" />
              </Link>
              <button 
                onClick={() => remove(item.slug)}
                className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-red-500 shadow-sm transition hover:bg-red-500 hover:text-white"
                title="Remove from wishlist"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-500">{item.category}</p>
              <Link href={`/product/${item.slug}`}>
                <h3 className="mt-1 font-bold text-brand-950 transition hover:text-brand-700">{item.name}</h3>
              </Link>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-bold text-brand-900">&#8377;{item.price.toLocaleString("en-IN")}</span>
                <button 
                  onClick={(e) => {
                    addToCart(item, item.sizes[0]);
                    const card = e.currentTarget.closest("article");
                    const img = card?.querySelector("img");
                    if (img) {
                      flyToCart(img as HTMLElement, item.image);
                    }
                  }}
                  className="flex items-center gap-1.5 rounded-full bg-brand-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-950"
                >
                  <ShoppingBag size={14} /> Add to Cart
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
