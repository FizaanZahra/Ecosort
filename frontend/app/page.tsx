"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import {
  Leaf,
  Recycle,
  Scale,
  Coins,
  Gift,
  Layers,
  Trophy,
  ArrowRight,
  ShieldCheck,
  Zap,
  Wine,
  FileText,
  Box,
  Trash2,
  Apple,
  Cpu,
  Ticket,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  const wasteCategories = [
    { name: "E-Waste", pts: 40, icon: Cpu, desc: "Electronics, circuits, batteries", color: "text-amber-400 bg-amber-950/40 border-amber-800/40" },
    { name: "Glass", pts: 25, icon: Wine, desc: "Bottles, jars, transparent glass", color: "text-cyan-400 bg-cyan-950/40 border-cyan-800/40" },
    { name: "Metal", pts: 20, icon: Zap, desc: "Aluminum cans, tin containers", color: "text-blue-400 bg-blue-950/40 border-blue-800/40" },
    { name: "Plastic", pts: 15, icon: Box, desc: "PET/HDPE clean containers", color: "text-emerald-400 bg-emerald-950/40 border-emerald-800/40" },
    { name: "Organic", pts: 12, icon: Apple, desc: "Compostable organic matter", color: "text-lime-400 bg-lime-950/40 border-lime-800/40" },
    { name: "Paper", pts: 10, icon: FileText, desc: "Newspapers, documents, paper", color: "text-indigo-400 bg-indigo-950/40 border-indigo-800/40" },
    { name: "Cardboard", pts: 10, icon: Layers, desc: "Corrugated boxes, packaging", color: "text-orange-400 bg-orange-950/40 border-orange-800/40" },
    { name: "General Dry", pts: 5, icon: Trash2, desc: "Non-hazardous recyclable dry waste", color: "text-slate-400 bg-slate-900 border-slate-700" },
  ];

  const workflowSteps = [
    { step: "01", title: "Segregate Waste", icon: Recycle, desc: "Classify items into designated recyclable categories with standardized sorting." },
    { step: "02", title: "Log Quantity", icon: Scale, desc: "Record the mass in kilograms and associate it with a smart bin station." },
    { step: "03", title: "Earn EcoPoints", icon: Coins, desc: "Server computes points deterministically based on verified material recyclability." },
    { step: "04", title: "Redeem Rewards", icon: Gift, desc: "Exchange accumulated points for campus dining vouchers, discounts, and badges." },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-black">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl px-6 py-4 shadow-lg sm:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                Eco<span className="text-emerald-500">Sort</span>
              </span>
              <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:block">
                Smart Waste Platform
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#features" className="hover:text-emerald-400 transition-colors">
              Waste Streams
            </a>
            <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">
              How It Works
            </a>
            <Link href="/bins" className="hover:text-emerald-400 transition-colors">
              Smart Bins
            </Link>
            <Link href="/leaderboard" className="hover:text-emerald-400 transition-colors">
              Leaderboard
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-900/40 hover:from-emerald-500 hover:to-teal-500 transition active:scale-95"
              >
                <span>Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-900/40 hover:bg-emerald-500 transition active:scale-95"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950 py-20 px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-4 py-1.5 text-xs font-bold text-emerald-400 shadow-sm mb-6">
                <ShieldCheck className="h-4 w-4" />
                <span>Enterprise Smart Waste Segregation & Rewards</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Smart Waste Segregation, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Tracked & Rewarded</span>
              </h1>

              <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                EcoSort transforms community waste management into an efficient, incentivized ecosystem.
                Categorize waste across 8 streams, earn verified EcoPoints, unlock campus dining
                vouchers, and monitor live smart bin fleet telemetry.
              </p>

              <div className="mt-8 flex flex-wrap gap-3.5">
                <Link
                  href={user ? "/dashboard" : "/register"}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-emerald-900/50 hover:from-emerald-500 hover:to-teal-500 transition active:scale-95"
                >
                  <span>{user ? "Open Dashboard" : "Start Recycling Today"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/rewards"
                  className="inline-flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-950/30 px-6 py-3.5 text-sm font-extrabold text-amber-300 shadow-sm hover:bg-amber-900/40 hover:border-amber-400 transition"
                >
                  <Gift className="h-4 w-4 text-amber-400" />
                  <span>Rewards Store</span>
                </Link>
                <Link
                  href="/bins"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-extrabold text-slate-200 shadow-sm hover:bg-slate-800 transition"
                >
                  <Layers className="h-4 w-4 text-emerald-400" />
                  <span>Smart Bins</span>
                </Link>
              </div>

              {/* Metric stats strip */}
              <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-3 gap-4">
                <div>
                  <span className="text-2xl font-black text-white">8 Streams</span>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Categorized Recyclables</p>
                </div>
                <div>
                  <span className="text-2xl font-black text-emerald-400">Deterministic</span>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">EcoPoints Algorithm</p>
                </div>
                <div>
                  <span className="text-2xl font-black text-amber-400">100% Transparent</span>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Material Recovery Score</p>
                </div>
              </div>
            </div>

            {/* Visual Hero Dashboard Card */}
            <div className="relative">
              <div className="relative mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/40 text-slate-100">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500/80"></span>
                    <span className="h-3 w-3 rounded-full bg-amber-500/80"></span>
                    <span className="h-3 w-3 rounded-full bg-emerald-500/80"></span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">ecosort-live-monitor</span>
                </div>

                {/* Dashboard Highlights */}
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-emerald-800/60 bg-emerald-950/40 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300">EcoPoints Balance</span>
                      <Coins className="h-5 w-5 text-amber-400" />
                    </div>
                    <p className="text-3xl font-black text-emerald-400 mt-1">250 pts</p>
                    <p className="text-[11px] text-emerald-300 mt-0.5 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 inline text-emerald-400" />
                      <span>Eligible for Campus Dining Voucher</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Recovery Score</span>
                        <BarChart3 className="h-3.5 w-3.5 text-purple-400" />
                      </div>
                      <p className="text-xl font-black text-purple-400 mt-1">84%</p>
                      <div className="mt-1.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full w-[84%]"></div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Fleet Stations</span>
                        <Layers className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <p className="text-xl font-black text-emerald-400 mt-1">4 Active</p>
                      <span className="text-[10px] font-bold text-slate-400">Real-time Telemetry</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-amber-500/30 bg-amber-950/30 p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-950/60 border border-amber-800/40 text-amber-400">
                        <Ticket className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-amber-200">Cafeteria 25% Off Voucher</p>
                        <p className="text-[10px] font-mono text-amber-400/80">CAMPUS-MEAL-8F3A</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-amber-900/60 border border-amber-700/60 px-2 py-0.5 text-[10px] font-bold text-amber-300">
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
          <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-400">
            Comprehensive Waste Segregation
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            8 Standardized Recyclable Categories
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Every material stream is configured with transparent recyclability weights and deterministic
            reward multipliers.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {wasteCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg hover:border-emerald-500/40 transition hover:bg-slate-900 text-center flex flex-col items-center justify-center"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${cat.color} mb-3`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-white">{cat.name}</h3>
                <span className="inline-block mt-1.5 rounded-full bg-emerald-950/70 border border-emerald-800/60 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-400">
                  +{cat.pts} pts/kg
                </span>
                <p className="mt-2 text-[11px] text-slate-400 leading-tight">{cat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-t border-slate-800 bg-slate-900/40 py-20 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-400">
              Workflow
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              4-Step Recycling Lifecycle
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {workflowSteps.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 text-center hover:border-slate-700 transition">
                  <span className="inline-block text-xs font-mono font-black text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2.5 py-1 rounded-full mb-4">
                    STEP {s.step}
                  </span>
                  <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400 mb-3">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-white">{s.title}</h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 px-6 text-slate-400 text-center sm:text-left">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <Leaf className="h-5 w-5 text-emerald-500" />
              <span className="text-lg font-black tracking-tight text-white">EcoSort</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Smart Waste Management & Material Recovery Platform
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-xs font-semibold text-slate-400 justify-center sm:justify-end">
            <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">Dashboard</Link>
            <Link href="/dispose" className="hover:text-emerald-400 transition-colors">Dispose</Link>
            <Link href="/rewards" className="hover:text-emerald-400 transition-colors">Rewards</Link>
            <Link href="/leaderboard" className="hover:text-emerald-400 transition-colors">Leaderboard</Link>
            <Link href="/bins" className="hover:text-emerald-400 transition-colors">Smart Bins</Link>
            <Link href="/admin/login" className="hover:text-emerald-400 transition-colors">Admin Console</Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-900 text-center text-[11px] text-slate-600">
          © 2026 EcoSort • Smart Waste Segregation Platform
        </div>
      </footer>
    </main>
  );
}