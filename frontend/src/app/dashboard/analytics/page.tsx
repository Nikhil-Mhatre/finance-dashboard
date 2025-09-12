// src/app/dashboard/analytics/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import { dashboardApi, transactionsApi } from "@/lib/api";
import FinancialCharts from "@/components/FinancialCharts";

type TimeRange = "7d" | "30d" | "90d" | "1y";

interface AnalyticsData {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  topCategories: Array<{
    category: string;
    amount: number;
    percentage: number;
    count: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    income: number;
    expenses: number;
  }>;
}

export default function AnalyticsPage(): React.JSX.Element {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const timeRanges = [
    { key: "7d" as TimeRange, label: "Last 7 days" },
    { key: "30d" as TimeRange, label: "Last 30 days" },
    { key: "90d" as TimeRange, label: "Last 90 days" },
    { key: "1y" as TimeRange, label: "Last year" },
  ];

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const now = new Date();
      let startDate: Date;
      
      switch (timeRange) {
        case "7d":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "90d":
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case "1y":
          startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          break;
        case "30d":
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }

      const [categoryRes] = await Promise.all([
        dashboardApi.getCategoryBreakdown({
          startDate: startDate.toISOString().split("T")[0],
          endDate: now.toISOString().split("T")[0],
        }),
      ]);

      if (categoryRes.status === "success") {
        // Mock analytics data structure - replace with real API calls
        const mockData: AnalyticsData = {
          totalIncome: 5500,
          totalExpenses: 3200,
          netIncome: 2300,
          topCategories: categoryRes.data?.categories?.slice(0, 6) || [],
          monthlyTrends: [
            { month: "Jan", income: 4500, expenses: 2800 },
            { month: "Feb", income: 5200, expenses: 3100 },
            { month: "Mar", income: 5500, expenses: 3200 },
          ],
        };
        setAnalyticsData(mockData);
      }
    } catch (e: any) {
      setError(e?.message || "Failed to load analytics");
    } finally {
      setIsLoading(false);
    }
  };

  const Skeleton = ({ className = "" }: { className?: string }) => (
    <div className={cn("animate-pulse rounded-lg bg-slate-200/70", className)} />
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-600">
            Deep insights into your spending patterns and financial health
          </p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
          {timeRanges.map((range) => (
            <button
              key={range.key}
              onClick={() => setTimeRange(range.key)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                timeRange === range.key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">Error</p>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </>
        ) : analyticsData ? (
          <>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
                <span className="text-xs text-slate-500">Income</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(analyticsData.totalIncome)}
              </p>
              <p className="text-xs text-green-600 mt-1">+12% vs last period</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <ArrowTrendingDownIcon className="w-5 h-5 text-red-600" />
                <span className="text-xs text-slate-500">Expenses</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(analyticsData.totalExpenses)}
              </p>
              <p className="text-xs text-red-600 mt-1">+5% vs last period</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <ChartBarIcon className="w-5 h-5 text-blue-600" />
                <span className="text-xs text-slate-500">Net Income</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(analyticsData.netIncome)}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {formatPercentage(analyticsData.netIncome / analyticsData.totalIncome)} of income
              </p>
            </div>
          </>
        ) : null}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Financial Charts */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Spending Overview</h3>
          <FinancialCharts />
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Top Categories</h3>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8" />
              <Skeleton className="h-8" />
              <Skeleton className="h-8" />
            </div>
          ) : analyticsData?.topCategories.length ? (
            <div className="space-y-3">
              {analyticsData.topCategories.map((cat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {cat.category.replace("_", " ")}
                      </p>
                      <p className="text-xs text-slate-500">{cat.count} transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">
                      {formatCurrency(cat.amount)}
                    </p>
                    <p className="text-xs text-slate-500">{formatPercentage(cat.percentage)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FunnelIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600">No category data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
