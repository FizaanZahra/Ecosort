"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
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
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
