"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, HelpCircle, Loader2, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

type SizeChartEntry = {
  size: string;
  chest: string;
  waist: string;
  hip: string;
  length: string;
  ageRange: string;
};

type SizeChart = {
  _id?: string;
  category: string;
  type: "standard" | "kids";
  measurements: SizeChartEntry[];
};

const categories = [
  "Kurta Sets",
  "Sarees",
  "Lehengas",
  "Indo Western",
  "Fusion Wear",
  "Kids Wear",
  "Western Wear",
  "Co-ords Sets",
  "Anarkali",
  "Gowns"
];

const emptyEntry = (type: "standard" | "kids"): SizeChartEntry => ({
  size: "",
  chest: "",
  waist: "",
  hip: "",
  length: "",
  ageRange: type === "kids" ? "1–2 Years" : ""
});

export default function AdminSizeChartsPage() {
  const [charts, setCharts] = useState<SizeChart[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [selectedChart, setSelectedChart] = useState<SizeChart | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadCharts();
  }, []);

  const loadCharts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/size-charts");
      if (res.ok) {
        const data = await res.json();
        setCharts(data);
      }
    } catch (err) {
      console.error("Failed to load size charts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Find current chart or set defaults
    const chart = charts.find(c => c.category === activeCategory);
    if (chart) {
      setSelectedChart(JSON.parse(JSON.stringify(chart))); // deep clone
    } else {
      setSelectedChart({
        category: activeCategory,
        type: activeCategory === "Kids Wear" ? "kids" : "standard",
        measurements: []
      });
    }
    setMessage(null);
  }, [activeCategory, charts]);

  const updateChartType = (type: "standard" | "kids") => {
    if (!selectedChart) return;
    setSelectedChart({
      ...selectedChart,
      type,
      measurements: selectedChart.measurements.map(m => ({
        ...m,
        ageRange: type === "kids" ? (m.ageRange || "1–2 Years") : ""
      }))
    });
  };

  const handleMeasurementChange = (index: number, field: keyof SizeChartEntry, value: string) => {
    if (!selectedChart) return;
    const newMeasurements = [...selectedChart.measurements];
    newMeasurements[index] = {
      ...newMeasurements[index],
      [field]: value
    };
    setSelectedChart({
      ...selectedChart,
      measurements: newMeasurements
    });
  };

  const addRow = () => {
    if (!selectedChart) return;
    setSelectedChart({
      ...selectedChart,
      measurements: [...selectedChart.measurements, emptyEntry(selectedChart.type)]
    });
  };

  const removeRow = (index: number) => {
    if (!selectedChart) return;
    setSelectedChart({
      ...selectedChart,
      measurements: selectedChart.measurements.filter((_, i) => i !== index)
    });
  };

  const save = async () => {
    if (!selectedChart) return;

    // Validation
    const hasEmptySizes = selectedChart.measurements.some(m => !m.size.trim());
    if (hasEmptySizes) {
      setMessage({ type: "error", text: "Size label is required for all rows." });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/size-charts/${encodeURIComponent(selectedChart.category)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedChart.type,
          measurements: selectedChart.measurements
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save size chart.");
      }

      const updated = await res.json();
      
      // Update charts state
      setCharts(prev => {
        const exists = prev.some(c => c.category === updated.category);
        if (exists) {
          return prev.map(c => c.category === updated.category ? updated : c);
        } else {
          return [...prev, updated];
        }
      });

      setMessage({ type: "success", text: "Size chart updated successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Something went wrong." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 size={36} className="animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-brand-950">Default Size Charts</h1>
          <p className="mt-1 text-sm text-brand-700">Configure global default size templates for product categories</p>
        </div>
        <button 
          onClick={loadCharts} 
          className="flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-4 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-50"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        {/* Left Side: Category List */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-brand-400 px-3">Categories</label>
          <div className="flex flex-col gap-1">
            {categories.map(cat => {
              const active = activeCategory === cat;
              const hasChart = charts.some(c => c.category === cat && c.measurements.length > 0);
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                    active 
                      ? "bg-brand-900 text-white shadow-sm" 
                      : "bg-white text-brand-700 border border-brand-100/50 hover:bg-brand-50"
                  }`}
                >
                  <span>{cat}</span>
                  {hasChart && !active && (
                    <span className="h-2 w-2 rounded-full bg-green-500" title="Chart configured" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Size Chart Editor */}
        <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
          {selectedChart && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 border-b border-brand-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-display text-xl text-brand-950">{selectedChart.category} Size Chart</h2>
                  <p className="text-xs text-brand-500">Edit default size rows for this category</p>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-brand-50 p-1">
                  <button
                    onClick={() => updateChartType("standard")}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      selectedChart.type === "standard" 
                        ? "bg-white text-brand-950 shadow-sm" 
                        : "text-brand-600 hover:text-brand-900"
                    }`}
                  >
                    Standard (S/M/L)
                  </button>
                  <button
                    onClick={() => updateChartType("kids")}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      selectedChart.type === "kids" 
                        ? "bg-white text-brand-950 shadow-sm" 
                        : "text-brand-600 hover:text-brand-900"
                    }`}
                  >
                    Kids Wear
                  </button>
                </div>
              </div>

              {/* Success/Error Message */}
              {message && (
                <div className={`flex items-start gap-2.5 rounded-xl px-4 py-3.5 text-sm ${
                  message.type === "success" 
                    ? "bg-green-50 text-green-800 border border-green-200" 
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}>
                  {message.type === "success" ? <CheckCircle2 size={18} className="flex-shrink-0" /> : <AlertCircle size={18} className="flex-shrink-0" />}
                  <span>{message.text}</span>
                </div>
              )}

              {/* Table of measurements */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-brand-100 text-left text-xs font-bold uppercase tracking-wider text-brand-400">
                      <th className="pb-3 pr-4">Size *</th>
                      {selectedChart.type === "kids" ? (
                        <>
                          <th className="pb-3 pr-4">Age Range</th>
                          <th className="pb-3 pr-4">Length</th>
                        </>
                      ) : (
                        <>
                          <th className="pb-3 pr-4">Chest (Bust)</th>
                          <th className="pb-3 pr-4">Waist</th>
                          <th className="pb-3 pr-4">Hip</th>
                          <th className="pb-3 pr-4">Length</th>
                        </>
                      )}
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedChart.measurements.map((entry, idx) => (
                      <tr key={idx} className="border-b border-brand-50/50">
                        <td className="py-2.5 pr-4">
                          <input
                            type="text"
                            value={entry.size}
                            onChange={e => handleMeasurementChange(idx, "size", e.target.value)}
                            placeholder="M, 18, etc."
                            className="w-full max-w-[80px] rounded-lg border border-brand-200 px-2 py-1.5 text-sm outline-none focus:border-brand-500"
                          />
                        </td>
                        {selectedChart.type === "kids" ? (
                          <>
                            <td className="py-2.5 pr-4">
                              <input
                                type="text"
                                value={entry.ageRange}
                                onChange={e => handleMeasurementChange(idx, "ageRange", e.target.value)}
                                placeholder="e.g. 1–2 Years"
                                className="w-full max-w-[140px] rounded-lg border border-brand-200 px-2 py-1.5 text-sm outline-none focus:border-brand-500"
                              />
                            </td>
                            <td className="py-2.5 pr-4">
                              <input
                                type="text"
                                value={entry.length}
                                onChange={e => handleMeasurementChange(idx, "length", e.target.value)}
                                placeholder='e.g. 18"'
                                className="w-full max-w-[100px] rounded-lg border border-brand-200 px-2 py-1.5 text-sm outline-none focus:border-brand-500"
                              />
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-2.5 pr-4">
                              <input
                                type="text"
                                value={entry.chest}
                                onChange={e => handleMeasurementChange(idx, "chest", e.target.value)}
                                placeholder='e.g. 36"'
                                className="w-full max-w-[100px] rounded-lg border border-brand-200 px-2 py-1.5 text-sm outline-none focus:border-brand-500"
                              />
                            </td>
                            <td className="py-2.5 pr-4">
                              <input
                                type="text"
                                value={entry.waist}
                                onChange={e => handleMeasurementChange(idx, "waist", e.target.value)}
                                placeholder='e.g. 34"'
                                className="w-full max-w-[100px] rounded-lg border border-brand-200 px-2 py-1.5 text-sm outline-none focus:border-brand-500"
                              />
                            </td>
                            <td className="py-2.5 pr-4">
                              <input
                                type="text"
                                value={entry.hip}
                                onChange={e => handleMeasurementChange(idx, "hip", e.target.value)}
                                placeholder='e.g. 38"'
                                className="w-full max-w-[100px] rounded-lg border border-brand-200 px-2 py-1.5 text-sm outline-none focus:border-brand-500"
                              />
                            </td>
                            <td className="py-2.5 pr-4">
                              <input
                                type="text"
                                value={entry.length}
                                onChange={e => handleMeasurementChange(idx, "length", e.target.value)}
                                placeholder='e.g. 30"'
                                className="w-full max-w-[100px] rounded-lg border border-brand-200 px-2 py-1.5 text-sm outline-none focus:border-brand-500"
                              />
                            </td>
                          </>
                        )}
                        <td className="py-2.5 text-right">
                          <button
                            onClick={() => removeRow(idx)}
                            className="rounded-lg p-1.5 text-brand-400 hover:bg-red-50 hover:text-red-600 transition"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedChart.measurements.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-brand-50/30 rounded-xl border border-dashed border-brand-100">
                  <HelpCircle className="text-brand-300 mb-2" size={32} />
                  <p className="text-sm font-semibold text-brand-700">No size configurations added yet</p>
                  <p className="text-xs text-brand-500 mt-0.5">Click the button below to initialize default sizing</p>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-brand-100 pt-5">
                <button
                  onClick={addRow}
                  className="flex items-center justify-center gap-1.5 rounded-full border border-brand-200 bg-white px-5 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                >
                  <Plus size={16} /> Add Row
                </button>

                <button
                  onClick={save}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-full bg-brand-900 px-7 py-2.5 text-sm font-semibold text-white hover:bg-brand-950 disabled:opacity-50"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  <span>{saving ? "Saving Changes..." : "Save Size Chart"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
