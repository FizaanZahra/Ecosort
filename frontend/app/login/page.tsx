"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { Leaf, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.message || "Invalid email or password.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-slate-100">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-8 shadow-2xl shadow-emerald-950/20">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Leaf className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              Eco<span className="text-emerald-500">Sort</span>
            </span>
          </Link>
          <h1 className="mt-4 text-xl font-bold text-white">Welcome Back</h1>
          <p className="mt-1 text-xs text-slate-400">Sign in to record waste disposals and manage EcoPoints.</p>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-xl bg-red-950/60 p-3.5 text-xs font-semibold text-red-300 border border-red-500/30">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
              Password
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
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-emerald-950/40 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60 transition active:scale-[0.98]"
          >
            <span>{loading ? "Authenticating..." : "Sign In"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-emerald-400 hover:text-emerald-300 underline">
            Register
          </Link>
        </p>

        {/* Administrator Portal Link */}
        <div className="mt-6 border-t border-slate-800 pt-4 text-center">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Looking for Administrator Portal? Sign in as Admin →</span>
          </Link>
        </div>
      </div>
    </main>
  );
}