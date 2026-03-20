"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, Sparkles, ShieldCheck, ArrowLeft, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Script from "next/script";

type Step = "enter" | "otp";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void;
          renderButton: (element: HTMLElement, config: { theme: string; size: string; width: number; text: string }) => void;
        };
      };
    };
  }
}

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
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  const redirect = () => {
    const params = new URLSearchParams(window.location.search);
    router.push(params.get("redirect") || "/shop");
  };

  // Handle Google Sign-In callback
  const handleGoogleCallback = useCallback(async (response: { credential: string }) => {
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Google sign-in failed");
        return;
      }
      await refresh();
      redirect();
    } catch {
      setError("Google sign-in failed. Please try again.");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  // Initialize Google Sign-In
  useEffect(() => {
    if (googleLoaded && window.google && !user) {
      const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (googleClientId) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCallback,
        });
        const buttonDiv = document.getElementById("google-signin-button");
        if (buttonDiv) {
          window.google.accounts.id.renderButton(buttonDiv, {
            theme: "outline",
            size: "large",
            width: 320,
            text: "continue_with",
          });
        }
      }
    }
  }, [googleLoaded, user, handleGoogleCallback]);

  // Check if email exists when user finishes typing
  useEffect(() => {
    const checkEmail = async () => {
      if (!email.trim() || !email.includes("@")) {
        setIsNewUser(null);
        return;
      }

      setCheckingEmail(true);
      try {
        const res = await fetch("/api/auth/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        });
        const data = await res.json();
        setIsNewUser(!data.exists);
        if (data.exists && data.name) {
          setName(data.name);
        }
      } catch {
        // Ignore errors
      }
      setCheckingEmail(false);
    };

    const timer = setTimeout(checkEmail, 500);
    return () => clearTimeout(timer);
  }, [email]);

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

  const getButtonText = () => {
    if (sending) return "Sending OTP...";
    if (checkingEmail) return "Checking...";
    if (isNewUser === true) return "Sign Up";
    if (isNewUser === false) return "Sign In";
    return "Continue";
  };

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        onLoad={() => setGoogleLoaded(true)}
      />
      <div className="mx-auto flex w-full max-w-md flex-col px-5 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100">
              <ShieldCheck size={24} className="text-brand-600" />
            </div>
            <div>
              <h1 className="font-display text-3xl text-brand-950">
                {step === "otp" ? "Verify OTP" : isNewUser === true ? "Create Account" : isNewUser === false ? "Welcome Back" : "Login / Register"}
              </h1>
              <p className="text-sm text-brand-600">
                {isNewUser === false ? "Sign in to your account" : "Secure email OTP verification"}
              </p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === "enter" && (
            <motion.div key="enter" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mt-8 space-y-5">
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
                {isNewUser !== null && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1 text-xs text-brand-600">
                    {isNewUser ? "New user - we'll create your account" : "Welcome back! We found your account"}
                  </motion.p>
                )}
              </div>

              {isNewUser === true && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                  <label className="text-sm font-semibold text-brand-800">Full Name *</label>
                  <div className="relative mt-1">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400" />
                    <input
                      value={name} onChange={e => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-brand-200 bg-brand-50/50 py-3 pl-11 pr-4 text-brand-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </motion.p>
              )}

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSendOtp}
                disabled={sending || checkingEmail}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-900 py-3.5 font-semibold text-white transition hover:bg-brand-950 disabled:opacity-50"
              >
                {getButtonText()} <ArrowRight size={18} />
              </motion.button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-brand-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-brand-500">or</span>
                </div>
              </div>

              <div id="google-signin-button" className="flex justify-center" />

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
    </>
  );
}
