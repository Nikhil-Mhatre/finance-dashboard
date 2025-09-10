/**
 * Dashboard Layout Component
 * Provides the main layout structure for dashboard pages including sidebar and header
 *
 * @author Finance Dashboard Team
 * @version 1.0.0
 */

"use client";

import React, { useState, useEffect } from "react";
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
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Navigation menu items configuration
 */
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

/**
 * Dashboard Layout Props
 */
interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Dashboard Layout Component
 *
 * @param {DashboardLayoutProps} props - Component props
 * @returns {JSX.Element} Dashboard layout with sidebar and main content
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { logout } = useAuth();
  /**
   * Update current time every minute
   * Used for displaying live time in the header
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  /**
   * Format current time for display
   *
   * @returns {string} Formatted time string
   */
  const formatTime = (): string => {
    return currentTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  /**
   * Format current date for display
   *
   * @returns {string} Formatted date string
   */
  const formatDate = (): string => {
    return currentTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <AuthGuard requireAuth={true}>
      <div className="h-screen bg-gray-50 flex">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="absolute inset-0 bg-gray-600 opacity-75" />
          </div>
        )}

        {/* Sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  Finance AI
                </h2>
                <p className="text-xs text-gray-500">Smart Dashboard</p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200",
                      isActive
                        ? "text-blue-500"
                        : "text-gray-400 group-hover:text-blue-500"
                    )}
                  />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500 group-hover:text-blue-400">
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-200 space-y-3">
            {/* Logout Button */}
            <button
              onClick={logout}
              className="w-full flex items-center justify-start px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <ArrowRightEndOnRectangleIcon className="h-5 w-5 mr-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          {/* Top header - UPDATE THIS SECTION */}
          <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            {/* Page title - will be dynamic based on current page */}
            <div className="hidden lg:block">
              <h1 className="text-2xl font-semibold text-gray-900">
                {navigation.find((item) => item.href === pathname)?.name ||
                  "Dashboard"}
              </h1>
            </div>

            {/* Header right section - UPDATED */}
            <div className="flex items-center space-x-4">
              {/* Current time and date */}
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-gray-900">
                  {formatTime()}
                </div>
                <div className="text-xs text-gray-500">{formatDate()}</div>
              </div>

              {/* Notification bell */}
              <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors duration-200">
                <BellIcon className="w-5 h-5" />
                {/* Notification badge */}
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
