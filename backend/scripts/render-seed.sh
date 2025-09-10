#!/bin/bash
set -e

echo "🌱 Starting database seeding for production..."

# Run database migrations first
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# Run the seeder
echo "🌱 Seeding database with sample data..."
npx tsx prisma/seed.ts

echo "✅ Database seeding completed!"
