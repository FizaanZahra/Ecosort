"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { api, Reward, Redemption } from "../../lib/api";

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

  const categories = ["All", "Coupons", "Merchandise", "Certificates", "Sustainability"];

  const filteredRewards =
    selectedCategory === "All"
      ? rewards
      : rewards.filter((r) => r.category === selectedCategory);

  return (
    <main className="min-h-screen bg-slate-50/60 pb-20">
      <Navbar />

      {/* Hero Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white py-12 px-6">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative mx-auto max-w-7xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-600/50 px-3 py-1 text-xs font-semibold text-emerald-100 border border-emerald-400/30 mb-3">
              <span>🎁</span> EcoPoints Rewards Store
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Turn Your Recycled Waste Into Real Rewards
            </h1>
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-emerald-100 leading-relaxed">
              Redeem your hard-earned EcoPoints for cafeteria dining vouchers, coffee passes,
              certified sustainability diplomas, and eco-merchandise.
            </p>
          </div>

          {/* Points Balance Card */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-5 min-w-[240px] shadow-xl">
            <span className="text-xs uppercase tracking-wider text-emerald-200 font-bold">
              Available Balance
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-amber-300">⭐ {user?.ecoPoints || 0}</span>
              <span className="text-xs text-emerald-100 font-semibold">EcoPoints</span>
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center text-xs">
              <span className="text-emerald-100">Active Vouchers:</span>
              <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-full">
                {myRedemptions.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`border-b-2 px-6 py-3.5 text-sm font-bold transition-all ${
              activeTab === "catalog"
                ? "border-emerald-600 text-emerald-700 bg-white rounded-t-xl"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            🛒 Rewards Store Catalog
          </button>
          <button
            onClick={() => setActiveTab("vouchers")}
            className={`border-b-2 px-6 py-3.5 text-sm font-bold transition-all ${
              activeTab === "vouchers"
                ? "border-emerald-600 text-emerald-700 bg-white rounded-t-xl"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            🎟️ My Claimed Vouchers ({myRedemptions.length})
          </button>
        </div>

        {/* Success Modal / Banner */}
        {successVoucher && (
          <div className="mt-6 rounded-2xl border border-emerald-300 bg-emerald-50 p-6 shadow-md animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl">🎉</span>
                <div>
                  <h3 className="text-lg font-bold text-emerald-950">
                    Voucher Claimed Successfully!
                  </h3>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Present this voucher code at the partner desk to claim your reward.
                  </p>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-1.5 border border-emerald-200 font-mono text-sm font-bold text-emerald-800">
                    <span>Code:</span>
                    <span className="text-base text-emerald-600 select-all">{successVoucher.voucherCode}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab("vouchers")}
                className="rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800"
              >
                View in My Vouchers →
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
            ⚠️ {error}
          </div>
        )}

        {activeTab === "catalog" ? (
          <>
            {/* Category Filter Chips */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 mr-2">Filter by Category:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? "bg-emerald-700 text-white shadow-sm"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Catalog Grid */}
            {loading ? (
              <div className="py-24 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
                <p className="mt-3 text-sm text-gray-500 font-medium">Loading store rewards...</p>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredRewards.map((item) => {
                  const canAfford = (user?.ecoPoints || 0) >= item.pointsCost;
                  const isRedeeming = redeemingId === item._id;

                  return (
                    <div
                      key={item._id}
                      className="group flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm hover:shadow-lg transition-all hover:border-emerald-200"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-4xl group-hover:scale-110 transition-transform">
                            {item.icon}
                          </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-700 border border-slate-200">
                            {item.category}
                          </span>
                        </div>

                        <h3 className="mt-4 text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-5 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-xs text-gray-400 font-medium block">Price:</span>
                            <span className="text-2xl font-extrabold text-amber-500">
                              ⭐ {item.pointsCost} <span className="text-xs text-gray-600 font-normal">pts</span>
                            </span>
                          </div>

                          <span className="text-[11px] text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 font-medium">
                            {item.stock} available
                          </span>
                        </div>

                        <button
                          onClick={() => handleRedeem(item)}
                          disabled={!canAfford || item.stock <= 0 || isRedeeming}
                          className={`w-full rounded-xl py-2.5 text-xs font-bold transition-all shadow-sm ${
                            canAfford && item.stock > 0
                              ? "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98]"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
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
              <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                <span className="text-5xl">🎟️</span>
                <h3 className="mt-3 text-lg font-bold text-gray-900">No Vouchers Yet</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                  You haven&apos;t redeemed any rewards yet. Dispose waste to earn EcoPoints and redeem rewards above!
                </p>
                <button
                  onClick={() => setActiveTab("catalog")}
                  className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Browse Rewards Catalog
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {myRedemptions.map((red) => (
                  <div
                    key={red._id}
                    className="relative rounded-2xl border border-emerald-200 bg-gradient-to-br from-white to-emerald-50/40 p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                        {red.category}
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                        {red.status}
                      </span>
                    </div>

                    <h4 className="mt-3 font-bold text-gray-900 text-sm">
                      {red.rewardTitle}
                    </h4>

                    {/* Voucher Ticket Code */}
                    <div className="mt-4 rounded-xl border border-dashed border-emerald-300 bg-white p-3 text-center">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">Your Voucher Code</p>
                      <p className="mt-1 font-mono text-base font-extrabold tracking-wider text-emerald-700 select-all">
                        {red.voucherCode}
                      </p>
                    </div>

                    <div className="mt-4 flex justify-between items-center text-[11px] text-gray-500 border-t border-gray-100 pt-3">
                      <span>Redeemed: {new Date(red.createdAt).toLocaleDateString()}</span>
                      <span className="font-semibold text-amber-600">-{red.pointsSpent} pts</span>
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
