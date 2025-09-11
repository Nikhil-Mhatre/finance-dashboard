/**
 * Transaction Routes
 * Handles CRUD operations for financial transactions
 *
 * @author Finance Dashboard Team
 * @version 1.0.0
 */

import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { redisService } from "../services/redisService";

const router: Router = Router();
const prisma = new PrismaClient();

/**
 * Transaction validation schema
 */
const transactionSchema = z.object({
  amount: z.number(),
  description: z.string().min(1, "Description is required"),
  category: z.enum([
    "FOOD_DINING",
    "TRANSPORTATION",
    "SHOPPING",
    "ENTERTAINMENT",
    "BILLS_UTILITIES",
    "HEALTHCARE",
    "TRAVEL",
    "EDUCATION",
    "BUSINESS",
    "PERSONAL_CARE",
    "GIFTS_DONATIONS",
    "INVESTMENTS",
    "SALARY",
    "FREELANCE",
    "BUSINESS_INCOME",
    "RENTAL_INCOME",
    "DIVIDEND_INCOME",
    "OTHER_INCOME",
    "OTHER_EXPENSE",
  ]),
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]),
  date: z.string().transform((str) => new Date(str)),
  accountId: z.string(),
});

/**
 * Create new transaction
 * @route POST /api/transactions
 * @header Authorization: Bearer {token}
 * @body {amount, description, category, type, date, accountId}
 * @returns {Object} Created transaction
 */
router.post("/", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const validatedData = transactionSchema.parse(req.body);

    // Verify account belongs to user
    const account = await prisma.account.findFirst({
      where: {
        id: validatedData.accountId,
        userId,
      },
    });

    if (!account) {
      return res.status(404).json({
        status: "error",
        message: "Account not found",
        timestamp: new Date().toISOString(),
      });
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        ...validatedData,
        userId,
      },
      include: {
        account: {
          select: {
            name: true,
            type: true,
          },
        },
      },
    });

    // Update account balance
    const balanceChange =
      validatedData.type === "INCOME"
        ? validatedData.amount
        : -Math.abs(validatedData.amount);

    await prisma.account.update({
      where: { id: validatedData.accountId },
      data: {
        balance: {
          increment: balanceChange,
        },
      },
    });

    // Add this after successful transaction creation
    console.log(
      `💳 Transaction created successfully: ${validatedData.description} - $${
        validatedData.amount
      } [${new Date().toISOString()}]`
    );

    // Invalidate user caches since data changed
    await redisService.invalidateUserCache(userId);

    // Publish real-time update
    await redisService.publishUpdate("user-updates", {
      userId,
      type: "NEW_TRANSACTION",
      data: transaction,
    });

    console.log(
      `✅ Transaction created and caches invalidated: ${validatedData.description}`
    );

    return res.status(201).json({
      status: "success",
      data: {
        ...transaction,
        amount: parseFloat(transaction.amount.toString()),
      },
      message: "Transaction created successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Transaction creation error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        status: "error",
        message: "Validation error",
        errors: error.issues.map(
          (err) => `${err.path.join(".")}: ${err.message}`
        ),
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Failed to create transaction",
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Get paginated list of transactions
 * @route GET /api/transactions
 * @header Authorization: Bearer {token}
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 * @query {string} category - Filter by category
 * @query {string} type - Filter by type
 * @query {string} accountId - Filter by account
 * @returns {Object} Paginated transactions
 */
router.get("/", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Build filters
    const filters: any = { userId };

    if (req.query.category) filters.category = req.query.category;
    if (req.query.type) filters.type = req.query.type;
    if (req.query.accountId) filters.accountId = req.query.accountId;

    if (req.query.startDate || req.query.endDate) {
      filters.date = {};
      if (req.query.startDate)
        filters.date.gte = new Date(req.query.startDate as string);
      if (req.query.endDate)
        filters.date.lte = new Date(req.query.endDate as string);
    }

    // Get transactions and total count
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: filters,
        include: {
          account: {
            select: {
              name: true,
              type: true,
            },
          },
        },
        orderBy: { date: "desc" },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where: filters }),
    ]);

    const formattedTransactions = transactions.map((transaction) => ({
      id: transaction.id,
      description: transaction.description,
      amount: parseFloat(transaction.amount.toString()),
      type: transaction.type,
      category: transaction.category,
      date: transaction.date.toISOString().split("T")[0],
      createdAt: transaction.createdAt,
      account: transaction.account.name,
      accountType: transaction.account.type,
      accountId: transaction.accountId,
    }));

    const totalPages = Math.ceil(total / limit);

    res.json({
      status: "success",
      data: formattedTransactions,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Get transactions error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch transactions",
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
