"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { api, Reward, Redemption } from "../../lib/api";
import {
  Gift,
  Coins,
  Ticket,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Award,
  Coffee,
  Tag,
} from "lucide-react";

export default function RewardsPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();

  const [rewards, setRewards] = useState<Reward[]>([]);
  const [myRedemptions, setMyRedemptions] = useState<Redemption[]>([]);
  const [activeTab, setActiveTab] = useState<"catalog" | "vouchers">("catalog");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successVoucher, setSuccessVoucher] = useState<Redemption | null>(null);

  const fetchStoreData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [storeRes, redemptionsRes] = await Promise.all([
        api.rewards.getAll(),
        user ? api.rewards.getMyRedemptions() : Promise.resolve({ success: true, redemptions: [] }),
      ]);

      if (storeRes.success) setRewards(storeRes.rewards);
      if (redemptionsRes.success) setMyRedemptions(redemptionsRes.redemptions || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load rewards store.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      fetchStoreData();
    }
  }, [user, authLoading, router, fetchStoreData]);

  const handleRedeem = async (reward: Reward) => {
    if (!user) return;

    if (user.ecoPoints < reward.pointsCost) {
      setError(`You need ${reward.pointsCost - user.ecoPoints} more points to redeem this item.`);
      return;
    }

    if (!confirm(`Redeem "${reward.title}" for ${reward.pointsCost} EcoPoints?`)) {
      return;
    }

    setRedeemingId(reward._id);
    setError(null);
    setSuccessVoucher(null);

    try {
      const res = await api.rewards.redeem(reward._id);
      if (res.success) {
        setSuccessVoucher(res.redemption);
        await refreshUser();
        fetchStoreData();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Redemption failed.";
      setError(msg);
    } finally {
      setRedeemingId(null);
    }
  };

  const getRewardIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case "coupons":
        return Ticket;
      case "merchandise":
        return ShoppingBag;
      case "certificates":
        return Award;
      default:
        return Gift;
    }
  };

  const categories = ["All", "Coupons", "Merchandise", "Certificates", "Sustainability"];

  const filteredRewards =
    selectedCategory === "All"
      ? rewards
      : rewards.filter((r) => r.category === selectedCategory);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-20 selection:bg-emerald-500 selection:text-black">
      <Navbar />

      {/* Hero Header Banner */}
      <div className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 py-12 px-6">
        <div className="relative mx-auto max-w-7xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/80 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-800/80 mb-3">
              <Gift className="h-3.5 w-3.5" />
              <span>EcoPoints Rewards Store</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Turn Recycled Waste Into Real Rewards
            </h1>
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-400 leading-relaxed">
              Redeem accumulated EcoPoints for cafeteria dining vouchers, coffee passes,
              certified sustainability diplomas, and eco-merchandise.
            </p>
          </div>

          {/* Points Balance Card */}
          <div className="rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 p-5 min-w-[240px] shadow-2xl">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-amber-400" />
              <span>Available Balance</span>
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-amber-400">{user?.ecoPoints || 0}</span>
              <span className="text-xs text-slate-400 font-semibold">EcoPoints</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Claimed Vouchers:</span>
              <span className="font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                {myRedemptions.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`border-b-2 px-6 py-3.5 text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "catalog"
                ? "border-emerald-500 text-emerald-400 bg-slate-900/60 rounded-t-xl"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Rewards Catalog</span>
          </button>
          <button
            onClick={() => setActiveTab("vouchers")}
            className={`border-b-2 px-6 py-3.5 text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "vouchers"
                ? "border-emerald-500 text-emerald-400 bg-slate-900/60 rounded-t-xl"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Ticket className="h-4 w-4" />
            <span>My Claimed Vouchers ({myRedemptions.length})</span>
          </button>
        </div>

        {/* Success Modal / Banner */}
        {successVoucher && (
          <div className="mt-6 rounded-2xl border border-emerald-800/60 bg-emerald-950/60 p-6 shadow-xl animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 border border-emerald-700 text-emerald-400">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Voucher Claimed Successfully
                  </h3>
                  <p className="text-xs text-emerald-300 mt-0.5">
                    Present this voucher code at the partner service desk to claim your reward.
                  </p>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-3.5 py-1.5 border border-slate-800 font-mono text-sm font-bold text-emerald-400">
                    <span className="text-slate-400">Code:</span>
                    <span className="text-base text-emerald-400 select-all">{successVoucher.voucherCode}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab("vouchers")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-md shadow-emerald-950/40"
              >
                <span>View My Vouchers</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-950/60 p-4 text-xs font-semibold text-red-300 shadow-sm">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {activeTab === "catalog" ? (
          <>
            {/* Category Filter Chips */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 mr-2">Filter:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/40"
                      : "bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Catalog Grid */}
            {loading ? (
              <div className="py-24 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
                <p className="mt-3 text-sm text-slate-400 font-medium">Loading store rewards...</p>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredRewards.map((item) => {
                  const canAfford = (user?.ecoPoints || 0) >= item.pointsCost;
                  const isRedeeming = redeemingId === item._id;
                  const Icon = getRewardIcon(item.category);

                  return (
                    <div
                      key={item._id}
                      className="group flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 shadow-xl hover:border-slate-700 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 border border-slate-800 text-emerald-400 group-hover:scale-105 transition-transform">
                            <Icon className="h-6 w-6" />
                          </div>
                          <span className="rounded-full bg-slate-950 px-3 py-1 text-[11px] font-bold text-slate-300 border border-slate-800">
                            {item.category}
                          </span>
                        </div>

                        <h3 className="mt-4 text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-5 border-t border-slate-800">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-xs text-slate-500 font-medium block">Price:</span>
                            <span className="text-2xl font-extrabold text-amber-400 flex items-center gap-1">
                              <Coins className="h-5 w-5 text-amber-400" />
                              <span>{item.pointsCost}</span>
                              <span className="text-xs text-slate-400 font-normal">pts</span>
                            </span>
                          </div>

                          <span className="text-[11px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 font-medium">
                            {item.stock} available
                          </span>
                        </div>

                        <button
                          onClick={() => handleRedeem(item)}
                          disabled={!canAfford || item.stock <= 0 || isRedeeming}
                          className={`w-full rounded-xl py-3 text-xs font-bold uppercase tracking-wider transition-all shadow-md ${
                            canAfford && item.stock > 0
                              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-emerald-950/40 active:scale-[0.98]"
                              : "bg-slate-950 text-slate-500 cursor-not-allowed border border-slate-800"
                          }`}
                        >
                          {isRedeeming
                            ? "Generating Voucher..."
                            : item.stock <= 0
                            ? "Out of Stock"
                            : canAfford
                            ? "Redeem for " + item.pointsCost + " pts"
                            : `Need ${item.pointsCost - (user?.ecoPoints || 0)} More Points`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          /* My Vouchers View */
          <div className="mt-6">
            {myRedemptions.length === 0 ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-12 text-center shadow-xl">
                <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-slate-950 border border-slate-800 text-slate-500 mb-3">
                  <Ticket className="h-7 w-7" />
                </div>
                <h3 className="mt-3 text-lg font-bold text-white">No Vouchers Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  You haven&apos;t redeemed any rewards yet. Dispose waste to earn EcoPoints and redeem rewards above.
                </p>
                <button
                  onClick={() => setActiveTab("catalog")}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-md shadow-emerald-950/40"
                >
                  <span>Browse Rewards Catalog</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {myRedemptions.map((red) => (
                  <div
                    key={red._id}
                    className="relative rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {red.category}
                      </span>
                      <span className="rounded-full bg-emerald-950/70 border border-emerald-800/60 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                        {red.status}
                      </span>
                    </div>

                    <h4 className="mt-3 font-bold text-white text-sm">
                      {red.rewardTitle}
                    </h4>

                    {/* Voucher Ticket Code */}
                    <div className="mt-4 rounded-xl border border-dashed border-emerald-500/40 bg-slate-950 p-3 text-center">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Your Voucher Code</p>
                      <p className="mt-1 font-mono text-base font-extrabold tracking-wider text-emerald-400 select-all">
                        {red.voucherCode}
                      </p>
                    </div>

                    <div className="mt-4 flex justify-between items-center text-[11px] text-slate-400 border-t border-slate-800 pt-3">
                      <span>Redeemed: {new Date(red.createdAt).toLocaleDateString()}</span>
                      <span className="font-semibold text-amber-400">-{red.pointsSpent} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
