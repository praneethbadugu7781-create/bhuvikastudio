"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, ChevronLeft, Star, Truck, RotateCcw, Shield, Check } from "lucide-react";
import type { CatalogItem } from "@/lib/catalog";
import { useCart } from "@/store/cart";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";

export default function ProductPageClient({ product, related }: { product: CatalogItem | null; related: CatalogItem[] }) {
  const addToCart = useCart((s) => s.add);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(0);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  if (!product) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-5 py-24 text-center">
        <h1 className="font-display text-5xl text-brand-950">Product Not Found</h1>
        <p className="mt-3 text-lg text-brand-700">The product you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/shop" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-900 px-6 py-3 font-semibold text-white">
          <ChevronLeft size={18} /> Back to Shop
        </Link>
      </div>
    );
  }

  const hasColorOptions = product.colorOptions && product.colorOptions.length > 0;
  const selectedColor = hasColorOptions ? product.colorOptions![selectedColorIdx] : null;

  // Get images based on selected color
  const displayImages = selectedColor && selectedColor.images.length > 0
    ? selectedColor.images
    : product.images && product.images.length > 0
      ? product.images
      : [product.image];

  const currentImage = displayImages[currentImageIdx] || displayImages[0];
  const currentColorName = selectedColor?.colorName || product.color;

  const handleColorChange = (idx: number) => {
    setSelectedColorIdx(idx);
    setCurrentImageIdx(0);
    setImgLoaded(false);
  };

  const handleAdd = () => {
    if (!product) return;
    const size = selectedSize || product.sizes[0];
    if (!selectedSize) setSelectedSize(product.sizes[0]);
    addToCart(product, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-brand-700">
        <Link href="/shop" className="transition hover:text-brand-500">Shop</Link>
        <span>/</span>
        <Link href="/categories" className="transition hover:text-brand-500">{product.category}</Link>
        <span>/</span>
        <span className="font-semibold text-brand-950">{product.name}</span>
      </motion.div>

      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          {/* Main Image */}
          <div className="relative overflow-hidden rounded-3xl bg-brand-50">
            {!imgLoaded && <div className="absolute inset-0 shimmer rounded-3xl" />}
            <img
              src={currentImage}
              alt={product.name}
              onLoad={() => setImgLoaded(true)}
              className="h-[500px] w-full object-contain transition-transform duration-700 hover:scale-105 md:h-[600px]"
            />
            {product.oldPrice && (
              <span className="absolute left-4 top-4 rounded-full bg-red-500 px-4 py-1.5 text-sm font-bold text-white shadow-lg">
                {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
              </span>
            )}
            <button className="absolute right-4 top-4 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur transition hover:bg-brand-500 hover:text-white">
              <Heart size={20} />
            </button>
          </div>

          {/* Thumbnail Images */}
          {displayImages.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => { setCurrentImageIdx(idx); setImgLoaded(false); }}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${currentImageIdx === idx ? "border-brand-500 ring-2 ring-brand-500/20" : "border-brand-100 hover:border-brand-300"}`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col">
          <p className="text-sm font-bold uppercase tracking-widest text-brand-500">{product.category}</p>
          <h1 className="mt-2 font-display text-4xl text-brand-950 md:text-5xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex text-brand-500">{[1, 2, 3, 4, 5].map((s) => <Star key={s} size={16} fill="currentColor" />)}</div>
            <span className="text-sm text-brand-700">(12 reviews)</span>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-brand-900">&#8377;{product.price.toLocaleString("en-IN")}</span>
            {product.oldPrice && <span className="text-lg text-brand-400 line-through">&#8377;{product.oldPrice.toLocaleString("en-IN")}</span>}
          </div>

          {/* Description */}
          {product.description && (
            <p className="mt-4 text-brand-700 leading-relaxed">{product.description}</p>
          )}

          {/* Color Swatches */}
          {hasColorOptions ? (
            <div className="mt-6">
              <p className="text-sm font-semibold text-brand-800">
                Color: <span className="text-brand-900">{currentColorName}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.colorOptions!.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleColorChange(idx)}
                    title={color.colorName}
                    className={`relative h-10 w-10 rounded-full border-2 transition ${selectedColorIdx === idx ? "border-brand-900 ring-2 ring-brand-500/30" : "border-brand-200 hover:border-brand-400"}`}
                    style={{ backgroundColor: color.colorCode }}
                  >
                    {selectedColorIdx === idx && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <Check size={16} className={`${isLightColor(color.colorCode) ? "text-brand-900" : "text-white"}`} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-4 text-brand-700">Color: <span className="font-semibold text-brand-900">{product.color}</span></p>
          )}

          <p className={`mt-4 inline-flex items-center gap-1.5 text-sm font-semibold ${product.stock === "In Stock" ? "text-green-600" : "text-red-600"}`}>
            <span className={`h-2 w-2 rounded-full ${product.stock === "In Stock" ? "bg-green-500" : "bg-red-500"}`} />
            {product.stock}
          </p>

          <div className="mt-6">
            <p className="text-sm font-semibold text-brand-800">Select Size</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button key={size} onClick={() => setSelectedSize(size)} className={`rounded-xl border-2 px-5 py-2.5 text-sm font-semibold transition ${selectedSize === size ? "border-brand-900 bg-brand-900 text-white" : "border-brand-200 text-brand-800 hover:border-brand-500"}`}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleAdd} disabled={product.stock === "Out of Stock"} className="flex items-center justify-center gap-2 rounded-full bg-brand-900 px-8 py-3.5 font-semibold text-white transition hover:bg-brand-950 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50">
              <ShoppingBag size={18} />
              {added ? "Added!" : "Add to Cart"}
            </motion.button>
            <Link href="/checkout" className="flex items-center justify-center rounded-full border-2 border-brand-900 px-8 py-3.5 font-semibold text-brand-900 transition hover:bg-brand-900 hover:text-white">
              Buy Now
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {[{ icon: Truck, label: "Free Delivery" }, { icon: RotateCcw, label: "Easy Returns" }, { icon: Shield, label: "Secure Pay" }].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 rounded-xl bg-brand-50 p-3 text-center">
                <Icon size={20} className="text-brand-500" />
                <span className="text-xs font-semibold text-brand-800">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <AnimatedSection><h2 className="font-display text-3xl text-brand-950">You May Also Like</h2></AnimatedSection>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {related.map((item, i) => <ProductCard key={item.slug} item={item} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}

// Helper function to determine if a color is light
function isLightColor(hexColor: string): boolean {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
