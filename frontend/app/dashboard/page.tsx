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
      <main className="min-h-screen bg-slate-50/60">
        <Navbar />
        <div className="flex h-96 items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-gray-500">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Loading Dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  const categoryMeta: Record<string, { icon: string; label: string; color: string }> = {
    plastic: { icon: "🧴", label: "Plastic", color: "bg-blue-50 border-blue-200 text-blue-800" },
    paper: { icon: "📄", label: "Paper", color: "bg-amber-50 border-amber-200 text-amber-800" },
    metal: { icon: "🥫", label: "Metal", color: "bg-slate-100 border-slate-300 text-slate-800" },
    glass: { icon: "🍾", label: "Glass", color: "bg-emerald-50 border-emerald-200 text-emerald-800" },
    cardboard: { icon: "📦", label: "Cardboard", color: "bg-orange-50 border-orange-200 text-orange-800" },
    organic: { icon: "🍌", label: "Organic", color: "bg-lime-50 border-lime-200 text-lime-800" },
    "e-waste": { icon: "⚡", label: "E-Waste", color: "bg-purple-50 border-purple-200 text-purple-800" },
    other: { icon: "🗑️", label: "Other", color: "bg-gray-100 border-gray-200 text-gray-700" },
  };

  return (
    <main className="min-h-screen bg-slate-50/60 pb-20">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800 mb-2">
              <span>🌱</span> EcoSort Member Workspace
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome back, <span className="text-emerald-700">{user?.name}</span>!
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Track your waste segregation impact, spend your EcoPoints, and monitor campus smart bins.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/dispose"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition active:scale-95"
            >
              <span>+</span>
              <span>Dispose Waste</span>
            </Link>
            <Link
              href="/rewards"
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-900 shadow-sm hover:bg-amber-100 transition active:scale-95"
            >
              <span>🎁</span>
              <span>Rewards Store</span>
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            ⚠️ {error}
          </div>
        )}

        {/* 4 Core Metric Widgets */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. EcoPoints */}
          <div className="relative overflow-hidden rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50/50 via-white to-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-3xl">⭐</span>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-800">
                Reward Balance
              </span>
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-400">EcoPoints</p>
            <h3 className="mt-1 text-3xl font-black text-amber-500">
              {stats?.ecoPoints ?? 0}
            </h3>
            <Link href="/rewards" className="mt-3 inline-block text-xs font-bold text-emerald-700 hover:underline">
              Redeem Rewards →
            </Link>
          </div>

          {/* 2. Total Mass */}
          <div className="relative overflow-hidden rounded-3xl border border-blue-200/80 bg-gradient-to-br from-blue-50/50 via-white to-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-3xl">♻️</span>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-extrabold text-blue-800">
                Total Recycled
              </span>
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-400">Segregated Mass</p>
            <h3 className="mt-1 text-3xl font-black text-gray-900">
              {stats?.totalWasteKg ?? 0} <span className="text-base font-normal text-gray-500">kg</span>
            </h3>
            <p className="mt-3 text-xs text-gray-500">Across {stats?.totalContributions ?? 0} sessions</p>
          </div>

          {/* 3. Material Recovery Score (MRS) */}
          <div className="relative overflow-hidden rounded-3xl border border-purple-200/80 bg-gradient-to-br from-purple-50/50 via-white to-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-3xl">🎯</span>
              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-extrabold text-purple-800">
                Efficiency Index
              </span>
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-400">Recovery Score</p>
            <h3 className="mt-1 text-3xl font-black text-purple-700">
              {stats?.materialRecoveryScore ?? 0}
              <span className="text-base font-normal text-gray-400"> / 100</span>
            </h3>
            <div className="mt-3 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-1.5 rounded-full bg-purple-600 transition-all duration-700"
                style={{ width: `${Math.min(100, stats?.materialRecoveryScore ?? 0)}%` }}
              ></div>
            </div>
          </div>

          {/* 4. Smart Bins */}
          <div className="relative overflow-hidden rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/50 via-white to-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-3xl">📍</span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
                Campus Bins
              </span>
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-400">Available Bins</p>
            <h3 className="mt-1 text-3xl font-black text-emerald-700">
              {stats?.availableBinsCount ?? 0}
              <span className="text-base font-normal text-gray-400"> / {stats?.totalBinsCount ?? 0}</span>
            </h3>
            <Link href="/bins" className="mt-3 inline-block text-xs font-bold text-emerald-700 hover:underline">
              Inspect Fill Levels →
            </Link>
          </div>
        </div>

        {/* Category Segregation Breakdown */}
        <div className="mt-8 rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-6">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">Your Segregated Waste by Stream</h3>
              <p className="text-xs text-gray-500">Live breakdown calculated from your stored disposal entries</p>
            </div>
            <Link href="/history" className="text-xs font-bold text-emerald-700 hover:underline">
              Detailed History Ledger →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {Object.entries(stats?.categoryTotals || {}).map(([category, kg]) => {
              const meta = categoryMeta[category] || categoryMeta.other;
              return (
                <div
                  key={category}
                  className={`flex flex-col items-center justify-center rounded-2xl border p-3.5 text-center transition-all hover:scale-105 ${meta.color}`}
                >
                  <span className="text-2xl">{meta.icon}</span>
                  <span className="mt-1.5 text-[11px] font-bold uppercase tracking-wider">
                    {meta.label}
                  </span>
                  <span className="mt-1 text-sm font-extrabold text-gray-900">{kg} kg</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Banners */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-gradient-to-br from-emerald-800 to-teal-800 p-6 text-white shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-3xl">🗑️</span>
              <h4 className="mt-3 text-lg font-bold">Log New Disposal</h4>
              <p className="mt-1 text-xs text-emerald-100 leading-relaxed">
                Manually record items across all 8 recyclable categories to earn points immediately.
              </p>
            </div>
            <Link
              href="/dispose"
              className="mt-5 inline-block text-center rounded-xl bg-white py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition"
            >
              Open Disposal Form →
            </Link>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-amber-600 to-yellow-600 p-6 text-white shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-3xl">🎁</span>
              <h4 className="mt-3 text-lg font-bold">EcoPoints Rewards Store</h4>
              <p className="mt-1 text-xs text-amber-100 leading-relaxed">
                Exchange points for campus dining vouchers, coffee passes, and eco-merchandise.
              </p>
            </div>
            <Link
              href="/rewards"
              className="mt-5 inline-block text-center rounded-xl bg-white py-2 text-xs font-bold text-amber-900 hover:bg-amber-50 transition"
            >
              Redeem Rewards →
            </Link>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-indigo-800 to-purple-800 p-6 text-white shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-3xl">🏆</span>
              <h4 className="mt-3 text-lg font-bold">Community Leaderboard</h4>
              <p className="mt-1 text-xs text-indigo-100 leading-relaxed">
                See where you rank among top recyclers in the community and campus.
              </p>
            </div>
            <Link
              href="/leaderboard"
              className="mt-5 inline-block text-center rounded-xl bg-white py-2 text-xs font-bold text-indigo-900 hover:bg-indigo-50 transition"
            >
              View Standings →
            </Link>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="mt-8 rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">Recent Disposals</h3>
              <p className="text-xs text-gray-500">Your 5 latest verified submissions</p>
            </div>
            <Link href="/history" className="text-xs font-bold text-emerald-700 hover:underline">
              All Activity History →
            </Link>
          </div>

          {recentActivity.length === 0 ? (
            <div className="py-12 text-center">
              <span className="text-4xl">🌱</span>
              <p className="mt-2 text-sm font-semibold text-gray-700">No disposal sessions logged yet.</p>
              <p className="text-xs text-gray-400 mt-0.5">Start sorting recyclable waste to earn EcoPoints.</p>
              <Link
                href="/dispose"
                className="mt-4 inline-block rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
              >
                Log First Waste Disposal
              </Link>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-gray-100">
              {recentActivity.map((rec) => {
                const meta = categoryMeta[rec.wasteCategory] || categoryMeta.other;
                return (
                  <div key={rec._id} className="flex items-center justify-between py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-xl">
                        {meta.icon}
                      </div>
                      <div>
                        <p className="text-xs font-extrabold capitalize text-gray-900">
                          {rec.wasteCategory} Waste
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {rec.quantity} kg • {rec.binName || "General Bin"} • {new Date(rec.disposalDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700 border border-emerald-200">
                        +{rec.pointsEarned} pts
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}