// src/app/dashboard/alerts/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  BellIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  title: string;
  message: string;
  type: "BUDGET_LIMIT" | "UNUSUAL_SPENDING" | "BILL_REMINDER" | "GOAL_ACHIEVEMENT";
  isRead: boolean;
  createdAt: string;
}

export default function AlertsPage(): React.JSX.Element {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with real API
    setTimeout(() => {
      setAlerts([
        {
          id: "1",
          title: "Budget Limit Reached",
          message: "You've reached 90% of your Entertainment budget for this month.",
          type: "BUDGET_LIMIT",
          isRead: false,
          createdAt: "2025-09-12T10:30:00Z",
        },
        {
          id: "2",
          title: "Unusual Spending Detected",
          message: "Large expense of $450 detected for Flight Booking. Is this expected?",
          type: "UNUSUAL_SPENDING",
          isRead: false,
          createdAt: "2025-09-11T14:20:00Z",
        },
        {
          id: "3",
          title: "Bill Reminder",
          message: "Electric Bill of $145.60 is due in 3 days.",
          type: "BILL_REMINDER",
          isRead: true,
          createdAt: "2025-09-10T09:15:00Z",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const markAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, isRead: true } : alert))
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "BUDGET_LIMIT":
        return ExclamationTriangleIcon;
      case "UNUSUAL_SPENDING":
        return ExclamationTriangleIcon;
      case "BILL_REMINDER":
        return InformationCircleIcon;
      case "GOAL_ACHIEVEMENT":
        return CheckCircleIcon;
    }
  };

  const getAlertColor = (type: Alert["type"]) => {
    switch (type) {
      case "BUDGET_LIMIT":
        return "text-red-600 bg-red-50 border-red-200";
      case "UNUSUAL_SPENDING":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "BILL_REMINDER":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "GOAL_ACHIEVEMENT":
        return "text-green-600 bg-green-50 border-green-200";
    }
  };

  const filteredAlerts = filter === "unread" ? alerts.filter((a) => !a.isRead) : alerts;
  const unreadCount = alerts.filter((a) => !a.isRead).length;

  const Skeleton = ({ className = "" }: { className?: string }) => (
    <div className={cn("animate-pulse rounded-lg bg-slate-200/70", className)} />
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Alerts</h1>
          <p className="text-sm text-slate-600">
            Stay informed about your financial activity and goals
          </p>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
              filter === "all"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
              filter === "unread"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        ) : filteredAlerts.length > 0 ? (
          <div className="divide-y divide-slate-200">
            {filteredAlerts.map((alert) => {
              const AlertIcon = getAlertIcon(alert.type);
              const alertColor = getAlertColor(alert.type);
              
              return (
                <div
                  key={alert.id}
                  className={cn(
                    "p-6 hover:bg-slate-50 transition-colors",
                    !alert.isRead && "bg-blue-50/30"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn("p-2 rounded-lg border", alertColor)}>
                      <AlertIcon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-medium text-slate-900">{alert.title}</h3>
                          <p className="text-sm text-slate-600 mt-1">{alert.message}</p>
                          <p className="text-xs text-slate-500 mt-2">
                            {new Date(alert.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {!alert.isRead && (
                            <button
                              onClick={() => markAsRead(alert.id)}
                              className="text-xs font-medium text-blue-600 hover:text-blue-700"
                            >
                              Mark as read
                            </button>
                          )}
                          <button
                            onClick={() => deleteAlert(alert.id)}
                            className="p-1 text-slate-400 hover:text-slate-600"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <BellIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-slate-900 mb-2">
              {filter === "unread" ? "No unread alerts" : "No alerts yet"}
            </h3>
            <p className="text-sm text-slate-600">
              {filter === "unread"
                ? "You're all caught up!"
                : "We'll notify you about important financial events."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
