/**
 * Root page - handles initial routing based on auth state
 */

"use client";

import AuthGuard from "@/components/AuthGuard";

export default function HomePage() {
  return (
    <AuthGuard requireAuth={false}>
      {/* This will never render because AuthGuard handles the redirect */}
      <div>Redirecting...</div>
    </AuthGuard>
  );
}
