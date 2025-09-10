#!/usr/bin/env bash
# AI Finance Dashboard - Start Script
set -o errexit

echo "🚀 Starting AI Finance Dashboard..."

# Run database migrations
echo "🗄️ Running database migrations..."
cd backend
pnpm prisma migrate deploy

# Start the backend server
echo "▶️ Starting backend server..."
pnpm start
