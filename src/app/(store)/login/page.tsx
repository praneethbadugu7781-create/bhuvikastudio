"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, Sparkles, ShieldCheck, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

type Step = "enter" | "otp";

export default function LoginPage() {
  const { user, refresh } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<Step>("enter");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const redirect = () => {
    const params = new URLSearchParams(window.location.search);
    router.push(params.get("redirect") || "/shop");
  };

  if (user) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center px-5 py-24 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <Sparkles size={36} className="text-green-500" />
        </motion.div>
        <h1 className="mt-6 font-display text-3xl text-brand-950">Welcome, {user.name || "there"}!</h1>
        <p className="mt-2 text-brand-700">You are logged in as {user.email}</p>
        <Link href="/shop" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-900 px-8 py-3 font-semibold text-white hover:bg-brand-950">
          Continue Shopping <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  const handleSendOtp = async () => {
    setError("");
    if (!email.trim()) { setError("Please enter your email"); return; }

    setSending(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), method: "email" }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to send OTP"); setSending(false); return; }
      setStep("otp");
    } catch {
      setError("Network error. Please try again.");
    }
    setSending(false);
  };

  const handleVerifyOtp = async () => {
    setError("");
    if (!otp.trim() || otp.trim().length < 6) { setError("Please enter the 6-digit OTP"); return; }

    setVerifying(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim(), method: "email", name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Verification failed"); setVerifying(false); return; }
      await refresh();
      redirect();
    } catch {
      setError("Network error. Please try again.");
    }
    setVerifying(false);
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-5 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100">
            <ShieldCheck size={24} className="text-brand-600" />
          </div>
          <div>
            <h1 className="font-display text-3xl text-brand-950">
              {step === "otp" ? "Verify OTP" : "Login / Register"}
            </h1>
            <p className="text-sm text-brand-600">Secure email OTP verification</p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {step === "enter" && (
          <motion.div key="enter" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-semibold text-brand-800">Full Name (optional)</label>
              <input
                value={name} onChange={e => setName(e.target.value)}
                placeholder="Your name"
                className="mt-1 w-full rounded-xl border border-brand-200 bg-brand-50/50 px-4 py-3 text-brand-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-brand-800">Email Address *</label>
              <div className="relative mt-1">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400" />
                <input
                  value={email} onChange={e => setEmail(e.target.value)}
                  type="email" required placeholder="you@example.com"
                  className="w-full rounded-xl border border-brand-200 bg-brand-50/50 py-3 pl-11 pr-4 text-brand-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </motion.p>
            )}

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSendOtp}
              disabled={sending}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-900 py-3.5 font-semibold text-white transition hover:bg-brand-950 disabled:opacity-50"
            >
              {sending ? "Sending OTP..." : "Send OTP"} <ArrowRight size={18} />
            </motion.button>

            <p className="text-center text-xs text-brand-500">
              We&apos;ll send a 6-digit verification code to your email.
            </p>
          </motion.div>
        )}

        {step === "otp" && (
          <motion.div key="otp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mt-8 space-y-5">
            <div className="rounded-xl bg-brand-50 px-4 py-3">
              <p className="text-sm text-brand-700">
                OTP sent to <strong className="text-brand-900">{email}</strong>. Check your inbox (and spam folder).
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-brand-800">Enter 6-digit OTP</label>
              <input
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                autoFocus
                className="mt-1 w-full rounded-xl border border-brand-200 bg-brand-50/50 px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] text-brand-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </motion.p>
            )}

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleVerifyOtp}
              disabled={verifying || otp.length < 6}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-900 py-3.5 font-semibold text-white transition hover:bg-brand-950 disabled:opacity-50"
            >
              {verifying ? "Verifying..." : "Verify & Continue"} <ShieldCheck size={18} />
            </motion.button>

            <div className="flex items-center justify-between">
              <button
                onClick={() => { setStep("enter"); setOtp(""); setError(""); }}
                className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-800"
              >
                <ArrowLeft size={14} /> Change email
              </button>
              <button
                onClick={handleSendOtp}
                disabled={sending}
                className="text-sm font-semibold text-brand-500 hover:text-brand-700 disabled:opacity-50"
              >
                {sending ? "Sending..." : "Resend OTP"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
