"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const categoryImages: Record<string, string> = {
  "Kurta sets": "https://res.cloudinary.com/dfdin5phc/image/upload/v1775043986/bhuvika-categories/kurta-sets.jpg",
  "Sarees": "https://res.cloudinary.com/dfdin5phc/image/upload/v1775043988/bhuvika-categories/sarees.jpg",
  "Lehengas": "https://res.cloudinary.com/dfdin5phc/image/upload/v1775043989/bhuvika-categories/lehengas.jpg",
  "Indo western": "https://res.cloudinary.com/dfdin5phc/image/upload/v1775043990/bhuvika-categories/indo-western.jpg",
  "Kids wear": "https://res.cloudinary.com/dfdin5phc/image/upload/v1775044014/bhuvika-categories/kids-wear.jpg",
  "Western wear": "https://res.cloudinary.com/dfdin5phc/image/upload/v1775043991/bhuvika-categories/western-wear.jpg",
  "Co-ords sets": "https://res.cloudinary.com/dfdin5phc/image/upload/v1775043992/bhuvika-categories/co-ords-sets.jpg",
  "Anarkali": "https://res.cloudinary.com/dfdin5phc/image/upload/v1775043993/bhuvika-categories/anarkali.jpg",
  "Gowns": "https://res.cloudinary.com/dfdin5phc/image/upload/v1775043994/bhuvika-categories/gowns.jpg",
};

const categoryDescriptions: Record<string, string> = {
  "Kurta sets": "Comfortable and stylish kurta sets perfect for everyday wear and casual gatherings.",
  "Sarees": "Handloom elegance and designer drapes for every occasion.",
  "Lehengas": "Stunning bridal and festive lehengas that steal the show.",
  "Indo western": "Where tradition meets trend. Anarkalis, Indo-Western & more.",
  "Kids wear": "Adorable party frocks and festive outfits for little stars.",
  "Western wear": "Trendy dresses, tops, and midi styles for the modern woman.",
  "Co-ords sets": "Matching sets that make styling effortless and chic.",
  "Anarkali": "Elegant Anarkali suits combining tradition with contemporary style.",
  "Gowns": "Elegant gowns for parties, weddings, and special occasions.",
};

export default function CategoriesClient({ categoryCounts }: { categoryCounts: { name: string; count: number }[] }) {
  const allCategories = ["Kurta sets", "Sarees", "Lehengas", "Indo western", "Kids wear", "Western wear", "Co-ords sets", "Anarkali", "Gowns"];
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
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
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
