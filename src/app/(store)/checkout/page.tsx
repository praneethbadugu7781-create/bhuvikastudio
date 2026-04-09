"use client";
import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, CreditCard, Banknote, Truck, ArrowLeft, ArrowRight, LogIn, Shield, Plus, MapPin, Trash2, Edit2 } from "lucide-react";
import { useCart, AppliedCoupon } from "@/store/cart";
import { useAuth } from "@/context/AuthContext";
import AnimatedSection from "@/components/AnimatedSection";

declare global {
  interface Window {
    Cashfree: {
      checkout: (config: Record<string, unknown>) => Promise<void>;
    };
  }
}

type ShippingSettings = {
  freeThreshold: number;
  defaultCharge: number;
  codEnabled: boolean;
  codCharge: number;
};

type SavedAddress = {
  _id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
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
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [saveAddress, setSaveAddress] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);

  useEffect(() => {
    fetch("/api/settings/shipping")
      .then(res => res.ok ? res.json() : DEFAULT_SHIPPING)
      .then(data => setShipping(data))
      .catch(() => {});
  }, []);

  // Fetch saved addresses
  useEffect(() => {
    if (user) {
      fetch("/api/addresses", { credentials: "include" })
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          setSavedAddresses(data);
          // Auto-select default address
          const defaultAddr = data.find((a: SavedAddress) => a.isDefault);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr._id);
          } else if (data.length > 0) {
            setSelectedAddressId(data[0]._id);
          } else {
            setShowNewAddressForm(true);
          }
          setLoadingAddresses(false);
        })
        .catch(() => setLoadingAddresses(false));
    } else {
      setLoadingAddresses(false);
      setShowNewAddressForm(true);
    }
  }, [user]);

  const delivery = total > shipping.freeThreshold ? 0 : shipping.defaultCharge;
  const discount = appliedCoupon?.discount || 0;
  const grandTotal = total + delivery - discount;
  const cashfreeEnabled = !!process.env.NEXT_PUBLIC_CASHFREE_APP_ID;
  const [payment, setPayment] = useState<"CASHFREE" | "COD">(cashfreeEnabled ? "CASHFREE" : "COD");
  const [placed, setPlaced] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [cashfreeReady, setCashfreeReady] = useState(false);

  // Address fields for new address
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressEmail, setAddressEmail] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  useEffect(() => {
    if (user?.email) setAddressEmail(user.email);
    if (user?.name) setFullName(user.name);
  }, [user]);

  const clearAddressForm = () => {
    setFullName(user?.name || "");
    setPhone("");
    setLine1("");
    setLine2("");
    setCity("");
    setPostalCode("");
    setEditingAddress(null);
  };

  const handleEditAddress = (addr: SavedAddress) => {
    setEditingAddress(addr);
    setFullName(addr.fullName);
    setPhone(addr.phone);
    setLine1(addr.line1);
    setLine2(addr.line2 || "");
    setCity(addr.city);
    setPostalCode(addr.postalCode);
    setShowNewAddressForm(true);
    setSelectedAddressId(null);
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: "DELETE", credentials: "include" });
      if (res.ok) {
        setSavedAddresses(prev => prev.filter(a => a._id !== id));
        if (selectedAddressId === id) {
          const remaining = savedAddresses.filter(a => a._id !== id);
          if (remaining.length > 0) {
            setSelectedAddressId(remaining[0]._id);
          } else {
            setSelectedAddressId(null);
            setShowNewAddressForm(true);
          }
        }
      }
    } catch {
      // Ignore
    }
  };

  const handleSaveNewAddress = async () => {
    if (!fullName || !phone || !line1 || !city || !postalCode) {
      setError("Please fill in all required address fields");
      return null;
    }

    const addressData = { fullName, phone, line1, line2, city, state: "Andhra Pradesh", postalCode, isDefault: savedAddresses.length === 0 };

    try {
      if (editingAddress) {
        const res = await fetch(`/api/addresses/${editingAddress._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(addressData),
        });
        if (res.ok) {
          const updated = await res.json();
          setSavedAddresses(prev => prev.map(a => a._id === updated._id ? updated : a));
          setSelectedAddressId(updated._id);
          setShowNewAddressForm(false);
          clearAddressForm();
          return updated;
        }
      } else {
        const res = await fetch("/api/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(addressData),
        });
        if (res.ok) {
          const newAddr = await res.json();
          setSavedAddresses(prev => [...prev, newAddr]);
          setSelectedAddressId(newAddr._id);
          setShowNewAddressForm(false);
          clearAddressForm();
          return newAddr;
        }
      }
    } catch {
      // Continue without saving
    }
    return null;
  };

  const getSelectedAddress = (): { fullName: string; phone: string; line1: string; city: string; postalCode: string } | null => {
    if (selectedAddressId) {
      const addr = savedAddresses.find(a => a._id === selectedAddressId);
      if (addr) return addr;
    }
    if (showNewAddressForm && fullName && phone && line1 && city && postalCode) {
      return { fullName, phone, line1, city, postalCode };
    }
    return null;
  };

  const openCashfree = (cashfreeOrderId: string, orderId: string, amount: number) => {
    const addr = getSelectedAddress();
    const sessionId = Math.random().toString(36).substring(7);

    const config = {
      sessionId: sessionId,
      orderId: cashfreeOrderId,
      amount: amount,
      currency: "INR",
      customer: {
        customerId: orderId,
        customerName: addr?.fullName || fullName,
        customerEmail: addressEmail || user?.email,
        customerPhone: addr?.phone || phone,
      },
      paymentSessionId: sessionId,
      onSuccess: async (response: { transactionId?: string }) => {
        try {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: cashfreeOrderId,
              paymentSessionId: sessionId,
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
      onFailure: (response: unknown) => {
        setError("Payment failed. Please try again.");
        setPlacing(false);
      },
      onClose: () => {
        setPlacing(false);
        setError("Payment cancelled. Your order is saved — you can retry payment.");
      },
    };

    if (window.Cashfree && window.Cashfree.checkout) {
      window.Cashfree.checkout(config);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) { router.push("/login?redirect=/checkout"); return; }
    if (!hasHydrated) {
      setError("Loading cart data. Please wait a moment.");
      return;
    }

    // Get address
    let address = getSelectedAddress();

    // If using new address form and want to save it
    if (showNewAddressForm && saveAddress && !selectedAddressId) {
      const saved = await handleSaveNewAddress();
      if (saved) address = saved;
    }

    if (!address) {
      setError("Please select or enter a delivery address");
      return;
    }

    if (payment === "CASHFREE" && cashfreeEnabled && !cashfreeReady) {
      setError("Payment system loading. Please wait a moment.");
      return;
    }
    setError("");
    setPlacing(true);

    // Use appliedCoupon from subscription, fallback to ref, fallback to store
    const coupon = appliedCoupon || couponRef.current || useCart.getState().appliedCoupon;
    const couponCode = coupon?.code || null;
    const couponDiscount = coupon?.discount || 0;

    // Build request body
    const orderData = {
      address: { fullName: address.fullName, phone: address.phone, email: addressEmail, line1: address.line1, city: address.city, postalCode: address.postalCode },
      paymentMethod: payment,
      items: items.map(i => ({ slug: i.slug, size: i.selectedSize, qty: i.qty })),
      couponCode: couponCode,
      couponDiscount: couponDiscount,
    };

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

      // If Cashfree, open payment modal
      if (payment === "CASHFREE" && order.cashfreeOrderId) {
        openCashfree(order.cashfreeOrderId, order.id || order._id, order.totalAmount);
        return;
      }

      // COD or Cashfree not configured — order placed directly
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
      {cashfreeEnabled && (
        <Script
          src="https://sdk.cashfree.com/js/v3/cashfree.js"
          onLoad={() => setCashfreeReady(true)}
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><Truck size={20} className="text-brand-500" /><h2 className="text-xl font-bold text-brand-950">Delivery Address</h2></div>
                {savedAddresses.length > 0 && !showNewAddressForm && (
                  <button onClick={() => { setShowNewAddressForm(true); setSelectedAddressId(null); clearAddressForm(); }} className="flex items-center gap-1 text-sm font-semibold text-brand-500 hover:text-brand-700">
                    <Plus size={16} /> Add New
                  </button>
                )}
              </div>

              {loadingAddresses ? (
                <div className="mt-4 flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
                </div>
              ) : (
                <>
                  {/* Saved Addresses */}
                  {savedAddresses.length > 0 && !showNewAddressForm && (
                    <div className="mt-4 space-y-3">
                      {savedAddresses.map((addr) => (
                        <div
                          key={addr._id}
                          onClick={() => setSelectedAddressId(addr._id)}
                          className={`cursor-pointer rounded-xl border-2 p-4 transition ${selectedAddressId === addr._id ? "border-brand-500 bg-brand-50" : "border-brand-100 hover:border-brand-300"}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <MapPin size={20} className={selectedAddressId === addr._id ? "text-brand-500" : "text-brand-400"} />
                              <div>
                                <p className="font-semibold text-brand-900">{addr.fullName}</p>
                                <p className="text-sm text-brand-700">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                                <p className="text-sm text-brand-700">{addr.city}, {addr.state} - {addr.postalCode}</p>
                                <p className="text-sm text-brand-600">Phone: {addr.phone}</p>
                                {addr.isDefault && <span className="mt-1 inline-block rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">Default</span>}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={(e) => { e.stopPropagation(); handleEditAddress(addr); }} className="rounded-lg p-1.5 text-brand-400 hover:bg-brand-100 hover:text-brand-600">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr._id); }} className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* New Address Form */}
                  <AnimatePresence>
                    {showNewAddressForm && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <input value={fullName} onChange={e => setFullName(e.target.value)} className="rounded-xl border border-brand-200 bg-brand-50/50 px-4 py-3 text-brand-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" placeholder="Full Name *" />
                          <input value={phone} onChange={e => setPhone(e.target.value)} className="rounded-xl border border-brand-200 bg-brand-50/50 px-4 py-3 text-brand-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" placeholder="Phone Number *" />
                          <input value={addressEmail} onChange={e => setAddressEmail(e.target.value)} className="rounded-xl border border-brand-200 bg-brand-50/50 px-4 py-3 text-brand-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 md:col-span-2" placeholder="Email Address" />
                          <textarea value={line1} onChange={e => setLine1(e.target.value)} className="rounded-xl border border-brand-200 bg-brand-50/50 px-4 py-3 text-brand-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 md:col-span-2" rows={2} placeholder="House No, Street, Area *" />
                          <input value={line2} onChange={e => setLine2(e.target.value)} className="rounded-xl border border-brand-200 bg-brand-50/50 px-4 py-3 text-brand-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 md:col-span-2" placeholder="Landmark (optional)" />
                          <input value={city} onChange={e => setCity(e.target.value)} className="rounded-xl border border-brand-200 bg-brand-50/50 px-4 py-3 text-brand-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" placeholder="City *" />
                          <input value={postalCode} onChange={e => setPostalCode(e.target.value)} className="rounded-xl border border-brand-200 bg-brand-50/50 px-4 py-3 text-brand-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" placeholder="PIN Code *" />
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <label className="flex items-center gap-2 text-sm text-brand-700">
                            <input type="checkbox" checked={saveAddress} onChange={e => setSaveAddress(e.target.checked)} className="h-4 w-4 rounded border-brand-300 text-brand-500 focus:ring-brand-500" />
                            Save this address for future orders
                          </label>
                          {savedAddresses.length > 0 && (
                            <button onClick={() => { setShowNewAddressForm(false); setSelectedAddressId(savedAddresses[0]._id); clearAddressForm(); }} className="text-sm font-semibold text-brand-500 hover:text-brand-700">
                              Cancel
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-brand-950">Payment Method</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {cashfreeEnabled && (
                <button onClick={() => setPayment("CASHFREE")} className={`flex items-center gap-3 rounded-xl border-2 p-4 transition ${payment === "CASHFREE" ? "border-brand-500 bg-brand-50" : "border-brand-100 hover:border-brand-300"}`}>
                  <CreditCard size={24} className={payment === "CASHFREE" ? "text-brand-500" : "text-brand-400"} />
                  <div className="text-left"><p className="font-semibold text-brand-900">Pay Online</p><p className="text-xs text-brand-700">UPI, Cards, Net Banking</p></div>
                </button>
                )}
                <button onClick={() => setPayment("COD")} className={`flex items-center gap-3 rounded-xl border-2 p-4 transition ${payment === "COD" ? "border-brand-500 bg-brand-50" : "border-brand-100 hover:border-brand-300"}`}>
                  <Banknote size={24} className={payment === "COD" ? "text-brand-500" : "text-brand-400"} />
                  <div className="text-left"><p className="font-semibold text-brand-900">Cash on Delivery</p><p className="text-xs text-brand-700">Pay when you receive</p></div>
                </button>
              </div>
              <AnimatePresence>
                {payment === "CASHFREE" && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 overflow-hidden rounded-xl bg-brand-50 p-4">
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-green-600" />
                      <p className="text-sm text-brand-800">Secure payment powered by <strong>Cashfree</strong>. Your card details are never stored with us.</p>
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
                <p className="mt-3 text-xs text-brand-500">
                  By placing this order, you agree to our{" "}
                  <Link href="/terms-and-conditions" className="underline hover:text-brand-700">Terms & Conditions</Link>,{" "}
                  <Link href="/privacy-policy" className="underline hover:text-brand-700">Privacy Policy</Link>, and{" "}
                  <Link href="/refund-policy" className="underline hover:text-brand-700">Refund Policy</Link>.
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-brand-700">Your cart is empty. <Link href="/shop" className="text-brand-500 underline">Add items</Link> to proceed.</p>
            )}
            {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            <motion.button whileTap={{ scale: 0.97 }} onClick={handlePlaceOrder} disabled={items.length === 0 || placing} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-900 px-6 py-3.5 font-semibold text-white transition hover:bg-brand-950 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50">
              {placing ? "Processing..." : payment === "CASHFREE" ? "Pay Now" : "Place Order"} <ArrowRight size={18} />
            </motion.button>
          </motion.aside>
        </div>
      </div>
    </>
  );
}
