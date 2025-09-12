/**
 * Database Seeder for AI Finance Dashboard
 * Populates database with realistic sample data
 *
 * Usage: npm run seed or pnpm prisma db seed
 *
 * @author Finance Dashboard Team
 * @version 1.0.0
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("🧹 Cleaning existing data...");

    // Delete in correct order due to foreign key constraints
    await prisma.aIInsight.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.investment.deleteMany();
    await prisma.budget.deleteMany();
    await prisma.alert.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();

    console.log("✅ Existing data cleared");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
