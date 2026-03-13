"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/store/cart";
import AnimatedSection from "@/components/AnimatedSection";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const updateQty = useCart((s) => s.updateQty);
  const total = useCart((s) => s.total());
  const delivery = total > 2000 ? 0 : 80;
  const grandTotal = total + delivery;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-5 py-24 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-50">
          <ShoppingBag size={40} className="text-brand-300" />
        </motion.div>
        <h1 className="mt-6 font-display text-4xl text-brand-950">Your Cart is Empty</h1>
        <p className="mt-2 text-brand-700">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/shop" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-900 px-8 py-3 font-semibold text-white transition hover:bg-brand-950">
          Start Shopping <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12">
      <AnimatedSection>
        <h1 className="font-display text-4xl text-brand-950">Your Cart</h1>
        <p className="mt-1 text-brand-700">{items.length} item{items.length > 1 ? "s" : ""} in your bag</p>
      </AnimatedSection>

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.article key={item.slug + item.selectedSize} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }} className="flex gap-4 rounded-2xl border border-brand-100 bg-white p-4 shadow-sm">
                <img src={item.image} alt={item.name} className="h-28 w-24 rounded-xl object-cover" />
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-brand-500">{item.category}</p>
                      <h3 className="text-lg font-bold text-brand-950">{item.name}</h3>
                      <p className="text-sm text-brand-700">Size: {item.selectedSize} &bull; {item.color}</p>
                    </div>
                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => remove(item.slug)} className="rounded-lg p-1.5 text-brand-400 transition hover:bg-red-50 hover:text-red-500">
                      <Trash2 size={18} />
                    </motion.button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50">
                      <button onClick={() => updateQty(item.slug, item.qty - 1)} className="rounded-full p-1.5 transition hover:bg-brand-100"><Minus size={14} /></button>
                      <span className="w-6 text-center text-sm font-bold text-brand-900">{item.qty}</span>
                      <button onClick={() => updateQty(item.slug, item.qty + 1)} className="rounded-full p-1.5 transition hover:bg-brand-100"><Plus size={14} /></button>
                    </div>
                    <span className="text-lg font-bold text-brand-900">&#8377;{(item.price * item.qty).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        <motion.aside initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="h-fit rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
          <h2 className="font-display text-2xl text-brand-950">Order Summary</h2>
          <div className="mt-5 space-y-3 text-brand-800">
            <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">&#8377;{total.toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span className="font-semibold">{delivery === 0 ? "FREE" : `₹${delivery}`}</span></div>
            {delivery === 0 && <p className="text-xs font-semibold text-green-600">Free delivery on orders above ₹2,000!</p>}
            <hr className="border-brand-100" />
            <div className="flex justify-between text-xl font-bold text-brand-950"><span>Total</span><span>&#8377;{grandTotal.toLocaleString("en-IN")}</span></div>
          </div>
          <Link href="/checkout" className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-900 px-6 py-3.5 font-semibold text-white transition hover:bg-brand-950 hover:shadow-lg">
            Proceed to Checkout <ArrowRight size={18} />
          </Link>
        </motion.aside>
      </div>
    </div>
  );
}
