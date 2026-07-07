"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Heart } from "lucide-react";
import type { CatalogItem } from "@/lib/catalog";
import Image from "next/image";
import { useWishlist } from "@/store/wishlist";
import { useCart } from "@/store/cart";
import { flyToCart } from "@/lib/animation";

export default function ProductCard({ item, index = 0 }: { item: CatalogItem; index?: number }) {
  const { toggle, isInWishlist } = useWishlist();
  const addToCart = useCart((s) => s.add);
  const active = isInWishlist(item.slug);
  const imageRef = useRef<HTMLImageElement>(null);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative h-48 md:h-72 overflow-hidden bg-brand-50">
        <Link href={`/product/${item.slug}`} className="block h-full w-full relative">
          <Image
            ref={imageRef}
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={index < 4}
            className="object-contain transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>
        
        {item.oldPrice && (
          <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] md:text-xs font-bold text-white">
            {Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)}% OFF
          </span>
        )}
        {item.stock === "Out of Stock" && (
          <span className="absolute right-2 top-2 rounded-full bg-gray-900/80 px-2 py-0.5 text-[10px] md:text-xs font-bold text-white">
            Sold Out
          </span>
        )}
        <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-0 transition-all duration-300 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 md:bottom-3 md:right-3 md:gap-2">
          <button 
            onClick={() => toggle(item)}
            className={`rounded-full p-2 shadow-lg backdrop-blur transition md:p-2.5 ${active ? "bg-red-500 text-white" : "bg-white/90 hover:bg-brand-500 hover:text-white"}`}
          >
            <Heart size={16} className="md:w-[18px] md:h-[18px]" fill={active ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={() => {
              addToCart(item, item.sizes[0]);
              if (imageRef.current) {
                flyToCart(imageRef.current, item.image);
              }
            }}
            className="rounded-full bg-white/90 p-2 shadow-lg backdrop-blur transition hover:bg-brand-500 hover:text-white md:p-2.5"
          >
            <ShoppingBag size={16} className="md:w-[18px] md:h-[18px]" />
          </button>
        </div>
      </div>
      <div className="p-3 md:p-4">
        <p className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-brand-500">{item.category}</p>
        <Link href={`/product/${item.slug}`}>
          <h3 className="mt-1 text-sm md:text-lg font-bold text-brand-950 transition-colors hover:text-brand-700 line-clamp-1">{item.name}</h3>
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-base md:text-xl font-bold text-brand-900">&#8377;{item.price.toLocaleString("en-IN")}</span>
          {item.oldPrice && (
            <span className="text-[10px] md:text-sm text-brand-400 line-through">&#8377;{item.oldPrice.toLocaleString("en-IN")}</span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
