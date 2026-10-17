"use client";

import React, { useEffect, useState, useMemo } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { api, Bin, LocationGroup } from "../../lib/api";
import {
  Layers,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Sliders,
  Activity,
  Building2,
  Navigation,
} from "lucide-react";

export default function BinsPage() {
  const { user } = useAuth();
  const [bins, setBins] = useState<Bin[]>([]);
  const [locations, setLocations] = useState<LocationGroup[]>([]);
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedArea, setSelectedArea] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchBinsAndLocations = () => {
    setLoading(true);
    Promise.all([
      api.bins.getAll().catch((err) => {
        setError(err.message || "Failed to load bins.");
        return { success: false, bins: [] };
      }),
      api.bins.getLocations().catch(() => ({ success: false, locations: [] })),
    ])
      .then(([binsRes, locRes]) => {
        if (binsRes.bins) setBins(binsRes.bins);
        if (locRes.locations) setLocations(locRes.locations);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBinsAndLocations();
  }, []);

  const handleUpdateFill = async (binId: string, percentage: number) => {
    setUpdatingId(binId);
    setFeedback(null);
    try {
      const res = await api.bins.simulateFill(binId, percentage);
      if (res.success) {
        setFeedback(`Updated ${res.bin.name} to ${percentage}% fill level.`);
        fetchBinsAndLocations();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Update failed. Requires Administrator role.";
      setError(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const availableAreas = useMemo(() => {
    if (selectedCity === "All") return [];
    const group = locations.find(
      (l) => l.city.toLowerCase() === selectedCity.toLowerCase()
    );
    return group ? group.areas : [];
  }, [locations, selectedCity]);

  const filteredBins = useMemo(() => {
    return bins.filter((bin) => {
      const matchCity =
        selectedCity === "All" ||
        bin.city?.toLowerCase() === selectedCity.toLowerCase();
      const matchArea =
        selectedArea === "All" ||
        bin.area?.toLowerCase() === selectedArea.toLowerCase();
      return matchCity && matchArea;
    });
  }, [bins, selectedCity, selectedArea]);

  const getStatusBadge = (status: string, percentage: number) => {
    if (percentage >= 90 || status === "Full") {
      return {
        bg: "bg-red-950/70 text-red-400 border-red-800/60",
        bar: "bg-gradient-to-r from-red-500 to-rose-600",
        label: "Full - Requires Collection",
        color: "text-red-400",
      };
    }
    if (percentage >= 70 || status === "Almost Full") {
      return {
        bg: "bg-amber-950/70 text-amber-400 border-amber-800/60",
        bar: "bg-gradient-to-r from-amber-500 to-yellow-500",
        label: "Almost Full",
        color: "text-amber-400",
      };
    }
    return {
      bg: "bg-emerald-950/70 text-emerald-400 border-emerald-800/60",
      bar: "bg-gradient-to-r from-emerald-500 to-teal-500",
      label: "Available",
      color: "text-emerald-400",
    };
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-20 selection:bg-emerald-500 selection:text-black">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/70 border border-emerald-800/60 px-3 py-0.5 text-xs font-bold text-emerald-400 mb-2">
              <Activity className="h-3.5 w-3.5" />
              <span>Smart Bin Fleet Monitoring</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Smart Bins Status</h2>
            <p className="mt-1 text-sm text-slate-400">
              Live telemetry of community waste receptacles, capacity utilization, and collection status.
            </p>
          </div>

          <button
            onClick={fetchBinsAndLocations}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-200 shadow-md hover:bg-slate-800 hover:text-white transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh Telemetry</span>
          </button>
        </div>

        {/* Location Filter Bar */}
        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-bold text-white">Filter by Community Location:</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* City Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-slate-500" />
                  <span>City / Village:</span>
                </span>
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setSelectedArea("All");
                  }}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white outline-none focus:border-emerald-500"
                >
                  <option value="All">All Locations</option>
                  <option value="Kodakara">Kodakara Village</option>
                  <option value="Chalakudy">Chalakudy Town</option>
                  <option value="Irinjalakuda">Irinjalakuda Town</option>
                  <option value="Thrissur">Thrissur City</option>
                </select>
              </div>

              {/* Area Filter */}
              {selectedCity !== "All" && availableAreas.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Navigation className="h-3.5 w-3.5 text-slate-500" />
                    <span>Area:</span>
                  </span>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white outline-none focus:border-emerald-500"
                  >
                    <option value="All">All Areas in {selectedCity}</option>
                    {availableAreas.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {feedback && (
          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-emerald-800/60 bg-emerald-950/60 p-4 text-xs font-semibold text-emerald-300 shadow-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{feedback}</span>
          </div>
        )}

        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-950/60 p-4 text-xs font-semibold text-red-300 shadow-sm">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
            <p className="mt-3 text-sm text-slate-400 font-medium">Checking bin telemetry...</p>
          </div>
        ) : filteredBins.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-12 text-center">
            <p className="text-sm font-semibold text-slate-300">No bins found matching this location filter.</p>
            <button
              onClick={() => {
                setSelectedCity("All");
                setSelectedArea("All");
              }}
              className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500"
            >
              Reset Location Filter
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBins.map((bin) => {
              const statusInfo = getStatusBadge(bin.status, bin.simulatedFillPercentage);
              const isUpdating = updatingId === bin._id;

              return (
                <div
                  key={bin._id}
                  className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 shadow-xl hover:border-slate-700 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      {/* Unique Bin Number Badge */}
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-950 border border-emerald-700/80 px-2.5 py-1 text-xs font-mono font-black text-emerald-400">
                        <span>#{bin.binId}</span>
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold border ${statusInfo.bg}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-extrabold text-white">{bin.name}</h3>

                    {/* Community Ward & Street Location */}
                    <div className="mt-2 space-y-1">
                      <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                        <Building2 className="h-3 w-3 shrink-0" />
                        <span>{bin.city || "Kodakara"} • {bin.area || "Main Junction"}</span>
                      </p>
                      <p className="text-xs text-slate-400 flex items-start gap-1.5">
                        <MapPin className="h-3 w-3 text-slate-500 shrink-0 mt-0.5" />
                        <span>{bin.location}</span>
                      </p>
                    </div>

                    <div className="mt-3 inline-block rounded-lg bg-slate-950 px-2.5 py-1 text-[11px] text-slate-300 font-semibold border border-slate-800">
                      Accepted: <span className="font-extrabold text-emerald-400">{bin.acceptedCategory}</span>
                    </div>

                    {/* Fill Progress Meter */}
                    <div className="mt-6 pt-4 border-t border-slate-800">
                      <div className="flex justify-between text-xs font-bold text-slate-300">
                        <span>Fill Level</span>
                        <span className={statusInfo.color}>
                          {bin.simulatedFillPercentage}%
                        </span>
                      </div>

                      <div className="mt-2 h-3.5 w-full rounded-full bg-slate-950 p-0.5 overflow-hidden border border-slate-800">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${statusInfo.bar}`}
                          style={{ width: `${Math.min(100, bin.simulatedFillPercentage)}%` }}
                        ></div>
                      </div>

                      <div className="mt-2 flex justify-between text-[11px] text-slate-400 font-medium">
                        <span>{bin.currentFillKg} kg deposited</span>
                        <span>Capacity: {bin.capacityKg} kg</span>
                      </div>
                    </div>
                  </div>

                  {/* Admin Fill Level Adjuster */}
                  {user?.role === "admin" && (
                    <div className="mt-6 border-t border-slate-800 pt-3">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 flex items-center gap-1">
                        <Sliders className="h-3 w-3 text-emerald-400" />
                        <span>Set Fill Level (Admin):</span>
                      </p>
                      <div className="grid grid-cols-4 gap-1">
                        {[15, 50, 80, 95].map((pct) => (
                          <button
                            key={pct}
                            disabled={isUpdating}
                            onClick={() => handleUpdateFill(bin._id, pct)}
                            className="rounded-lg border border-slate-800 bg-slate-950 py-1 text-xs font-extrabold text-slate-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 disabled:opacity-50 transition"
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}