"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Truck, Save, Plus, Trash2 } from "lucide-react";

type ShippingSettings = {
  freeThreshold: number;
  defaultCharge: number;
  codEnabled: boolean;
  codCharge: number;
  zones: { name: string; charge: number; pincodes: string }[];
};

export default function ShippingPage() {
  const [settings, setSettings] = useState<ShippingSettings>({
    freeThreshold: 2000,
    defaultCharge: 80,
    codEnabled: true,
    codCharge: 0,
    zones: [],
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings/shipping")
      .then(r => r.json())
      .then(data => setSettings(data));
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch("/api/settings/shipping", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addZone = () => {
    setSettings(s => ({
      ...s,
      zones: [...s.zones, { name: "", charge: 0, pincodes: "" }],
    }));
  };

  const updateZone = (idx: number, field: string, value: string | number) => {
    setSettings(s => ({
      ...s,
      zones: s.zones.map((z, i) => (i === idx ? { ...z, [field]: value } : z)),
    }));
  };

  const removeZone = (idx: number) => {
    setSettings(s => ({ ...s, zones: s.zones.filter((_, i) => i !== idx) }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-brand-950">Shipping</h1>
          <p className="mt-1 text-brand-700">Manage delivery charges and zones</p>
        </div>
        <button onClick={save} disabled={saving} className="flex items-center gap-2 rounded-full bg-brand-900 px-6 py-2.5 font-semibold text-white hover:bg-brand-950 disabled:opacity-50">
          <Save size={18} /> {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-brand-100 p-3"><Truck className="text-brand-600" size={20} /></div>
            <h2 className="text-xl font-bold text-brand-950">Delivery Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-brand-800">Free Shipping Above (₹)</label>
              <input
                type="number" value={settings.freeThreshold}
                onChange={e => setSettings(s => ({ ...s, freeThreshold: Number(e.target.value) }))}
                className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-3 outline-none focus:border-brand-500"
              />
              <p className="mt-1 text-xs text-brand-500">Orders above this amount get free delivery</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-brand-800">Default Delivery Charge (₹)</label>
              <input
                type="number" value={settings.defaultCharge}
                onChange={e => setSettings(s => ({ ...s, defaultCharge: Number(e.target.value) }))}
                className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-3 outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox" checked={settings.codEnabled} id="cod"
                onChange={e => setSettings(s => ({ ...s, codEnabled: e.target.checked }))}
                className="h-5 w-5 rounded border-brand-300 text-brand-600"
              />
              <label htmlFor="cod" className="text-sm font-semibold text-brand-800">Enable Cash on Delivery</label>
            </div>

            {settings.codEnabled && (
              <div>
                <label className="text-sm font-semibold text-brand-800">COD Extra Charge (₹)</label>
                <input
                  type="number" value={settings.codCharge}
                  onChange={e => setSettings(s => ({ ...s, codCharge: Number(e.target.value) }))}
                  className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-3 outline-none focus:border-brand-500"
                />
                <p className="mt-1 text-xs text-brand-500">Extra charge for COD orders (0 for no charge)</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-brand-950">Delivery Zones</h2>
            <button onClick={addZone} className="flex items-center gap-1 rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-700 hover:bg-brand-100">
              <Plus size={16} /> Add Zone
            </button>
          </div>

          {settings.zones.length === 0 ? (
            <p className="py-8 text-center text-brand-500">No zones configured. Default charge applies everywhere.</p>
          ) : (
            <div className="space-y-4">
              {settings.zones.map((zone, idx) => (
                <div key={idx} className="rounded-xl border border-brand-100 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <input
                      placeholder="Zone name (e.g., Mumbai, Metro Cities)"
                      value={zone.name} onChange={e => updateZone(idx, "name", e.target.value)}
                      className="flex-1 rounded-lg border border-brand-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
                    />
                    <button onClick={() => removeZone(idx)} className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs text-brand-500">Charge (₹)</label>
                      <input
                        type="number" value={zone.charge}
                        onChange={e => updateZone(idx, "charge", Number(e.target.value))}
                        className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-brand-500">PIN Codes (comma separated)</label>
                      <input
                        placeholder="520001, 520002, 520003"
                        value={zone.pincodes} onChange={e => updateZone(idx, "pincodes", e.target.value)}
                        className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
