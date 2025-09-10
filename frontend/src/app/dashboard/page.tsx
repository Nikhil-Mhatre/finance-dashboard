/**
 * Dashboard Home Page - UPDATED Layout
 * Reorganized Quick Actions and Recent Activity section
 */

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

// Keep your existing StatCard component...
type StatCardColors = "blue" | "green" | "red" | "yellow" | "purple";

const StatCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  color: StatCardColors;
}> = ({ title, value, change, icon: Icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    red: "bg-red-50 text-red-600 border-red-200",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== undefined && change !== null && (
            <div className="flex items-center mt-2">
              {change >= 0 ? (
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  change >= 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {formatPercentage(Math.abs(change))}
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "w-12 h-12 rounded-lg border flex items-center justify-center",
            colorClasses[color]
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// Updated Quick Action component
const QuickActionButton: React.FC<{
  title: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
  color: string;
}> = ({ title, description, icon: Icon, onClick, color }) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200 text-left group"
    >
      <div className="flex items-center">
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center mr-4",
            color
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
            {title}
          </h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </button>
  );
};

export default function DashboardPage(): JSX.Element {
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiConnected, setApiConnected] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [showSampleDataPrompt, setShowSampleDataPrompt] = useState(false);

  // Keep your existing useEffect and functions...
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const healthResponse = await healthApi.check();
      setApiConnected(healthResponse.status === "success");

      if (!healthResponse.status) {
        throw new Error("API connection failed");
      }

      const statsResponse = await dashboardApi.getStats();
      const transactionsResponse = await dashboardApi.getRecentTransactions(10);

      if (statsResponse.status === "success") {
        setDashboardData(statsResponse.data);

        if (transactionsResponse.status === "success") {
          setRecentTransactions(transactionsResponse.data);

          if (transactionsResponse.data.length === 0) {
            setShowSampleDataPrompt(true);
          }
        }
      }
    } catch (err: any) {
      console.error("❌ Dashboard data load error:", err);
      setError(err.message || "Failed to load dashboard data");
      setApiConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    console.log(`Quick action: ${action}`);

    if (action === "Add Transaction") {
      setShowTransactionForm(true);
    } else {
      alert(`${action} feature coming next! 🚀`);
    }
  };

  const handleGenerateSampleData = async () => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await loadDashboardData();
      setShowSampleDataPrompt(false);
    } catch (err: any) {
      console.error("❌ Sample data generation error:", err);
      setError("Failed to generate sample data");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page header with API status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back to AI Finance! 👋✨
          </h1>
          <p className="text-gray-600 mt-1">
            Here's your personalized financial overview for today.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div
            className={cn(
              "w-3 h-3 rounded-full",
              apiConnected ? "bg-green-500" : "bg-red-500"
            )}
          ></div>
          <span className="text-sm text-gray-600">
            API {apiConnected ? "Connected" : "Disconnected"}
          </span>
          {error && (
            <button
              onClick={loadDashboardData}
              className="text-sm text-blue-600 hover:text-blue-700 underline ml-2"
            >
              Retry
            </button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Sample Data Prompt */}
      {showSampleDataPrompt && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <ChartBarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-medium text-blue-900">
                Welcome to your AI Finance Dashboard!
              </h3>
              <p className="text-blue-700 mt-1">
                It looks like you don't have any transactions yet. Would you
                like us to generate some sample data to explore the features?
              </p>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={handleGenerateSampleData}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Generate Sample Data
                </button>
                <button
                  onClick={() => setShowSampleDataPrompt(false)}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg border border-blue-300 hover:bg-blue-50 transition-colors duration-200"
                >
                  Start Fresh
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Balance"
            value={formatCurrency(dashboardData.totalBalance)}
            change={0.08}
            icon={BanknotesIcon}
            color="blue"
          />
          <StatCard
            title="Monthly Income"
            value={formatCurrency(dashboardData.monthlyIncome)}
            change={0.12}
            icon={ArrowTrendingUpIcon}
            color="green"
          />
          <StatCard
            title="Monthly Expenses"
            value={formatCurrency(dashboardData.monthlyExpenses)}
            change={-0.05}
            icon={ArrowTrendingDownIcon}
            color="red"
          />
          <StatCard
            title="Net Worth"
            value={formatCurrency(dashboardData.monthlyNet)}
            change={0.15}
            icon={ChartBarIcon}
            color="purple"
          />
        </div>
      )}

      {/* UPDATED: Quick Actions and Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions - Now in main dashboard */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <QuickActionButton
              title="Add Transaction"
              description="Record income or expense"
              icon={PlusIcon}
              color="bg-blue-100 text-blue-600"
              onClick={() => handleQuickAction("Add Transaction")}
            />
            <QuickActionButton
              title="View Analytics"
              description="See detailed charts"
              icon={ChartBarIcon}
              color="bg-green-100 text-green-600"
              onClick={() => handleQuickAction("View Analytics")}
            />
            <QuickActionButton
              title="Manage Budgets"
              description="Set spending limits"
              icon={BanknotesIcon}
              color="bg-purple-100 text-purple-600"
              onClick={() => handleQuickAction("Manage Budgets")}
            />
            <QuickActionButton
              title="Settings"
              description="Account preferences"
              icon={Cog6ToothIcon}
              color="bg-gray-100 text-gray-600"
              onClick={() => handleQuickAction("Settings")}
            />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Transactions
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {recentTransactions.length > 0 ? (
              <>
                {recentTransactions.slice(0, 4).map((transaction, index) => (
                  <div
                    key={transaction.id}
                    className={cn(
                      "flex items-center justify-between p-4",
                      index !== Math.min(recentTransactions.length, 3) - 1 &&
                        "border-b border-gray-100"
                    )}
                  >
                    <div className="flex items-center">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center mr-4",
                          transaction.type === "INCOME"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        )}
                      >
                        {transaction.type === "INCOME" ? (
                          <ArrowTrendingUpIcon className="w-5 h-5" />
                        ) : (
                          <ArrowTrendingDownIcon className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {transaction.account} • {transaction.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          "font-semibold",
                          transaction.type === "INCOME"
                            ? "text-green-600"
                            : "text-red-600"
                        )}
                      >
                        {transaction.type === "INCOME" ? "+" : ""}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {transaction.category.replace("_", " ").toLowerCase()}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                  <button
                    onClick={() => handleQuickAction("View All Transactions")}
                    className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center"
                  >
                    {recentTransactions.length > 3
                      ? `View all ${recentTransactions.length} transactions`
                      : "View transaction history"}
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <CreditCardIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No transactions yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Start by adding your first transaction
                </p>
                <button
                  onClick={() => handleQuickAction("Add Transaction")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Add Transaction
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {dashboardData && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Quick Stats</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600">Active Accounts</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.accountsCount}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month's Transactions</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.transactionsThisMonth}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Budget Utilization</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatPercentage(dashboardData.budgetUtilization)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-red-600">
                {dashboardData.activeAlerts}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights and Financial Analytics - Full Width Layout */}
      <div className="space-y-8">
        {/* AI Insights - Full Width */}
        <section className="w-full max-w-full">
          <AIInsights />
        </section>

        {/* Financial Analytics - Full Width */}
        <section className="w-full max-w-full">
          <FinancialCharts />
        </section>
      </div>
      <TransactionForm
        isOpen={showTransactionForm}
        onClose={() => setShowTransactionForm(false)}
        onSuccess={loadDashboardData} // Refresh dashboard data after adding transaction
      />
    </div>
  );
}
