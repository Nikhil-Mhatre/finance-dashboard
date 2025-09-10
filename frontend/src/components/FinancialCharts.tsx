/**
 * Financial Charts Component
 * Interactive charts for financial data visualization
 *
 * @author Finance Dashboard Team
 * @version 1.0.0
 */

"use client";

import React, { useState, useEffect, JSX } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { dashboardApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale
);

/**
 * Financial Charts Component
 */
export default function FinancialCharts(): JSX.Element {
  const [chartData, setChartData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("spending");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadChartData();
  }, []);

  /**
   * Load chart data from API
   */
  const loadChartData = async () => {
    try {
      setIsLoading(true);
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1)
        .toISOString()
        .split("T")[0];
      const endDate = now.toISOString().split("T")[0];

      const response = await dashboardApi.getCategoryBreakdown({
        startDate,
        endDate,
      });

      if (response.status === "success") {
        setChartData(response.data);
      }
    } catch (error) {
      console.error("Chart data loading error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading charts...</span>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const categories = chartData?.categories || [];

  const doughnutData = {
    labels: categories.map((cat: any) => cat.category.replace("_", " ")),
    datasets: [
      {
        data: categories.map((cat: any) => cat.amount),
        backgroundColor: categories.map((cat: any) => cat.color),
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const barData = {
    labels: categories
      .slice(0, 6)
      .map((cat: any) => cat.category.replace("_", " ")),
    datasets: [
      {
        label: "Spending Amount",
        data: categories.slice(0, 6).map((cat: any) => cat.amount),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.label}: ${formatCurrency(context.raw)}`;
          },
        },
      },
    },
  };

  const tabs = [
    { id: "spending", name: "Spending Breakdown", icon: "📊" },
    { id: "trends", name: "Spending Trends", icon: "📈" },
    { id: "categories", name: "Top Categories", icon: "🏷️" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header with Tabs */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Financial Analytics
        </h2>
        <div className="flex flex-col md:flex-row space-x-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Content */}
      <div className="p-6">
        {categories.length > 0 ? (
          <div className="h-80">
            {activeTab === "spending" && (
              <Doughnut data={doughnutData} options={chartOptions} />
            )}
            {activeTab === "trends" && (
              <Bar data={barData} options={chartOptions} />
            )}
            {activeTab === "categories" && (
              <div className="space-y-4">
                {categories.slice(0, 5).map((cat: any, index: number) => (
                  <div
                    key={cat.category}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: cat.color }}
                      ></div>
                      <span className="font-medium text-gray-900">
                        {cat.category.replace("_", " ")}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(cat.amount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {(cat.percentage * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No data to display
            </h3>
            <p className="text-gray-500">
              Add some transactions to see beautiful charts
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
