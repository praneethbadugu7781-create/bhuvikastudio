"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Truck, ShieldCheck, Star, Play, Video, X } from "lucide-react";
import type { CatalogItem } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";

// Removed Banner type

const categoryImages: Record<string, string> = {
  "Kurta sets": "/categories/kurta-sets.png",
  "Sarees": "/categories/sarees.png",
  "Lehengas": "/categories/lehengas.png",
  "Indo western": "/categories/indo-western.png",
  "Kids wear": "/categories/kids-wear.png",
  "Western wear": "/categories/western-wear.png",
  "Co-ords sets": "/categories/co-ords-sets.png",
  "Anarkali": "/categories/anarkali.png",
  "Gowns": "/categories/gowns.png",
};
const categories = ["Kurta sets", "Sarees", "Lehengas", "Indo western", "Kids wear", "Western wear", "Co-ords sets", "Anarkali", "Gowns"];

const testimonials = [
  { name: "Priya S.", rating: 5, text: "Absolutely loved the lehenga! The quality is amazing and it arrived quickly. Will definitely order again." },
  { name: "Ananya R.", rating: 5, text: "Best boutique in Vijayawada! The western wear collection is so trendy and affordable." },
  { name: "Meera K.", rating: 5, text: "Ordered a co-ord set for my daughter's birthday. She looked stunning! Thank you Bhuvika Studio." },
];

const features = [
  { icon: Sparkles, title: "Curated Collections", desc: "Hand-picked styles for every occasion and celebration." },
  { icon: Truck, title: "Fast Delivery", desc: "Same-day local delivery in Vijayawada, pan-India shipping." },
  { icon: ShieldCheck, title: "Quality Assured", desc: "Premium fabrics. Every piece inspected before dispatch." },
];

export default function HomeClient({ products, featured }: { products: CatalogItem[]; featured: CatalogItem[] }) {
  const newArrivals = products.slice(0, 3);
  const [reels, setReels] = useState<any[]>([]);
  const [activeReel, setActiveReel] = useState<string | null>(null);
  const [activeReelLink, setActiveReelLink] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/reels")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReels(data);
        }
      })
      .catch((err) => console.error("Failed to load reels", err));
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero with animated background and banner slider */}
      <section className="hero-bg relative min-h-[auto] md:min-h-[600px]">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -right-16 -top-16 h-48 w-48 md:h-96 md:w-96 md:-right-32 md:-top-32 rounded-full bg-brand-300/20"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-10 -left-10 h-36 w-36 md:h-72 md:w-72 md:-bottom-20 md:-left-20 rounded-full bg-brand-500/10"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-1/4 top-1/3 h-24 w-24 md:h-48 md:w-48 rounded-full bg-brand-400/10"
          />
        </div>
        <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-8 px-4 md:px-5 py-16 md:py-32 text-center">
          {/* Text Content Only */}
          <div className="w-full">
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] md:tracking-[0.25em] text-brand-700"
            >
              Bhuvika Studio &bull; Vijayawada
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-4 leading-tight"
            >
              <span className="font-script text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-brand-600">Style Stories</span>
              <br />
              <span className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-brand-950">for Every Celebration</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 mx-auto max-w-2xl text-base md:text-xl text-brand-800"
            >
              Discover Western Wear, Lehengas, Sarees, Kids Wear, and festive edits curated for women and families.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/shop"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-900 px-8 md:px-10 py-3.5 md:py-4 text-base md:text-lg font-semibold text-white transition-all hover:bg-brand-950 hover:shadow-xl hover:shadow-brand-900/25"
              >
                Start Shopping
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full border-2 border-brand-900 px-8 md:px-10 py-3.5 md:py-4 text-base md:text-lg font-semibold text-brand-900 transition-all hover:bg-brand-900 hover:text-white"
              >
                Browse Collections
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="border-b border-brand-100 bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-0 divide-y md:grid-cols-3 md:divide-x md:divide-y-0 divide-brand-100 px-4 md:px-5">
          {features.map((f, i) => (
            <AnimatedSection key={f.title} delay={i * 0.1}>
              <div className="flex items-center gap-3 md:gap-4 px-2 md:px-4 py-4 md:py-6">
                <div className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-500">
                  <f.icon size={20} className="md:hidden" />
                  <f.icon size={24} className="hidden md:block" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-brand-950">{f.title}</h3>
                  <p className="text-xs md:text-sm text-brand-700">{f.desc}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto w-full max-w-6xl px-4 md:px-5 py-10 md:py-16">
        <AnimatedSection>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-brand-500">Handpicked for you</p>
              <h2 className="mt-1 font-script text-3xl md:text-5xl text-brand-950">Featured Products</h2>
            </div>
            <Link href="/shop" className="hidden items-center gap-1 font-semibold text-brand-700 transition hover:text-brand-500 sm:flex text-sm md:text-base">
              View All <ArrowRight size={16} />
            </Link>
          </div>
        </AnimatedSection>
        <div className="mt-6 md:mt-8 grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-3">
          {featured.map((item, i) => (
            <ProductCard key={item.slug} item={item} index={i} />
          ))}
        </div>
        <Link href="/shop" className="mt-6 flex items-center justify-center gap-1 font-semibold text-brand-700 transition hover:text-brand-500 sm:hidden text-sm">
          View All Products <ArrowRight size={14} />
        </Link>
      </section>

      {/* Shop by Category */}
      <section className="bg-brand-50/50 py-10 md:py-16">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-5">
          <AnimatedSection>
            <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-brand-500">Browse Collections</p>
            <h2 className="mt-1 font-script text-3xl md:text-5xl text-brand-950">Shop by Category</h2>
          </AnimatedSection>
          <div className="mt-6 md:mt-8 grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-3">
            {categories.map((cat, i) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link href={`/shop?category=${encodeURIComponent(cat)}`} className="group relative block aspect-[3/4] overflow-hidden rounded-xl md:rounded-2xl bg-brand-50/50">
                  <img
                    src={categoryImages[cat]}
                    alt={cat}
                    className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-110 p-4 md:p-6"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-3 md:p-4">
                    <h3 className="font-display text-sm sm:text-base md:text-xl lg:text-2xl text-white drop-shadow-lg">{cat}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reels Section */}
      {reels.length > 0 && (
        <section className="bg-white py-10 md:py-16">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-5">
            <AnimatedSection>
              <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-brand-500">Trending Videos</p>
              <h2 className="mt-1 font-script text-3xl md:text-5xl text-brand-950">Watch & Shop</h2>
            </AnimatedSection>
            
            <div className="mt-6 md:mt-8 flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-brand-100 snap-x">
              {reels.map((r, i) => (
                <motion.div
                  key={r._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative aspect-[9/16] w-[180px] md:w-[240px] shrink-0 overflow-hidden rounded-2xl bg-black border border-brand-100/50 shadow-md group cursor-pointer snap-start"
                  onClick={() => {
                    setActiveReel(r.videoUrl);
                    setActiveReelLink(r.productLink || null);
                  }}
                >
                  <video
                    src={r.videoUrl}
                    poster={r.coverImageUrl || undefined}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                  />

                  {/* Play Indicator Icon */}
                  <div className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white transition-transform group-hover:scale-110">
                    <Play size={12} className="ml-0.5 fill-white text-white" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white">
                    <p className="font-bold text-xs md:text-sm line-clamp-2">{r.title || "Showcase"}</p>
                    {r.productLink && (
                      <span className="inline-flex items-center gap-1 mt-1.5 text-[9px] bg-brand-900/80 backdrop-blur-sm px-2 py-0.5 rounded-full font-semibold">
                        Shop Product
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section className="mx-auto w-full max-w-6xl px-4 md:px-5 py-10 md:py-16">
        <AnimatedSection>
          <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-brand-500">Just Dropped</p>
          <h2 className="mt-1 font-script text-3xl md:text-5xl text-brand-950">New Arrivals</h2>
        </AnimatedSection>
        <div className="mt-6 md:mt-8 grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-3">
          {newArrivals.map((item, i) => (
            <ProductCard key={item.slug} item={item} index={i} />
          ))}
        </div>
      </section>

      {/* Our Story / About Section */}
      <section id="our-store" className="bg-white py-16 md:py-24">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-5">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <AnimatedSection>
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-brand-50 shadow-2xl md:aspect-[4/5]">
                <img 
                  src="/store-front.jpg" 
                  alt="Bhuvika Studio Store Front" 
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-brand-900/10 transition-opacity hover:opacity-0" />
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <div className="flex flex-col">
                <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-brand-500">The Bhuvika Story</p>
                <h2 className="mt-2 font-script text-4xl md:text-6xl text-brand-950">Elegance in Every Stitch</h2>
                <p className="mt-6 text-lg leading-relaxed text-brand-800">
                  Founded in the heart of <strong>Vijayawada</strong>, Bhuvika Studio was born from a simple yet powerful dream: to bring premium, handpicked fashion to every woman&apos;s wardrobe.
                </p>
                <p className="mt-4 text-brand-700 leading-relaxed">
                  What started as a small boutique has grown into a destination for those who seek the perfect blend of traditional heritage and modern style. Whether it&apos;s a bridal lehenga for your big day or a trendy co-ord set for a weekend brunch, we curate every piece with love and an eye for perfection.
                </p>
                
                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-2xl font-bold text-brand-900">500+</h4>
                    <p className="text-sm text-brand-600 uppercase tracking-wide">Unique Styles</p>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-brand-900">Vijayawada</h4>
                    <p className="text-sm text-brand-600 uppercase tracking-wide">Our Home</p>
                  </div>
                </div>

                <div className="mt-10">
                  <Link href="/about" className="inline-flex items-center gap-2 font-bold text-brand-900 transition hover:text-brand-600">
                    Learn more about us <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-brand-950 py-10 md:py-16">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-5">
          <AnimatedSection>
            <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-brand-500">Happy Customers</p>
            <h2 className="mt-1 font-script text-3xl md:text-5xl text-white">What They Say</h2>
          </AnimatedSection>
          <div className="mt-6 md:mt-8 grid gap-4 md:gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="rounded-xl md:rounded-2xl border border-brand-800 bg-brand-900/50 p-4 md:p-6"
              >
                <div className="flex gap-0.5 text-brand-500">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="md:hidden" fill="currentColor" />
                  ))}
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={`d-${j}`} size={16} className="hidden md:block" fill="currentColor" />
                  ))}
                </div>
                <p className="mt-2 md:mt-3 text-sm md:text-base text-brand-100">&ldquo;{t.text}&rdquo;</p>
                <p className="mt-3 md:mt-4 text-xs md:text-sm font-semibold text-brand-300">&mdash; {t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-brand-700 via-brand-500 to-brand-700 py-10 md:py-16">
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-10"
          style={{ background: "linear-gradient(90deg, transparent, white 50%, transparent)" }}
        />
        <div className="relative mx-auto w-full max-w-3xl px-4 md:px-5 text-center">
          <AnimatedSection>
            <h2 className="font-script text-3xl md:text-5xl text-white">Ready to Find Your Look?</h2>
            <p className="mt-2 md:mt-3 text-sm md:text-lg text-white/80">
              Explore 100+ styles curated for every celebration. Free delivery on orders above &#8377;2,000.
            </p>
            <Link
              href="/shop"
              className="mt-5 md:mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 md:px-8 py-3 md:py-3.5 text-sm md:text-base font-bold text-brand-900 transition hover:bg-brand-50 hover:shadow-lg"
            >
              Shop Now <ArrowRight size={16} />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Reel Player Modal */}
      <AnimatePresence>
        {activeReel && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setActiveReel(null);
                setActiveReelLink(null);
              }}
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            >
              <div
                className="relative aspect-[9/16] w-full max-w-[340px] bg-black rounded-3xl overflow-hidden border border-brand-900/20 shadow-2xl flex flex-col justify-end"
                onClick={(e) => e.stopPropagation()}
              >
                <video
                  src={activeReel}
                  controls
                  autoPlay
                  loop
                  className="absolute inset-0 h-full w-full object-cover"
                />
                
                <button
                  onClick={() => {
                    setActiveReel(null);
                    setActiveReelLink(null);
                  }}
                  className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition"
                >
                  <X size={18} />
                </button>

                {activeReelLink && (
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <Link
                      href={activeReelLink}
                      onClick={() => {
                        setActiveReel(null);
                        setActiveReelLink(null);
                      }}
                      className="flex items-center justify-center gap-2 w-full rounded-full bg-brand-900 py-3 font-semibold text-white hover:bg-brand-950 shadow-lg shadow-brand-900/35 transition"
                    >
                      Shop This Product <ArrowRight size={16} />
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
