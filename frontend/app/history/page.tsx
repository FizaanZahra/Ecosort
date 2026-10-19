"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { api, WasteRecord } from "../../lib/api";
import {
  History as HistoryIcon,
  Plus,
  Coins,
  Cpu,
  Wine,
  Zap,
  Box,
  Apple,
  FileText,
  Layers,
  Trash2,
  Inbox,
  ArrowRight,
} from "lucide-react";

interface PointTransaction {
  _id: string;
  transactionType: string;
  pointsAmount: number;
  description: string;
  createdAt: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"disposals" | "points">("disposals");
  const [records, setRecords] = useState<WasteRecord[]>([]);
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(() => {
    setLoading(true);
    api.waste
      .getHistory(selectedCategory, page, 10)
      .then((res) => {
        if (res.success) {
          setRecords(res.records);
          setTotalPages(res.pagination.totalPages || 1);
          setTotalRecords(res.pagination.totalRecords || 0);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedCategory, page]);

  const fetchTransactions = useCallback(() => {
    setLoading(true);
    api.waste
      .getPointsHistory()
      .then((res) => {
        if (res.success) {
          setTransactions(res.transactions || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      if (activeTab === "disposals") {
        fetchHistory();
      } else {
        fetchTransactions();
      }
    }
  }, [user, authLoading, router, activeTab, fetchHistory, fetchTransactions]);

  const categoryBadges: Record<string, { bg: string; text: string; icon: React.ComponentType<{ className?: string }> }> = {
    "e-waste": { bg: "bg-purple-950/40 border-purple-800/40", text: "text-purple-400", icon: Cpu },
    glass: { bg: "bg-cyan-950/40 border-cyan-800/40", text: "text-cyan-400", icon: Wine },
    metal: { bg: "bg-slate-900 border-slate-700", text: "text-slate-300", icon: Zap },
    plastic: { bg: "bg-blue-950/40 border-blue-800/40", text: "text-blue-400", icon: Box },
    organic: { bg: "bg-lime-950/40 border-lime-800/40", text: "text-lime-400", icon: Apple },
    paper: { bg: "bg-amber-950/40 border-amber-800/40", text: "text-amber-400", icon: FileText },
    cardboard: { bg: "bg-orange-950/40 border-orange-800/40", text: "text-orange-400", icon: Layers },
    other: { bg: "bg-slate-900 border-slate-700", text: "text-slate-400", icon: Trash2 },
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-20 selection:bg-emerald-500 selection:text-black">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/70 border border-emerald-800/60 px-3 py-0.5 text-xs font-bold text-emerald-400 mb-2">
              <HistoryIcon className="h-3.5 w-3.5" />
              <span>Auditable Ledger</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Activity & Rewards History
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Immutable records of your waste disposals and EcoPoints transaction logs.
            </p>
          </div>

          <Link
            href="/dispose"
            className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-950/40 hover:from-emerald-500 hover:to-teal-500 transition"
          >
            <Plus className="h-4 w-4" />
            <span>New Disposal</span>
          </Link>
        </div>

        {/* Tab Toggle */}
        <div className="mt-6 flex border-b border-slate-800">
          <button
            onClick={() => {
              setActiveTab("disposals");
              setPage(1);
            }}
            className={`border-b-2 px-6 py-3.5 text-sm font-bold transition-all ${
              activeTab === "disposals"
                ? "border-emerald-500 text-emerald-400 bg-slate-900/60 rounded-t-xl"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Disposal Records ({totalRecords})
          </button>
          <button
            onClick={() => setActiveTab("points")}
            className={`border-b-2 px-6 py-3.5 text-sm font-bold transition-all ${
              activeTab === "points"
                ? "border-emerald-500 text-emerald-400 bg-slate-900/60 rounded-t-xl"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Points Ledger & Debits
          </button>
        </div>

        {activeTab === "disposals" ? (
          <>
            {/* Category Filter Chips */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 mr-2">Category:</span>
              {["all", "e-waste", "glass", "metal", "plastic", "organic", "paper", "cardboard", "other"].map(
                (cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setPage(1);
                      }}
                      className={`rounded-full px-3.5 py-1 text-xs font-bold capitalize transition-all ${
                        isActive
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/50"
                          : "bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                }
              )}
            </div>

            {/* History Table */}
            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-xl">
              {loading ? (
                <div className="py-20 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
                  <p className="mt-2 text-xs font-medium text-slate-400">Loading records...</p>
                </div>
              ) : records.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-slate-950 border border-slate-800 text-slate-500 mb-3">
                    <Inbox className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-bold text-white">No disposal records found.</p>
                  <p className="mt-1 text-xs text-slate-400">Try another category filter or log a disposal.</p>
                  <Link
                    href="/dispose"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-md shadow-emerald-950/40"
                  >
                    <span>Dispose Waste Now</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-800 bg-slate-950/60 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Quantity</th>
                        <th className="px-6 py-4">Smart Bin</th>
                        <th className="px-6 py-4">MRS Factor</th>
                        <th className="px-6 py-4 text-right">Points Earned</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {records.map((rec) => {
                        const badge = categoryBadges[rec.wasteCategory] || categoryBadges.other;
                        const Icon = badge.icon;
                        return (
                          <tr key={rec._id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="px-6 py-4 text-slate-400">
                              {new Date(rec.disposalDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold capitalize border ${badge.bg} ${badge.text}`}
                              >
                                <Icon className="h-3.5 w-3.5" />
                                <span>{rec.wasteCategory}</span>
                              </span>
                            </td>
                            <td className="px-6 py-4 font-bold text-white">
                              {rec.quantity} kg
                            </td>
                            <td className="px-6 py-4 text-slate-400">
                              {rec.binName || "General Bin"}
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-extrabold text-purple-400">
                                {rec.materialRecoveryScore}%
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="inline-block rounded-full bg-emerald-950/80 px-3 py-1 text-xs font-extrabold text-emerald-400 border border-emerald-800/60">
                                +{rec.pointsEarned} pts
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4">
                  <span className="text-xs text-slate-400 font-medium">
                    Page {page} of {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-bold text-slate-300 disabled:opacity-40 hover:bg-slate-800 hover:text-white"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-bold text-slate-300 disabled:opacity-40 hover:bg-slate-800 hover:text-white"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Points Ledger Table */
          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-xl">
            {loading ? (
              <div className="py-20 text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
                <p className="mt-2 text-xs font-medium text-slate-400">Loading ledger...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="py-16 text-center">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-slate-950 border border-slate-800 text-amber-400 mb-3">
                  <Coins className="h-6 w-6" />
                </div>
                <p className="text-sm font-bold text-white">No point transactions yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-800 bg-slate-950/60 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4">Transaction Type</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4 text-right">Points Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {transactions.map((tx) => {
                      const isCredit = tx.pointsAmount >= 0;
                      return (
                        <tr key={tx._id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-6 py-4 text-slate-400 text-xs font-medium">
                            {new Date(tx.createdAt).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                                isCredit
                                  ? "bg-emerald-950/70 text-emerald-400 border-emerald-800/60"
                                  : "bg-amber-950/70 text-amber-400 border-amber-800/60"
                              }`}
                            >
                              {tx.transactionType}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-200 font-medium">{tx.description}</td>
                          <td
                            className={`px-6 py-4 text-right font-black ${
                              isCredit ? "text-emerald-400" : "text-amber-400"
                            }`}
                          >
                            {isCredit ? `+${tx.pointsAmount}` : tx.pointsAmount} pts
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}