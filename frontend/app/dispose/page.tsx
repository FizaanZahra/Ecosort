"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { api, Bin } from "../../lib/api";

const CATEGORIES = [
  { id: "plastic", label: "Plastic", rate: 15, icon: "🧴", desc: "Bottles, containers, plastics" },
  { id: "paper", label: "Paper", rate: 10, icon: "📄", desc: "Newspapers, documents, flyers" },
  { id: "metal", label: "Metal", rate: 20, icon: "🥫", desc: "Beverage cans, tin, aluminum" },
  { id: "glass", label: "Glass", rate: 25, icon: "🍾", desc: "Glass bottles, jars" },
  { id: "cardboard", label: "Cardboard", rate: 10, icon: "📦", desc: "Packing boxes, cartons" },
  { id: "other", label: "Other", rate: 5, icon: "🗑️", desc: "Miscellaneous recyclable items" },
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
      .catch(() => {
        // Fallback
      });
  }, [user, authLoading, router]);

  const activeCategory = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];
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
    <main className="min-h-screen bg-gray-50 pb-16">
      <Navbar />

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Dispose Waste</h2>
            <p className="mt-1 text-sm text-gray-600">
              Select your segregated waste category, specify mass, and earn EcoPoints.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-green-700 hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Success Alert */}
        {successInfo && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🎉</span>
              <div>
                <h4 className="text-lg font-bold text-green-900">Disposal Recorded Successfully!</h4>
                <p className="mt-1 text-sm text-green-800">
                  You earned{" "}
                  <span className="font-bold text-green-700">+{successInfo.pointsEarned} EcoPoints</span>.
                  Your updated balance is{" "}
                  <span className="font-bold text-green-700">{successInfo.newTotal} pts</span>.
                </p>
                <div className="mt-4 flex gap-3">
                  <Link
                    href="/dashboard"
                    className="rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700"
                  >
                    View Dashboard
                  </Link>
                  <Link
                    href="/history"
                    className="rounded-lg border border-green-600 px-4 py-2 text-xs font-semibold text-green-700 hover:bg-green-100"
                  >
                    View History
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          {/* Waste Category Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-800">
              1. Select Waste Category (Manual Segregation)
            </label>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex flex-col items-center rounded-xl border p-4 text-center transition-all ${
                      isSelected
                        ? "border-green-600 bg-green-50/70 shadow-sm ring-2 ring-green-600/30"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="mt-2 text-sm font-bold text-gray-900">{cat.label}</span>
                    <span className="mt-1 text-xs font-semibold text-green-700">
                      +{cat.rate} pts / kg
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Input */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-800">
                2. Quantity (kg)
              </label>
              {parsedQuantity > 0 && (
                <span className="text-xs font-semibold text-green-700">
                  Estimated Reward: ⭐ +{estimatedPoints} EcoPoints
                </span>
              )}
            </div>
            <input
              type="number"
              min="0.1"
              max="500"
              step="0.1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 2.5"
              required
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
          </div>

          {/* Select Smart Bin */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-800">
              3. Select EcoSort Simulated Smart Bin
            </label>
            <select
              value={selectedBinId}
              onChange={(e) => setSelectedBinId(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            >
              {bins.map((bin) => (
                <option key={bin._id} value={bin._id}>
                  {bin.name} ({bin.location}) — Fill: {bin.simulatedFillPercentage}% ({bin.status})
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-gray-500">
              Disposing updates the selected bin&apos;s simulated capacity in real time.
            </p>
          </div>

          {/* Optional Note */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-800">
              4. Optional Notes / Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Clean beverage bottles after campus event"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="mt-8 w-full rounded-lg bg-green-600 py-3.5 font-bold text-white shadow-sm hover:bg-green-700 disabled:opacity-60 transition-colors"
          >
            {submitting ? "Recording Disposal..." : "Submit Disposal & Earn EcoPoints"}
          </button>

          {/* PBL Transparency Notice */}
          <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4 text-center">
            <p className="text-xs text-gray-500">
              🌱 <span className="font-semibold text-gray-700">Web PBL Mode:</span> Waste category selection is
              manual. Points and bin fill levels are calculated deterministically on the server without IoT/ML hardware.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}