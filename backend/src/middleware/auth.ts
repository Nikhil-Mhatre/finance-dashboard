// src/middleware/auth.ts - COMPLETE FIX
import { RequestHandler } from "express";

/**
 * Session Authentication Middleware
 * Verifies user session and adds user information to request object
 */
export const authenticateSession: RequestHandler = async (req, res, next) => {
  try {
    const isAuth = req.isAuthenticated?.() ?? false;

    if (!isAuth) {
      res.status(401).json({
        status: "error",
        message: "Authentication required. Please login with Google.",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error);
    res.status(500).json({
      status: "error",
      message: "Authentication server error",
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Optional Authentication Middleware
 */
export const optionalAuth: RequestHandler = async (req, res, next) => {
  next();
};

// Export with explicit typing to fix inference errors
export const authenticateToken: RequestHandler = authenticateSession;
