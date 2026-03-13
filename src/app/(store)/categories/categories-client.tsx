"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const categoryImages: Record<string, string> = {
  "Western Wear": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
  "Kids Wear": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
  "Lehengas": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
  "Fusion Wear": "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
  "Sarees": "https://images.unsplash.com/photo-1616161560417-66d4db5892ec?auto=format&fit=crop&w=800&q=80",
  "Co-ords": "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
};

const categoryDescriptions: Record<string, string> = {
  "Western Wear": "Trendy dresses, tops, and midi styles for the modern woman.",
  "Kids Wear": "Adorable party frocks and festive outfits for little stars.",
  "Lehengas": "Stunning bridal and festive lehengas that steal the show.",
  "Fusion Wear": "Where tradition meets trend. Anarkalis, Indo-Western & more.",
  "Sarees": "Handloom elegance and designer drapes for every occasion.",
  "Co-ords": "Matching sets that make styling effortless and chic.",
};

export default function CategoriesClient({ categoryCounts }: { categoryCounts: { name: string; count: number }[] }) {
  const allCategories = ["Western Wear", "Kids Wear", "Lehengas", "Fusion Wear", "Sarees", "Co-ords"];
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12">
      <AnimatedSection>
        <p className="text-sm font-bold uppercase tracking-widest text-brand-500">Collections</p>
        <h1 className="mt-1 font-display text-5xl text-brand-950">Categories</h1>
        <p className="mt-2 text-brand-700">Explore each collection curated by style and occasion.</p>
      </AnimatedSection>

      <div className="mt-10 space-y-6">
        {allCategories.map((cat, i) => {
          const count = categoryCounts.find((c) => c.name === cat)?.count ?? 0;
          return (
            <motion.div
              key={cat}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <Link
                href="/shop"
                className="group flex flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 md:flex-row"
              >
                <div className="relative h-48 overflow-hidden md:h-auto md:w-80">
                  <img src={categoryImages[cat]} alt={cat} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-950/40 to-transparent" />
                </div>
                <div className="flex flex-1 items-center justify-between p-6">
                  <div>
                    <h2 className="font-display text-3xl text-brand-950 transition group-hover:text-brand-700">{cat}</h2>
                    <p className="mt-2 text-brand-700">{categoryDescriptions[cat]}</p>
                    <p className="mt-2 text-sm font-semibold text-brand-500">{count} product{count !== 1 ? "s" : ""}</p>
                  </div>
                  <ArrowRight size={24} className="shrink-0 text-brand-300 transition-all group-hover:translate-x-2 group-hover:text-brand-500" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
