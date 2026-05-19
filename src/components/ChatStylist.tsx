"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, ShoppingBag } from "lucide-react";
import Link from "next/link";
import type { CatalogItem } from "@/lib/catalog";

interface Message {
  id: string;
  sender: "user" | "stylist";
  text: string;
  products?: CatalogItem[];
}

export default function ChatStylist() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "stylist",
      text: "Namaste! 🙏 I am Bhuvika's AI Fashion Stylist. I can recommend sarees, lehengas, and kids wear matching your style, occasion, or color choices. What are you looking for today?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [allProducts, setAllProducts] = useState<CatalogItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load products list on mount to map slugs to product details instantly
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://bhuvika-api.onrender.com";
        const res = await fetch(`${apiBase}/api/products`);
        if (res.ok) {
          const data = await res.json();
          // Map backend products schema to frontend CatalogItem schema
          const mapped = data.map((p: any) => ({
            name: p.name,
            slug: p.slug,
            price: p.price,
            oldPrice: p.oldPrice,
            image: p.images?.[0]?.imageUrl || p.image || "/images/placeholder.jpg",
            category: p.category,
            stock: p.stock,
            description: p.description,
          }));
          setAllProducts(mapped);
        }
      } catch (err) {
        console.error("Failed to load catalog for chatbot:", err);
      }
    };
    fetchProducts();
  }, []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsgText = inputText.trim();
    setInputText("");

    // Append User Message
    const userMsgId = Date.now().toString();
    setMessages((prev) => [...prev, { id: userMsgId, sender: "user", text: userMsgText }]);
    setIsTyping(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://bhuvika-api.onrender.com";
      const res = await fetch(`${apiBase}/api/products/chat-stylist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsgText }),
      });

      if (!res.ok) throw new Error("Chat request failed");

      const data = await res.json();
      
      // Match slugs to actual products loaded in memory
      const recommendedSlugs = data.recommendedSlugs || [];
      const recommendedProducts = allProducts.filter((p) =>
        recommendedSlugs.includes(p.slug)
      );

      // Append Stylist Response
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "stylist",
          text: data.text,
          products: recommendedProducts,
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "stylist",
          text: "I'm having a small connectivity issue matching our catalog right now, but please browse our latest arrivals in the shop section!",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 font-sans">
      <AnimatePresence>
        {/* Floating Bubble Button */}
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-amber-600 to-amber-800 text-white shadow-lg shadow-amber-800/30 border border-amber-500/20"
            aria-label="Open AI Stylist"
          >
            <Sparkles size={26} className="animate-pulse" />
          </motion.button>
        )}

        {/* Chat Drawer Window */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.85 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="flex h-[520px] w-[350px] flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white/95 shadow-2xl backdrop-blur-md sm:w-[380px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-brand-900 to-brand-950 px-5 py-4 text-white">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-white/10 p-1.5">
                  <Sparkles size={20} className="text-amber-300" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold tracking-wide">Bhuvika AI Stylist</h3>
                  <span className="text-[10px] text-amber-200">Online | Saree & Lehenga Expert</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-brand-900 text-white rounded-tr-none"
                        : "bg-brand-50 text-brand-900 border border-brand-100/50 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Recommended Shoppable Product Cards */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-3 w-full max-w-[90%] space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-brand-500">Suggested Outfit(s):</p>
                      {msg.products.map((prod) => (
                        <div
                          key={prod.slug}
                          className="flex items-center gap-3 rounded-2xl border border-brand-100 bg-white p-2.5 shadow-sm transition hover:shadow-md"
                        >
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="h-14 w-12 rounded-lg object-cover bg-brand-50"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="truncate text-xs font-bold text-brand-950">{prod.name}</h4>
                            <p className="text-[10px] text-brand-500 font-medium capitalize">{prod.category}</p>
                            <p className="mt-0.5 text-xs font-bold text-brand-900">
                              ₹{prod.price.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <Link
                            href={`/product/${prod.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-900 hover:bg-brand-900 hover:text-white transition"
                            title="View Product"
                          >
                            <ShoppingBag size={14} />
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1 bg-brand-50 rounded-2xl px-4 py-3 border border-brand-100/50 w-16 rounded-tl-none">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-600 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-600 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-600" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Footer */}
            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 border-t border-brand-100/60 bg-white/80 p-3"
            >
              <input
                type="text"
                placeholder="Ask for wedding wear, yellow sarees..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 rounded-full border border-brand-200 px-4 py-2.5 text-xs outline-none focus:border-brand-500 font-medium"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-900 text-white shadow-sm hover:bg-brand-950 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
