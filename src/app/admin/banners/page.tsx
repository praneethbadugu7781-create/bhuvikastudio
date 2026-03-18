"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Plus, X, Trash2, Edit2, Eye, EyeOff, Upload } from "lucide-react";

type Banner = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  mobileImageUrl: string | null;
  linkUrl: string;
  linkText: string;
  position: "HERO" | "PROMO" | "CATEGORY" | "FOOTER";
  displayOrder: number;
  isActive: boolean;
  backgroundColor: string;
  textColor: string;
};

type BannerForm = {
  title: string; subtitle: string; imageUrl: string; mobileImageUrl: string; linkUrl: string; linkText: string;
  position: "HERO" | "PROMO" | "CATEGORY" | "FOOTER"; displayOrder: number; isActive: boolean;
  backgroundColor: string; textColor: string;
};

const emptyForm: BannerForm = {
  title: "", subtitle: "", imageUrl: "", mobileImageUrl: "", linkUrl: "/shop", linkText: "Shop Now",
  position: "HERO", displayOrder: 0, isActive: true, backgroundColor: "#fce4ec", textColor: "#1a1a1a",
};

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const res = await fetch("/api/banners/all");
    if (res.ok) setBanners(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    setUploading(false);
    if (res.ok) {
      const data = await res.json();
      setForm(f => ({ ...f, imageUrl: data.url }));
    }
  };

  const save = async () => {
    setSaving(true);
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/banners/${editing}` : "/api/banners";
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
    if (!confirm("Delete this banner?")) return;
    await fetch(`/api/banners/${id}`, { method: "DELETE" });
    load();
  };

  const toggle = async (id: string) => {
    await fetch(`/api/banners/${id}/toggle`, { method: "PUT" });
    load();
  };

  const edit = (b: Banner) => {
    setForm({
      title: b.title, subtitle: b.subtitle, imageUrl: b.imageUrl, mobileImageUrl: b.mobileImageUrl || "",
      linkUrl: b.linkUrl, linkText: b.linkText, position: b.position, displayOrder: b.displayOrder,
      isActive: b.isActive, backgroundColor: b.backgroundColor, textColor: b.textColor,
    });
    setEditing(b.id);
    setShowForm(true);
  };

  const positions = ["HERO", "PROMO", "CATEGORY", "FOOTER"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-brand-950">Banners</h1>
          <p className="mt-1 text-brand-700">Manage homepage & promo banners</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(true); }} className="flex items-center gap-2 rounded-full bg-brand-900 px-5 py-2.5 font-semibold text-white hover:bg-brand-950">
          <Plus size={18} /> Add Banner
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-brand-700">Loading...</div>
      ) : banners.length === 0 ? (
        <div className="rounded-2xl border border-brand-100 bg-white py-16 text-center shadow-sm">
          <ImageIcon size={48} className="mx-auto text-brand-300" />
          <h3 className="mt-4 text-xl font-bold text-brand-950">No banners yet</h3>
          <p className="mt-2 text-brand-700">Add banners to showcase on your homepage</p>
        </div>
      ) : (
        <div className="space-y-4">
          {positions.map(pos => {
            const posBanners = banners.filter(b => b.position === pos);
            if (posBanners.length === 0) return null;
            return (
              <div key={pos}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-500">{pos} Banners</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {posBanners.map(b => (
                    <motion.div key={b.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl border overflow-hidden shadow-sm ${b.isActive ? "border-brand-100 bg-white" : "border-gray-200 bg-gray-50 opacity-60"}`}>
                      {b.imageUrl && (
                        <div className="aspect-[2/1] bg-brand-50">
                          <img src={b.imageUrl} alt={b.title} className="h-full w-full object-cover" />
                        </div>
                      )}
                      <div className="p-4">
                        <h4 className="font-semibold text-brand-900">{b.title}</h4>
                        {b.subtitle && <p className="text-sm text-brand-600">{b.subtitle}</p>}
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-brand-500">{b.linkUrl}</span>
                          <div className="flex gap-1">
                            <button onClick={() => toggle(b.id)} className={`p-2 rounded-lg ${b.isActive ? "text-green-500 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`}>
                              {b.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                            <button onClick={() => edit(b)} className="p-2 text-brand-500 hover:bg-brand-50 rounded-lg"><Edit2 size={16} /></button>
                            <button onClick={() => remove(b.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="fixed inset-0 z-50 bg-black/50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl max-h-[90vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl text-brand-950">{editing ? "Edit Banner" : "Add Banner"}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-brand-50 rounded-lg"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-brand-800">Banner Image</label>
                  <input type="file" ref={fileRef} accept="image/*" onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} className="hidden" />
                  {form.imageUrl ? (
                    <div className="mt-2 relative aspect-[2/1] rounded-xl overflow-hidden bg-brand-50">
                      <img src={form.imageUrl} alt="" className="h-full w-full object-cover" />
                      <button onClick={() => setForm(f => ({ ...f, imageUrl: "" }))} className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow"><X size={14} /></button>
                    </div>
                  ) : (
                    <button onClick={() => fileRef.current?.click()} disabled={uploading} className="mt-2 w-full rounded-xl border-2 border-dashed border-brand-200 p-8 text-center hover:border-brand-400">
                      <Upload className="mx-auto text-brand-400" size={24} />
                      <p className="mt-2 text-sm text-brand-600">{uploading ? "Uploading..." : "Click to upload"}</p>
                    </button>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-brand-800">Title</label>
                    <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Summer Sale" className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-3 outline-none focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-brand-800">Position</label>
                    <select value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value as Banner["position"] }))} className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-3 outline-none">
                      <option value="HERO">Hero (Main)</option>
                      <option value="PROMO">Promo</option>
                      <option value="CATEGORY">Category</option>
                      <option value="FOOTER">Footer</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-brand-800">Subtitle</label>
                  <input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="Up to 50% off on selected items" className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-3 outline-none focus:border-brand-500" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-brand-800">Link URL</label>
                    <input value={form.linkUrl} onChange={e => setForm(f => ({ ...f, linkUrl: e.target.value }))} placeholder="/shop" className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-3 outline-none focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-brand-800">Button Text</label>
                    <input value={form.linkText} onChange={e => setForm(f => ({ ...f, linkText: e.target.value }))} placeholder="Shop Now" className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-3 outline-none focus:border-brand-500" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={form.isActive} id="active" onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="h-5 w-5 rounded border-brand-300 text-brand-600" />
                  <label htmlFor="active" className="text-sm font-semibold text-brand-800">Active</label>
                </div>
                <button onClick={save} disabled={saving || !form.title} className="w-full rounded-full bg-brand-900 py-3 font-semibold text-white hover:bg-brand-950 disabled:opacity-50">
                  {saving ? "Saving..." : editing ? "Update Banner" : "Create Banner"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
