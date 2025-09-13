// src/utils/auth.ts - IMPROVED VERSION
import { Request, Response } from "express";

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export function getAuthenticatedUser(req: Request): AuthenticatedUser | null {
  const user = req.user as any;
  if (!user || !user.id || !user.email) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName || null,
    lastName: user.lastName || null,
    avatar: user.avatar || null,
    createdAt: user.createdAt || undefined,
    updatedAt: user.updatedAt || undefined,
  };
}

export function requireAuth(req: Request, res?: Response): AuthenticatedUser {
  const user = getAuthenticatedUser(req);
  if (!user) {
    if (res) {
      res.status(401).json({
        status: "error",
        message: "Authentication required",
        timestamp: new Date().toISOString(),
      });
    }
    throw new Error("User not authenticated");
  }
  return user;
}

// Safe way to get user email for logging
export function getUserEmail(req: Request): string {
  const user = getAuthenticatedUser(req);
  return user?.email || "unknown";
}
