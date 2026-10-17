"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";

export default function AdminLogin() {
  const router = useRouter();
  const { adminLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please provide both admin email and password.");
      return;
    }

    setLoading(true);
    const result = await adminLogin(email, password);
    setLoading(false);

    if (result.success) {
      router.push("/admin");
    } else {
      setError(
        result.message ||
          "Authentication failed. Please verify administrator credentials."
      );
    }
  };

  const handleFillDemo = () => {
    setEmail("admin@ecosort.com");
    setPassword("admin123");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-950 via-slate-900 to-emerald-950 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Security Shield Card */}
        <div className="rounded-3xl border border-slate-700/80 bg-slate-900/90 backdrop-blur-xl p-8 shadow-2xl shadow-emerald-950/40 text-white">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-lg shadow-emerald-600/30 text-white">
              <span className="text-2xl">🛡️</span>
            </div>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-950 px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 border border-emerald-800">
              Admin Portal
            </div>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-white">
              System Administration
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Restricted management console for EcoSort operators and reviewers.
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-950/60 p-3.5 text-xs font-semibold text-red-300">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ecosort.com"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Master Password
                </label>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-xs font-extrabold text-white shadow-lg shadow-emerald-700/25 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60 transition active:scale-[0.98]"
            >
              {loading ? "Authenticating Administrator..." : "Sign In to Admin Console →"}
            </button>
          </form>

          {/* Demo Credentials Quick-Fill Pill */}
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 text-center">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Demo Administrator:</span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline"
              >
                Auto-fill Demo Credentials
              </button>
            </div>
            <p className="mt-1 font-mono text-[11px] text-slate-400">
              admin@ecosort.com • admin123
            </p>
          </div>

          {/* Footer Back link */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-400 hover:text-emerald-400 transition"
            >
              ← Return to Standard Member Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
