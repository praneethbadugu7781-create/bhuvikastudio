"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, Check, X, Trash2, Clock, CheckCircle, XCircle, Send } from "lucide-react";

type Review = {
  id: string;
  rating: number;
  title: string;
  comment: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  isVerifiedPurchase: boolean;
  createdAt: string;
  adminReply: string | null;
  productId: { name: string; slug: string };
  userId: { name: string; email: string };
};

type Stats = { PENDING: number; APPROVED: number; REJECTED: number };

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stats>({ PENDING: 0, APPROVED: 0, REJECTED: 0 });
  const [filter, setFilter] = useState<string>("PENDING");
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const load = async () => {
    const [reviewsRes, statsRes] = await Promise.all([
      fetch(`/api/reviews?status=${filter}`),
      fetch("/api/reviews/stats"),
    ]);
    if (reviewsRes.ok) setReviews(await reviewsRes.json());
    if (statsRes.ok) setStats(await statsRes.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/reviews/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const sendReply = async (id: string) => {
    if (!replyText.trim()) return;
    setSending(true);
    await fetch(`/api/reviews/${id}/reply`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: replyText }),
    });
    setReplyTo(null);
    setReplyText("");
    setSending(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    load();
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={14} className={i <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-brand-950">Reviews</h1>
        <p className="mt-1 text-brand-700">Manage customer reviews</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <button onClick={() => setFilter("PENDING")} className={`rounded-2xl border p-5 text-left transition ${filter === "PENDING" ? "border-yellow-300 bg-yellow-50" : "border-brand-100 bg-white hover:border-brand-200"}`}>
          <Clock className={filter === "PENDING" ? "text-yellow-600" : "text-brand-400"} size={24} />
          <p className="mt-2 text-2xl font-bold text-brand-950">{stats.PENDING}</p>
          <p className="text-sm text-brand-600">Pending</p>
        </button>
        <button onClick={() => setFilter("APPROVED")} className={`rounded-2xl border p-5 text-left transition ${filter === "APPROVED" ? "border-green-300 bg-green-50" : "border-brand-100 bg-white hover:border-brand-200"}`}>
          <CheckCircle className={filter === "APPROVED" ? "text-green-600" : "text-brand-400"} size={24} />
          <p className="mt-2 text-2xl font-bold text-brand-950">{stats.APPROVED}</p>
          <p className="text-sm text-brand-600">Approved</p>
        </button>
        <button onClick={() => setFilter("REJECTED")} className={`rounded-2xl border p-5 text-left transition ${filter === "REJECTED" ? "border-red-300 bg-red-50" : "border-brand-100 bg-white hover:border-brand-200"}`}>
          <XCircle className={filter === "REJECTED" ? "text-red-600" : "text-brand-400"} size={24} />
          <p className="mt-2 text-2xl font-bold text-brand-950">{stats.REJECTED}</p>
          <p className="text-sm text-brand-600">Rejected</p>
        </button>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="py-12 text-center text-brand-700">Loading...</div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border border-brand-100 bg-white py-16 text-center shadow-sm">
          <MessageSquare size={48} className="mx-auto text-brand-300" />
          <h3 className="mt-4 text-xl font-bold text-brand-950">No {filter.toLowerCase()} reviews</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(r => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    {renderStars(r.rating)}
                    {r.isVerifiedPurchase && <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Verified</span>}
                  </div>
                  {r.title && <h4 className="mt-2 font-semibold text-brand-900">{r.title}</h4>}
                  {r.comment && <p className="mt-1 text-sm text-brand-700">{r.comment}</p>}
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-brand-500">
                    <span className="rounded-full bg-brand-50 px-2 py-1">{r.productId?.name || "Unknown Product"}</span>
                    <span>by {r.userId?.name || r.userId?.email}</span>
                    <span>• {new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  {r.adminReply && (
                    <div className="mt-3 rounded-xl bg-brand-50 p-3">
                      <p className="text-xs font-semibold text-brand-600">Your Reply:</p>
                      <p className="mt-1 text-sm text-brand-800">{r.adminReply}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {filter === "PENDING" && (
                    <>
                      <button onClick={() => updateStatus(r.id, "APPROVED")} className="flex items-center gap-1 rounded-lg bg-green-100 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-200">
                        <Check size={16} /> Approve
                      </button>
                      <button onClick={() => updateStatus(r.id, "REJECTED")} className="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-200">
                        <X size={16} /> Reject
                      </button>
                    </>
                  )}
                  <button onClick={() => setReplyTo(replyTo === r.id ? null : r.id)} className="p-2 text-brand-500 hover:bg-brand-50 rounded-lg">
                    <MessageSquare size={18} />
                  </button>
                  <button onClick={() => remove(r.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Reply Form */}
              <AnimatePresence>
                {replyTo === r.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 overflow-hidden">
                    <div className="flex gap-2">
                      <input
                        value={replyText} onChange={e => setReplyText(e.target.value)}
                        placeholder="Write your reply..." className="flex-1 rounded-xl border border-brand-200 px-4 py-2.5 outline-none focus:border-brand-500"
                      />
                      <button onClick={() => sendReply(r.id)} disabled={sending || !replyText.trim()} className="flex items-center gap-2 rounded-xl bg-brand-900 px-4 py-2.5 font-semibold text-white hover:bg-brand-950 disabled:opacity-50">
                        <Send size={16} /> {sending ? "..." : "Send"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
