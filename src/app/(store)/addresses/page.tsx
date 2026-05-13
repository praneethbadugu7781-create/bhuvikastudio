"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Plus, Trash2, Home, Briefcase, Map, Edit2, Loader2, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

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

export default function AddressesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/addresses");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/addresses", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: "DELETE", credentials: "include" });
      if (res.ok) {
        setAddresses(prev => prev.filter(a => a._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete address:", err);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch(`/api/addresses/${id}/default`, { method: "POST", credentials: "include" });
      if (res.ok) {
        setAddresses(prev => prev.map(a => ({ ...a, isDefault: a._id === id })));
      }
    } catch (err) {
      console.error("Failed to set default address:", err);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-brand-500" />
        <p className="text-sm font-bold text-brand-800">Loading your addresses...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto min-h-screen w-full max-w-2xl bg-gray-50 pb-20 md:py-8">
      <div className="bg-white px-5 py-6 shadow-sm flex items-center gap-4">
        <button onClick={() => router.back()} className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-900">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-brand-950">Saved Addresses</h1>
      </div>

      <div className="mt-6 px-5 space-y-4">
        <button 
          onClick={() => router.push("/checkout?addAddress=true")}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-200 bg-white p-5 font-bold text-brand-900 transition hover:bg-brand-50"
        >
          <Plus size={20} /> Add New Address
        </button>

        <AnimatePresence mode="popLayout">
          {addresses.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-100 p-4 text-gray-400">
                <MapPin size={40} />
              </div>
              <p className="mt-4 font-bold text-gray-500">No saved addresses found</p>
            </motion.div>
          ) : (
            addresses.map((addr) => (
              <motion.div 
                key={addr._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      <Home size={18} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Address</span>
                    {addr.isDefault && (
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600">DEFAULT</span>
                    )}
                  </div>
                  <button 
                    onClick={() => handleDelete(addr._id)}
                    disabled={isDeleting === addr._id}
                    className="text-gray-300 transition hover:text-red-500 disabled:opacity-50"
                  >
                    {isDeleting === addr._id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  </button>
                </div>
                
                <div className="mt-4">
                  <p className="font-bold text-brand-950">{addr.fullName}</p>
                  <p className="mt-1 text-sm font-medium text-gray-500">{addr.phone}</p>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {addr.line1}, {addr.line2 && `${addr.line2}, `}<br />
                    {addr.city}, {addr.state} - {addr.postalCode}
                  </p>
                </div>

                <div className="mt-4 flex gap-4 border-t border-gray-50 pt-4">
                  <button 
                    onClick={() => router.push(`/checkout?editAddress=${addr._id}`)}
                    className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  {!addr.isDefault && (
                    <button 
                      onClick={() => handleSetDefault(addr._id)}
                      className="text-xs font-bold text-gray-400 hover:text-brand-600 hover:underline"
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
