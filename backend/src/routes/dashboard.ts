/**
 * Dashboard Routes
 * Provides summary statistics, analytics, and overview data
 *
 * @author Finance Dashboard Team
 * @version 1.0.0
 */

import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router: Router = Router();
const prisma = new PrismaClient();

/**
 * Get dashboard overview statistics
 * @route GET /api/dashboard/stats
 * @header Authorization: Bearer {token}
 * @returns {Object} Dashboard summary data
 */

router.get("/stats", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const now = new Date();

    // Use last 30 days instead of current calendar month for more meaningful stats
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get all user accounts
    const accounts = await prisma.account.findMany({
      where: { userId, isActive: true },
    });

    // Calculate total balance
    const totalBalance = accounts.reduce(
      (sum, account) => sum + parseFloat(account.balance.toString()),
      0
    );

    // Get transactions from last 30 days (more meaningful than calendar month)
    const recentTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: last30Days,
        },
      },
    });

    // Also get current calendar month for comparison
    const monthlyTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startOfCurrentMonth,
          lte: now,
        },
      },
    });

    // Calculate recent (30-day) income and expenses
    const recentIncome = recentTransactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const recentExpenses = recentTransactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount.toString())), 0);

    // Calculate current month income and expenses
    const monthlyIncome = monthlyTransactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const monthlyExpenses = monthlyTransactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount.toString())), 0);

    // Get investments
    const investments = await prisma.investment.findMany({
      where: { userId },
    });

    const investmentValue = investments.reduce(
      (sum, inv) =>
        sum +
        parseFloat(inv.quantity.toString()) *
          parseFloat(inv.currentPrice.toString()),
      0
    );

    const investmentCost = investments.reduce(
      (sum, inv) =>
        sum +
        parseFloat(inv.quantity.toString()) *
          parseFloat(inv.purchasePrice.toString()),
      0
    );

    const investmentGainLoss = investmentValue - investmentCost;

    // Get budget utilization
    const activeBudgets = await prisma.budget.findMany({
      where: {
        userId,
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });

    const budgetUtilization =
      activeBudgets.length > 0
        ? activeBudgets.reduce(
            (sum, budget) =>
              sum +
              parseFloat(budget.spent.toString()) /
                parseFloat(budget.limit.toString()),
            0
          ) / activeBudgets.length
        : 0;

    // Get active alerts count
    const activeAlerts = await prisma.alert.count({
      where: {
        userId,
        isActive: true,
        isRead: false,
      },
    });

    const stats = {
      totalBalance,
      // Use recent data (last 30 days) for more meaningful stats
      monthlyIncome: recentIncome,
      monthlyExpenses: recentExpenses,
      monthlyNet: recentIncome - recentExpenses,
      // Include additional stats
      currentMonthIncome: monthlyIncome,
      currentMonthExpenses: monthlyExpenses,
      investmentValue,
      investmentGainLoss,
      budgetUtilization,
      activeAlerts,
      accountsCount: accounts.length,
      transactionsThisMonth: monthlyTransactions.length,
      transactionsLast30Days: recentTransactions.length,
    };

    console.log(`📊 Dashboard stats generated for user: ${req.user!.email}`);
    console.log(`📊 Total Balance: $${totalBalance}`);
    console.log(`📊 Last 30 days expenses: $${recentExpenses}`);
    console.log(`📊 Current month expenses: $${monthlyExpenses}`);

    res.json({
      status: "success",
      data: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Dashboard stats error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch dashboard statistics",
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Get recent transactions for dashboard
 * @route GET /api/dashboard/transactions/recent
 * @header Authorization: Bearer {token}
 * @query {number} limit - Number of transactions to fetch (default: 10)
 * @returns {Object} Recent transactions list
 */
router.get(
  "/transactions/recent",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const limit = parseInt(req.query.limit as string) || 10;

      const transactions = await prisma.transaction.findMany({
        where: { userId },
        include: {
          account: {
            select: {
              name: true,
              type: true,
            },
          },
        },
        orderBy: { date: "desc" },
        take: limit,
      });

      const formattedTransactions = transactions.map((transaction) => ({
        id: transaction.id,
        description: transaction.description,
        amount: parseFloat(transaction.amount.toString()),
        type: transaction.type,
        category: transaction.category,
        date: transaction.date.toISOString().split("T")[0],
        account: transaction.account.name,
        accountType: transaction.account.type,
      }));

      console.log(
        `📋 Recent transactions fetched for user: ${req.user!.email}`
      );

      res.json({
        status: "success",
        data: formattedTransactions,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("❌ Recent transactions error:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to fetch recent transactions",
        timestamp: new Date().toISOString(),
      });
    }
  }
);

/**
 * Get spending analytics by category
 * @route GET /api/dashboard/analytics/categories
 * @header Authorization: Bearer {token}
 * @query {string} startDate - Start date (ISO format)
 * @query {string} endDate - End date (ISO format)
 * @returns {Object} Category breakdown data
 */
router.get(
  "/analytics/categories",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const startDate =
        (req.query.startDate as string) ||
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        ).toISOString();
      const endDate = (req.query.endDate as string) || new Date().toISOString();

      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
          type: "EXPENSE",
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
      });

      // Group by category
      const categoryData = transactions.reduce((acc, transaction) => {
        const category = transaction.category;
        const amount = Math.abs(parseFloat(transaction.amount.toString()));

        if (!acc[category]) {
          acc[category] = {
            category,
            amount: 0,
            transactionCount: 0,
          };
        }

        acc[category].amount += amount;
        acc[category].transactionCount += 1;

        return acc;
      }, {} as Record<string, any>);

      const totalAmount = Object.values(categoryData).reduce(
        (sum: number, cat: any) => sum + cat.amount,
        0
      );

      // Calculate percentages and add colors
      const colors = [
        "#FF6B6B",
        "#4ECDC4",
        "#45B7D1",
        "#96CEB4",
        "#FFEAA7",
        "#DDA0DD",
        "#98D8C8",
        "#F7DC6F",
        "#BB8FCE",
        "#85C1E9",
      ];

      const categoryBreakdown = Object.values(categoryData)
        .map((cat: any, index) => ({
          ...cat,
          percentage: totalAmount > 0 ? cat.amount / totalAmount : 0,
          color: colors[index % colors.length],
        }))
        .sort((a: any, b: any) => b.amount - a.amount);

      console.log(
        `📈 Category analytics generated for user: ${req.user!.email}`
      );

      res.json({
        status: "success",
        data: {
          categories: categoryBreakdown,
          totalAmount,
          dateRange: { startDate, endDate },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("❌ Category analytics error:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to fetch category analytics",
        timestamp: new Date().toISOString(),
      });
    }
  }
);

export default router;
