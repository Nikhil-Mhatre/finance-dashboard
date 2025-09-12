// src/app/dashboard/investments/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";

interface Investment {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercentage: number;
  type: string;
}

export default function InvestmentsPage(): React.JSX.Element {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with real API
    setTimeout(() => {
      setInvestments([
        {
          id: "1",
          symbol: "AAPL",
          name: "Apple Inc.",
          quantity: 10,
          purchasePrice: 150.0,
          currentPrice: 175.0,
          totalValue: 1750.0,
          gainLoss: 250.0,
          gainLossPercentage: 0.167,
          type: "STOCK",
        },
        {
          id: "2",
          symbol: "GOOGL",
          name: "Alphabet Inc.",
          quantity: 5,
          purchasePrice: 2800.0,
          currentPrice: 2950.0,
          totalValue: 14750.0,
          gainLoss: 750.0,
          gainLossPercentage: 0.054,
          type: "STOCK",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const totalValue = investments.reduce((sum, inv) => sum + inv.totalValue, 0);
  const totalGainLoss = investments.reduce((sum, inv) => sum + inv.gainLoss, 0);
  const totalGainLossPercentage = totalValue > 0 ? totalGainLoss / (totalValue - totalGainLoss) : 0;

  const Skeleton = ({ className = "" }: { className?: string }) => (
    <div className={cn("animate-pulse rounded-lg bg-slate-200/70", className)} />
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Investments</h1>
          <p className="text-sm text-slate-600">Track your portfolio performance and holdings</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
          <PlusIcon className="w-4 h-4" />
          Add Investment
        </button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <BanknotesIcon className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-slate-500">Total Value</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalValue)}</p>
          <p className="text-xs text-slate-500 mt-1">{investments.length} holdings</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-2">
            {totalGainLoss >= 0 ? (
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
            ) : (
              <ArrowTrendingDownIcon className="w-5 h-5 text-red-600" />
            )}
            <span className="text-xs text-slate-500">Total Gain/Loss</span>
          </div>
          <p className={cn("text-2xl font-bold", totalGainLoss >= 0 ? "text-green-600" : "text-red-600")}>
            {totalGainLoss >= 0 ? "+" : ""}{formatCurrency(totalGainLoss)}
          </p>
          <p className={cn("text-xs mt-1", totalGainLoss >= 0 ? "text-green-600" : "text-red-600")}>
            {formatPercentage(totalGainLossPercentage)}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <ChartBarIcon className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-slate-500">Diversity Score</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">8.5/10</p>
          <p className="text-xs text-purple-600 mt-1">Well diversified</p>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900">Holdings</h3>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        ) : investments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-slate-600 text-xs font-medium uppercase tracking-wide">
                  <th className="px-6 py-3">Asset</th>
                  <th className="px-6 py-3">Quantity</th>
                  <th className="px-6 py-3">Purchase Price</th>
                  <th className="px-6 py-3">Current Price</th>
                  <th className="px-6 py-3">Total Value</th>
                  <th className="px-6 py-3">Gain/Loss</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {investments.map((investment) => (
                  <tr key={investment.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">{investment.symbol}</p>
                        <p className="text-sm text-slate-500">{investment.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">{investment.quantity}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">
                      {formatCurrency(investment.purchasePrice)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">
                      {formatCurrency(investment.currentPrice)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {formatCurrency(investment.totalValue)}
                    </td>
                    <td className="px-6 py-4">
                      <div className={cn("text-sm font-medium", investment.gainLoss >= 0 ? "text-green-600" : "text-red-600")}>
                        {investment.gainLoss >= 0 ? "+" : ""}{formatCurrency(investment.gainLoss)}
                      </div>
                      <div className={cn("text-xs", investment.gainLoss >= 0 ? "text-green-600" : "text-red-600")}>
                        {formatPercentage(investment.gainLossPercentage)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <ChartBarIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-slate-900 mb-2">No investments yet</h3>
            <p className="text-sm text-slate-600 mb-4">
              Start building your portfolio by adding your first investment.
            </p>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
              <PlusIcon className="w-4 h-4" />
              Add Your First Investment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
