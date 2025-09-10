/**
 * Authentication Routes
 * Handles user registration, login, and JWT token management
 *
 * @author Finance Dashboard Team
 * @version 1.0.0
 */

import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const router: Router = Router();
const prisma = new PrismaClient();

/**
 * Validation schemas using Zod
 */
const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Generate JWT token for authenticated users
 *
 * @param {string} userId - User ID to encode in token
 * @returns {string} JWT token
 */
function generateToken(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "fallback_secret_key", {
    expiresIn: "7d",
  });
}

/**
 * Hash password using bcrypt
 *
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compare password with hashed version
 *
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} Password match result
 */
async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Register new user account
 * @route POST /api/auth/register
 * @body {email, password, firstName?, lastName?}
 * @returns {Object} Created user data and JWT token
 */
router.post("/register", async (req, res) => {
  try {
    // Validate request body
    const validatedData = registerSchema.parse(req.body);
    const { email, password, firstName, lastName } = validatedData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User with this email already exists",
        timestamp: new Date().toISOString(),
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Generate JWT token
    const token = generateToken(user.id);

    // Create default accounts for new user
    await prisma.account.createMany({
      data: [
        {
          userId: user.id,
          name: "Primary Checking",
          type: "CHECKING",
          balance: 0,
          currency: "USD",
        },
        {
          userId: user.id,
          name: "Savings Account",
          type: "SAVINGS",
          balance: 0,
          currency: "USD",
        },
      ],
    });

    console.log(`✅ New user registered: ${email}`);

    return res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        user,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Registration error:", error);

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
      message: "Internal server error during registration",
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * User login with credentials
 * @route POST /api/auth/login
 * @body {email, password}
 * @returns {Object} User data and JWT token
 */
router.post("/login", async (req, res) => {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
        timestamp: new Date().toISOString(),
      });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
        timestamp: new Date().toISOString(),
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;

    console.log(`✅ User logged in: ${email}`);

    return res.json({
      status: "success",
      message: "Login successful",
      data: {
        user: userWithoutPassword,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Login error:", error);

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
      message: "Internal server error during login",
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Get current user profile
 * @route GET /api/auth/profile
 * @header Authorization: Bearer {token}
 * @returns {Object} Current user data
 */
router.get("/profile", async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Access token required",
        timestamp: new Date().toISOString(),
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret_key"
    ) as { userId: string };

    // Find user by ID
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
        timestamp: new Date().toISOString(),
      });
    }

    return res.json({
      status: "success",
      data: { user },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Profile error:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        status: "error",
        message: "Invalid or expired token",
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Logout user (client-side token removal)
 * @route POST /api/auth/logout
 * @returns {Object} Logout confirmation
 */
router.post("/logout", (req, res) => {
  res.json({
    status: "success",
    message: "Logout successful. Please remove token from client storage.",
    timestamp: new Date().toISOString(),
  });
});

export default router;
