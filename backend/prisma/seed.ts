// prisma/seed.ts — Improved seeding with Google OAuth support

/**
 * Database Seeder for AI Finance Dashboard
 * Populates database with realistic sample data for both OAuth and credentials users.
 *
 * Usage:
 *  - pnpm prisma db seed   (if configured in package.json)
 *  - pnpm run seed         (custom script calling tsx prisma/seed.ts)
 */

import {
  PrismaClient,
  TransactionCategory,
  TransactionType,
  AccountType,
  BudgetPeriod,
  InvestmentType,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const MyUser = {
  email: "nikhilmhatre0317@gmail.com",
  firstName: "Nikhil",
  lastName: "Mhatre",
  googleId: "102649189699883195916",
  avatar:
    "https://lh3.googleusercontent.com/a/ACg8ocJHZz4j5GkDlqAHkUeUVdD_teSIt4wrLBN5HTfUO7TuAExvlqY=s96-c",
};

async function main() {
  try {
    console.log("👤 Creating demo users...");

    // 2) OAuth-based user (googleId, no password)
    const oauthUser = await prisma.user.upsert({
      where: { email: MyUser.email },
      update: {},
      create: {
        email: MyUser.email,
        firstName: MyUser.firstName,
        lastName: MyUser.lastName,
        googleId: MyUser.googleId,
        avatar: MyUser.avatar,
        // password: null // Prisma optional, omit entirely
      },
    });

    console.log("✅ Demo users created");

    // Helper function to seed a user’s financial data
    async function seedUserFinancials(userId: string, variant: "A" | "B") {
      console.log(`🏦 Creating accounts for user ${userId}...`);
      const checking = await prisma.account.create({
        data: {
          name: variant === "A" ? "Primary Checking" : "Everyday Checking",
          type: "CHECKING" as AccountType,
          balance: variant === "A" ? 2500.75 : 3200.25,
          currency: "USD",
          userId,
        },
      });

      const savings = await prisma.account.create({
        data: {
          name: variant === "A" ? "Emergency Savings" : "Goals Savings",
          type: "SAVINGS" as AccountType,
          balance: variant === "A" ? 15000.0 : 9800.5,
          currency: "USD",
          userId,
        },
      });

      const credit = await prisma.account.create({
        data: {
          name: variant === "A" ? "Travel Credit Card" : "Rewards Credit Card",
          type: "CREDIT_CARD" as AccountType,
          balance: variant === "A" ? -1250.3 : -620.8,
          currency: "USD",
          userId,
        },
      });

      console.log("✅ Accounts created");

      console.log("💳 Creating transactions...");
      const now = new Date();
      const ym = (y: number, m: number, d: number) => new Date(y, m, d);

      // Income for 3 months
      const baseYear = now.getFullYear();
      const thisMonth = now.getMonth();

      const income = [
        {
          description: "Salary - Tech Corp",
          amount: 5500,
          category: "SALARY" as TransactionCategory,
          date: ym(baseYear, thisMonth, 1),
          type: "INCOME" as TransactionType,
          accountId: checking.id,
        },
        {
          description: "Salary - Tech Corp",
          amount: 5500,
          category: "SALARY" as TransactionCategory,
          date: ym(baseYear, thisMonth - 1, 1),
          type: "INCOME" as TransactionType,
          accountId: checking.id,
        },
        {
          description: "Salary - Tech Corp",
          amount: 5500,
          category: "SALARY" as TransactionCategory,
          date: ym(baseYear, thisMonth - 2, 1),
          type: "INCOME" as TransactionType,
          accountId: checking.id,
        },
        {
          description: "Freelance Project",
          amount: variant === "A" ? 1200 : 850,
          category: "FREELANCE" as TransactionCategory,
          date: ym(baseYear, thisMonth, 15),
          type: "INCOME" as TransactionType,
          accountId: checking.id,
        },
        {
          description: "Investment Dividend",
          amount: 85.5,
          category: "DIVIDEND_INCOME" as TransactionCategory,
          date: ym(baseYear, thisMonth, 10),
          type: "INCOME" as TransactionType,
          accountId: savings.id,
        },
      ];

      const expenses = [
        {
          description: "Whole Foods Market",
          amount: -125.4,
          category: "FOOD_DINING" as TransactionCategory,
          date: ym(baseYear, thisMonth, 20),
          type: "EXPENSE" as TransactionType,
          accountId: checking.id,
        },
        {
          description: "Shell Gas Station",
          amount: -65.2,
          category: "TRANSPORTATION" as TransactionCategory,
          date: ym(baseYear, thisMonth, 18),
          type: "EXPENSE" as TransactionType,
          accountId: checking.id,
        },
        {
          description: "Amazon Purchase",
          amount: -89.99,
          category: "SHOPPING" as TransactionCategory,
          date: ym(baseYear, thisMonth, 15),
          type: "EXPENSE" as TransactionType,
          accountId: checking.id,
        },
        {
          description: "Netflix Subscription",
          amount: -15.99,
          category: "ENTERTAINMENT" as TransactionCategory,
          date: ym(baseYear, thisMonth, 12),
          type: "EXPENSE" as TransactionType,
          accountId: checking.id,
        },
        {
          description: "Electric Bill",
          amount: -145.6,
          category: "BILLS_UTILITIES" as TransactionCategory,
          date: ym(baseYear, thisMonth, 5),
          type: "EXPENSE" as TransactionType,
          accountId: checking.id,
        },
        {
          description: "Doctor Visit",
          amount: -200.0,
          category: "HEALTHCARE" as TransactionCategory,
          date: ym(baseYear, thisMonth, 14),
          type: "EXPENSE" as TransactionType,
          accountId: checking.id,
        },
        {
          description: "Gym Membership",
          amount: -49.99,
          category: "PERSONAL_CARE" as TransactionCategory,
          date: ym(baseYear, thisMonth, 1),
          type: "EXPENSE" as TransactionType,
          accountId: checking.id,
        },
        // Prior month examples
        {
          description: "Restaurant Dinner",
          amount: -85.3,
          category: "FOOD_DINING" as TransactionCategory,
          date: ym(baseYear, thisMonth - 1, 28),
          type: "EXPENSE" as TransactionType,
          accountId: checking.id,
        },
        {
          description: "Internet Service",
          amount: -79.99,
          category: "BILLS_UTILITIES" as TransactionCategory,
          date: ym(baseYear, thisMonth - 1, 15),
          type: "EXPENSE" as TransactionType,
          accountId: checking.id,
        },
      ];

      // Credit card travel expenses
      const creditTx = [
        {
          description: "Flight Booking",
          amount: -450.0,
          category: "TRAVEL" as TransactionCategory,
          date: ym(baseYear, thisMonth, 10),
          type: "EXPENSE" as TransactionType,
          accountId: credit.id,
        },
        {
          description: "Hotel Stay",
          amount: -320.75,
          category: "TRAVEL" as TransactionCategory,
          date: ym(baseYear, thisMonth, 12),
          type: "EXPENSE" as TransactionType,
          accountId: credit.id,
        },
        {
          description: "Restaurant",
          amount: -95.6,
          category: "FOOD_DINING" as TransactionCategory,
          date: ym(baseYear, thisMonth, 13),
          type: "EXPENSE" as TransactionType,
          accountId: credit.id,
        },
      ];

      const allTx = [...income, ...expenses, ...creditTx].map((t) => ({
        ...t,
        userId,
      }));

      await prisma.transaction.createMany({ data: allTx });
      console.log(`✅ ${allTx.length} transactions created`);

      console.log("💰 Creating budgets...");
      await prisma.budget.createMany({
        data: [
          {
            name: "Monthly Food Budget",
            category: "FOOD_DINING",
            limit: 400.0,
            spent: 219.45,
            period: "MONTHLY" as BudgetPeriod,
            startDate: ym(baseYear, thisMonth, 1),
            endDate: ym(baseYear, thisMonth, 28),
            userId,
            isActive: true,
          },
          {
            name: "Entertainment Budget",
            category: "ENTERTAINMENT",
            limit: 150.0,
            spent: 40.49,
            period: "MONTHLY" as BudgetPeriod,
            startDate: ym(baseYear, thisMonth, 1),
            endDate: ym(baseYear, thisMonth, 28),
            userId,
            isActive: true,
          },
          {
            name: "Transportation Budget",
            category: "TRANSPORTATION",
            limit: 250.0,
            spent: 83.7,
            period: "MONTHLY" as BudgetPeriod,
            startDate: ym(baseYear, thisMonth, 1),
            endDate: ym(baseYear, thisMonth, 28),
            userId,
            isActive: true,
          },
        ],
      });
      console.log("✅ Budgets created");

      console.log("📈 Creating investments...");
      await prisma.investment.createMany({
        data: [
          {
            symbol: "AAPL",
            name: "Apple Inc.",
            quantity: 10.0,
            purchasePrice: 150.0,
            currentPrice: 175.2,
            purchaseDate: ym(baseYear, thisMonth - 3, 15),
            userId,
            type: "STOCK" as InvestmentType,
          },
          {
            symbol: "GOOGL",
            name: "Alphabet Inc.",
            quantity: 5.0,
            purchasePrice: 2500.0,
            currentPrice: 2650.75,
            purchaseDate: ym(baseYear, thisMonth - 4, 20),
            userId,
            type: "STOCK" as InvestmentType,
          },
          {
            symbol: "SPY",
            name: "SPDR S&P 500 ETF",
            quantity: 25.0,
            purchasePrice: 400.0,
            currentPrice: 435.8,
            purchaseDate: ym(baseYear, thisMonth - 5, 10),
            userId,
            type: "ETF" as InvestmentType,
          },
        ],
      });
      console.log("✅ Investments created");

      console.log("🤖 Creating AI insights...");
      await prisma.aIInsight.createMany({
        data: [
          {
            id: `ai-insight-${Date.now()}-${variant}-1`,
            title: "💡 Optimize Your Food Spending",
            content:
              "Based on recent transactions, food and dining remain within your budget, but you could save an additional $50–$70 by cooking at home twice a week. Try batch cooking and tracking groceries to curb impulsive dining.",
            type: "SPENDING_PATTERN",
            confidence: 0.86,
            userId,
            isRelevant: true,
          },
          {
            id: `ai-insight-${Date.now()}-${variant}-2`,
            title: "📊 Budget Health Check",
            content:
              "You're tracking well across most budgets. Entertainment is only 27% utilized, transportation is trending stable, and utilities look predictable. Consider reallocating unused funds to savings to accelerate goals.",
            type: "BUDGET_RECOMMENDATION",
            confidence: 0.91,
            userId,
            isRelevant: true,
          },
          {
            id: `ai-insight-${Date.now()}-${variant}-3`,
            title: "💰 Investment Performance Update",
            content:
              "Your portfolio shows an estimated gain this quarter. AAPL and SPY lead performance. Consider rebalancing if any single sector exceeds 30% exposure to maintain risk-adjusted returns.",
            type: "INVESTMENT_ADVICE",
            confidence: 0.8,
            userId,
            isRelevant: true,
          },
        ],
      });
      console.log("✅ AI insights created");
    }

    // Seed financials for both users
    await seedUserFinancials(oauthUser.id, "B");

    console.log("\n🎉 Seeding completed successfully!");
    console.log("📊 Summary (approximate):");
    const [users, accounts, transactions, budgets, investments, insights] =
      await Promise.all([
        prisma.user.count(),
        prisma.account.count(),
        prisma.transaction.count(),
        prisma.budget.count(),
        prisma.investment.count(),
        prisma.aIInsight.count(),
      ]);
    console.log(`👤 Users: ${users}`);
    console.log(`🏦 Accounts: ${accounts}`);
    console.log(`💳 Transactions: ${transactions}`);
    console.log(`💰 Budgets: ${budgets}`);
    console.log(`📈 Investments: ${investments}`);
    console.log(`🤖 AI Insights: ${insights}`);

    console.log(
      "\n🔐 OAuth Demo User (sign in with Google using this email if possible):"
    );
    console.log(`Email: ${MyUser.email} (linked via googleId)`);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
