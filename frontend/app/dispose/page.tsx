"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { api, Bin } from "../../lib/api";

const CATEGORIES = [
  { id: "e-waste", label: "E-Waste", rate: 40, icon: "⚡", desc: "Batteries, circuit boards, cables, gadgets", color: "from-purple-500/10 to-indigo-500/10 border-purple-300" },
  { id: "glass", label: "Glass", rate: 25, icon: "🍾", desc: "Bottles, jars, transparent glass", color: "from-emerald-500/10 to-teal-500/10 border-emerald-300" },
  { id: "metal", label: "Metal", rate: 20, icon: "🥫", desc: "Beverage cans, tin, aluminum containers", color: "from-slate-500/10 to-zinc-500/10 border-slate-300" },
  { id: "plastic", label: "Plastic", rate: 15, icon: "🧴", desc: "PET/HDPE bottles, clean containers", color: "from-blue-500/10 to-cyan-500/10 border-blue-300" },
  { id: "organic", label: "Organic", rate: 12, icon: "🍌", desc: "Food scraps, fruit peels, compostables", color: "from-lime-500/10 to-green-500/10 border-lime-300" },
  { id: "paper", label: "Paper", rate: 10, icon: "📄", desc: "Newspapers, notebooks, clean sheets", color: "from-amber-500/10 to-yellow-500/10 border-amber-300" },
  { id: "cardboard", label: "Cardboard", rate: 10, icon: "📦", desc: "Corrugated boxes, packaging cartons", color: "from-orange-500/10 to-amber-500/10 border-orange-300" },
  { id: "other", label: "Other", rate: 5, icon: "🗑️", desc: "Miscellaneous dry recyclable items", color: "from-gray-500/10 to-slate-500/10 border-gray-300" },
];

export default function DisposePage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();

  const [bins, setBins] = useState<Bin[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("plastic");
  const [quantity, setQuantity] = useState("");
  const [selectedBinId, setSelectedBinId] = useState("");
  const [description, setDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    pointsEarned: number;
    newTotal: number;
    recordId: string;
  } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    api.bins
      .getAll()
      .then((res) => {
        if (res.bins && res.bins.length > 0) {
          setBins(res.bins);
          setSelectedBinId(res.bins[0]._id);
        }
      })
      .catch(() => {});
  }, [user, authLoading, router]);

  const activeCategory = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[3];
  const parsedQuantity = parseFloat(quantity) || 0;
  const estimatedPoints = parsedQuantity > 0 ? Math.max(5, Math.round(parsedQuantity * activeCategory.rate)) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessInfo(null);

    if (parsedQuantity <= 0) {
      setError("Please enter a valid quantity greater than 0 kg.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.waste.recordDisposal({
        wasteCategory: selectedCategory,
        quantity: parsedQuantity,
        binId: selectedBinId || undefined,
        description: description || undefined,
      });

      if (res.success) {
        setSuccessInfo({
          pointsEarned: res.pointsEarned,
          newTotal: res.newTotalPoints,
          recordId: res.record._id,
        });
        setQuantity("");
        setDescription("");
        await refreshUser();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to record disposal.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/60 pb-20">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800 mb-2">
              <span>♻️</span> Manual Waste Segregation
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Record Waste Disposal</h2>
            <p className="mt-1 text-sm text-gray-600">
              Categorize your sorted recyclable items, log mass in kilograms, and collect instant EcoPoints.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="self-start sm:self-auto rounded-lg border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            ← Return to Dashboard
          </Link>
        </div>

        {/* Success Alert */}
        {successInfo && (
          <div className="mb-8 rounded-3xl border border-emerald-300 bg-gradient-to-r from-emerald-50 via-teal-50 to-white p-6 shadow-md animate-in fade-in">
            <div className="flex items-start gap-4">
              <span className="text-4xl">🎉</span>
              <div>
                <h4 className="text-lg font-extrabold text-emerald-950">Disposal Recorded & Verified!</h4>
                <p className="mt-1 text-sm text-emerald-800">
                  Congratulations! You earned{" "}
                  <span className="font-extrabold text-emerald-700">+{successInfo.pointsEarned} EcoPoints</span>.
                  Your updated balance is{" "}
                  <span className="font-extrabold text-emerald-900">{successInfo.newTotal} pts</span>.
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <Link
                    href="/dashboard"
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                  >
                    View Updated Dashboard
                  </Link>
                  <Link
                    href="/rewards"
                    className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-600"
                  >
                    🎁 Spend Points in Rewards Store
                  </Link>
                  <Link
                    href="/history"
                    className="rounded-lg border border-emerald-300 bg-white px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50"
                  >
                    View History Log
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm">
          {/* Category Selector Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-bold text-gray-900">
                1. Select Waste Category (Manual Segregation)
              </label>
              <span className="text-xs text-gray-500 font-medium">8 Recyclable Streams</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`relative flex flex-col items-center justify-between rounded-2xl border p-4 text-center transition-all ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/70 shadow-md ring-2 ring-emerald-500/40"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
                        ✓
                      </span>
                    )}
                    <span className="text-3xl mb-1">{cat.icon}</span>
                    <span className="text-xs font-bold text-gray-900">{cat.label}</span>
                    <span className="mt-1.5 inline-block rounded-full bg-emerald-100/70 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                      +{cat.rate} pts / kg
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mass Input & Live Reward Preview */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1.5">
                2. Enter Waste Mass (Quantity in kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0.1"
                  max="500"
                  step="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 2.5"
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder-gray-400 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                />
                <span className="absolute right-4 top-3 text-sm font-bold text-gray-400">
                  kg
                </span>
              </div>
              <p className="mt-1.5 text-xs text-gray-500">
                Category Rate: <span className="font-bold text-emerald-700">{activeCategory.rate} points/kg</span>
              </p>
            </div>

            {/* Live Calculation Preview Card */}
            <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 p-5 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-800 font-bold block">
                  Reward Estimator Preview
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-800">
                    +{estimatedPoints}
                  </span>
                  <span className="text-xs font-bold text-emerald-700">EcoPoints</span>
                </div>
              </div>
              <p className="text-[11px] text-emerald-700 mt-2">
                Formula: {parsedQuantity > 0 ? `${parsedQuantity} kg × ${activeCategory.rate} pts` : "Enter mass above"} (min 5 pts)
              </p>
            </div>
          </div>

          {/* Smart Bin Selector */}
          <div className="mt-6">
            <label className="block text-sm font-bold text-gray-900 mb-1.5">
              3. Select Designated EcoSort Smart Bin
            </label>
            <select
              value={selectedBinId}
              onChange={(e) => setSelectedBinId(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            >
              {bins.map((bin) => (
                <option key={bin._id} value={bin._id}>
                  {bin.name} — {bin.location} (Fill: {bin.simulatedFillPercentage}% • {bin.status})
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              The selected bin&apos;s simulated volume will be incremented automatically.
            </p>
          </div>

          {/* Optional Note */}
          <div className="mt-6">
            <label className="block text-sm font-bold text-gray-900 mb-1.5">
              4. Optional Description / Batch Notes
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Lab cleanup cables or clean cafeteria glass jars"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={submitting}
            className="mt-8 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-green-700 disabled:opacity-60 transition-all active:scale-[0.99]"
          >
            {submitting ? "Processing & Calculating Points..." : "Submit Waste Disposal & Claim EcoPoints"}
          </button>
        </form>
      </div>
    </main>
  );
}