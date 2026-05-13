"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  MapPin, 
  Package, 
  ChevronRight, 
  LogOut, 
  Heart, 
  Ticket, 
  Headset, 
  ShieldCheck, 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function AccountPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/account");
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto min-h-screen w-full max-w-4xl bg-gray-50 pb-20 md:py-8">
      {/* Top Profile Card */}
      <div className="bg-white px-5 py-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-brand-950">{user.name || "Customer"}</h1>
            <p className="mt-1 text-sm text-brand-600">{user.email}</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600">
            <User size={32} />
          </div>
        </div>
      </div>

      {/* Main Grid Buttons */}
      <div className="mt-4 grid grid-cols-2 gap-4 px-5">
        <Link href="/orders" className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Package size={20} />
          </div>
          <span className="font-bold text-gray-800">Orders</span>
        </Link>
        <Link href="/wishlist" className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <Heart size={20} />
          </div>
          <span className="font-bold text-gray-800">Wishlist</span>
        </Link>
        <Link href="/coupons" className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Ticket size={20} />
          </div>
          <span className="font-bold text-gray-800">Coupons</span>
        </Link>
        <Link href="/help-center" className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <Headset size={20} />
          </div>
          <span className="font-bold text-gray-800">Help Center</span>
        </Link>
      </div>

      {/* Track My Order Section */}
      <div className="mt-8 px-5">
        <div className="rounded-2xl bg-brand-900 p-6 text-white shadow-xl">
          <h3 className="text-lg font-bold">Track My Order</h3>
          <p className="mt-1 text-sm text-brand-100 opacity-80">Enter your Order ID to check status</p>
          <div className="mt-4 flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. #ORD-12345" 
              className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm font-medium text-white placeholder-brand-300 outline-none ring-1 ring-white/20 focus:ring-white/50"
            />
            <button className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-brand-900 transition hover:bg-brand-50">
              Track
            </button>
          </div>
        </div>
      </div>

      {/* Account Settings Section */}
      <div className="mt-8 px-5">
        <h2 className="text-lg font-bold text-gray-900">Account Settings</h2>
        <div className="mt-4 divide-y divide-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden">
          <Link href="/profile/edit" className="flex items-center justify-between p-4 transition hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <User size={20} className="text-brand-500" />
              <span className="font-medium text-gray-700">Edit Profile</span>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </Link>
          <Link href="/addresses" className="flex items-center justify-between p-4 transition hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-brand-500" />
              <span className="font-medium text-gray-700">Saved Addresses</span>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </Link>
        </div>
      </div>

      {/* Support Section */}
      <div className="mt-8 px-5">
        <h2 className="text-lg font-bold text-gray-900">Support & Legal</h2>
        <div className="mt-4 divide-y divide-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden">
          <Link href="/help-center" className="flex items-center justify-between p-4 transition hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <Headset size={20} className="text-brand-500" />
              <span className="font-medium text-gray-700">Help Center</span>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </Link>
          <Link href="/privacy-policy" className="flex items-center justify-between p-4 transition hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-brand-500" />
              <span className="font-medium text-gray-700">Privacy Policy</span>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </Link>
        </div>
      </div>

      {/* Logout */}
      <div className="mt-10 px-5">
        <button 
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-white py-4 font-bold text-red-600 shadow-sm transition hover:bg-red-50"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
}
