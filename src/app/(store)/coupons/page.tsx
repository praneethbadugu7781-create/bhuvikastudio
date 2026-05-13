import { Metadata } from "next";
import { Ticket, Copy, CheckCircle2 } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "My Coupons | Bhuvika Studio",
  description: "View and manage your discount coupons and offers at Bhuvika Studio.",
};

const coupons = [
  { 
    code: "WELCOME10", 
    title: "10% Off on First Order", 
    desc: "Valid on orders above ₹1,999 for first-time users.",
    expiry: "Valid till 31 Dec 2026",
    color: "bg-blue-500"
  },
  { 
    code: "FESTIVE20", 
    title: "Flat ₹500 Off", 
    desc: "Valid on all Designer Sarees and Lehengas.",
    expiry: "Valid till 30 Jun 2026",
    color: "bg-purple-500"
  },
  { 
    code: "BHUVIKA5", 
    title: "Extra 5% Off on UPI", 
    desc: "Additional discount when paying via UPI or Net Banking.",
    expiry: "Limited Period Offer",
    color: "bg-green-500"
  },
];

export default function CouponsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-10">
      <AnimatedSection>
        <h1 className="font-display text-4xl text-brand-950">My Coupons</h1>
        <p className="mt-2 text-brand-700">Save more on your favorite styles</p>
      </AnimatedSection>

      <div className="mt-10 space-y-6">
        {coupons.map((coupon, i) => (
          <div key={i} className="group relative flex flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-sm transition hover:shadow-md md:flex-row">
            {/* Left side: Code and Icon */}
            <div className={`flex flex-col items-center justify-center p-6 text-white md:w-48 ${coupon.color}`}>
              <Ticket size={40} className="mb-2 opacity-50" />
              <span className="text-xl font-black tracking-widest">{coupon.code}</span>
              <button className="mt-4 flex items-center gap-1 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold backdrop-blur-md transition hover:bg-white/40">
                <Copy size={12} /> COPY CODE
              </button>
            </div>
            
            {/* Right side: Details */}
            <div className="flex-1 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-brand-950">{coupon.title}</h3>
                  <p className="mt-1 text-sm text-brand-600 leading-relaxed">{coupon.desc}</p>
                </div>
                <CheckCircle2 size={24} className="text-brand-200" />
              </div>
              
              <div className="mt-6 flex items-center justify-between border-t border-brand-50 pt-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">{coupon.expiry}</span>
                <button className="text-sm font-bold text-brand-900 transition hover:text-brand-600">VIEW T&C</button>
              </div>
            </div>
            
            {/* Decorative cutouts for ticket look */}
            <div className="absolute -left-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 rounded-full bg-brand-50 md:block" />
            <div className="absolute left-[180px] -top-3 hidden h-6 w-6 rounded-full bg-brand-50 md:block" />
            <div className="absolute left-[180px] -bottom-3 hidden h-6 w-6 rounded-full bg-brand-50 md:block" />
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-brand-50 p-6 text-center">
        <p className="text-sm text-brand-600">Have a physical gift card?</p>
        <button className="mt-2 font-bold text-brand-900 hover:underline">Redeem it here</button>
      </div>
    </div>
  );
}
