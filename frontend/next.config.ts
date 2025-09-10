/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable linting during build if SKIP_LINT is set
  eslint: {
    ignoreDuringBuilds: process.env.SKIP_LINT === "true",
  },

  // TypeScript config
  typescript: {
    // Only fail build on type errors in development
    ignoreBuildErrors: process.env.NODE_ENV === "production",
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
    NEXT_PUBLIC_APP_NAME:
      process.env.NEXT_PUBLIC_APP_NAME || "AI Finance Dashboard",
  },

  // Performance optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,

  // Output config for production
  output: "standalone",

  // Image optimization
  images: {
    domains: ["localhost"],
    formats: ["image/webp", "image/avif"],
  },

  // Headers for security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
