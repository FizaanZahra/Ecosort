"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { api, DashboardStats, WasteRecord } from "../../lib/api";
import {
  Coins,
  Recycle,
  Target,
  Layers,
  Trash2,
  Gift,
  Trophy,
  ArrowRight,
  AlertCircle,
  Clock,
  Sparkles,
  Zap,
  Wine,
  FileText,
  Box,
  Apple,
  Cpu,
  CheckCircle2,
} from "lucide-react";

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
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <div className="flex h-96 items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Loading Dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  const categoryMeta: Record<string, { icon: React.ComponentType<{ className?: string }>; label: string; color: string }> = {
    plastic: { icon: Box, label: "Plastic", color: "bg-blue-950/40 border-blue-800/40 text-blue-400" },
    paper: { icon: FileText, label: "Paper", color: "bg-amber-950/40 border-amber-800/40 text-amber-400" },
    metal: { icon: Zap, label: "Metal", color: "bg-slate-900 border-slate-700 text-slate-300" },
    glass: { icon: Wine, label: "Glass", color: "bg-cyan-950/40 border-cyan-800/40 text-cyan-400" },
    cardboard: { icon: Layers, label: "Cardboard", color: "bg-orange-950/40 border-orange-800/40 text-orange-400" },
    organic: { icon: Apple, label: "Organic", color: "bg-lime-950/40 border-lime-800/40 text-lime-400" },
    "e-waste": { icon: Cpu, label: "E-Waste", color: "bg-purple-950/40 border-purple-800/40 text-purple-400" },
    other: { icon: Trash2, label: "Other", color: "bg-slate-900 border-slate-700 text-slate-400" },
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-20 selection:bg-emerald-500 selection:text-black">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/70 border border-emerald-800/60 px-3 py-0.5 text-xs font-bold text-emerald-400 mb-2">
              <Sparkles className="h-3 w-3" />
              <span>EcoSort Member Workspace</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-emerald-400">{user?.name}</span>
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Track your waste segregation impact, spend your EcoPoints, and monitor smart bin status.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/dispose"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-950/40 hover:from-emerald-500 hover:to-teal-500 transition active:scale-95"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Dispose Waste</span>
            </Link>
            <Link
              href="/rewards"
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-950/40 px-4 py-2.5 text-xs font-bold text-amber-300 shadow-sm hover:bg-amber-900/40 hover:border-amber-400 transition active:scale-95"
            >
              <Gift className="h-3.5 w-3.5 text-amber-400" />
              <span>Rewards Store</span>
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-950/60 p-4 text-xs font-semibold text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* 4 Core Metric Widgets */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. EcoPoints */}
          <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 p-6 shadow-xl hover:border-amber-500/50 transition">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-950/70 border border-amber-700/50 text-amber-400">
                <Coins className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-amber-950/80 border border-amber-700/60 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-300">
                Reward Balance
              </span>
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">EcoPoints</p>
            <h3 className="mt-1 text-3xl font-black text-amber-400">
              {stats?.ecoPoints ?? 0}
            </h3>
            <Link href="/rewards" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300">
              <span>Redeem Rewards</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* 2. Total Mass */}
          <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-950/30 via-slate-900 to-slate-900 p-6 shadow-xl hover:border-blue-500/50 transition">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-950/70 border border-blue-700/50 text-blue-400">
                <Recycle className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-blue-950/80 border border-blue-700/60 px-2.5 py-0.5 text-[10px] font-extrabold text-blue-300">
                Total Recycled
              </span>
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">Segregated Mass</p>
            <h3 className="mt-1 text-3xl font-black text-white">
              {stats?.totalWasteKg ?? 0} <span className="text-base font-normal text-slate-400">kg</span>
            </h3>
            <p className="mt-3 text-xs text-slate-400">Across {stats?.totalContributions ?? 0} sessions</p>
          </div>

          {/* 3. Material Recovery Score (MRS) */}
          <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-950/30 via-slate-900 to-slate-900 p-6 shadow-xl hover:border-purple-500/50 transition">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-950/70 border border-purple-700/50 text-purple-400">
                <Target className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-purple-950/80 border border-purple-700/60 px-2.5 py-0.5 text-[10px] font-extrabold text-purple-300">
                Efficiency Index
              </span>
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">Recovery Score</p>
            <h3 className="mt-1 text-3xl font-black text-purple-400">
              {stats?.materialRecoveryScore ?? 0}
              <span className="text-base font-normal text-slate-400"> / 100</span>
            </h3>
            <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-700"
                style={{ width: `${Math.min(100, stats?.materialRecoveryScore ?? 0)}%` }}
              ></div>
            </div>
          </div>

          {/* 4. Smart Bins */}
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-900 p-6 shadow-xl hover:border-emerald-500/50 transition">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-950/70 border border-emerald-700/50 text-emerald-400">
                <Layers className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-emerald-950/80 border border-emerald-700/60 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-300">
                Active Bins
              </span>
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">Available Stations</p>
            <h3 className="mt-1 text-3xl font-black text-emerald-400">
              {stats?.availableBinsCount ?? 0}
              <span className="text-base font-normal text-slate-400"> / {stats?.totalBinsCount ?? 0}</span>
            </h3>
            <Link href="/bins" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300">
              <span>Inspect Station Bins</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Category Segregation Breakdown */}
        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-6">
            <div>
              <h3 className="text-lg font-extrabold text-white">Your Segregated Waste by Stream</h3>
              <p className="text-xs text-slate-400">Live breakdown calculated from your stored disposal entries</p>
            </div>
            <Link href="/history" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300">
              <span>Detailed History Ledger</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {Object.entries(stats?.categoryTotals || {}).map(([category, kg]) => {
              const meta = categoryMeta[category] || categoryMeta.other;
              const Icon = meta.icon;
              return (
                <div
                  key={category}
                  className={`flex flex-col items-center justify-center rounded-2xl border p-3.5 text-center transition-all hover:scale-105 ${meta.color}`}
                >
                  <Icon className="h-6 w-6 mb-1.5" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    {meta.label}
                  </span>
                  <span className="mt-1 text-sm font-extrabold text-white">{kg} kg</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Banners */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-emerald-800/60 bg-gradient-to-br from-emerald-950/80 to-slate-900 p-6 text-white shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-950 border border-emerald-700/60 text-emerald-400">
                <Trash2 className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-bold">Log New Disposal</h4>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                Record recyclable waste across 8 categories to earn verified EcoPoints deterministically.
              </p>
            </div>
            <Link
              href="/dispose"
              className="mt-5 inline-flex items-center justify-center gap-1.5 text-center rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-md shadow-emerald-950/40"
            >
              <span>Open Disposal Form</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-3xl border border-amber-800/60 bg-gradient-to-br from-amber-950/80 to-slate-900 p-6 text-white shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-950 border border-amber-700/60 text-amber-400">
                <Gift className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-bold">Rewards Store</h4>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                Exchange accumulated EcoPoints for dining vouchers, beverage passes, and campus perks.
              </p>
            </div>
            <Link
              href="/rewards"
              className="mt-5 inline-flex items-center justify-center gap-1.5 text-center rounded-xl bg-amber-600 py-2.5 text-xs font-bold text-white hover:bg-amber-500 transition shadow-md shadow-amber-950/40"
            >
              <span>Redeem Rewards</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-3xl border border-indigo-800/60 bg-gradient-to-br from-indigo-950/80 to-slate-900 p-6 text-white shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-950 border border-indigo-700/60 text-indigo-400">
                <Trophy className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-bold">Community Leaderboard</h4>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                Compete with campus members and check the top 10 recycling contributors.
              </p>
            </div>
            <Link
              href="/leaderboard"
              className="mt-5 inline-flex items-center justify-center gap-1.5 text-center rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition shadow-md shadow-indigo-950/40"
            >
              <span>View Standings</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-white">Recent Disposals</h3>
              <p className="text-xs text-slate-400">Your 5 latest verified submissions</p>
            </div>
            <Link href="/history" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300">
              <span>All Activity History</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {recentActivity.length === 0 ? (
            <div className="py-12 text-center">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-slate-950 border border-slate-800 text-slate-500 mb-3">
                <Trash2 className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-slate-300">No disposal sessions logged yet.</p>
              <p className="text-xs text-slate-500 mt-0.5">Start sorting recyclable waste to earn EcoPoints.</p>
              <Link
                href="/dispose"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-md shadow-emerald-950/40"
              >
                <span>Log First Waste Disposal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-slate-800/80">
              {recentActivity.map((rec) => {
                const meta = categoryMeta[rec.wasteCategory] || categoryMeta.other;
                const Icon = meta.icon;
                return (
                  <div key={rec._id} className="flex items-center justify-between py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 border border-slate-800 text-emerald-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold capitalize text-white">
                          {rec.wasteCategory} Waste
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {rec.quantity} kg • {rec.binName || "General Bin"} • {new Date(rec.disposalDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-block rounded-full bg-emerald-950/80 px-3 py-1 text-xs font-extrabold text-emerald-400 border border-emerald-800/60">
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