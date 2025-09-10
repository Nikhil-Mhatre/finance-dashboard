#!/usr/bin/env bash
# AI Finance Dashboard - Build Script
set -o errexit

echo "🏗️ Starting AI Finance Dashboard build..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
pnpm install --frozen-lockfile

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
pnpm prisma generate

# Build backend
echo "🔧 Building backend..."
pnpm build

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
pnpm install --frozen-lockfile

# Build frontend with linting disabled
echo "🎨 Building frontend..."
SKIP_LINT=true pnpm build

echo "✅ Build completed successfully!"
