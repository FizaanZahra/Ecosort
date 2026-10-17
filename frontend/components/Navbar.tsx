"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Dispose Waste", href: "/dispose", icon: "🗑️" },
    { name: "History", href: "/history", icon: "📜" },
    { name: "Rewards Store", href: "/rewards", icon: "🎁" },
    { name: "Leaderboard", href: "/leaderboard", icon: "🏆" },
    { name: "Smart Bins", href: "/bins", icon: "📍" },
  ];

  if (user?.role === "admin") {
    navLinks.push({ name: "Admin Panel", href: "/admin", icon: "🛡️" });
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-emerald-100/80 bg-white/95 backdrop-blur-md shadow-sm transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link
            href={user ? "/dashboard" : "/"}
            className="group flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white shadow-md shadow-emerald-600/20">
              <span className="text-xl">🌱</span>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900 group-hover:text-emerald-700 transition-colors">
                Eco<span className="text-emerald-600">Sort</span>
              </span>
              <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-emerald-600 sm:block">
                Web PBL Edition
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          {user && (
            <div className="hidden items-center gap-1.5 lg:flex">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-emerald-50 text-emerald-800 shadow-sm ring-1 ring-emerald-600/20 font-bold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className="text-sm">{link.icon}</span>
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
                className="group flex items-center gap-1.5 rounded-full border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 px-3.5 py-1.5 text-xs font-bold text-amber-900 shadow-sm transition hover:shadow-md hover:border-amber-300"
                title="View Rewards Store"
              >
                <span className="text-sm group-hover:scale-110 transition-transform">⭐</span>
                <span>{user.ecoPoints || 0}</span>
                <span className="text-[10px] font-medium text-amber-700 uppercase">pts</span>
              </Link>

              {/* User Identity Chip */}
              <div className="hidden flex-col items-end sm:flex">
                <span className="text-xs font-bold text-gray-800 leading-tight">
                  {user.name}
                </span>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider ${
                    user.role === "admin" ? "text-purple-600 font-bold" : "text-gray-500"
                  }`}
                >
                  {user.role === "admin" ? "🛡️ Administrator" : "Eco Citizen"}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                Logout
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 lg:hidden"
                aria-label="Toggle Navigation"
              >
                <span className="text-xl">☰</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {user && mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 lg:hidden shadow-lg animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-lg p-2.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-emerald-50 text-emerald-800 font-bold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>{link.icon}</span>
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
