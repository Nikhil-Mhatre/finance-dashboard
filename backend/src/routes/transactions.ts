/**
 * Transaction Routes
 * Handles CRUD operations for financial transactions
 *
 * @author Finance Dashboard Team
 * @version 1.0.0
 */

import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z, ZodError } from "zod";
import { authenticateToken } from "../middleware/auth";
import { redisService } from "../services/redisService"; // No change needed here, the error is likely from a mismatch in AuthRequest definition or how authenticateToken is typed.

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
router.post("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "User not authenticated",
        timestamp: new Date().toISOString(),
      });
    }
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

/**<ctrl_add>
 * Update an existing transaction
 * @route PUT /api/transactions/:id
 * @header Authorization: Bearer {token}
 * @param {string} id - Transaction ID
 * @body {amount?, description?, category?, type?, date?, accountId?}
 * @returns {Object} Updated transaction
 */
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "User not authenticated",
        timestamp: new Date().toISOString(),
      });
    }
    const transactionId = req.params.id;

    // Validate request body
    const updateSchema = transactionSchema.partial().extend({
      id: z.string().cuid(),
    });
    const validatedData = updateSchema.parse({
      ...req.body,
      id: transactionId,
    });

    // Find the existing transaction and verify ownership
    const existingTransaction = await prisma.transaction.findFirst({
      where: { id: transactionId, userId },
    });

    if (!existingTransaction) {
      return res.status(404).json({
        status: "error",
        message: "Transaction not found or access denied",
        timestamp: new Date().toISOString(),
      });
    }

    // Start a transaction for atomicity
    const updatedTransaction = await prisma.$transaction(async (tx) => {
      // If amount or account changed, adjust balances
      const amountChanged =
        validatedData.amount !== undefined &&
        validatedData.amount !==
          parseFloat(existingTransaction.amount.toString());
      const typeChanged =
        validatedData.type !== undefined &&
        validatedData.type !== existingTransaction.type;
      const accountChanged =
        validatedData.accountId !== undefined &&
        validatedData.accountId !== existingTransaction.accountId;

      if (amountChanged || typeChanged || accountChanged) {
        // Revert original transaction effect from the original account
        const originalBalanceChange =
          existingTransaction.type === "INCOME"
            ? -parseFloat(existingTransaction.amount.toString())
            : Math.abs(parseFloat(existingTransaction.amount.toString()));

        await tx.account.update({
          where: { id: existingTransaction.accountId },
          data: { balance: { increment: originalBalanceChange } },
        });

        // Apply new transaction effect to the new/same account
        const newAccountId =
          validatedData.accountId || existingTransaction.accountId;
        const newAmount =
          validatedData.amount !== undefined
            ? validatedData.amount
            : parseFloat(existingTransaction.amount.toString());
        const newType = validatedData.type || existingTransaction.type;

        const newBalanceChange =
          newType === "INCOME" ? newAmount : -Math.abs(newAmount);

        await tx.account.update({
          where: { id: newAccountId },
          data: { balance: { increment: newBalanceChange } },
        });
      }

      // Update the transaction itself
      return await tx.transaction.update({
        where: { id: transactionId },
        data: {
          ...validatedData,
          date: validatedData.date
            ? new Date(validatedData.date)
            : existingTransaction.date,
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
    });

    // Invalidate user caches since data changed
    await redisService.invalidateUserCache(userId);

    // Publish real-time update
    await redisService.publishUpdate("user-updates", {
      userId,
      type: "UPDATED_TRANSACTION",
      data: updatedTransaction,
    });

    console.log(`✏️ Transaction updated: ${updatedTransaction.description}`);

    return res.json({
      status: "success",
      data: {
        ...updatedTransaction,
        amount: parseFloat(updatedTransaction.amount.toString()),
      },
      message: "Transaction updated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Transaction update error:", error);

    if (error instanceof ZodError) {
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
      message: "Failed to update transaction",
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Delete a transaction
 * @route DELETE /api/transactions/:id
 * @header Authorization: Bearer {token}
 * @param {string} id - Transaction ID
 * @returns {Object} Success message
 */
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "User not authenticated",
        timestamp: new Date().toISOString(),
      });
    }
    const transactionId = req.params.id;

    // Find the existing transaction and verify ownership
    const existingTransaction = await prisma.transaction.findFirst({
      where: { id: transactionId, userId },
    });

    if (!existingTransaction) {
      return res.status(404).json({
        status: "error",
        message: "Transaction not found or access denied",
        timestamp: new Date().toISOString(),
      });
    }

    // Start a transaction for atomicity
    await prisma.$transaction(async (tx) => {
      // Revert the balance change from the account
      const balanceChange =
        existingTransaction.type === "INCOME"
          ? -parseFloat(existingTransaction.amount.toString())
          : Math.abs(parseFloat(existingTransaction.amount.toString()));

      await tx.account.update({
        where: { id: existingTransaction.accountId },
        data: { balance: { increment: balanceChange } },
      });

      // Delete the transaction
      await tx.transaction.delete({
        where: { id: transactionId },
      });
    });

    // Invalidate user caches since data changed
    await redisService.invalidateUserCache(userId);

    // Publish real-time update
    await redisService.publishUpdate("user-updates", {
      userId,
      type: "DELETED_TRANSACTION",
      data: { id: transactionId },
    });

    console.log(`🗑️ Transaction deleted: ${existingTransaction.description}`);

    return res.json({
      status: "success",
      message: "Transaction deleted successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Transaction deletion error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to delete transaction",
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
// Sorting + search + response formatting — clean implementation
// Sorting + search + response formatting — clean implementation
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "User not authenticated",
        timestamp: new Date().toISOString(),
      });
    }
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Filters
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

    // Search
    if (req.query.search) {
      const searchTerm = req.query.search as string;
      filters.OR = [
        { description: { contains: searchTerm, mode: "insensitive" } },
        { category: { contains: searchTerm, mode: "insensitive" } },
        { account: { name: { contains: searchTerm, mode: "insensitive" } } },
      ];
    }

    // Sorting
    const sortKey = (req.query.sortKey as string) || "date";
    const sortDir = ((req.query.sortDir as string) || "desc").toLowerCase() as
      | "asc"
      | "desc";

    let orderBy: any;
    switch (sortKey) {
      case "amount":
        orderBy = { amount: sortDir };
        break;
      case "type":
        orderBy = { type: sortDir };
        break;
      case "account":
        orderBy = { account: { name: sortDir } };
        break;
      case "date":
      default:
        orderBy = { date: sortDir };
        break;
    }

    const [rows, total] = await Promise.all([
      prisma.transaction.findMany({
        where: filters,
        include: { account: { select: { name: true, type: true } } },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where: filters }),
    ]);

    const data = rows.map((t) => ({
      id: t.id,
      description: t.description,
      amount: parseFloat(t.amount.toString()),
      type: t.type,
      category: t.category,
      // Return a clean YYYY-MM-DD (UI can still format locale if needed)
      date: t.date.toISOString().split("T"),
      createdAt: t.createdAt,
      account: t.account.name,
      accountType: t.account.type,
      accountId: t.accountId,
    }));

    const totalPages = Math.ceil(total / limit);

    res.json({
      status: "success",
      data,
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
