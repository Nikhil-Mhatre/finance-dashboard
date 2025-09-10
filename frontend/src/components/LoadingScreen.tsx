/**
 * Loading Screen Component
 * Shows during authentication state initialization
 *
 * @author Finance Dashboard Team
 * @version 1.0.0
 */

"use client";

import React, { JSX } from "react";

/**
 * Loading Screen Component
 *
 * @returns {JSX.Element} Loading screen with spinner
 */
export default function LoadingScreen(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">AI</span>
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <div
            className="absolute inset-0 rounded-full h-12 w-12 border-t-2 border-purple-600 mx-auto animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
        </div>

        {/* Loading Text */}
        <p className="mt-6 text-lg font-medium text-gray-700">
          Loading your AI Finance Dashboard
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Please wait while we authenticate your session...
        </p>

        {/* Loading Progress Dots */}
        <div className="mt-6 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <div
            className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
