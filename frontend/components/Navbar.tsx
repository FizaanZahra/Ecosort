"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { api, NotificationItem } from "../lib/api";
import {
  Leaf,
  LayoutDashboard,
  Trash2,
  History,
  Gift,
  Trophy,
  Layers,
  Shield,
  Coins,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  Bell,
  CheckCheck,
  Megaphone,
  AlertTriangle,
  Info,
  CheckCircle2,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Dispose Waste", href: "/dispose", icon: Trash2 },
    { name: "History", href: "/history", icon: History },
    { name: "Rewards Store", href: "/rewards", icon: Gift },
    { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { name: "Smart Bins", href: "/bins", icon: Layers },
  ];

  if (user?.role === "admin") {
    navLinks.push({ name: "Admin Panel", href: "/admin", icon: Shield });
  }

  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    const fetchNotifs = async () => {
      try {
        const res = await api.users.getNotifications();
        if (isMounted && res.success) {
          setNotifications(res.notifications);
          setUnreadCount(res.unreadCount);
        }
      } catch {
        // silent fetch error
      }
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await api.users.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // silent error
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.users.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // silent error
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "COLLECTION":
        return <Trash2 className="h-4 w-4 text-emerald-400" />;
      case "BIN_ALERT":
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case "POINTS":
        return <Coins className="h-4 w-4 text-amber-300" />;
      case "ANNOUNCEMENT":
        return <Megaphone className="h-4 w-4 text-sky-400" />;
      default:
        return <Info className="h-4 w-4 text-emerald-400" />;
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl shadow-lg transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link
            href={user ? "/dashboard" : "/"}
            className="group flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
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

          {/* Desktop Nav Links */}
          {user && (
            <div className="hidden items-center gap-1.5 lg:flex">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 shadow-sm font-bold"
                        : "text-slate-300 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* EcoPoints Pill */}
              <Link
                href="/rewards"
                className="group flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-950/40 px-3.5 py-1.5 text-xs font-bold text-amber-300 shadow-sm transition hover:bg-amber-900/40 hover:border-amber-400/50"
                title="View Rewards Store"
              >
                <Coins className="h-3.5 w-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>{user.ecoPoints || 0}</span>
                <span className="text-[10px] font-medium text-amber-400 uppercase">pts</span>
              </Link>

              {/* Notification Bell Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white transition"
                  title="Notifications & Community Messages"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-slate-950 shadow-md animate-pulse">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Popover Menu */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-800 bg-slate-950/95 backdrop-blur-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 bg-slate-900/50">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          Community Notices
                        </span>
                        {unreadCount > 0 && (
                          <span className="rounded-full bg-emerald-950 border border-emerald-700/60 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-emerald-400 transition"
                        >
                          <CheckCheck className="h-3.5 w-3.5" />
                          <span>Mark all read</span>
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-850">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-slate-500">
                          <CheckCircle2 className="mx-auto h-8 w-8 text-slate-600 mb-2" />
                          <p className="text-xs font-semibold">No notifications yet</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            You'll receive collection and community updates here.
                          </p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif._id}
                            onClick={() => !notif.read && handleMarkRead(notif._id)}
                            className={`p-3.5 text-left transition cursor-pointer flex gap-3 items-start ${
                              notif.read
                                ? "bg-slate-950/40 hover:bg-slate-900/40 opacity-75"
                                : "bg-slate-900/70 hover:bg-slate-850 border-l-2 border-emerald-500"
                            }`}
                          >
                            <div className="mt-0.5 shrink-0 rounded-lg bg-slate-800/80 p-2 border border-slate-700/60">
                              {getNotificationIcon(notif.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <h5 className="text-xs font-bold text-white truncate">
                                  {notif.title}
                                </h5>
                                <span className="text-[9px] text-slate-400 whitespace-nowrap">
                                  {new Date(notif.createdAt).toLocaleDateString([], {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <p className="mt-1 text-[11px] text-slate-300 leading-relaxed break-words">
                                {notif.message}
                              </p>
                              {notif.city && (
                                <span className="mt-1.5 inline-block text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                                  📍 {notif.city}
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Identity Chip */}
              <div className="hidden flex-col items-end sm:flex">
                <span className="text-xs font-bold text-slate-200 leading-tight">
                  {user.name}
                </span>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1 ${
                    user.role === "admin" ? "text-emerald-400 font-bold" : "text-slate-400"
                  }`}
                >
                  {user.role === "admin" ? (
                    <>
                      <Shield className="h-2.5 w-2.5" />
                      <span>Administrator</span>
                    </>
                  ) : (
                    <>
                      <UserIcon className="h-2.5 w-2.5" />
                      <span>Community Member</span>
                    </>
                  )}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-red-500/40 hover:bg-red-950/40 hover:text-red-300 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-lg p-2 text-slate-300 hover:bg-slate-900 hover:text-white lg:hidden border border-slate-800"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-200 shadow-sm hover:bg-slate-800 hover:border-slate-600 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition shadow-emerald-900/30"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {user && mobileMenuOpen && (
        <div className="border-t border-slate-800 bg-slate-950/95 px-4 py-3 lg:hidden shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-lg p-2.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 font-bold"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
