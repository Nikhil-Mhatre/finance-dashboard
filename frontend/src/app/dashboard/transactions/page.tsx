// src/app/dashboard/transactions/page.tsx — MOBILE-RESPONSIVE VERSION

"use client";

import React, { JSX, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FunnelIcon,
  PlusIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { cn, formatCurrency } from "@/lib/utils";
import { transactionsApi, accountsApi } from "@/lib/api";
import TransactionForm from "@/components/TransactionForm";

type TxType = "INCOME" | "EXPENSE" | "TRANSFER" | "";
type DateRangePreset = "THIS_MONTH" | "LAST_30" | "CUSTOM";
type SortKey = "date" | "amount" | "type" | "account";
type SortDir = "asc" | "desc";

interface AccountOption {
  id: string;
  name: string;
}

export default function TransactionsPage(): JSX.Element {
  // Core data + meta
  const [transactions, setTransactions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [totalPages, setTotalPages] = useState(1);

  // State controls
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [query, setQuery] = useState("");
  const [type, setType] = useState<TxType>("");
  const [accountId, setAccountId] = useState<string>("");
  const [datePreset, setDatePreset] = useState<DateRangePreset>("THIS_MONTH");
  const [startDate, setStartDate] = useState<string>(
    () =>
      new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    () => new Date().toISOString().split("T")[0]
  );
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Accounts for filter dropdown
  const [accounts, setAccounts] = useState<AccountOption[]>([]);

  // Modal
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Mobile filters drawer
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Derived filters payload
  const filters = useMemo(
    () => ({
      page,
      limit,
      sortKey, // 'date' | 'amount' | 'type' | 'account'
      sortDir, // 'asc' | 'desc'
      ...(type ? { type } : {}),
      ...(accountId ? { accountId } : {}),
      ...(startDate ? { startDate } : {}),
      ...(endDate ? { endDate } : {}),
      ...(query.trim() ? { search: query.trim() } : {}),
    }),
    [page, limit, sortKey, sortDir, type, accountId, startDate, endDate, query]
  );

  // Load accounts (for filter dropdown)
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const res = await accountsApi.getAccounts();
        if (res.status === "success" && res.data) {
          setAccounts(res.data.map((a: any) => ({ id: a.id, name: a.name })));
        }
      } catch {
        // fail silently
      }
    };
    loadAccounts();
  }, []);

  // Load transactions on filters/page change
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await transactionsApi.getTransactions(filters);
        if (res.status === "success") {
          setTransactions(res.data || []);
          const meta = res.meta || { total: 0, totalPages: 1 };
          setTotal(meta.total);
          setTotalPages(meta.totalPages);
        } else {
          setError("Failed to fetch transactions");
        }
      } catch (e: any) {
        setError(e?.message || "Failed to fetch transactions");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [filters]);

  // Preset date handling
  useEffect(() => {
    if (datePreset === "THIS_MONTH") {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      setStartDate(start.toISOString().split("T")[0]);
      setEndDate(new Date().toISOString().split("T")[0]);
    } else if (datePreset === "LAST_30") {
      const now = new Date();
      const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      setStartDate(start.toISOString().split("T")[0]);
      setEndDate(new Date().toISOString().split("T")[0]);
    }
  }, [datePreset]);

  // Actions
  const refresh = async () => {
    try {
      setIsRefreshing(true);
      const res = await transactionsApi.getTransactions(filters);
      if (res.status === "success") {
        setTransactions(res.data || []);
        const meta = res.meta || { total: 0, totalPages: 1 };
        setTotal(meta.total);
        setTotalPages(meta.totalPages);
      }
    } catch {
      // soft-fail
    } finally {
      setIsRefreshing(false);
    }
  };

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);
  const onFormSuccess = async () => {
    setPage(1);
    await refresh();
    closeForm();
  };

  // UI utils
  const Skeleton = ({ className = "" }: { className?: string }) => (
    <div
      className={cn("animate-pulse rounded-lg bg-slate-200/70", className)}
    />
  );

  const SortButton: React.FC<{ k: SortKey; label: string }> = ({
    k,
    label,
  }) => (
    <button
      onClick={() => {
        setPage(1);
        if (sortKey === k) {
          setSortDir((d) => (d === "asc" ? "desc" : "asc")); // backend expects 'asc'|'desc'
        } else {
          setSortKey(k);
          setSortDir("desc");
        }
      }}
      className={cn(
        "text-xs font-medium px-2 py-1 rounded-md border transition-colors",
        sortKey === k
          ? "border-blue-300 text-blue-700 bg-blue-50"
          : "border-slate-200 text-slate-600 hover:bg-slate-50"
      )}
      aria-label={`Sort by ${label}`}
    >
      {label} {sortKey === k ? (sortDir === "asc" ? "↑" : "↓") : ""}
    </button>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Sticky mobile actions bar */}
      <div className="md:hidden sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="font-semibold text-slate-900">Transactions</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFiltersOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium"
            >
              <Bars3Icon className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={openForm}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium"
            >
              <PlusIcon className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Header (desktop) */}
      <div className="hidden md:flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
          <p className="text-sm text-slate-600">
            Search, filter, and manage your financial records.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openForm}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            <PlusIcon className="w-4 h-4" />
            Add transaction
          </button>
          <button
            onClick={refresh}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium hover:bg-slate-50"
          >
            <ArrowPathIcon
              className={cn("w-4 h-4", isRefreshing && "animate-spin")}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters panel (desktop) */}
      <div className="hidden md:block rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Search
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
              <input
                value={query}
                onChange={(e) => {
                  setPage(1);
                  setQuery(e.target.value);
                }}
                placeholder="Description, category, account..."
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => {
                setPage(1);
                setType(e.target.value as TxType);
              }}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm"
            >
              <option value="">All</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
              <option value="TRANSFER">Transfer</option>
            </select>
          </div>

          {/* Account */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Account
            </label>
            <select
              value={accountId}
              onChange={(e) => {
                setPage(1);
                setAccountId(e.target.value);
              }}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm"
            >
              <option value="">All accounts</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date preset */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Date
            </label>
            <select
              value={datePreset}
              onChange={(e) => setDatePreset(e.target.value as DateRangePreset)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm"
            >
              <option value="THIS_MONTH">This month</option>
              <option value="LAST_30">Last 30 days</option>
              <option value="CUSTOM">Custom</option>
            </select>
          </div>

          {/* Custom date inputs */}
          {datePreset === "CUSTOM" && (
            <div className="md:col-span-5 grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  Start
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setPage(1);
                    setStartDate(e.target.value);
                  }}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  End
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setPage(1);
                    setEndDate(e.target.value);
                  }}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sort & page size */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <FunnelIcon className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-600">Sort:</span>
            <div className="flex items-center gap-1">
              <SortButton k="date" label="Date" />
              <SortButton k="amount" label="Amount" />
              <SortButton k="type" label="Type" />
              <SortButton k="account" label="Account" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AdjustmentsHorizontalIcon className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-600">Per page:</span>
            <select
              value={limit}
              onChange={(e) => {
                setPage(1);
                setLimit(Number(e.target.value));
              }}
              className="px-2 py-1.5 rounded-md border border-slate-200 bg-white text-xs"
            >
              {[10, 15, 20, 30, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mobile filters drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Filters</h3>
              <button
                onClick={() => setFiltersOpen(false)}
                className="p-2 rounded-lg border border-slate-200"
                aria-label="Close filters"
              >
                <XMarkIcon className="w-5 h-5 text-slate-700" />
              </button>
            </div>

            {/* Search */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">
                Search
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  value={query}
                  onChange={(e) => {
                    setPage(1);
                    setQuery(e.target.value);
                  }}
                  placeholder="Description, category, account..."
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm"
                />
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => {
                  setPage(1);
                  setType(e.target.value as TxType);
                }}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm"
              >
                <option value="">All</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
                <option value="TRANSFER">Transfer</option>
              </select>
            </div>

            {/* Account */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">
                Account
              </label>
              <select
                value={accountId}
                onChange={(e) => {
                  setPage(1);
                  setAccountId(e.target.value);
                }}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm"
              >
                <option value="">All accounts</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">
                Date
              </label>
              <select
                value={datePreset}
                onChange={(e) =>
                  setDatePreset(e.target.value as DateRangePreset)
                }
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm"
              >
                <option value="THIS_MONTH">This month</option>
                <option value="LAST_30">Last 30 days</option>
                <option value="CUSTOM">Custom</option>
              </select>
            </div>

            {datePreset === "CUSTOM" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">
                    Start
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setPage(1);
                      setStartDate(e.target.value);
                    }}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">
                    End
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setPage(1);
                      setEndDate(e.target.value);
                    }}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm"
                  />
                </div>
              </div>
            )}

            {/* Sort & limit */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1">
                <SortButton k="date" label="Date" />
                <SortButton k="amount" label="Amount" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600">Per page</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setPage(1);
                    setLimit(Number(e.target.value));
                  }}
                  className="px-2 py-1.5 rounded-md border border-slate-200 bg-white text-xs"
                >
                  {[10, 15, 20, 30].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-1">
              <button
                onClick={() => setFiltersOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium"
              >
                Apply filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List/Table container */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-sm text-slate-600">
            {isLoading
              ? "Loading..."
              : `${total} transaction${total === 1 ? "" : "s"} found`}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs",
                page <= 1 || isLoading
                  ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              )}
            >
              <ChevronLeftIcon className="w-4 h-4" />
              Prev
            </button>
            <span className="text-xs text-slate-600">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs",
                page >= totalPages || isLoading
                  ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              )}
            >
              Next
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden">
          {isLoading ? (
            <div className="p-4 space-y-3">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          ) : transactions.length > 0 ? (
            <ul className="divide-y divide-slate-200">
              {transactions.map((t) => (
                <li
                  key={t.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {t.description}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {t.account} • {t.date} •{" "}
                      {String(t.category).replace("_", " ").toLowerCase()}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "ml-3 text-sm font-semibold shrink-0",
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
            <div className="p-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <FunnelIcon className="w-6 h-6 text-slate-500" />
              </div>
              <h4 className="mt-4 text-sm font-semibold text-slate-900">
                No transactions found
              </h4>
              <p className="mt-1 text-sm text-slate-600">
                Try adjusting filters or add a new transaction to get started.
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

        {/* Desktop Table */}
        <div className="hidden md:block">
          {isLoading ? (
            <div className="p-4 space-y-3">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          ) : transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-left text-slate-600">
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Account</th>
                    <th className="px-4 py-3 font-medium text-right">Amount</th>
                    <th className="px-4 py-3 font-medium text-right">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        {t.date[0]}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">
                          {t.description}
                        </div>
                        {/* optional subtitle */}
                        {t.subtitle && (
                          <div className="text-xs text-slate-500">
                            {t.subtitle}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {String(t.category).replace("_", " ")}
                      </td>
                      <td className="px-4 py-3">{t.account}</td>
                      <td
                        className={cn(
                          "px-4 py-3 text-right font-semibold",
                          t.type === "INCOME"
                            ? "text-green-600"
                            : "text-red-600"
                        )}
                      >
                        {t.type === "INCOME" ? "+" : "-"}{" "}
                        {formatCurrency(Math.abs(t.amount))}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                            t.type === "INCOME"
                              ? "bg-green-50 text-green-700"
                              : t.type === "EXPENSE"
                              ? "bg-red-50 text-red-700"
                              : "bg-slate-100 text-slate-700"
                          )}
                        >
                          {t.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                <FunnelIcon className="w-6 h-6 text-slate-500" />
              </div>
              <h4 className="mt-4 text-sm font-semibold text-slate-900">
                No transactions found
              </h4>
              <p className="mt-1 text-sm text-slate-600">
                Try adjusting filters or add a new transaction to get started.
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
      </div>

      {/* Modal */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSuccess={onFormSuccess}
      />
    </div>
  );
}
