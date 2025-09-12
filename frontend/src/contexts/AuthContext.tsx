// src/contexts/AuthContext.tsx - COMPLETE REPLACEMENT
/**
 * OAuth Authentication Context
 * Manages Google OAuth authentication state
 */

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authApi } from "@/lib/api";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ["/auth/login"];
const PROTECTED_ROUTES = ["/dashboard"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const isProtectedRoute =
    PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) ||
    pathname === "/";

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      handleRouteProtection();
    }
  }, [user, isLoading, pathname]);

  /**
   * Check authentication status
   */
  const checkAuthStatus = async () => {
    try {
      const response = await authApi.getStatus();
      if (response.status === "success" && response.data.isAuthenticated) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("❌ Auth status check error:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle route protection
   */
  const handleRouteProtection = () => {
    const isAuthenticated = !!user;

    if (isProtectedRoute && !isAuthenticated) {
      router.replace("/auth/login");
    } else if (isPublicRoute && isAuthenticated) {
      router.replace("/dashboard");
    } else if (pathname === "/" && isAuthenticated) {
      router.replace("/dashboard");
    } else if (pathname === "/" && !isAuthenticated) {
      router.replace("/auth/login");
    }
  };

  /**
   * Login with Google
   */
  const loginWithGoogle = () => {
    authApi.loginWithGoogle();
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      router.replace("/auth/login");
    } catch (error) {
      console.error("❌ Logout error:", error);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
