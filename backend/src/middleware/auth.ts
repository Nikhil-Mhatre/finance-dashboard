// src/middleware/auth.ts - COMPLETE REPLACEMENT
/**
 * Session-based Authentication Middleware
 * Replaces JWT with session-based authentication
 */

import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Extended Request interface with user information
 */
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    avatar?: string | null;
  };
}

/**
 * Session Authentication Middleware
 * Verifies user session and adds user information to request object
 */
export const authenticateSession: RequestHandler = async (req, res, next) => {
  try {
    // isAuthenticated is added by passport; TS may not see it without augmentation
    const isAuth =
      typeof (req as any).isAuthenticated === "function"
        ? (req as any).isAuthenticated()
        : false;

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
 * Adds user information if authenticated, but doesn't require authentication
 */
export async function optionalAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  // User information already available in req.user if authenticated
  next();
}

// Export aliases for compatibility
export const authenticateToken = authenticateSession;
