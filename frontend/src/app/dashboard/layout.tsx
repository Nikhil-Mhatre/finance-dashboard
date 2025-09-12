// src/app/dashboard/layout.tsx — MODERNIZED DASHBOARD LAYOUT

"use client";

import React, { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  CreditCardIcon,
  ChartBarIcon,
  BanknotesIcon,
  BellIcon,
  CogIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightEndOnRectangleIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
    description: "Overview and summary",
  },
  {
    name: "Transactions",
    href: "/dashboard/transactions",
    icon: CreditCardIcon,
    description: "Income and expenses",
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: ChartBarIcon,
    description: "Charts and insights",
  },
  {
    name: "Investments",
    href: "/dashboard/investments",
    icon: BanknotesIcon,
    description: "Portfolio tracking",
  },
  {
    name: "Alerts",
    href: "/dashboard/alerts",
    icon: BellIcon,
    description: "Notifications",
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: CogIcon,
    description: "Account preferences",
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: UserIcon,
    description: "Account and plan",
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (): string =>
    currentTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const formatDate = (): string =>
    currentTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <AuthGuard requireAuth>
      <div className="min-h-screen bg-slate-50">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              aria-label="Open sidebar"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-slate-200 hover:bg-slate-50"
            >
              <Bars3Icon className="w-6 h-6 text-slate-700" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white px-2.5 py-1.5 rounded-lg text-sm font-bold">
                AI
              </div>
              <span className="font-semibold text-slate-900">
                Finance Dashboard
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-72 transform bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out",
            "lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          {/* Sidebar header */}
          <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white px-2.5 py-1.5 rounded-lg text-sm font-bold">
                AI
              </div>
              <div className="leading-tight">
                <p className="font-semibold text-slate-900">Finance AI</p>
                <p className="text-xs text-slate-500">Smart Dashboard</p>
              </div>
            </div>
            <button
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg border border-slate-200 hover:bg-slate-50"
            >
              <XMarkIcon className="w-5 h-5 text-slate-700" />
            </button>
          </div>

          {/* Nav */}
          <nav className="px-3 py-4 overflow-y-auto h-[calc(100vh-8rem)]">
            <ul className="space-y-1.5">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname?.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors",
                        isActive
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "w-5 h-5",
                          isActive
                            ? "text-blue-600"
                            : "text-slate-500 group-hover:text-slate-700"
                        )}
                      />
                      <div className="flex-1">
                        <p
                          className={cn(
                            "text-sm font-medium",
                            isActive ? "text-blue-700" : "text-slate-800"
                          )}
                        >
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar footer with user */}
          <div className="h-16 border-t border-slate-200 px-4 flex items-center justify-between">
            {user && (
              <div className="flex items-center gap-3 min-w-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.firstName || user.email}
                    className="w-9 h-9 rounded-full ring-2 ring-blue-100"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                    {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate text-slate-900">
                    {user.firstName
                      ? `${user.firstName} ${user.lastName || ""}`
                      : user.email}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {formatDate()}
                  </p>
                </div>
              </div>
            )}
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
            >
              <ArrowRightEndOnRectangleIcon className="w-4 h-8" />
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main content */}
        <div className="lg:pl-72">
          {/* Header */}
          <header className="hidden lg:block sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
            <div className="h-16 px-4 lg:px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
                  <span className="font-medium text-slate-800">
                    {navigation.find((n) => pathname?.startsWith(n.href))
                      ?.name || "Dashboard"}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>{formatDate()}</span>
                </div>
              </div>

              {/* Search */}
              <div className="hidden md:flex items-center max-w-md w-full">
                <div className="relative w-full">
                  <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search transactions, accounts, insights..."
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100"
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="w-9 h-9 rounded-full ring-2 ring-blue-100"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                      {(
                        user?.firstName?.[0] ||
                        user?.email?.[0] ||
                        "U"
                      ).toUpperCase()}
                    </div>
                  )}
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-slate-900 leading-5">
                      {user?.firstName
                        ? `${user.firstName} ${user.lastName || ""}`
                        : user?.email}
                    </p>
                    <p className="text-xs text-slate-500">
                      Last sync: {formatTime()}
                    </p>
                  </div>
                  <ChevronDownIcon className="w-4 h-4 text-slate-500" />
                </button>

                {userMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg p-1 z-40"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-slate-50"
                      role="menuitem"
                    >
                      <UserIcon className="w-4 h-4 text-slate-500" />
                      Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-slate-50"
                      role="menuitem"
                    >
                      <CogIcon className="w-4 h-4 text-slate-500" />
                      Settings
                    </Link>
                    <div className="my-1 h-px bg-slate-200" />
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-700 hover:bg-red-50"
                      role="menuitem"
                    >
                      <ArrowRightEndOnRectangleIcon className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page body */}
          <main className="p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
