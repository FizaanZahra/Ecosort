"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { api, Bin } from "../../lib/api";
import {
  Layers,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Sliders,
  Activity,
} from "lucide-react";

export default function BinsPage() {
  const { user } = useAuth();
  const [bins, setBins] = useState<Bin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchBins = () => {
    setLoading(true);
    api.bins
      .getAll()
      .then((res) => {
        if (res.bins) {
          setBins(res.bins);
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load bin statuses.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBins();
  }, []);

  const handleUpdateFill = async (binId: string, percentage: number) => {
    setUpdatingId(binId);
    setFeedback(null);
    try {
      const res = await api.bins.simulateFill(binId, percentage);
      if (res.success) {
        setFeedback(`Updated ${res.bin.name} to ${percentage}% fill level.`);
        fetchBins();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Update failed. Requires Administrator role.";
      setError(msg);
    } finally {
      setUpdatingId(null);
    }
  };

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
              Live telemetry of campus waste receptacles, capacity utilization, and collection status.
            </p>
          </div>

          <button
            onClick={fetchBins}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-200 shadow-md hover:bg-slate-800 hover:text-white transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh Telemetry</span>
          </button>
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
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bins.map((bin) => {
              const statusInfo = getStatusBadge(bin.status, bin.simulatedFillPercentage);
              const isUpdating = updatingId === bin._id;

              return (
                <div
                  key={bin._id}
                  className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 shadow-xl hover:border-slate-700 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 border border-slate-800 text-emerald-400">
                        <Trash2 className="h-6 w-6" />
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold border ${statusInfo.bg}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-extrabold text-white">{bin.name}</h3>
                    <p className="text-[11px] font-mono text-slate-500">{bin.binId}</p>
                    <p className="mt-1 text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-500" />
                      <span>{bin.location}</span>
                    </p>

                    <div className="mt-3 inline-block rounded-lg bg-slate-950 px-2.5 py-1 text-[11px] text-slate-300 font-semibold border border-slate-800">
                      Streams: <span className="font-extrabold text-emerald-400">{bin.acceptedCategory}</span>
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
                        <span>{bin.currentFillKg} kg filled</span>
                        <span>Capacity: {bin.capacityKg} kg</span>
                      </div>
                    </div>
                  </div>

                  {/* Admin Fill Level Adjuster */}
                  {user?.role === "admin" && (
                    <div className="mt-6 border-t border-slate-800 pt-3">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 flex items-center gap-1">
                        <Sliders className="h-3 w-3 text-emerald-400" />
                        <span>Adjust Fill Level (Admin):</span>
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