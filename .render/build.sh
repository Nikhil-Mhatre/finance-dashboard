#!/bin/bash
set -e

echo "🏗️ Starting Render build process..."

# Backend build
if [ -d "backend" ]; then
  echo "📦 Building backend..."
  cd backend
  npm install
  npx prisma generate
  npm run build
  cd ..
fi

# Frontend build
if [ -d "frontend" ]; then
  echo "🎨 Building frontend..."
  cd frontend
  npm install
  npm run build:production
  cd ..
fi

echo "✅ Build completed successfully!"
