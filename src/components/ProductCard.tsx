"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Heart } from "lucide-react";
import type { CatalogItem } from "@/lib/catalog";

export default function ProductCard({ item, index = 0 }: { item: CatalogItem; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <Link href={`/product/${item.slug}`} className="block">
        <div className="relative h-72 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {item.oldPrice && (
            <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
              {Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)}% OFF
            </span>
          )}
          {item.stock === "Out of Stock" && (
            <span className="absolute right-3 top-3 rounded-full bg-gray-900/80 px-3 py-1 text-xs font-bold text-white">
              Sold Out
            </span>
          )}
          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 transition-all duration-300 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
            <button className="rounded-full bg-white/90 p-2.5 shadow-lg backdrop-blur transition hover:bg-brand-500 hover:text-white">
              <Heart size={18} />
            </button>
            <button className="rounded-full bg-white/90 p-2.5 shadow-lg backdrop-blur transition hover:bg-brand-500 hover:text-white">
              <ShoppingBag size={18} />
            </button>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-500">{item.category}</p>
        <Link href={`/product/${item.slug}`}>
          <h3 className="mt-1 text-lg font-bold text-brand-950 transition-colors hover:text-brand-700">{item.name}</h3>
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xl font-bold text-brand-900">&#8377;{item.price.toLocaleString("en-IN")}</span>
          {item.oldPrice && (
            <span className="text-sm text-brand-400 line-through">&#8377;{item.oldPrice.toLocaleString("en-IN")}</span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
