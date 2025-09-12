// src/app/auth/login/page.tsx - MODERN REFACTORED VERSION
/**
 * Modern Google OAuth Login Page
 * Industry-standard design with enhanced UX and accessibility
 */

"use client";

import React, { JSX } from "react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import {
  ChartBarIcon,
  ShieldCheckIcon,
  SparklesIcon,
  BanknotesIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function LoginPage(): JSX.Element {
  const { loginWithGoogle, isLoading } = useAuth();

  const features = [
    {
      icon: SparklesIcon,
      title: "AI-Powered Insights",
      description: "Smart recommendations based on your spending patterns",
    },
    {
      icon: ChartBarIcon,
      title: "Real-Time Analytics",
      description: "Beautiful charts and comprehensive financial reports",
    },
    {
      icon: BanknotesIcon,
      title: "Transaction Tracking",
      description: "Effortlessly categorize and monitor all your expenses",
    },
    {
      icon: ShieldCheckIcon,
      title: "Bank-Level Security",
      description: "Your financial data is encrypted and fully protected",
    },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
        {/* Left Panel - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
          </div>

          <div className="relative z-10 flex flex-col justify-between w-full max-w-md">
            {/* Logo & Tagline */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                  <span className="text-2xl font-bold">AI</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Finance Dashboard</h1>
                  <p className="text-blue-100 text-sm">
                    Intelligent Financial Management
                  </p>
                </div>
              </div>

              <div className="mb-12">
                <h2 className="text-3xl font-bold leading-tight mb-4">
                  Take control of your finances with AI-powered insights
                </h2>
                <p className="text-blue-100 text-lg leading-relaxed">
                  Join thousands of users who've transformed their financial
                  habits with smart analytics and personalized recommendations.
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg group-hover:bg-white/30 transition-colors duration-200">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-blue-100 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center space-x-2 mb-4">
                <div className="bg-blue-600 text-white p-3 rounded-xl">
                  <span className="text-xl font-bold">AI</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  Finance Dashboard
                </span>
              </div>
              <p className="text-gray-600">Intelligent Financial Management</p>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome back
                </h2>
                <p className="text-gray-600">
                  Sign in to access your financial dashboard
                </p>
              </div>

              {/* Google OAuth Button */}
              <div className="mb-8">
                <button
                  onClick={loginWithGoogle}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-6 py-3.5 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
                  aria-label="Sign in with Google"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing you in...</span>
                    </div>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-3"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                      <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </div>

              {/* Security Badge */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <ShieldCheckIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Secure OAuth Authentication
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      We never store your passwords. Authentication is handled
                      securely by Google.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Features (visible on small screens) */}
              <div className="lg:hidden space-y-4 mb-6">
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                  What you'll get access to:
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {features.slice(0, 2).map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <feature.icon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {feature.title}
                        </p>
                        <p className="text-xs text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms */}
              <div className="text-center">
                <p className="text-xs text-gray-500 leading-relaxed">
                  By continuing, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="font-medium text-blue-600 hover:text-blue-500 underline underline-offset-2"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-medium text-blue-600 hover:text-blue-500 underline underline-offset-2"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>

            {/* Additional Links */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Need help?{" "}
                <Link
                  href="/support"
                  className="font-medium text-blue-600 hover:text-blue-500 underline underline-offset-2"
                >
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
