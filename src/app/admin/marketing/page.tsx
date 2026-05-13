"use client";
import { useState, useEffect } from "react";
import { 
  Megaphone, 
  Send, 
  MessageSquare, 
  Mail, 
  CheckCircle, 
  Loader2, 
  AlertCircle,
} from "lucide-react";

export default function MarketingPage() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [channel, setChannel] = useState<"whatsapp" | "email">("whatsapp");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<"all" | "active" | "vip">("all");
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    fetch("/api/stats")
      .then(res => res.json())
      .then(data => setCustomerCount(data.userCount || 0))
      .catch(() => {});
  }, []);

  const handleSend = async () => {
    if (!message) return alert("Please enter a message!");
    if (channel === "email" && !subject) return alert("Please enter a subject!");
    
    setSending(true);
    try {
      const res = await fetch("/api/admin/marketing/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, subject, message, target }),
      });

      const data = await res.json();

      if (res.ok) {
        setSent(true);
        setTimeout(() => setSent(false), 5000);
        setSubject("");
        setMessage("");
      } else {
        alert(data.error || "Failed to send broadcast");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-brand-950">Marketing Hub</h1>
          <p className="mt-1 text-brand-600">Broadcast offers and announcements to your customers</p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-2xl bg-white px-6 py-3 shadow-sm border border-brand-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Reach</p>
            <p className="text-2xl font-bold text-brand-950">{customerCount.toLocaleString()} Customers</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Compose Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl bg-white p-8 shadow-sm border border-brand-100">
            <h2 className="text-xl font-bold text-brand-950 flex items-center gap-2">
              <Megaphone size={22} className="text-brand-600" />
              Compose Broadcast
            </h2>

            <div className="mt-8 space-y-6">
              {/* Channel Selection */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setChannel("whatsapp")}
                  className={`flex flex-col items-center gap-3 rounded-2xl p-4 border-2 transition ${channel === "whatsapp" ? "border-brand-900 bg-brand-50" : "border-gray-100 hover:border-brand-200"}`}
                >
                  <div className={`p-3 rounded-xl ${channel === "whatsapp" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                    <MessageSquare size={24} />
                  </div>
                  <span className={`font-bold ${channel === "whatsapp" ? "text-brand-950" : "text-gray-400"}`}>WhatsApp</span>
                </button>
                <button 
                  onClick={() => setChannel("email")}
                  className={`flex flex-col items-center gap-3 rounded-2xl p-4 border-2 transition ${channel === "email" ? "border-brand-900 bg-brand-50" : "border-gray-100 hover:border-brand-200"}`}
                >
                  <div className={`p-3 rounded-xl ${channel === "email" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                    <Mail size={24} />
                  </div>
                  <span className={`font-bold ${channel === "email" ? "text-brand-950" : "text-gray-400"}`}>Email Blast</span>
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {channel === "email" && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-brand-900 ml-1">Email Subject</label>
                    <input 
                      type="text" 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. 50% OFF Festive Sale is LIVE! 🎊" 
                      className="w-full rounded-2xl border-2 border-gray-50 bg-gray-50/50 px-4 py-3.5 font-medium outline-none focus:border-brand-500 transition"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-brand-900 ml-1">Message Content</label>
                  <textarea 
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={channel === "whatsapp" ? "Type your WhatsApp message here..." : "Type your email content here..."}
                    className="w-full rounded-2xl border-2 border-gray-50 bg-gray-50/50 px-4 py-4 font-medium outline-none focus:border-brand-500 transition resize-none"
                  />
                  <p className="text-[10px] text-gray-400 px-1">Tip: Use emojis to make your broadcast more engaging! 💃✨</p>
                </div>
              </div>

              {/* Target Audience */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-brand-950 ml-1 font-display uppercase tracking-widest text-[10px]">Target Audience</label>
                <div className="flex flex-wrap gap-2">
                  {["all", "active", "vip"].map((t) => (
                    <button 
                      key={t}
                      onClick={() => setTarget(t as "all" | "active" | "vip")}
                      className={`rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-widest transition ${target === t ? "bg-brand-900 text-white" : "bg-brand-50 text-brand-600 hover:bg-brand-100"}`}
                    >
                      {t === "all" ? "All Customers" : t === "active" ? "Recent Shoppers" : "VIP Members"}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleSend}
                disabled={sending}
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-brand-900 py-5 font-bold text-white shadow-xl transition hover:bg-brand-950 disabled:opacity-70"
              >
                {sending ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : sent ? (
                  <CheckCircle size={24} className="text-green-400" />
                ) : (
                  <Send size={20} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                )}
                {sending ? "Processing Broadcast..." : sent ? "Broadcast Sent!" : `Send via ${channel === "whatsapp" ? "WhatsApp" : "Email"}`}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-brand-950 p-6 text-white shadow-lg">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <AlertCircle size={20} className="text-brand-400" />
              Pro Tips
            </h3>
            <ul className="mt-4 space-y-4 text-sm text-brand-200">
              <li className="flex gap-2">
                <div className="h-1.5 w-1.5 mt-1.5 rounded-full bg-brand-500 shrink-0" />
                WhatsApp messages have a 98% open rate compared to 20% for Email.
              </li>
              <li className="flex gap-2">
                <div className="h-1.5 w-1.5 mt-1.5 rounded-full bg-brand-500 shrink-0" />
                Best time to send broadcasts is Tuesday mornings at 10 AM.
              </li>
              <li className="flex gap-2">
                <div className="h-1.5 w-1.5 mt-1.5 rounded-full bg-brand-500 shrink-0" />
                Include your store location link to drive foot traffic.
              </li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm border border-brand-100">
            <h3 className="font-bold text-brand-950 mb-4 font-display uppercase tracking-widest text-xs">Recent History</h3>
            <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <div className="p-3 rounded-full bg-white text-gray-300 shadow-sm">
                <Megaphone size={20} />
              </div>
              <p className="mt-3 text-xs font-bold text-gray-400">No broadcasts sent yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
