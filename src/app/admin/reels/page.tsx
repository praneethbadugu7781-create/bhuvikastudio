"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Plus, X, Trash2, Edit2, Check, ExternalLink, Play, Eye } from "lucide-react";

type Reel = {
  _id: string;
  title: string;
  videoUrl: string;
  coverImageUrl: string;
  productLink: string;
  displayOrder: number;
  isActive: boolean;
};

type ReelForm = {
  title: string;
  videoUrl: string;
  coverImageUrl: string;
  productLink: string;
  displayOrder: number;
  isActive: boolean;
};

const emptyForm: ReelForm = {
  title: "",
  videoUrl: "",
  coverImageUrl: "",
  productLink: "",
  displayOrder: 0,
  isActive: true,
};

export default function ReelsPage() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const load = async () => {
    try {
      const res = await fetch("/api/reels/all");
      if (res.ok) setReels(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const getAuthToken = async () => {
    try {
      const res = await fetch("/api/auth/token");
      if (res.ok) {
        const data = await res.json();
        return data.token;
      }
    } catch (e) {
      console.error("Failed to get auth token", e);
    }
    return null;
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append("video", file);

      const token = await getAuthToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://bhuvikastudiobackend.onrender.com";
      const res = await fetch(`${apiBase}/api/upload/video`, {
        method: "POST",
        body: formData,
        headers,
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Video upload failed");
        return;
      }

      const data = await res.json();
      setForm((f) => ({ ...f, videoUrl: data.url }));
    } catch (err) {
      console.error(err);
      alert("Failed to upload video");
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const token = await getAuthToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://bhuvikastudiobackend.onrender.com";
      const res = await fetch(`${apiBase}/api/upload`, {
        method: "POST",
        body: formData,
        headers,
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Image upload failed");
        return;
      }

      const data = await res.json();
      setForm((f) => ({ ...f, coverImageUrl: data.url }));
    } catch (err) {
      console.error(err);
      alert("Failed to upload cover image");
    } finally {
      setUploadingCover(false);
    }
  };

  const save = async () => {
    setSaving(true);
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/reels/${editing}` : "/api/reels";
    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      await load();
      setShowForm(false);
      setForm(emptyForm);
      setEditing(null);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Reel?")) return;
    try {
      await fetch(`/api/reels/${id}`, { method: "DELETE" });
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const edit = (r: Reel) => {
    setForm({
      title: r.title || "",
      videoUrl: r.videoUrl || "",
      coverImageUrl: r.coverImageUrl || "",
      productLink: r.productLink || "",
      displayOrder: r.displayOrder || 0,
      isActive: r.isActive ?? true,
    });
    setEditing(r._id);
    setShowForm(true);
  };

  const toggleActive = async (id: string) => {
    try {
      await fetch(`/api/reels/${id}/toggle`, { method: "PUT" });
      load();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-brand-950">Customer Reels</h1>
          <p className="mt-1 text-brand-700">Upload & manage interactive video reels for the homepage</p>
        </div>
        <button
          onClick={() => {
            setForm(emptyForm);
            setEditing(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-full bg-brand-900 px-5 py-2.5 font-semibold text-white hover:bg-brand-950"
        >
          <Plus size={18} /> Add Reel
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-brand-700">Loading...</div>
      ) : reels.length === 0 ? (
        <div className="rounded-2xl border border-brand-100 bg-white py-16 text-center shadow-sm">
          <Video size={48} className="mx-auto text-brand-300 animate-pulse" />
          <h3 className="mt-4 text-xl font-bold text-brand-950">No Reels yet</h3>
          <p className="mt-2 text-brand-700">Create your first video reel to engage customers</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {reels.map((r) => (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative overflow-hidden rounded-2xl border p-4 shadow-sm flex flex-col justify-between ${
                r.isActive ? "border-brand-100 bg-white" : "border-gray-200 bg-gray-50 opacity-60"
              }`}
            >
              <div>
                {/* Reel Card Preview */}
                <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-black border border-brand-100/50">
                  {r.coverImageUrl ? (
                    <img src={r.coverImageUrl} alt={r.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center text-gray-400 bg-brand-950/20">
                      <Video size={36} className="mb-2" />
                      <span className="text-xs">No Cover Image</span>
                    </div>
                  )}

                  {/* Play preview trigger overlay */}
                  <button
                    onClick={() => setPreviewVideo(r.videoUrl)}
                    className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-70 transition-all hover:bg-black/50 hover:opacity-100"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-brand-950 shadow-md">
                      <Play size={22} className="ml-1 fill-brand-950" />
                    </div>
                  </button>

                  {/* Badges */}
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-brand-900/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                      Reel
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="font-bold text-sm line-clamp-1 drop-shadow-md">{r.title || "Untitled Showcase"}</p>
                    {r.productLink && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] bg-white/20 hover:bg-white/30 backdrop-blur-sm px-2 py-0.5 rounded-full text-white font-medium">
                        Linked Product <ExternalLink size={10} />
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-brand-50">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={r.isActive}
                    id={`active-${r._id}`}
                    onChange={() => toggleActive(r._id)}
                    className="h-4.5 w-4.5 rounded border-brand-300 text-brand-900 cursor-pointer"
                  />
                  <label htmlFor={`active-${r._id}`} className="text-xs font-semibold text-brand-800 cursor-pointer">
                    Active
                  </label>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => edit(r)}
                    className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => remove(r._id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="fixed inset-0 z-50 bg-black/50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl text-brand-950">{editing ? "Edit Reel" : "Add New Reel"}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-brand-50 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-brand-800">Reel Title</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Red Designer Silk Saree Draping"
                    className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-3 outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-brand-800">
                    Upload Video Reel <span className="text-red-500">*</span>
                  </label>
                  {form.videoUrl ? (
                    <div className="mt-1 flex items-center justify-between rounded-xl border border-brand-200 bg-brand-50/50 p-3">
                      <div className="flex items-center gap-2 text-brand-900 min-w-0">
                        <Video size={18} className="shrink-0 text-brand-500" />
                        <span className="text-xs truncate font-medium">{form.videoUrl}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, videoUrl: "" }))}
                        className="text-xs font-bold text-red-500 hover:text-red-700 underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="mt-1">
                      <input
                        type="file"
                        accept="video/*"
                        id="video-file"
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="video-file"
                        className="flex flex-col items-center justify-center border-2 border-dashed border-brand-200 rounded-xl py-6 hover:border-brand-500 cursor-pointer bg-brand-50/30 transition text-brand-500 hover:text-brand-900"
                      >
                        {uploadingVideo ? (
                          <>
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
                            <span className="mt-2 text-xs font-semibold">Uploading video...</span>
                          </>
                        ) : (
                          <>
                            <Video size={24} className="mb-1" />
                            <span className="text-xs font-bold">Select Video File</span>
                            <span className="text-[10px] text-brand-400 mt-1">MP4 or WebM (Max 50MB)</span>
                          </>
                        )}
                      </label>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-brand-800">Cover Image / Thumbnail</label>
                  {form.coverImageUrl ? (
                    <div className="mt-1 flex items-center justify-between rounded-xl border border-brand-200 bg-brand-50/50 p-3">
                      <div className="flex items-center gap-2 text-brand-900 min-w-0">
                        <img src={form.coverImageUrl} alt="Preview" className="h-10 w-8 rounded object-cover border shrink-0" />
                        <span className="text-xs truncate font-medium">{form.coverImageUrl}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, coverImageUrl: "" }))}
                        className="text-xs font-bold text-red-500 hover:text-red-700 underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="mt-1">
                      <input
                        type="file"
                        accept="image/*"
                        id="image-file"
                        onChange={handleCoverImageUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="image-file"
                        className="flex flex-col items-center justify-center border-2 border-dashed border-brand-200 rounded-xl py-5 hover:border-brand-500 cursor-pointer bg-brand-50/30 transition text-brand-500 hover:text-brand-900"
                      >
                        {uploadingCover ? (
                          <>
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
                            <span className="mt-2 text-xs font-semibold">Uploading cover image...</span>
                          </>
                        ) : (
                          <>
                            <Plus size={20} className="mb-1" />
                            <span className="text-xs font-bold">Select Cover Image</span>
                          </>
                        )}
                      </label>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-brand-800">Target Product Page Link (Optional)</label>
                  <input
                    value={form.productLink}
                    onChange={(e) => setForm((f) => ({ ...f, productLink: e.target.value }))}
                    placeholder="e.g. /product/pure-georgette-lehenga"
                    className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-3 outline-none focus:border-brand-500"
                  />
                  <p className="mt-1 text-[11px] text-brand-500">Links this reel directly to a product page so customers can click to buy.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-brand-800">Display Order</label>
                    <input
                      type="number"
                      value={form.displayOrder}
                      onChange={(e) => setForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))}
                      className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-3 outline-none focus:border-brand-500"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      id="form-active"
                      onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                      className="h-5 w-5 rounded border-brand-300 text-brand-900"
                    />
                    <label htmlFor="form-active" className="text-sm font-semibold text-brand-800">
                      Active (Visible to users)
                    </label>
                  </div>
                </div>

                <button
                  onClick={save}
                  disabled={saving || !form.videoUrl}
                  className="w-full rounded-full bg-brand-900 py-3.5 mt-2 font-semibold text-white hover:bg-brand-950 disabled:opacity-50 transition"
                >
                  {saving ? "Saving..." : editing ? "Update Reel" : "Create Reel"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Video Preview Modal */}
      <AnimatePresence>
        {previewVideo && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewVideo(null)}
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            >
              <div
                className="relative aspect-[9/16] w-full max-w-[340px] bg-black rounded-2xl overflow-hidden border border-brand-850/40"
                onClick={(e) => e.stopPropagation()}
              >
                <video src={previewVideo} controls autoPlay className="h-full w-full object-cover" />
                <button
                  onClick={() => setPreviewVideo(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
