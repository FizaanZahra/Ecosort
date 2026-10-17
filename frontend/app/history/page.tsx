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
    "e-waste": { bg: "bg-purple-50 border-purple-200", text: "text-purple-700", icon: "⚡" },
    glass: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", icon: "🍾" },
    metal: { bg: "bg-slate-100 border-slate-300", text: "text-slate-800", icon: "🥫" },
    plastic: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", icon: "🧴" },
    organic: { bg: "bg-lime-50 border-lime-200", text: "text-lime-800", icon: "🍌" },
    paper: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", icon: "📄" },
    cardboard: { bg: "bg-orange-50 border-orange-200", text: "text-orange-700", icon: "📦" },
    other: { bg: "bg-gray-100 border-gray-300", text: "text-gray-700", icon: "🗑️" },
  };

  return (
    <main className="min-h-screen bg-slate-50/60 pb-20">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800 mb-2">
              <span>📜</span> Auditable Ledger
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Activity & Rewards History
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Verified records of your waste disposals and EcoPoints transaction logs.
            </p>
          </div>

          <Link
            href="/dispose"
            className="self-start sm:self-auto rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
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
            className={`border-b-2 px-6 py-3.5 text-sm font-bold transition-all ${
              activeTab === "disposals"
                ? "border-emerald-600 text-emerald-700 bg-white rounded-t-xl"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Disposal Records ({totalRecords})
          </button>
          <button
            onClick={() => setActiveTab("points")}
            className={`border-b-2 px-6 py-3.5 text-sm font-bold transition-all ${
              activeTab === "points"
                ? "border-emerald-600 text-emerald-700 bg-white rounded-t-xl"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Points Ledger & Debits
          </button>
        </div>

        {activeTab === "disposals" ? (
          <>
            {/* Category Filter Chips */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 mr-2">Category:</span>
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
                          ? "bg-emerald-700 text-white shadow-sm"
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                }
              )}
            </div>

            {/* History Table */}
            <div className="mt-6 overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm">
              {loading ? (
                <div className="py-20 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
                  <p className="mt-2 text-xs font-medium text-gray-400">Loading records...</p>
                </div>
              ) : records.length === 0 ? (
                <div className="py-16 text-center">
                  <span className="text-5xl">📭</span>
                  <p className="mt-3 text-sm font-bold text-gray-700">No disposal records found.</p>
                  <p className="mt-1 text-xs text-gray-400">Try another category filter or log a disposal.</p>
                  <Link
                    href="/dispose"
                    className="mt-4 inline-block rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                  >
                    Dispose Waste Now
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-gray-200 bg-gray-50/80 text-xs font-bold uppercase tracking-wider text-gray-600">
                      <tr>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Quantity</th>
                        <th className="px-6 py-4">Smart Bin</th>
                        <th className="px-6 py-4">MRS Factor</th>
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
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold capitalize border ${badge.bg} ${badge.text}`}
                              >
                                <span>{badge.icon}</span>
                                <span>{rec.wasteCategory}</span>
                              </span>
                            </td>
                            <td className="px-6 py-4 font-bold text-gray-900">
                              {rec.quantity} kg
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {rec.binName || "General Bin"}
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-extrabold text-purple-700">
                                {rec.materialRecoveryScore}%
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700 border border-emerald-200">
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
                  <span className="text-xs text-gray-500 font-medium">
                    Page {page} of {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-bold text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-bold text-gray-600 disabled:opacity-40 hover:bg-gray-50"
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
          <div className="mt-6 overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm">
            {loading ? (
              <div className="py-20 text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
                <p className="mt-2 text-xs font-medium text-gray-400">Loading ledger...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="py-16 text-center">
                <span className="text-5xl">⭐</span>
                <p className="mt-3 text-sm font-bold text-gray-700">No point transactions yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50/80 text-xs font-bold uppercase tracking-wider text-gray-600">
                    <tr>
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4">Transaction Type</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4 text-right">Points Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transactions.map((tx) => {
                      const isCredit = tx.pointsAmount >= 0;
                      return (
                        <tr key={tx._id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="px-6 py-4 text-gray-500 text-xs font-medium">
                            {new Date(tx.createdAt).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                                isCredit
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : "bg-amber-50 text-amber-800 border-amber-200"
                              }`}
                            >
                              {tx.transactionType}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-800 font-medium">{tx.description}</td>
                          <td
                            className={`px-6 py-4 text-right font-black ${
                              isCredit ? "text-emerald-700" : "text-amber-600"
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