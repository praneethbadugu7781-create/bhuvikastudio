"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Truck, ShieldCheck, Star } from "lucide-react";
import type { CatalogItem } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";

type Banner = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  position: string;
};

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
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch("/api/banners")
      .then(res => res.ok ? res.json() : [])
      .then(data => setBanners(data))
      .catch(() => {});
  }, []);

  const heroBanners = banners.filter(b => b.position === "HERO" && b.imageUrl);
  const promoBanners = banners.filter(b => b.position === "PROMO");

  // Auto-slide for hero banners
  useEffect(() => {
    if (heroBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroBanners.length);
    }, 4000); // Change slide every 4 seconds
    return () => clearInterval(interval);
  }, [heroBanners.length]);

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
        <div className="relative mx-auto flex w-full max-w-6xl flex-col-reverse md:flex-row md:items-center gap-6 md:gap-8 px-4 md:px-5 py-10 md:py-24">
          {/* Left - Text Content */}
          <div className="flex-1 text-center md:text-left">
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] md:tracking-[0.25em] text-brand-700"
            >
              Bhuvika Studio &bull; Vijayawada
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-3 md:mt-4 leading-tight"
            >
              <span className="font-script text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-brand-600">Style Stories</span>
              <br />
              <span className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-brand-950">for Every Celebration</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-3 md:mt-4 mx-auto md:mx-0 max-w-lg text-sm md:text-lg text-brand-800"
            >
              Discover Western Wear, Lehengas, Sarees, Kids Wear, and festive edits curated for women and families.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-5 md:mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start"
            >
              <Link
                href="/shop"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-900 px-6 md:px-8 py-3 md:py-3.5 text-sm md:text-base font-semibold text-white transition-all hover:bg-brand-950 hover:shadow-lg hover:shadow-brand-900/25"
              >
                Start Shopping
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center justify-center rounded-full border-2 border-brand-900 px-6 md:px-8 py-3 md:py-3.5 text-sm md:text-base font-semibold text-brand-900 transition-all hover:bg-brand-900 hover:text-white"
              >
                Browse Categories
              </Link>
            </motion.div>
          </div>

          {/* Right - Banner Slider */}
          {heroBanners.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex-1 flex flex-col items-center"
            >
              <Link href="/shop" className="group relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px]">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl aspect-square">
                  {heroBanners.map((banner, index) => (
                    <motion.div
                      key={banner.id}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: index === currentSlide ? 1 : 0,
                        scale: index === currentSlide ? 1 : 1.1
                      }}
                      transition={{ duration: 0.7 }}
                      className="absolute inset-0"
                    >
                      <img
                        src={banner.imageUrl}
                        alt={banner.title || "Featured"}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Overlay with title */}
                      {banner.title && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end">
                          <div className="p-4 md:p-5">
                            <h3 className="text-lg md:text-2xl font-bold text-white">{banner.title}</h3>
                            {banner.subtitle && <p className="text-xs md:text-sm text-white/80 mt-1">{banner.subtitle}</p>}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                {/* Decorative border - hidden on mobile */}
                <div className="hidden md:block absolute -inset-4 -z-10 rounded-2xl border-2 border-brand-300/30" />
              </Link>

              {/* Slide indicators */}
              {heroBanners.length > 1 && (
                <div className="flex gap-2 mt-3 md:mt-4">
                  {heroBanners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentSlide ? "w-6 bg-brand-600" : "w-2 bg-brand-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
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

      {/* Promo Banners - Simple Image Grid */}
      {promoBanners.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-4 md:px-5 py-6 md:py-8">
          <div className={`grid gap-3 md:gap-4 ${promoBanners.length === 1 ? "" : "grid-cols-1 sm:grid-cols-2"} ${promoBanners.length >= 3 ? "lg:grid-cols-3" : ""}`}>
            {promoBanners.map((banner, i) => (
              <motion.div
                key={banner.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link href="/shop" className="group block overflow-hidden rounded-xl md:rounded-2xl">
                  {banner.imageUrl ? (
                    <div className="relative aspect-[2/1]">
                      <img src={banner.imageUrl} alt={banner.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      {(banner.title || banner.subtitle) && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                          <div className="p-3 md:p-4">
                            {banner.title && <h3 className="text-base md:text-xl font-bold text-white">{banner.title}</h3>}
                            {banner.subtitle && <p className="mt-0.5 md:mt-1 text-xs md:text-sm text-white/80">{banner.subtitle}</p>}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-[2/1] bg-brand-100 p-4 md:p-6 flex flex-col justify-center">
                      <h3 className="text-base md:text-xl font-bold text-brand-900">{banner.title}</h3>
                      {banner.subtitle && <p className="mt-1 text-xs md:text-sm text-brand-600">{banner.subtitle}</p>}
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

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
                <Link href="/categories" className="group relative block h-auto overflow-visible rounded-xl md:rounded-2xl bg-brand-50/50">
                  <img
                    src={categoryImages[cat]}
                    alt={cat}
                    className="h-auto w-full object-contain transition-transform duration-700 group-hover:scale-110 p-4 md:p-6"
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
    </div>
  );
}
