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
        bar: "bg-red-500",
        label: "Full - Requires Collection",
      };
    }
    if (percentage >= 70 || status === "Almost Full") {
      return {
        bg: "bg-amber-50 text-amber-700 border-amber-200",
        bar: "bg-amber-500",
        label: "Almost Full",
      };
    }
    return {
      bg: "bg-green-50 text-green-700 border-green-200",
      bar: "bg-green-500",
      label: "Available",
    };
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Smart Bins Status</h2>
            <p className="mt-1 text-sm text-gray-600">
              Live simulated monitoring of community waste bins and capacity levels.
            </p>
          </div>

          <button
            onClick={fetchBins}
            className="self-start rounded-lg border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 sm:self-auto"
          >
            ↻ Refresh Bins
          </button>
        </div>

        {/* PBL Architecture Banner */}
        <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50/70 p-5 text-sm text-blue-900 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-bold">Web Technology PBL Simulation Architecture</p>
              <p className="mt-1 text-xs text-blue-800 leading-relaxed">
                As required by this Web Technology project, hardware sensors (ultrasonic / Arduino) are replaced
                with a deterministic software simulation. Fill levels update dynamically as users log waste
                records, and administrators can simulate fill levels directly through backend endpoints.
              </p>
            </div>
          </div>
        </div>

        {feedback && (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            ✅ {feedback}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
            <p className="mt-3 text-sm font-medium text-gray-500">Checking bin statuses...</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bins.map((bin) => {
              const statusInfo = getStatusBadge(bin.status, bin.simulatedFillPercentage);
              const isUpdating = updatingId === bin._id;

              return (
                <div
                  key={bin._id}
                  className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">🗑️</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${statusInfo.bg}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-bold text-gray-900">{bin.name}</h3>
                    <p className="text-xs text-gray-500 font-medium">{bin.binId}</p>
                    <p className="mt-1 text-xs text-gray-600">📍 {bin.location}</p>

                    <div className="mt-3 inline-block rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600 font-medium">
                      Accepted: <span className="font-bold text-gray-800">{bin.acceptedCategory}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                      <div className="flex justify-between text-xs font-semibold text-gray-700">
                        <span>Fill Level</span>
                        <span>
                          {bin.simulatedFillPercentage}% ({bin.currentFillKg} / {bin.capacityKg} kg)
                        </span>
                      </div>

                      <div className="mt-2 h-3 w-full rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${statusInfo.bar}`}
                          style={{ width: `${Math.min(100, bin.simulatedFillPercentage)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Admin Simulation Controls */}
                  {user?.role === "admin" && (
                    <div className="mt-6 border-t border-gray-100 pt-4">
                      <p className="text-xs font-semibold text-gray-500 mb-2">
                        Simulate Level (Admin Tool):
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {[20, 50, 80, 95].map((pct) => (
                          <button
                            key={pct}
                            disabled={isUpdating}
                            onClick={() => handleSimulate(bin._id, pct)}
                            className="rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-green-50 hover:text-green-700 hover:border-green-200 disabled:opacity-50 transition-colors"
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