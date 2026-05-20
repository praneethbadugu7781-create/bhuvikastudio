import { Metadata } from "next";
import Link from "next/link";
import { 
  Search, 
  Package, 
  RotateCcw, 
  CreditCard, 
  User, 
  ChevronRight, 
  Phone, 
  Mail, 
  MessageCircle 
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "Help Center | Bhuvika Studio",
  description: "Get help with your orders, returns, and payments at Bhuvika Studio Help Center.",
};

const categories = [
  { icon: Package, title: "Orders & Shipping", desc: "Track, change, or cancel orders", href: "/orders" },
  { icon: RotateCcw, title: "Returns & Refunds", desc: "Policy and status of your returns", href: "/refund-policy" },
  { icon: CreditCard, title: "Payments & Coupons", desc: "Refunds, wallet, and offers", href: "/coupons" },
  { icon: User, title: "Account & Security", desc: "Manage profile and saved addresses", href: "/account" },
];

const faqs = [
  { q: "How do I track my order?", a: "You can track your order in the 'Orders' section of your account or by visiting our tracking page with your order ID." },
  { q: "What is the return policy?", a: "We offer a 7-day return policy for unused items in original packaging. Please note that Bhuvika Studio does NOT provide or arrange return pickups. Customers must ship the items back using their own courier and bear all return shipping costs." },
  { q: "How do I use a coupon code?", a: "You can apply your coupon code at the checkout page before making the payment." },
  { q: "Can I change my delivery address?", a: "Addresses can be changed before the order is shipped. Once shipped, we cannot change the destination." },
];

export default function HelpCenterPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-10">
      <AnimatedSection>
        <div className="text-center">
          <h1 className="font-display text-4xl text-brand-950 md:text-5xl">How can we help?</h1>
          <p className="mt-4 text-brand-700">Search for help or browse categories below</p>
          
          <div className="relative mx-auto mt-8 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400" size={20} />
            <input 
              type="text" 
              placeholder="Describe your issue..." 
              className="w-full rounded-2xl border border-brand-100 bg-white py-4 pl-12 pr-4 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>
      </AnimatedSection>

      {/* Categories */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {categories.map((cat, i) => (
          <Link 
            key={i} 
            href={cat.href} 
            className="group flex items-center gap-4 rounded-2xl border border-brand-100 bg-white p-5 transition hover:border-brand-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500 transition group-hover:bg-brand-900 group-hover:text-white">
              <cat.icon size={24} />
            </div>
            <div>
              <h3 className="font-bold text-brand-950">{cat.title}</h3>
              <p className="text-sm text-brand-600">{cat.desc}</p>
            </div>
            <ChevronRight className="ml-auto text-brand-300" size={20} />
          </Link>
        ))}
      </div>

      {/* FAQs */}
      <section className="mt-16">
        <h2 className="font-display text-3xl text-brand-950">Frequently Asked Questions</h2>
        <div className="mt-6 divide-y divide-brand-100 rounded-2xl border border-brand-100 bg-white overflow-hidden">
          {faqs.map((faq, i) => (
            <div key={i} className="p-6">
              <h3 className="font-bold text-brand-900">{faq.q}</h3>
              <p className="mt-2 text-sm text-brand-700 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Support */}
      <section className="mt-16 rounded-3xl bg-brand-950 p-8 text-center text-white md:p-12">
        <h2 className="font-display text-3xl">Still need help?</h2>
        <p className="mt-4 text-brand-200">Our support team is available Mon-Sat, 10 AM - 7 PM</p>
        
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a 
            href="https://wa.me/919618111520" 
            className="flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-bold text-white transition hover:scale-105"
          >
            <MessageCircle size={20} /> WhatsApp Us
          </a>
          <a 
            href="tel:+919618111520" 
            className="flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-brand-950 transition hover:bg-brand-50 hover:scale-105"
          >
            <Phone size={20} /> Call Support
          </a>
          <a 
            href="mailto:bhuvikastudio@gmail.com" 
            className="flex items-center gap-2 rounded-full border border-brand-700 px-6 py-3 font-bold text-brand-100 transition hover:bg-brand-800"
          >
            <Mail size={20} /> Email Us
          </a>
        </div>
      </section>
    </div>
  );
}
