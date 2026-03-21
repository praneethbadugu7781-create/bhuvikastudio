"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit2, Trash2, X, Save, ImageIcon, Upload, Loader2, Palette } from "lucide-react";

type Variant = { sku: string; size: string; color: string; price: string; salePrice?: string; stockQuantity: number };
type ColorOption = { colorName: string; colorCode: string; images: string[] };
type ApiColorOption = { colorName: string; colorCode: string; images: { imageUrl: string }[] };
type Product = {
  id: string; slug: string; name: string; description: string; category: string;
  featured: boolean; isNewArrival: boolean; isBestSeller: boolean; stockStatus: string;
  variants: Variant[]; images: { imageUrl: string }[]; colorOptions?: ApiColorOption[];
};

const emptyVariant: Variant = { sku: "", size: "", color: "", price: "", stockQuantity: 0 };
const emptyColor: ColorOption = { colorName: "", colorCode: "#000000", images: [] };
const cats = ["Western Wear", "Kids Wear", "Lehengas", "Fusion Wear", "Sarees", "Co-ords"];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [delId, setDelId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState(cats[0]);
  const [feat, setFeat] = useState(false);
  const [newArr, setNewArr] = useState(false);
  const [best, setBest] = useState(false);
  const [stock, setStock] = useState("IN_STOCK");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [vars, setVars] = useState<Variant[]>([{ ...emptyVariant }]);
  const [colorOptions, setColorOptions] = useState<ColorOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [activeColorIdx, setActiveColorIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorFileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/products");
    setProducts(await r.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const reset = () => {
    setName(""); setDesc(""); setCat(cats[0]); setFeat(false); setNewArr(false);
    setBest(false); setStock("IN_STOCK"); setImageUrls([]); setVars([{ ...emptyVariant }]);
    setColorOptions([]); setActiveColorIdx(null); setEditing(null);
  };

  const openAdd = () => { reset(); setShowModal(true); };
  const openEdit = (p: Product) => {
    setEditing(p); setName(p.name); setDesc(p.description); setCat(p.category);
    setFeat(p.featured); setNewArr(p.isNewArrival); setBest(p.isBestSeller);
    setStock(p.stockStatus); setImageUrls(p.images.map(i => i.imageUrl));
    setVars(p.variants.length ? p.variants.map(v => ({ sku: v.sku, size: v.size, color: v.color, price: String(v.price), salePrice: v.salePrice ? String(v.salePrice) : "", stockQuantity: v.stockQuantity })) : [{ ...emptyVariant }]);
    setColorOptions(p.colorOptions?.map(c => ({
      colorName: c.colorName,
      colorCode: c.colorCode,
      images: c.images?.map((img: any) => typeof img === 'string' ? img : img.imageUrl) || []
    })) || []);
    setActiveColorIdx(null);
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }

      const res = await fetch("/api/upload/multiple", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Upload failed");
        setUploading(false);
        return;
      }
      const data = await res.json();
      setImageUrls(prev => [...prev, ...data.urls]);
    } catch {
      alert("Image upload failed. Please try again.");
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleColorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, colorIdx: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }

      const res = await fetch("/api/upload/multiple", { method: "POST", body: formData });
      if (!res.ok) {
        setUploading(false);
        return;
      }
      const data = await res.json();
      setColorOptions(prev => prev.map((c, i) => i === colorIdx ? { ...c, images: [...c.images, ...data.urls] } : c));
    } catch {
      alert("Image upload failed.");
    }
    setUploading(false);
    if (colorFileInputRef.current) colorFileInputRef.current.value = "";
  };

  const removeImage = (idx: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== idx));
  };

  const removeColorImage = (colorIdx: number, imgIdx: number) => {
    setColorOptions(prev => prev.map((c, i) => i === colorIdx ? { ...c, images: c.images.filter((_, j) => j !== imgIdx) } : c));
  };

  const addColor = () => {
    setColorOptions(prev => [...prev, { ...emptyColor }]);
    setActiveColorIdx(colorOptions.length);
  };

  const updateColor = (idx: number, field: keyof ColorOption, value: string) => {
    setColorOptions(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };

  const removeColor = (idx: number) => {
    setColorOptions(prev => prev.filter((_, i) => i !== idx));
    if (activeColorIdx === idx) setActiveColorIdx(null);
  };

  const save = async () => {
    if (!name.trim()) return;
    setSaving(true);
    const slug = editing?.slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const good = vars.filter(v => v.size && v.price);
    const body = {
      name, slug, description: desc, category: cat, featured: feat, isNewArrival: newArr, isBestSeller: best, stockStatus: stock,
      variants: good.map(v => ({ ...v, sku: v.sku || `${slug}-${v.size}-${Date.now()}`, stockQuantity: Number(v.stockQuantity) })),
      images: imageUrls,
      colorOptions: colorOptions.filter(c => c.colorName.trim()).map(c => ({ colorName: c.colorName, colorCode: c.colorCode, images: c.images }))
    };
    console.log('=== SAVE DEBUG ===');
    console.log('colorOptions state:', colorOptions);
    console.log('colorOptions in body:', body.colorOptions);
    console.log('Full body:', JSON.stringify(body, null, 2));
    let response;
    if (editing) {
      response = await fetch(`/api/products/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      response = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    const result = await response.json();
    console.log('Response:', result);
    console.log('=== END SAVE DEBUG ===');
    setSaving(false); setShowModal(false); reset(); load();
  };

  const del = async (id: string) => { setDelId(id); await fetch(`/api/products/${id}`, { method: "DELETE" }); setDelId(null); load(); };

  const upVar = (i: number, f: keyof Variant, v: string | number) => { const u = [...vars]; u[i] = { ...u[i], [f]: v }; setVars(u); };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="font-display text-3xl text-brand-950">Products</h1><p className="mt-1 text-brand-700">{products.length} products</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 rounded-full bg-brand-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-950"><Plus size={18} /> Add Product</button>
      </div>
      <div className="relative"><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full rounded-xl border border-brand-200 bg-white py-3 pl-11 pr-4 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
      </div>
      {loading ? <div className="py-12 text-center text-brand-700">Loading...</div> : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm">
          <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-brand-100 text-left text-xs font-semibold uppercase tracking-wider text-brand-500">
            <th className="px-6 py-4">Product</th><th className="px-6 py-4">Category</th><th className="px-6 py-4">Price</th><th className="px-6 py-4">Colors</th><th className="px-6 py-4">Sizes</th><th className="px-6 py-4 text-right">Actions</th>
          </tr></thead><tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-b border-brand-50 hover:bg-brand-50/50">
                <td className="px-6 py-4"><div className="flex items-center gap-3">
                  {p.images[0] ? <img src={p.images[0].imageUrl} alt="" className="h-12 w-12 rounded-xl object-cover" /> : <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50"><ImageIcon size={20} className="text-brand-300" /></div>}
                  <div><p className="font-semibold text-brand-900">{p.name}</p><p className="text-xs text-brand-500">{p.slug}</p></div>
                </div></td>
                <td className="px-6 py-4"><span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800">{p.category}</span></td>
                <td className="px-6 py-4 font-semibold text-brand-900">{p.variants[0] ? `₹${Number(p.variants[0].price).toLocaleString("en-IN")}` : "—"}</td>
                <td className="px-6 py-4">
                  {p.colorOptions && p.colorOptions.length > 0 ? (
                    <div className="flex gap-1">
                      {p.colorOptions.slice(0, 4).map((c, i) => (
                        <div key={i} className="h-5 w-5 rounded-full border border-brand-200" style={{ backgroundColor: c.colorCode }} title={c.colorName} />
                      ))}
                      {p.colorOptions.length > 4 && <span className="text-xs text-brand-500">+{p.colorOptions.length - 4}</span>}
                    </div>
                  ) : <span className="text-brand-400">—</span>}
                </td>
                <td className="px-6 py-4 text-sm text-brand-700">{[...new Set(p.variants.map(v => v.size))].join(", ") || "—"}</td>
                <td className="px-6 py-4"><div className="flex justify-end gap-1">
                  <button onClick={() => openEdit(p)} className="rounded-lg p-2 text-brand-400 hover:bg-blue-50 hover:text-blue-600"><Edit2 size={16} /></button>
                  <button onClick={() => del(p.id)} disabled={delId === p.id} className="rounded-lg p-2 text-brand-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"><Trash2 size={16} /></button>
                </div></td>
              </tr>
            ))}
          </tbody></table></div>
          {filtered.length === 0 && <div className="py-12 text-center text-brand-700">No products found.</div>}
        </motion.div>
      )}

      <AnimatePresence>
        {showModal && (<>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 z-50 bg-black/50" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-x-4 top-[5%] z-50 mx-auto max-h-[90vh] max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between"><h2 className="font-display text-2xl text-brand-950">{editing ? "Edit Product" : "Add Product"}</h2><button onClick={() => setShowModal(false)} className="rounded-lg p-2 hover:bg-brand-50"><X size={20} /></button></div>
            <div className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div><label className="text-sm font-semibold text-brand-800">Name *</label><input value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-2.5 outline-none focus:border-brand-500" placeholder="Product name" /></div>
                <div><label className="text-sm font-semibold text-brand-800">Category</label><select value={cat} onChange={e => setCat(e.target.value)} className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-2.5 outline-none">{cats.map(c => <option key={c}>{c}</option>)}</select></div>
              </div>
              <div><label className="text-sm font-semibold text-brand-800">Description</label><textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-2.5 outline-none focus:border-brand-500" /></div>

              {/* Default Images */}
              <div>
                <label className="text-sm font-semibold text-brand-800">Default Images</label>
                <div className="mt-2 flex flex-wrap gap-3">
                  {imageUrls.map((url, idx) => (
                    <div key={idx} className="group relative">
                      <img src={url} alt={`Product ${idx + 1}`} className="h-20 w-20 rounded-xl object-cover border border-brand-200" />
                      <button onClick={() => removeImage(idx)} className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition group-hover:opacity-100">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex h-20 w-20 flex-col items-center justify-center rounded-xl border-2 border-dashed border-brand-300 text-brand-400 transition hover:border-brand-500 hover:text-brand-600 disabled:opacity-50"
                  >
                    {uploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                    <span className="mt-1 text-[10px] font-semibold">{uploading ? "..." : "Add"}</span>
                  </button>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </div>

              {/* Color Options */}
              <div className="rounded-xl border-2 border-dashed border-purple-200 bg-purple-50/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette size={18} className="text-purple-600" />
                    <label className="text-sm font-semibold text-purple-900">Color Options</label>
                  </div>
                  <button onClick={addColor} className="flex items-center gap-1 rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white hover:bg-purple-700">
                    <Plus size={14} /> Add Color
                  </button>
                </div>

                {colorOptions.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {colorOptions.map((color, idx) => (
                      <div key={idx} className="rounded-lg bg-white p-3 border border-purple-200">
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={color.colorCode}
                            onChange={e => updateColor(idx, "colorCode", e.target.value)}
                            className="h-8 w-8 cursor-pointer rounded border-0"
                          />
                          <input
                            value={color.colorName}
                            onChange={e => updateColor(idx, "colorName", e.target.value)}
                            placeholder="Color name (e.g., Red, Blue)"
                            className="flex-1 rounded-lg border border-purple-200 px-3 py-1.5 text-sm outline-none focus:border-purple-500"
                          />
                          <button onClick={() => setActiveColorIdx(activeColorIdx === idx ? null : idx)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${activeColorIdx === idx ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-700"}`}>
                            {color.images.length} Images
                          </button>
                          <button onClick={() => removeColor(idx)} className="text-red-400 hover:text-red-600">
                            <X size={16} />
                          </button>
                        </div>

                        {activeColorIdx === idx && (
                          <div className="mt-3 border-t border-purple-100 pt-3">
                            <div className="flex flex-wrap gap-2">
                              {color.images.map((url, imgIdx) => (
                                <div key={imgIdx} className="group relative">
                                  <img src={url} alt="" className="h-16 w-16 rounded-lg object-cover border" />
                                  <button onClick={() => removeColorImage(idx, imgIdx)} className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition group-hover:opacity-100">
                                    <X size={10} />
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => colorFileInputRef.current?.click()}
                                disabled={uploading}
                                className="flex h-16 w-16 flex-col items-center justify-center rounded-lg border-2 border-dashed border-purple-300 text-purple-400"
                              >
                                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                              </button>
                            </div>
                            <input ref={colorFileInputRef} type="file" accept="image/*" multiple onChange={e => handleColorImageUpload(e, idx)} className="hidden" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {colorOptions.length === 0 && (
                  <p className="mt-2 text-xs text-purple-600">Add colors to show color swatches on product page (like Flipkart)</p>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={feat} onChange={e => setFeat(e.target.checked)} /> Featured</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={newArr} onChange={e => setNewArr(e.target.checked)} /> New Arrival</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={best} onChange={e => setBest(e.target.checked)} /> Best Seller</label>
                <select value={stock} onChange={e => setStock(e.target.value)} className="rounded-xl border border-brand-200 px-3 py-1.5 text-sm"><option value="IN_STOCK">In Stock</option><option value="OUT_OF_STOCK">Out of Stock</option></select>
              </div>
              <div>
                <div className="flex items-center justify-between"><label className="text-sm font-semibold text-brand-800">Size & Price Variants</label><button onClick={() => setVars([...vars, { ...emptyVariant }])} className="text-sm font-semibold text-brand-500">+ Add</button></div>
                <div className="mt-2 space-y-2">{vars.map((v, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-xl bg-brand-50/50 p-2">
                    <input value={v.size} onChange={e => upVar(i, "size", e.target.value)} placeholder="Size" className="w-16 rounded-lg border px-2 py-1.5 text-sm" />
                    <input value={v.price} onChange={e => upVar(i, "price", e.target.value)} placeholder="Price" className="w-24 rounded-lg border px-2 py-1.5 text-sm" />
                    <input value={v.salePrice || ""} onChange={e => upVar(i, "salePrice", e.target.value)} placeholder="Sale ₹" className="w-20 rounded-lg border px-2 py-1.5 text-sm" />
                    <input value={v.stockQuantity} onChange={e => upVar(i, "stockQuantity", Number(e.target.value))} type="number" placeholder="Qty" className="w-16 rounded-lg border px-2 py-1.5 text-sm" />
                    {vars.length > 1 && <button onClick={() => setVars(vars.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><X size={16} /></button>}
                  </div>
                ))}</div>
              </div>
              <button onClick={save} disabled={saving || !name.trim()} className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-900 py-3 font-semibold text-white hover:bg-brand-950 disabled:opacity-50">
                <Save size={18} /> {saving ? "Saving..." : editing ? "Update Product" : "Create Product"}
              </button>
            </div>
          </motion.div>
        </>)}
      </AnimatePresence>
    </div>
  );
}
