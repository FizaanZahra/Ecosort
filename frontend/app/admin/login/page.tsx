"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { ShieldCheck, Mail, Lock, AlertCircle, ArrowRight, ArrowLeft, KeyRound } from "lucide-react";

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
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 text-slate-100 selection:bg-emerald-500 selection:text-black">
      <div className="w-full max-w-md">
        {/* Security Shield Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-8 shadow-2xl shadow-emerald-950/30 text-white">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-lg shadow-emerald-600/30 text-white">
              <ShieldCheck className="h-7 w-7" />
            </div>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-950/80 px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 border border-emerald-800/80">
              Admin Portal
            </div>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-white">
              System Administration
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Restricted management console for EcoSort operators and staff.
            </p>
          </div>

          {error && (
            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-950/60 p-3.5 text-xs font-semibold text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ecosort.com"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Master Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg shadow-emerald-950/40 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60 transition active:scale-[0.98]"
            >
              <span>{loading ? "Authenticating Administrator..." : "Sign In to Admin Console"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Demo Credentials Quick-Fill Pill */}
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 text-center">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-emerald-400" />
                <span>Demo Administrator:</span>
              </span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline"
              >
                Auto-fill Demo Credentials
              </button>
            </div>
            <p className="mt-1 font-mono text-[11px] text-slate-400 text-left pl-5">
              admin@ecosort.com • admin123
            </p>
          </div>

          {/* Footer Back link */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to Standard Member Login</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
