"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md px-6 py-4 shadow-sm sm:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white shadow-md shadow-emerald-600/20">
              <span className="text-xl">🌱</span>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900">
                Eco<span className="text-emerald-600">Sort</span>
              </span>
              <span className="hidden text-[10px] font-bold uppercase tracking-wider text-emerald-600 sm:block">
                Web PBL Edition
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <a href="#features" className="hover:text-emerald-600 transition">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-emerald-600 transition">
              How It Works
            </a>
            <Link href="/bins" className="hover:text-emerald-600 transition">
              Smart Bins
            </Link>
            <Link href="/leaderboard" className="hover:text-emerald-600 transition">
              Leaderboard
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
                >
                  Register Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-slate-50/40 py-20 px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/70 bg-emerald-100/70 px-4 py-1.5 text-xs font-bold text-emerald-900 shadow-sm mb-6">
                <span>🌍</span> Web Technology Project-Based Learning (PBL)
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-gray-950 leading-[1.1]">
                Smart Waste Segregation, <span className="text-emerald-600">Simulated & Rewarded</span>
              </h1>

              <p className="mt-6 text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
                EcoSort transforms community waste management into an engaging, rewarded experience.
                Manually segregate across 8 waste categories, earn verified EcoPoints, unlock campus dining
                vouchers, and monitor simulated smart bin telemetry.
              </p>

              <div className="mt-8 flex flex-wrap gap-3.5">
                <Link
                  href={user ? "/dashboard" : "/register"}
                  className="rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/25 hover:from-emerald-700 hover:to-green-700 transition active:scale-95"
                >
                  {user ? "Open Dashboard →" : "Get Started Now →"}
                </Link>
                <Link
                  href="/rewards"
                  className="rounded-xl border border-amber-300 bg-amber-50 px-6 py-3.5 text-sm font-extrabold text-amber-900 shadow-sm hover:bg-amber-100 transition"
                >
                  🎁 Explore Rewards Store
                </Link>
                <Link
                  href="/bins"
                  className="rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-extrabold text-gray-700 shadow-sm hover:bg-gray-50 transition"
                >
                  📍 Smart Bins
                </Link>
              </div>

              {/* Metric stats strip */}
              <div className="mt-12 pt-8 border-t border-gray-200/80 grid grid-cols-3 gap-4">
                <div>
                  <span className="text-2xl font-black text-gray-950">8 Streams</span>
                  <p className="text-xs text-gray-500 font-medium">Recyclable Categories</p>
                </div>
                <div>
                  <span className="text-2xl font-black text-emerald-600">100% Web</span>
                  <p className="text-xs text-gray-500 font-medium">No Hardware Required</p>
                </div>
                <div>
                  <span className="text-2xl font-black text-amber-500">EcoPoints</span>
                  <p className="text-xs text-gray-500 font-medium">Campus Rewards Store</p>
                </div>
              </div>
            </div>

            {/* Visual Hero Dashboard Card */}
            <div className="relative">
              <div className="relative mx-auto max-w-md rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-2xl shadow-emerald-900/10">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400"></span>
                    <span className="h-3 w-3 rounded-full bg-amber-400"></span>
                    <span className="h-3 w-3 rounded-full bg-green-400"></span>
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-400">ecosort-live-demo</span>
                </div>

                {/* Simulated Telemetry Cards */}
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900">Total EcoPoints Balance</span>
                      <span className="text-xl">⭐</span>
                    </div>
                    <p className="text-3xl font-black text-emerald-700 mt-1">250 pts</p>
                    <p className="text-[11px] text-emerald-600 mt-0.5">Eligible for Campus Dining Coupon</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-gray-100 bg-slate-50 p-3.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Recovery Score (MRS)</span>
                      <p className="text-xl font-black text-purple-700 mt-1">84%</p>
                      <div className="mt-1 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-1 bg-purple-600 rounded-full w-[84%]"></div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-slate-50 p-3.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Campus Bins</span>
                      <p className="text-xl font-black text-emerald-600 mt-1">4 Active</p>
                      <span className="text-[10px] font-bold text-emerald-700">Simulated Telemetry</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">🎟️</span>
                      <div>
                        <p className="text-xs font-extrabold text-amber-950">Cafeteria 25% Off Voucher</p>
                        <p className="text-[10px] font-mono text-amber-700">CAMPUS-MEAL-8F3A</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8 Waste Streams Grid */}
      <section id="features" className="py-20 px-6 sm:px-10 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-700">
            Comprehensive Waste Segregation
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            8 Supported Recyclable Categories
          </h2>
          <p className="mt-3 text-sm text-gray-600">
            Each waste category has tailored EcoPoints rewards and recyclability weights calculated
            transparently on the server.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: "E-Waste", pts: 40, icon: "⚡", desc: "Batteries, circuits, cables" },
            { name: "Glass", pts: 25, icon: "🍾", desc: "Bottles, jars, transparent glass" },
            { name: "Metal", pts: 20, icon: "🥫", desc: "Aluminum cans, tin containers" },
            { name: "Plastic", pts: 15, icon: "🧴", desc: "PET/HDPE clean bottles" },
            { name: "Organic", pts: 12, icon: "🍌", desc: "Food scraps & compostables" },
            { name: "Paper", pts: 10, icon: "📄", desc: "Newspapers, documents, paper" },
            { name: "Cardboard", pts: 10, icon: "📦", desc: "Corrugated boxes, cartons" },
            { name: "Other", pts: 5, icon: "🗑️", desc: "Dry recyclable items" },
          ].map((cat) => (
            <div
              key={cat.name}
              className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm hover:shadow-md transition hover:border-emerald-200 text-center"
            >
              <span className="text-4xl">{cat.icon}</span>
              <h3 className="mt-2 text-sm font-bold text-gray-900">{cat.name}</h3>
              <span className="inline-block mt-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                +{cat.pts} pts/kg
              </span>
              <p className="mt-2 text-[11px] text-gray-500 leading-tight">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-white py-20 px-6 sm:px-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-700">
              Workflow
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Simple 4-Step PBL Process
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: "01", title: "Segregate", icon: "♻️", desc: "Manually classify recyclable items into appropriate categories." },
              { step: "02", title: "Log Mass", icon: "⚖️", desc: "Submit weight in kilograms and pair with a nearby campus smart bin." },
              { step: "03", title: "Collect Points", icon: "⭐", desc: "Server computes points deterministically and logs to your ledger." },
              { step: "04", title: "Redeem Rewards", icon: "🎁", desc: "Exchange EcoPoints for meal coupons, vouchers, and certificates." },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl border border-gray-100 bg-slate-50 p-6 text-center">
                <span className="inline-block text-xs font-mono font-black text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full mb-3">
                  STEP {s.step}
                </span>
                <div className="text-4xl mb-2">{s.icon}</div>
                <h3 className="text-base font-extrabold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-950 py-12 px-6 text-white text-center sm:text-left">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-xl">🌱</span>
              <span className="text-lg font-black tracking-tight">EcoSort</span>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Web Technology Project-Based Learning Platform • College PBL Edition
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-400 justify-center sm:justify-end">
            <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
            <Link href="/dispose" className="hover:text-white transition">Dispose</Link>
            <Link href="/rewards" className="hover:text-white transition">Rewards</Link>
            <Link href="/leaderboard" className="hover:text-white transition">Leaderboard</Link>
            <Link href="/bins" className="hover:text-white transition">Smart Bins</Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-800 text-center text-[11px] text-gray-500">
          © 2026 EcoSort • Developed for Web Technology Project-Based Learning
        </div>
      </footer>
    </main>
  );
}