"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { api, WasteRecord } from "../../lib/api";

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

  const categoryBadges: Record<string, { bg: string; text: string; icon: string }> = {
    plastic: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", icon: "🧴" },
    paper: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", icon: "📄" },
    metal: { bg: "bg-slate-100 border-slate-300", text: "text-slate-800", icon: "🥫" },
    glass: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", icon: "🍾" },
    cardboard: { bg: "bg-orange-50 border-orange-200", text: "text-orange-700", icon: "📦" },
    other: { bg: "bg-gray-100 border-gray-300", text: "text-gray-700", icon: "🗑️" },
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Activity & Reward History</h2>
            <p className="mt-1 text-sm text-gray-600">
              Review your verified waste disposal activities and points ledger.
            </p>
          </div>

          <Link
            href="/dispose"
            className="self-start rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 sm:self-auto"
          >
            + New Disposal
          </Link>
        </div>

        {/* Tab Toggle */}
        <div className="mt-6 flex border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab("disposals");
              setPage(1);
            }}
            className={`border-b-2 px-5 py-3 text-sm font-semibold transition-colors ${
              activeTab === "disposals"
                ? "border-green-600 text-green-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Disposal Records ({totalRecords})
          </button>
          <button
            onClick={() => setActiveTab("points")}
            className={`border-b-2 px-5 py-3 text-sm font-semibold transition-colors ${
              activeTab === "points"
                ? "border-green-600 text-green-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Points Transactions Ledger
          </button>
        </div>

        {activeTab === "disposals" ? (
          <>
            {/* Category Filter Chips */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 mr-2">Filter by Category:</span>
              {["all", "plastic", "paper", "metal", "glass", "cardboard", "other"].map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setPage(1);
                    }}
                    className={`rounded-full px-3.5 py-1 text-xs font-semibold capitalize transition-all ${
                      isActive
                        ? "bg-green-700 text-white shadow-sm"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* History Table */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              {loading ? (
                <div className="py-16 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-green-600 border-t-transparent"></div>
                  <p className="mt-2 text-xs font-medium text-gray-500">Loading records...</p>
                </div>
              ) : records.length === 0 ? (
                <div className="py-16 text-center">
                  <span className="text-4xl">📭</span>
                  <p className="mt-3 text-sm font-medium text-gray-600">No disposal records found.</p>
                  <p className="mt-1 text-xs text-gray-400">
                    Try choosing another category or submit your first disposal.
                  </p>
                  <Link
                    href="/dispose"
                    className="mt-4 inline-block rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700"
                  >
                    Dispose Waste Now
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-600">
                      <tr>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Quantity</th>
                        <th className="px-6 py-4">Smart Bin</th>
                        <th className="px-6 py-4">MRS Score</th>
                        <th className="px-6 py-4 text-right">Points Earned</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {records.map((rec) => {
                        const badge = categoryBadges[rec.wasteCategory] || categoryBadges.other;
                        return (
                          <tr key={rec._id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="px-6 py-4 text-gray-600">
                              {new Date(rec.disposalDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize border ${badge.bg} ${badge.text}`}
                              >
                                <span>{badge.icon}</span>
                                <span>{rec.wasteCategory}</span>
                              </span>
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-900">
                              {rec.quantity} kg
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {rec.binName || "EcoSort General Bin"}
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-semibold text-purple-700">
                                {rec.materialRecoveryScore}%
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="inline-block rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700 border border-green-200">
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
                <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                  <span className="text-xs text-gray-500">
                    Page {page} of {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 disabled:opacity-40 hover:bg-gray-50"
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
          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            {loading ? (
              <div className="py-16 text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-green-600 border-t-transparent"></div>
                <p className="mt-2 text-xs font-medium text-gray-500">Loading ledger...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="py-16 text-center">
                <span className="text-4xl">⭐</span>
                <p className="mt-3 text-sm font-medium text-gray-600">No point transactions yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-600">
                    <tr>
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4">Transaction Type</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4 text-right">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transactions.map((tx) => (
                      <tr key={tx._id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(tx.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                            {tx.transactionType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-800">{tx.description}</td>
                        <td className="px-6 py-4 text-right font-bold text-green-700">
                          +{tx.pointsAmount} pts
                        </td>
                      </tr>
                    ))}
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