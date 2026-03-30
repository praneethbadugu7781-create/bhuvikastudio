"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

const LOGO_URL = "https://res.cloudinary.com/dfdin5phc/image/upload/v1774887280/Screenshot_2026-03-30_214006_qclwnc.png";

const footerLinks = [
  { label: "Shop All", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "Cart", href: "/cart" },
  { label: "Checkout", href: "/checkout" },
];

const categories = ["Western Wear", "Kids Wear", "Lehengas", "Fusion Wear", "Sarees", "Co-ords"];

export default function Footer() {
  return (
    <footer className="border-t border-brand-100 bg-brand-950 text-brand-100">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
        {/* Brand */}
        <div>
          <Link href="/">
            <img src={LOGO_URL} alt="Bhuvika Studio" className="h-16 w-auto brightness-0 invert" />
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-brand-300">
            Curated fashion for every celebration. Western Wear, Lehengas, Sarees, and more from Vijayawada.
          </p>
          <div className="mt-4 flex gap-3">
            <motion.a whileHover={{ scale: 1.15 }} href="#" className="rounded-full bg-brand-800 p-2 transition hover:bg-brand-700">
              <Instagram size={18} className="text-white" />
            </motion.a>
            <motion.a whileHover={{ scale: 1.15 }} href="#" className="rounded-full bg-brand-800 p-2 transition hover:bg-brand-700">
              <Facebook size={18} className="text-white" />
            </motion.a>
          </div>
        </div>
        {/* Quick Links */}
        <div>
          <h4 className="font-semibold uppercase tracking-wider text-brand-300">Quick Links</h4>
          <ul className="mt-3 space-y-2">
            {footerLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-brand-100 transition hover:text-white hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Categories */}
        <div>
          <h4 className="font-semibold uppercase tracking-wider text-brand-300">Categories</h4>
          <ul className="mt-3 space-y-2">
            {categories.map((c) => (
              <li key={c}>
                <Link href="/categories" className="text-sm text-brand-100 transition hover:text-white hover:underline">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Contact */}
        <div>
          <h4 className="font-semibold uppercase tracking-wider text-brand-300">Contact Us</h4>
          <ul className="mt-3 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-brand-500" />
              <span>Vijayawada, Andhra Pradesh</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0 text-brand-500" />
              <span>+91 93917 81748</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0 text-brand-500" />
              <span>owner@bhuvikastudio.com</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-800 px-5 py-5">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 text-center">
          <Link href="/admin" className="text-xs text-brand-600 transition hover:text-brand-400">
            Admin
          </Link>
          <p className="text-xs text-brand-400">
            &copy; 2026 Bhuvika Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
