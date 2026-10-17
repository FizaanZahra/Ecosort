"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

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
    <main className="flex min-h-screen items-center justify-center bg-green-50 px-6 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-block text-3xl font-bold text-green-700">
            🌱 EcoSort
          </Link>
          <p className="mt-2 text-gray-600">Welcome back!</p>
        </div>

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-3.5 text-sm font-medium text-red-700 border border-red-200">
            ⚠️ {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-lg bg-green-600 py-3 font-semibold text-white shadow-sm hover:bg-green-700 disabled:opacity-60 transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-green-600 hover:underline">
            Register
          </Link>
        </p>

        {/* Administrator Portal Link */}
        <div className="mt-6 border-t border-gray-100 pt-4 text-center">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-emerald-700 transition-colors"
          >
            <span>🛡️</span>
            <span>Looking for Administrator Portal? Sign in as Admin →</span>
          </Link>
        </div>
      </div>
    </main>
  );
}