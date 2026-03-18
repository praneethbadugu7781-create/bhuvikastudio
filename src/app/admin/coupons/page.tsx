"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, Plus, X, Trash2, Edit2, Check, Copy } from "lucide-react";

type Coupon = {
  id: string;
  code: string;
  type: "PERCENT" | "FLAT";
  value: number;
  minCartValue: number;
  maxDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  description: string;
};

const emptyForm = {
  code: "", type: "PERCENT" as const, value: 10, minCartValue: 0, maxDiscount: null as number | null,
  usageLimit: null as number | null, validUntil: "", description: "", isActive: true,
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch("/api/coupons");
    if (res.ok) setCoupons(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/coupons/${editing}` : "/api/coupons";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    await load();
    setShowForm(false);
    setForm(emptyForm);
    setEditing(null);
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    await fetch(`/api/coupons/${id}`, { method: "DELETE" });
    load();
  };

  const edit = (c: Coupon) => {
    setForm({
      code: c.code, type: c.type, value: c.value, minCartValue: c.minCartValue,
      maxDiscount: c.maxDiscount, usageLimit: c.usageLimit,
      validUntil: c.validUntil.split("T")[0], description: c.description, isActive: c.isActive,
    });
    setEditing(c.id);
    setShowForm(true);
  };

  const copy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-brand-950">Coupons</h1>
          <p className="mt-1 text-brand-700">Create & manage discount codes</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(true); }} className="flex items-center gap-2 rounded-full bg-brand-900 px-5 py-2.5 font-semibold text-white hover:bg-brand-950">
          <Plus size={18} /> New Coupon
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-brand-700">Loading...</div>
      ) : coupons.length === 0 ? (
        <div className="rounded-2xl border border-brand-100 bg-white py-16 text-center shadow-sm">
          <Ticket size={48} className="mx-auto text-brand-300" />
          <h3 className="mt-4 text-xl font-bold text-brand-950">No coupons yet</h3>
          <p className="mt-2 text-brand-700">Create your first discount code</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map(c => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl border p-5 shadow-sm ${c.isActive ? "border-brand-100 bg-white" : "border-gray-200 bg-gray-50 opacity-60"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <code className="rounded-lg bg-brand-100 px-3 py-1.5 text-lg font-bold text-brand-900">{c.code}</code>
                  <button onClick={() => copy(c.code)} className="p-1.5 text-brand-500 hover:text-brand-700">
                    {copied === c.code ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => edit(c)} className="p-2 text-brand-500 hover:bg-brand-50 rounded-lg"><Edit2 size={16} /></button>
                  <button onClick={() => remove(c.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-brand-950">
                  {c.type === "PERCENT" ? `${c.value}% OFF` : `₹${c.value} OFF`}
                </p>
                {c.description && <p className="mt-1 text-sm text-brand-600">{c.description}</p>}
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {c.minCartValue > 0 && <span className="rounded-full bg-brand-50 px-2 py-1 text-brand-700">Min ₹{c.minCartValue}</span>}
                {c.maxDiscount && <span className="rounded-full bg-brand-50 px-2 py-1 text-brand-700">Max ₹{c.maxDiscount}</span>}
                {c.usageLimit && <span className="rounded-full bg-brand-50 px-2 py-1 text-brand-700">{c.usedCount}/{c.usageLimit} used</span>}
              </div>
              <p className="mt-3 text-xs text-brand-500">
                Valid until {new Date(c.validUntil).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="fixed inset-0 z-50 bg-black/50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl text-brand-950">{editing ? "Edit Coupon" : "New Coupon"}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-brand-50 rounded-lg"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-brand-800">Code</label>
                    <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="FLAT100" className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-3 uppercase outline-none focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-brand-800">Type</label>
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as "PERCENT" | "FLAT" }))} className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-3 outline-none">
                      <option value="PERCENT">Percentage</option>
                      <option value="FLAT">Flat Amount</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-brand-800">{form.type === "PERCENT" ? "Discount %" : "Discount ₹"}</label>
                    <input type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: Number(e.target.value) }))} className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-3 outline-none focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-brand-800">Min Cart Value (₹)</label>
                    <input type="number" value={form.minCartValue} onChange={e => setForm(f => ({ ...f, minCartValue: Number(e.target.value) }))} className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-3 outline-none focus:border-brand-500" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {form.type === "PERCENT" && (
                    <div>
                      <label className="text-sm font-semibold text-brand-800">Max Discount (₹)</label>
                      <input type="number" value={form.maxDiscount || ""} onChange={e => setForm(f => ({ ...f, maxDiscount: e.target.value ? Number(e.target.value) : null }))} placeholder="Optional" className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-3 outline-none focus:border-brand-500" />
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-semibold text-brand-800">Valid Until</label>
                    <input type="date" value={form.validUntil} onChange={e => setForm(f => ({ ...f, validUntil: e.target.value }))} className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-3 outline-none focus:border-brand-500" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-brand-800">Description (optional)</label>
                  <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="New user discount" className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-3 outline-none focus:border-brand-500" />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={form.isActive} id="active" onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="h-5 w-5 rounded border-brand-300 text-brand-600" />
                  <label htmlFor="active" className="text-sm font-semibold text-brand-800">Active</label>
                </div>
                <button onClick={save} disabled={saving || !form.code || !form.validUntil} className="w-full rounded-full bg-brand-900 py-3 font-semibold text-white hover:bg-brand-950 disabled:opacity-50">
                  {saving ? "Saving..." : editing ? "Update Coupon" : "Create Coupon"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
