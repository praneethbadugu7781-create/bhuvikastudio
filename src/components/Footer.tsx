"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

const footerLinks = [
  { label: "Shop All", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "Cart", href: "/cart" },
  { label: "Contact Us", href: "/contact" },
];

const policyLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Refund & Cancellation", href: "/refund-policy" },
  { label: "Shipping Policy", href: "/shipping-policy" },
];

export default function Footer() {
  return (
    <footer className="border-t border-brand-100 bg-brand-950 text-brand-100">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
        {/* Brand */}
        <div>
          <Link href="/" className="inline-block">
            <div className="flex items-center gap-3">
              {/* BS Monogram */}
              <div className="relative flex h-14 w-14 items-center justify-center rounded-lg bg-brand-800">
                <span className="font-script text-2xl text-white">B</span>
                <span className="absolute right-1.5 top-1/2 -translate-y-1/2 font-script text-xl text-brand-300">S</span>
              </div>
              {/* Text */}
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">Bhuvika</span>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">Studio</span>
              </div>
            </div>
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
        {/* Policies */}
        <div>
          <h4 className="font-semibold uppercase tracking-wider text-brand-300">Policies</h4>
          <ul className="mt-3 space-y-2">
            {policyLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-brand-100 transition hover:text-white hover:underline">
                  {l.label}
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
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center">
          <p className="text-xs text-brand-300">
            We accept secure online payments via UPI, debit/credit cards and net banking.
          </p>
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
