"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { api, Bin, LocationGroup } from "../../lib/api";
import {
  Recycle,
  Scale,
  Coins,
  Gift,
  History,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Cpu,
  Wine,
  Zap,
  Box,
  Apple,
  FileText,
  Layers,
  Trash2,
  Check,
  MapPin,
  Building2,
  Navigation,
} from "lucide-react";

const CATEGORIES = [
  { id: "e-waste", label: "E-Waste", rate: 40, icon: Cpu, desc: "Batteries, circuits, cables, gadgets", color: "text-amber-400 bg-amber-950/40 border-amber-800/40" },
  { id: "glass", label: "Glass", rate: 25, icon: Wine, desc: "Bottles, jars, transparent glass", color: "text-cyan-400 bg-cyan-950/40 border-cyan-800/40" },
  { id: "metal", label: "Metal", rate: 20, icon: Zap, desc: "Beverage cans, tin, aluminum containers", color: "text-blue-400 bg-blue-950/40 border-blue-800/40" },
  { id: "plastic", label: "Plastic", rate: 15, icon: Box, desc: "PET/HDPE bottles, clean containers", color: "text-emerald-400 bg-emerald-950/40 border-emerald-800/40" },
  { id: "organic", label: "Organic", rate: 12, icon: Apple, desc: "Food scraps, fruit peels, compostables", color: "text-lime-400 bg-lime-950/40 border-lime-800/40" },
  { id: "paper", label: "Paper", rate: 10, icon: FileText, desc: "Newspapers, notebooks, clean sheets", color: "text-indigo-400 bg-indigo-950/40 border-indigo-800/40" },
  { id: "cardboard", label: "Cardboard", rate: 10, icon: Layers, desc: "Corrugated boxes, packaging cartons", color: "text-orange-400 bg-orange-950/40 border-orange-800/40" },
  { id: "other", label: "Other", rate: 5, icon: Trash2, desc: "Miscellaneous dry recyclable items", color: "text-slate-400 bg-slate-900 border-slate-700" },
];

export default function DisposePage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();

  const [bins, setBins] = useState<Bin[]>([]);
  const [locations, setLocations] = useState<LocationGroup[]>([]);
  const [selectedCity, setSelectedCity] = useState("Kodakara");
  const [selectedArea, setSelectedArea] = useState("All");

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
    binName?: string;
  } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    // Load available locations and all bins
    Promise.all([
      api.bins.getLocations().catch(() => ({ success: false, locations: [] })),
      api.bins.getAll().catch(() => ({ success: false, bins: [] })),
    ]).then(([locRes, binsRes]) => {
      if (locRes.success && locRes.locations.length > 0) {
        setLocations(locRes.locations);
      }
      if (binsRes.success && binsRes.bins.length > 0) {
        setBins(binsRes.bins);
        // Find first Kodakara bin
        const firstKodakaraBin = binsRes.bins.find(
          (b) => b.city?.toLowerCase() === "kodakara"
        );
        if (firstKodakaraBin) {
          setSelectedBinId(firstKodakaraBin._id);
        } else {
          setSelectedBinId(binsRes.bins[0]._id);
        }
      }
    });
  }, [user, authLoading, router]);

  // Available areas for selected city
  const availableAreas = useMemo(() => {
    const group = locations.find(
      (l) => l.city.toLowerCase() === selectedCity.toLowerCase()
    );
    return group ? group.areas : [];
  }, [locations, selectedCity]);

  // Bins filtered by chosen city and area
  const filteredBins = useMemo(() => {
    return bins.filter((bin) => {
      const matchCity =
        !selectedCity ||
        selectedCity === "All" ||
        bin.city?.toLowerCase() === selectedCity.toLowerCase();
      const matchArea =
        !selectedArea ||
        selectedArea === "All" ||
        bin.area?.toLowerCase() === selectedArea.toLowerCase();
      return matchCity && matchArea;
    });
  }, [bins, selectedCity, selectedArea]);

  // Auto-select first matching bin when filtered bins change
  useEffect(() => {
    if (filteredBins.length > 0) {
      const currentExists = filteredBins.some((b) => b._id === selectedBinId);
      if (!currentExists) {
        setSelectedBinId(filteredBins[0]._id);
      }
    }
  }, [filteredBins, selectedBinId]);

  const activeCategory = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[3];
  const parsedQuantity = parseFloat(quantity) || 0;
  const estimatedPoints = parsedQuantity > 0 ? Math.max(5, Math.round(parsedQuantity * activeCategory.rate)) : 0;
  const activeBin = bins.find((b) => b._id === selectedBinId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessInfo(null);

    if (parsedQuantity <= 0) {
      setError("Please enter a valid quantity greater than 0 kg.");
      return;
    }

    if (!selectedBinId) {
      setError("Please select an available waste bin in your location.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.waste.recordDisposal({
        wasteCategory: selectedCategory,
        quantity: parsedQuantity,
        binId: selectedBinId,
        description: description || undefined,
      });

      if (res.success) {
        setSuccessInfo({
          pointsEarned: res.pointsEarned,
          newTotal: res.newTotalPoints,
          recordId: res.record._id,
          binName: res.record.binName || activeBin?.name,
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
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-20 selection:bg-emerald-500 selection:text-black">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/70 border border-emerald-800/60 px-3 py-0.5 text-xs font-bold text-emerald-400 mb-2">
              <Recycle className="h-3 w-3" />
              <span>Household Waste Segregation</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Record Waste Disposal</h2>
            <p className="mt-1 text-sm text-slate-400">
              Categorize sorted household recyclables, choose your local disposal station, and collect EcoPoints.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* Success Alert */}
        {successInfo && (
          <div className="mb-8 rounded-3xl border border-emerald-800/60 bg-emerald-950/60 p-6 shadow-xl animate-in fade-in">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 border border-emerald-700 text-emerald-400">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-white">Disposal Recorded & Verified</h4>
                <p className="mt-1 text-sm text-emerald-300">
                  Congratulations! You earned{" "}
                  <span className="font-extrabold text-emerald-400">+{successInfo.pointsEarned} EcoPoints</span> for
                  depositing waste at <span className="font-bold text-white">{successInfo.binName}</span>.
                  Your updated balance is{" "}
                  <span className="font-extrabold text-white">{successInfo.newTotal} pts</span>.
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition"
                  >
                    <span>View Dashboard</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/rewards"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-500 transition"
                  >
                    <Gift className="h-3.5 w-3.5" />
                    <span>Spend in Rewards Store</span>
                  </Link>
                  <Link
                    href="/history"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition"
                  >
                    <History className="h-3.5 w-3.5" />
                    <span>History Log</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-950/60 p-4 text-xs font-semibold text-red-300 shadow-sm">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-xl space-y-8">
          {/* 1. Category Selector Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-bold text-white">
                1. Select Waste Category (Standardized Sorting)
              </label>
              <span className="text-xs text-slate-400 font-medium">8 Streams</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const Icon = cat.icon;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`relative flex flex-col items-center justify-between rounded-2xl border p-4 text-center transition-all ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-950/70 shadow-lg ring-2 ring-emerald-500/40 text-white"
                        : "border-slate-800 bg-slate-950/60 hover:border-slate-700 text-slate-300"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-black font-black">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                    <Icon className="h-7 w-7 mb-2 text-emerald-400" />
                    <span className="text-xs font-bold">{cat.label}</span>
                    <span className="mt-1.5 inline-block rounded-full bg-emerald-950 border border-emerald-800/60 px-2 py-0.5 text-[10px] font-extrabold text-emerald-400">
                      +{cat.rate} pts / kg
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Mass Input & Live Reward Preview */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-bold text-white mb-1.5">
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
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-base text-white placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
                <span className="absolute right-4 top-3.5 text-sm font-bold text-slate-500">
                  kg
                </span>
              </div>
              <p className="mt-1.5 text-xs text-slate-400">
                Category Rate: <span className="font-bold text-emerald-400">{activeCategory.rate} points/kg</span>
              </p>
            </div>

            {/* Live Calculation Preview Card */}
            <div className="rounded-2xl border border-emerald-800/60 bg-emerald-950/40 p-5 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold block flex items-center gap-1.5">
                  <Coins className="h-3.5 w-3.5" />
                  <span>Reward Estimator Preview</span>
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-400">
                    +{estimatedPoints}
                  </span>
                  <span className="text-xs font-bold text-emerald-300">EcoPoints</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Formula: {parsedQuantity > 0 ? `${parsedQuantity} kg × ${activeCategory.rate} pts` : "Enter mass in kg above"} (min 5 pts)
              </p>
            </div>
          </div>

          {/* 3. Location-Based Waste Bin Selection (Requested Feature) */}
          <div className="border-t border-slate-800 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-4">
              <div>
                <label className="block text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  <span>3. Location-Based Waste Bin Station Selection</span>
                </label>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select your town or village and area to identify the nearest waste receptacle.
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/60 self-start sm:self-auto">
                {filteredBins.length} bin(s) available
              </span>
            </div>

            {/* City/Village & Local Area Dropdowns */}
            <div className="grid gap-4 sm:grid-cols-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 mb-4">
              {/* City / Village */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>City / Village:</span>
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setSelectedArea("All");
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm text-white font-medium outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                >
                  {locations.length > 0 ? (
                    locations.map((loc) => (
                      <option key={loc.city} value={loc.city} className="bg-slate-900 text-white">
                        {loc.city}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Kodakara">Kodakara</option>
                      <option value="Chalakudy">Chalakudy</option>
                      <option value="Irinjalakuda">Irinjalakuda</option>
                      <option value="Thrissur">Thrissur</option>
                    </>
                  )}
                </select>
              </div>

              {/* Local Area / Ward */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Navigation className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Local Area / Place:</span>
                </label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm text-white font-medium outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                >
                  <option value="All" className="bg-slate-900 text-white">
                    All Areas in {selectedCity}
                  </option>
                  {availableAreas.map((area) => (
                    <option key={area} value={area} className="bg-slate-900 text-white">
                      {area}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bins Selection Cards / Dropdown */}
            {filteredBins.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-center">
                <p className="text-xs text-slate-400">
                  No waste bins found in {selectedArea === "All" ? selectedCity : selectedArea}.
                  Please select another area or view all bins in {selectedCity}.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Bin by Unique Bin Number:
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {filteredBins.map((bin) => {
                    const isSelected = selectedBinId === bin._id;
                    const isFull = bin.simulatedFillPercentage >= 90;

                    return (
                      <div
                        key={bin._id}
                        onClick={() => setSelectedBinId(bin._id)}
                        className={`cursor-pointer rounded-2xl border p-4 transition-all flex flex-col justify-between ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-950/50 ring-2 ring-emerald-500/40 shadow-lg"
                            : "border-slate-800 bg-slate-950/70 hover:border-slate-700"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            {/* Unique Bin Number Badge */}
                            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-950 border border-emerald-700/80 px-2.5 py-1 text-xs font-mono font-black text-emerald-400">
                              <span>#{bin.binId}</span>
                            </span>

                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                                isFull
                                  ? "bg-red-950/80 text-red-400 border-red-800/60"
                                  : bin.simulatedFillPercentage >= 70
                                  ? "bg-amber-950/80 text-amber-400 border-amber-800/60"
                                  : "bg-emerald-950/80 text-emerald-400 border-emerald-800/60"
                              }`}
                            >
                              {bin.simulatedFillPercentage}% Full • {bin.status}
                            </span>
                          </div>

                          <h4 className="text-sm font-extrabold text-white">{bin.name}</h4>
                          <p className="text-xs text-slate-400 mt-1 flex items-start gap-1">
                            <MapPin className="h-3 w-3 text-slate-500 shrink-0 mt-0.5" />
                            <span>{bin.location}</span>
                          </p>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                          <span>
                            Ward: <span className="text-slate-300 font-semibold">{bin.area || bin.city}</span>
                          </span>
                          <span className="text-emerald-400 font-semibold">
                            Accepts: {bin.acceptedCategory}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Bin Confirmation Callout */}
                {activeBin && (
                  <div className="mt-3 p-3.5 rounded-xl border border-emerald-800/60 bg-emerald-950/30 text-xs text-emerald-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>
                        Household waste will be disposed at{" "}
                        <strong className="text-white">#{activeBin.binId} ({activeBin.name})</strong> in{" "}
                        <strong className="text-white">{activeBin.area}, {activeBin.city}</strong>.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 4. Optional Description / Batch Notes */}
          <div>
            <label className="block text-sm font-bold text-white mb-1.5">
              4. Optional Household Waste Notes
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Household plastic bottles, cardboard carton box, or clean glass jars"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/90 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={submitting || !selectedBinId}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/40 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60 transition-all active:scale-[0.99]"
          >
            <span>{submitting ? "Verifying & Recording Disposal..." : "Submit Waste Disposal & Claim EcoPoints"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </main>
  );
}