"use client";
import { useState, useEffect } from "react";
import { Ticket, Copy, CheckCircle2, Loader2, Tag } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { motion } from "framer-motion";

interface Coupon {
  id: string;
  code: string;
  description: string;
  discountValue: number;
  discountType: string;
  minOrderAmount?: number;
  expiryDate?: string;
  isActive: boolean;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/coupons/active");
      if (res.ok) {
        const data = await res.json();
        // The backend returns { type: 'FLAT'|'PERCENT', value: number }
        const formatted = data.map((c: any) => ({
          ...c,
          discountType: c.type === 'PERCENT' ? 'PERCENTAGE' : 'FLAT',
          discountValue: c.value,
          minOrderAmount: c.minCartValue,
          expiryDate: c.validUntil
        }));
        setCoupons(formatted);
      }
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const getThemeColor = (index: number) => {
    const colors = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-rose-500", "bg-amber-500"];
    return colors[index % colors.length];
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-10">
      <AnimatedSection>
        <h1 className="font-display text-4xl text-brand-950">My Coupons</h1>
        <p className="mt-2 text-brand-700">Save more on your favorite styles with exclusive offers</p>
      </AnimatedSection>

      <div className="mt-10 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-brand-500" size={32} />
            <p className="mt-4 text-sm font-medium text-brand-600">Finding best offers for you...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-brand-100 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-400">
              <Tag size={32} />
            </div>
            <h3 className="mt-4 text-xl font-bold text-brand-950">No Active Coupons</h3>
            <p className="mt-2 text-brand-600">Check back later for new festive offers and discounts!</p>
          </div>
        ) : (
          coupons.map((coupon, i) => (
            <motion.div 
              key={coupon.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-sm transition hover:shadow-md md:flex-row"
            >
              {/* Left side: Code and Icon */}
              <div className={`flex flex-col items-center justify-center p-6 text-white md:w-48 ${getThemeColor(i)}`}>
                <Ticket size={40} className="mb-2 opacity-50" />
                <span className="text-xl font-black tracking-widest">{coupon.code}</span>
                <button 
                  onClick={() => copyToClipboard(coupon.code)}
                  className="mt-4 flex items-center gap-1 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold backdrop-blur-md transition hover:bg-white/40"
                >
                  {copied === coupon.code ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                  {copied === coupon.code ? "COPIED" : "COPY CODE"}
                </button>
              </div>
              
              {/* Right side: Details */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-brand-950">
                      {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% OFF` : `Flat ₹${coupon.discountValue} OFF`}
                    </h3>
                    <p className="mt-1 text-sm text-brand-600 leading-relaxed">{coupon.description || "Valid on selected designer wear."}</p>
                  </div>
                  <Tag size={24} className="text-brand-100" />
                </div>
                
                <div className="mt-6 flex items-center justify-between border-t border-brand-50 pt-4">
                  <div className="flex flex-col gap-0.5">
                    {coupon.minOrderAmount && (
                      <span className="text-[10px] font-bold text-brand-400 uppercase">Min Order: ₹{coupon.minOrderAmount}</span>
                    )}
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
                      {coupon.expiryDate ? `Exp: ${new Date(coupon.expiryDate).toLocaleDateString()}` : "Valid for Limited Period"}
                    </span>
                  </div>
                  <button className="text-sm font-bold text-brand-900 transition hover:text-brand-600">VIEW T&C</button>
                </div>
              </div>
              
              {/* Decorative cutouts for ticket look */}
              <div className="absolute -left-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 rounded-full bg-brand-50 md:block" />
              <div className="absolute left-[180px] -top-3 hidden h-6 w-6 rounded-full bg-brand-50 md:block" />
              <div className="absolute left-[180px] -bottom-3 hidden h-6 w-6 rounded-full bg-brand-50 md:block" />
            </motion.div>
          ))
        )}
      </div>

      <div className="mt-12 rounded-2xl bg-brand-50 p-6 text-center">
        <p className="text-sm text-brand-600">Have a special discount code?</p>
        <p className="mt-1 text-xs text-brand-400">Apply it during checkout to save on your order.</p>
      </div>
    </div>
  );
}
