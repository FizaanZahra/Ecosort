"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { api, AdminOverview, Bin, WasteRecord, LocationGroup } from "../../lib/api";
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
  Plus,
  Edit3,
  Send,
  Megaphone,
  MapPin,
  Building2,
  Sparkles,
  X,
  Bell,
  Check,
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

  const [activeTab, setActiveTab] = useState<"bins" | "users" | "notifications" | "activity">("bins");
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [usersList, setUsersList] = useState<AdminUserRow[]>([]);
  const [locations, setLocations] = useState<LocationGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [bootstrapLoading, setBootstrapLoading] = useState(false);

  // Add Bin Modal State
  const [addBinModalOpen, setAddBinModalOpen] = useState(false);
  const [newBinId, setNewBinId] = useState("");
  const [newBinName, setNewBinName] = useState("");
  const [newBinCity, setNewBinCity] = useState("Kodakara");
  const [isCustomCity, setIsCustomCity] = useState(false);
  const [customCityName, setCustomCityName] = useState("");
  const [newBinArea, setNewBinArea] = useState("");
  const [newBinLocation, setNewBinLocation] = useState("");
  const [newBinCategory, setNewBinCategory] = useState("All");
  const [newBinCapacity, setNewBinCapacity] = useState(60);
  const [newBinFill, setNewBinFill] = useState(0);
  const [submittingBin, setSubmittingBin] = useState(false);

  // Edit Bin Modal State
  const [editBinModalOpen, setEditBinModalOpen] = useState(false);
  const [editingBin, setEditingBin] = useState<Bin | null>(null);
  const [editBinName, setEditBinName] = useState("");
  const [editBinCity, setEditBinCity] = useState("");
  const [editBinArea, setEditBinArea] = useState("");
  const [editBinLocation, setEditBinLocation] = useState("");
  const [editBinCategory, setEditBinCategory] = useState("All");
  const [editBinCapacity, setEditBinCapacity] = useState(50);
  const [editBinStatus, setEditBinStatus] = useState("Available");
  const [updatingBin, setUpdatingBin] = useState(false);

  // Edit User Modal State
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserRow | null>(null);
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserRole, setEditUserRole] = useState<"user" | "admin">("user");
  const [editUserPoints, setEditUserPoints] = useState(0);
  const [updatingUser, setUpdatingUser] = useState(false);

  // Send Notification State
  const [notifRecipientType, setNotifRecipientType] = useState<"ALL" | "CITY" | "USER">("ALL");
  const [notifTargetCity, setNotifTargetCity] = useState("Kodakara");
  const [notifTargetUserId, setNotifTargetUserId] = useState("");
  const [notifType, setNotifType] = useState<"COLLECTION" | "BIN_ALERT" | "ANNOUNCEMENT" | "SYSTEM">("COLLECTION");
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [sendingNotif, setSendingNotif] = useState(false);

  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewRes, usersRes, locRes] = await Promise.all([
        api.admin.getOverview(),
        api.admin.getUsers(),
        api.bins.getLocations().catch(() => ({ success: false, locations: [] })),
      ]);

      if (overviewRes.success) setOverview(overviewRes);
      if (usersRes.success) setUsersList(usersRes.users);
      if (locRes.success) setLocations(locRes.locations);
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

  // Bin Controls
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

  const handleMarkCollected = async (bin: Bin) => {
    setMessage(null);
    setError(null);
    try {
      const res = await api.bins.markCollected(bin._id);
      if (res.success) {
        setMessage(
          `Bin #${bin.binId} (${bin.name}) marked as emptied! Collection notification broadcast to users.`
        );
        fetchAdminData();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to mark bin as collected.";
      setError(msg);
    }
  };

  const handleDeleteBin = async (bin: Bin) => {
    if (!confirm(`Are you sure you want to permanently delete Bin #${bin.binId} (${bin.name})?`)) {
      return;
    }
    setMessage(null);
    setError(null);
    try {
      const res = await api.bins.delete(bin._id);
      if (res.success) {
        setMessage(`Bin #${bin.binId} deleted successfully.`);
        fetchAdminData();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete bin.";
      setError(msg);
    }
  };

  // Create Bin
  const handleCreateBin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBinId || !newBinName || !newBinLocation) {
      setError("Bin ID, Name, and Street Location are required.");
      return;
    }

    setSubmittingBin(true);
    setError(null);
    setMessage(null);

    const targetCity = isCustomCity ? customCityName.trim() : newBinCity.trim();
    if (!targetCity) {
      setError("City/Village is required.");
      setSubmittingBin(false);
      return;
    }

    try {
      const res = await api.bins.create({
        binId: newBinId.trim().toUpperCase(),
        name: newBinName.trim(),
        location: newBinLocation.trim(),
        city: targetCity,
        area: newBinArea.trim() || targetCity,
        acceptedCategory: newBinCategory,
        capacityKg: Number(newBinCapacity),
        simulatedFillPercentage: Number(newBinFill),
      });

      if (res.success) {
        setMessage(`Location and Bin #${res.bin.binId} added successfully!`);
        setAddBinModalOpen(false);
        setNewBinId("");
        setNewBinName("");
        setNewBinArea("");
        setNewBinLocation("");
        setCustomCityName("");
        setIsCustomCity(false);
        fetchAdminData();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add bin.";
      setError(msg);
    } finally {
      setSubmittingBin(false);
    }
  };

  // Open Edit Bin Modal
  const openEditBinModal = (bin: Bin) => {
    setEditingBin(bin);
    setEditBinName(bin.name);
    setEditBinCity(bin.city || "Kodakara");
    setEditBinArea(bin.area || "");
    setEditBinLocation(bin.location);
    setEditBinCategory(bin.acceptedCategory || "All");
    setEditBinCapacity(bin.capacityKg || 50);
    setEditBinStatus(bin.status || "Available");
    setEditBinModalOpen(true);
  };

  const handleUpdateBin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBin) return;

    setUpdatingBin(true);
    setError(null);
    setMessage(null);

    try {
      const res = await api.bins.update(editingBin._id, {
        name: editBinName.trim(),
        city: editBinCity.trim(),
        area: editBinArea.trim(),
        location: editBinLocation.trim(),
        acceptedCategory: editBinCategory,
        capacityKg: Number(editBinCapacity),
        status: editBinStatus,
      });

      if (res.success) {
        setMessage(`Bin #${editingBin.binId} updated successfully.`);
        setEditBinModalOpen(false);
        setEditingBin(null);
        fetchAdminData();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update bin.";
      setError(msg);
    } finally {
      setUpdatingBin(false);
    }
  };

  // Open Edit User Modal
  const openEditUserModal = (u: AdminUserRow) => {
    setEditingUser(u);
    setEditUserName(u.name);
    setEditUserEmail(u.email);
    setEditUserRole(u.role === "admin" ? "admin" : "user");
    setEditUserPoints(u.ecoPoints || 0);
    setEditUserModalOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setUpdatingUser(true);
    setError(null);
    setMessage(null);

    try {
      const res = await api.admin.updateUser(editingUser.id, {
        name: editUserName.trim(),
        email: editUserEmail.trim(),
        role: editUserRole,
        ecoPoints: Number(editUserPoints),
      });

      if (res.success) {
        setMessage(`User profile updated for ${res.user.name}.`);
        setEditUserModalOpen(false);
        setEditingUser(null);
        fetchAdminData();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update user.";
      setError(msg);
    } finally {
      setUpdatingUser(false);
    }
  };

  const handleDeleteUser = async (targetUser: AdminUserRow) => {
    if (targetUser.id === user?.id) {
      alert("You cannot delete your currently active administrator account.");
      return;
    }

    if (!confirm(`Are you sure you want to permanently delete the user account for ${targetUser.email}?`)) {
      return;
    }

    try {
      const res = await api.admin.deleteUser(targetUser.id);
      if (res.success) {
        setMessage(res.message);
        fetchAdminData();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete user.";
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

  // Send Notification Handler
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) {
      setError("Please provide a notification title and message.");
      return;
    }

    setSendingNotif(true);
    setError(null);
    setMessage(null);

    try {
      const payload: {
        userId?: string;
        city?: string;
        title: string;
        message: string;
        type?: string;
      } = {
        title: notifTitle.trim(),
        message: notifMessage.trim(),
        type: notifType,
      };

      if (notifRecipientType === "USER" && notifTargetUserId) {
        payload.userId = notifTargetUserId;
      } else if (notifRecipientType === "CITY" && notifTargetCity) {
        payload.city = notifTargetCity;
      }

      const res = await api.admin.sendNotification(payload);
      if (res.success) {
        setMessage(res.message);
        setNotifTitle("");
        setNotifMessage("");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send notification.";
      setError(msg);
    } finally {
      setSendingNotif(false);
    }
  };

  // Notification Presets
  const applyPreset = (preset: "collected" | "scheduled" | "drive") => {
    if (preset === "collected") {
      setNotifType("COLLECTION");
      setNotifTitle("Waste Bin Emptied & Sanitized");
      setNotifMessage(
        "Municipal collection vehicles have completed waste pickup. Local smart bins have been emptied, sanitized, and are now ready for household waste."
      );
    } else if (preset === "scheduled") {
      setNotifType("BIN_ALERT");
      setNotifTitle("Scheduled Waste Collection Tomorrow");
      setNotifMessage(
        "Municipal waste pickup is scheduled in your area tomorrow between 7:00 AM – 10:00 AM. Please ensure household dry and organic waste are properly segregated."
      );
    } else if (preset === "drive") {
      setNotifType("ANNOUNCEMENT");
      setNotifTitle("Community Cleanliness & Recycling Drive");
      setNotifMessage(
        "Join our community green drive this weekend! Earn 2x bonus EcoPoints for segregating and disposing recyclable plastics and e-waste."
      );
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
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Loading Admin Console...
            </p>
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
              You are signed in as <span className="font-semibold text-white">{user.email}</span> with
              standard member permissions. The administrative management console is restricted to administrators.
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
                If the platform currently has zero registered administrators, you may initialize your
                account as the primary operator.
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

  const distinctCities = Array.from(
    new Set([
      "Kodakara",
      "Chalakudy",
      "Irinjalakuda",
      "Thrissur",
      ...(overview?.bins.map((b) => b.city).filter(Boolean) as string[]),
    ])
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-20 selection:bg-emerald-500 selection:text-black">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                ADMIN CONSOLE
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">System Management</h2>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Manage smart bin locations, adjust fill levels, edit users, and broadcast community alerts.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setAddBinModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Location / Bin</span>
            </button>

            <button
              onClick={fetchAdminData}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-300 shadow-md hover:bg-slate-800 hover:text-white transition"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Banners */}
        {message && (
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-emerald-800/60 bg-emerald-950/60 p-4 text-xs font-semibold text-emerald-300 shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{message}</span>
            </div>
            <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-red-500/40 bg-red-950/60 p-4 text-xs font-semibold text-red-300 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Critical Alert */}
        {overview && overview.metrics.fullBins > 0 && (
          <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-950/60 p-5 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-900/80 text-red-300 border border-red-700">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">Critical Waste Collection Alert</h4>
                <p className="text-xs text-red-300 mt-0.5">
                  {overview.metrics.fullBins} smart bin(s) currently exceed 90% capacity and require municipal collection.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-950/30 via-slate-900 to-slate-900 p-6 shadow-xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-950 border border-blue-700 text-blue-400">
              <Users className="h-6 w-6" />
            </div>
            <p className="mt-4 text-xs text-slate-400 uppercase font-semibold">Total Citizens</p>
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
            <p className="mt-4 text-xs text-slate-400 uppercase font-semibold">Active Smart Bins</p>
            <h3 className="mt-1 text-3xl font-black text-white">{overview?.metrics.totalBins ?? 0}</h3>
          </div>

          <div className="rounded-3xl border border-red-500/30 bg-gradient-to-br from-red-950/30 via-slate-900 to-slate-900 p-6 shadow-xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-950 border border-red-700 text-red-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <p className="mt-4 text-xs text-slate-400 uppercase font-semibold">Bins Requiring Collection</p>
            <h3 className="mt-1 text-3xl font-black text-red-400">{overview?.metrics.fullBins ?? 0}</h3>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab("bins")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
              activeTab === "bins"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
                : "border border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-850 hover:text-white"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Smart Bins & Locations ({overview?.bins.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
              activeTab === "users"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
                : "border border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-850 hover:text-white"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Registered Users ({usersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
              activeTab === "notifications"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
                : "border border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-850 hover:text-white"
            }`}
          >
            <Send className="h-4 w-4" />
            <span>Broadcast & Notifications</span>
          </button>

          <button
            onClick={() => setActiveTab("activity")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
              activeTab === "activity"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
                : "border border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-850 hover:text-white"
            }`}
          >
            <Recycle className="h-4 w-4" />
            <span>Waste Audit Logs</span>
          </button>
        </div>

        {/* TAB 1: SMART BINS & LOCATIONS */}
        {activeTab === "bins" && (
          <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 mb-6 gap-3">
              <div>
                <h3 className="text-lg font-bold text-white">Smart Bins Fleet & Municipal Locations</h3>
                <p className="text-xs text-slate-400">
                  Add new locations, modify bin properties, or mark bins as collected with automatic user notices.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAddBinModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Bin</span>
                </button>
                <Link
                  href="/bins"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 ml-2"
                >
                  <span>Public View</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {overview?.bins.map((bin: Bin) => {
                const isFull = bin.simulatedFillPercentage >= 90;
                const isAlmost = bin.simulatedFillPercentage >= 70 && !isFull;
                return (
                  <div
                    key={bin._id}
                    className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 flex flex-col justify-between hover:border-slate-700 transition"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded">
                              #{bin.binId}
                            </span>
                            <span className="text-xs font-semibold text-slate-400">
                              📍 {bin.city || "Kodakara"}
                            </span>
                          </div>
                          <h4 className="mt-1 font-bold text-sm text-white">{bin.name}</h4>
                        </div>
                        <span
                          className={`rounded px-2 py-0.5 text-xs font-bold border shrink-0 ${
                            isFull
                              ? "bg-red-950/80 text-red-400 border-red-800/60"
                              : isAlmost
                              ? "bg-amber-950/80 text-amber-400 border-amber-800/60"
                              : "bg-emerald-950/80 text-emerald-400 border-emerald-800/60"
                          }`}
                        >
                          {bin.simulatedFillPercentage}% Full
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-slate-300 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="truncate">{bin.area} — {bin.location}</span>
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5">
                          Stream: <strong className="text-slate-200">{bin.acceptedCategory}</strong>
                        </span>
                        <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5">
                          Cap: <strong className="text-slate-200">{bin.capacityKg} kg</strong>
                        </span>
                      </div>

                      {/* Fill Progress Bar */}
                      <div className="mt-3">
                        <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                          <div
                            className={`h-full transition-all duration-300 ${
                              isFull ? "bg-red-500" : isAlmost ? "bg-amber-500" : "bg-emerald-500"
                            }`}
                            style={{ width: `${Math.min(100, bin.simulatedFillPercentage)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-850 flex flex-col gap-2">
                      {/* Mark Collected Action */}
                      <button
                        onClick={() => handleMarkCollected(bin)}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/50 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-900/60 hover:text-white transition"
                        title="Empties bin to 0% and sends notification to users"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Mark as Collected & Emptied</span>
                      </button>

                      <div className="flex items-center justify-between gap-1.5">
                        <button
                          onClick={() => openEditBinModal(bin)}
                          className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-slate-700 bg-slate-900 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
                        >
                          <Edit3 className="h-3 w-3" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteBin(bin)}
                          className="inline-flex items-center justify-center gap-1 rounded-lg border border-red-500/30 bg-red-950/30 px-2.5 py-1 text-xs font-semibold text-red-300 hover:bg-red-900/50 transition"
                          title="Delete Bin"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Set Fill Presets */}
                      <div className="mt-1 flex items-center justify-between gap-1">
                        <span className="text-[10px] text-slate-400">Simulate:</span>
                        {[15, 50, 80, 95].map((pct) => (
                          <button
                            key={pct}
                            onClick={() => handleSimulateFill(bin._id, pct)}
                            className="rounded border border-slate-800 bg-slate-900 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 hover:bg-emerald-600 hover:text-white transition"
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
        )}

        {/* TAB 2: REGISTERED USERS */}
        {activeTab === "users" && (
          <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Registered Community Users</h3>
                <p className="text-xs text-slate-400">
                  Edit user names, emails, roles, and directly adjust EcoPoints standings.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-800 bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-6 py-3">Citizen</th>
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
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditUserModal(u)}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-950/40 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/60 transition"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>Edit</span>
                          </button>

                          {u.id !== user?.id && (
                            <>
                              <button
                                onClick={() => handleRoleToggle(u.id, u.role)}
                                className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
                              >
                                {u.role === "admin" ? "Demote" : "Make Admin"}
                              </button>

                              <button
                                onClick={() => handleDeleteUser(u)}
                                className="rounded-lg border border-red-500/30 bg-red-950/30 p-1 text-red-400 hover:bg-red-900/50 transition"
                                title="Delete user"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: BROADCAST & SEND NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 shadow-xl">
              <div className="border-b border-slate-800 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-950 border border-sky-800 text-sky-400">
                    <Send className="h-4 w-4" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Send Notice to Community</h3>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Broadcast bin collection alerts, scheduled pickups, or direct announcements to users.
                </p>
              </div>

              <form onSubmit={handleSendNotification} className="space-y-4">
                {/* Target Audience */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">
                    Target Recipient
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { type: "ALL", label: "Broadcast All Users" },
                      { type: "CITY", label: "Target by City/Village" },
                      { type: "USER", label: "Direct to User" },
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.type}
                        onClick={() => setNotifRecipientType(opt.type as any)}
                        className={`rounded-xl border p-2 text-xs font-bold transition text-center ${
                          notifRecipientType === opt.type
                            ? "border-emerald-500 bg-emerald-950/60 text-emerald-400"
                            : "border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* City Selector if CITY */}
                {notifRecipientType === "CITY" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Select City / Village</label>
                    <select
                      value={notifTargetCity}
                      onChange={(e) => setNotifTargetCity(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs font-semibold text-white focus:border-emerald-500 focus:outline-none"
                    >
                      {distinctCities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* User Selector if USER */}
                {notifRecipientType === "USER" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Select User</label>
                    <select
                      value={notifTargetUserId}
                      onChange={(e) => setNotifTargetUserId(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs font-semibold text-white focus:border-emerald-500 focus:outline-none"
                      required
                    >
                      <option value="">-- Choose User --</option>
                      {usersList.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.email})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Notification Type */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "COLLECTION", label: "Bin Collected" },
                    { id: "BIN_ALERT", label: "Pickup Alert" },
                    { id: "ANNOUNCEMENT", label: "Announcement" },
                    { id: "SYSTEM", label: "System Notice" },
                  ].map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setNotifType(t.id as any)}
                      className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition ${
                        notifType === t.id
                          ? "border-sky-500 bg-sky-950/60 text-sky-400 font-bold"
                          : "border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Notification Title</label>
                  <input
                    type="text"
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    placeholder="e.g. Waste Bin Collected & Cleaned"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Message Content</label>
                  <textarea
                    rows={3}
                    value={notifMessage}
                    onChange={(e) => setNotifMessage(e.target.value)}
                    placeholder="Type message body here..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={sendingNotif}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 disabled:opacity-60 transition"
                >
                  <Send className="h-4 w-4" />
                  <span>{sendingNotif ? "Dispatching..." : "Send Notification Now"}</span>
                </button>
              </form>
            </div>

            {/* Quick Templates Sidebar */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-white">Quick Templates</h4>
                </div>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Click any template below to automatically autofill the notification form:
                </p>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => applyPreset("collected")}
                    className="w-full text-left rounded-2xl border border-slate-800 bg-slate-950/80 p-3 hover:border-emerald-500/50 hover:bg-emerald-950/20 transition group"
                  >
                    <span className="block text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                      ⚡ Bin Collection Completed
                    </span>
                    <span className="mt-1 block text-[11px] text-slate-400 line-clamp-2">
                      Municipal truck has emptied bins. Receptacles are clean and ready for disposal.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPreset("scheduled")}
                    className="w-full text-left rounded-2xl border border-slate-800 bg-slate-950/80 p-3 hover:border-amber-500/50 hover:bg-amber-950/20 transition group"
                  >
                    <span className="block text-xs font-bold text-amber-400 group-hover:text-amber-300">
                      ⚡ Scheduled Collection Alert
                    </span>
                    <span className="mt-1 block text-[11px] text-slate-400 line-clamp-2">
                      Municipal waste pickup tomorrow 7-10 AM. Remind citizens to segregate waste.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPreset("drive")}
                    className="w-full text-left rounded-2xl border border-slate-800 bg-slate-950/80 p-3 hover:border-sky-500/50 hover:bg-sky-950/20 transition group"
                  >
                    <span className="block text-xs font-bold text-sky-400 group-hover:text-sky-300">
                      ⚡ Green Drive & Bonus Points
                    </span>
                    <span className="mt-1 block text-[11px] text-slate-400 line-clamp-2">
                      Community clean-up drive this weekend with 2x bonus EcoPoints rewards.
                    </span>
                  </button>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-3 text-[11px] text-slate-400">
                💡 <span className="font-semibold text-slate-300">Tip:</span> Notifications show up immediately in each user's top navigation bell icon.
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: WASTE AUDIT LOGS */}
        {activeTab === "activity" && (
          <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 shadow-xl">
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
                  {overview?.recentActivity.map(
                    (rec: WasteRecord & { user?: { name: string; email: string } }) => (
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
                            <span>Revoke</span>
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD NEW LOCATION & BIN */}
      {addBinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Add New Location & Smart Bin</h3>
              </div>
              <button
                onClick={() => setAddBinModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBin} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Unique Bin ID *
                  </label>
                  <input
                    type="text"
                    value={newBinId}
                    onChange={(e) => setNewBinId(e.target.value.toUpperCase())}
                    placeholder="e.g. KDK-006"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-mono text-emerald-400 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Bin Name *
                  </label>
                  <input
                    type="text"
                    value={newBinName}
                    onChange={(e) => setNewBinName(e.target.value)}
                    placeholder="e.g. Health Centre Bin"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* City Selection */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-300">City / Village *</label>
                  <button
                    type="button"
                    onClick={() => setIsCustomCity(!isCustomCity)}
                    className="text-[11px] font-semibold text-emerald-400 hover:underline"
                  >
                    {isCustomCity ? "Choose existing city" : "+ Add new city / village"}
                  </button>
                </div>

                {isCustomCity ? (
                  <input
                    type="text"
                    value={customCityName}
                    onChange={(e) => setCustomCityName(e.target.value)}
                    placeholder="Type new City/Village (e.g. Kodakara, Aluva, Thrissur)"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                ) : (
                  <select
                    value={newBinCity}
                    onChange={(e) => setNewBinCity(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    {distinctCities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Local Area */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Local Area / Place / Ward *
                </label>
                <input
                  type="text"
                  value={newBinArea}
                  onChange={(e) => setNewBinArea(e.target.value)}
                  placeholder="e.g. Kodakara Junction, Market Road, Shanthi Nagar"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              {/* Street Location */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Street / Landmark Location *
                </label>
                <input
                  type="text"
                  value={newBinLocation}
                  onChange={(e) => setNewBinLocation(e.target.value)}
                  placeholder="e.g. Near Community Health Centre Front Entrance"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Waste Stream
                  </label>
                  <select
                    value={newBinCategory}
                    onChange={(e) => setNewBinCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    {["All", "Plastic", "Paper", "Metal", "Glass", "Cardboard", "Mixed"].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Capacity (kg)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={newBinCapacity}
                    onChange={(e) => setNewBinCapacity(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Initial Fill Level ({newBinFill}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newBinFill}
                  onChange={(e) => setNewBinFill(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAddBinModalOpen(false)}
                  className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBin}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-60 shadow-md"
                >
                  {submittingBin ? "Adding..." : "Add Location & Bin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT EXISTING BIN */}
      {editBinModalOpen && editingBin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Edit Bin #{editingBin.binId} Details
                </h3>
              </div>
              <button
                onClick={() => setEditBinModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateBin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Bin Name</label>
                <input
                  type="text"
                  value={editBinName}
                  onChange={(e) => setEditBinName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">City / Village</label>
                  <input
                    type="text"
                    value={editBinCity}
                    onChange={(e) => setEditBinCity(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Local Area / Ward</label>
                  <input
                    type="text"
                    value={editBinArea}
                    onChange={(e) => setEditBinArea(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Street / Landmark Location
                </label>
                <input
                  type="text"
                  value={editBinLocation}
                  onChange={(e) => setEditBinLocation(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Waste Stream</label>
                  <select
                    value={editBinCategory}
                    onChange={(e) => setEditBinCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    {["All", "Plastic", "Paper", "Metal", "Glass", "Cardboard", "Mixed"].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Capacity (kg)</label>
                  <input
                    type="number"
                    value={editBinCapacity}
                    onChange={(e) => setEditBinCapacity(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Status</label>
                  <select
                    value={editBinStatus}
                    onChange={(e) => setEditBinStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Available">Available</option>
                    <option value="Almost Full">Almost Full</option>
                    <option value="Full">Full</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditBinModalOpen(false)}
                  className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingBin}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-60 shadow-md"
                >
                  {updatingBin ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT USER PROFILE & POINTS */}
      {editUserModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Edit User Account</h3>
              </div>
              <button
                onClick={() => setEditUserModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editUserEmail}
                  onChange={(e) => setEditUserEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">System Role</label>
                  <select
                    value={editUserRole}
                    onChange={(e) => setEditUserRole(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="user">User (Citizen)</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    EcoPoints Balance
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editUserPoints}
                    onChange={(e) => setEditUserPoints(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-bold text-amber-400 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditUserModalOpen(false)}
                  className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingUser}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-60 shadow-md"
                >
                  {updatingUser ? "Saving..." : "Save User Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}