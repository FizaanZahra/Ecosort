"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { api, AdminOverview, User, Bin, WasteRecord } from "../../lib/api";
import {
  Shield,
  ShieldAlert,
  Users,
  Recycle,
  Layers,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Coins,
  Trash2,
  Sliders,
  ArrowLeft,
  ArrowRight,
  UserCheck,
} from "lucide-react";

interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  ecoPoints: number;
  totalDisposals: number;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [usersList, setUsersList] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [bootstrapLoading, setBootstrapLoading] = useState(false);

  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewRes, usersRes] = await Promise.all([
        api.admin.getOverview(),
        api.admin.getUsers(),
      ]);

      if (overviewRes.success) setOverview(overviewRes);
      if (usersRes.success) setUsersList(usersRes.users);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load admin data.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/admin/login");
      return;
    }

    if (user && user.role === "admin") {
      fetchAdminData();
    }
  }, [user, authLoading, router, fetchAdminData]);

  const handleBootstrapAdmin = async () => {
    setBootstrapLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await api.admin.setupFirstAdmin();
      if (res.success) {
        setMessage(res.message);
        window.location.reload();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Promotion failed.";
      setError(msg);
    } finally {
      setBootstrapLoading(false);
    }
  };

  const handleSimulateFill = async (binId: string, percentage: number) => {
    setMessage(null);
    setError(null);
    try {
      const res = await api.bins.simulateFill(binId, percentage);
      if (res.success) {
        setMessage(`Updated ${res.bin.name} to ${percentage}% fill capacity.`);
        fetchAdminData();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update bin fill level.";
      setError(msg);
    }
  };

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }

    try {
      const res = await api.admin.updateUserRole(userId, newRole);
      if (res.success) {
        setMessage(res.message);
        fetchAdminData();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update role.";
      setError(msg);
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this disposal record? Associated EcoPoints will be deducted from the user."
      )
    ) {
      return;
    }

    try {
      const res = await api.admin.deleteRecord(recordId);
      if (res.success) {
        setMessage(res.message);
        fetchAdminData();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete record.";
      setError(msg);
    }
  };

  if (authLoading || (loading && user?.role === "admin" && !overview)) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <div className="flex h-96 items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Loading Admin Console...</p>
          </div>
        </div>
      </main>
    );
  }

  // If user is not admin
  if (user && user.role !== "admin") {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 pb-16 selection:bg-emerald-500 selection:text-black">
        <Navbar />
        <div className="mx-auto max-w-xl px-6 py-20 text-center">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-8 shadow-2xl">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-amber-950/70 border border-amber-700/60 text-amber-400 mb-4">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Administrator Access Required</h2>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              You are signed in as <span className="font-semibold text-white">{user.email}</span> with standard member
              permissions. The administrative management console is restricted to administrators.
            </p>

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-950/60 p-3 text-xs font-semibold text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-left">
              <p className="text-xs font-bold text-slate-300">Initial System Setup:</p>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                If the platform currently has zero registered administrators, you may initialize your account as the primary operator.
              </p>
              <button
                onClick={handleBootstrapAdmin}
                disabled={bootstrapLoading}
                className="mt-3 w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 disabled:opacity-60 transition"
              >
                {bootstrapLoading ? "Promoting..." : "Set My Account as Administrator"}
              </button>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/60 px-4 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-900/40 transition"
              >
                <Shield className="h-3.5 w-3.5" />
                <span>Switch to Administrator Account</span>
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-20 selection:bg-emerald-500 selection:text-black">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                ADMIN CONSOLE
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">System Management</h2>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Oversee community waste collection, smart bin fleet telemetry, and user access roles.
            </p>
          </div>

          <button
            onClick={fetchAdminData}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-300 shadow-md hover:bg-slate-800 hover:text-white transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh All Data</span>
          </button>
        </div>

        {message && (
          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-emerald-800/60 bg-emerald-950/60 p-4 text-xs font-semibold text-emerald-300 shadow-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-950/60 p-4 text-xs font-semibold text-red-300 shadow-sm">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Collection Alert Banner */}
        {overview && overview.metrics.fullBins > 0 && (
          <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-950/60 p-5 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-900/80 text-red-300 border border-red-700">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Critical Waste Collection Alert</h4>
                <p className="text-xs text-red-300 mt-0.5">
                  {overview.metrics.fullBins} bin(s) currently exceed 90% capacity and require municipal collection.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* System Metrics Grid */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-950/30 via-slate-900 to-slate-900 p-6 shadow-xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-950 border border-blue-700 text-blue-400">
              <Users className="h-6 w-6" />
            </div>
            <p className="mt-4 text-xs text-slate-400 uppercase font-semibold">Total Users</p>
            <h3 className="mt-1 text-3xl font-black text-white">{overview?.metrics.totalUsers ?? 0}</h3>
          </div>

          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-900 p-6 shadow-xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-950 border border-emerald-700 text-emerald-400">
              <Recycle className="h-6 w-6" />
            </div>
            <p className="mt-4 text-xs text-slate-400 uppercase font-semibold">Total Waste Processed</p>
            <h3 className="mt-1 text-3xl font-black text-emerald-400">
              {overview?.metrics.totalWasteKg ?? 0} <span className="text-sm font-normal text-slate-400">kg</span>
            </h3>
          </div>

          <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-br from-teal-950/30 via-slate-900 to-slate-900 p-6 shadow-xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-950 border border-teal-700 text-teal-400">
              <Layers className="h-6 w-6" />
            </div>
            <p className="mt-4 text-xs text-slate-400 uppercase font-semibold">Active Bins</p>
            <h3 className="mt-1 text-3xl font-black text-white">{overview?.metrics.totalBins ?? 0}</h3>
          </div>

          <div className="rounded-3xl border border-red-500/30 bg-gradient-to-br from-red-950/30 via-slate-900 to-slate-900 p-6 shadow-xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-950 border border-red-700 text-red-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <p className="mt-4 text-xs text-slate-400 uppercase font-semibold">Full Bins</p>
            <h3 className="mt-1 text-3xl font-black text-red-400">{overview?.metrics.fullBins ?? 0}</h3>
          </div>
        </div>

        {/* Smart Bin Monitoring & Controls */}
        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Smart Bins Fleet Management</h3>
              <p className="text-xs text-slate-400">
                Adjust receptacle fill levels and collection thresholds.
              </p>
            </div>
            <Link
              href="/bins"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              <span>Public View</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {overview?.bins.map((bin: Bin) => {
              const isFull = bin.simulatedFillPercentage >= 90;
              const isAlmost = bin.simulatedFillPercentage >= 70 && !isFull;
              return (
                <div key={bin._id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{bin.name}</span>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-bold border ${
                        isFull
                          ? "bg-red-950/80 text-red-400 border-red-800/60"
                          : isAlmost
                          ? "bg-amber-950/80 text-amber-400 border-amber-800/60"
                          : "bg-emerald-950/80 text-emerald-400 border-emerald-800/60"
                      }`}
                    >
                      {bin.simulatedFillPercentage}%
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{bin.location}</p>

                  <div className="mt-3">
                    <p className="text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1">
                      <Sliders className="h-3 w-3 text-emerald-400" />
                      <span>Set Fill Level:</span>
                    </p>
                    <div className="grid grid-cols-4 gap-1">
                      {[15, 50, 80, 95].map((pct) => (
                        <button
                          key={pct}
                          onClick={() => handleSimulateFill(bin._id, pct)}
                          className="rounded-lg border border-slate-800 bg-slate-900 py-1 text-xs font-semibold text-slate-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-colors"
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Registered Users Management */}
        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Registered Community Users</h3>
              <p className="text-xs text-slate-400">
                Manage user accounts, roles, and overall points standings.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-800 bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">EcoPoints</th>
                  <th className="px-6 py-3">Disposals</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">{u.name}</td>
                    <td className="px-6 py-4 text-slate-400">{u.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase border ${
                          u.role === "admin"
                            ? "bg-purple-950/70 text-purple-400 border-purple-800/60"
                            : "bg-slate-950 text-slate-400 border-slate-800"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-amber-400 flex items-center gap-1">
                      <Coins className="h-3.5 w-3.5 text-amber-400" />
                      <span>{u.ecoPoints}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{u.totalDisposals}</td>
                    <td className="px-6 py-4 text-right">
                      {u.id !== user?.id && (
                        <button
                          onClick={() => handleRoleToggle(u.id, u.role)}
                          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
                        >
                          Make {u.role === "admin" ? "User" : "Admin"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System-wide Activity Table */}
        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">System-Wide Waste Disposal Logs</h3>
              <p className="text-xs text-slate-400">
                Auditable records of all community waste submissions with fraud protection.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-800 bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Quantity</th>
                  <th className="px-6 py-3">Bin</th>
                  <th className="px-6 py-3">Points Awarded</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {overview?.recentActivity.map((rec: WasteRecord & { user?: { name: string; email: string } }) => (
                  <tr key={rec._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(rec.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">
                      {rec.user?.name || "Unknown"}
                      <span className="block text-xs font-normal text-slate-400">
                        {rec.user?.email || ""}
                      </span>
                    </td>
                    <td className="px-6 py-4 capitalize font-medium text-slate-200">
                      {rec.wasteCategory}
                    </td>
                    <td className="px-6 py-4 font-bold text-white">{rec.quantity} kg</td>
                    <td className="px-6 py-4 text-slate-400">{rec.binName || "General Bin"}</td>
                    <td className="px-6 py-4 font-bold text-emerald-400">+{rec.pointsEarned} pts</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteRecord(rec._id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-500/40 bg-red-950/40 px-2.5 py-1 text-xs font-semibold text-red-300 hover:bg-red-900/60 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete & Revoke Points</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}