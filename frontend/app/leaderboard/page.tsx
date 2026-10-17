"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { api, LeaderboardUser } from "../../lib/api";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardUser | null>(null);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = () => {
    setLoading(true);
    api.waste
      .getLeaderboard()
      .then((res) => {
        if (res.success) {
          setLeaderboard(res.leaderboard || []);
          setTotalParticipants(res.totalParticipants || 0);
          setCurrentUserRank(res.currentUserRank || null);
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load leaderboard.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const top3 = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  const podiumColors = [
    {
      border: "border-amber-300 ring-2 ring-amber-300/40",
      bg: "bg-gradient-to-b from-amber-50 to-white",
      badge: "bg-amber-100 text-amber-900 border-amber-300",
      medal: "🥇",
      title: "1st Place Champion",
    },
    {
      border: "border-slate-300 ring-1 ring-slate-300/40",
      bg: "bg-gradient-to-b from-slate-50 to-white",
      badge: "bg-slate-100 text-slate-800 border-slate-300",
      medal: "🥈",
      title: "2nd Place",
    },
    {
      border: "border-orange-300 ring-1 ring-orange-300/40",
      bg: "bg-gradient-to-b from-orange-50 to-white",
      badge: "bg-orange-100 text-orange-900 border-orange-300",
      medal: "🥉",
      title: "3rd Place",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50/60 pb-20">
      <Navbar />

      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-800 to-emerald-800 text-white py-12 px-6">
        <div className="relative mx-auto max-w-7xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-700/60 px-3.5 py-1 text-xs font-semibold text-emerald-200 border border-emerald-500/30 mb-3">
              <span>🏆</span> Community Standings
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              EcoSort Recycling Leaderboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-emerald-100">
              Honoring community members and students leading the drive in responsible waste
              segregation and material recovery.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 text-center min-w-[130px]">
              <span className="text-xs uppercase tracking-wider text-emerald-200 font-bold block">
                Recyclers
              </span>
              <span className="text-2xl font-black text-white">{totalParticipants}</span>
            </div>
            {currentUserRank && (
              <div className="rounded-2xl bg-amber-400/20 backdrop-blur-md border border-amber-300/40 p-4 text-center min-w-[130px]">
                <span className="text-xs uppercase tracking-wider text-amber-200 font-bold block">
                  Your Rank
                </span>
                <span className="text-2xl font-black text-amber-300">#{currentUserRank.rank}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            ⚠️ {error}
          </div>
        )}

        {/* Current User Quick Stat Callout */}
        {user && currentUserRank && (
          <div className="mb-8 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white font-extrabold text-xl shadow-md">
                #{currentUserRank.rank}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Your Current Standings</p>
                <h3 className="text-base font-extrabold text-gray-900">{currentUserRank.name}</h3>
                <p className="text-xs text-gray-500">
                  {currentUserRank.totalWasteKg} kg recycled across {currentUserRank.totalContributions} disposals
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-gray-500 font-medium block">Total Score</span>
                <span className="text-xl font-black text-emerald-700">⭐ {currentUserRank.ecoPoints} pts</span>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
            <p className="mt-3 text-sm text-gray-500 font-medium">Computing community rankings...</p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium Cards */}
            {top3.length > 0 && (
              <div className="mb-10">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>🎖️</span> Top Community Contributors
                </h3>
                <div className="grid gap-6 md:grid-cols-3">
                  {top3.map((podiumUser, index) => {
                    const theme = podiumColors[index] || podiumColors[2];
                    return (
                      <div
                        key={podiumUser.id}
                        className={`relative rounded-3xl border p-6 shadow-sm hover:shadow-lg transition-all ${theme.border} ${theme.bg}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-4xl">{theme.medal}</span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-extrabold border ${theme.badge}`}
                          >
                            Rank #{index + 1}
                          </span>
                        </div>

                        <h4 className="mt-4 text-xl font-extrabold text-gray-900">
                          {podiumUser.name}
                        </h4>
                        <p className="text-xs text-gray-500 font-medium capitalize">
                          {podiumUser.role === "admin" ? "🛡️ System Administrator" : "Active Recycler"}
                        </p>

                        <div className="mt-6 pt-4 border-t border-gray-200/60 grid grid-cols-2 gap-2 text-center">
                          <div className="rounded-xl bg-white/70 p-2.5 border border-gray-100">
                            <span className="text-[10px] text-gray-400 uppercase font-bold block">Points</span>
                            <span className="text-lg font-black text-emerald-700">
                              ⭐ {podiumUser.ecoPoints}
                            </span>
                          </div>
                          <div className="rounded-xl bg-white/70 p-2.5 border border-gray-100">
                            <span className="text-[10px] text-gray-400 uppercase font-bold block">Mass</span>
                            <span className="text-lg font-black text-gray-800">
                              {podiumUser.totalWasteKg} <span className="text-xs font-normal text-gray-500">kg</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Complete Ranking Table */}
            <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">All Community Participants</h3>
                  <p className="text-xs text-gray-500">Ranked by total EcoPoints and verified recyclable mass</p>
                </div>
                <button
                  onClick={fetchLeaderboard}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-100 transition"
                >
                  ↻ Refresh
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50/80 text-xs font-bold uppercase tracking-wider text-gray-600">
                    <tr>
                      <th className="px-6 py-4">Rank</th>
                      <th className="px-6 py-4">Contributor</th>
                      <th className="px-6 py-4">Waste Recycled</th>
                      <th className="px-6 py-4">Disposals</th>
                      <th className="px-6 py-4 text-right">Total EcoPoints</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {leaderboard.map((u) => {
                      const isMe = user?.id === u.id;
                      return (
                        <tr
                          key={u.id}
                          className={`transition-colors ${
                            isMe
                              ? "bg-emerald-50/60 font-medium"
                              : "hover:bg-gray-50/60"
                          }`}
                        >
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                                u.rank === 1
                                  ? "bg-amber-100 text-amber-900 font-extrabold"
                                  : u.rank === 2
                                  ? "bg-slate-200 text-slate-800 font-bold"
                                  : u.rank === 3
                                  ? "bg-orange-100 text-orange-900 font-bold"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {u.rank}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-900 flex items-center gap-2">
                            <span>{u.name}</span>
                            {isMe && (
                              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                                You
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-gray-700 font-medium">
                            {u.totalWasteKg} kg
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {u.totalContributions} sessions
                          </td>
                          <td className="px-6 py-4 text-right font-black text-emerald-700">
                            ⭐ {u.ecoPoints} pts
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
