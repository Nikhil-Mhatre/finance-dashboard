// src/app/dashboard/page.tsx — MODERNIZED DASHBOARD HOME WITH AI INSIGHTS EMPHASIS

"use client";

import React, { useState, useEffect, JSX } from "react";
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CreditCardIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { formatCurrency, formatPercentage, cn } from "@/lib/utils";
import { healthApi, dashboardApi } from "@/lib/api";
import AIInsights from "@/components/AIInsights";
import FinancialCharts from "@/components/FinancialCharts";
import TransactionForm from "@/components/TransactionForm";

type StatCardColors = "blue" | "green" | "red" | "yellow" | "purple";

const StatCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  color: StatCardColors;
}> = ({ title, value, change, icon: Icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    red: "bg-red-50 text-red-700 border-red-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  } as const;

  const trendColor =
    change !== undefined && change !== null
      ? change >= 0
        ? "text-green-600"
        : "text-red-600"
      : "text-slate-500";

  return (
    <div
      className={cn(
        "rounded-xl border p-5 shadow-sm bg-white",
        colorClasses[color]
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5" />
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold leading-none">{value}</p>
        {change !== undefined && change !== null && (
          <span className={cn("text-sm font-medium", trendColor)}>
            {change >= 0 ? (
              <span className="inline-flex items-center gap-1">
                <ArrowTrendingUpIcon className="w-4 h-4" />
                {formatPercentage(Math.abs(change))}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                <ArrowTrendingDownIcon className="w-4 h-4" />
                {formatPercentage(Math.abs(change))}
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default function DashboardHome(): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [health, setHealth] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [recentTx, setRecentTx] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [healthRes, statsRes, recentRes] = await Promise.all([
          healthApi.check(),
          dashboardApi.getStats(),
          dashboardApi.getRecentTransactions(10),
        ]);

        if (healthRes.status === "success") setHealth(healthRes);
        if (statsRes.status === "success") setDashboardData(statsRes.data);
        if (recentRes.status === "success") setRecentTx(recentRes.data);
      } catch (e: any) {
        console.error("Dashboard load error:", e);
        setError(e?.message || "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  const refreshAfterSuccess = async () => {
    try {
      const [statsRes, recentRes] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getRecentTransactions(10),
      ]);
      if (statsRes.status === "success") setDashboardData(statsRes.data);
      if (recentRes.status === "success") setRecentTx(recentRes.data);
    } catch (e) {
      // Soft-fail refresh
    }
  };

  const Skeleton = ({ className = "" }: { className?: string }) => (
    <div
      className={cn("animate-pulse rounded-lg bg-slate-200/70", className)}
    />
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
          <p className="text-sm text-slate-600">
            Here&apos;s your personalized financial overview for today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openForm}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            <PlusIcon className="w-4 h-4" />
            Add transaction
          </button>
          <a
            href="/dashboard/settings"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium hover:bg-slate-50"
          >
            <Cog6ToothIcon className="w-4 h-4" />
            Settings
          </a>
        </div>
      </div>

      {/* Health banner */}
      {!isLoading && health?.status !== "success" && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              Service health check failed
            </p>
            <p className="text-sm text-amber-700 mt-1">
              Some services may be temporarily unavailable. Please try again
              later.
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">Error</p>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
      )}

      {/* Stats grid */}
      <section>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
        ) : dashboardData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              title="Total Balance"
              value={formatCurrency(dashboardData.totalBalance || 0)}
              change={dashboardData.monthlyNet >= 0 ? 0.04 : -0.03}
              icon={BanknotesIcon}
              color="blue"
            />
            <StatCard
              title="Income (30d)"
              value={formatCurrency(dashboardData.monthlyIncome || 0)}
              change={0.06}
              icon={ArrowTrendingUpIcon}
              color="green"
            />
            <StatCard
              title="Expenses (30d)"
              value={formatCurrency(dashboardData.monthlyExpenses || 0)}
              change={-0.02}
              icon={ArrowTrendingDownIcon}
              color="red"
            />
            <StatCard
              title="Investments Value"
              value={formatCurrency(dashboardData.investmentValue || 0)}
              change={dashboardData.investmentGainLoss >= 0 ? 0.05 : -0.04}
              icon={ChartBarIcon}
              color="purple"
            />
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-center">
            <p className="text-sm text-slate-600">
              No stats available yet. Add a transaction to get started.
            </p>
          </div>
        )}
      </section>

      {/* AI Insights (larger) + Recent Activity (smaller) */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* AI Insights — Emphasized */}
        <div className="xl:col-span-2 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900">
              AI insights
            </h3>
            <span className="text-xs text-slate-500">Powered by Gemini</span>
          </div>
          <AIInsights />
        </div>

        {/* Recent Activity — Compact */}
        <div className="xl:col-span-1 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Recent activity
            </h3>
            <a
              href="/dashboard/transactions"
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              View all
            </a>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
            </div>
          ) : recentTx.length > 0 ? (
            <ul className="divide-y divide-slate-200">
              {recentTx.slice(0, 6).map((t) => (
                <li
                  key={t.id}
                  className="py-3 flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {t.description}
                    </p>
                    <p className="text-xs text-slate-500">
                      {t.account} • {t.date} •{" "}
                      {String(t.category).replace("_", " ").toLowerCase()}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "text-sm font-semibold",
                      t.type === "INCOME" ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {t.type === "INCOME" ? "+" : "-"}{" "}
                    {formatCurrency(Math.abs(t.amount))}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <CreditCardIcon className="w-6 h-6 text-slate-500" />
              </div>
              <h4 className="mt-4 text-sm font-semibold text-slate-900">
                No transactions yet
              </h4>
              <p className="mt-1 text-sm text-slate-600">
                Start by adding your first transaction to see activity here.
              </p>
              <div className="mt-4">
                <button
                  onClick={openForm}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add transaction
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Charts */}
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Spending analytics
          </h3>
          <span className="text-xs text-slate-500">Last 2 months</span>
        </div>
        <FinancialCharts />
      </section>

      {/* Transaction Form Modal */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSuccess={refreshAfterSuccess}
      />
    </div>
  );
}
