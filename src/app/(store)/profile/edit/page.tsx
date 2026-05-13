"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, Smartphone, Save, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function EditProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  if (loading) return null;
  if (!user) {
    router.push("/login");
    return null;
  }

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-2xl bg-white px-5 py-8 md:py-12">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-900">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-brand-950">Edit Profile</h1>
      </div>

      <div className="mt-10 space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-100 text-brand-600">
              <User size={48} />
            </div>
            <button className="absolute bottom-0 right-0 rounded-full bg-brand-900 p-2 text-white shadow-lg">
              <Smartphone size={14} />
            </button>
          </div>
          <p className="mt-3 text-sm font-bold text-brand-500">Update Profile Picture</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-brand-900">Full Name</label>
            <div className="flex items-center gap-3 rounded-2xl border-2 border-gray-100 bg-gray-50 px-4 py-3.5 focus-within:border-brand-500 transition">
              <User size={18} className="text-gray-400" />
              <input type="text" defaultValue={user.name} className="w-full bg-transparent font-medium outline-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-brand-900">Email Address</label>
            <div className="flex items-center gap-3 rounded-2xl border-2 border-gray-100 bg-gray-50 px-4 py-3.5 focus-within:border-brand-500 transition">
              <Mail size={18} className="text-gray-400" />
              <input type="email" defaultValue={user.email} className="w-full bg-transparent font-medium outline-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-brand-900">Phone Number</label>
            <div className="flex items-center gap-3 rounded-2xl border-2 border-gray-100 bg-gray-50 px-4 py-3.5 transition">
              <Smartphone size={18} className="text-gray-400" />
              <input type="tel" defaultValue={user.mobile || "Add number in Account page"} disabled className="w-full bg-transparent font-medium outline-none opacity-60" />
            </div>
            <p className="text-[10px] text-gray-400">Mobile number can only be changed with OTP from Account dashboard.</p>
          </div>
        </div>

        <div className="pt-6">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-900 py-4 font-bold text-white shadow-lg transition hover:bg-brand-950 disabled:opacity-70"
          >
            {isSaving ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : success ? (
              <>
                <CheckCircle size={20} /> Saved Successfully
              </>
            ) : (
              <>
                <Save size={20} /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
