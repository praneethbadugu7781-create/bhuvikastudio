"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MessageSquare, Mail, Smartphone, ShieldCheck, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface PreferenceToggleProps {
  icon: any;
  title: string;
  description: string;
  active: boolean;
  onToggle: () => void;
  color?: string;
}

export default function NotificationsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [preferences, setPreferences] = useState({
    whatsapp: true,
    email: true,
    sms: false,
    promotions: true,
    orderUpdates: true,
  });

  if (loading) return null;
  if (!user) {
    router.push("/login");
    return null;
  }

  const toggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-2xl bg-gray-50 pb-20 md:py-8">
      <div className="bg-white px-5 py-6 shadow-sm flex items-center gap-4">
        <button onClick={() => router.back()} className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-900">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-brand-950">Notifications</h1>
      </div>

      <div className="mt-6 px-5 space-y-6">
        {/* Info Box */}
        <div className="rounded-2xl bg-brand-900 p-5 text-white shadow-lg">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="font-bold">WhatsApp Updates</h3>
              <p className="mt-1 text-sm text-brand-100 opacity-80 leading-relaxed">
                Receive real-time order tracking and premium collection alerts directly on your WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* Notification Channels */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 ml-1">Communication Channels</h2>
          
          <div className="divide-y divide-gray-50 rounded-2xl bg-white shadow-sm overflow-hidden">
            <PreferenceToggle 
              icon={MessageSquare} 
              title="WhatsApp" 
              description="Order status & tracking links" 
              active={preferences.whatsapp} 
              onToggle={() => toggle("whatsapp")} 
              color="text-green-500"
            />
            <PreferenceToggle 
              icon={Mail} 
              title="Email" 
              description="Invoices & detailed updates" 
              active={preferences.email} 
              onToggle={() => toggle("email")} 
              color="text-blue-500"
            />
            <PreferenceToggle 
              icon={Smartphone} 
              title="SMS" 
              description="Standard text alerts" 
              active={preferences.sms} 
              onToggle={() => toggle("sms")} 
              color="text-brand-600"
            />
          </div>
        </div>

        {/* Content Settings */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 ml-1">Activity Alerts</h2>
          
          <div className="divide-y divide-gray-50 rounded-2xl bg-white shadow-sm overflow-hidden">
            <PreferenceToggle 
              icon={Bell} 
              title="Order Updates" 
              description="Confirmation, Shipping & Delivery" 
              active={preferences.orderUpdates} 
              onToggle={() => toggle("orderUpdates")} 
            />
            <PreferenceToggle 
              icon={ShieldCheck} 
              title="Promotions & Offers" 
              description="Early access to sales & coupons" 
              active={preferences.promotions} 
              onToggle={() => toggle("promotions")} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PreferenceToggle({ icon: Icon, title, description, active, onToggle, color = "text-brand-500" }: PreferenceToggleProps) {
  return (
    <div className="flex items-center justify-between p-5 transition hover:bg-gray-50">
      <div className="flex items-center gap-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 ${color}`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="font-bold text-brand-950">{title}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <button 
        onClick={onToggle}
        className={`relative h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none ${active ? "bg-brand-900" : "bg-gray-200"}`}
      >
        <div className={`absolute top-1 left-1 h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${active ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}
