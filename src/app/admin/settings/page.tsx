"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Key, Eye, EyeOff, Loader2, CheckCircle2, 
  XCircle, ShieldAlert, ShieldCheck, Megaphone,
  Sparkles
} from "lucide-react";
import { useEffect } from "react";

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Promo Strip states
  const [promoText, setPromoText] = useState("");
  const [promoEnabled, setPromoEnabled] = useState(false);
  const [loadingPromo, setLoadingPromo] = useState(true);
  const [savingPromo, setSavingPromo] = useState(false);
  const [promoMsg, setPromoMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/settings/promo")
      .then((res) => res.json())
      .then((data) => {
        setPromoText(data.text || "");
        setPromoEnabled(data.enabled ?? false);
      })
      .catch((err) => console.error("Error loading promo strip setting", err))
      .finally(() => setLoadingPromo(false));
  }, []);

  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPromo(true);
    setPromoMsg(null);
    try {
      const res = await fetch("/api/settings/promo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: promoText, enabled: promoEnabled }),
      });
      if (res.ok) {
        setPromoMsg({ type: "success", text: "Announcement bar updated successfully!" });
      } else {
        setPromoMsg({ type: "error", text: "Failed to save announcement settings." });
      }
    } catch {
      setPromoMsg({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSavingPromo(false);
    }
  };

  // Validation states
  const isLengthValid = newPassword.length >= 12;
  const isMatch = newPassword === confirmPassword && confirmPassword !== "";

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!isLengthValid) {
      setErrorMsg("New password must be at least 12 characters.");
      return;
    }

    if (!isMatch) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to change password. Make sure current password is correct.");
      } else {
        setSuccessMsg("Password changed successfully! Keep your new credentials safe.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setErrorMsg("Network error. Please try again later.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-3xl text-brand-950">Settings</h1>
        <p className="mt-1 text-brand-700">Manage your administrative credentials and security options.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm shadow-brand-50"
      >
        <div className="flex items-center gap-3 border-b border-brand-50 pb-4 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Key size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-brand-950">Security & Credentials</h2>
            <p className="text-xs text-brand-600">Update your administrator login password.</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-5">
          {/* Current Password */}
          <div className="relative">
            <label className="text-sm font-semibold text-brand-800">Current Password</label>
            <div className="relative mt-1">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-brand-200 bg-brand-50/20 py-3 pl-4 pr-12 text-brand-950 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 placeholder-brand-300"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-600 transition"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <hr className="border-brand-50/70" />

          {/* New Password */}
          <div className="relative">
            <label className="text-sm font-semibold text-brand-800">New Password</label>
            <div className="relative mt-1">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-brand-200 bg-brand-50/20 py-3 pl-4 pr-12 text-brand-950 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 placeholder-brand-300"
                placeholder="Minimum 12 characters"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-600 transition"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="text-sm font-semibold text-brand-800">Confirm New Password</label>
            <div className="relative mt-1">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-brand-200 bg-brand-50/20 py-3 pl-4 pr-12 text-brand-950 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 placeholder-brand-300"
                placeholder="Repeat new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-600 transition"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Validation Checklist */}
          {newPassword && (
            <div className="rounded-xl bg-brand-50/30 border border-brand-100/50 p-4 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-800 flex items-center gap-1.5 mb-3">
                <ShieldAlert size={14} className="text-brand-500" /> Password Requirements
              </p>
              
              <div className="flex items-center gap-2 text-sm">
                {isLengthValid ? (
                  <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                ) : (
                  <XCircle size={16} className="text-red-500 shrink-0" />
                )}
                <span className={isLengthValid ? "text-green-700 font-medium" : "text-brand-700"}>
                  At least 12 characters long (current length: {newPassword.length})
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                {isMatch ? (
                  <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                ) : (
                  <XCircle size={16} className="text-red-500 shrink-0" />
                )}
                <span className={isMatch ? "text-green-700 font-medium" : "text-brand-700"}>
                  Passwords match exactly
                </span>
              </div>
            </div>
          )}

          {/* Action Messages */}
          {errorMsg && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2.5 rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-700">
              <ShieldAlert size={18} className="shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2.5 rounded-xl bg-green-50 border border-green-100 p-4 text-sm text-green-700">
              <ShieldCheck size={18} className="shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSaving || !isLengthValid || !isMatch}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-900 py-3.5 font-semibold text-white transition hover:bg-brand-950 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving Changes...
              </>
            ) : (
              "Save New Password"
            )}
          </button>
        </form>
      </motion.div>

      {/* Top Announcement Bar / Promo Strip settings */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm shadow-brand-50"
      >
        <div className="flex items-center gap-3 border-b border-brand-50 pb-4 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <Megaphone size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-brand-950">Top Announcement Bar</h2>
            <p className="text-xs text-brand-600">Configure the scrolling promo strip at the top of the store.</p>
          </div>
        </div>

        {loadingPromo ? (
          <div className="flex justify-center py-6">
            <Loader2 className="animate-spin text-brand-500" size={24} />
          </div>
        ) : (
          <form onSubmit={handleSavePromo} className="space-y-5">
            {/* Enabled Toggle */}
            <div className="flex items-center justify-between rounded-xl bg-brand-50/20 p-4 border border-brand-100/50">
              <div>
                <p className="text-sm font-semibold text-brand-950">Enable Announcement Bar</p>
                <p className="text-xs text-brand-600">Toggle whether to show the banner at the top of all pages.</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input 
                  type="checkbox" 
                  checked={promoEnabled} 
                  onChange={(e) => setPromoEnabled(e.target.checked)}
                  className="peer sr-only" 
                />
                <div className="peer h-6 w-11 rounded-full bg-brand-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-brand-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-900 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none" />
              </label>
            </div>

            {/* Announcement Text */}
            <div>
              <label className="text-sm font-semibold text-brand-800">Announcement Text</label>
              <textarea
                value={promoText}
                onChange={(e) => setPromoText(e.target.value)}
                required
                disabled={!promoEnabled}
                rows={3}
                className="mt-1 w-full rounded-xl border border-brand-200 bg-brand-50/20 px-4 py-3 text-sm text-brand-950 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 placeholder-brand-400 disabled:opacity-50"
                placeholder="e.g. Free Shipping on orders above ₹1999! | Use coupon FESTIVE10 for 10% off!"
              />
              <p className="mt-1 text-[10px] text-brand-500">
                Tip: You can use a vertical bar symbol <strong className="text-brand-700">|</strong> to separate multiple announcements that will scroll continuously.
              </p>
            </div>

            {/* Message Feedback */}
            {promoMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }} 
                className={`flex items-center gap-2.5 rounded-xl border p-4 text-sm ${
                  promoMsg.type === "success" 
                    ? "bg-green-50 border-green-100 text-green-700" 
                    : "bg-red-50 border-red-100 text-red-700"
                }`}
              >
                {promoMsg.type === "success" ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                <span>{promoMsg.text}</span>
              </motion.div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={savingPromo}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-900 py-3.5 font-semibold text-white transition hover:bg-brand-950 disabled:opacity-50"
            >
              {savingPromo ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving Settings...
                </>
              ) : (
                "Save Promo Settings"
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
