"use client";
import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, CreditCard, Banknote, Truck, ArrowLeft, ArrowRight, LogIn, Shield } from "lucide-react";
import { useCart, AppliedCoupon } from "@/store/cart";
import { useAuth } from "@/context/AuthContext";
import AnimatedSection from "@/components/AnimatedSection";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type ShippingSettings = {
  freeThreshold: number;
  defaultCharge: number;
  codEnabled: boolean;
  codCharge: number;
};

const DEFAULT_SHIPPING: ShippingSettings = {
  freeThreshold: 2000,
  defaultCharge: 80,
  codEnabled: true,
  codCharge: 0,
};

export default function CheckoutPage() {
  const items = useCart((s) => s.items);
  const total = useCart((s) => s.total());
  const appliedCoupon = useCart((s) => s.appliedCoupon);
  const clear = useCart((s) => s.clear);
  const hasHydrated = useCart((s) => s._hasHydrated);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Store coupon in ref to prevent losing it
  const couponRef = useRef<AppliedCoupon>(null);

  // Update ref whenever appliedCoupon changes and is valid
  useEffect(() => {
    if (appliedCoupon && appliedCoupon.discount > 0) {
      couponRef.current = appliedCoupon;
    }
  }, [appliedCoupon]);

  const [shipping, setShipping] = useState<ShippingSettings>(DEFAULT_SHIPPING);

  useEffect(() => {
    fetch("/api/settings/shipping")
      .then(res => res.ok ? res.json() : DEFAULT_SHIPPING)
      .then(data => setShipping(data))
      .catch(() => {});
  }, []);

  const delivery = total > shipping.freeThreshold ? 0 : shipping.defaultCharge;
  const discount = appliedCoupon?.discount || 0;
  const grandTotal = total + delivery - discount;
  const razorpayEnabled = !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const [payment, setPayment] = useState<"RAZORPAY" | "COD">(razorpayEnabled ? "RAZORPAY" : "COD");
  const [placed, setPlaced] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [razorpayReady, setRazorpayReady] = useState(false);

  // Address fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressEmail, setAddressEmail] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  useEffect(() => {
    if (user?.email) setAddressEmail(user.email);
    if (user?.name) setFullName(user.name);
  }, [user]);

  const openRazorpay = (razorpayOrderId: string, orderId: string, amount: number) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: "INR",
      name: "Bhuvika Studio",
      description: `Order #${orderId.slice(0, 8)}`,
      order_id: razorpayOrderId,
      handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
        try {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          if (!verifyRes.ok) {
            const err = await verifyRes.json();
            setError(err.error || "Payment verification failed");
            setPlacing(false);
            return;
          }
          setPlaced(true);
          clear();
        } catch {
          setError("Payment verification failed. Contact support.");
        }
        setPlacing(false);
      },
      prefill: {
        name: fullName,
        email: addressEmail || user?.email,
        contact: phone,
      },
      theme: { color: "#7c3aed" },
      modal: {
        ondismiss: () => {
          setPlacing(false);
          setError("Payment cancelled. Your order is saved — you can retry payment.");
        },
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePlaceOrder = async () => {
    if (!user) { router.push("/login?redirect=/checkout"); return; }
    if (!hasHydrated) {
      setError("Loading cart data. Please wait a moment.");
      return;
    }
    if (!fullName || !phone || !line1 || !city || !postalCode) {
      setError("Please fill in all address fields");
      return;
    }
    if (payment === "RAZORPAY" && razorpayEnabled && !razorpayReady) {
      setError("Payment system loading. Please wait a moment.");
      return;
    }
    setError("");
    setPlacing(true);

    // Use appliedCoupon from subscription, fallback to ref, fallback to store
    const coupon = appliedCoupon || couponRef.current || useCart.getState().appliedCoupon;
    const couponCode = coupon?.code || null;
    const couponDiscount = coupon?.discount || 0;

    console.log("Placing order with coupon:", { couponCode, couponDiscount, appliedCoupon, refCoupon: couponRef.current });

    // Build request body
    const orderData = {
      address: { fullName, phone, email: addressEmail, line1, city, postalCode },
      paymentMethod: payment,
      items: items.map(i => ({ slug: i.slug, size: i.selectedSize, qty: i.qty })),
      couponCode: couponCode,
      couponDiscount: couponDiscount,
    };

    console.log("Order request body:", JSON.stringify(orderData));

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderData),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Failed to place order");
        setPlacing(false);
        return;
      }
      const order = await res.json();

      // If Razorpay, open payment modal
      if (payment === "RAZORPAY" && order.razorpayOrderId) {
        openRazorpay(order.razorpayOrderId, order.id || order._id, order.totalAmount);
        return; // handler will set placed/placing
      }

      // COD or Razorpay not configured — order placed directly
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
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-3 text-lg text-brand-700">Thank you for shopping with Bhuvika Studio. You will receive a confirmation shortly.</motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <Link href="/shop" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-900 px-8 py-3.5 font-semibold text-white">Continue Shopping</Link>
        </motion.div>
      </div>
    );
  }

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
    <>
      {razorpayEnabled && (
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          onLoad={() => setRazorpayReady(true)}
        />
      )}
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
                {razorpayEnabled && (
                <button onClick={() => setPayment("RAZORPAY")} className={`flex items-center gap-3 rounded-xl border-2 p-4 transition ${payment === "RAZORPAY" ? "border-brand-500 bg-brand-50" : "border-brand-100 hover:border-brand-300"}`}>
                  <CreditCard size={24} className={payment === "RAZORPAY" ? "text-brand-500" : "text-brand-400"} />
                  <div className="text-left"><p className="font-semibold text-brand-900">Pay Online</p><p className="text-xs text-brand-700">UPI, Cards, Net Banking</p></div>
                </button>
                )}
                <button onClick={() => setPayment("COD")} className={`flex items-center gap-3 rounded-xl border-2 p-4 transition ${payment === "COD" ? "border-brand-500 bg-brand-50" : "border-brand-100 hover:border-brand-300"}`}>
                  <Banknote size={24} className={payment === "COD" ? "text-brand-500" : "text-brand-400"} />
                  <div className="text-left"><p className="font-semibold text-brand-900">Cash on Delivery</p><p className="text-xs text-brand-700">Pay when you receive</p></div>
                </button>
              </div>
              <AnimatePresence>
                {payment === "RAZORPAY" && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 overflow-hidden rounded-xl bg-brand-50 p-4">
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-green-600" />
                      <p className="text-sm text-brand-800">Secure payment powered by <strong>Razorpay</strong>. Your card details are never stored with us.</p>
                    </div>
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
                {discount > 0 && appliedCoupon && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>-&#8377;{discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-brand-700"><span>Shipping</span><span>{delivery === 0 ? "FREE" : `₹${delivery}`}</span></div>
                <hr className="border-brand-100" />
                <div className="flex justify-between text-xl font-bold text-brand-950"><span>Total</span><span>&#8377;{grandTotal.toLocaleString("en-IN")}</span></div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-brand-700">Your cart is empty. <Link href="/shop" className="text-brand-500 underline">Add items</Link> to proceed.</p>
            )}
            {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            <motion.button whileTap={{ scale: 0.97 }} onClick={handlePlaceOrder} disabled={items.length === 0 || placing} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-900 px-6 py-3.5 font-semibold text-white transition hover:bg-brand-950 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50">
              {placing ? "Processing..." : payment === "RAZORPAY" ? "Pay Now" : "Place Order"} <ArrowRight size={18} />
            </motion.button>
          </motion.aside>
        </div>
      </div>
    </>
  );
}
