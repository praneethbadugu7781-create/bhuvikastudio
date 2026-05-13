"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Plus, Trash2, Home, Briefcase, Map } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AddressesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "Home",
      icon: Home,
      name: "Badugu Praneeth",
      address: "High School Rd, Patamata",
      city: "Vijayawada",
      state: "Andhra Pradesh",
      zip: "520010",
      isDefault: true,
    },
    {
      id: 2,
      type: "Office",
      icon: Briefcase,
      name: "Bhuvika Studio",
      address: "Beside Union Bank, MG Road",
      city: "Vijayawada",
      state: "Andhra Pradesh",
      zip: "520010",
      isDefault: false,
    },
  ]);

  if (loading) return null;
  if (!user) {
    router.push("/login");
    return null;
  }

  const removeAddress = (id: number) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-2xl bg-gray-50 pb-20 md:py-8">
      <div className="bg-white px-5 py-6 shadow-sm flex items-center gap-4">
        <button onClick={() => router.back()} className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-900">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-brand-950">Saved Addresses</h1>
      </div>

      <div className="mt-6 px-5 space-y-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-200 bg-white p-5 font-bold text-brand-900 transition hover:bg-brand-50">
          <Plus size={20} /> Add New Address
        </button>

        {addresses.map((addr) => (
          <motion.div 
            key={addr.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <addr.icon size={18} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-brand-500">{addr.type}</span>
                {addr.isDefault && (
                  <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600">DEFAULT</span>
                )}
              </div>
              <button 
                onClick={() => removeAddress(addr.id)}
                className="text-gray-300 transition hover:text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="mt-4">
              <p className="font-bold text-brand-950">{addr.name}</p>
              <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                {addr.address},<br />
                {addr.city}, {addr.state} - {addr.zip}
              </p>
            </div>

            <div className="mt-4 flex gap-3 border-t border-gray-50 pt-4">
              <button className="text-xs font-bold text-brand-600 hover:underline">Edit</button>
              <button className="text-xs font-bold text-brand-600 hover:underline">Set as Default</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
