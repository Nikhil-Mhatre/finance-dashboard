#!/bin/bash
set -e

echo "🚀 Starting application..."

# Run database migrations
echo "🗄️ Running database migrations..."
cd backend
npx prisma migrate deploy

# Start the application
echo "▶️ Starting server..."
npm start
