/**
 * Account Routes
 * Handles user financial accounts management
 *
 * @author Finance Dashboard Team
 * @version 1.0.0
 */

import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { authenticateToken } from "../middleware/auth";

const router: Router = Router();
const prisma = new PrismaClient();

/**
 * Account validation schema
 */
const accountSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  type: z.enum([
    "CHECKING",
    "SAVINGS",
    "CREDIT_CARD",
    "INVESTMENT",
    "LOAN",
    "OTHER",
  ]),
  balance: z.number().default(0),
  currency: z.string().default("USD"),
});

/**
 * Get all user accounts
 * @route GET /api/accounts
 * @header Authorization: Bearer {token}
 * @returns {Object} User accounts list
 */
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;

    const accounts = await prisma.account.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: "asc" },
    });

    const formattedAccounts = accounts.map((account) => ({
      id: account.id,
      name: account.name,
      type: account.type,
      balance: parseFloat(account.balance.toString()),
      currency: account.currency,
      isActive: account.isActive,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    }));

    console.log(
      `🏦 Fetched ${accounts.length} accounts for user: ${req.user!.email}`
    );

    res.json({
      status: "success",
      data: formattedAccounts,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Get accounts error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch accounts",
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Get single account by ID
 * @route GET /api/accounts/:id
 * @header Authorization: Bearer {token}
 * @param {string} id - Account ID
 * @returns {Object} Account details
 */
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    const accountId = req.params.id;

    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId,
        isActive: true,
      },
    });

    if (!account) {
      return res.status(404).json({
        status: "error",
        message: "Account not found",
        timestamp: new Date().toISOString(),
      });
    }

    const formattedAccount = {
      id: account.id,
      name: account.name,
      type: account.type,
      balance: parseFloat(account.balance.toString()),
      currency: account.currency,
      isActive: account.isActive,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };

    return res.json({
      status: "success",
      data: formattedAccount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Get account error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch account",
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Create new account
 * @route POST /api/accounts
 * @header Authorization: Bearer {token}
 * @body {name, type, balance?, currency?}
 * @returns {Object} Created account
 */
router.post("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    const validatedData = accountSchema.parse(req.body);

    const account = await prisma.account.create({
      data: {
        ...validatedData,
        userId,
      },
    });

    const formattedAccount = {
      id: account.id,
      name: account.name,
      type: account.type,
      balance: parseFloat(account.balance.toString()),
      currency: account.currency,
      isActive: account.isActive,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };

    console.log(`🏦 Account created: ${account.name} - ${account.type}`);

    return res.status(201).json({
      status: "success",
      data: formattedAccount,
      message: "Account created successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Create account error:", error);

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
      message: "Failed to create account",
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
