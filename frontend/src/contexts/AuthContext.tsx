/**
 * Authentication Context
 * Manages global authentication state and provides auth guards
 *
 * @author Finance Dashboard Team
 * @version 1.0.0
 */

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authApi } from "@/lib/api";

/**
 * User interface
 */
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Authentication context interface
 */
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

/**
 * Create authentication context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Protected and public routes configuration
 */
const PUBLIC_ROUTES = ["/auth/login", "/auth/register"];
const PROTECTED_ROUTES = ["/dashboard"];

/**
 * Authentication Provider Component
 *
 * @param {React.ReactNode} children - Child components
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Check if current route is public
   */
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  /**
   * Check if current route requires authentication
   */
  const isProtectedRoute =
    PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) ||
    pathname === "/";

  /**
   * Initialize authentication state on mount
   */
  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * Handle route protection based on auth state
   */
  useEffect(() => {
    if (!isLoading) {
      handleRouteProtection();
    }
  }, [user, isLoading, pathname]);

  /**
   * Initialize authentication state
   * Checks for existing token and validates it
   */
  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const userData = localStorage.getItem("user_data");

      if (token && userData) {
        // Validate token with backend
        const response = await authApi.getProfile();

        if (response.status === "success") {
          setUser(response.data.user);
        } else {
          // Token is invalid, clear it
          clearAuthData();
        }
      }
    } catch (error) {
      console.error("❌ Auth initialization error:", error);
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle route protection based on authentication status
   */
  const handleRouteProtection = () => {
    const isAuthenticated = !!user;

    if (isProtectedRoute && !isAuthenticated) {
      // User is not authenticated but trying to access protected route
      router.replace("/auth/login");
    } else if (isPublicRoute && isAuthenticated) {
      // User is authenticated but on public route, redirect to dashboard
      router.replace("/dashboard");
    } else if (pathname === "/" && isAuthenticated) {
      // Authenticated user on root, redirect to dashboard
      router.replace("/dashboard");
    } else if (pathname === "/" && !isAuthenticated) {
      // Unauthenticated user on root, redirect to login
      router.replace("/auth/login");
    }
  };

  /**
   * Clear authentication data
   */
  const clearAuthData = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    setUser(null);
  };

  /**
   * Login function
   *
   * @param {string} email - User email
   * @param {string} password - User password
   */
  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });

    if (response.status === "success" && response.data) {
      localStorage.setItem("auth_token", response.data.token);
      localStorage.setItem("user_data", JSON.stringify(response.data.user));
      setUser(response.data.user);
      router.replace("/dashboard");
    } else {
      throw new Error("Login failed");
    }
  };

  /**
   * Register function
   *
   * @param {object} data - Registration data
   */
  const register = async (data: any) => {
    const response = await authApi.register(data);

    if (response.status === "success" && response.data) {
      localStorage.setItem("auth_token", response.data.token);
      localStorage.setItem("user_data", JSON.stringify(response.data.user));
      setUser(response.data.user);
      router.replace("/dashboard");
    } else {
      throw new Error("Registration failed");
    }
  };

  /**
   * Logout function
   */
  const logout = () => {
    clearAuthData();
    router.replace("/auth/login");
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use authentication context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
