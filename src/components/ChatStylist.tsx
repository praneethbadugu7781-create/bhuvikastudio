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
          const mapped = data.map((p: any) => {
            const firstVariant = p.variants?.[0];
            return {
              slug: p.slug,
              name: p.name,
              category: p.category,
              price: firstVariant?.salePrice ? Number(firstVariant.salePrice) : (firstVariant ? Number(firstVariant.price) : 0),
              oldPrice: firstVariant?.salePrice ? Number(firstVariant.price) : undefined,
              sizes: p.variants ? [...new Set(p.variants.map((v: any) => v.size))] : [],
              color: firstVariant?.color ?? "",
              image: p.images?.[0]?.imageUrl ?? "",
              images: p.images ? p.images.map((i: any) => i.imageUrl) : [],
              stock: p.stockStatus === "IN_STOCK" ? "In Stock" : "Out of Stock",
              featured: p.featured,
              description: p.description,
            };
          });
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
    
    // Gather all currently recommended product slugs in this session to exclude them from the next recommendations
    const excludeSlugs = messages
      .filter((m) => m.sender === "stylist" && m.products)
      .flatMap((m) => m.products!.map((p) => p.slug));

    // Gather chat history context
    const chatHistory = messages.map((m) => ({
      sender: m.sender,
      text: m.text,
    }));

    setMessages((prev) => [...prev, { id: userMsgId, sender: "user", text: userMsgText }]);
    setIsTyping(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://bhuvika-api.onrender.com";
      const res = await fetch(`${apiBase}/api/products/chat-stylist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsgText,
          excludeSlugs,
          history: chatHistory,
        }),
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
          <div className="relative group">
            {/* Outer premium gold/rose-gold pulsing aura */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-amber-400 via-brand-400 to-amber-600 opacity-60 blur-md transition duration-1000 group-hover:opacity-90 group-hover:duration-200 animate-pulse" />
            
            {/* Main high-level glassmorphic button */}
            <motion.button
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 45 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsOpen(true)}
              className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-brand-950 via-brand-900 to-brand-850 text-white shadow-xl shadow-brand-950/40 border border-amber-300/40 backdrop-blur-md transition-all duration-300"
              aria-label="Open AI Stylist"
            >
              {/* Internal glossy shine effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/25 via-transparent to-transparent pointer-events-none" />
              
              {/* Premium Sparkles icon with custom styling */}
              <Sparkles 
                size={24} 
                className="text-amber-300 filter drop-shadow-[0_0_8px_rgba(252,211,77,0.8)] animate-pulse" 
              />
              
              {/* Elegant dot indicator indicating AI is online and ready */}
              <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400 border border-brand-950"></span>
              </span>
            </motion.button>
          </div>
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
            <div className="flex items-center justify-between bg-gradient-to-r from-brand-950 via-brand-900 to-brand-950 px-5 py-4 text-white border-b border-brand-800/40">
              <div className="flex items-center gap-2.5">
                <div className="relative rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 p-2 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                  <Sparkles size={18} className="text-brand-950 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold tracking-wide text-brand-50">Bhuvika AI Stylist</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-medium text-amber-200/90">Personal Fashion Stylist</span>
                  </div>
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
