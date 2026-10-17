"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Dispose Waste", href: "/dispose" },
    { name: "Waste History", href: "/history" },
    { name: "Smart Bins", href: "/bins" },
  ];

  if (user?.role === "admin") {
    navLinks.push({ name: "Admin Panel", href: "/admin" });
  }

  return (
    <nav className="flex flex-wrap items-center justify-between border-b border-gray-100 bg-white px-6 py-4 shadow-sm md:px-10">
      <div className="flex items-center gap-8">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 text-2xl font-bold text-green-700">
          <span>🌱</span>
          <span>EcoSort</span>
        </Link>

        {user && (
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "font-semibold text-green-600"
                      : "text-gray-600 hover:text-green-600"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            {/* EcoPoints badge */}
            <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-3.5 py-1.5 text-sm font-semibold text-green-700 border border-green-200">
              <span>⭐</span>
              <span>{user.ecoPoints || 0} pts</span>
            </div>

            {/* User display */}
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role || "User"}</p>
            </div>

            <button
              onClick={logout}
              className="rounded-lg border border-red-200 px-3.5 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg border border-green-600 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
