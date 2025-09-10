/**
 * Authentication Guard Component
 * Protects routes and manages authentication flow
 *
 * @author Finance Dashboard Team
 * @version 1.0.0
 */

"use client";

import React, { JSX } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "./LoadingScreen";

/**
 * Authentication Guard Props
 */
interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * Authentication Guard Component
 *
 * @param {AuthGuardProps} props - Component props
 * @returns {JSX.Element} Protected content or loading screen
 */
export default function AuthGuard({
  children,
  requireAuth = false,
}: AuthGuardProps): JSX.Element {
  const { isLoading, isAuthenticated } = useAuth();

  // Show loading screen during auth initialization
  if (isLoading) {
    return <LoadingScreen />;
  }

  // For routes that require authentication
  if (requireAuth && !isAuthenticated) {
    return <LoadingScreen />; // AuthContext will handle redirect
  }

  // For routes that should redirect if authenticated
  if (!requireAuth && isAuthenticated) {
    return <LoadingScreen />; // AuthContext will handle redirect
  }

  return <>{children}</>;
}
