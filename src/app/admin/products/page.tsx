"use client";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit2, Trash2, X, Save, ImageIcon, Upload, Loader2, Palette, Ruler } from "lucide-react";
import { exportToCSV, exportToPDF } from "@/lib/export";

type Variant = { sku: string; size: string; color: string; price: string; salePrice?: string; stockQuantity: number };
type ColorOption = { colorName: string; colorCode: string; images: string[] };
type ApiColorOption = { colorName: string; colorCode: string; images: { imageUrl: string }[] };
type SizeChartEntry = { size: string; chest: string; waist: string; hip: string; length: string; ageRange: string };
type Product = {
  id: string; slug: string; name: string; description: string; category: string;
  featured: boolean; isNewArrival: boolean; isBestSeller: boolean; stockStatus: string;
  variants: Variant[]; images: { imageUrl: string }[]; colorOptions?: ApiColorOption[];
  sizeChart?: SizeChartEntry[];
  sizeChartType?: "standard" | "kids";
};

const emptyVariant: Variant = { sku: "", size: "", color: "", price: "", stockQuantity: 0 };
const emptyColor: ColorOption = { colorName: "", colorCode: "#000000", images: [] };
const cats = ["Kurta Sets", "Sarees", "Lehengas", "Indo Western", "Kids Wear", "Western Wear", "Co-ords Sets", "Anarkali", "Gowns"];

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
  const [sizeChart, setSizeChart] = useState<SizeChartEntry[]>([]);
  const [sizeChartType, setSizeChartType] = useState<"standard" | "kids">("standard");
  const [useCustomSizeChart, setUseCustomSizeChart] = useState(false);
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
    setSizeChart([]); setSizeChartType("standard"); setUseCustomSizeChart(false);
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
    setSizeChart(p.sizeChart || []);
    setSizeChartType(p.sizeChartType || (p.category === "Kids Wear" ? "kids" : "standard"));
    setUseCustomSizeChart(p.sizeChart && p.sizeChart.length > 0 ? true : false);
    setShowModal(true);
  };

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      formData.append('folder', 'products');

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload failed');
      }
      const { urls } = await res.json();
      setImageUrls(prev => [...prev, ...urls]);
    } catch (err: any) {
      console.error(err);
      alert("Image upload failed: " + (err.message || err));
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleColorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || activeColorIdx === null) return;

    setUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      formData.append('folder', 'products/colors');

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload failed');
      }
      const { urls } = await res.json();

      const colorIdx = activeColorIdx;
      setColorOptions(prev => prev.map((c, i) => i === colorIdx ? { ...c, images: [...c.images, ...urls] } : c));
    } catch (err: any) {
      console.error(err);
      alert("Image upload failed: " + (err.message || err));
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
    if (!name.trim()) {
      alert("Product Name is required.");
      return;
    }

    // Validate that all added color options have a non-empty name
    const hasEmptyColorName = colorOptions.some(c => !c.colorName.trim());
    if (hasEmptyColorName) {
      alert("Please enter a color name (e.g., Red, Blue, Pink) for all your added color options.");
      return;
    }

    setSaving(true);
    const slug = editing?.slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const good = vars.filter(v => v.price);
    const body = {
      name, slug, description: desc, category: cat, featured: feat, isNewArrival: newArr, isBestSeller: best, stockStatus: stock,
      variants: good.map(v => {
        const normSize = (v.size || "").trim() || "Free Size";
        return {
          sku: v.sku || `${slug}-${normSize.replace(/\s+/g, "-")}-${Date.now()}`,
          size: normSize,
          color: v.color,
          price: Number(v.price),
          salePrice: v.salePrice ? Number(v.salePrice) : null,
          stockQuantity: Number(v.stockQuantity)
        };
      }),
      images: imageUrls,
      colorOptions: colorOptions.map(c => ({ colorName: c.colorName.trim(), colorCode: c.colorCode, images: c.images })),
      sizeChart: useCustomSizeChart ? sizeChart : [],
      sizeChartType: useCustomSizeChart ? sizeChartType : (cat === "Kids Wear" ? "kids" : "standard")
    };
    let response;
    const editingId = editing ? (editing.id || (editing as any)._id) : null;
    if (editingId) {
      response = await fetch(`/api/products/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      response = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    const result = await response.json();
    setSaving(false); setShowModal(false); reset(); load();
  };

  const del = async (id: string) => { 
    if (!id) return;
    setDelId(id); 
    await fetch(`/api/products/${id}`, { method: "DELETE" }); 
    setDelId(null); 
    load(); 
  };

  const upVar = (i: number, f: keyof Variant, v: string | number) => { const u = [...vars]; u[i] = { ...u[i], [f]: v }; setVars(u); };

  const filtered = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
  }, [products, search]);

  const productTable = useMemo(() => {
    if (loading) return <div className="py-12 text-center text-brand-700">Loading...</div>;
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm will-change-transform transform-gpu">
        <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-brand-100 text-left text-xs font-semibold uppercase tracking-wider text-brand-500">
          <th className="px-6 py-4">Product</th><th className="px-6 py-4">Category</th><th className="px-6 py-4">Price</th><th className="px-6 py-4">Colors</th><th className="px-6 py-4">Sizes</th><th className="px-6 py-4 text-right">Actions</th>
        </tr></thead><tbody>
          {filtered.map(p => (
            <tr key={p.id || (p as any)._id} className="border-b border-brand-50 hover:bg-brand-50/50">
              <td className="px-6 py-4"><div className="flex items-center gap-3">
                {p.images[0] ? <img src={p.images[0].imageUrl} alt="" className="h-12 w-12 rounded-xl object-cover" loading="lazy" /> : <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50"><ImageIcon size={20} className="text-brand-300" /></div>}
                <div><p className="font-semibold text-brand-900">{p.name}</p><p className="text-xs text-brand-500">{p.slug}</p></div>
              </div></td>
              <td className="px-6 py-4"><span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800">{p.category}</span></td>
              <td className="px-6 py-4 font-semibold text-brand-900">
                {p.variants[0] ? (
                  p.variants[0].salePrice ? (
                    <div className="flex flex-col">
                      <span className="text-brand-900">₹{Number(p.variants[0].salePrice).toLocaleString("en-IN")}</span>
                      <span className="text-[10px] text-brand-400 line-through">₹{Number(p.variants[0].price).toLocaleString("en-IN")}</span>
                    </div>
                  ) : (
                    `₹${Number(p.variants[0].price).toLocaleString("en-IN")}`
                  )
                ) : "—"}
              </td>
              <td className="px-6 py-4">
                {p.colorOptions && p.colorOptions.length > 0 ? (
                  <div className="flex gap-1">
                    {p.colorOptions.slice(0, 4).map((c, i) => (
                      <div 
                        key={i} 
                        className="h-5 w-5 rounded-full border border-brand-200" 
                        style={{ backgroundColor: c.colorCode === "#000000" && c.colorName.toLowerCase() !== "black" ? c.colorName : c.colorCode }} 
                        title={c.colorName} 
                      />
                    ))}
                    {p.colorOptions.length > 4 && <span className="text-xs text-brand-500">+{p.colorOptions.length - 4}</span>}
                  </div>
                ) : <span className="text-brand-400">—</span>}
              </td>
              <td className="px-6 py-4 text-sm text-brand-700">{[...new Set(p.variants.map(v => v.size))].join(", ") || "—"}</td>
              <td className="px-6 py-4"><div className="flex justify-end gap-1">
                <button onClick={() => openEdit(p)} className="rounded-lg p-2 text-brand-400 hover:bg-blue-50 hover:text-blue-600"><Edit2 size={16} /></button>
                <button onClick={() => del(p.id || (p as any)._id)} disabled={delId === (p.id || (p as any)._id)} className="rounded-lg p-2 text-brand-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"><Trash2 size={16} /></button>
              </div></td>
            </tr>
          ))}
        </tbody></table></div>
        {filtered.length === 0 && <div className="py-12 text-center text-brand-700">No products found.</div>}
      </motion.div>
    );
  }, [filtered, loading, delId]);

  const handleExportCSV = () => {
    const headers = ["Product Name", "Slug", "Category", "Featured", "Best Seller", "New Arrival", "Stock Status", "Base Price", "Variants Count"];
    const rows = filtered.map(p => [
      p.name,
      p.slug,
      p.category,
      p.featured ? "Yes" : "No",
      p.isBestSeller ? "Yes" : "No",
      p.isNewArrival ? "Yes" : "No",
      p.stockStatus,
      p.variants && p.variants.length > 0 ? p.variants[0].price : "0",
      p.variants ? p.variants.length : 0
    ]);
    exportToCSV("products_export", headers, rows);
  };

  const handleExportPDF = () => {
    const headers = ["Name", "Category", "Status", "Base Price", "Sizes"];
    const rows = filtered.map(p => [
      p.name,
      p.category,
      p.stockStatus === "IN_STOCK" ? "In Stock" : "Out of Stock",
      p.variants && p.variants.length > 0 ? `INR ${p.variants[0].price}` : "N/A",
      [...new Set(p.variants.map(v => v.size))].join(", ") || "—"
    ]);
    exportToPDF("products_export", "Bhuvika Studio - Products Report", headers, rows);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-brand-950">Products</h1>
          <p className="mt-1 text-brand-700">{products.length} products</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportCSV}
            className="rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-sm font-semibold text-brand-800 transition hover:bg-brand-50 cursor-pointer"
          >
            Export CSV
          </button>
          <button 
            onClick={handleExportPDF}
            className="rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-sm font-semibold text-brand-800 transition hover:bg-brand-50 cursor-pointer"
          >
            Export PDF
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 rounded-full bg-brand-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-950 cursor-pointer">
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>
      <div className="relative"><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full rounded-xl border border-brand-200 bg-white py-3 pl-11 pr-4 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
      </div>
      {productTable}

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
                          <div className="relative h-8 w-8 flex-shrink-0">
                            <div 
                              className="absolute inset-0 rounded border shadow-sm" 
                              style={{ backgroundColor: color.colorCode === "#000000" && color.colorName.toLowerCase() !== "black" ? color.colorName : color.colorCode }}
                            />
                            <input
                              type="color"
                              value={color.colorCode}
                              onChange={e => updateColor(idx, "colorCode", e.target.value)}
                              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                            />
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              value={color.colorCode}
                              onChange={e => updateColor(idx, "colorCode", e.target.value)}
                              placeholder="#000000"
                              className="w-28 rounded-lg border px-2 py-1.5 text-xs font-mono"
                            />
                          </div>
                          <input
                            value={color.colorName}
                            onChange={e => updateColor(idx, "colorName", e.target.value)}
                            placeholder="Color name (e.g., Red, Blue) *"
                            className={`flex-1 rounded-lg border px-3 py-1.5 text-sm outline-none focus:border-purple-500 ${!color.colorName.trim() ? "border-red-300 bg-red-50/10 placeholder-red-400" : "border-purple-200"}`}
                          />
                          <button 
                            onClick={() => setActiveColorIdx(activeColorIdx === idx ? null : idx)} 
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${activeColorIdx === idx ? "bg-purple-600 text-white shadow-sm" : "bg-purple-100 text-purple-700 hover:bg-purple-200"}`}
                          >
                            <ImageIcon size={14} />
                            <span>{color.images.length} {color.images.length === 1 ? "Image" : "Images"} / Add</span>
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
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {colorOptions.length === 0 && (
                  <p className="mt-2 text-xs text-purple-600">Add colors to show color swatches on product page (like Flipkart)</p>
                )}

                {/* Hidden file input for color images - outside the loop */}
                <input ref={colorFileInputRef} type="file" accept="image/*" multiple onChange={handleColorImageUpload} className="hidden" />
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
                    <div className="flex-1"><input value={v.size} onChange={e => upVar(i, "size", e.target.value)} placeholder="Size" className="w-full rounded-lg border px-2 py-1.5 text-sm" /></div>
                    <div className="flex-1"><input value={v.price} onChange={e => upVar(i, "price", e.target.value)} placeholder="MRP (Old Price)" className="w-full rounded-lg border px-2 py-1.5 text-sm" /></div>
                    <div className="flex-1"><input value={v.salePrice || ""} onChange={e => upVar(i, "salePrice", e.target.value)} placeholder="Discount Price" className="w-full rounded-lg border px-2 py-1.5 text-sm bg-green-50" /></div>
                    <div className="flex-1"><input value={v.stockQuantity} onChange={e => upVar(i, "stockQuantity", Number(e.target.value))} type="number" placeholder="Qty" className="w-full rounded-lg border px-2 py-1.5 text-sm" /></div>
                    {vars.length > 1 && <button onClick={() => setVars(vars.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><X size={16} /></button>}
                  </div>
                ))}</div>
              </div>

              {/* Custom Size Chart Override */}
              <div className="rounded-xl border border-brand-200 bg-brand-50/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ruler size={16} className="text-brand-900" />
                    <span className="text-sm font-semibold text-brand-900">Custom Size Chart Override</span>
                  </div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-brand-700 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={useCustomSizeChart} 
                      onChange={e => {
                        setUseCustomSizeChart(e.target.checked);
                        if (e.target.checked && sizeChart.length === 0) {
                          fetch(`/api/size-charts/${encodeURIComponent(cat)}`)
                            .then(res => res.json())
                            .then(data => {
                              if (data && data.measurements && data.measurements.length > 0) {
                                setSizeChart(data.measurements);
                                setSizeChartType(data.type);
                              } else {
                                setSizeChart([{ size: "", chest: "", waist: "", hip: "", length: "", ageRange: "" }]);
                                setSizeChartType(cat === "Kids Wear" ? "kids" : "standard");
                              }
                            }).catch(() => {
                              setSizeChart([{ size: "", chest: "", waist: "", hip: "", length: "", ageRange: "" }]);
                              setSizeChartType(cat === "Kids Wear" ? "kids" : "standard");
                            });
                        }
                      }} 
                    /> 
                    <span>Override default template</span>
                  </label>
                </div>

                {useCustomSizeChart && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-t border-brand-100/50 pt-2">
                      <span className="text-xs text-brand-500">Add measurements to override the default template.</span>
                      <div className="flex items-center gap-2">
                        <button 
                          type="button"
                          onClick={() => setSizeChartType("standard")} 
                          className={`px-2 py-1 text-[10px] font-bold rounded ${sizeChartType === "standard" ? "bg-brand-900 text-white" : "bg-white text-brand-600 border"}`}
                        >
                          Standard
                        </button>
                        <button 
                          type="button"
                          onClick={() => setSizeChartType("kids")} 
                          className={`px-2 py-1 text-[10px] font-bold rounded ${sizeChartType === "kids" ? "bg-brand-900 text-white" : "bg-white text-brand-600 border"}`}
                        >
                          Kids
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-brand-100 text-brand-400 font-bold uppercase">
                            <th className="pb-1">Size *</th>
                            {sizeChartType === "kids" ? (
                              <>
                                <th className="pb-1">Age Range</th>
                                <th className="pb-1">Length</th>
                              </>
                            ) : (
                              <>
                                <th className="pb-1">Chest</th>
                                <th className="pb-1">Waist</th>
                                <th className="pb-1">Hip</th>
                                <th className="pb-1">Length</th>
                              </>
                            )}
                            <th className="pb-1 text-right">Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sizeChart.map((entry, idx) => (
                            <tr key={idx} className="border-b border-brand-100/50">
                              <td className="py-1">
                                <input 
                                  value={entry.size} 
                                  onChange={e => {
                                    const newChart = [...sizeChart];
                                    newChart[idx].size = e.target.value;
                                    setSizeChart(newChart);
                                  }} 
                                  placeholder="M" 
                                  className="w-12 rounded border p-1 text-[11px] outline-none focus:border-brand-500" 
                                />
                              </td>
                              {sizeChartType === "kids" ? (
                                <>
                                  <td className="py-1">
                                    <input 
                                      value={entry.ageRange} 
                                      onChange={e => {
                                        const newChart = [...sizeChart];
                                        newChart[idx].ageRange = e.target.value;
                                        setSizeChart(newChart);
                                      }} 
                                      placeholder="e.g. 1-2 Years" 
                                      className="w-20 rounded border p-1 text-[11px] outline-none focus:border-brand-500" 
                                    />
                                  </td>
                                  <td className="py-1">
                                    <input 
                                      value={entry.length} 
                                      onChange={e => {
                                        const newChart = [...sizeChart];
                                        newChart[idx].length = e.target.value;
                                        setSizeChart(newChart);
                                      }} 
                                      placeholder='18"' 
                                      className="w-12 rounded border p-1 text-[11px] outline-none focus:border-brand-500" 
                                    />
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td className="py-1">
                                    <input 
                                      value={entry.chest} 
                                      onChange={e => {
                                        const newChart = [...sizeChart];
                                        newChart[idx].chest = e.target.value;
                                        setSizeChart(newChart);
                                      }} 
                                      placeholder='36"' 
                                      className="w-12 rounded border p-1 text-[11px] outline-none focus:border-brand-500" 
                                    />
                                  </td>
                                  <td className="py-1">
                                    <input 
                                      value={entry.waist} 
                                      onChange={e => {
                                        const newChart = [...sizeChart];
                                        newChart[idx].waist = e.target.value;
                                        setSizeChart(newChart);
                                      }} 
                                      placeholder='34"' 
                                      className="w-12 rounded border p-1 text-[11px] outline-none focus:border-brand-500" 
                                    />
                                  </td>
                                  <td className="py-1">
                                    <input 
                                      value={entry.hip} 
                                      onChange={e => {
                                        const newChart = [...sizeChart];
                                        newChart[idx].hip = e.target.value;
                                        setSizeChart(newChart);
                                      }} 
                                      placeholder='38"' 
                                      className="w-12 rounded border p-1 text-[11px] outline-none focus:border-brand-500" 
                                    />
                                  </td>
                                  <td className="py-1">
                                    <input 
                                      value={entry.length} 
                                      onChange={e => {
                                        const newChart = [...sizeChart];
                                        newChart[idx].length = e.target.value;
                                        setSizeChart(newChart);
                                      }} 
                                      placeholder='30"' 
                                      className="w-12 rounded border p-1 text-[11px] outline-none focus:border-brand-500" 
                                    />
                                  </td>
                                </>
                              )}
                              <td className="py-1 text-right">
                                <button 
                                  type="button" 
                                  onClick={() => setSizeChart(sizeChart.filter((_, i) => i !== idx))} 
                                  className="text-red-400 hover:text-red-600"
                                >
                                  <X size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setSizeChart([...sizeChart, { size: "", chest: "", waist: "", hip: "", length: "", ageRange: sizeChartType === "kids" ? "1-2 Years" : "" }])} 
                      className="text-[11px] font-bold text-brand-500 hover:text-brand-700"
                    >
                      + Add Size Row
                    </button>
                  </div>
                )}
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
