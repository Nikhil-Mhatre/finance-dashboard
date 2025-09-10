/**
 * Transaction Form Component
 * Form to create and edit financial transactions
 *
 * @author Finance Dashboard Team
 * @version 1.0.0
 */

"use client";

import React, { useState, useEffect, JSX } from "react";
import {
  XMarkIcon,
  CalendarIcon,
  CreditCardIcon,
  TagIcon,
  CurrencyDollarIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { transactionsApi, accountsApi } from "@/lib/api";
import { cn } from "@/lib/utils";

/**
 * Transaction form data interface
 */
interface TransactionFormData {
  amount: string;
  description: string;
  category: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  date: string;
  accountId: string;
}

/**
 * Component props
 */
interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editTransaction?: any;
}

/**
 * Transaction categories organized by type
 */
const TRANSACTION_CATEGORIES = {
  INCOME: [
    { value: "SALARY", label: "Salary", icon: "💼" },
    { value: "FREELANCE", label: "Freelance", icon: "💻" },
    { value: "BUSINESS_INCOME", label: "Business Income", icon: "🏢" },
    { value: "RENTAL_INCOME", label: "Rental Income", icon: "🏠" },
    { value: "DIVIDEND_INCOME", label: "Dividends", icon: "📈" },
    { value: "OTHER_INCOME", label: "Other Income", icon: "💰" },
  ],
  EXPENSE: [
    { value: "FOOD_DINING", label: "Food & Dining", icon: "🍽️" },
    { value: "TRANSPORTATION", label: "Transportation", icon: "🚗" },
    { value: "SHOPPING", label: "Shopping", icon: "🛍️" },
    { value: "ENTERTAINMENT", label: "Entertainment", icon: "🎬" },
    { value: "BILLS_UTILITIES", label: "Bills & Utilities", icon: "💡" },
    { value: "HEALTHCARE", label: "Healthcare", icon: "🏥" },
    { value: "TRAVEL", label: "Travel", icon: "✈️" },
    { value: "EDUCATION", label: "Education", icon: "📚" },
    { value: "PERSONAL_CARE", label: "Personal Care", icon: "💅" },
    { value: "GIFTS_DONATIONS", label: "Gifts & Donations", icon: "🎁" },
    { value: "OTHER_EXPENSE", label: "Other Expense", icon: "💸" },
  ],
  TRANSFER: [
    { value: "ACCOUNT_TRANSFER", label: "Account Transfer", icon: "🔄" },
  ],
};

/**
 * Transaction Form Component
 */
export default function TransactionForm({
  isOpen,
  onClose,
  onSuccess,
  editTransaction,
}: TransactionFormProps): JSX.Element {
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: "",
    description: "",
    category: "",
    type: "EXPENSE",
    date: new Date().toISOString().split("T")[0],
    accountId: "",
  });

  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);

  /**
   * Load user accounts when component mounts
   */
  useEffect(() => {
    if (isOpen) {
      loadAccounts();

      // Pre-fill form if editing
      if (editTransaction) {
        setFormData({
          amount: Math.abs(editTransaction.amount).toString(),
          description: editTransaction.description,
          category: editTransaction.category,
          type: editTransaction.type,
          date: editTransaction.date,
          accountId: editTransaction.accountId,
        });
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, editTransaction]);

  /**
   * Load user accounts from API
   */
  const loadAccounts = async () => {
    try {
      setIsLoadingAccounts(true);
      const response = await accountsApi.getAccounts();

      if (response.status === "success" && response.data) {
        setAccounts(response.data);

        // Auto-select first account if none selected
        if (!formData.accountId && response.data.length > 0) {
          setFormData((prev) => ({ ...prev, accountId: response.data[0].id }));
        }
      }
    } catch (err: any) {
      console.error("Error loading accounts:", err);
      setError("Failed to load accounts");
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  /**
   * Handle form input changes
   */
  const handleInputChange = (
    field: keyof TransactionFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (error) setError(null);

    // Reset category when type changes
    if (field === "type") {
      setFormData((prev) => ({ ...prev, category: "" }));
    }
  };

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError("Please enter a valid amount");
      return false;
    }

    if (!formData.description.trim()) {
      setError("Please enter a description");
      return false;
    }

    if (!formData.category) {
      setError("Please select a category");
      return false;
    }

    if (!formData.accountId) {
      setError("Please select an account");
      return false;
    }

    return true;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setError(null);

      // Prepare transaction data
      const transactionData = {
        amount:
          formData.type === "EXPENSE"
            ? -Math.abs(parseFloat(formData.amount))
            : Math.abs(parseFloat(formData.amount)),
        description: formData.description.trim(),
        category: formData.category,
        type: formData.type,
        date: formData.date,
        accountId: formData.accountId,
      };

      // Create or update transaction
      if (editTransaction) {
        await transactionsApi.updateTransaction(
          editTransaction.id,
          transactionData
        );
      } else {
        await transactionsApi.createTransaction(transactionData);
      }

      console.log(
        `✅ Transaction ${editTransaction ? "updated" : "created"} successfully`
      );

      // Reset form and close
      resetForm();
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Transaction form error:", err);
      setError(err.message || "Failed to save transaction");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData({
      amount: "",
      description: "",
      category: "",
      type: "EXPENSE",
      date: new Date().toISOString().split("T")[0],
      accountId: accounts.length > 0 ? accounts[0].id : "",
    });
    setError(null);
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    resetForm();
    onClose();
  };

  /**
   * Handle backdrop click to close modal
   */
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop, not the modal content
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return <></>;

  const availableCategories = TRANSACTION_CATEGORIES[formData.type] || [];

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <PlusIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {editTransaction ? "Edit Transaction" : "Add Transaction"}
              </h2>
              <p className="text-sm text-gray-500">
                {editTransaction
                  ? "Update transaction details"
                  : "Record your income or expense"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(["INCOME", "EXPENSE"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleInputChange("type", type)}
                    className={cn(
                      "p-3 rounded-lg border text-sm font-medium transition-colors duration-200",
                      formData.type === type
                        ? type === "INCOME"
                          ? "bg-green-50 border-green-200 text-green-700"
                          : "bg-red-50 border-red-200 text-red-700"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    {type === "INCOME" ? "📈 Income" : "📉 Expense"}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <input
                id="description"
                type="text"
                required
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter description..."
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {availableCategories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => handleInputChange("category", cat.value)}
                    className={cn(
                      "p-3 rounded-lg border text-left text-sm font-medium transition-colors duration-200",
                      formData.category === cat.value
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-blue-50"
                    )}
                  >
                    <span className="mr-2">{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Account */}
            <div>
              <label
                htmlFor="account"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Account
              </label>
              {isLoadingAccounts ? (
                <div className="flex items-center justify-center p-3 border border-gray-300 rounded-lg">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-sm text-gray-600">
                    Loading accounts...
                  </span>
                </div>
              ) : (
                <select
                  id="account"
                  required
                  value={formData.accountId}
                  onChange={(e) =>
                    handleInputChange("accountId", e.target.value)
                  }
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select an account</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} (${account.balance.toFixed(2)})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Date */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex space-x-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "flex-1 px-4 py-3 rounded-lg text-white font-medium transition-colors duration-200",
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : formData.type === "INCOME"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                )}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  `${editTransaction ? "Update" : "Add"} ${
                    formData.type === "INCOME" ? "Income" : "Expense"
                  }`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
