"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart, ChevronLeft, Star, Truck, RotateCcw, Shield, Check, Tag, Lock, Gift, Ruler, X, Loader2 } from "lucide-react";
import type { CatalogItem } from "@/lib/catalog";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";

// Helper to determine if a color is light for checkmark visibility
const isLightColor = (color: string) => {
  if (!color.startsWith('#')) return false;
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155;
};

export default function ProductPageClient({ product, related }: { product: CatalogItem | null; related: CatalogItem[] }) {
  const router = useRouter();
  const addToCart = useCart((s) => s.add);
  const { toggle, isInWishlist } = useWishlist();
  const active = product ? isInWishlist(product.slug) : false;
  
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [showSizeChartModal, setShowSizeChartModal] = useState(false);
  const [loadingSizeChart, setLoadingSizeChart] = useState(false);
  const [fetchedSizeChart, setFetchedSizeChart] = useState<any[] | null>(null);
  const [fetchedSizeChartType, setFetchedSizeChartType] = useState<string>("standard");

  const openSizeChart = async () => {
    setShowSizeChartModal(true);
    if (product?.sizeChart && product.sizeChart.length > 0) {
      setFetchedSizeChart(product.sizeChart);
      setFetchedSizeChartType(product.sizeChartType || "standard");
    } else if (product) {
      setLoadingSizeChart(true);
      try {
        const res = await fetch(`/api/size-charts/${encodeURIComponent(product.category)}`);
        if (res.ok) {
          const data = await res.json();
          setFetchedSizeChart(data.measurements || []);
          setFetchedSizeChartType(data.type || "standard");
        }
      } catch (err) {
        console.error("Failed to load category size chart", err);
      } finally {
        setLoadingSizeChart(false);
      }
    }
  };
  const [selectedColorIdx, setSelectedColorIdx] = useState<number | null>(null);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const [pincodeInput, setPincodeInput] = useState("");
  const [deliveryDateMsg, setDeliveryDateMsg] = useState("");
  const [checkingPincode, setCheckingPincode] = useState(false);

  const [descOpen, setDescOpen] = useState(true);
  const [noteOpen, setNoteOpen] = useState(false);

  const calculateDelivery = (pin: string) => {
    if (pin.length !== 6) {
      alert("Please enter a valid 6-digit pincode");
      return;
    }
    setCheckingPincode(true);
    
    setTimeout(() => {
      const firstDigit = pin[0];
      let minDays = 5;
      let maxDays = 8;
      
      if (firstDigit === "5") {
        // AP, Telangana, Karnataka (Bhuvika Studio home region)
        minDays = 2;
        maxDays = 4;
      } else if (firstDigit === "6") {
        // Tamil Nadu, Kerala
        minDays = 3;
        maxDays = 5;
      } else if (firstDigit === "4") {
        // Maharashtra, Goa, MP, Chhattisgarh
        minDays = 4;
        maxDays = 6;
      } else if (firstDigit === "1" || firstDigit === "2") {
        // North India (Delhi, Haryana, Punjab, UP)
        minDays = 5;
        maxDays = 7;
      } else if (firstDigit === "7" || firstDigit === "9") {
        // East / North East / J&K / Army
        minDays = 6;
        maxDays = 9;
      }

      const today = new Date();
      const start = new Date(today);
      start.setDate(today.getDate() + minDays);
      const end = new Date(today);
      end.setDate(today.getDate() + maxDays);
      
      const format = (date: Date) => {
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      };
      
      setDeliveryDateMsg(`${format(start)} - ${format(end)}`);
      setCheckingPincode(false);
    }, 500);
  };

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
  const selectedColor = hasColorOptions && selectedColorIdx !== null ? product.colorOptions![selectedColorIdx] : null;

  // Get images based on selected color
  const displayImages = (() => {
    const mainImages = product.images && product.images.length > 0 ? product.images : [product.image];
    const colorImages = selectedColor && selectedColor.images.length > 0 ? selectedColor.images : [];
    
    // Show only the selected color's images if selected, otherwise show default product images.
    if (selectedColor && colorImages.length > 0) {
      return colorImages;
    }
    return mainImages;
  })();

  const currentImage = displayImages[currentImageIdx] || displayImages[0];
  const currentColorName = selectedColor?.colorName || (hasColorOptions ? "Select color" : product.color);

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

  const handleBuyNow = () => {
    if (!product) return;
    const size = selectedSize || product.sizes[0];
    addToCart(product, size);
    router.push("/checkout");
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
          <div className="relative group overflow-hidden rounded-3xl bg-brand-50 sm:rounded-[2rem]">
            {!imgLoaded && <div className="absolute inset-0 shimmer rounded-3xl" />}
            <img
              src={currentImage}
              alt={product.name}
              onLoad={() => setImgLoaded(true)}
              className="h-[450px] w-full object-contain transition-transform duration-700 hover:scale-105 sm:h-[600px] md:h-[600px]"
            />
            
            {/* Navigation Arrows (Desktop Only) */}
            {displayImages.length > 1 && (
              <>
                <button 
                  onClick={() => { setCurrentImageIdx((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1)); setImgLoaded(false); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur transition hover:bg-brand-500 hover:text-white opacity-0 group-hover:opacity-100 hidden md:block"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={() => { setCurrentImageIdx((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1)); setImgLoaded(false); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur transition hover:bg-brand-500 hover:text-white opacity-0 group-hover:opacity-100 hidden md:block"
                >
                  <ChevronLeft size={24} className="rotate-180" />
                </button>
              </>
            )}

            {/* Image Counter Badge */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md md:hidden">
                {currentImageIdx + 1} / {displayImages.length}
              </div>
            )}

            {product.oldPrice && (
              <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-lg">
                {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
              </span>
            )}
            <button 
              onClick={() => toggle(product)}
              className={`absolute right-3 top-3 rounded-full p-2 shadow-sm backdrop-blur transition ${active ? "bg-red-500 text-white" : "bg-white/90 text-brand-700 hover:bg-brand-500 hover:text-white"}`}
            >
              <Heart size={18} fill={active ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Thumbnail Images */}
          {displayImages.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => { setCurrentImageIdx(idx); setImgLoaded(false); }}
                  className={`relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-20 sm:w-20 ${currentImageIdx === idx ? "border-brand-500 ring-2 ring-brand-500/10" : "border-brand-100"}`}
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
                    style={{ backgroundColor: color.colorCode === "#000000" && color.colorName.toLowerCase() !== "black" ? color.colorName : color.colorCode }}
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
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-brand-800">Select Size</p>
              <button 
                onClick={openSizeChart} 
                className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800 hover:underline"
              >
                <Ruler size={14} /> Size Chart
              </button>
            </div>
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
            <button onClick={handleBuyNow} disabled={product.stock === "Out of Stock"} className="flex items-center justify-center rounded-full border-2 border-brand-900 px-8 py-3.5 font-semibold text-brand-900 transition hover:bg-brand-900 hover:text-white disabled:opacity-50">
              Buy Now
            </button>
          </div>

          {/* Premium Badges */}
          <div className="mt-8 grid grid-cols-3 border-y border-brand-100 py-5 gap-2">
            <div className="flex flex-col items-center text-center px-1">
              <span className="mb-2 p-2 bg-brand-50 rounded-full text-brand-700">
                <Tag size={18} />
              </span>
              <span className="text-[10px] font-bold tracking-tight text-brand-900 uppercase">Reasonable Prices</span>
            </div>
            <div className="flex flex-col items-center text-center px-1 border-x border-brand-100">
              <span className="mb-2 p-2 bg-brand-50 rounded-full text-brand-700">
                <Lock size={18} />
              </span>
              <span className="text-[10px] font-bold tracking-tight text-brand-900 uppercase">Secure Payment</span>
            </div>
            <div className="flex flex-col items-center text-center px-1">
              <span className="mb-2 p-2 bg-brand-50 rounded-full text-brand-700">
                <Gift size={18} />
              </span>
              <span className="text-[10px] font-bold tracking-tight text-brand-900 uppercase">Premium Package</span>
            </div>
          </div>

          {/* Pincode & Delivery Section */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-brand-500 shrink-0" />
              <span className="text-sm font-semibold text-brand-900">Estimated Delivery:</span>
              {deliveryDateMsg ? (
                <span className="text-sm font-bold text-green-700">{deliveryDateMsg}</span>
              ) : (
                <span className="text-sm text-brand-500">Enter pincode below to check</span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 6-digit pincode"
                maxLength={6}
                value={pincodeInput}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setPincodeInput(val);
                  if (val.length === 6) {
                    calculateDelivery(val);
                  } else {
                    setDeliveryDateMsg("");
                  }
                }}
                className="w-full max-w-[200px] rounded-xl border border-brand-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500 font-medium"
              />
              <button
                type="button"
                onClick={() => calculateDelivery(pincodeInput)}
                className="rounded-xl bg-brand-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-950 transition-all shadow-sm shrink-0"
              >
                {checkingPincode ? "Checking..." : "Check"}
              </button>
            </div>

          </div>

          {/* Description & Note Accordions */}
          <div className="mt-8 border-t border-brand-100 pt-6 space-y-4">
            {/* Description Tab */}
            <div className="border-b border-brand-100 pb-4">
              <button 
                type="button"
                onClick={() => setDescOpen(!descOpen)}
                className="flex w-full items-center justify-between font-display text-lg text-brand-950 font-medium"
              >
                <span>Description</span>
                <span className="text-brand-500 transition-transform duration-300 text-xs" style={{ transform: descOpen ? "rotate(180deg)" : "rotate(0)" }}>
                  ▼
                </span>
              </button>
              {descOpen && (
                <div className="mt-3 text-sm text-brand-700 leading-relaxed font-normal">
                  {product.description || "No description available for this item."}
                </div>
              )}
            </div>

            {/* Note Tab */}
            <div className="border-b border-brand-100 pb-4">
              <button 
                type="button"
                onClick={() => setNoteOpen(!noteOpen)}
                className="flex w-full items-center justify-between font-display text-lg text-brand-950 font-medium"
              >
                <span>Note</span>
                <span className="text-brand-500 transition-transform duration-300 text-xs" style={{ transform: noteOpen ? "rotate(180deg)" : "rotate(0)" }}>
                  ▼
                </span>
              </button>
              {noteOpen && (
                <div className="mt-3 text-sm text-brand-700 space-y-3 font-normal">
                  <div className="flex gap-2">
                    <span className="font-bold text-brand-900 shrink-0">• Color Accuracy:</span>
                    <span>We strive to capture accurate product colors in natural light. However, slight variations may occur due to camera lens differences.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-brand-900 shrink-0">• Shipping Time:</span>
                    <span>Please allow 5-7 business days for delivery.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-brand-900 shrink-0">• Return Policy:</span>
                    <span>Orders are non-returnable and non-exchangeable.</span>
                  </div>
                </div>
              )}
            </div>
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

      {/* Size Chart Modal */}
      <AnimatePresence>
        {showSizeChartModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSizeChartModal(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[10%] z-50 mx-auto max-h-[80vh] max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl md:top-[15%]"
            >
              <div className="flex items-center justify-between border-b border-brand-100 pb-4">
                <div>
                  <h3 className="font-display text-xl text-brand-950">Size Chart</h3>
                  <p className="text-xs text-brand-500">{product.category} ({fetchedSizeChartType === "kids" ? "Kids Sizing" : "Standard Sizing"})</p>
                </div>
                <button
                  onClick={() => setShowSizeChartModal(false)}
                  className="rounded-full p-1.5 hover:bg-brand-50 transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-6">
                {loadingSizeChart ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-brand-500" size={28} />
                  </div>
                ) : fetchedSizeChart && fetchedSizeChart.length > 0 ? (
                  <div className="overflow-x-auto rounded-2xl border border-brand-100 bg-brand-50/20">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-brand-100 text-brand-400 font-bold uppercase bg-brand-50/50">
                          <th className="p-3">Size</th>
                          {fetchedSizeChartType === "kids" && <th className="p-3">Age Range</th>}
                          <th className="p-3">Chest (in)</th>
                          <th className="p-3">Waist (in)</th>
                          <th className="p-3">Hip (in)</th>
                          <th className="p-3">Length (in)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fetchedSizeChart.map((row, index) => (
                          <tr key={index} className="border-b border-brand-50 last:border-0 hover:bg-brand-50/30">
                            <td className="p-3 font-semibold text-brand-950">{row.size}</td>
                            {fetchedSizeChartType === "kids" && <td className="p-3 text-brand-700 font-medium">{row.ageRange || "—"}</td>}
                            <td className="p-3 text-brand-700">{row.chest || "—"}</td>
                            <td className="p-3 text-brand-700">{row.waist || "—"}</td>
                            <td className="p-3 text-brand-700">{row.hip || "—"}</td>
                            <td className="p-3 text-brand-700">{row.length || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center py-10 text-sm text-brand-500">No measurements available for this category.</p>
                )}
              </div>

              <div className="mt-6 border-t border-brand-100 pt-4 text-center">
                <p className="text-[10px] text-brand-400">Note: All measurements are in inches. Standard Indian garment sizing applies.</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
