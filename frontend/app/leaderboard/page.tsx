"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { api, LeaderboardUser } from "../../lib/api";
import {
  Trophy,
  Medal,
  Award,
  Coins,
  RefreshCw,
  AlertCircle,
  Users,
  Shield,
  User as UserIcon,
  Crown,
} from "lucide-react";

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

  const podiumColors = [
    {
      border: "border-amber-500/60 shadow-amber-950/40",
      bg: "bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900",
      badge: "bg-amber-950/80 text-amber-300 border-amber-700/60",
      icon: Crown,
      iconColor: "text-amber-400",
      title: "1st Place Champion",
    },
    {
      border: "border-slate-600 shadow-slate-900/40",
      bg: "bg-gradient-to-b from-slate-800/40 via-slate-900 to-slate-900",
      badge: "bg-slate-800 text-slate-300 border-slate-700",
      icon: Medal,
      iconColor: "text-slate-300",
      title: "2nd Place",
    },
    {
      border: "border-amber-800/60 shadow-amber-950/20",
      bg: "bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-900",
      badge: "bg-amber-950/60 text-amber-400 border-amber-800/60",
      icon: Award,
      iconColor: "text-amber-500",
      title: "3rd Place",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-20 selection:bg-emerald-500 selection:text-black">
      <Navbar />

      {/* Header Banner */}
      <div className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 py-12 px-6">
        <div className="relative mx-auto max-w-7xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/80 px-3.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-800/80 mb-3">
              <Trophy className="h-3.5 w-3.5" />
              <span>Community Standings</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              EcoSort Recycling Leaderboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-400">
              Honoring members leading the community in responsible waste
              segregation and material recovery.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 p-4 text-center min-w-[130px] shadow-xl">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block flex items-center justify-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span>Recyclers</span>
              </span>
              <span className="text-2xl font-black text-white mt-1 block">{totalParticipants}</span>
            </div>
            {currentUserRank && (
              <div className="rounded-2xl bg-emerald-950/60 backdrop-blur-md border border-emerald-800/60 p-4 text-center min-w-[130px] shadow-xl">
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold block flex items-center justify-center gap-1">
                  <Award className="h-3.5 w-3.5" />
                  <span>Your Rank</span>
                </span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">#{currentUserRank.rank}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-950/60 p-4 text-xs font-semibold text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Current User Quick Stat Callout */}
        {user && currentUserRank && (
          <div className="mb-8 rounded-3xl border border-emerald-800/60 bg-emerald-950/40 p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white font-extrabold text-xl shadow-md">
                #{currentUserRank.rank}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Your Current Standings</p>
                <h3 className="text-base font-extrabold text-white">{currentUserRank.name}</h3>
                <p className="text-xs text-slate-400">
                  {currentUserRank.totalWasteKg} kg recycled across {currentUserRank.totalContributions} disposals
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-slate-400 font-medium block">Total Score</span>
                <span className="text-xl font-black text-amber-400 flex items-center gap-1.5 justify-end">
                  <Coins className="h-4 w-4 text-amber-400" />
                  <span>{currentUserRank.ecoPoints} pts</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
            <p className="mt-3 text-sm text-slate-400 font-medium">Computing community rankings...</p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium Cards */}
            {top3.length > 0 && (
              <div className="mb-10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-400" />
                  <span>Top Community Contributors</span>
                </h3>
                <div className="grid gap-6 md:grid-cols-3">
                  {top3.map((podiumUser, index) => {
                    const theme = podiumColors[index] || podiumColors[2];
                    const Icon = theme.icon;
                    return (
                      <div
                        key={podiumUser.id}
                        className={`relative rounded-3xl border p-6 shadow-xl hover:scale-[1.01] transition-all ${theme.border} ${theme.bg}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 border border-slate-800">
                            <Icon className={`h-6 w-6 ${theme.iconColor}`} />
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-extrabold border ${theme.badge}`}
                          >
                            Rank #{index + 1}
                          </span>
                        </div>

                        <h4 className="mt-4 text-xl font-extrabold text-white">
                          {podiumUser.name}
                        </h4>
                        <p className="text-xs text-slate-400 font-medium capitalize flex items-center gap-1 mt-0.5">
                          {podiumUser.role === "admin" ? (
                            <>
                              <Shield className="h-3 w-3 text-emerald-400" />
                              <span>System Administrator</span>
                            </>
                          ) : (
                            <>
                              <UserIcon className="h-3 w-3 text-slate-400" />
                              <span>Active Recycler</span>
                            </>
                          )}
                        </p>

                        <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 gap-2 text-center">
                          <div className="rounded-xl bg-slate-950/80 p-2.5 border border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Points</span>
                            <span className="text-lg font-black text-amber-400">
                              {podiumUser.ecoPoints}
                            </span>
                          </div>
                          <div className="rounded-xl bg-slate-950/80 p-2.5 border border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Mass</span>
                            <span className="text-lg font-black text-white">
                              {podiumUser.totalWasteKg} <span className="text-xs font-normal text-slate-400">kg</span>
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
            <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-xl">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">All Community Participants</h3>
                  <p className="text-xs text-slate-400">Ranked by total EcoPoints and verified recyclable mass</p>
                </div>
                <button
                  onClick={fetchLeaderboard}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-800 bg-slate-950/60 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Rank</th>
                      <th className="px-6 py-4">Contributor</th>
                      <th className="px-6 py-4">Waste Recycled</th>
                      <th className="px-6 py-4">Disposals</th>
                      <th className="px-6 py-4 text-right">Total EcoPoints</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {leaderboard.map((u) => {
                      const isMe = user?.id === u.id;
                      return (
                        <tr
                          key={u.id}
                          className={`transition-colors ${
                            isMe
                              ? "bg-emerald-950/40 text-emerald-300 font-medium"
                              : "hover:bg-slate-800/40 text-slate-300"
                          }`}
                        >
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                                u.rank === 1
                                  ? "bg-amber-950/80 text-amber-300 border border-amber-700/60 font-extrabold"
                                  : u.rank === 2
                                  ? "bg-slate-800 text-slate-300 border border-slate-700 font-bold"
                                  : u.rank === 3
                                  ? "bg-amber-950/60 text-amber-400 border border-amber-800/60 font-bold"
                                  : "bg-slate-950 text-slate-400 border border-slate-800"
                              }`}
                            >
                              {u.rank}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-white flex items-center gap-2">
                            <span>{u.name}</span>
                            {isMe && (
                              <span className="rounded bg-emerald-950 border border-emerald-800/60 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                                You
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-slate-300 font-medium">
                            {u.totalWasteKg} kg
                          </td>
                          <td className="px-6 py-4 text-slate-400">
                            {u.totalContributions} sessions
                          </td>
                          <td className="px-6 py-4 text-right font-black text-amber-400">
                            {u.ecoPoints} pts
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
