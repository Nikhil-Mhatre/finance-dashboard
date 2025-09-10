/**
 * API client for AI Finance Dashboard
 * Handles all HTTP requests to the backend API with proper error handling
 *
 * @author Finance Dashboard Team
 * @version 1.0.0
 */

import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { ApiResponse, PaginatedResponse } from "@/types";

/**
 * API client configuration
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Create configured axios instance
 * Includes default headers, base URL, and timeout settings
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor to add authentication token
 * Automatically includes JWT token in all requests if available
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage (we'll implement auth later)
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for global error handling
 * Handles common HTTP errors and token expiration
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error(
      "❌ API Error:",
      error.response?.status,
      error.response?.statusText
    );

    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear invalid token
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        // Redirect to login page (we'll implement this later)
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Generic API request handler with type safety
 *
 * @template T - Expected response data type
 * @param {string} endpoint - API endpoint path
 * @param {object} options - Request configuration
 * @returns {Promise<T>} Typed API response data
 */
async function apiRequest<T>(
  endpoint: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    data?: any;
    params?: any;
  } = {}
): Promise<T> {
  try {
    const response = await apiClient({
      url: endpoint,
      method: options.method || "GET",
      data: options.data,
      params: options.params,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "An error occurred");
    }
    throw error;
  }
}

// =======================================
// API Endpoints
// =======================================

/**
 * Health check API
 * Tests server connectivity and status
 */
export const healthApi = {
  /**
   * Check server health status
   * @returns {Promise<ApiResponse>} Server health information
   */
  check: () => apiRequest<ApiResponse>("/health"),
};

/**
 * Authentication API endpoints
 * Handles user registration, login, and token management
 */
export const authApi = {
  /**
   * User login with credentials
   * @param {object} credentials - User email and password
   * @returns {Promise<ApiResponse>} Authentication token and user data
   */
  login: (credentials: { email: string; password: string }) =>
    apiRequest<ApiResponse>("/api/auth/login", {
      method: "POST",
      data: credentials,
    }),

  /**
   * Register new user account
   * @param {object} userData - User registration information
   * @returns {Promise<ApiResponse>} Created user data
   */
  register: (userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) =>
    apiRequest<ApiResponse>("/api/auth/register", {
      method: "POST",
      data: userData,
    }),

  /**
   * Get current user profile
   * @returns {Promise<ApiResponse>} Current user information
   */
  getProfile: () => apiRequest<ApiResponse>("/api/auth/profile"),

  /**
   * Logout user and invalidate token
   * @returns {Promise<ApiResponse>} Logout confirmation
   */
  logout: () => apiRequest<ApiResponse>("/api/auth/logout", { method: "POST" }),
};

/**
 * Dashboard API endpoints
 * Provides summary statistics and overview data
 */
export const dashboardApi = {
  /**
   * Get dashboard overview statistics
   * @returns {Promise<ApiResponse>} Dashboard summary data
   */
  getStats: () => apiRequest<ApiResponse>("/api/dashboard/stats"),

  /**
   * Get recent transactions for dashboard
   * @param {number} limit - Number of transactions to fetch
   * @returns {Promise<ApiResponse>} Recent transactions list
   */
  getRecentTransactions: (limit: number = 10) =>
    apiRequest<ApiResponse>("/api/dashboard/transactions/recent", {
      params: { limit },
    }),

  /**
   * Get spending analytics by category
   * @param {object} dateRange - Start and end dates for analysis
   * @returns {Promise<ApiResponse>} Category breakdown data
   */
  getCategoryBreakdown: (dateRange: { startDate: string; endDate: string }) =>
    apiRequest<ApiResponse>("/api/dashboard/analytics/categories", {
      params: dateRange,
    }),
};

/**
 * Transactions API endpoints
 * Handles CRUD operations for financial transactions
 */
export const transactionsApi = {
  /**
   * Get paginated list of transactions
   * @param {object} filters - Transaction filters and pagination
   * @returns {Promise<PaginatedResponse>} Paginated transactions
   */
  getTransactions: (filters: any = {}) =>
    apiRequest<PaginatedResponse<any>>("/api/transactions", {
      params: filters,
    }),

  /**
   * Create new transaction
   * @param {object} transactionData - Transaction details
   * @returns {Promise<ApiResponse>} Created transaction
   */
  createTransaction: (transactionData: any) =>
    apiRequest<ApiResponse>("/api/transactions", {
      method: "POST",
      data: transactionData,
    }),

  /**
   * Update existing transaction
   * @param {string} id - Transaction ID
   * @param {object} updates - Updated transaction data
   * @returns {Promise<ApiResponse>} Updated transaction
   */
  updateTransaction: (id: string, updates: any) =>
    apiRequest<ApiResponse>(`/api/transactions/${id}`, {
      method: "PUT",
      data: updates,
    }),

  /**
   * Delete transaction
   * @param {string} id - Transaction ID to delete
   * @returns {Promise<ApiResponse>} Deletion confirmation
   */
  deleteTransaction: (id: string) =>
    apiRequest<ApiResponse>(`/api/transactions/${id}`, {
      method: "DELETE",
    }),
};

/**
 * Accounts API endpoints
 * Manages user financial accounts
 */
export const accountsApi = {
  /**
   * Get all user accounts
   * @returns {Promise<ApiResponse>} User accounts list
   */
  getAccounts: () => apiRequest<ApiResponse>("/api/accounts"),

  /**
   * Get single account by ID
   * @param {string} id - Account ID
   * @returns {Promise<ApiResponse>} Account details
   */
  getAccount: (id: string) => apiRequest<ApiResponse>(`/api/accounts/${id}`),

  /**
   * Create new financial account
   * @param {object} accountData - Account details
   * @returns {Promise<ApiResponse>} Created account
   */
  createAccount: (accountData: {
    name: string;
    type:
      | "CHECKING"
      | "SAVINGS"
      | "CREDIT_CARD"
      | "INVESTMENT"
      | "LOAN"
      | "OTHER";
    balance?: number;
    currency?: string;
  }) =>
    apiRequest<ApiResponse>("/api/accounts", {
      method: "POST",
      data: accountData,
    }),

  /**
   * Update account information
   * @param {string} id - Account ID
   * @param {object} updates - Updated account data
   * @returns {Promise<ApiResponse>} Updated account
   */
  updateAccount: (id: string, updates: any) =>
    apiRequest<ApiResponse>(`/api/accounts/${id}`, {
      method: "PUT",
      data: updates,
    }),
};

/**
 * AI Insights API endpoints
 * Handles AI-generated financial insights and recommendations
 */
export const aiApi = {
  /**
   * Get AI-generated insights for user
   * @returns {Promise<ApiResponse>} AI insights and recommendations
   */
  getInsights: () => apiRequest<ApiResponse>("/api/ai/insights"),

  /**
   * Generate new AI analysis
   * @param {object} analysisRequest - Analysis parameters
   * @returns {Promise<ApiResponse>} Generated AI insights
   */
  generateAnalysis: (analysisRequest: any) =>
    apiRequest<ApiResponse>("/api/ai/analyze", {
      method: "POST",
      data: analysisRequest,
    }),
};

/**
 * Export the configured axios instance for direct use if needed
 */
export { apiClient };
export default apiClient;
