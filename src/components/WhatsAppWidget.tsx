"use client";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function WhatsAppWidget() {
  return (
    <motion.a
      href="https://wa.me/919391781748?text=Hi%20Bhuvika%20Studio%21%20I%20have%20a%20query."
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
    </motion.a>
  );
}
