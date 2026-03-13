"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, CreditCard, Banknote, Truck, ArrowLeft, ArrowRight, LogIn } from "lucide-react";
import { useCart } from "@/store/cart";
import { useAuth } from "@/context/AuthContext";
import AnimatedSection from "@/components/AnimatedSection";

export default function CheckoutPage() {
  const items = useCart((s) => s.items);
  const total = useCart((s) => s.total());
  const clear = useCart((s) => s.clear);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const delivery = total > 2000 ? 0 : 80;
  const grandTotal = total + delivery;
  const [payment, setPayment] = useState<"UPI" | "COD">("UPI");
  const [placed, setPlaced] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  // Address fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressEmail, setAddressEmail] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const handlePlaceOrder = async () => {
    if (!user) { router.push("/login?redirect=/checkout"); return; }
    if (!fullName || !phone || !line1 || !city || !postalCode) {
      setError("Please fill in all address fields");
      return;
    }
    setError("");
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: { fullName, phone, line1, city, postalCode },
          paymentMethod: payment,
          items: items.map(i => ({ slug: i.slug, size: i.selectedSize, qty: i.qty })),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Failed to place order");
        setPlacing(false);
        return;
      }
      setPlaced(true);
      clear();
    } catch {
      setError("Network error. Please try again.");
    }
    setPlacing(false);
  };

  if (placed) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-5 py-24 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <CheckCircle size={48} className="text-green-500" />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 font-display text-4xl text-brand-950">Order Placed!</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-3 text-lg text-brand-700">Thank you for shopping with Bhuvika Studio. You will receive a confirmation on WhatsApp shortly.</motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <Link href="/shop" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-900 px-8 py-3.5 font-semibold text-white">Continue Shopping</Link>
        </motion.div>
      </div>
    );
  }

  // Show login prompt if not logged in
  if (!authLoading && !user) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center px-5 py-24 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-100">
            <LogIn size={36} className="text-brand-500" />
          </div>
          <h1 className="mt-6 font-display text-3xl text-brand-950">Login Required</h1>
          <p className="mt-2 text-brand-700">Please login to place your order</p>
          <Link href="/login?redirect=/checkout" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-900 px-8 py-3.5 font-semibold text-white hover:bg-brand-950">
            <LogIn size={18} /> Login to Continue
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12">
      <AnimatedSection>
        <Link href="/cart" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 transition hover:text-brand-500"><ArrowLeft size={16} /> Back to Cart</Link>
        <h1 className="mt-3 font-display text-4xl text-brand-950">Checkout</h1>
      </AnimatedSection>

      <div className="mt-8 grid gap-8 lg:grid-cols-[3fr_2fr]">
        <div className="space-y-6">
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2"><Truck size={20} className="text-brand-500" /><h2 className="text-xl font-bold text-brand-950">Delivery Address</h2></div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <input value={fullName} onChange={e => setFullName(e.target.value)} className="rounded-xl border border-brand-200 bg-brand-50/50 px-4 py-3 text-brand-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" placeholder="Full Name *" />
              <input value={phone} onChange={e => setPhone(e.target.value)} className="rounded-xl border border-brand-200 bg-brand-50/50 px-4 py-3 text-brand-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" placeholder="Phone Number *" />
              <input value={addressEmail} onChange={e => setAddressEmail(e.target.value)} className="rounded-xl border border-brand-200 bg-brand-50/50 px-4 py-3 text-brand-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 md:col-span-2" placeholder="Email Address" />
              <textarea value={line1} onChange={e => setLine1(e.target.value)} className="rounded-xl border border-brand-200 bg-brand-50/50 px-4 py-3 text-brand-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 md:col-span-2" rows={3} placeholder="House No, Street, Area *" />
              <input value={city} onChange={e => setCity(e.target.value)} className="rounded-xl border border-brand-200 bg-brand-50/50 px-4 py-3 text-brand-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" placeholder="City *" />
              <input value={postalCode} onChange={e => setPostalCode(e.target.value)} className="rounded-xl border border-brand-200 bg-brand-50/50 px-4 py-3 text-brand-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" placeholder="PIN Code *" />
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-brand-950">Payment Method</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <button onClick={() => setPayment("UPI")} className={`flex items-center gap-3 rounded-xl border-2 p-4 transition ${payment === "UPI" ? "border-brand-500 bg-brand-50" : "border-brand-100 hover:border-brand-300"}`}>
                <CreditCard size={24} className={payment === "UPI" ? "text-brand-500" : "text-brand-400"} />
                <div className="text-left"><p className="font-semibold text-brand-900">UPI Payment</p><p className="text-xs text-brand-700">Google Pay, PhonePe, etc.</p></div>
              </button>
              <button onClick={() => setPayment("COD")} className={`flex items-center gap-3 rounded-xl border-2 p-4 transition ${payment === "COD" ? "border-brand-500 bg-brand-50" : "border-brand-100 hover:border-brand-300"}`}>
                <Banknote size={24} className={payment === "COD" ? "text-brand-500" : "text-brand-400"} />
                <div className="text-left"><p className="font-semibold text-brand-900">Cash on Delivery</p><p className="text-xs text-brand-700">Pay when you receive</p></div>
              </button>
            </div>
            <AnimatePresence>
              {payment === "UPI" && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 overflow-hidden rounded-xl bg-brand-50 p-4">
                  <p className="text-sm text-brand-800">A UPI QR code for <strong>&#8377;{grandTotal.toLocaleString("en-IN")}</strong> will be generated after placing the order.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        </div>

        <motion.aside initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="h-fit rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
          <h2 className="font-display text-2xl text-brand-950">Order Summary</h2>
          {items.length > 0 ? (
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.slug + item.selectedSize} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                  <div className="flex-1"><p className="text-sm font-semibold text-brand-900">{item.name}</p><p className="text-xs text-brand-700">x{item.qty} &bull; {item.selectedSize}</p></div>
                  <p className="text-sm font-bold text-brand-900">&#8377;{(item.price * item.qty).toLocaleString("en-IN")}</p>
                </div>
              ))}
              <hr className="border-brand-100" />
              <div className="flex justify-between text-sm text-brand-700"><span>Subtotal</span><span>&#8377;{total.toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between text-sm text-brand-700"><span>Delivery</span><span>{delivery === 0 ? "FREE" : `₹${delivery}`}</span></div>
              <hr className="border-brand-100" />
              <div className="flex justify-between text-xl font-bold text-brand-950"><span>Total</span><span>&#8377;{grandTotal.toLocaleString("en-IN")}</span></div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-brand-700">Your cart is empty. <Link href="/shop" className="text-brand-500 underline">Add items</Link> to proceed.</p>
          )}
          {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
          <motion.button whileTap={{ scale: 0.97 }} onClick={handlePlaceOrder} disabled={items.length === 0 || placing} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-900 px-6 py-3.5 font-semibold text-white transition hover:bg-brand-950 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50">
            {placing ? "Placing Order..." : "Place Order"} <ArrowRight size={18} />
          </motion.button>
        </motion.aside>
      </div>
    </div>
  );
}
