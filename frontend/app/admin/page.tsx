"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { api, Bin, WasteRecord } from "../../lib/api";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  ecoPoints: number;
  totalDisposals: number;
  createdAt: string;
}

interface AdminOverviewData {
  metrics: {
    totalUsers: number;
    totalWasteKg: number;
    totalBins: number;
    fullBins: number;
    almostFullBins: number;
    totalDisposalTransactions: number;
    categoryDistribution: Record<string, number>;
  };
  bins: Bin[];
  recentActivity: Array<WasteRecord & { user?: { name: string; email: string } }>;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();

  const [overview, setOverview] = useState<AdminOverviewData | null>(null);
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
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
      const msg = err instanceof Error ? err.message : "Failed to load administrative data.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user?.role === "admin") {
      fetchAdminData();
    } else if (user) {
      setLoading(false);
    }
  }, [user, authLoading, router, fetchAdminData]);

  const handleBootstrapAdmin = async () => {
    setBootstrapLoading(true);
    setError(null);
    try {
      const res = await api.admin.setupFirstAdmin();
      if (res.success) {
        setMessage("Admin privileges granted successfully!");
        await refreshUser();
        fetchAdminData();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Bootstrap failed.";
      setError(msg);
    } finally {
      setBootstrapLoading(false);
    }
  };

  const handleSimulateFill = async (binId: string, percentage: number) => {
    try {
      const res = await api.bins.simulateFill(binId, percentage);
      if (res.success) {
        setMessage(`Updated ${res.bin.name} to ${percentage}% fill.`);
        fetchAdminData();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Fill update failed.";
      setError(msg);
    }
  };

  const handleRoleToggle = async (userId: string, currentRole: "user" | "admin") => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      const res = await api.admin.updateRole(userId, newRole);
      if (res.success) {
        setMessage(`Role updated to ${newRole}`);
        fetchAdminData();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to change role.";
      setError(msg);
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!confirm("Are you sure you want to delete this waste record and adjust user points?")) {
      return;
    }

    try {
      const res = await api.admin.deleteWasteRecord(recordId);
      if (res.success) {
        setMessage("Record removed successfully.");
        fetchAdminData();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete record.";
      setError(msg);
    }
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
        </div>
      </main>
    );
  }

  // If user is not admin
  if (user && user.role !== "admin") {
    return (
      <main className="min-h-screen bg-gray-50 pb-16">
        <Navbar />
        <div className="mx-auto max-w-xl px-6 py-20 text-center">
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <span className="text-5xl">🛡️</span>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Administrator Access Required</h2>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              You are logged in as <span className="font-semibold">{user.email}</span> with standard user
              permissions. The administrative console is restricted to administrators.
            </p>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                ⚠️ {error}
              </div>
            )}

            <div className="mt-6 rounded-xl border border-green-200 bg-green-50/70 p-4 text-left">
              <p className="text-xs font-bold text-green-900">College PBL Demonstration Tool:</p>
              <p className="mt-1 text-xs text-green-800 leading-relaxed">
                If this is your first time setting up EcoSort, you can initialize your account as the primary
                Administrator below.
              </p>
              <button
                onClick={handleBootstrapAdmin}
                disabled={bootstrapLoading}
                className="mt-3 w-full rounded-lg bg-green-700 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-green-800 disabled:opacity-60 transition-colors"
              >
                {bootstrapLoading ? "Promoting..." : "Set My Account as Administrator"}
              </button>
            </div>

            <Link
              href="/dashboard"
              className="mt-6 inline-block text-xs font-semibold text-gray-500 hover:text-gray-800"
            >
              ← Return to User Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-bold text-green-800">
                ADMIN CONSOLE
              </span>
              <h2 className="text-3xl font-bold text-gray-900">System Management</h2>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Oversee community waste collection, simulated smart bins, and registered users.
            </p>
          </div>

          <button
            onClick={fetchAdminData}
            className="self-start rounded-lg border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 sm:self-auto"
          >
            ↻ Refresh All Data
          </button>
        </div>

        {message && (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            ✅ {message}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            ⚠️ {error}
          </div>
        )}

        {/* Collection Alert Banner */}
        {overview && overview.metrics.fullBins > 0 && (
          <div className="mt-6 rounded-2xl border border-red-300 bg-red-50 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="text-sm font-bold text-red-800">Critical Waste Collection Alert</h4>
                <p className="text-xs text-red-700 mt-0.5">
                  {overview.metrics.fullBins} bin(s) currently exceed 90% capacity and require municipal collection.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* System Metrics Grid */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <span className="text-3xl">👥</span>
            <p className="mt-3 text-xs text-gray-500 uppercase font-semibold">Total Users</p>
            <h3 className="text-3xl font-bold text-gray-900">{overview?.metrics.totalUsers ?? 0}</h3>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <span className="text-3xl">♻️</span>
            <p className="mt-3 text-xs text-gray-500 uppercase font-semibold">Total Waste Processed</p>
            <h3 className="text-3xl font-bold text-green-700">
              {overview?.metrics.totalWasteKg ?? 0} <span className="text-sm font-normal text-gray-500">kg</span>
            </h3>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <span className="text-3xl">🗑️</span>
            <p className="mt-3 text-xs text-gray-500 uppercase font-semibold">Active Bins</p>
            <h3 className="text-3xl font-bold text-gray-900">{overview?.metrics.totalBins ?? 0}</h3>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <span className="text-3xl">🚨</span>
            <p className="mt-3 text-xs text-gray-500 uppercase font-semibold">Full Bins</p>
            <h3 className="text-3xl font-bold text-red-600">{overview?.metrics.fullBins ?? 0}</h3>
          </div>
        </div>

        {/* Simulated Bin Monitoring & Controls */}
        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Simulated Smart Bins Management</h3>
              <p className="text-xs text-gray-500">
                Adjust simulated fill levels for PBL demonstration without hardware sensors.
              </p>
            </div>
            <Link
              href="/bins"
              className="text-xs font-semibold text-green-700 hover:underline"
            >
              Public View →
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {overview?.bins.map((bin) => {
              const isFull = bin.simulatedFillPercentage >= 90;
              const isAlmost = bin.simulatedFillPercentage >= 70 && !isFull;
              return (
                <div key={bin._id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-900">{bin.name}</span>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-bold ${
                        isFull
                          ? "bg-red-100 text-red-800"
                          : isAlmost
                          ? "bg-amber-100 text-amber-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {bin.simulatedFillPercentage}%
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{bin.location}</p>

                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-600 mb-1.5">Simulate Level:</p>
                    <div className="grid grid-cols-4 gap-1">
                      {[15, 50, 80, 95].map((pct) => (
                        <button
                          key={pct}
                          onClick={() => handleSimulateFill(bin._id, pct)}
                          className="rounded border border-gray-300 bg-white py-1 text-xs font-semibold text-gray-700 hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors"
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
        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900">Registered Community Users</h3>
          <p className="text-xs text-gray-500 mb-4">
            Manage user accounts, roles, and view overall points standings.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-600">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">EcoPoints</th>
                  <th className="px-6 py-3">Disposals</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">{u.name}</td>
                    <td className="px-6 py-4 text-gray-600">{u.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                          u.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-green-700">⭐ {u.ecoPoints}</td>
                    <td className="px-6 py-4 text-gray-700">{u.totalDisposals}</td>
                    <td className="px-6 py-4 text-right">
                      {u.id !== user?.id && (
                        <button
                          onClick={() => handleRoleToggle(u.id, u.role)}
                          className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
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
        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900">System-Wide Waste Disposal Logs</h3>
          <p className="text-xs text-gray-500 mb-4">
            Auditable records of all community waste submissions with fraud protection.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-600">
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
              <tbody className="divide-y divide-gray-100">
                {overview?.recentActivity.map((rec) => (
                  <tr key={rec._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(rec.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {rec.user?.name || "Unknown"}
                      <span className="block text-xs font-normal text-gray-400">
                        {rec.user?.email || ""}
                      </span>
                    </td>
                    <td className="px-6 py-4 capitalize font-medium text-gray-800">
                      {rec.wasteCategory}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">{rec.quantity} kg</td>
                    <td className="px-6 py-4 text-gray-600">{rec.binName || "General Bin"}</td>
                    <td className="px-6 py-4 font-bold text-green-700">+{rec.pointsEarned} pts</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteRecord(rec._id)}
                        className="rounded border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Delete & Revoke Points
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