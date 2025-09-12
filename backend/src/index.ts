/**
 * Main server entry point for AI-Powered Personal Finance Dashboard
 * Handles API routes, middleware setup, and session management
 *
 * @author Finance Dashboard Team
 * @version 1.0.0
 */

import express from "express";
import session from "express-session";
import { RedisStore } from "connect-redis";
import passport from "passport";
import { configureGoogleOAuth } from "./config/oauth";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";

// Import routes
import authRoutes from "./routes/auth";
import dashboardRoutes from "./routes/dashboard";
import transactionRoutes from "./routes/transactions";
import accountRoutes from "./routes/accounts";
import aiRoutes from "./routes/ai";
import { redisService } from "./services/redisService";

// Load environment variables
dotenv.config();

/**
 * Initialize Express application and Prisma client
 */
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Initialize OAuth before other middleware
configureGoogleOAuth();

/**
 * Initialize Redis connection and session store
 */
async function initializeRedis() {
  try {
    await redisService.connect();
    console.log("🎯 Redis service initialized");
  } catch (error) {
    console.error("❌ Redis initialization failed:", error);
    console.warn("⚠️ Continuing without Redis - sessions will use memory");
  }
}

/**
 * Middleware Configuration
 */
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use(compression());
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Session middleware (add after compression, before routes)
app.use(
  session({
    store: new RedisStore({
      client: redisService.getOAuthRedisClient, // Use your existing Redis client!
      prefix: "sess:", // Optional: prefix for session keys in Redis
    }),
    secret: process.env.SESSION_SECRET || "your-session-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
    name: "finance.sid",
  })
);

app.use(passport.initialize());
app.use(passport.session());

/**
 * Health check endpoint - Updated for CI/CD testing
 * @route GET /health
 * @returns {Object} Server status and database connection
 */
app.get("/health", async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;

    // Test Redis connection
    const redisHealth = await redisService.healthCheck();

    res.status(200).json({
      status: "success",
      message: "AI Finance Dashboard API is running smoothly! 🚀",
      timestamp: new Date().toISOString(),
      services: {
        database: "connected",
        redis: redisHealth.status,
      },
      environment: process.env.NODE_ENV || "development",
      version: "2.2.0",
      uptime: process.uptime(),
      features: {
        authentication: true,
        dashboard: true,
        transactions: true,
        ai_insights: true,
        redis_caching: redisHealth.connected,
        real_time: redisHealth.connected,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Service health check failed",
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * API Routes
 */

app.use("/api", (req, res, next) => {
  console.log(`📊 API Request: ${req.method} ${req.path}`);
  next();
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Dashboard routes
app.use("/api/dashboard", dashboardRoutes);

// Transaction routes
app.use("/api/transactions", transactionRoutes);

// Account routes
app.use("/api/accounts", accountRoutes);

// Ai routes
app.use("/api/ai", aiRoutes);

app.use("/api/ai", (req, res) => {
  res.json({
    status: "success",
    message: "AI insights routes coming soon!",
    timestamp: new Date().toISOString(),
  });
});

/**
 * 404 Handler
 */
app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      "GET /health",
      "POST /api/auth/register",
      "POST /api/auth/login",
      "GET /api/auth/profile",
      "GET /api/dashboard/stats",
      "GET /api/dashboard/transactions/recent",
      "GET /api/dashboard/analytics/categories",
      "GET /api/transactions",
      "POST /api/transactions",
      "GET /api/accounts",
      "POST /api/accounts",
      "GET /api/accounts/:id",
      "GET /api/ai/insights", // Add these
      "POST /api/ai/analyze", // Add these
      "GET /api/ai/summary", // Add these
    ],
    timestamp: new Date().toISOString(),
  });
});

/**
 * Global error handler
 */
app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("💥 Global Error:", error);

    res.status(error.status || 500).json({
      status: "error",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong!",
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
      timestamp: new Date().toISOString(),
    });
  }
);

/**
 * Start the server
 */
async function startServer() {
  try {
    await initializeRedis();
    await prisma.$connect();
    console.log("🗄️  Connected to PostgreSQL database");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`⚡ Redis: ${redisService ? "Connected" : "Disabled"}`);
      console.log("---");
      console.log("🎯 Available API endpoints:");
      console.log("Authentication:");
      console.log("• POST /api/auth/register - User registration");
      console.log("• POST /api/auth/login - User login");
      console.log("• GET /api/auth/profile - Get user profile");
      console.log("Dashboard:");
      console.log("• GET /api/dashboard/stats - Dashboard statistics");
      console.log(
        "• GET /api/dashboard/transactions/recent - Recent transactions"
      );
      console.log(
        "• GET /api/dashboard/analytics/categories - Category breakdown"
      );
      console.log("Transactions:");
      console.log("• GET /api/transactions - List transactions");
      console.log("• POST /api/transactions - Create transaction");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown
 */
process.on("beforeExit", async () => {
  await prisma.$disconnect();
  console.log("🔌 Disconnected from database");
});

startServer();
