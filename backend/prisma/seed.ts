/**
 * Database Seeder for AI Finance Dashboard
 * Populates database with realistic sample data
 *
 * Usage: npm run seed or pnpm prisma db seed
 *
 * @author Finance Dashboard Team
 * @version 1.0.0
 */

import {
  PrismaClient,
  TransactionCategory,
  TransactionType,
} from "@prisma/client";
import bcrypt from "bcryptjs";

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

    console.log("👤 Creating sample users...");

    // Create demo user with hashed password
    const hashedPassword = await bcrypt.hash("demo123456", 12);

    const user = await prisma.user.create({
      data: {
        email: "demo@aifinance.com",
        firstName: "Alex",
        lastName: "Johnson",
        password: hashedPassword,
      },
    });

    console.log("✅ Sample user created");

    console.log("🏦 Creating sample accounts...");

    const checkingAccount = await prisma.account.create({
      data: {
        name: "Primary Checking",
        type: "CHECKING",
        balance: 2500.75,
        currency: "USD",
        userId: user.id,
      },
    });

    const savingsAccount = await prisma.account.create({
      data: {
        name: "Emergency Savings",
        type: "SAVINGS",
        balance: 15000.0,
        currency: "USD",
        userId: user.id,
      },
    });

    const creditAccount = await prisma.account.create({
      data: {
        name: "Travel Credit Card",
        type: "CREDIT_CARD",
        balance: -1250.3,
        currency: "USD",
        userId: user.id,
      },
    });

    console.log("✅ Sample accounts created");

    console.log("💳 Creating sample transactions...");

    // Generate realistic transactions over the past 3 months
    const transactions = [];
    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);

    // Income transactions
    const incomeTransactions = [
      {
        description: "Salary - Tech Corp",
        amount: 5500,
        category: "SALARY" as TransactionCategory,
        date: new Date(2024, 8, 1),
      },
      {
        description: "Salary - Tech Corp",
        amount: 5500,
        category: "SALARY",
        date: new Date(2024, 7, 1),
      },
      {
        description: "Salary - Tech Corp",
        amount: 5500,
        category: "SALARY",
        date: new Date(2024, 6, 1),
      },
      {
        description: "Freelance Project",
        amount: 1200,
        category: "FREELANCE",
        date: new Date(2024, 8, 15),
      },
      {
        description: "Investment Dividend",
        amount: 85.5,
        category: "DIVIDEND_INCOME",
        date: new Date(2024, 8, 10),
      },
    ];

    // Expense transactions
    const expenseTransactions = [
      {
        description: "Whole Foods Market",
        amount: -125.4,
        category: "FOOD_DINING",
        date: new Date(2024, 8, 20),
      },
      {
        description: "Shell Gas Station",
        amount: -65.2,
        category: "TRANSPORTATION",
        date: new Date(2024, 8, 18),
      },
      {
        description: "Amazon Purchase",
        amount: -89.99,
        category: "SHOPPING",
        date: new Date(2024, 8, 15),
      },
      {
        description: "Netflix Subscription",
        amount: -15.99,
        category: "ENTERTAINMENT",
        date: new Date(2024, 8, 12),
      },
      {
        description: "Electric Bill",
        amount: -145.6,
        category: "BILLS_UTILITIES",
        date: new Date(2024, 8, 5),
      },
      {
        description: "Starbucks Coffee",
        amount: -8.75,
        category: "FOOD_DINING",
        date: new Date(2024, 8, 22),
      },
      {
        description: "Uber Ride",
        amount: -18.5,
        category: "TRANSPORTATION",
        date: new Date(2024, 8, 19),
      },
      {
        description: "Doctor Visit",
        amount: -200.0,
        category: "HEALTHCARE",
        date: new Date(2024, 8, 14),
      },
      {
        description: "Gym Membership",
        amount: -49.99,
        category: "PERSONAL_CARE",
        date: new Date(2024, 8, 1),
      },
      {
        description: "Restaurant Dinner",
        amount: -85.3,
        category: "FOOD_DINING",
        date: new Date(2024, 7, 28),
      },
      {
        description: "Target Shopping",
        amount: -67.45,
        category: "SHOPPING",
        date: new Date(2024, 7, 25),
      },
      {
        description: "Internet Service",
        amount: -79.99,
        category: "BILLS_UTILITIES",
        date: new Date(2024, 7, 15),
      },
      {
        description: "Movie Theater",
        amount: -24.5,
        category: "ENTERTAINMENT",
        date: new Date(2024, 7, 20),
      },
      {
        description: "Pharmacy",
        amount: -32.8,
        category: "HEALTHCARE",
        date: new Date(2024, 7, 12),
      },
      {
        description: "Book Purchase",
        amount: -19.99,
        category: "EDUCATION",
        date: new Date(2024, 7, 8),
      },
    ];

    // Combine all transactions
    const allTransactions = [
      ...incomeTransactions.map((t) => ({
        ...t,
        type: TransactionType.INCOME,
        accountId: checkingAccount.id,
        category: t.category as TransactionCategory,
      })),
      ...expenseTransactions.map((t) => ({
        ...t,
        type: TransactionType.EXPENSE,
        accountId: checkingAccount.id,
        category: t.category as TransactionCategory,
      })),
    ];

    // Add some credit card transactions
    const creditTransactions = [
      {
        description: "Flight Booking",
        amount: -450.0,
        category: "TRAVEL" as TransactionCategory,
        type: TransactionType.EXPENSE,
        date: new Date(2024, 8, 10),
        accountId: creditAccount.id,
      },
      {
        description: "Hotel Stay",
        amount: -320.75,
        category: "TRAVEL" as TransactionCategory,
        type: TransactionType.EXPENSE,
        date: new Date(2024, 8, 12),
        accountId: creditAccount.id,
      },
      {
        description: "Restaurant",
        amount: -95.6,
        category: "FOOD_DINING" as TransactionCategory,
        type: TransactionType.EXPENSE,
        date: new Date(2024, 8, 13),
        accountId: creditAccount.id,
      },
    ];

    allTransactions.push(...creditTransactions);

    // Create all transactions
    await prisma.transaction.createMany({
      data: allTransactions.map((t) => ({
        ...t,
        userId: user.id,
      })),
    });

    console.log("✅ Sample transactions created");

    console.log("💰 Creating sample budgets...");

    await prisma.budget.createMany({
      data: [
        {
          name: "Monthly Food Budget",
          category: "FOOD_DINING",
          limit: 400.0,
          spent: 219.45,
          period: "MONTHLY",
          startDate: new Date(2024, 8, 1),
          endDate: new Date(2024, 8, 30),
          userId: user.id,
        },
        {
          name: "Entertainment Budget",
          category: "ENTERTAINMENT",
          limit: 150.0,
          spent: 40.49,
          period: "MONTHLY",
          startDate: new Date(2024, 8, 1),
          endDate: new Date(2024, 8, 30),
          userId: user.id,
        },
        {
          name: "Transportation Budget",
          category: "TRANSPORTATION",
          limit: 250.0,
          spent: 83.7,
          period: "MONTHLY",
          startDate: new Date(2024, 8, 1),
          endDate: new Date(2024, 8, 30),
          userId: user.id,
        },
      ],
    });

    console.log("✅ Sample budgets created");

    console.log("📈 Creating sample investments...");

    await prisma.investment.createMany({
      data: [
        {
          symbol: "AAPL",
          name: "Apple Inc.",
          quantity: 10.0,
          purchasePrice: 150.0,
          currentPrice: 175.2,
          purchaseDate: new Date(2024, 5, 15),
          userId: user.id,
          type: "OTHER",
        },
        {
          symbol: "GOOGL",
          name: "Alphabet Inc.",
          quantity: 5.0,
          purchasePrice: 2500.0,
          currentPrice: 2650.75,
          purchaseDate: new Date(2024, 4, 20),
          userId: user.id,
          type: "OTHER",
        },
        {
          symbol: "SPY",
          name: "SPDR S&P 500 ETF",
          quantity: 25.0,
          purchasePrice: 400.0,
          currentPrice: 435.8,
          purchaseDate: new Date(2024, 3, 10),
          userId: user.id,
          type: "OTHER",
        },
      ],
    });

    console.log("✅ Sample investments created");

    console.log("🎯 Creating sample AI insights...");

    await prisma.aIInsight.createMany({
      data: [
        {
          id: `ai-insight-${Date.now()}-1`,
          title: "💡 Optimize Your Food Spending",
          content:
            "Based on your recent transactions, you're spending about $219 on food and dining this month, which is well within your $400 budget. However, you could save an additional $50-70 monthly by cooking more meals at home. Consider meal prep on weekends to reduce dining out frequency.",
          type: "SPENDING_PATTERN",
          confidence: 0.85,
          userId: user.id,
        },
        {
          id: `ai-insight-${Date.now()}-2`,
          title: "📊 Great Budget Management!",
          content:
            "Excellent news! You're tracking well across all your budget categories this month. Your entertainment spending is only 27% of your allocated budget, and transportation costs are reasonable at $84. Keep up this disciplined approach to reach your savings goals.",
          type: "BUDGET_RECOMMENDATION",
          confidence: 0.92,
          userId: user.id,
        },
        {
          id: `ai-insight-${Date.now()}-3`,
          title: "💰 Investment Performance Update",
          content:
            "Your investment portfolio is performing well with an overall gain of approximately $1,600. Apple (AAPL) is up 16.8% and your SPY holdings show steady growth. Consider rebalancing if tech positions exceed 30% of your total portfolio.",
          type: "INVESTMENT_ADVICE",
          confidence: 0.78,
          userId: user.id,
        },
      ],
    });

    console.log("✅ Sample AI insights created");

    console.log("🎉 Database seeding completed successfully!");
    console.log("");
    console.log("📊 Summary:");
    console.log("👤 Users: 1");
    console.log("🏦 Accounts: 3");
    console.log("💳 Transactions: " + allTransactions.length);
    console.log("💰 Budgets: 3");
    console.log("📈 Investments: 3");
    console.log("🤖 AI Insights: 3");
    console.log("");
    console.log("🔐 Demo Login Credentials:");
    console.log("Email: demo@aifinance.com");
    console.log("Password: demo123456");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
