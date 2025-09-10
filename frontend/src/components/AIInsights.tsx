/**
 * AI Insights Component - COMPLETE VERSION
 * Displays AI-generated financial insights with truncation, expansion, and compact mode
 *
 * @author Finance Dashboard Team
 * @version 2.0.0
 */

"use client";

import React, { useState, useEffect, JSX } from "react";
import {
  SparklesIcon,
  LightBulbIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { aiApi } from "@/lib/api";
import { cn } from "@/lib/utils";

/**
 * AI Insight interface
 */
interface AIInsight {
  id: string;
  title: string;
  content: string;
  type:
    | "SPENDING_PATTERN"
    | "BUDGET_RECOMMENDATION"
    | "SAVING_OPPORTUNITY"
    | "RISK_ASSESSMENT";
  confidence: number;
  isRelevant: boolean;
  createdAt: string;
}

/**
 * AI Insights Component Props
 */
interface AIInsightsProps {
  className?: string;
}

/**
 * STEP 1: Content truncation function
 */
const truncateContent = (content: string, maxLength: number = 200): string => {
  if (content.length <= maxLength) return content;

  const truncated = content.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return lastSpace > 0
    ? truncated.substring(0, lastSpace) + "..."
    : truncated + "...";
};

/**
 * Get icon and color for insight type
 */
function getInsightStyle(type: string) {
  const styles = {
    SPENDING_PATTERN: {
      icon: ChartBarIcon,
      color: "blue",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-100",
      tagBg: "bg-blue-100",
      tagColor: "text-blue-700",
    },
    BUDGET_RECOMMENDATION: {
      icon: LightBulbIcon,
      color: "yellow",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      borderColor: "border-yellow-200",
      iconBg: "bg-yellow-100",
      tagBg: "bg-yellow-100",
      tagColor: "text-yellow-700",
    },
    SAVING_OPPORTUNITY: {
      icon: CheckCircleIcon,
      color: "green",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-200",
      iconBg: "bg-green-100",
      tagBg: "bg-green-100",
      tagColor: "text-green-700",
    },
    RISK_ASSESSMENT: {
      icon: ExclamationTriangleIcon,
      color: "red",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-200",
      iconBg: "bg-red-100",
      tagBg: "bg-red-100",
      tagColor: "text-red-700",
    },
  };

  return styles[type as keyof typeof styles] || styles.SPENDING_PATTERN;
}

/**
 * STEP 2: Individual Insight Card Component with Read More/Less
 */
const InsightCard: React.FC<{ insight: AIInsight; isCompact: boolean }> = ({
  insight,
  isCompact,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const style = getInsightStyle(insight.type);
  const IconComponent = style.icon;

  const shouldTruncate = insight.content.length > 200;
  const displayContent =
    shouldTruncate && !isExpanded
      ? truncateContent(insight.content, 200)
      : insight.content;

  if (isCompact) {
    return (
      <div
        className={cn(
          "p-3 rounded-lg border",
          style.bgColor,
          style.borderColor
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <IconComponent className={cn("w-4 h-4 mr-2", style.textColor)} />
            <div className="flex-1">
              <h3 className={cn("font-medium text-sm", style.textColor)}>
                {insight.title}
              </h3>
              <p className="text-xs text-gray-600 line-clamp-1">
                {truncateContent(insight.content, 80)}
              </p>
            </div>
          </div>
          <div className="text-right ml-2">
            <div className="text-xs text-gray-500">
              {Math.round(insight.confidence * 100)}%
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("p-4 rounded-lg border", style.bgColor, style.borderColor)}
    >
      <div className="flex items-start">
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center mr-3 mt-1",
            style.iconBg
          )}
        >
          <IconComponent className={cn("w-4 h-4", style.textColor)} />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className={cn("font-semibold text-sm", style.textColor)}>
              {insight.title}
            </h3>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-xs text-gray-500">
                {Math.round(insight.confidence * 100)}% confidence
              </span>
            </div>
          </div>

          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            {displayContent}
          </p>

          {/* Read More/Less Button */}
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium mb-3 flex items-center"
            >
              {isExpanded ? "Show less" : "Read more"}
              <svg
                className={cn(
                  "w-3 h-3 ml-1 transition-transform duration-200",
                  isExpanded && "rotate-180"
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          )}

          <div className="flex items-center justify-between">
            <span
              className={cn(
                "text-xs px-2 py-1 rounded-full font-medium",
                style.tagBg,
                style.tagColor
              )}
            >
              {insight.type.replace("_", " ").toLowerCase()}
            </span>

            <span className="text-xs text-gray-500">
              {new Date(insight.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * STEP 3 & 4: Main AI Insights Component with Compact Mode Toggle
 */
export default function AIInsights({
  className = "",
}: AIInsightsProps): JSX.Element {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCompactMode, setIsCompactMode] = useState(true);

  /**
   * Load AI insights on component mount
   */
  useEffect(() => {
    loadInsights();
  }, []);

  /**
   * Load AI insights from API
   */
  const loadInsights = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await aiApi.getInsights();

      if (response.status === "success") {
        setInsights(response.data || []);
      } else {
        throw new Error("Failed to load insights");
      }
    } catch (err: any) {
      console.error("❌ Load insights error:", err);
      setError(err.message || "Failed to load AI insights");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Generate new AI analysis
   */
  const generateNewAnalysis = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      const response = await aiApi.generateAnalysis({});

      if (response.status === "success") {
        setInsights(response.data || []);
      } else {
        throw new Error("Failed to generate analysis");
      }
    } catch (err: any) {
      console.error("❌ Generate analysis error:", err);
      setError(err.message || "Failed to generate new analysis");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          "bg-white rounded-xl shadow-sm border border-gray-200 p-6",
          className
        )}
      >
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading AI insights...</span>
        </div>
      </div>
    );
  }

  // Display insights with proper limiting
  const displayInsights = insights.slice(0, isCompactMode ? 6 : 4);

  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm border border-gray-200",
        className
      )}
    >
      {/* Header with Compact Mode Toggle */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col gap-6 md:flex-row items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                AI Financial Insights
              </h2>
              <p className="text-sm text-gray-500">Powered by Gemini AI</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Compact Mode Toggle */}
            <button
              onClick={() => setIsCompactMode(!isCompactMode)}
              className="flex items-center px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-700 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors duration-200"
            >
              {isCompactMode ? (
                <>
                  <EyeIcon className="w-4 h-4 mr-1" />
                  Detailed
                </>
              ) : (
                <>
                  <EyeSlashIcon className="w-4 h-4 mr-1" />
                  Compact
                </>
              )}
            </button>

            {/* Refresh Button */}
            <button
              onClick={generateNewAnalysis}
              disabled={isGenerating}
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                isGenerating
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              )}
            >
              <ArrowPathIcon
                className={cn("w-4 h-4 mr-2", isGenerating && "animate-spin")}
              />
              {isGenerating ? "Analyzing..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border-b border-gray-100">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Insights List with Scrollable Container */}
      <div className="p-6">
        {displayInsights.length > 0 ? (
          <div
            className={cn(
              "space-y-4",
              isCompactMode
                ? "max-h-80 overflow-y-auto"
                : "max-h-96 overflow-y-auto"
            )}
          >
            {displayInsights.map((insight) => (
              <InsightCard
                key={insight.id}
                insight={insight}
                isCompact={isCompactMode}
              />
            ))}

            {/* Show "View More" if there are more insights */}
            {insights.length > (isCompactMode ? 6 : 4) && (
              <div className="text-center pt-4 border-t border-gray-100">
                <button
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => {
                    // TODO: Implement full insights view or expand limit
                    console.log("View more insights");
                  }}
                >
                  View {insights.length - (isCompactMode ? 6 : 4)} more insights
                  →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <SparklesIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No AI insights yet
            </h3>
            <p className="text-gray-500 mb-4">
              Add more transactions to receive personalized financial insights
            </p>
            <button
              onClick={generateNewAnalysis}
              disabled={isGenerating}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Generate Insights
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
