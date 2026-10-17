"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { api, DashboardStats, WasteRecord } from "../../lib/api";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<WasteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      setLoading(true);
      api.dashboard
        .getStats()
        .then((res) => {
          if (res.success) {
            setStats(res.stats);
            setRecentActivity(res.recentActivity || []);
          }
        })
        .catch((err) => {
          setError(err.message || "Failed to load dashboard data.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user, authLoading, router]);

  if (authLoading || (loading && !stats)) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex h-96 items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-gray-500">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
            <p className="text-sm font-medium">Loading your EcoSort dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  const categoryIcons: Record<string, string> = {
    plastic: "🧴",
    paper: "📄",
    metal: "🥫",
    glass: "🍾",
    cardboard: "📦",
    other: "🗑️",
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Welcome Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
            <p className="mt-1 text-gray-600">
              Welcome back, <span className="font-semibold text-green-700">{user?.name}</span>! Track your
              environmental impact and points.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dispose"
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white shadow-sm hover:bg-green-700 transition-colors"
            >
              <span>+</span>
              <span>Dispose Waste</span>
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            ⚠️ {error}
          </div>
        )}

        {/* Primary Metrics Grid */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* EcoPoints */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-3xl">⭐</span>
              <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700 border border-green-200">
                Reward Balance
              </span>
            </div>
            <p className="mt-4 text-sm text-gray-500">EcoPoints Balance</p>
            <h3 className="mt-1 text-3xl font-bold text-green-700">
              {stats?.ecoPoints ?? 0}
            </h3>
          </div>

          {/* Waste Disposed */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-3xl">♻️</span>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                Total Mass
              </span>
            </div>
            <p className="mt-4 text-sm text-gray-500">Waste Disposed</p>
            <h3 className="mt-1 text-3xl font-bold text-gray-900">
              {stats?.totalWasteKg ?? 0} <span className="text-base font-normal text-gray-500">kg</span>
            </h3>
          </div>

          {/* Contributions */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-3xl">🌍</span>
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                Activities
              </span>
            </div>
            <p className="mt-4 text-sm text-gray-500">Disposal Sessions</p>
            <h3 className="mt-1 text-3xl font-bold text-gray-900">
              {stats?.totalContributions ?? 0}
            </h3>
          </div>

          {/* Material Recovery Score */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-3xl">🎯</span>
              <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 border border-purple-200">
                MRS Index
              </span>
            </div>
            <p className="mt-4 text-sm text-gray-500">Recovery Score</p>
            <h3 className="mt-1 text-3xl font-bold text-purple-700">
              {stats?.materialRecoveryScore ?? 0}
              <span className="text-base font-normal text-gray-500"> / 100</span>
            </h3>
          </div>
        </div>

        {/* Category Breakdown Section */}
        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Waste Segregation by Category</h3>
            <span className="text-xs text-gray-500">Measured in kilograms</span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Object.entries(stats?.categoryTotals || {}).map(([category, kg]) => (
              <div
                key={category}
                className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center transition hover:bg-green-50/50"
              >
                <div className="text-2xl">{categoryIcons[category] || "📦"}</div>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {category}
                </p>
                <p className="mt-1 text-lg font-bold text-gray-900">{kg} kg</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Action 1 */}
          <div className="rounded-2xl bg-gradient-to-br from-green-700 to-emerald-800 p-8 text-white shadow-sm">
            <div className="text-4xl">🗑️</div>
            <h3 className="mt-4 text-2xl font-bold">Record Waste Disposal</h3>
            <p className="mt-2 text-green-100 text-sm leading-relaxed">
              Log your sorted recyclable waste to earn verified EcoPoints and improve your community recovery score.
            </p>
            <Link
              href="/dispose"
              className="mt-6 inline-block rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-green-800 shadow-sm hover:bg-green-50 transition-colors"
            >
              Open Disposal Form →
            </Link>
          </div>

          {/* Action 2 */}
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-4xl">📍</div>
              <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 border border-green-200">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                {stats?.availableBinsCount ?? 0} Bins Available
              </span>
            </div>
            <h3 className="mt-4 text-2xl font-bold text-gray-900">Nearby Smart Bins</h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              Check simulated fill levels for campus and community bins before disposing of your materials.
            </p>
            <Link
              href="/bins"
              className="mt-6 inline-block rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 transition-colors"
            >
              View Bin Status →
            </Link>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
            <Link href="/history" className="text-sm font-semibold text-green-600 hover:underline">
              View All History →
            </Link>
          </div>

          {recentActivity.length === 0 ? (
            <div className="mt-8 py-8 text-center">
              <span className="text-4xl">🌱</span>
              <p className="mt-3 text-sm font-medium text-gray-600">No disposal records yet.</p>
              <p className="mt-1 text-xs text-gray-400">
                Submit your first waste disposal to earn EcoPoints!
              </p>
              <Link
                href="/dispose"
                className="mt-4 inline-block rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700"
              >
                Dispose Waste Now
              </Link>
            </div>
          ) : (
            <div className="mt-6 divide-y divide-gray-100">
              {recentActivity.map((record) => (
                <div key={record._id} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-xl border border-green-100">
                      {categoryIcons[record.wasteCategory] || "♻️"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold capitalize text-gray-900">
                        {record.wasteCategory} Waste
                      </p>
                      <p className="text-xs text-gray-500">
                        {record.quantity} kg • {record.binName || "General Bin"} •{" "}
                        {new Date(record.disposalDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700 border border-green-200">
                      +{record.pointsEarned} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}