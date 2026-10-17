"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { api, Bin } from "../../lib/api";

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

  const handleSimulate = async (binId: string, percentage: number) => {
    setUpdatingId(binId);
    setFeedback(null);
    try {
      const res = await api.bins.simulateFill(binId, percentage);
      if (res.success) {
        setFeedback(`Updated ${res.bin.name} to ${percentage}% fill level.`);
        fetchBins();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Simulation update failed. Requires Admin role.";
      setError(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string, percentage: number) => {
    if (percentage >= 90 || status === "Full") {
      return {
        bg: "bg-red-50 text-red-700 border-red-200",
        bar: "bg-gradient-to-r from-red-500 to-rose-600",
        label: "Full - Requires Collection",
        color: "text-red-600",
      };
    }
    if (percentage >= 70 || status === "Almost Full") {
      return {
        bg: "bg-amber-50 text-amber-700 border-amber-200",
        bar: "bg-gradient-to-r from-amber-400 to-yellow-500",
        label: "Almost Full",
        color: "text-amber-600",
      };
    }
    return {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      bar: "bg-gradient-to-r from-emerald-500 to-green-500",
      label: "Available",
      color: "text-emerald-600",
    };
  };

  return (
    <main className="min-h-screen bg-slate-50/60 pb-20">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800 mb-2">
              <span>📍</span> Smart Bin Telemetry Simulation
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Smart Bins Status</h2>
            <p className="mt-1 text-sm text-gray-600">
              Real-time simulated telemetry of campus waste receptacles, capacity utilization, and collection status.
            </p>
          </div>

          <button
            onClick={fetchBins}
            className="self-start sm:self-auto rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition"
          >
            ↻ Refresh Telemetry
          </button>
        </div>

        {/* PBL Architecture Callout */}
        <div className="mt-6 rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white p-6 shadow-sm">
          <div className="flex items-start gap-3.5">
            <span className="text-3xl">💡</span>
            <div>
              <p className="font-extrabold text-blue-950 text-sm">Web Technology PBL Sensor Simulation</p>
              <p className="mt-1 text-xs text-blue-800 leading-relaxed">
                This project eliminates the dependency on fragile physical microcontrollers (Arduino/ESP32) and
                ultrasonic hardware. Instead, all bin capacities, fill percentages, and collection thresholds are
                accurately modeled in our backend database and update dynamically as users submit waste or when
                simulated by administrators.
              </p>
            </div>
          </div>
        </div>

        {feedback && (
          <div className="mt-4 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900 shadow-sm">
            ✅ {feedback}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
            <p className="mt-3 text-sm text-gray-400 font-medium">Checking bin telemetry...</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bins.map((bin) => {
              const statusInfo = getStatusBadge(bin.status, bin.simulatedFillPercentage);
              const isUpdating = updatingId === bin._id;

              return (
                <div
                  key={bin._id}
                  className="flex flex-col justify-between rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm hover:shadow-lg transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">🗑️</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold border ${statusInfo.bg}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-extrabold text-gray-900">{bin.name}</h3>
                    <p className="text-[11px] font-mono text-gray-400">{bin.binId}</p>
                    <p className="mt-1 text-xs text-gray-600">📍 {bin.location}</p>

                    <div className="mt-3 inline-block rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] text-slate-700 font-semibold border border-slate-100">
                      Streams: <span className="font-extrabold text-slate-900">{bin.acceptedCategory}</span>
                    </div>

                    {/* Fill Progress Meter */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex justify-between text-xs font-bold text-gray-800">
                        <span>Fill Level</span>
                        <span className={statusInfo.color}>
                          {bin.simulatedFillPercentage}%
                        </span>
                      </div>

                      <div className="mt-2 h-3.5 w-full rounded-full bg-gray-100 p-0.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${statusInfo.bar}`}
                          style={{ width: `${Math.min(100, bin.simulatedFillPercentage)}%` }}
                        ></div>
                      </div>

                      <div className="mt-2 flex justify-between text-[11px] text-gray-400 font-medium">
                        <span>{bin.currentFillKg} kg filled</span>
                        <span>Capacity: {bin.capacityKg} kg</span>
                      </div>
                    </div>
                  </div>

                  {/* Admin Simulation Quick Buttons */}
                  {user?.role === "admin" && (
                    <div className="mt-6 border-t border-gray-100 pt-3">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">
                        Simulate Fill (Admin):
                      </p>
                      <div className="grid grid-cols-4 gap-1">
                        {[15, 50, 80, 95].map((pct) => (
                          <button
                            key={pct}
                            disabled={isUpdating}
                            onClick={() => handleSimulate(bin._id, pct)}
                            className="rounded-lg border border-gray-200 bg-gray-50 py-1 text-xs font-extrabold text-gray-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 disabled:opacity-50 transition"
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