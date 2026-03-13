"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import type { CatalogItem } from "@/lib/catalog";
import { categories } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";

export default function ShopPage({ products }: { products: CatalogItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"default" | "low" | "high">("default");
  const [showFilters, setShowFilters] = useState(false);

  let filtered = activeCategory ? products.filter((i) => i.category === activeCategory) : products;
  if (sortBy === "low") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "high") filtered = [...filtered].sort((a, b) => b.price - a.price);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12">
      <AnimatedSection>
        <p className="text-sm font-bold uppercase tracking-widest text-brand-500">Discover</p>
        <h1 className="mt-1 font-display text-5xl text-brand-950">All Products</h1>
        <p className="mt-2 text-brand-700">Browse latest arrivals and festive edits.</p>
      </AnimatedSection>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 rounded-full border border-brand-300 bg-white px-4 py-2 text-sm font-semibold text-brand-800 transition hover:bg-brand-50 md:hidden"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
        <div className="hidden flex-wrap gap-2 md:flex">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${!activeCategory ? "bg-brand-900 text-white shadow-md" : "border border-brand-300 bg-white text-brand-800 hover:bg-brand-50"}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeCategory === cat ? "bg-brand-900 text-white shadow-md" : "border border-brand-300 bg-white text-brand-800 hover:bg-brand-50"}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="ml-auto rounded-full border border-brand-300 bg-white px-4 py-2 text-sm font-semibold text-brand-800 outline-none"
        >
          <option value="default">Sort: Default</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 overflow-hidden rounded-2xl border border-brand-100 bg-white p-4 md:hidden"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-brand-900">Categories</h3>
              <button onClick={() => setShowFilters(false)}><X size={18} className="text-brand-700" /></button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => { setActiveCategory(null); setShowFilters(false); }} className={`rounded-full px-3 py-1.5 text-sm font-semibold ${!activeCategory ? "bg-brand-900 text-white" : "border border-brand-300 text-brand-800"}`}>All</button>
              {categories.map((cat) => (
                <button key={cat} onClick={() => { setActiveCategory(cat); setShowFilters(false); }} className={`rounded-full px-3 py-1.5 text-sm font-semibold ${activeCategory === cat ? "bg-brand-900 text-white" : "border border-brand-300 text-brand-800"}`}>{cat}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {activeCategory && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm text-brand-700">Filtered by:</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-900">
            {activeCategory}
            <button onClick={() => setActiveCategory(null)}><X size={14} /></button>
          </span>
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, i) => (
          <ProductCard key={item.slug} item={item} index={i} />
        ))}
      </div>
      {filtered.length === 0 && <p className="mt-12 text-center text-brand-700">No products found in this category.</p>}
    </div>
  );
}
