/**
 * Analytics Page
 * Comprehensive financial analytics and visualizations
 */

"use client";

import React, { JSX } from "react";
import FinancialCharts from "@/components/FinancialCharts";
import AIInsights from "@/components/AIInsights";

export default function AnalyticsPage(): JSX.Element {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Financial Analytics
        </h1>
        <p className="text-gray-600">
          Deep insights into your spending patterns and financial health
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <FinancialCharts />
        </div>
        <div>
          <AIInsights />
        </div>
      </div>
    </div>
  );
}
