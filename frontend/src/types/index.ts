/**
 * TypeScript type definitions for AI Finance Dashboard
 * Defines interfaces and types used throughout the application
 *
 * @author Finance Dashboard Team
 * @version 1.0.0
 */

// =======================================
// API Response Types
// =======================================

/**
 * Standard API response wrapper
 * All API endpoints return responses in this format
 */
export interface ApiResponse<T = any> {
  status: "success" | "error";
  message: string;
  data?: T;
  errors?: string[];
  timestamp: string;
}

/**
 * Pagination metadata for paginated API responses
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

// =======================================
// User & Authentication Types
// =======================================

/**
 * User profile information
 */
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Authentication credentials for login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data for new users
 */
export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

/**
 * JWT authentication token response
 */
export interface AuthToken {
  token: string;
  user: User;
  expiresAt: string;
}

// =======================================
// Financial Data Types
// =======================================

/**
 * Financial account types
 */
export type AccountType =
  | "CHECKING"
  | "SAVINGS"
  | "CREDIT_CARD"
  | "INVESTMENT"
  | "LOAN"
  | "OTHER";

/**
 * Financial account information
 */
export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

/**
 * Transaction types and categories
 */
export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";

export type TransactionCategory =
  | "FOOD_DINING"
  | "TRANSPORTATION"
  | "SHOPPING"
  | "ENTERTAINMENT"
  | "BILLS_UTILITIES"
  | "HEALTHCARE"
  | "TRAVEL"
  | "EDUCATION"
  | "BUSINESS"
  | "PERSONAL_CARE"
  | "GIFTS_DONATIONS"
  | "INVESTMENTS"
  | "SALARY"
  | "FREELANCE"
  | "BUSINESS_INCOME"
  | "RENTAL_INCOME"
  | "DIVIDEND_INCOME"
  | "OTHER_INCOME"
  | "OTHER_EXPENSE";

/**
 * Financial transaction record
 */
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: TransactionCategory;
  type: TransactionType;
  date: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  accountId: string;
  account?: Account;
}

/**
 * Budget period types
 */
export type BudgetPeriod = "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";

/**
 * Budget tracking and management
 */
export interface Budget {
  id: string;
  name: string;
  category: TransactionCategory;
  limit: number;
  spent: number;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

/**
 * Investment types
 */
export type InvestmentType =
  | "STOCK"
  | "ETF"
  | "MUTUAL_FUND"
  | "BOND"
  | "CRYPTO"
  | "REAL_ESTATE"
  | "COMMODITY"
  | "OTHER";

/**
 * Investment portfolio item
 */
export interface Investment {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  type: InvestmentType;
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  // Calculated fields
  totalValue?: number;
  gainLoss?: number;
  gainLossPercentage?: number;
}

// =======================================
// Alert & Notification Types
// =======================================

/**
 * Alert types for notifications
 */
export type AlertType =
  | "BUDGET_LIMIT"
  | "UNUSUAL_SPENDING"
  | "INVESTMENT_CHANGE"
  | "BILL_REMINDER"
  | "GOAL_ACHIEVEMENT"
  | "MARKET_OPPORTUNITY";

/**
 * User alert/notification
 */
export interface Alert {
  id: string;
  title: string;
  message: string;
  type: AlertType;
  isRead: boolean;
  isActive: boolean;
  triggerAt?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// =======================================
// AI Insights Types
// =======================================

/**
 * AI insight types
 */
export type InsightType =
  | "SPENDING_PATTERN"
  | "BUDGET_RECOMMENDATION"
  | "INVESTMENT_ADVICE"
  | "SAVING_OPPORTUNITY"
  | "RISK_ASSESSMENT"
  | "MARKET_ANALYSIS";

/**
 * AI-generated financial insight
 */
export interface AIInsight {
  id: string;
  title: string;
  content: string;
  type: InsightType;
  confidence: number;
  isRelevant: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// =======================================
// Dashboard & Analytics Types
// =======================================

/**
 * Dashboard summary statistics
 */
export interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyNet: number;
  investmentValue: number;
  investmentGainLoss: number;
  budgetUtilization: number;
  activeAlerts: number;
}

/**
 * Chart data point for visualizations
 */
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  date?: string;
}

/**
 * Time series data for charts
 */
export interface TimeSeriesData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill?: boolean;
  }[];
}

/**
 * Expense breakdown by category
 */
export interface CategoryBreakdown {
  category: TransactionCategory;
  amount: number;
  percentage: number;
  color: string;
  transactionCount: number;
}

// =======================================
// Form & UI Types
// =======================================

/**
 * Loading states for async operations
 */
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

/**
 * Generic form state
 */
export interface FormState<T> extends LoadingState {
  data: T;
  isDirty: boolean;
  isValid: boolean;
}

/**
 * Date range selector
 */
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

/**
 * Filter options for transactions and analytics
 */
export interface TransactionFilters {
  dateRange?: DateRange;
  categories?: TransactionCategory[];
  types?: TransactionType[];
  accounts?: string[];
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
}

// =======================================
// WebSocket Types
// =======================================

/**
 * WebSocket message types
 */
export type WebSocketMessageType =
  | "TRANSACTION_CREATED"
  | "TRANSACTION_UPDATED"
  | "TRANSACTION_DELETED"
  | "ACCOUNT_UPDATED"
  | "INVESTMENT_PRICE_UPDATE"
  | "NEW_ALERT"
  | "AI_INSIGHT_GENERATED"
  | "BUDGET_UPDATED";

/**
 * WebSocket message structure
 */
export interface WebSocketMessage<T = any> {
  type: WebSocketMessageType;
  payload: T;
  timestamp: string;
  userId?: string;
}

/**
 * Real-time price update for investments
 */
export interface PriceUpdate {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: string;
}

// =======================================
// Error Types
// =======================================

/**
 * Application error with additional context
 */
export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  details?: any;
}

/**
 * Validation error for forms
 */
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}
